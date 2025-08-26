import { Pool } from 'pg';
import { Expense, Budget, BillType, BillTrendType } from '../models';
import logger from '../utils/logger';

export interface BillInput {
  name?: string;
  amount?: number;
  weekly?: number;
  payment?: string;
  category?: string;
  freq?: number;
  due_date?: string;
}

export class ExpenseRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getByCategory(): Promise<Budget[]> {
    const query = `
      SELECT c.name, e.categoryid, c.fullname, SUM(weekly) as total
      FROM expenses e
      INNER JOIN categories c ON e.categoryid = c.id
      GROUP BY c.name, c.fullname, e.categoryid
    `;

    try {
      const result = await this.pool.query(query);
      return result.rows.map(row => ({
        name: row.name,
        categoryid: row.categoryid,
        fullname: row.fullname,
        total: parseFloat(row.total),
      }));
    } catch (error) {
      logger.error('Error getting expenses by category:', error);
      throw error;
    }
  }

  async getWeeklyTotal(): Promise<number> {
    const query = "SELECT SUM(weekly) FROM expenses WHERE category <> 'Spurge'";

    try {
      const result = await this.pool.query(query);
      return parseFloat(result.rows[0]?.sum || '0');
    } catch (error) {
      logger.error('Error getting weekly total:', error);
      throw error;
    }
  }

  async getTotal(low: number, high: number): Promise<number> {
    const query = `
      SELECT SUM(weekly) as total 
      FROM expenses 
      WHERE freq > $1 AND freq <= $2
    `;

    try {
      const result = await this.pool.query(query, [low, high]);
      return parseFloat(result.rows[0]?.total || '0');
    } catch (error) {
      logger.error('Error getting total by frequency range:', error);
      throw error;
    }
  }

  async insertBill(bill: Expense): Promise<void> {
    const query = `
      INSERT INTO expenses (name, category, payment, freq, duedate, amount, weekly, categoryid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    try {
      await this.pool.query(query, [
        bill.name,
        bill.category,
        bill.payment,
        bill.freq,
        bill.duedate,
        bill.amount,
        bill.weekly,
        bill.categoryid,
      ]);
    } catch (error) {
      logger.error('Error inserting bill:', error);
      throw error;
    }
  }

  async get(id: string): Promise<Expense | null> {
    const query = `
      SELECT id, name, category, payment, freq, duedate, amount, weekly, categoryid
      FROM expenses WHERE id = $1
    `;

    try {
      const result = await this.pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        payment: row.payment,
        freq: row.freq,
        duedate: row.duedate,
        amount: parseFloat(row.amount),
        weekly: parseFloat(row.weekly),
        categoryid: row.categoryid,
      };
    } catch (error) {
      logger.error('Error getting expense by id:', error);
      throw error;
    }
  }

  async getBills(low: number, high: number): Promise<BillType[]> {
    const query = `
      SELECT e.id, e.name, c.fullname as category, payment, freq, duedate, amount
      FROM expenses e
      INNER JOIN categories c ON e.categoryid = c.id
      WHERE freq > $1 AND freq <= $2
      ORDER BY duedate
    `;

    try {
      const result = await this.pool.query(query, [low, high]);
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        payment: row.payment,
        freq: row.freq,
        duedate: row.duedate,
        amount: parseFloat(row.amount),
      }));
    } catch (error) {
      logger.error('Error getting bills by frequency range:', error);
      throw error;
    }
  }

  async trend(): Promise<BillTrendType[]> {
    const query = `
      SELECT EXTRACT(YEAR FROM duedate) as year,
             EXTRACT(MONTH FROM duedate) as month,
             SUM(amount) as amount
      FROM expenses
      WHERE freq > 3 AND freq <= 6
      GROUP BY EXTRACT(YEAR FROM duedate), EXTRACT(MONTH FROM duedate)
      ORDER BY year, month
    `;

    try {
      const result = await this.pool.query(query);
      return result.rows.map(row => ({
        year: parseInt(row.year),
        month: parseInt(row.month),
        amount: parseFloat(row.amount),
      }));
    } catch (error) {
      logger.error('Error getting bill trend:', error);
      throw error;
    }
  }

  async monthTrend(): Promise<number> {
    const query = `
      SELECT SUM(amount) as amount
      FROM expenses
      WHERE freq > 0 AND freq <= 3 AND category != 'Spurge'
    `;

    try {
      const result = await this.pool.query(query);
      return parseFloat(result.rows[0]?.amount || '0');
    } catch (error) {
      logger.error('Error getting month trend:', error);
      throw error;
    }
  }

  async update(id: string, bill: Expense): Promise<void> {
    const query = `
      UPDATE expenses
      SET name = $1, category = $2, payment = $3, freq = $4, 
          duedate = $5, amount = $6, weekly = $7, categoryid = $8
      WHERE id = $9
    `;

    try {
      await this.pool.query(query, [
        bill.name,
        bill.category,
        bill.payment,
        bill.freq,
        bill.duedate,
        bill.amount,
        bill.weekly,
        bill.categoryid,
        id,
      ]);
    } catch (error) {
      logger.error('Error updating expense:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM expenses WHERE id = $1';

    try {
      await this.pool.query(query, [id]);
    } catch (error) {
      logger.error('Error deleting expense:', error);
      throw error;
    }
  }
}