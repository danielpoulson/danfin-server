import { Request, Response } from 'express';
import { TrackingService } from '../services/trackingService';
import logger from '../utils/logger';

export class TrackingController {
  private trackingService: TrackingService;

  constructor(trackingService: TrackingService) {
    this.trackingService = trackingService;
  }

  createTracking = async (req: Request, res: Response): Promise<void> => {
    try {
      const trackingData = req.body;
      await this.trackingService.createTracking(trackingData);
      res.status(201).json({ message: 'Tracking created successfully' });
    } catch (error) {
      logger.error('Error creating tracking:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getTrackingByMonth = async (req: Request, res: Response): Promise<void> => {
    try {
      const { month } = req.params;
      const data = await this.trackingService.getTrackingByMonth(month);
      res.json({ data });
    } catch (error) {
      logger.error('Error getting tracking by month:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}