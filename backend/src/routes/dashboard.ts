import express from 'express';
import { protect } from '../middleware/auth';
import { getDashboardData } from '../controllers/dashboard';

export const dashboardRouter = express.Router();

dashboardRouter.get('/', protect, getDashboardData);
