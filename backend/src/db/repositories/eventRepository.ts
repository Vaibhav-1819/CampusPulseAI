import { getDatabase } from '../connection';
import { IncidentEvent, IncidentEventType } from '../../types';

interface EventRow {
  id: string;
  incident_id: string;
  event_type: IncidentEventType;
  description: string;
  metadata: string | null;
  created_at: string;
}

export class EventRepository {
  static create(data: {
    id: string;
    incident_id: string;
    event_type: IncidentEventType;
    description: string;
    metadata?: Record<string, any> | string;
  }): IncidentEvent {
    const db = getDatabase();
    const metaString = typeof data.metadata === 'object' ? JSON.stringify(data.metadata) : data.metadata || null;

    db.prepare(`
      INSERT INTO incident_events (id, incident_id, event_type, description, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(data.id, data.incident_id, data.event_type, data.description, metaString);

    return this.findById(data.id)!;
  }

  static findById(id: string): IncidentEvent | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM incident_events WHERE id = ?').get(id) as EventRow | undefined;
    if (!row) return null;
    return {
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    };
  }

  static findByIncidentId(incidentId: string): IncidentEvent[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT * FROM incident_events 
      WHERE incident_id = ? 
      ORDER BY created_at ASC
    `).all(incidentId) as EventRow[];

    return rows.map(r => ({
      ...r,
      metadata: r.metadata ? JSON.parse(r.metadata) : undefined
    }));
  }

  static findRecentWithIncident(limit: number = 10): {
    id: string;
    incident_id: string;
    incident_title: string;
    event_type: IncidentEventType;
    description: string;
    created_at: string;
  }[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT 
        e.id, 
        e.incident_id, 
        i.title as incident_title, 
        e.event_type, 
        e.description, 
        e.created_at
      FROM incident_events e
      JOIN incidents i ON e.incident_id = i.id
      ORDER BY e.created_at DESC
      LIMIT ?
    `).all(limit) as any[];

    return rows;
  }
}
