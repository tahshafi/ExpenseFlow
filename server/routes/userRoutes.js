import express from 'express';
import { uploadAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
