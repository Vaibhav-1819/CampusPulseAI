import { AIService, AIExtractionResult, AISummaryResult, ReportInputForSummary } from './aiService';
import { IssueCategory } from '../types';

export class MockAIService implements AIService {
  async classifyAndExtract(
    description: string,
    userHint?: { category?: string; building?: string; room?: string }
  ): Promise<AIExtractionResult> {
    const text = description.toLowerCase();

    // 1. Determine Category
    let category: IssueCategory = (userHint?.category as IssueCategory) || 'OTHER';
    let subcategory: string | undefined;

    if (!userHint?.category || userHint.category === 'OTHER') {
      if (/\b(wifi|wi-fi|internet|network|ethernet|router|switch|connect|offline|ping)\b/.test(text)) {
        category = 'NETWORK';
        subcategory = text.includes('wifi') || text.includes('wi-fi') ? 'WIFI' : 'LAN';
      } else if (/\b(pipe|leak|water|sink|toilet|restroom|drain|faucet|flood)\b/.test(text)) {
        category = 'PLUMBING';
        subcategory = text.includes('leak') ? 'LEAK' : 'DRAINAGE';
      } else if (/\b(light|power|electricity|socket|plug|outlet|blackout|breaker)\b/.test(text)) {
        category = 'ELECTRICAL';
        subcategory = text.includes('light') ? 'LIGHTING' : 'POWER';
      } else if (/\b(ac|air condition|heat|heater|cold|hot|temperature|vent)\b/.test(text)) {
        category = 'HVAC';
        subcategory = 'CLIMATE';
      } else if (/\b(door|window|lock|chair|desk|table|ceiling|floor|broken)\b/.test(text)) {
        category = 'PHYSICAL';
        subcategory = 'FURNITURE';
      } else if (/\b(projector|screen|lab equipment|microscope|printer)\b/.test(text)) {
        category = 'EQUIPMENT';
        subcategory = 'LAB_DEVICE';
      } else if (/\b(fire|smoke|hazard|gas|danger|emergency)\b/.test(text)) {
        category = 'SAFETY';
        subcategory = 'HAZARD';
      }
    }

    // 2. Extract Building
    let building = userHint?.building || 'Unknown';
    if (building === 'Unknown' || !building) {
      if (/cse block|cse building|computer science/i.test(description)) {
        building = 'CSE Block';
      } else if (/library|central library/i.test(description)) {
        building = 'Central Library';
      } else if (/mechanical lab|mech block/i.test(description)) {
        building = 'Mechanical Lab';
      } else if (/science annex|science block/i.test(description)) {
        building = 'Science Annex';
      } else if (/admin block|administration/i.test(description)) {
        building = 'Admin Block';
      }
    }

    // 3. Extract Room
    let room = userHint?.room;
    if (!room) {
      const roomMatch = description.match(/\b(Lab \d+|Room \d+|Floor \d+|Hall \d+|2nd Floor [A-Za-z ]+)\b/i);
      if (roomMatch) {
        room = roomMatch[0];
      }
    }

    return {
      category,
      subcategory,
      building,
      room,
      confidence: 0.94
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const dim = 64;
    const vec = new Array(dim).fill(0);
    const cleaned = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
    const tokens = cleaned.split(/\s+/).filter(Boolean);

    // Seed domain keywords into specific vector bins for realistic cosine clustering
    const domainClusters: Record<string, number> = {
      wifi: 2, internet: 2, network: 2, router: 2, cse: 5,
      water: 14, pipe: 14, leak: 14, library: 18,
      power: 26, light: 26, electrical: 26,
      ac: 38, hvac: 38, heating: 38, annex: 42
    };

    for (const token of tokens) {
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash * 31 + token.charCodeAt(i)) & 0xffffff;
      }
      const index = hash % dim;
      vec[index] += 1.0;

      // Boost cluster dimensions if keyword matches
      if (domainClusters[token] !== undefined) {
        const clusterIndex = domainClusters[token];
        vec[clusterIndex] += 3.5;
      }
    }

    // Unit normalize the vector so dot product equals cosine similarity
    let norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) norm = 1;
    return vec.map(val => val / norm);
  }

  async generateSummaryAndRecommendation(
    category: IssueCategory,
    building: string,
    reports: ReportInputForSummary[]
  ): Promise<AISummaryResult> {
    const count = reports.length;
    const rooms = Array.from(new Set(reports.map(r => r.room).filter(Boolean)));
    const roomsStr = rooms.length > 0 ? ` (affecting ${rooms.join(', ')})` : '';

    let title = `${building} ${category} Issue`;
    let summary = '';
    let recommendation = '';

    if (category === 'NETWORK') {
      title = `${building} Network Disruption`;
      summary = `Multiple students (${count} reports) report total WiFi and internet connectivity loss in ${building}${roomsStr}. Access points appear unresponsive.`;
      recommendation = `Dispatch network field engineer to ${building}. Inspect core floor switches, verify DHCP/DNS server availability, and reboot local access points.`;
    } else if (category === 'PLUMBING') {
      title = `${building} Plumbing Hazard`;
      summary = `${count} report(s) indicate active water leaks in ${building}${roomsStr}. Risk of interior water damage to study spaces.`;
      recommendation = `Immediately shut off the main isolation valve for the affected wing in ${building} and dispatch facilities plumbing crew.`;
    } else if (category === 'ELECTRICAL') {
      title = `${building} Electrical Outage`;
      summary = `${count} report(s) report power loss or tripping circuit breakers in ${building}${roomsStr}.`;
      recommendation = `Inspect distribution board and circuit breakers for ${building}. Verify no overload on lab sub-panels.`;
    } else if (category === 'HVAC') {
      title = `${building} HVAC System Malfunction`;
      summary = `${count} report(s) highlight heating/cooling failure in ${building}${roomsStr}.`;
      recommendation = `Inspect rooftop chiller/condenser units and verify thermostat sensor calibration.`;
    } else {
      title = `${building} ${category} Incident`;
      summary = `${count} student report(s) received regarding infrastructure maintenance in ${building}${roomsStr}.`;
      recommendation = `Assign campus facilities maintenance technician to inspect and resolve.`;
    }

    return { title, summary, recommendation };
  }
}
