import { getDatabase } from '../connection';
import { Report, IssueCategory, SeverityLevel, AIProcessingStatus } from '../../types';

interface ReportRow {
  id: string;
  user_id: string | null;
  description: string;
  category: IssueCategory;
  subcategory: string | null;
  building: string;
  room: string | null;
  severity: SeverityLevel;
  impact_score: number;
  ai_status: AIProcessingStatus;
  ai_error: string | null;
  embedding: string | null;
  incident_id: string | null;
  correlation_score: number | null;
  correlation_reason: string | null;
  created_at: string;
}

function mapRowToReport(row: ReportRow): Report {
  return {
    ...row,
    user_id: row.user_id ?? undefined,
    subcategory: row.subcategory ?? undefined,
    room: row.room ?? undefined,
    ai_error: row.ai_error ?? undefined,
    embedding: row.embedding ?? undefined,
    incident_id: row.incident_id ?? undefined,
    correlation_score: row.correlation_score ?? undefined,
    correlation_reason: row.correlation_reason ?? undefined
  };
}

export class ReportRepository {
  static findById(id: string): Report | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as ReportRow | undefined;
    return row ? mapRowToReport(row) : null;
  }

  static findAll(filters: {
    incident_id?: string;
    building?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): { reports: Report[]; total: number } {
    const db = getDatabase();
    let query = 'SELECT * FROM reports WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM reports WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (filters.incident_id) {
      query += ' AND incident_id = ?';
      countQuery += ' AND incident_id = ?';
      params.push(filters.incident_id);
      countParams.push(filters.incident_id);
    }
    if (filters.building) {
      query += ' AND building = ?';
      countQuery += ' AND building = ?';
      params.push(filters.building);
      countParams.push(filters.building);
    }
    if (filters.category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(filters.category);
      countParams.push(filters.category);
    }

    const totalRow = db.prepare(countQuery).get(...countParams) as { total: number };

    query += ' ORDER BY created_at DESC';
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const rows = db.prepare(query).all(...params) as ReportRow[];
    return {
      reports: rows.map(mapRowToReport),
      total: totalRow.total
    };
  }

  static findByIncidentId(incidentId: string): Report[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT * FROM reports 
      WHERE incident_id = ? 
      ORDER BY created_at ASC
    `).all(incidentId) as ReportRow[];
    return rows.map(mapRowToReport);
  }

  static create(data: {
    id: string;
    user_id?: string;
    description: string;
    category?: IssueCategory;
    subcategory?: string;
    building?: string;
    room?: string;
    severity?: SeverityLevel;
    impact_score?: number;
    ai_status?: AIProcessingStatus;
    ai_error?: string;
    embedding?: string;
    incident_id?: string;
    correlation_score?: number;
    correlation_reason?: string;
  }): Report {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO reports (
        id, user_id, description, category, subcategory, building, room,
        severity, impact_score, ai_status, ai_error, embedding,
        incident_id, correlation_score, correlation_reason, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, datetime('now')
      )
    `);

    stmt.run(
      data.id,
      data.user_id || null,
      data.description,
      data.category || 'OTHER',
      data.subcategory || null,
      data.building || 'Unknown',
      data.room || null,
      data.severity || 'LOW',
      data.impact_score || 10,
      data.ai_status || 'PENDING',
      data.ai_error || null,
      data.embedding || null,
      data.incident_id || null,
      data.correlation_score || null,
      data.correlation_reason || null
    );

    return this.findById(data.id)!;
  }

  static update(id: string, updates: Partial<Report>): Report | null {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.subcategory !== undefined) {
      fields.push('subcategory = ?');
      values.push(updates.subcategory);
    }
    if (updates.building !== undefined) {
      fields.push('building = ?');
      values.push(updates.building);
    }
    if (updates.room !== undefined) {
      fields.push('room = ?');
      values.push(updates.room);
    }
    if (updates.severity !== undefined) {
      fields.push('severity = ?');
      values.push(updates.severity);
    }
    if (updates.impact_score !== undefined) {
      fields.push('impact_score = ?');
      values.push(updates.impact_score);
    }
    if (updates.ai_status !== undefined) {
      fields.push('ai_status = ?');
      values.push(updates.ai_status);
    }
    if (updates.ai_error !== undefined) {
      fields.push('ai_error = ?');
      values.push(updates.ai_error);
    }
    if (updates.embedding !== undefined) {
      fields.push('embedding = ?');
      values.push(updates.embedding);
    }
    if (updates.incident_id !== undefined) {
      fields.push('incident_id = ?');
      values.push(updates.incident_id);
    }
    if (updates.correlation_score !== undefined) {
      fields.push('correlation_score = ?');
      values.push(updates.correlation_score);
    }
    if (updates.correlation_reason !== undefined) {
      fields.push('correlation_reason = ?');
      values.push(updates.correlation_reason);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    db.prepare(`UPDATE reports SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static countToday(): number {
    const db = getDatabase();
    const row = db.prepare(`
      SELECT COUNT(*) as count 
      FROM reports 
      WHERE date(created_at) = date('now')
    `).get() as { count: number };
    return row.count;
  }
}
