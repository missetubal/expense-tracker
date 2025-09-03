import express from 'express';
import {
  getUserInfo,
  loginUser,
  registerUser,
  uploadImage,
} from '../controllers/auth';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

export const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/user', protect, getUserInfo);
authRouter.post('/upload-image', upload.single('image'), uploadImage);
