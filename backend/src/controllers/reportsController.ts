import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/reportService';
import { CreateReportRequest } from '../types';

export class ReportsController {
  static async createReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description, user_id, building, room, category } = req.body as CreateReportRequest;

      // Validate description presence & length
      if (!description || typeof description !== 'string' || description.trim().length < 5) {
        res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Report description is required and must be at least 5 characters long.',
            details: [{ field: 'description', issue: 'Must be at least 5 characters' }]
          }
        });
        return;
      }

      const result = await ReportService.submitReport({
        description: description.trim(),
        user_id,
        building,
        room,
        category
      });

      res.status(201).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  static getReports(req: Request, res: Response, next: NextFunction): void {
    try {
      const { incident_id, building, category, limit, offset } = req.query;

      const result = ReportService.getReports({
        incident_id: incident_id ? String(incident_id) : undefined,
        building: building ? String(building) : undefined,
        category: category ? String(category) : undefined,
        limit: limit ? parseInt(String(limit), 10) : 50,
        offset: offset ? parseInt(String(offset), 10) : 0
      });

      res.status(200).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  static getReportById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const report = ReportService.getReportById(id as string);

      if (!report) {
        res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: `Report with ID '${id}' was not found.`
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { report },
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}
