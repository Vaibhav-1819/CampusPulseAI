/**
 * CampusPulse AI — Frontend Types
 * Single source of truth unifying /shared/types and frontend-specific ticket models
 */

export * from '@shared/types';

import { Report, Incident } from '@shared/types';

export interface SubmittedTicket {
  report: Report;
  incident: Incident;
  submittedAt: string;
}

