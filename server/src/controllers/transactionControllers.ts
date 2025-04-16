import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

export const getTransactions = async (_req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

export const addTransaction = async (req: Request, res: Response):Promise<any> => {
  const { description, amount, category, date } = req.body;

  if (!description || !amount || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newTransaction = new Transaction({ description, amount, category, date });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error saving transaction', error });
  }
};

export const updateTransaction = async (req: Request, res: Response):Promise<any>  => {
  const { id } = req.params;
  const { description, amount, category, date } = req.body;

  try {
    const updated = await Transaction.findByIdAndUpdate(id, { description, amount, category, date }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
};
