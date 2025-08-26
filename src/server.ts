import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { initializeDatabase, closeDatabase } from './utils/database';
import logger from './utils/logger';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';

import { ExpenseRepository, CategoryRepository, TrackingRepository } from './repositories';
import { ExpenseService } from './services/expenseService';
import { TrackingService } from './services/trackingService';
import { ExpenseController } from './controllers/expenseController';
import { TrackingController } from './controllers/trackingController';
import { CategoryController } from './controllers/categoryController';

import { createExpenseRoutes, createBillRoutes } from './routes/expenseRoutes';
import { createTrackingRoutes } from './routes/trackingRoutes';
import { createCategoryRoutes } from './routes/categoryRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5333;

app.use(express.json());
app.use(corsMiddleware);

app.use('/static', express.static(path.join(__dirname, '../ui/static')));

const dbConfig = {
  host: process.env.DB_SERVER_NAME || 'localhost',
  user: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
};

const pool = initializeDatabase(dbConfig);

const expenseRepo = new ExpenseRepository(pool);
const categoryRepo = new CategoryRepository(pool);
const trackingRepo = new TrackingRepository(pool);

const expenseService = new ExpenseService(expenseRepo, categoryRepo);
const trackingService = new TrackingService(trackingRepo, expenseRepo);

const expenseController = new ExpenseController(expenseService);
const trackingController = new TrackingController(trackingService);
const categoryController = new CategoryController(categoryRepo);

app.use('/api/expense', createExpenseRoutes(expenseController));
app.use('/api/expenses', createBillRoutes(expenseController));
app.use('/bills', createBillRoutes(expenseController));
app.use('/api/tracking', createTrackingRoutes(trackingController));
app.use('/api/categories', createCategoryRoutes(categoryController));

app.get('/api/budget', expenseController.getBudget);

app.use(errorHandler);

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

const gracefulShutdown = async (): Promise<void> => {
  logger.info('Starting graceful shutdown...');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });

  try {
    await closeDatabase();
    logger.info('Database connections closed');
  } catch (error) {
    logger.error('Error closing database:', error);
  }

  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;