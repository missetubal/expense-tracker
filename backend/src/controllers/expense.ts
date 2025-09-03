import { Request, Response } from 'express';
import xlsx from 'xlsx';
import Expense from '../models/Expense';

export const addExpense = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const { icon, category, amount, date, description } = req.body;

    if (!icon || !amount || !date || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newIncome = new Expense({
      userId,
      icon,
      category,
      description,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const incomes = await Expense.find({ userId }).sort({ date: -1 });
    res.json({ incomes });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const downloadExpenseExcel = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      Description: item.description,
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(wb, ws, `Expense`);
    xlsx.writeFile(wb, `expense_details.xlsx`);
    res.download(`expense_details.xlsx`);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const id = req.params.id;
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfuly' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
