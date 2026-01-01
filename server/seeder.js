import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from './models/User.js';
import Expense from './models/Expense.js';
import Income from './models/Income.js';
import Budget from './models/Budget.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Expense.deleteMany();
    await Income.deleteMany();
    await Budget.deleteMany();
    
    // Get the first user or create one if none exists
    let user = await User.findOne();
    if (!user) {
        console.log('No user found. Please register a user first.');
        process.exit(1);
    }

    const userId = user._id;
    console.log(`Seeding data for user: ${user.email}`);

    // Seed Expenses
    const expenses = [];
    const expenseCategories = ['food', 'transport', 'entertainment', 'shopping', 'utilities', 'healthcare', 'education', 'travel', 'rent', 'subscriptions'];
    
    for (let i = 0; i < 50; i++) {
      expenses.push({
        user: userId,
        userId: userId,
        amount: parseFloat(faker.finance.amount({ min: 10, max: 500, dec: 2 })),
        category: faker.helpers.arrayElement(expenseCategories),
        description: faker.commerce.productName(),
        date: faker.date.recent({ days: 90 }),
        isWorthy: faker.datatype.boolean(),
        notes: faker.lorem.sentence(),
        tags: faker.helpers.arrayElements(['essential', 'recurring', 'impulse', 'planned'], { min: 0, max: 2 }),
      });
    }
    await Expense.insertMany(expenses);
    console.log('Expenses seeded');

    // Seed Income
    const incomes = [];
    const incomeSources = ['Salary', 'Freelance', 'Dividends', 'Rental', 'Side Project', 'Bonus'];
    
    for (let i = 0; i < 15; i++) {
      incomes.push({
        user: userId,
        userId: userId,
        amount: parseFloat(faker.finance.amount({ min: 1000, max: 5000, dec: 2 })),
        source: faker.helpers.arrayElement(incomeSources),
        description: faker.finance.transactionDescription(),
        date: faker.date.recent({ days: 90 }),
        isRecurring: faker.datatype.boolean(),
        recurringFrequency: 'monthly',
      });
    }
    await Income.insertMany(incomes);
    console.log('Income seeded');

    // Seed Budgets
    const budgets = [];
    const budgetCategories = ['food', 'transport', 'entertainment', 'shopping', 'utilities', 'healthcare', 'subscriptions'];
    
    for (const category of budgetCategories) {
        const amount = parseFloat(faker.finance.amount({ min: 200, max: 1000, dec: 2 }));
        const spent = parseFloat(faker.finance.amount({ min: 0, max: amount, dec: 2 }));
        
        budgets.push({
            user: userId,
            userId: userId,
            category,
            amount,
            spent,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
        });
    }
    await Budget.insertMany(budgets);
    console.log('Budgets seeded');

    console.log('Data seeding completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
