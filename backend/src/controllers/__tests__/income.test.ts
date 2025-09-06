import Income from '../../models/Income';
import { Request, Response } from 'express';
import { addIncome, deleteIncome, getAllIncomes } from '../income';

jest.mock('../../models/Income.ts');

let req: Partial<Request>;
let res: Partial<Response>;
let status: jest.Mock;
let json: jest.Mock;

describe('Income Controller', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn(() => ({ json }));
    res = {
      status,
    };
  });
  describe('addIncome', () => {
    beforeEach(() => {
      req = {
        user: { id: '123' } as any,
        body: {
          icon: 'test-icon',
          source: 'test-source',
          amount: 100,
          date: '2025-09-06',
        },
      };
    });

    it('should add a new income and return it', async () => {
      const newIncome = new Income({
        ...req.body,
        userId: req.user?.id,
        date: new Date(req.body.date),
      });
      (Income.prototype.save as jest.Mock).mockResolvedValue(newIncome);

      await addIncome(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(newIncome);
    });

    it('should return a 400 error if required fields are missing', async () => {
      req.body = { icon: '', amount: null, date: '' };

      await addIncome(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return a 500 error if there is a server error', async () => {
      (Income.prototype.save as jest.Mock).mockRejectedValue(
        new Error('Server Error')
      );

      await addIncome(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Server Error' });
    });
  });

  describe('deleteIncome', () => {
    beforeEach(() => {
      req = {
        user: { id: '123' } as any,
        params: { id: '123' },
      };
    });
    it('should delete an income and return a success message', async () => {
      const mockIncome = {
        _id: '123',
        user: '123',
        source: 'Salary',
        amount: 5000,
        date: new Date(),
      };
      (Income.findOneAndDelete as jest.Mock).mockResolvedValue(mockIncome);

      await deleteIncome(req as Request, res as Response);

      expect(Income.findOneAndDelete).toHaveBeenCalledWith({
        _id: '123',
        userId: '123',
      });
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'Income deleted successfully',
      });
    });

    it('should return a 404 error if the income is not found', async () => {
      (Income.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteIncome(req as Request, res as Response);

      expect(Income.findOneAndDelete).toHaveBeenCalledWith({
        _id: '123',
        userId: '123',
      });
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Income not found' });
    });

    it('should return a 500 error if there is a server error', async () => {
      const errorMessage = 'Internal Server Error';
      (Income.findOneAndDelete as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await deleteIncome(req as Request, res as Response);

      expect(Income.findOneAndDelete).toHaveBeenCalledWith({
        _id: '123',
        userId: '123',
      });
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Server Error' });
    });
  });

  describe('getAllIncomes', () => {
    it('should get all incomes and return the incomes', async () => {
      const mockIncomes = [
        {
          _id: '123',
          user: '123',
          source: 'Salary',
          amount: 5000,
          date: new Date(),
        },
      ];

      (Income.find as jest.Mock).mockResolvedValue(mockIncomes);

      await getAllIncomes(req as Request, res as Response);

      expect(Income.find).toHaveBeenCalledWith({ userId: '123' });
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ incomes: mockIncomes });
    });

    it('should return a 500 error if there is a server error', async () => {
      const errorMessage = 'Internal Server Error';
      (Income.find as jest.Mock).mockRejectedValue(new Error(errorMessage));
      await getAllIncomes(req as Request, res as Response);

      expect(Income.find).toHaveBeenCalledWith({ userId: '123' });
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Server Error' });
    });
  });
});
