import { Request, Response } from 'express';
import Budget from '../models/Budget';

export const setBudget = async (req: Request, res: Response):Promise<any>  => {
  const { food, transportation, entertainment, utilities, other } = req.body;

  try {
    if ([food, transportation, entertainment, utilities, other].some(val => val === undefined)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingBudget = await Budget.findOne();

    if (existingBudget) {
      Object.assign(existingBudget, { food, transportation, entertainment, utilities, other });
      await existingBudget.save();
      return res.status(200).json({ success: true, message: 'Budget updated successfully' });
    } else {
      await new Budget({ food, transportation, entertainment, utilities, other }).save();
      return res.status(201).json({ success: true, message: 'Budget created successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error processing budget', error });
  }
};

export const getBudget = async (_req: Request, res: Response):Promise<any>  => {
  try {
    const budget = await Budget.findOne();
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    return res.status(200).json({ success: true, budget });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch budget' });
  }
};
