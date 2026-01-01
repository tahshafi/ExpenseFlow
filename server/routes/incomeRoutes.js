import express from 'express';
import {
  getIncome,
  addIncome,
  deleteIncome,
} from '../controllers/incomeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getIncome).post(protect, addIncome);
router.route('/:id').delete(protect, deleteIncome);

export default router;
