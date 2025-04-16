import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import budgetRoutes from './routes/budgetRoutes';
import transactionRoutes from './routes/transactionsRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173','https://personal-finance-tracker-ten-kappa.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(bodyParser.json());

// Routes
app.use('/api', budgetRoutes);
app.use('/api', transactionRoutes);

export default app;
