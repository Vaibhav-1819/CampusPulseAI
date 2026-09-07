import fs from 'fs';
import path from 'path';
import { initializeDatabase } from './init';
import { getDatabase } from './connection';
import { ReportService } from '../services/reportService';

async function seedDemoScenario() {
  console.log('[Seed] Initializing database...');
  initializeDatabase();
  const db = getDatabase();

  // Clear existing demo records so seed runs deterministically
  db.exec(`
    DELETE FROM incident_events;
    DELETE FROM reports;
    DELETE FROM incidents;
  `);
  console.log('[Seed] Cleared existing incident and report records.');

  const demoPath = path.resolve(__dirname, '../../../demo-data/demo-scenario.json');
  if (!fs.existsSync(demoPath)) {
    console.error('[Seed] demo-scenario.json not found at:', demoPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(demoPath, 'utf8');
  const demoData = JSON.parse(raw);
  const reportsSequence = demoData.reports_sequence;

  console.log(`[Seed] Ingesting ${reportsSequence.length} demo reports from scenario: "${demoData.scenario_name}"...\n`);

  for (const item of reportsSequence) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[Step ${item.step}] Submitting Report: "${item.payload.description}"`);
    console.log(`Location: ${item.payload.building} (${item.payload.room || 'General'}) | Category: ${item.payload.category}`);

    const result = await ReportService.submitReport(item.payload);

    console.log(` -> Report ID: ${result.report.id}`);
    console.log(` -> Incident ID: ${result.incident.id} | Title: "${result.incident.title}"`);
    console.log(` -> Correlation Score: ${result.report.correlation_score ?? 'N/A'}`);
    console.log(` -> Correlation Reason: ${result.report.correlation_reason ?? 'N/A'}`);
    console.log(` -> Incident Severity: ${result.incident.severity} | Impact Score: ${result.incident.impact_score}/100`);
    console.log(` -> Report Count: ${result.incident.report_count} | Emerging Flag: ${result.incident.is_emerging ? '🚨 YES (EMERGING)' : 'No'}`);
    console.log(` -> AI Summary: ${result.incident.summary}`);
    console.log(` -> AI Recommendation: ${result.incident.recommendation}`);

    // Small delay between reports to simulate realistic time progression
    await new Promise(res => setTimeout(res, 50));
  }

  console.log(`\n================================================================================`);
  console.log(`[Seed] Demo scenario ingestion complete! Total active incidents ready on dashboard.`);
  console.log(`================================================================================`);
}

seedDemoScenario()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('[Seed] Fatal seeding error:', err);
    process.exit(1);
  });
