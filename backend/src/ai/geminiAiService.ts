import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService, AIExtractionResult, AISummaryResult, ReportInputForSummary } from './aiService';
import { IssueCategory } from '../types';

export class GeminiAIService implements AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  private ensureClient(): GoogleGenerativeAI {
    if (!this.genAI) {
      this.apiKey = process.env.GEMINI_API_KEY || '';
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in environment.');
      }
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
    return this.genAI;
  }

  async classifyAndExtract(
    description: string,
    userHint?: { category?: string; building?: string; room?: string }
  ): Promise<AIExtractionResult> {
    const ai = this.ensureClient();
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
You are CampusPulse AI, an intelligent campus facility report parser.
Analyze this student complaint and extract structured information.

Allowed categories: ["NETWORK", "ELECTRICAL", "PLUMBING", "HVAC", "PHYSICAL", "EQUIPMENT", "SAFETY", "OTHER"]
Standard buildings: ["CSE Block", "Central Library", "Mechanical Lab", "Science Annex", "Admin Block", "Hostel Block"]

User Hints:
- Selected Category: ${userHint?.category || 'None'}
- Selected Building: ${userHint?.building || 'None'}
- Selected Room: ${userHint?.room || 'None'}

Student Report:
"${description}"

Return JSON matching this exact structure:
{
  "category": "NETWORK",
  "subcategory": "WIFI",
  "building": "CSE Block",
  "room": "Lab 3",
  "confidence": 0.95
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    return {
      category: (parsed.category as IssueCategory) || 'OTHER',
      subcategory: parsed.subcategory || undefined,
      building: parsed.building || userHint?.building || 'Unknown',
      room: parsed.room || userHint?.room || undefined,
      confidence: parsed.confidence || 0.9
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const ai = this.ensureClient();
    const model = ai.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  async generateSummaryAndRecommendation(
    category: IssueCategory,
    building: string,
    reports: ReportInputForSummary[]
  ): Promise<AISummaryResult> {
    const ai = this.ensureClient();
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
You are the Campus Operations Intelligence Analyst. Synthesize these correlated student complaints into a high-level incident overview and recommended action for facilities.

Category: ${category}
Building: ${building}
Reports:
${reports.map((r, i) => `${i + 1}. [${r.created_at}] Room: ${r.room || 'N/A'} - "${r.description}"`).join('\n')}

Respond with JSON matching this exact format:
{
  "title": "Concise 3-6 word incident title",
  "summary": "2 sentence synthesis of the disruption and scope",
  "recommendation": "1-2 actionable technical steps for campus facilities staff"
}
`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    return {
      title: parsed.title || `${building} ${category} Incident`,
      summary: parsed.summary || 'Multiple reports received.',
      recommendation: parsed.recommendation || 'Dispatch maintenance staff.'
    };
  }
}
