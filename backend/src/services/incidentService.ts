import { v4 as uuidv4 } from 'uuid';
import { IncidentRepository } from '../db/repositories/incidentRepository';
import { ReportRepository } from '../db/repositories/reportRepository';
import { EventRepository } from '../db/repositories/eventRepository';
import {
  Incident,
  IncidentDetailResponseData,
  IncidentStatus,
  IncidentEvent
} from '../types';

export class IncidentService {
  static getIncidents(filters: {
    status?: string;
    severity?: string;
    building?: string;
    is_emerging?: boolean;
  }): { incidents: Incident[]; total: number } {
    const incidents = IncidentRepository.findAll(filters);
    return {
      incidents,
      total: incidents.length
    };
  }

  static getIncidentDetail(id: string): IncidentDetailResponseData | null {
    const incident = IncidentRepository.findById(id);
    if (!incident) {
      return null;
    }

    const reports = ReportRepository.findByIncidentId(id);
    const timeline = EventRepository.findByIncidentId(id);

    return {
      incident,
      reports,
      timeline
    };
  }

  static updateStatus(
    id: string,
    newStatus: IncidentStatus,
    notes?: string
  ): { incident: Incident; event: IncidentEvent } | null {
    const existing = IncidentRepository.findById(id);
    if (!existing) {
      return null;
    }

    const previousStatus = existing.status;
    const updated = IncidentRepository.update(id, { status: newStatus });
    if (!updated) return null;

    const eventId = `evt_${uuidv4().substring(0, 8)}`;
    const eventDescription = `Status updated from ${previousStatus} to ${newStatus}.${notes ? ' Notes: ' + notes : ''}`;

    const event = EventRepository.create({
      id: eventId,
      incident_id: id,
      event_type: 'STATUS_CHANGED',
      description: eventDescription,
      metadata: { previousStatus, newStatus, notes }
    });

    return {
      incident: updated,
      event
    };
  }
}
