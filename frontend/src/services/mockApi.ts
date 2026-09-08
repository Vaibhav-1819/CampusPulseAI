import { 
  Incident, 
  Report, 
  IncidentEvent, 
  DashboardStats, 
  IncidentStatus,
  CreateReportRequest
} from '@shared/types';

/**
 * Pre-seeded mock data fixtures matching demo-scenario.json and shared/api-contract.md.
 * Enables 100% offline standalone execution of the Admin Dashboard with full data consistency.
 */

let mockIncidents: Incident[] = [
  {
    id: "inc_cse_net_01",
    title: "CSE Block Network Failure",
    category: "NETWORK",
    building: "CSE Block",
    severity: "HIGH",
    impact_score: 78,
    status: "OPEN",
    is_emerging: true,
    report_count: 4,
    summary: "Multiple student reports confirm severe WiFi latency and packet loss affecting CSE Block laboratories.",
    recommendation: "Dispatch network engineering team to inspect core switch stack and access point power injectors in CSE Block.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 60000 * 15).toISOString()
  },
  {
    id: "inc_lib_plumb_02",
    title: "Central Library 2nd Floor Pipe Leak",
    category: "PLUMBING",
    building: "Central Library",
    severity: "MEDIUM",
    impact_score: 46,
    status: "INVESTIGATING",
    is_emerging: false,
    report_count: 2,
    summary: "Water leak reported near the 2nd floor restrooms spreading towards the main reading room aisle.",
    recommendation: "Shut off local water isolation valve on 2nd floor and assign emergency plumbing technician.",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "inc_mech_hvac_03",
    title: "Mechanical Lab AC Unit Breakdown",
    category: "HVAC",
    building: "Mechanical Lab",
    severity: "LOW",
    impact_score: 28,
    status: "IN_PROGRESS",
    is_emerging: false,
    report_count: 1,
    summary: "Air conditioning blower motor failing in Workshop B causing high ambient temperatures.",
    recommendation: "Replace HVAC fan motor capacitor in Mechanical Lab Workshop B.",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "inc_sci_elec_04",
    title: "Science Annex Main Transformer Surge",
    category: "ELECTRICAL",
    building: "Science Annex",
    severity: "CRITICAL",
    impact_score: 92,
    status: "OPEN",
    is_emerging: true,
    report_count: 6,
    summary: "Total power blackout reported across Physics Lab 1 & 2 following main breaker trip.",
    recommendation: "Urgent dispatch of campus high-voltage electrical team. Ensure emergency backup generator engages.",
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    updated_at: new Date(Date.now() - 60000 * 5).toISOString()
  }
];

