const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc    Send money to another user
// @route   POST /api/transactions/send
// @access  Private
const sendMoney = async (req, res) => {
  try {
    const { receiverId, amount, description } = req.body;
    const senderId = req.user._id;

    // Parse amount to ensure it's a number - this is now handled by Zod validation
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if sender and receiver are the same
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json(
        errorResponse('You cannot send money to yourself')
      );
    }

    // Find sender and receiver
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json(
        errorResponse('Receiver not found')
      );
    }

    // Check if sender has enough balance
    if (sender.walletBalance < parsedAmount) {
      return res.status(400).json(
        errorResponse('Insufficient balance')
      );
    }

    // Update sender balance
    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      { $inc: { walletBalance: -parsedAmount } },
      { new: true }
    );

    // Update receiver balance
    await User.findByIdAndUpdate(
      receiverId,
      { $inc: { walletBalance: parsedAmount } },
      { new: true }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      sender: senderId,
      receiver: receiverId,
      amount: parsedAmount,
      type: 'SEND',
      status: 'COMPLETED',
      description: description || 'Money Transfer'
    });

    res.status(201).json(
      successResponse('Money sent successfully', {
        transaction,
        senderBalance: updatedSender.walletBalance
      })
    );
  } catch (error) {
    console.error('Error in sendMoney:', error.message, error.stack);
    
    // Provide more specific error messages based on the error type
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json(
        errorResponse('Database connection error. Please try again later.', [{ message: 'Could not connect to database' }])
      );
    }
    
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

// @desc    Request money from another user
// @route   POST /api/transactions/request
// @access  Private
const requestMoney = async (req, res) => {
  try {
    const { payerId, amount, description } = req.body;
    const requesterId = req.user._id;

    // Parse amount - now handled by Zod validation
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if requester and payer are the same
    if (requesterId.toString() === payerId.toString()) {
      return res.status(400).json(
        errorResponse('You cannot request money from yourself')
      );
    }

    // Check if payer exists
    const payer = await User.findById(payerId);
    if (!payer) {
      return res.status(404).json(
        errorResponse('Payer not found')
      );
    }

    // Create transaction record for the request
    const transaction = await Transaction.create({
      sender: payerId, // The person who will send money (payer)
      receiver: requesterId, // The person requesting money
      amount: parsedAmount,
      type: 'REQUEST',
      status: 'PENDING',
      description: description || 'Money Request'
    });

    res.status(201).json(
      successResponse('Money request sent successfully', { transaction })
    );
  } catch (error) {
    console.error('Error in requestMoney:', error.message, error.stack);
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

// @desc    Respond to a money request (accept or reject)
// @route   PUT /api/transactions/:id/respond
// @access  Private
const respondToRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'ACCEPT' or 'REJECT'
    const transactionId = req.params.id;
    const userId = req.user._id;
    
    // Find the transaction
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json(
        errorResponse('Transaction not found')
      );
    }

    // Check if the user is the sender (payer) of the request
    if (transaction.sender.toString() !== userId.toString()) {
      return res.status(403).json(
        errorResponse('You are not authorized to respond to this request')
      );
    }

    // Check if the transaction is a request and is pending
    if (transaction.type !== 'REQUEST' || transaction.status !== 'PENDING') {
      return res.status(400).json(
        errorResponse('This transaction cannot be responded to')
      );
    }

    // Process based on action
    if (action === 'ACCEPT') {
      // Find sender
      const sender = await User.findById(transaction.sender);
      
      // Check if sender has enough balance
      if (sender.walletBalance < transaction.amount) {
        return res.status(400).json(
          errorResponse('Insufficient balance')
        );
      }

      // Update sender balance
      const updatedSender = await User.findByIdAndUpdate(
        transaction.sender,
        { $inc: { walletBalance: -transaction.amount } },
        { new: true }
      );

      // Update receiver balance
      await User.findByIdAndUpdate(
        transaction.receiver,
        { $inc: { walletBalance: transaction.amount } },
        { new: true }
      );

      // Update transaction status
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        { status: 'COMPLETED' },
        { new: true }
      );

      res.status(200).json(
        successResponse('Request accepted and payment completed', {
          transaction: updatedTransaction,
          senderBalance: updatedSender.walletBalance
        })
      );
    } else if (action === 'REJECT') {
      // Update transaction status
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        { status: 'REJECTED' },
        { new: true }
      );

      res.status(200).json(
        successResponse('Request rejected', { transaction: updatedTransaction })
      );
    } else {
      return res.status(400).json(
        errorResponse('Invalid action. Use ACCEPT or REJECT')
      );
    }
  } catch (error) {
    console.error('Error in respondToRequest:', error.message, error.stack);
    
    // Provide more specific error messages based on the error type
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json(
        errorResponse('Database connection error. Please try again later.', [{ message: 'Could not connect to database' }])
      );
    }
    
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, status } = req.query;

    // Base query to find transactions where the user is either sender or receiver
    let query = {
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    };

    // Add filters if provided
    if (type) {
      query.type = type.toUpperCase();
    }
    if (status) {
      query.status = status.toUpperCase();
    }

    // Find transactions and populate sender and receiver info
    const transactions = await Transaction.find(query)
      .populate('sender', 'firstName lastName email')
      .populate('receiver', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json(
      successResponse('Transactions retrieved successfully', { transactions })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

// @desc    Find users for sending money or requesting 
// @route   GET /api/transactions/users
// @access  Private
const findUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const currentUserId = req.user._id;

    // If search term is provided, search by name or email
    let query = { _id: { $ne: currentUserId } }; // Exclude current user
    
    if (search) {
      query = {
        ...query,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Find users matching the criteria
    const users = await User.find(query)
      .select('firstName lastName email _id')
      .limit(10);

    res.status(200).json(
      successResponse('Users retrieved successfully', { users })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

module.exports = {
  sendMoney,
  requestMoney,
  respondToRequest,
  getTransactions,
  findUsers
}; 