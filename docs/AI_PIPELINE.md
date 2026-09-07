# CampusPulse AI — AI Pipeline & Incident Intelligence Engine

This document provides the full technical specification for CampusPulse AI's dual-tier intelligence pipeline: the **AI Service Layer** (semantic understanding, extraction, embeddings, summarization) and the **Incident Intelligence Engine** (deterministic correlation, weighted scoring, impact calculation, and emerging incident detection).

---

## 1. Intelligence Philosophy: Hybrid AI + Deterministic Logic

CampusPulse AI rejects two common anti-patterns:
1. **The "LLM-Does-Everything" Anti-Pattern:** Routing mathematical similarity, time windows, and threshold calculations through non-deterministic LLM prompts is brittle, slow, expensive, and non-reproducible.
2. **The "Pure-Vector-Search" Anti-Pattern:** Relying solely on embedding similarity groups reports with similar words regardless of whether they occurred in the same building or months apart.

### The Hybrid Solution
```
┌────────────────────────────────────────────────────────┐
│                   AI Layer (LLM & Embeddings)          │
│  - Issue Domain Classification                         │
│  - Structured Information Extraction (Building, Room)   │
│  - Semantic Vector Embeddings                          │
│  - Natural Language Incident Summarization             │
│  - Prescriptive Facilities Recommendations             │
└──────────────────────────┬─────────────────────────────┘
                           │ Outputs Enriched Data
                           ▼
┌────────────────────────────────────────────────────────┐
│        Incident Intelligence Engine (Deterministic)     │
│  - Multi-Factor Correlation Formula                    │
│  - Cosine Similarity Dot-Product Math                  │
│  - Spatial & Category Exact/Fuzzy Matching             │
│  - Temporal Decay Windowing                            │
│  - Dynamic Severity & Impact Scoring (0-100)           │
│  - Emerging Incident Velocity & Spike Detection        │
│  - Explainability Generation                           │
└────────────────────────────────────────────────────────┘
```

---

## 2. AIService Abstraction Architecture

All AI interactions flow through a unified TypeScript interface:

```typescript
export interface AIExtractionResult {
  category: 'NETWORK' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'PHYSICAL' | 'EQUIPMENT' | 'SAFETY' | 'OTHER';
  subcategory: string;
  building: string;
  room?: string;
  equipment?: string;
  confidence: number;
}

export interface AISummaryResult {
  title: string;
  summary: string;
  recommendation: string;
}

export interface AIService {
  classifyAndExtract(description: string, userHint?: { category?: string; building?: string; room?: string }): Promise<AIExtractionResult>;
  generateEmbedding(text: string): Promise<number[]>;
  generateSummaryAndRecommendation(incidentTitle: string, reports: { description: string; building: string; room?: string; created_at: string }[]): Promise<AISummaryResult>;
}
```

### 2.1 MockAIService (Local, Deterministic & Offline)
- **Zero API Keys Required:** Runs offline with zero network latency.
- **Classification:** Keyword taxonomy matching (e.g., "wifi", "internet", "router" → `NETWORK`, "leak", "pipe", "water" → `PLUMBING`).
- **Extraction:** Regex pattern extractors for standard campus buildings (`CSE Block`, `Mechanical Lab`, `Library`, `Admin Block`, `Science Annex`) and rooms (`Lab \d+`, `Room \d+`, `Floor \d+`).
- **Embeddings:** Generates deterministic 64-dimensional unit-normalized pseudo-vectors based on string hashing, ensuring identical or synonymous sentences produce high cosine similarity.
- **Summarization:** Rule-based template generator synthesizing reports into crisp summaries and actionable steps.

### 2.2 GeminiAIService (Google Gemini API)
- **Model:** `gemini-1.5-flash` or `gemini-2.0-flash`.
- **Extraction Mode:** Strict JSON Schema Structured Output (`responseMimeType: "application/json"`).
- **Embeddings:** `text-embedding-004` (768-dimensional float vectors).
- **Prompt Strategy:** Structured system instructions enforcing campus taxonomy and strict extraction rules.

### 2.3 Resilient Fallback Pattern
```typescript
class AIServiceAdapter implements AIService {
  constructor(private geminiService: GeminiAIService, private mockService: MockAIService) {}

  async classifyAndExtract(text: string, hints?: any): Promise<AIExtractionResult> {
    try {
      if (process.env.AI_PROVIDER === 'gemini' && process.env.GEMINI_API_KEY) {
        return await this.geminiService.classifyAndExtract(text, hints);
      }
    } catch (error) {
      console.warn('Gemini AI failed, smoothly falling back to MockAIService:', error);
    }
    return this.mockService.classifyAndExtract(text, hints);
  }
  // Similar fallbacks for embeddings and summarization...
}
```

---