let mockReports: Report[] = [
  // --- CSE Block Network Failure (4 Reports) ---
  {
    id: "rep_01",
    description: "WiFi is completely down in CSE Block Lab 3 since 9 AM, no one can access online portals.",
    category: "NETWORK",
    subcategory: "WIFI",
    building: "CSE Block",
    room: "Lab 3",
    severity: "HIGH",
    impact_score: 35,
    ai_status: "COMPLETED",
    incident_id: "inc_cse_net_01",
    correlation_score: 1.0,
    correlation_reason: "Anchor report that initiated this incident cluster.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "rep_02",
    description: "Cannot connect to campus internet from CSE Block Room 204.",
    category: "NETWORK",
    subcategory: "WIFI",
    building: "CSE Block",
    room: "Room 204",
    severity: "HIGH",
    impact_score: 30,
    ai_status: "COMPLETED",
    incident_id: "inc_cse_net_01",
    correlation_score: 0.89,
    correlation_reason: "High semantic similarity (91%) and exact building match [CSE Block].",
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: "rep_03",
    description: "Entire WiFi network in CSE Lab 1 and 2 keeps dropping every 2 minutes.",
    category: "NETWORK",
    subcategory: "WIFI",
    building: "CSE Block",
    room: "Lab 1 & 2",
    severity: "HIGH",
    impact_score: 38,
    ai_status: "COMPLETED",
    incident_id: "inc_cse_net_01",
    correlation_score: 0.94,
    correlation_reason: "High semantic similarity (96%), matching category [NETWORK], within 45 min window.",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "rep_04",
    description: "Network switches in CSE Block server room are showing red diagnostic lights.",
    category: "NETWORK",
    subcategory: "EQUIPMENT",
    building: "CSE Block",
    room: "Server Room B",
    severity: "CRITICAL",
    impact_score: 45,
    ai_status: "COMPLETED",
    incident_id: "inc_cse_net_01",
    correlation_score: 0.86,
    correlation_reason: "Identical building [CSE Block] and network hardware domain alignment.",
    created_at: new Date(Date.now() - 60000 * 15).toISOString()
  },

  // --- Central Library Pipe Leak (2 Reports) ---
  {
    id: "rep_05",
    description: "Water leaking heavily from ceiling near 2nd floor restrooms in Central Library.",
    category: "PLUMBING",
    subcategory: "LEAK",
    building: "Central Library",
    room: "2nd Floor Restrooms",
    severity: "MEDIUM",
    impact_score: 25,
    ai_status: "COMPLETED",
    incident_id: "inc_lib_plumb_02",
    correlation_score: 1.0,
    correlation_reason: "Anchor report for Library plumbing incident.",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "rep_06",
    description: "Water puddle expanding in Central Library reading room aisle 4.",
    category: "PLUMBING",
    subcategory: "LEAK",
    building: "Central Library",
    room: "Reading Room Aisle 4",
    severity: "MEDIUM",
    impact_score: 28,
    ai_status: "COMPLETED",
    incident_id: "inc_lib_plumb_02",
    correlation_score: 0.88,
    correlation_reason: "Matching location [Central Library] and related water leak keywords.",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },

  // --- Mechanical Lab AC Unit (1 Report) ---
  {
    id: "rep_07",
    description: "AC unit in Mechanical Lab Workshop B is making loud metallic grinding noises and blowing warm air.",
    category: "HVAC",
    subcategory: "COOLING",
    building: "Mechanical Lab",
    room: "Workshop B",
    severity: "LOW",
    impact_score: 28,
    ai_status: "COMPLETED",
    incident_id: "inc_mech_hvac_03",
    correlation_score: 1.0,
    correlation_reason: "Anchor report for Mechanical Lab HVAC breakdown.",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },

  // --- Science Annex Main Transformer Surge (6 Reports) ---
  {
    id: "rep_08",
    description: "Loud pop heard near main breaker panel followed by complete power loss in Science Annex Physics Lab 1.",
    category: "ELECTRICAL",
    subcategory: "POWER",
    building: "Science Annex",
    room: "Physics Lab 1",
    severity: "CRITICAL",
    impact_score: 50,
    ai_status: "COMPLETED",
    incident_id: "inc_sci_elec_04",
    correlation_score: 1.0,
    correlation_reason: "Anchor report that initiated Science Annex electrical emergency.",
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: "rep_09",
    description: "All overhead lights and lab centrifuges shut off abruptly in Physics Lab 2.",
    category: "ELECTRICAL",
    subcategory: "POWER",
    building: "Science Annex",
    room: "Physics Lab 2",
    severity: "CRITICAL",
    impact_score: 48,
    ai_status: "COMPLETED",
    incident_id: "inc_sci_elec_04",
    correlation_score: 0.95,
    correlation_reason: "High semantic similarity (95%) and adjacent lab location in Science Annex.",
    created_at: new Date(Date.now() - 3600000 * 1.3).toISOString()
  },
  {
    id: "rep_10",
    description: "Burning electric smell near transformer room in Science Annex basement.",
    category: "ELECTRICAL",
    subcategory: "SAFETY",
    building: "Science Annex",
    room: "Basement Transformer Room",
    severity: "CRITICAL",
    impact_score: 55,
    ai_status: "COMPLETED",
    incident_id: "inc_sci_elec_04",
    correlation_score: 0.92,
    correlation_reason: "Identical building [Science Annex] and electrical surge root cause alignment.",
    created_at: new Date(Date.now() - 3600000 * 1.1).toISOString()
  },
  {
    id: "rep_11",
    description: "Fume hoods in Chemistry Wing 3 stopped working due to loss of main power feed.",
    category: "ELECTRICAL",
    subcategory: "SAFETY",
    building: "Science Annex",
    room: "Chemistry Wing 3",
    severity: "CRITICAL",
    impact_score: 52,
    ai_status: "COMPLETED",
    incident_id: "inc_sci_elec_04",
    correlation_score: 0.88,
    correlation_reason: "High spatial proximity and concurrent blackout arrival window.",
    created_at: new Date(Date.now() - 3600000 * 0.8).toISOString()
  },
  {
    id: "rep_12",
    description: "Emergency lighting activated in Science Annex hallway after main power surge.",
    category: "ELECTRICAL",
    subcategory: "POWER",
    building: "Science Annex",
    room: "Main Corridor",
    severity: "HIGH",
    impact_score: 40,
    ai_status: "COMPLETED",
    incident_id: "inc_sci_elec_04",
    correlation_score: 0.87,
    correlation_reason: "Correlated to transformer outage based on spatial and temporal overlap.",
    created_at: new Date(Date.now() - 3600000 * 0.4).toISOString()
  },
  {
    id: "rep_13",
    description: "Sensory equipment and computers in Optics Lab went dark after voltage spike.",
    category: "ELECTRICAL",
    subcategory: "EQUIPMENT",
    building: "Science Annex",
    room: "Optics Lab 4",
    severity: "HIGH",
    impact_score: 42,
    ai_status: "COMPLETED",
    incident_id: "inc_sci_elec_04",
    correlation_score: 0.91,
    correlation_reason: "Matching building [Science Annex] and power disruption semantic match.",
    created_at: new Date(Date.now() - 60000 * 5).toISOString()
  }
];

