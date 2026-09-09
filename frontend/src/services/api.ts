import { 
  Incident, 
  Report, 
  IncidentEvent, 
  DashboardStats, 
  IncidentStatus,
  CreateReportRequest,
  CreateReportResponseData,
  ApiResponse
} from '../types';
import { mockApiService } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface IncidentFilterParams {
  status?: string;
  severity?: string;
  building?: string;
  is_emerging?: boolean;
}

/**
 * LiveApiClient: Direct static API client utilized by Student Portal reportService
 */
export class LiveApiClient {
  static async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) return false;
      const json = await res.json();
      return json.success === true;
    } catch {
      return false;
    }
  }

  static async submitReport(payload: CreateReportRequest): Promise<CreateReportResponseData> {
    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const json: ApiResponse<CreateReportResponseData> = await res.json();

    if (!res.ok || !json.success || !json.data) {
      const errorMessage = json.error?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    return json.data;
  }
}

/**
 * ApiClient: Stateful API client with mock fallback utilized by Admin Command Center
 */
export class ApiClient {
  private useMockFallback: boolean = false;
  private forceMockMode: boolean = false;

  public setForceMockMode(value: boolean) {
    this.forceMockMode = value;
  }

  public toggleForceMockMode(): boolean {
    this.forceMockMode = !this.forceMockMode;
    return this.forceMockMode;
  }

  public isUsingMock(): boolean {
    return this.forceMockMode || this.useMockFallback;
  }

  public isForceMock(): boolean {
    return this.forceMockMode;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (this.forceMockMode) {
      throw new Error('MOCK_MODE_ACTIVE');
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const json: ApiResponse<T> = await response.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || 'API response indicated failure.');
      }

      this.useMockFallback = false;
      return json.data;
    } catch (err: any) {
      this.useMockFallback = true;
      throw err;
    }
  }

  /**
   * Fetch aggregated dashboard KPI telemetry
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return await this.request<DashboardStats>('/dashboard/stats');
    } catch {
      return await mockApiService.getDashboardStats();
    }
  }

  /**
   * Fetch list of incidents with optional filtering
   */
  async getIncidents(params?: IncidentFilterParams): Promise<{ incidents: Incident[]; total: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.severity) query.append('severity', params.severity);
      if (params?.building) query.append('building', params.building);
      if (params?.is_emerging !== undefined) query.append('is_emerging', String(params.is_emerging));

      const queryString = query.toString() ? `?${query.toString()}` : '';
      return await this.request<{ incidents: Incident[]; total: number }>(`/incidents${queryString}`);
    } catch {
      return await mockApiService.getIncidents(params);
    }
  }

  /**
   * Fetch single incident with correlated reports and timeline
   */
  async getIncidentById(id: string): Promise<{ incident: Incident; reports: Report[]; timeline: IncidentEvent[] }> {
    try {
      return await this.request<{ incident: Incident; reports: Report[]; timeline: IncidentEvent[] }>(`/incidents/${id}`);
    } catch {
      return await mockApiService.getIncidentById(id);
    }
  }

  /**
   * Update operational status of an incident (triage action)
   */
  async updateIncidentStatus(id: string, status: IncidentStatus, notes?: string): Promise<{ incident: Incident; event: IncidentEvent }> {
    try {
      return await this.request<{ incident: Incident; event: IncidentEvent }>(`/incidents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      return await mockApiService.updateIncidentStatus(id, status, notes);
    }
  }

  /**
   * Submit a new student report
   */
  async submitReport(payload: CreateReportRequest): Promise<CreateReportResponseData> {
    try {
      return await this.request<CreateReportResponseData>('/reports', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return await mockApiService.submitReport(payload);
    }
  }

  /**
   * Check backend health
   */
  async checkHealth(): Promise<boolean> {
    if (this.forceMockMode) {
      return false;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();

