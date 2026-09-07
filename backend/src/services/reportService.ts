import { v4 as uuidv4 } from 'uuid';
import { AIServiceAdapter } from '../ai/aiAdapter';
import { CorrelationEngine } from '../engine/correlationEngine';
import { SeverityCalculator } from '../engine/severityCalculator';
import { EmergingDetector } from '../engine/emergingDetector';
import { ReportRepository } from '../db/repositories/reportRepository';
import { IncidentRepository } from '../db/repositories/incidentRepository';
import { EventRepository } from '../db/repositories/eventRepository';
import {
  CreateReportRequest,
  CreateReportResponseData,
  Report,
  Incident
} from '../types';

export class ReportService {
  private static aiAdapter = new AIServiceAdapter();

  static async submitReport(req: CreateReportRequest): Promise<CreateReportResponseData> {
    const reportId = `rep_${uuidv4().substring(0, 8)}`;
    const nowIso = new Date().toISOString();

    // 1. AI Understanding & Extraction (with graceful fallback)
    const { result: extracted, ai_status, ai_error } = await this.aiAdapter.classifyAndExtractWithStatus(
      req.description,
      {
        category: req.category,
        building: req.building,
        room: req.room
      }
    );

    const category = req.category || extracted.category;
    const building = req.building || extracted.building || 'Unknown';
    const room = req.room || extracted.room;
    const subcategory = extracted.subcategory;

    // 2. Vector Embedding Generation
    let embeddingArray: number[] | undefined;
    let embeddingString: string | undefined;
    try {
      embeddingArray = await this.aiAdapter.generateEmbedding(req.description);
      embeddingString = JSON.stringify(embeddingArray);
    } catch (e: any) {
      console.warn('[ReportService] Embedding generation failed:', e.message);
    }

    // 3. Multi-Factor Correlation with Active Incidents
    const activeIncidents = IncidentRepository.findActive();

    // Build incident embeddings map (from first report of each incident)
    const incidentEmbeddings = new Map<string, number[]>();
    for (const inc of activeIncidents) {
      const incReports = ReportRepository.findByIncidentId(inc.id);
      if (incReports.length > 0 && incReports[0].embedding) {
        try {
          const parsed = JSON.parse(incReports[0].embedding);
          if (Array.isArray(parsed)) {
            incidentEmbeddings.set(inc.id, parsed);
          }
        } catch (err) {
          // Ignore parse errors
        }
      }
    }

    const candidateReport = {
      category,
      building,
      embedding: embeddingArray,
      created_at: nowIso
    };

    const match = CorrelationEngine.findBestMatch(candidateReport, activeIncidents, incidentEmbeddings);

    let parentIncident: Incident;
    let correlationScore: number | undefined;
    let correlationReason: string | undefined;

    if (match) {
      // --- MATCH FOUND: Correlate into existing Incident ---
      parentIncident = match.incident;
      correlationScore = match.score;
      correlationReason = match.reason;

      // Persist the report linked to this incident
      const initialImpact = SeverityCalculator.calculateImpactScore({ category, reportCount: 1, building });
      const initialSeverity = SeverityCalculator.determineSeverityLevel(initialImpact);

      const savedReport = ReportRepository.create({
        id: reportId,
        user_id: req.user_id,
        description: req.description,
        category,
        subcategory,
        building,
        room,
        severity: initialSeverity,
        impact_score: initialImpact,
        ai_status,
        ai_error,
        embedding: embeddingString,
        incident_id: parentIncident.id,
        correlation_score: correlationScore,
        correlation_reason: correlationReason
      });

      // Retrieve all reports in the incident to recompute metrics
      const allReports = ReportRepository.findByIncidentId(parentIncident.id);
      const newReportCount = allReports.length;

      // Evaluate Emerging Incident Velocity
      const velocityCheck = EmergingDetector.evaluateVelocity(allReports);
      const isNowEmerging = velocityCheck.isEmerging || parentIncident.is_emerging;

      // Recalculate Incident Impact Score & Severity
      const { impactScore, severity } = SeverityCalculator.evaluateIncidentImpact(
        parentIncident.category,
        newReportCount,
        parentIncident.building,
        isNowEmerging
      );

      // Synthesize updated AI summary & recommendation
      let summary = parentIncident.summary;
      let recommendation = parentIncident.recommendation;
      try {
        const aiSummaryResult = await this.aiAdapter.generateSummaryAndRecommendation(
          parentIncident.category,
          parentIncident.building,
          allReports.map(r => ({
            description: r.description,
            building: r.building,
            room: r.room,
            created_at: r.created_at
          }))
        );
        summary = aiSummaryResult.summary;
        recommendation = aiSummaryResult.recommendation;
      } catch (err: any) {
        console.warn('[ReportService] Summary generation error:', err.message);
      }

      // Update Incident in DB
      const updatedIncident = IncidentRepository.update(parentIncident.id, {
        report_count: newReportCount,
        severity,
        impact_score: impactScore,
        is_emerging: isNowEmerging,
        summary,
        recommendation
      })!;

      // Write Timeline Event for Linked Report
      EventRepository.create({
        id: `evt_${uuidv4().substring(0, 8)}`,
        incident_id: parentIncident.id,
        event_type: 'REPORT_LINKED',
        description: `Correlated report ${reportId} from ${room ? room + ', ' : ''}${building} (Match Score: ${Math.round(match.score * 100)}%)`,
        metadata: { reportId, correlationScore: match.score, reason: match.reason }
      });

      // Write Timeline Event if newly flagged as Emerging
      if (!parentIncident.is_emerging && isNowEmerging) {
        EventRepository.create({
          id: `evt_${uuidv4().substring(0, 8)}`,
          incident_id: parentIncident.id,
          event_type: 'EMERGING_FLAGGED',
          description: velocityCheck.reason || 'Abnormal velocity detected. Incident flagged as rapidly emerging.',
          metadata: { velocityPerHour: velocityCheck.velocityPerHour }
        });
      }

      return {
        report: savedReport,
        incident: updatedIncident
      };
    } else {
      // --- NO MATCH FOUND: Create New Incident ---
      const newIncidentId = `inc_${uuidv4().substring(0, 8)}`;
      const { impactScore: incImpact, severity: incSeverity } = SeverityCalculator.evaluateIncidentImpact(
        category,
        1,
        building,
        false
      );

      // Generate initial AI summary & recommendation
      let initialSummary = `Student report received regarding ${category} issue in ${building}.`;
      let initialRec = 'Dispatch maintenance staff to inspect the reported location.';
      let initialTitle = `${building} ${category} Incident`;

      try {
        const aiSummary = await this.aiAdapter.generateSummaryAndRecommendation(
          category,
          building,
          [{ description: req.description, building, room, created_at: nowIso }]
        );
        initialTitle = aiSummary.title;
        initialSummary = aiSummary.summary;
        initialRec = aiSummary.recommendation;
      } catch (err: any) {
        console.warn('[ReportService] Initial AI summary generation error:', err.message);
      }

      // Create new Incident
      const newIncident = IncidentRepository.create({
        id: newIncidentId,
        title: initialTitle,
        category,
        building,
        severity: incSeverity,
        impact_score: incImpact,
        status: 'OPEN',
        summary: initialSummary,
        recommendation: initialRec,
        is_emerging: false,
        report_count: 1
      });

      correlationScore = 1.0;
      correlationReason = 'Anchor report that initiated this incident.';

      // Create and link the report
      const savedReport = ReportRepository.create({
        id: reportId,
        user_id: req.user_id,
        description: req.description,
        category,
        subcategory,
        building,
        room,
        severity: incSeverity,
        impact_score: incImpact,
        ai_status,
        ai_error,
        embedding: embeddingString,
        incident_id: newIncident.id,
        correlation_score: correlationScore,
        correlation_reason: correlationReason
      });

      // Write Created Event in timeline
      EventRepository.create({
        id: `evt_${uuidv4().substring(0, 8)}`,
        incident_id: newIncident.id,
        event_type: 'CREATED',
        description: `Incident initialized from anchor report ${reportId} in ${building}.`,
        metadata: { reportId }
      });

      return {
        report: savedReport,
        incident: newIncident
      };
    }
  }

  static getReports(filters: {
    incident_id?: string;
    building?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): { reports: Report[]; total: number } {
    return ReportRepository.findAll(filters);
  }

  static getReportById(id: string): Report | null {
    return ReportRepository.findById(id);
  }
}