let mockTimeline: IncidentEvent[] = [
  // CSE Net Timeline
  {
    id: "evt_101",
    incident_id: "inc_cse_net_01",
    event_type: "CREATED",
    description: "Incident initialized from student report rep_01",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "evt_102",
    incident_id: "inc_cse_net_01",
    event_type: "REPORT_LINKED",
    description: "Correlated report rep_02 linked from CSE Room 204 (Score: 0.89)",
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: "evt_103",
    incident_id: "inc_cse_net_01",
    event_type: "EMERGING_FLAGGED",
    description: "High arrival velocity: 3 reports received within 60 minutes. Flagged as EMERGING.",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "evt_104",
    incident_id: "inc_cse_net_01",
    event_type: "SEVERITY_UPDATED",
    description: "Impact score recalculated from 52 to 78. Severity updated to HIGH.",
    created_at: new Date(Date.now() - 60000 * 15).toISOString()
  },

  // Science Annex Transformer Surge Timeline
  {
    id: "evt_201",
    incident_id: "inc_sci_elec_04",
    event_type: "CREATED",
    description: "Emergency incident initialized from report rep_08 in Physics Lab 1",
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: "evt_202",
    incident_id: "inc_sci_elec_04",
    event_type: "EMERGING_FLAGGED",
    description: "Rapid surge alert: 6 reports received within 90 minutes across Science Annex. Flagged as EMERGING.",
    created_at: new Date(Date.now() - 3600000 * 0.8).toISOString()
  },
  {
    id: "evt_203",
    incident_id: "inc_sci_elec_04",
    event_type: "SEVERITY_UPDATED",
    description: "Impact score escalated to 92/100 (CRITICAL). Campus high-voltage team notified.",
    created_at: new Date(Date.now() - 60000 * 5).toISOString()
  }
];

