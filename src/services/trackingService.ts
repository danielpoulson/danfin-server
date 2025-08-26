import { TrackingRepository } from '../repositories/trackingRepository';
import { ExpenseRepository } from '../repositories/expenseRepository';
import { Tracking, BudgetItem } from '../models';

export class TrackingService {
  private trackingRepo: TrackingRepository;
  private expenseRepo: ExpenseRepository;

  constructor(trackingRepo: TrackingRepository, expenseRepo: ExpenseRepository) {
    this.trackingRepo = trackingRepo;
    this.expenseRepo = expenseRepo;
  }

  async getTrackingData(
    month: string
  ): Promise<{
    budgetItems: Record<string, BudgetItem>;
    budgetTotal: number;
    monthlyTotal: number;
  }> {
    const tracking = await this.trackingRepo.getByMonth(month);
    const budget = await this.expenseRepo.getByCategory();

    const budgetItems: Record<string, BudgetItem> = {};
    let monthlyTotal = 0;
    let budgetTotal = 0;

    for (const b of budget) {
      let amount = 0;
      for (const t of tracking) {
        if (b.categoryid === t.categoryid) {
          amount = t.total;
          break;
        }
      }

      const monthly = (b.total * 52) / 12;
      const save = monthly - amount;

      budgetItems[b.name] = {
        name: b.fullname,
        actual: amount,
        total: b.total,
        monthly,
        save,
      };

      budgetTotal += monthly;
      monthlyTotal += amount;
    }

    return {
      budgetItems,
      budgetTotal,
      monthlyTotal,
    };
  }

  async createTracking(trackingData: Tracking): Promise<void> {
    await this.trackingRepo.insert(trackingData);
  }

  async getTrackingByMonth(
    month: string
  ): Promise<{
    monthSelect: string[][];
    budgetItems: Record<string, BudgetItem>;
    budgetTotal: number;
    monthlyTotal: number;
  }> {
    let actualMonth = month;
    if (month === 'current') {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      actualMonth = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(
        2,
        '0'
      )}`;
    }

    const { budgetItems, budgetTotal, monthlyTotal } = await this.getTrackingData(actualMonth);

    const monthSelect = this.generateMonthSelect();

    return {
      monthSelect,
      budgetItems,
      budgetTotal,
      monthlyTotal,
    };
  }

  private generateMonthSelect(): string[][] {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const currentYear = new Date().getFullYear();
    const monthSelect: string[][] = [];

    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const monthValue = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthDisplay = `${months[month]} ${year}`;
        monthSelect.push([monthValue, monthDisplay]);
      }
    }

    return monthSelect;
  }
}