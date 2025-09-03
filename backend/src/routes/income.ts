import express from 'express';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  addIncome,
  deleteIncome,
  downloadIncomeExcel,
  getAllIncomes,
} from '../controllers/income';

export const incomeRouter = express.Router();

incomeRouter.post('/add', protect, addIncome);
incomeRouter.get('/get', protect, getAllIncomes);
incomeRouter.get('/download-excel', protect, downloadIncomeExcel);
incomeRouter.delete('/:id', protect, deleteIncome);
