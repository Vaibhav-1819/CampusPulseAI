import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  static getStats(req: Request, res: Response, next: NextFunction): void {
    try {
      const stats = DashboardService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}
