import { IssueCategory, SeverityLevel } from '../types';

export class SeverityCalculator {
  private static readonly BASE_CATEGORY_WEIGHTS: Record<IssueCategory, number> = {
    SAFETY: 40,
    NETWORK: 25,
    ELECTRICAL: 25,
    HVAC: 25,
    PLUMBING: 20,
    EQUIPMENT: 15,
    PHYSICAL: 15,
    OTHER: 15
  };

  private static readonly CRITICAL_BUILDINGS = [
    'cse block',
    'central library',
    'server room',
    'exam center',
    'main lab'
  ];

  static calculateImpactScore(params: {
    category: IssueCategory;
    reportCount: number;
    building?: string;
    isEmerging?: boolean;
  }): number {
    const baseWeight = this.BASE_CATEGORY_WEIGHTS[params.category] || 15;
    const reportMultiplier = (params.reportCount - 1) * 8; // Anchor report is covered by base weight, each additional report adds 8

    let buildingModifier = 5; // Default general building
    if (params.building) {
      const bLower = params.building.toLowerCase();
      if (this.CRITICAL_BUILDINGS.some(b => bLower.includes(b))) {
        buildingModifier = 15;
      }
    }

    const emergingBonus = params.isEmerging ? 15 : 0;

    const rawScore = baseWeight + reportMultiplier + buildingModifier + emergingBonus;
    return Math.max(0, Math.min(100, rawScore));
  }

  static determineSeverityLevel(impactScore: number): SeverityLevel {
    if (impactScore >= 85) return 'CRITICAL';
    if (impactScore >= 60) return 'HIGH';
    if (impactScore >= 35) return 'MEDIUM';
    return 'LOW';
  }

  static evaluateIncidentImpact(
    category: IssueCategory,
    reportCount: number,
    building: string,
    isEmerging: boolean
  ): { impactScore: number; severity: SeverityLevel } {
    const impactScore = this.calculateImpactScore({
      category,
      reportCount,
      building,
      isEmerging
    });

    const severity = this.determineSeverityLevel(impactScore);
    return { impactScore, severity };
  }
}
