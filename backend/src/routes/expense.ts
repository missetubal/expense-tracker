import express from 'express';
import { protect } from '../middleware/auth';
import {
  addExpense,
  deleteExpense,
  downloadExpenseExcel,
  getAllExpenses,
} from '../controllers/expense';

export const expenseRouter = express.Router();

expenseRouter.post('/add', protect, addExpense);
expenseRouter.get('/get', protect, getAllExpenses);
expenseRouter.get('/download-excel', protect, downloadExpenseExcel);
expenseRouter.delete('/:id', protect, deleteExpense);
