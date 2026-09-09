import { CreateReportRequest, CreateReportResponseData, IssueCategory, SeverityLevel } from '../types';

// In-memory state for mock sessions
let mockIncidentStore: {
  id: string;
  title: string;
  category: IssueCategory;
  building: string;
  severity: SeverityLevel;
  impact_score: number;
  status: 'OPEN' | 'INVESTIGATING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  summary?: string;
  recommendation?: string;
  is_emerging: boolean;
  report_count: number;
  created_at: string;
  updated_at: string;
}[] = [];

export class MockApiClient {
  static async submitReport(payload: CreateReportRequest): Promise<CreateReportResponseData> {
    // Simulate natural AI processing latency (450ms)
    await new Promise((res) => setTimeout(res, 450));

    const text = payload.description.toLowerCase();
    const nowIso = new Date().toISOString();
    const reportId = `rep_${Math.random().toString(36).substring(2, 9)}`;

    // 1. Determine Category
    let category: IssueCategory = payload.category || 'OTHER';
    let subcategory = 'GENERAL';
    if (!payload.category || payload.category === 'OTHER') {
      if (/\b(wifi|wi-fi|internet|network|ethernet|router|connect|offline)\b/.test(text)) {
        category = 'NETWORK';
        subcategory = 'WIFI';
      } else if (/\b(pipe|leak|water|sink|toilet|restroom|drain|flood)\b/.test(text)) {
        category = 'PLUMBING';
        subcategory = 'LEAK';
      } else if (/\b(light|power|electricity|socket|outlet|blackout)\b/.test(text)) {
        category = 'ELECTRICAL';
        subcategory = 'POWER';
      } else if (/\b(ac|air condition|heat|heater|cold|temperature|vent)\b/.test(text)) {
        category = 'HVAC';
        subcategory = 'CLIMATE';
      } else if (/\b(door|window|lock|chair|desk|broken|glass)\b/.test(text)) {
        category = 'PHYSICAL';
        subcategory = 'STRUCTURE';
      } else if (/\b(fire|hazard|smoke|danger|alarm)\b/.test(text)) {
        category = 'SAFETY';
        subcategory = 'HAZARD';
      }
    }

    // 2. Extract Building
    let building = payload.building || 'Unknown';
    if (building === 'Unknown' || !building) {
      if (/cse block|cse building|computer science/i.test(text)) building = 'CSE Block';
      else if (/library|central library/i.test(text)) building = 'Central Library';
      else if (/mechanical lab|mech block/i.test(text)) building = 'Mechanical Lab';
      else if (/science annex|science block/i.test(text)) building = 'Science Annex';
      else if (/admin block|administration/i.test(text)) building = 'Admin Block';
      else building = 'Main Academic Block';
    }

    // 3. Extract Room
    let room = payload.room;
    if (!room) {
      const match = text.match(/\b(lab \d+|room \d+|floor \d+|hallway|\d+nd floor [a-z]+)\b/i);
      if (match) room = match[0];
    }

    // 4. Incident Correlation Matching
    const existing = mockIncidentStore.find(
      (inc) => inc.building.toLowerCase() === building.toLowerCase() && inc.category === category
    );

    let incident;
    let correlationScore = 1.0;
    let correlationReason = 'Anchor report that established this incident cluster.';

    if (existing) {
      existing.report_count += 1;
      existing.updated_at = nowIso;
      existing.impact_score = Math.min(100, existing.impact_score + 18);

      if (existing.report_count >= 3) {
        existing.is_emerging = true;
        existing.severity = existing.impact_score >= 80 ? 'CRITICAL' : 'HIGH';
      } else if (existing.impact_score >= 60) {
        existing.severity = 'HIGH';
      } else if (existing.impact_score >= 35) {
        existing.severity = 'MEDIUM';
      }

      correlationScore = 0.88;
      correlationReason = `Correlated to existing incident '${existing.title}' (88% match): Identical building [${building}], matching category [${category}], active within the same hour.`;
      
      existing.summary = `Multiple students (${existing.report_count} reports) have reported recurring ${category.toLowerCase()} issues in ${building}.`;
      existing.recommendation = `Priority triage: Dispatch maintenance technician to ${building} to inspect core systems and verify affected rooms.`;

      incident = existing;
    } else {
      const newIncId = `inc_${Math.random().toString(36).substring(2, 9)}`;
      const baseImpact = category === 'SAFETY' ? 40 : category === 'NETWORK' || category === 'ELECTRICAL' ? 30 : 25;
      
      const newIncident = {
        id: newIncId,
        title: `${building} ${category} Issue`,
        category,
        building,
        severity: (baseImpact >= 35 ? 'MEDIUM' : 'LOW') as SeverityLevel,
        impact_score: baseImpact,
        status: 'OPEN' as const,
        summary: `Initial report logged for ${category.toLowerCase()} incident in ${building}.`,
        recommendation: `Inspect ${building} ${room ? `around ${room}` : ''} and confirm severity.`,
        is_emerging: false,
        report_count: 1,
        created_at: nowIso,
        updated_at: nowIso
      };

      mockIncidentStore.push(newIncident);
      incident = newIncident;
    }

    const report = {
      id: reportId,
      user_id: payload.user_id || 'usr_student_demo',
      description: payload.description,
      category,
      subcategory,
      building,
      room,
      severity: incident.severity,
      impact_score: incident.impact_score,
      ai_status: 'COMPLETED' as const,
      incident_id: incident.id,
      correlation_score: correlationScore,
      correlation_reason: correlationReason,
      created_at: nowIso
    };

    return {
      report,
      incident
    };
  }
}
