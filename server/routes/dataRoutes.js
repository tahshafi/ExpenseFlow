import express from 'express';
import { exportData, importData, exportDataPdf } from '../controllers/dataController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/export', protect, exportData);
router.get('/export-pdf', protect, exportDataPdf);
router.post('/import', protect, importData);

export default router;
