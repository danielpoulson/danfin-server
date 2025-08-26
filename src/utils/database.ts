import { Pool, PoolConfig } from 'pg';
import logger from './logger';

let pool: Pool | null = null;

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

export const initializeDatabase = (config: DatabaseConfig): Pool => {
  const poolConfig: PoolConfig = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  pool = new Pool(poolConfig);

  pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
  });

  return pool;
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializeDatabase first.');
  }
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database connection pool closed');
  }
};