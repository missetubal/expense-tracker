import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db';
import { authRouter, expenseRouter, incomeRouter } from './routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

connectDB();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/income', incomeRouter);
app.use('/api/v1/expense', expenseRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
