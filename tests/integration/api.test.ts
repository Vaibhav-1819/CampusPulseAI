import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import { app } from '../../backend/src/server';
import { getDatabase } from '../../backend/src/db/connection';

describe('API Integration Tests', () => {
  let server: http.Server;
  let baseUrl: string;

  before(async () => {
    const db = getDatabase();
    db.exec(`
      DELETE FROM incident_events;
      DELETE FROM reports;
      DELETE FROM incidents;
    `);

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as any;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  test('GET /api/health returns 200 OK and healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json() as any;
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.status, 'healthy');
  });

  test('POST /api/reports with short description returns 400 validation error', async () => {
    const res = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'bad' })
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json() as any;
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
  });

  let createdIncidentId: string;
  let createdReportId: string;

  test('POST /api/reports with valid data creates report and anchor incident', async () => {
    const res = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'WiFi is completely down in CSE Block Lab 3 since morning.',
        building: 'CSE Block',
        room: 'Lab 3',
        category: 'NETWORK'
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json() as any;
    assert.strictEqual(body.success, true);
    assert.ok(body.data.report.id);
    assert.ok(body.data.incident.id);
    assert.strictEqual(body.data.report.category, 'NETWORK');
    assert.strictEqual(body.data.report.building, 'CSE Block');
    assert.strictEqual(body.data.incident.building, 'CSE Block');

    createdIncidentId = body.data.incident.id;
    createdReportId = body.data.report.id;
  });

  test('POST /api/reports with related complaint correlates into existing incident', async () => {
    const res = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Cannot connect to wifi in CSE Lab 4, internet offline.',
        building: 'CSE Block',
        room: 'Lab 4',
        category: 'NETWORK'
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json() as any;
    assert.strictEqual(body.success, true);
    // Should be correlated to the same incident created in previous test!
    assert.strictEqual(body.data.incident.id, createdIncidentId);
    assert.strictEqual(body.data.incident.report_count, 2);
    assert.ok(body.data.report.correlation_score > 0.70);
    assert.ok(body.data.report.correlation_reason.includes('Correlated'));
  });

  test('GET /api/incidents returns list containing the created incident', async () => {
    const res = await fetch(`${baseUrl}/api/incidents`);
    assert.strictEqual(res.status, 200);

    const body = await res.json() as any;
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data.incidents));
    const target = body.data.incidents.find((i: any) => i.id === createdIncidentId);
    assert.ok(target, 'Created incident must be in list');
    assert.strictEqual(target.report_count, 2);
  });

  test('GET /api/incidents/:id returns incident detail with reports and timeline', async () => {
    const res = await fetch(`${baseUrl}/api/incidents/${createdIncidentId}`);
    assert.strictEqual(res.status, 200);

    const body = await res.json() as any;
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.incident.id, createdIncidentId);
    assert.strictEqual(body.data.reports.length, 2);
    assert.ok(body.data.timeline.length >= 2, 'Timeline should record CREATED and REPORT_LINKED');
  });

  test('PATCH /api/incidents/:id/status updates status and logs event', async () => {
    const res = await fetch(`${baseUrl}/api/incidents/${createdIncidentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'INVESTIGATING',
        notes: 'Technician dispatched to CSE switches.'
      })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json() as any;
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.incident.status, 'INVESTIGATING');
    assert.strictEqual(body.data.event.event_type, 'STATUS_CHANGED');
    assert.ok(body.data.event.description.includes('INVESTIGATING'));
  });

  test('GET /api/dashboard/stats returns aggregated KPI statistics', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/stats`);
    assert.strictEqual(res.status, 200);

    const body = await res.json() as any;
    assert.strictEqual(body.success, true);
    assert.ok(body.data.active_incidents >= 1);
    assert.ok(body.data.total_reports_today >= 2);
    assert.ok(body.data.category_breakdown.NETWORK >= 1);
    assert.ok(Array.isArray(body.data.recent_activity));
  });
});
