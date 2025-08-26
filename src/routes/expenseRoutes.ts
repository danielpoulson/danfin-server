import { Router } from 'express';
import { ExpenseController } from '../controllers/expenseController';

export const createExpenseRoutes = (expenseController: ExpenseController): Router => {
  const router = Router();

  router.get('/forecast', expenseController.getExpenseForecast);
  router.get('/budget', expenseController.getBudget);
  router.get('/:id', expenseController.getExpense);
  router.put('/:id', expenseController.updateExpense);
  router.post('/', expenseController.createExpense);
  router.delete('/:id', expenseController.deleteBill);

  return router;
};

export const createBillRoutes = (expenseController: ExpenseController): Router => {
  const router = Router();

  router.get('/:mode', expenseController.getBills);

  return router;
};