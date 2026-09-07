import { IncidentRepository } from '../db/repositories/incidentRepository';
import { ReportRepository } from '../db/repositories/reportRepository';
import { EventRepository } from '../db/repositories/eventRepository';
import { DashboardStats, SeverityLevel, IssueCategory } from '../types';

export class DashboardService {
  static getStats(): DashboardStats {
    const allIncidents = IncidentRepository.findAll();
    const activeIncidents = allIncidents.filter(
      i => i.status === 'OPEN' || i.status === 'INVESTIGATING' || i.status === 'IN_PROGRESS'
    );
    const emergingIncidents = activeIncidents.filter(i => i.is_emerging);
    const resolvedIncidents = allIncidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED');

    const totalReportsToday = ReportRepository.countToday();

    // Severity breakdown of active incidents
    const severityBreakdown: Record<SeverityLevel, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };
    for (const inc of activeIncidents) {
      if (severityBreakdown[inc.severity] !== undefined) {
        severityBreakdown[inc.severity]++;
      }
    }

    // Category breakdown of active incidents
    const categoryBreakdown: Record<string, number> = {};
    for (const inc of activeIncidents) {
      categoryBreakdown[inc.category] = (categoryBreakdown[inc.category] || 0) + 1;
    }

    // Recent activity
    const recentActivity = EventRepository.findRecentWithIncident(10);

    return {
      active_incidents: activeIncidents.length,
      emerging_incidents: emergingIncidents.length,
      total_reports_today: totalReportsToday,
      resolved_today: resolvedIncidents.length,
      severity_breakdown: severityBreakdown,
      category_breakdown: categoryBreakdown,
      recent_activity: recentActivity
    };
  }
}
