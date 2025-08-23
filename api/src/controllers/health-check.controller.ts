import type { Request, Response } from 'express';
import { logger } from 'firebase-functions';
import { HealthCheckApi } from '../models';

export class HealthCheckController {
  public static async get(_req: Request, res: Response): Promise<void> {
    try {
      logger.info('Health check OK!');
      const result: HealthCheckApi = {
        status: 'ok',
        timestamp: Date.now(),
      };
      res.status(200).json(result);
    } catch (error) {
      const errorMessage = 'Failed to fetch health status. See log.';
      logger.error(errorMessage, error);
      res.status(500).json({ error: errorMessage });
    }
  }
}
