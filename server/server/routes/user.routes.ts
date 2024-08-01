import { Router } from 'express';
import { getUserProfile } from '../services/authRegister';
import { authenticate } from '../utils/authMiddleware';

const router = Router();

router.get('/profile', authenticate, getUserProfile);

export default router;
