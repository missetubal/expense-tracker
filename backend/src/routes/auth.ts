import express from 'express';
import { getUserInfo, loginUser, registerUser } from '../controllers/auth';
import { protect } from '../middleware/auth';

export const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/user', protect, getUserInfo);
