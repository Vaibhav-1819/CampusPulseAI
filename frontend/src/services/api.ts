import { CreateReportRequest, CreateReportResponseData, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
