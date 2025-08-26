import { ExpenseRepository } from '../repositories/expenseRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { Expense, Budget, BillType, BillTrendType, Category } from '../models';

export class ExpenseService {
  private expenseRepo: ExpenseRepository;
  private categoryRepo: CategoryRepository;

  constructor(expenseRepo: ExpenseRepository, categoryRepo: CategoryRepository) {
    this.expenseRepo = expenseRepo;
    this.categoryRepo = categoryRepo;
  }

  async getExpenseForecast(): Promise<{ monthAmount: number; forecast: BillTrendType[] }> {
    const monthAmount = await this.expenseRepo.monthTrend();
    const forecast = await this.expenseRepo.trend();

    return {
      monthAmount,
      forecast,
    };
  }

  async getBillsByMode(mode: string): Promise<{ expenses: BillType[]; total: number }> {
    let low = 2;
    let high = 6;

    switch (mode) {
      case 'weekly':
        low = 0;
        high = 1;
        break;
      case 'monthly':
        low = 1;
        high = 3;
        break;
      case 'yearly':
        low = 3;
        high = 6;
        break;
    }

    const expenses = await this.expenseRepo.getBills(low, high);
    const total = await this.expenseRepo.getTotal(low, high);

    return {
      expenses,
      total,
    };
  }

  async deleteBill(id: string): Promise<void> {
    await this.expenseRepo.delete(id);
  }

  async getBudget(): Promise<Budget[]> {
    return await this.expenseRepo.getByCategory();
  }

  async getExpense(id: string): Promise<{ expense: Expense | null; categories: Category[] }> {
    let expense: Expense | null = null;

    if (id !== 'new') {
      expense = await this.expenseRepo.get(id);
    }

    if (!expense) {
      const currentDate = new Date().toISOString().split('T')[0];
      expense = {
        id: 0,
        name: '',
        category: '',
        payment: '',
        freq: 0,
        duedate: currentDate,
        amount: 0,
        weekly: 0,
        categoryid: 0,
      };
    }

    const categories = await this.categoryRepo.getAll();

    return {
      expense,
      categories,
    };
  }

  async updateExpense(id: string, expenseData: Expense): Promise<void> {
    await this.expenseRepo.update(id, expenseData);
  }

  async createExpense(expenseData: Expense): Promise<void> {
    await this.expenseRepo.insertBill(expenseData);
  }
}