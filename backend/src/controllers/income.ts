import { Request, Response } from 'express';
import xlsx from 'xlsx';
import Income from '../models/Income';

export const addIncome = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!icon || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllIncomes = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.json({ incomes });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const downloadIncomeExcel = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(wb, ws, `Income`);
    xlsx.writeFile(wb, `income_details.xlsx`);
    res.download(`income_details.xlsx`);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const id = req.params.id;
    const income = await Income.findOneAndDelete({ _id: id, userId });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
