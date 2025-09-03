import mongoose, { Schema } from 'mongoose';

export interface IExpense extends Document {
  userId: unknown;
  icon?: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
}

const ExpenseSchema: Schema<IExpense> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    icon: { type: String },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
