import express from 'express';
import {
  getBudgets,
  addOrUpdateBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getBudgets).post(protect, addOrUpdateBudget);
router.route('/:id').delete(protect, deleteBudget).put(protect, updateBudget);

export default router;
