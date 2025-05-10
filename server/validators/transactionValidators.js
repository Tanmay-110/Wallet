const { z } = require('zod');
const mongoose = require('mongoose');

// Helper for validating MongoDB ObjectId
const isValidObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return false;
  }
  return true;
};

// ObjectId validation
const objectIdSchema = z.string().refine(isValidObjectId, {
  message: 'Invalid ID format',
});

// Amount validation - handles both number and string inputs
const amountSchema = z.preprocess(
  (val) => (typeof val === 'string' ? parseFloat(val) : val),
  z.number()
    .positive({ message: 'Amount must be positive' })
    .min(0.01, { message: 'Amount must be greater than 0' })
    .finite({ message: 'Amount must be a valid number' })
);

// Send money validation schema
const sendMoneySchema = z.object({
  body: z.object({
    receiverId: objectIdSchema,
    amount: amountSchema,
    description: z.string().max(200).optional(),
  }),
});

// Request money validation schema
const requestMoneySchema = z.object({
  body: z.object({
    payerId: objectIdSchema,
    amount: amountSchema,
    description: z.string().max(200).optional(),
  }),
});

// Respond to request validation schema
const respondToRequestSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    action: z.enum(['ACCEPT', 'REJECT'], { 
      errorMap: () => ({ message: 'Action must be either ACCEPT or REJECT' })
    }),
  }),
});

// Get transactions query validation schema
const getTransactionsSchema = z.object({
  query: z.object({
    type: z.enum(['SEND', 'REQUEST']).optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'REJECTED', 'FAILED']).optional(),
  }).optional(),
});

// Find users validation schema
const findUsersSchema = z.object({
  query: z.object({
    search: z.string().min(1).optional(),
  }).optional(),
});

module.exports = {
  sendMoneySchema,
  requestMoneySchema,
  respondToRequestSchema,
  getTransactionsSchema,
  findUsersSchema,
}; 