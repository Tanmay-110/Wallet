const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  type: {
    type: String,
    enum: ['SEND', 'REQUEST'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'REJECTED', 'FAILED'],
    default: function() {
      // If it's a direct send, mark as completed, if it's a request, mark as pending
      return this.type === 'SEND' ? 'COMPLETED' : 'PENDING';
    }
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 