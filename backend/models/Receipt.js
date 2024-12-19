const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  vendor: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit card', 'debit card', 'bank transfer', 'other']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  projectCode: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Add text index for search functionality
receiptSchema.index({
  employeeName: 'text',
  vendor: 'text',
  description: 'text',
  category: 'text'
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt; 