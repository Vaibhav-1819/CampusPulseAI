/**
 * CampusPulse AI — Shared TypeScript Domain Types & API Interfaces
 * 
 * Single source of truth shared across Backend (/backend) and Frontend (/frontend).
 */

export type UserRole = 'student' | 'staff' | 'admin';

export type IssueCategory = 
  | 'NETWORK' 
  | 'ELECTRICAL' 
  | 'PLUMBING' 
  | 'HVAC' 
  | 'PHYSICAL' 
  | 'EQUIPMENT' 
  | 'SAFETY' 
  | 'OTHER';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'OPEN' 
  | 'INVESTIGATING' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'CLOSED';

export type AIProcessingStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type IncidentEventType = 
  | 'CREATED' 
  | 'REPORT_LINKED' 
  | 'STATUS_CHANGED' 
  | 'SEVERITY_UPDATED' 
  | 'EMERGING_FLAGGED' 
  | 'AI_UPDATED';

// --- Domain Models ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Report {
  id: string;
  user_id?: string;
  description: string;
  category: IssueCategory;
  subcategory?: string;
  building: string;
  room?: string;
  severity: SeverityLevel;
  impact_score: number;
  ai_status: AIProcessingStatus;
  ai_error?: string;
  embedding?: string; // JSON string in DB, or number[] in memory
  incident_id?: string;
  correlation_score?: number;
  correlation_reason?: string;
  created_at: string;
}

export interface Incident {
  id: string;
  title: string;
  category: IssueCategory;
  building: string;
  severity: SeverityLevel;
  impact_score: number;
  status: IncidentStatus;
  summary?: string;
  recommendation?: string;
  is_emerging: boolean;
  report_count: number;
  created_at: string;
  updated_at: string;
}

export interface IncidentEvent {
  id: string;
  incident_id: string;
  event_type: IncidentEventType;
  description: string;
  metadata?: Record<string, any> | string;
  created_at: string;
}

// --- API Request / Response Envelopes ---

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any[];
}

export interface CreateReportRequest {
  description: string;
  user_id?: string;
  building?: string;
  room?: string;
  category?: IssueCategory;
}

export interface CreateReportResponseData {
  report: Report;
  incident: Incident;
}

export interface IncidentDetailResponseData {
  incident: Incident;
  reports: Report[];
  timeline: IncidentEvent[];
}

export interface UpdateIncidentStatusRequest {
  status: IncidentStatus;
  notes?: string;
}

export interface DashboardStats {
  active_incidents: number;
  emerging_incidents: number;
  total_reports_today: number;
  resolved_today: number;
  severity_breakdown: Record<SeverityLevel, number>;
  category_breakdown: Record<string, number>;
  recent_activity: {
    id: string;
    incident_id: string;
    incident_title: string;
    event_type: IncidentEventType;
    description: string;
    created_at: string;
  }[];
}
