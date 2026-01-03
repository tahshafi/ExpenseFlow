import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import { checkBudgetExceeded } from '../utils/budgetUtils.js';

// @desc    Get budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });

    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
      const startOfMonth = new Date(budget.year, budget.month, 1);
      const endOfMonth = new Date(budget.year, budget.month + 1, 0, 23, 59, 59, 999);

      const expenses = await Expense.find({
        userId: req.user.id,
        category: budget.category,
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      });

      const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      const b = budget.toObject();
      return {
        ...b,
        id: b._id,
        spent
      };
    }));

    res.status(200).json(budgetsWithSpent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add or Update budget
// @route   POST /api/budgets
// @access  Private
export const addOrUpdateBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    // Check if budget exists for this category/month/year
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      category,
      month,
      year,
    });

    // Calculate spent for consistency
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const expenses = await Expense.find({
      userId: req.user.id,
      category,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);

    if (existingBudget) {
      existingBudget.amount = amount;
      const updatedBudget = await existingBudget.save();

      // Check if updated budget is exceeded
      await checkBudgetExceeded(req.user.id, category, month, year);

      const b = updatedBudget.toObject();
      return res.status(200).json({ ...b, id: b._id, spent });
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount,
      month,
      year,
    });

    const b = budget.toObject();
    res.status(201).json({ ...b, id: b._id, spent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    const budgetId = req.params.id;

    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Check for duplicate if category/month/year changed
    if (category !== budget.category || month !== budget.month || year !== budget.year) {
      const duplicate = await Budget.findOne({
        userId: req.user.id,
        category,
        month,
        year,
        _id: { $ne: budgetId }
      });

      if (duplicate) {
        return res.status(400).json({ message: 'Budget for this category and month already exists' });
      }
    }

    budget.category = category || budget.category;
    budget.amount = amount || budget.amount;
    budget.month = month !== undefined ? month : budget.month;
    budget.year = year !== undefined ? year : budget.year;

    const updatedBudget = await budget.save();

    // Check if updated budget is exceeded
    await checkBudgetExceeded(req.user.id, updatedBudget.category, updatedBudget.month, updatedBudget.year);

    // Recalculate spent
    const startOfMonth = new Date(updatedBudget.year, updatedBudget.month, 1);
    const endOfMonth = new Date(updatedBudget.year, updatedBudget.month + 1, 0, 23, 59, 59, 999);
    const expenses = await Expense.find({
      userId: req.user.id,
      category: updatedBudget.category,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const b = updatedBudget.toObject();
    res.status(200).json({ ...b, id: b._id, spent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await budget.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
