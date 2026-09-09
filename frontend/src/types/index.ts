/**
 * CampusPulse AI — Frontend Types
 * Adheres strictly to /shared/types/index.ts and API contracts
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
  embedding?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any[];
  } | null;
}

export interface SubmittedTicket {
  report: Report;
  incident: Incident;
  submittedAt: string;
}
