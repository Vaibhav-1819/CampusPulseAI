import { CreateReportRequest, CreateReportResponseData } from '../types';
import { LiveApiClient } from './api';
import { MockApiClient } from './mockApi';

export type BackendConnectionMode = 'detecting' | 'live' | 'mock';

class ReportServiceManager {
  private mode: BackendConnectionMode = 'detecting';
  private listeners: ((mode: BackendConnectionMode) => void)[] = [];

  constructor() {
    this.detectBackend();
  }

  public getMode(): BackendConnectionMode {
    return this.mode;
  }

  public subscribe(listener: (mode: BackendConnectionMode) => void): () => void {
    this.listeners.push(listener);
    listener(this.mode);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.mode));
  }

  public async detectBackend(): Promise<BackendConnectionMode> {
    const isLive = await LiveApiClient.checkHealth();
    this.mode = isLive ? 'live' : 'mock';
    this.notify();
    return this.mode;
  }

  public setMode(newMode: 'live' | 'mock') {
    this.mode = newMode;
    this.notify();
  }

  public async submitReport(payload: CreateReportRequest): Promise<CreateReportResponseData> {
    // If set to live, try live; on network error fall back to mock
    if (this.mode === 'live') {
      try {
        return await LiveApiClient.submitReport(payload);
      } catch (err: any) {
        console.warn('[ReportService] Live submission failed, falling back to mock:', err.message);
        this.mode = 'mock';
        this.notify();
        return await MockApiClient.submitReport(payload);
      }
    }

    return await MockApiClient.submitReport(payload);
  }
}

export const reportService = new ReportServiceManager();
