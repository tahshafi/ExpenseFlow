import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import Notification from '../models/Notification.js';

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
export const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date, notes, isWorthy, tags } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      description,
      date,
      notes,
      isWorthy,
      tags,
    });

    // Check Budget Exceeded
    const expenseDate = new Date(date);
    const month = expenseDate.getMonth();
    const year = expenseDate.getFullYear();

    const budget = await Budget.findOne({
      userId: req.user.id,
      category: category,
      month: month,
      year: year
    });

    if (budget) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
      
      const expenses = await Expense.find({
        userId: req.user.id,
        category: category,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });
      
      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

      if (totalSpent > budget.amount) {
        // Check if notification already exists for this month/category to avoid spamming? 
        // For now, let's just create it.
        await Notification.create({
          userId: req.user.id,
          title: 'Budget Exceeded',
          message: `You have exceeded your ${category} budget for ${month + 1}/${year}. Budget: ${budget.amount}, Spent: ${totalSpent}`,
          type: 'warning'
        });
      } else if (totalSpent > budget.amount * 0.9) {
         // Check if already notified about being close?
         // Simplification: just create.
         await Notification.create({
          userId: req.user.id,
          title: 'Budget Alert',
          message: `You are close to your ${category} budget for ${month + 1}/${year}. Budget: ${budget.amount}, Spent: ${totalSpent}`,
          type: 'info'
        });
      }
    }

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the expense user
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Check budget for the updated expense
    if (updatedExpense) {
      const date = new Date(updatedExpense.date);
      await checkBudgetExceeded(req.user.id, updatedExpense.category, date.getMonth(), date.getFullYear());
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the expense user
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
