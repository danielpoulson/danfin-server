import { Router } from 'express';
import { TrackingController } from '../controllers/trackingController';

export const createTrackingRoutes = (trackingController: TrackingController): Router => {
  const router = Router();

  router.post('/', trackingController.createTracking);
  router.get('/:month', trackingController.getTrackingByMonth);

  return router;
};