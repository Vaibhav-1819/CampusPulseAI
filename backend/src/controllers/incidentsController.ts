import { Request, Response, NextFunction } from 'express';
import { IncidentService } from '../services/incidentService';
import { IncidentStatus } from '../types';

export class IncidentsController {
  static getIncidents(req: Request, res: Response, next: NextFunction): void {
    try {
      const { status, severity, building, is_emerging } = req.query;

      const result = IncidentService.getIncidents({
        status: status ? String(status) : undefined,
        severity: severity ? String(severity) : undefined,
        building: building ? String(building) : undefined,
        is_emerging: is_emerging !== undefined ? is_emerging === 'true' : undefined
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

  static getIncidentById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const result = IncidentService.getIncidentDetail(id as string);

      if (!result) {
        res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: `Incident with ID '${id}' was not found.`
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  static updateStatus(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const { status, notes } = req.body as { status: IncidentStatus; notes?: string };

      const allowedStatuses: IncidentStatus[] = ['OPEN', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
      if (!status || !allowedStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid status '${status}'. Allowed values are: ${allowedStatuses.join(', ')}`
          }
        });
        return;
      }

      const result = IncidentService.updateStatus(id as string, status, notes);

      if (!result) {
        res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: `Incident with ID '${id}' was not found.`
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}
