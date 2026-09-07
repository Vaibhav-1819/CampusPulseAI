import { AIService, AIExtractionResult, AISummaryResult, ReportInputForSummary } from './aiService';
import { MockAIService } from './mockAiService';
import { GeminiAIService } from './geminiAiService';
import { IssueCategory, AIProcessingStatus } from '../types';

export interface ExtractionWithStatus {
  result: AIExtractionResult;
  ai_status: AIProcessingStatus;
  ai_error?: string;
}

export class AIServiceAdapter implements AIService {
  private mockService = new MockAIService();
  private geminiService = new GeminiAIService();

  private isGeminiEnabled(): boolean {
    return process.env.AI_PROVIDER === 'gemini' && Boolean(process.env.GEMINI_API_KEY);
  }

  async classifyAndExtractWithStatus(
    description: string,
    userHint?: { category?: string; building?: string; room?: string }
  ): Promise<ExtractionWithStatus> {
    if (this.isGeminiEnabled()) {
      try {
        const result = await this.geminiService.classifyAndExtract(description, userHint);
        return { result, ai_status: 'COMPLETED' };
      } catch (error: any) {
        console.warn('[AIServiceAdapter] Gemini extraction failed, falling back to MockAIService:', error.message);
        const fallback = await this.mockService.classifyAndExtract(description, userHint);
        return { result: fallback, ai_status: 'FAILED', ai_error: error.message };
      }
    }

    // Default mock execution
    const mockResult = await this.mockService.classifyAndExtract(description, userHint);
    return { result: mockResult, ai_status: 'COMPLETED' };
  }

  async classifyAndExtract(
    description: string,
    userHint?: { category?: string; building?: string; room?: string }
  ): Promise<AIExtractionResult> {
    const wrapped = await this.classifyAndExtractWithStatus(description, userHint);
    return wrapped.result;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.isGeminiEnabled()) {
      try {
        return await this.geminiService.generateEmbedding(text);
      } catch (error: any) {
        console.warn('[AIServiceAdapter] Gemini embedding failed, falling back to MockAIService:', error.message);
      }
    }
    return this.mockService.generateEmbedding(text);
  }

  async generateSummaryAndRecommendation(
    category: IssueCategory,
    building: string,
    reports: ReportInputForSummary[]
  ): Promise<AISummaryResult> {
    if (this.isGeminiEnabled()) {
      try {
        return await this.geminiService.generateSummaryAndRecommendation(category, building, reports);
      } catch (error: any) {
        console.warn('[AIServiceAdapter] Gemini summary failed, falling back to MockAIService:', error.message);
      }
    }
    return this.mockService.generateSummaryAndRecommendation(category, building, reports);
  }
}
