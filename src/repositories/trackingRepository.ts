import { Pool } from 'pg';
import { Tracking, TrackingMonth } from '../models';
import logger from '../utils/logger';

export class TrackingRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async insert(tracking: Tracking): Promise<void> {
    const query = `
      INSERT INTO tracking (period, categoryid, total)
      VALUES ($1, $2, $3)
    `;

    try {
      await this.pool.query(query, [
        tracking.period,
        tracking.categoryid,
        tracking.total,
      ]);
    } catch (error) {
      logger.error('Error inserting tracking:', error);
      throw error;
    }
  }

  async getByMonth(month: string): Promise<TrackingMonth[]> {
    const query = `
      SELECT period, categoryid, SUM(total) As total
      FROM tracking WHERE period = $1 GROUP BY period, categoryid
    `;

    try {
      const result = await this.pool.query(query, [month]);
      return result.rows.map(row => ({
        period: row.period,
        categoryid: row.categoryid,
        total: parseFloat(row.total),
      }));
    } catch (error) {
      logger.error('Error getting tracking by month:', error);
      throw error;
    }
  }
}