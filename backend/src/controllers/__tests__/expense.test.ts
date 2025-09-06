import { Request, Response } from 'express';
import Expense from '../../models/Expense';
import { addExpense, deleteExpense } from '../expense';

jest.mock('../../models/Expense.ts');

let req: Partial<Request>;
let res: Partial<Response>;
let status: jest.Mock;
let json: jest.Mock;

describe('Expense Controller', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn(() => ({ json }));
    res = {
      status,
    };
  });

  describe('addExpense', () => {
    beforeEach(() => {
      req = {
        user: { id: '123' } as any,
        body: {
          icon: 'test-icon',
          category: 'test-category',
          amount: 100,
          date: '2025-09-06',
          description: 'test-description',
        },
      };
    });

    it('should add a new expense and return it', async () => {
      const newExpense = new Expense({
        ...req.body,
        userId: req.user?.id,
        date: new Date(req.body.date),
      });
      (Expense.prototype.save as jest.Mock).mockResolvedValue(newExpense);

      await addExpense(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(newExpense);
    });

    it('should return a 400 error if required fields are missing', async () => {
      req.body = { icon: '', amount: null, date: '' };

      await addExpense(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return a 500 error if there is a server error', async () => {
      const errorMessage = 'Internal Server Error';
      (Expense.prototype.save as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await addExpense(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Server Error' });
    });
  });

  describe('deleteExpense', () => {
    beforeEach(() => {
      req = {
        user: { id: '123' } as any,
        params: { id: '123' },
      };
    });

    it('should delete an expense and return a success message', async () => {
      const mockExpense = {
        _id: '123',
        user: '123',
        icon: 'test-icon',
        category: 'test-category',
        amount: 5000,
        date: new Date(),
        description: 'test-description',
      };
      (Expense.findOneAndDelete as jest.Mock).mockResolvedValue(mockExpense);

      await deleteExpense(req as Request, res as Response);

      expect(Expense.findOneAndDelete).toHaveBeenCalledWith({
        _id: '123',
        userId: '123',
      });
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'Expense deleted successfully',
      });
    });

    it('should return a 404 error if the expense is not found', async () => {
      (Expense.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteExpense(req as Request, res as Response);

      expect(Expense.findOneAndDelete).toHaveBeenCalledWith({
        _id: '123',
        userId: '123',
      });
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Expense not found' });
    });

    it('should return a 500 error if there is a server error', async () => {
      const errorMessage = 'Internal Server Error';
      (Expense.findOneAndDelete as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await deleteExpense(req as Request, res as Response);

      expect(Expense.findOneAndDelete).toHaveBeenCalledWith({
        _id: '123',
        userId: '123',
      });
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Server Error' });
    });
  });
});
