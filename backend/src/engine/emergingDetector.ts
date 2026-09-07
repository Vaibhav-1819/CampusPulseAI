import { Report } from '../types';

export interface EmergingCheckResult {
  isEmerging: boolean;
  velocityPerHour: number;
  reason?: string;
}

export class EmergingDetector {
  public static readonly VELOCITY_THRESHOLD_REPORTS_PER_HOUR = 3;

  /**
   * Analyzes an array of reports belonging to an incident to determine if velocity warrants an emerging spike flag.
   */
  static evaluateVelocity(reports: { created_at: string }[]): EmergingCheckResult {
    if (reports.length < 3) {
      return { isEmerging: false, velocityPerHour: reports.length };
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Count reports within the last 60 minutes
    const recentReports = reports.filter(r => new Date(r.created_at) >= oneHourAgo);
    const countInPastHour = recentReports.length;

    if (countInPastHour >= this.VELOCITY_THRESHOLD_REPORTS_PER_HOUR) {
      return {
        isEmerging: true,
        velocityPerHour: countInPastHour,
        reason: `Rapid surge detected: ${countInPastHour} reports received in the past 60 minutes (threshold: ${this.VELOCITY_THRESHOLD_REPORTS_PER_HOUR}/hr).`
      };
    }

    // Also check inter-arrival burst: if last 3 reports arrived within 45 minutes
    if (reports.length >= 3) {
      const sorted = [...reports].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const latest = new Date(sorted[0].created_at).getTime();
      const thirdLatest = new Date(sorted[2].created_at).getTime();
      const diffMinutes = (latest - thirdLatest) / (1000 * 60);

      if (diffMinutes <= 45) {
        return {
          isEmerging: true,
          velocityPerHour: Math.round((3 / (diffMinutes / 60)) * 10) / 10,
          reason: `High frequency spike: 3 reports received within ${Math.round(diffMinutes)} minutes.`
        };
      }
    }

    return {
      isEmerging: false,
      velocityPerHour: countInPastHour
    };
  }
}
