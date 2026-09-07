import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CorrelationEngine } from '../../backend/src/engine/correlationEngine';
import { SeverityCalculator } from '../../backend/src/engine/severityCalculator';
import { EmergingDetector } from '../../backend/src/engine/emergingDetector';
import { Incident } from '../../shared/types';

describe('CorrelationEngine Unit Tests', () => {
  test('cosineSimilarity computes 1.0 for identical normalized vectors', () => {
    const vecA = [0.6, 0.8];
    const vecB = [0.6, 0.8];
    const sim = CorrelationEngine.cosineSimilarity(vecA, vecB);
    assert.strictEqual(Math.round(sim * 100) / 100, 1.0);
  });

  test('cosineSimilarity computes 0.0 for orthogonal vectors', () => {
    const vecA = [1.0, 0.0];
    const vecB = [0.0, 1.0];
    const sim = CorrelationEngine.cosineSimilarity(vecA, vecB);
    assert.strictEqual(sim, 0.0);
  });

  test('calculateLocationScore returns 1.0 for identical building', () => {
    const score = CorrelationEngine.calculateLocationScore('CSE Block', 'CSE Block');
    assert.strictEqual(score, 1.0);
  });

  test('calculateLocationScore returns 0.0 for completely different buildings', () => {
    const score = CorrelationEngine.calculateLocationScore('Central Library', 'CSE Block');
    assert.strictEqual(score, 0.0);
  });

  test('calculateCategoryScore returns 1.0 for matching category', () => {
    const score = CorrelationEngine.calculateCategoryScore('NETWORK', 'NETWORK');
    assert.strictEqual(score, 1.0);
  });

  test('calculateTemporalScore decays over time', () => {
    const now = new Date();
    const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const scoreFresh = CorrelationEngine.calculateTemporalScore(now, tenMinAgo);
    assert.ok(scoreFresh > 0.95, 'Fresh report should have >0.95 score');

    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const scoreOld = CorrelationEngine.calculateTemporalScore(now, twelveHoursAgo);
    assert.ok(scoreOld < 0.40, '12h report should have <0.40 temporal score');
  });

  test('evaluateCorrelation produces expected score and explainability text', () => {
    const incident: Incident = {
      id: 'inc_test_01',
      title: 'CSE Block Network Outage',
      category: 'NETWORK',
      building: 'CSE Block',
      severity: 'LOW',
      impact_score: 30,
      status: 'OPEN',
      is_emerging: false,
      report_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const centroid = [0.707, 0.707];
    const reportEmbedding = [0.707, 0.707];

    const match = CorrelationEngine.evaluateCorrelation(
      {
        category: 'NETWORK',
        building: 'CSE Block',
        embedding: reportEmbedding,
        created_at: new Date().toISOString()
      },
      incident,
      centroid
    );

    // 0.55 * 1.0 + 0.20 * 1.0 + 0.15 * 1.0 + 0.10 * ~1.0 = ~1.0
    assert.ok(match.score >= 0.95, `Expected score >= 0.95, got ${match.score}`);
    assert.ok(match.reason.includes('CSE Block Network Outage'));
    assert.ok(match.reason.includes('identical building'));
  });
});

describe('SeverityCalculator Unit Tests', () => {
  test('Base impact score matches expected formula', () => {
    // NETWORK base (25) + 0 reports + general building (5) = 30
    const impact1 = SeverityCalculator.calculateImpactScore({
      category: 'NETWORK',
      reportCount: 1,
      building: 'General Hall'
    });
    assert.strictEqual(impact1, 30);
    assert.strictEqual(SeverityCalculator.determineSeverityLevel(impact1), 'LOW');

    // With 4 reports in critical building: 25 + (3*8) + 15 = 64 (HIGH)
    const impact4 = SeverityCalculator.calculateImpactScore({
      category: 'NETWORK',
      reportCount: 4,
      building: 'CSE Block'
    });
    assert.strictEqual(impact4, 64);
    assert.strictEqual(SeverityCalculator.determineSeverityLevel(impact4), 'HIGH');
  });

  test('Emerging bonus adds +15 points', () => {
    const impactStandard = SeverityCalculator.calculateImpactScore({
      category: 'NETWORK',
      reportCount: 3,
      building: 'CSE Block',
      isEmerging: false
    });
    const impactEmerging = SeverityCalculator.calculateImpactScore({
      category: 'NETWORK',
      reportCount: 3,
      building: 'CSE Block',
      isEmerging: true
    });

    assert.strictEqual(impactEmerging - impactStandard, 15);
  });
});

describe('EmergingDetector Unit Tests', () => {
  test('Reports spread out do not trigger emerging status', () => {
    const reports = [
      { created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
      { created_at: new Date(Date.now() - 3 * 3600000).toISOString() }
    ];
    const result = EmergingDetector.evaluateVelocity(reports);
    assert.strictEqual(result.isEmerging, false);
  });

  test('3 reports within 45 minutes triggers emerging status', () => {
    const now = Date.now();
    const reports = [
      { created_at: new Date(now - 30 * 60000).toISOString() },
      { created_at: new Date(now - 15 * 60000).toISOString() },
      { created_at: new Date(now).toISOString() }
    ];
    const result = EmergingDetector.evaluateVelocity(reports);
    assert.strictEqual(result.isEmerging, true);
    assert.ok(result.reason?.includes('surge') || result.reason?.includes('spike'));
  });
});
