import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Income from '../models/Income';
import Expense from '../models/Expense';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userObjectId = new Types.ObjectId(userId);

    const totalIncome = await Income.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      },
    ]);

    const totalExpense = await Expense.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      },
    ]);

    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const lastTransctions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (item) => ({ ...item.toObject(), type: 'income' })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (item) => ({ ...item.toObject(), type: 'expense' })
      ),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalIncomeValue = totalIncome.length > 0 ? totalIncome[0].total : 0;
    const totalExpenseValue = totalExpense.length > 0 ? totalExpense[0].total : 0;

    res.json({
      totalBalance: totalIncomeValue - totalExpenseValue,
      totalIncome: totalIncomeValue,
      totalExpense: totalExpenseValue,
      last30DaysExpenses: {
        total: totalExpenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: totalIncomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransctions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};