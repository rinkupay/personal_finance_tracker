import { Router } from 'express';
import { setBudget, getBudget } from '../controllers/budgetControllers';

const router = Router();

router.post('/setbudget', setBudget);
router.get('/budget', getBudget);

export default router;
