import express from 'express'
import { createExpense } from '../controller/expenseController.js';
import { getExpenses } from '../controller/expenseController.js';

const router = express.Router();

router.post('/create', createExpense);
router.get('/',getExpenses)

export default router