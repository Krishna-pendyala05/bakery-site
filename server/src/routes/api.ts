import { Router } from 'express';
import { sendOtp, verifyOtp, getMe } from '../controllers/authController';
import { getCakes } from '../controllers/cakeController';
import { createOrder } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Authentication Routes
router.post('/auth/send-otp', sendOtp);
router.post('/auth/verify-otp', verifyOtp);
router.get('/auth/me', authenticateToken as any, getMe as any);

// Cakes Catalog Routes
router.get('/cakes', getCakes);

// Order Placement Routes (Protected)
router.post('/orders', authenticateToken as any, createOrder as any);

export default router;
