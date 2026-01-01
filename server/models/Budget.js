import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'transport', 'entertainment', 'shopping', 'utilities', 'healthcare', 'education', 'travel', 'rent', 'subscriptions', 'other'],
  },
  amount: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    default: 0,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
