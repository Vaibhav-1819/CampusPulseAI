import { getDatabase } from '../connection';
import { Incident, IncidentStatus, IssueCategory, SeverityLevel } from '../../types';

interface IncidentRow {
  id: string;
  title: string;
  category: IssueCategory;
  building: string;
  severity: SeverityLevel;
  impact_score: number;
  status: IncidentStatus;
  summary: string | null;
  recommendation: string | null;
  is_emerging: number;
  report_count: number;
  created_at: string;
  updated_at: string;
}

function mapRowToIncident(row: IncidentRow): Incident {
  return {
    ...row,
    is_emerging: Boolean(row.is_emerging),
    summary: row.summary ?? undefined,
    recommendation: row.recommendation ?? undefined
  };
}

export class IncidentRepository {
  static findById(id: string): Incident | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id) as IncidentRow | undefined;
    return row ? mapRowToIncident(row) : null;
  }

  static findAll(filters: { status?: string; severity?: string; building?: string; is_emerging?: boolean } = {}): Incident[] {
    const db = getDatabase();
    let query = 'SELECT * FROM incidents WHERE 1=1';
    const params: any[] = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.severity) {
      query += ' AND severity = ?';
      params.push(filters.severity);
    }
    if (filters.building) {
      query += ' AND building = ?';
      params.push(filters.building);
    }
    if (filters.is_emerging !== undefined) {
      query += ' AND is_emerging = ?';
      params.push(filters.is_emerging ? 1 : 0);
    }

    query += ' ORDER BY updated_at DESC';
    const rows = db.prepare(query).all(...params) as IncidentRow[];
    return rows.map(mapRowToIncident);
  }

  static findActive(): Incident[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT * FROM incidents 
      WHERE status IN ('OPEN', 'INVESTIGATING', 'IN_PROGRESS')
      ORDER BY updated_at DESC
    `).all() as IncidentRow[];
    return rows.map(mapRowToIncident);
  }

  static create(data: {
    id: string;
    title: string;
    category: IssueCategory;
    building: string;
    severity?: SeverityLevel;
    impact_score?: number;
    status?: IncidentStatus;
    summary?: string;
    recommendation?: string;
    is_emerging?: boolean;
    report_count?: number;
  }): Incident {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO incidents (
        id, title, category, building, severity, impact_score, 
        status, summary, recommendation, is_emerging, report_count, 
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, 
        datetime('now'), datetime('now')
      )
    `);

    stmt.run(
      data.id,
      data.title,
      data.category,
      data.building,
      data.severity || 'LOW',
      data.impact_score || 10,
      data.status || 'OPEN',
      data.summary || null,
      data.recommendation || null,
      data.is_emerging ? 1 : 0,
      data.report_count || 1
    );

    return this.findById(data.id)!;
  }

  static update(id: string, updates: Partial<Incident>): Incident | null {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.building !== undefined) {
      fields.push('building = ?');
      values.push(updates.building);
    }
    if (updates.severity !== undefined) {
      fields.push('severity = ?');
      values.push(updates.severity);
    }
    if (updates.impact_score !== undefined) {
      fields.push('impact_score = ?');
      values.push(updates.impact_score);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.summary !== undefined) {
      fields.push('summary = ?');
      values.push(updates.summary);
    }
    if (updates.recommendation !== undefined) {
      fields.push('recommendation = ?');
      values.push(updates.recommendation);
    }
    if (updates.is_emerging !== undefined) {
      fields.push('is_emerging = ?');
      values.push(updates.is_emerging ? 1 : 0);
    }
    if (updates.report_count !== undefined) {
      fields.push('report_count = ?');
      values.push(updates.report_count);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE incidents SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static incrementReportCount(id: string): void {
    const db = getDatabase();
    db.prepare(`
      UPDATE incidents 
      SET report_count = report_count + 1, updated_at = datetime('now') 
      WHERE id = ?
    `).run(id);
  }
}