export const mockApiService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const active = mockIncidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
    const emerging = mockIncidents.filter(i => i.is_emerging && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
    
    // Dynamic exact report count across all mock reports
    const totalReports = mockReports.length;

    return {
      active_incidents: active,
      emerging_incidents: emerging,
      total_reports_today: totalReports,
      resolved_today: mockIncidents.filter(i => i.status === 'RESOLVED').length + 3,
      severity_breakdown: {
        CRITICAL: mockIncidents.filter(i => i.severity === 'CRITICAL').length,
        HIGH: mockIncidents.filter(i => i.severity === 'HIGH').length,
        MEDIUM: mockIncidents.filter(i => i.severity === 'MEDIUM').length,
        LOW: mockIncidents.filter(i => i.severity === 'LOW').length,
      },
      category_breakdown: {
        NETWORK: mockReports.filter(r => r.category === 'NETWORK').length,
        PLUMBING: mockReports.filter(r => r.category === 'PLUMBING').length,
        ELECTRICAL: mockReports.filter(r => r.category === 'ELECTRICAL').length,
        HVAC: mockReports.filter(r => r.category === 'HVAC').length
      },
      recent_activity: mockTimeline.slice(-5).map(evt => ({
        id: evt.id,
        incident_id: evt.incident_id,
        incident_title: mockIncidents.find(i => i.id === evt.incident_id)?.title || "Campus Incident",
        event_type: evt.event_type,
        description: evt.description,
        created_at: evt.created_at
      }))
    };
  },

  async getIncidents(params?: {
    status?: string;
    severity?: string;
    building?: string;
    is_emerging?: boolean;
  }): Promise<{ incidents: Incident[]; total: number }> {
    let result = [...mockIncidents];

    if (params?.status) {
      result = result.filter(i => i.status === params.status);
    }
    if (params?.severity) {
      result = result.filter(i => i.severity === params.severity);
    }
    if (params?.building) {
      result = result.filter(i => i.building.toLowerCase().includes(params.building!.toLowerCase()));
    }
    if (params?.is_emerging) {
      result = result.filter(i => i.is_emerging);
    }

    return {
      incidents: result,
      total: result.length
    };
  },

  async getIncidentById(id: string): Promise<{ incident: Incident; reports: Report[]; timeline: IncidentEvent[] }> {
    const incident = mockIncidents.find(i => i.id === id);
    if (!incident) {
      throw new Error(`Incident with ID ${id} not found.`);
    }

    const reports = mockReports.filter(r => r.incident_id === id);
    const timeline = mockTimeline.filter(t => t.incident_id === id);

    return {
      incident,
      reports,
      timeline
    };
  },

  async updateIncidentStatus(id: string, status: IncidentStatus, notes?: string): Promise<{ incident: Incident; event: IncidentEvent }> {
    const incident = mockIncidents.find(i => i.id === id);
    if (!incident) {
      throw new Error(`Incident ${id} not found.`);
    }

    const oldStatus = incident.status;
    incident.status = status;
    incident.updated_at = new Date().toISOString();

    const newEvent: IncidentEvent = {
      id: `evt_${Date.now()}`,
      incident_id: id,
      event_type: 'STATUS_CHANGED',
      description: `Status updated from ${oldStatus} to ${status}.${notes ? ` Notes: ${notes}` : ''}`,
      created_at: new Date().toISOString()
    };

    mockTimeline.push(newEvent);

    return {
      incident,
      event: newEvent
    };
  },

  async submitReport(data: CreateReportRequest): Promise<{ report: Report; incident: Incident }> {
    const newReportId = `rep_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    let targetIncident = mockIncidents.find(i => 
      i.building.toLowerCase() === (data.building || '').toLowerCase() &&
      i.category === (data.category || 'OTHER') &&
      i.status !== 'CLOSED' && i.status !== 'RESOLVED'
    );

    let report: Report;
    if (targetIncident) {
      targetIncident.report_count += 1;
      targetIncident.impact_score = Math.min(100, targetIncident.impact_score + 10);
      targetIncident.updated_at = now;

      report = {
        id: newReportId,
        description: data.description,
        category: data.category || targetIncident.category,
        building: data.building || targetIncident.building,
        room: data.room || "Unspecified",
        severity: targetIncident.severity,
        impact_score: 30,
        ai_status: "COMPLETED",
        incident_id: targetIncident.id,
        correlation_score: 0.91,
        correlation_reason: `Correlated to '${targetIncident.title}' due to matching location [${targetIncident.building}] and category.`,
        created_at: now
      };
    } else {
      const newIncId = `inc_${Math.random().toString(36).substring(2, 9)}`;
      targetIncident = {
        id: newIncId,
        title: `${data.building || 'Campus'} ${data.category || 'General'} Issue`,
        category: data.category || 'OTHER',
        building: data.building || 'Main Campus',
        severity: 'MEDIUM',
        impact_score: 35,
        status: 'OPEN',
        is_emerging: false,
        report_count: 1,
        summary: `New incident reported: ${data.description}`,
        recommendation: `Inspect ${data.building || 'reported location'} and triage issue.`,
        created_at: now,
        updated_at: now
      };
      mockIncidents.unshift(targetIncident);

      report = {
        id: newReportId,
        description: data.description,
        category: data.category || 'OTHER',
        building: data.building || 'Main Campus',
        room: data.room || "Unspecified",
        severity: 'MEDIUM',
        impact_score: 35,
        ai_status: "COMPLETED",
        incident_id: targetIncident.id,
        correlation_score: 1.0,
        correlation_reason: "Anchor report that created this incident.",
        created_at: now
      };
    }

    mockReports.unshift(report);
    mockTimeline.push({
      id: `evt_${Date.now()}`,
      incident_id: targetIncident.id,
      event_type: 'REPORT_LINKED',
      description: `New report linked: "${data.description.substring(0, 45)}..."`,
      created_at: now
    });

    return {
      report,
      incident: targetIncident
    };
  }
};
