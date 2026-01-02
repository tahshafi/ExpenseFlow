import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';

export const checkBudgetExceeded = async (userId, category, month, year) => {
  try {
    const budget = await Budget.findOne({
      userId,
      category,
      month,
      year
    });

    if (!budget) return;

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
    
    const expenses = await Expense.find({
      userId,
      category,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    if (totalSpent > budget.amount) {
      // Check for existing unread warning notification for this category/month to avoid spam
      const existingNotification = await Notification.findOne({
        userId,
        type: 'warning',
        title: 'Budget Exceeded',
        message: { $regex: `${category}.*${month + 1}/${year}` },
        isRead: false
      });

      if (!existingNotification) {
        await Notification.create({
          userId,
          title: 'Budget Exceeded',
          message: `You have exceeded your ${category} budget for ${month + 1}/${year}. Budget: ${budget.amount}, Spent: ${totalSpent}`,
          type: 'warning'
        });
      }
    } else if (totalSpent > budget.amount * 0.9) {
      // Check for existing unread info notification
      const existingNotification = await Notification.findOne({
        userId,
        type: 'info',
        title: 'Budget Alert',
        message: { $regex: `${category}.*${month + 1}/${year}` },
        isRead: false
      });

      if (!existingNotification) {
        await Notification.create({
          userId,
          title: 'Budget Alert',
          message: `You are close to your ${category} budget for ${month + 1}/${year}. Budget: ${budget.amount}, Spent: ${totalSpent}`,
          type: 'info'
        });
      }
    }
  } catch (error) {
    console.error('Error checking budget:', error);
  }
};
