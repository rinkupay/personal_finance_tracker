import { Router } from 'express';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionControllers';

const router = Router();

router.get('/transactions', getTransactions);
router.post('/transactions', addTransaction);
router.patch('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;
