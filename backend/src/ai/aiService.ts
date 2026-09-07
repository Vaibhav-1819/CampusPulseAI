import { IssueCategory } from '../types';

export interface AIExtractionResult {
  category: IssueCategory;
  subcategory?: string;
  building: string;
  room?: string;
  confidence: number;
}

export interface AISummaryResult {
  title: string;
  summary: string;
  recommendation: string;
}

export interface ReportInputForSummary {
  description: string;
  building: string;
  room?: string;
  created_at: string;
}

export interface AIService {
  classifyAndExtract(
    description: string,
    userHint?: { category?: string; building?: string; room?: string }
  ): Promise<AIExtractionResult>;

  generateEmbedding(text: string): Promise<number[]>;

  generateSummaryAndRecommendation(
    category: IssueCategory,
    building: string,
    reports: ReportInputForSummary[]
  ): Promise<AISummaryResult>;
}
