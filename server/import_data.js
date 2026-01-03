import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Expense from './models/Expense.js';
import Income from './models/Income.js';
import Budget from './models/Budget.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Get the first user
    const user = await User.findOne();
    if (!user) {
      console.log('No user found. Please register a user first.');
      process.exit(1);
    }
    const userId = user._id;
    console.log(`Importing data for user: ${user.email}`);

    // Read JSON file
    const dataPath = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Process and Insert Expenses
    if (data.expenses && data.expenses.length > 0) {
      const expenses = data.expenses.map(item => ({
        ...item,
        userId: userId,
        user: userId
      }));
      await Expense.insertMany(expenses);
      console.log(`${expenses.length} Expenses imported`);
    }

    // Process and Insert Incomes
    if (data.incomes && data.incomes.length > 0) {
      const incomes = data.incomes.map(item => ({
        ...item,
        userId: userId,
        user: userId
      }));
      await Income.insertMany(incomes);
      console.log(`${incomes.length} Incomes imported`);
    }

    // Process and Insert Budgets
    if (data.budgets && data.budgets.length > 0) {
      const budgets = data.budgets.map(item => ({
        ...item,
        userId: userId,
        user: userId,
        spent: 0 // Will be calculated by app logic or aggregation usually, but setting 0 for now
      }));
      
      // Upsert budgets to avoid duplicates for same category/month/year
      for (const budget of budgets) {
        await Budget.findOneAndUpdate(
          { 
            userId: userId, 
            category: budget.category, 
            month: budget.month, 
            year: budget.year 
          },
          budget,
          { upsert: true, new: true }
        );
      }
      console.log(`${budgets.length} Budgets processed`);
    }

    console.log('Data import completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
