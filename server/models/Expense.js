import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'transport', 'entertainment', 'shopping', 'utilities', 'healthcare', 'education', 'travel', 'rent', 'subscriptions', 'other'],
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  isWorthy: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
