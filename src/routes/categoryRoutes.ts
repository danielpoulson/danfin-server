import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';

export const createCategoryRoutes = (categoryController: CategoryController): Router => {
  const router = Router();

  router.get('/', categoryController.getAll);

  return router;
};