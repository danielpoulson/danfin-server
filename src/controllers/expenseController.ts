import { Request, Response } from 'express';
import { ExpenseService } from '../services/expenseService';
import logger from '../utils/logger';

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
  }

  getExpenseForecast = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.expenseService.getExpenseForecast();
      res.json({ data });
    } catch (error) {
      logger.error('Error getting expense forecast:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getBills = async (req: Request, res: Response): Promise<void> => {
    try {
      const mode = req.params.mode || 'monthly';
      const data = await this.expenseService.getBillsByMode(mode);
      res.json({ data });
    } catch (error) {
      logger.error('Error getting bills:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  deleteBill = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.expenseService.deleteBill(id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting bill:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      const budget = await this.expenseService.getBudget();
      res.json({ budget });
    } catch (error) {
      logger.error('Error getting budget:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getExpense = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.expenseService.getExpense(id);
      res.json(data);
    } catch (error) {
      logger.error('Error getting expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  updateExpense = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const expenseData = req.body;
      await this.expenseService.updateExpense(id, expenseData);
      res.status(200).send('Message Saved');
    } catch (error) {
      logger.error('Error updating expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
      const expenseData = req.body;
      await this.expenseService.createExpense(expenseData);
      res.status(201).send('Message Saved');
    } catch (error) {
      logger.error('Error creating expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}