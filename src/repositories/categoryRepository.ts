import { Pool } from 'pg';
import { Category } from '../models';
import logger from '../utils/logger';

export class CategoryRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAll(): Promise<Category[]> {
    const query = 'SELECT id, name, fullname FROM categories ORDER BY name';

    try {
      const result = await this.pool.query(query);
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        fullname: row.fullname,
      }));
    } catch (error) {
      logger.error('Error getting all categories:', error);
      throw error;
    }
  }
}