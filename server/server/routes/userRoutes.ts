import { Router } from 'express';
import { getUserProfile } from '../controllers/userController';
import { authenticate } from '../utils/authMiddleware';

const router = Router();

router.get('/profile', authenticate, getUserProfile);

export default router;
