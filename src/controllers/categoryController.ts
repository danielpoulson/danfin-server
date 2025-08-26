import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/categoryRepository';
import logger from '../utils/logger';

export class CategoryController {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryRepo.getAll();
      res.json({ categories });
    } catch (error) {
      logger.error('Error getting all categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}