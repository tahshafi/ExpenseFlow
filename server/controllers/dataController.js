import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import Budget from '../models/Budget.js';
import PDFDocument from 'pdfkit-table';

// @desc    Export all user data
// @route   GET /api/data/export
// @access  Private
export const exportData = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const income = await Income.find({ userId: req.user.id });
    const budgets = await Budget.find({ userId: req.user.id });

    const data = {
      expenses,
      income,
      budgets,
      exportDate: new Date(),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=expense_tracker_data.json');
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Export user data as PDF
// @route   GET /api/data/export-pdf
// @access  Private
export const exportDataPdf = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    const income = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=expense_tracker_report.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Expense Tracker Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Expenses Table
    doc.fontSize(16).text('Expenses', { underline: true });
    doc.moveDown(0.5);

    const expenseTable = {
      title: "Expenses",
      headers: [ "Date", "Category", "Description", "Amount"],
      rows: expenses.map(e => [
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.description,
        `$${e.amount.toFixed(2)}`
      ]),
    };

    await doc.table(expenseTable, { 
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row, i, isLastRow, rectRow) => doc.font("Helvetica").fontSize(10),
      width: 500,
    });

    doc.addPage();

    // Income Table
    doc.fontSize(16).text('Income', { underline: true });
    doc.moveDown(0.5);

    const incomeTable = {
      title: "Income",
      headers: [ "Date", "Source", "Description", "Amount"],
      rows: income.map(i => [
        new Date(i.date).toLocaleDateString(),
        i.source,
        i.description,
        `$${i.amount.toFixed(2)}`
      ]),
    };

    await doc.table(incomeTable, { 
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row, i, isLastRow, rectRow) => doc.font("Helvetica").fontSize(10),
      width: 500,
    });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Import user data
// @route   POST /api/data/import
// @access  Private
export const importData = async (req, res) => {
  try {
    const { expenses, income, budgets } = req.body;

    if (!expenses && !income && !budgets) {
      return res.status(400).json({ message: 'No data provided to import' });
    }

    // Process Expenses
    if (expenses && Array.isArray(expenses)) {
      const expensesToInsert = expenses.map(e => ({
        ...e,
        userId: req.user.id,
        _id: undefined, // Create new IDs
        __v: undefined
      }));
      if (expensesToInsert.length > 0) await Expense.insertMany(expensesToInsert);
    }

    // Process Income
    if (income && Array.isArray(income)) {
      const incomeToInsert = income.map(i => ({
        ...i,
        userId: req.user.id,
        _id: undefined,
        __v: undefined
      }));
      if (incomeToInsert.length > 0) await Income.insertMany(incomeToInsert);
    }

    // Process Budgets
    if (budgets && Array.isArray(budgets)) {
        // We need to be careful with budgets to avoid duplicates if possible, 
        // but for now, let's just insert them. The user can clean up or we can add complex logic later.
        // Actually, let's try to skip exact duplicates (Category + Month + Year)
        for (const b of budgets) {
             const exists = await Budget.findOne({
                 userId: req.user.id,
                 category: b.category,
                 month: b.month,
                 year: b.year
             });
             if (!exists) {
                 await Budget.create({
                     ...b,
                     userId: req.user.id,
                     _id: undefined,
                     __v: undefined
                 });
             }
        }
    }

    res.status(200).json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
