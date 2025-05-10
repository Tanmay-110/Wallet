const express = require('express');
const { 
  sendMoney, 
  requestMoney, 
  respondToRequest,
  getTransactions,
  findUsers
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const {
  sendMoneySchema,
  requestMoneySchema,
  respondToRequestSchema,
  getTransactionsSchema,
  findUsersSchema
} = require('../validators/transactionValidators');

const router = express.Router();

// Protect all transaction routes
router.use(protect);

// Send money to another user
router.post('/send', validate(sendMoneySchema), sendMoney);

// Request money from another user
router.post('/request', validate(requestMoneySchema), requestMoney);

// Respond to a money request (accept/reject)
router.put('/:id/respond', validate(respondToRequestSchema), respondToRequest);

// Get all transactions for the logged-in user
router.get('/', validate(getTransactionsSchema), getTransactions);

// Find users for sending/requesting money
router.get('/users', validate(findUsersSchema), findUsers);

module.exports = router; 