## 3. Incident Correlation Engine

When a new report arrives, the engine compares it against all currently active incidents (`status IN ('OPEN', 'INVESTIGATING')`) to determine if it should be clustered into an existing incident or spawn a new one.

### 3.1 Multi-Factor Scoring Formula
Correlation score between incoming report $R$ and active incident $I$:

$$\text{Score}(R, I) = (0.55 \times S_{\text{semantic}}) + (0.20 \times S_{\text{location}}) + (0.15 \times S_{\text{category}}) + (0.10 \times S_{\text{temporal}})$$

Where:
1. **Semantic Similarity ($S_{\text{semantic}} \in [0, 1]$):**
   Cosine similarity between incoming report embedding and the incident's centroid embedding (or latest report embedding):
   $$\text{CosineSim}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
2. **Location Match ($S_{\text{location}} \in \{0.0, 0.5, 1.0\}$):**
   - Exact building match: $1.0$
   - Adjacent or same campus zone: $0.5$
   - Mismatched building: $0.0$
3. **Category Match ($S_{\text{category}} \in \{0.0, 0.5, 1.0\}$):**
   - Exact category match: $1.0$
   - Related subcategory match: $0.5$
   - Different category: $0.0$
4. **Temporal Proximity ($S_{\text{temporal}} \in [0, 1]$):**
   Exponential decay based on elapsed hours $\Delta t$ since the incident's most recent report:
   $$S_{\text{temporal}} = \exp\left(-\frac{\Delta t}{12}\right)$$
   *(Reports within 1 hour score ~0.92; reports after 12 hours score ~0.37; reports after 24 hours score <0.13)*

### 3.2 Clustering Threshold
- **Threshold:** $\text{Score} \ge 0.68$
- If $\max_I \text{Score}(R, I) \ge 0.68$:
  - Report $R$ is assigned to incident $I$.
  - Incident report count is incremented.
  - Centroid embedding is incrementally updated.
- Else:
  - New incident $I_{\text{new}}$ is initialized with report $R$ as its anchor.

### 3.3 Explainability String Generation
Every correlated report stores a human-readable explanation in `reports.correlation_reason`.

**Example:**
> *"Grouped into 'CSE Block Network Failure' (Correlation: 86%) due to high semantic similarity (91%), matching building [CSE Block], matching category [NETWORK], and submission within 45 minutes of previous report."*

This empowers campus administrators to immediately trust and audit AI grouping decisions.

---

## 4. Severity & Impact Scoring Algorithm

Every incident recalculates its dynamic **Impact Score (0-100)** and **Severity Tier** whenever a new report is linked.

### 4.1 Impact Score Formula
$$\text{ImpactScore} = \min\left(100, \text{BaseWeight}(\text{Category}) + (\text{ReportCount} \times 8) + \text{BuildingModifier} + \text{VelocityBonus}\right)$$

- **Base Category Weight:**
  - `SAFETY`: 40 pts
  - `NETWORK`, `ELECTRICAL`, `HVAC`: 25 pts
  - `PLUMBING`: 20 pts
  - `EQUIPMENT`, `PHYSICAL`, `OTHER`: 15 pts
- **Report Count Multiplier:** 8 points per linked student report.
- **Building Modifier:**
  - Critical Facilities (e.g., Exam Center, Server Room, Main Library, Central Labs): +15 pts
  - General Academic Blocks: +5 pts
  - Auxiliary/Sports Facilities: 0 pts
- **Velocity Bonus:** +15 pts if flagged as an **Emerging Incident**.

### 4.2 Severity Tier Mapping
- `CRITICAL`: Impact Score $\ge 85$
- `HIGH`: Impact Score $60 - 84$
- `MEDIUM`: Impact Score $35 - 59$
- `LOW`: Impact Score $< 35$

---

## 5. Emerging Incident Detection

A key differentiator of CampusPulse AI is detecting an infrastructure crisis *before* it cascades.

### 5.1 Detection Criteria
An incident is flagged as `is_emerging = 1` if either condition is met:
1. **Surge Threshold:** $\ge 3$ reports received within a sliding 60-minute window for the same incident or building/category cluster.
2. **Acceleration Spike:** The arrival rate in the current 30-minute window is $\ge 2.5\times$ the arrival rate of the previous 60-minute window.

### 5.2 System Action on Emerging Spike
1. Update `incidents.is_emerging = 1`.
2. Insert timeline event into `incident_events`:
   - `event_type = 'EMERGING_FLAGGED'`
   - `description = 'Velocity alert: 4 reports received in past 45 minutes. Issue flagged as rapidly emerging.'`
3. Trigger priority notification badge on Admin Dashboard.
4. Recalculate impact score with velocity bonus (+15).
5. Request AI to update recommendation focusing on urgent containment.
