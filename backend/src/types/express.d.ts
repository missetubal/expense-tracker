import { IIncome } from '../models/Income';
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      income?: IIncome;
    }
  }
}
