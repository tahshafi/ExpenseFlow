import Income from '../models/Income.js';

// @desc    Get income
// @route   GET /api/income
// @access  Private
export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add income
// @route   POST /api/income
// @access  Private
export const addIncome = async (req, res) => {
  try {
    const { amount, source, description, date, isRecurring, recurringFrequency } = req.body;

    const income = await Income.create({
      userId: req.user.id,
      amount,
      source,
      description,
      date,
      isRecurring,
      recurringFrequency,
    });

    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the income user
    if (income.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await income.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
