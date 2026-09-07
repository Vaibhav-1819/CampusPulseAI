import { Incident, Report } from '../types';

export interface CorrelationMatch {
  incident: Incident;
  score: number;
  semanticSimilarity: number;
  locationScore: number;
  categoryScore: number;
  temporalScore: number;
  reason: string;
}

export class CorrelationEngine {
  public static readonly CLUSTERING_THRESHOLD = 0.68;

  // Weight constants as specified in architecture
  public static readonly WEIGHT_SEMANTIC = 0.55;
  public static readonly WEIGHT_LOCATION = 0.20;
  public static readonly WEIGHT_CATEGORY = 0.15;
  public static readonly WEIGHT_TEMPORAL = 0.10;

  /**
   * Calculates cosine similarity between two float vectors.
   * Assumes vectors are of equal length.
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.max(0, Math.min(1, similarity));
  }

  /**
   * Evaluates location compatibility between incoming report and existing incident.
   */
  static calculateLocationScore(reportBuilding: string, incidentBuilding: string): number {
    const rB = reportBuilding.trim().toLowerCase();
    const iB = incidentBuilding.trim().toLowerCase();

    if (rB === iB) return 1.0;

    // Partial building match (e.g. "CSE Block" vs "CSE")
    if (rB.includes(iB) || iB.includes(rB)) return 0.75;

    // Check shared campus zones
    const engineeringZone = ['cse block', 'mechanical lab', 'electrical lab', 'tech center'];
    if (engineeringZone.some(b => rB.includes(b)) && engineeringZone.some(b => iB.includes(b))) {
      return 0.40;
    }

    return 0.0;
  }

  /**
   * Evaluates category compatibility.
   */
  static calculateCategoryScore(reportCategory: string, incidentCategory: string): number {
    if (reportCategory === incidentCategory) return 1.0;

    // Cross-domain correlations
    if (
      (reportCategory === 'NETWORK' && incidentCategory === 'ELECTRICAL') ||
      (reportCategory === 'ELECTRICAL' && incidentCategory === 'NETWORK')
    ) {
      return 0.40; // Power outages often cause network loss
    }

    return 0.0;
  }

  /**
   * Computes temporal decay based on elapsed hours.
   */
  static calculateTemporalScore(reportCreatedAt: Date, incidentUpdatedAt: Date): number {
    const diffMs = Math.abs(reportCreatedAt.getTime() - incidentUpdatedAt.getTime());
    const diffHours = diffMs / (1000 * 60 * 60);

    // Half-life decay over 12 hours: exp(-diffHours / 12)
    return Math.exp(-diffHours / 12);
  }

  /**
   * Evaluates a report against an active incident to produce a multi-factor score and explainability string.
   */
  static evaluateCorrelation(
    report: {
      category: string;
      building: string;
      embedding?: number[];
      created_at: string;
    },
    incident: Incident,
    incidentCentroidEmbedding?: number[]
  ): CorrelationMatch {
    // 1. Semantic Similarity
    let semanticSim = 0.5; // Neutral baseline if embeddings missing
    if (report.embedding && incidentCentroidEmbedding) {
      semanticSim = this.cosineSimilarity(report.embedding, incidentCentroidEmbedding);
    }

    // 2. Location
    const locScore = this.calculateLocationScore(report.building, incident.building);

    // 3. Category
    const catScore = this.calculateCategoryScore(report.category, incident.category);

    // 4. Temporal
    const tempScore = this.calculateTemporalScore(
      new Date(report.created_at),
      new Date(incident.updated_at)
    );

    // Multi-factor weighted sum
    const totalScore =
      this.WEIGHT_SEMANTIC * semanticSim +
      this.WEIGHT_LOCATION * locScore +
      this.WEIGHT_CATEGORY * catScore +
      this.WEIGHT_TEMPORAL * tempScore;

    const roundedScore = Math.round(totalScore * 100) / 100;
    const roundedSem = Math.round(semanticSim * 100);

    // Explainability sentence
    const reason = `Correlated to '${incident.title}' (${Math.round(totalScore * 100)}% match): ${roundedSem}% semantic similarity, ${
      locScore === 1.0 ? 'identical building [' + incident.building + ']' : locScore > 0 ? 'nearby location' : 'different location'
    }, ${catScore === 1.0 ? 'matching category [' + incident.category + ']' : 'related category'}.`;

    return {
      incident,
      score: roundedScore,
      semanticSimilarity: semanticSim,
      locationScore: locScore,
      categoryScore: catScore,
      temporalScore: tempScore,
      reason
    };
  }

  /**
   * Finds the best matching active incident among candidate incidents.
   */
  static findBestMatch(
    report: {
      category: string;
      building: string;
      embedding?: number[];
      created_at: string;
    },
    activeIncidents: Incident[],
    incidentEmbeddings: Map<string, number[]>
  ): CorrelationMatch | null {
    let bestMatch: CorrelationMatch | null = null;

    for (const incident of activeIncidents) {
      const centroid = incidentEmbeddings.get(incident.id);
      const match = this.evaluateCorrelation(report, incident, centroid);

      if (match.score >= this.CLUSTERING_THRESHOLD) {
        if (!bestMatch || match.score > bestMatch.score) {
          bestMatch = match;
        }
      }
    }

    return bestMatch;
  }
}
