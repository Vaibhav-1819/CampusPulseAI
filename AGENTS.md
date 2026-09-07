# AGENTS.md — CampusPulse AI Development & Agent Operating Manual

> **MANDATORY NOTICE FOR ALL AI CODING AGENTS AND HUMAN DEVELOPERS**
> Every AI agent and human engineer MUST read this file in its entirety before creating, updating, or deleting any files in this repository.
> **DO NOT modify files outside your assigned ownership boundary without explicit architectural review.**

---

## 1. What CampusPulse AI Is

**CampusPulse AI** is an intelligent campus infrastructure incident detection system.
- **Tagline:** *From scattered complaints to campus intelligence.*
- **One-Line Mission:** Transforms scattered, uncoordinated student reports into correlated, prioritized, and explainable campus infrastructure incidents.
- **Core Value:** Single student complaints look isolated. When correlated across space, time, semantics, and category, they reveal systemic failures. CampusPulse detects these **underlying incidents** and alerts administrators to **emerging trends** before disruptions escalate.

### Core Workflow
```
Student Report
  ↓
AI Understanding & Categorization
  ↓
Information Extraction (Building, Room, Equipment)
  ↓
Semantic Similarity & Embedding Generation
  ↓
Multi-Factor Incident Correlation (Deterministic Weighted Scoring)
  ↓
Incident Creation / Update
  ↓
Severity & Impact Scoring (0-100)
  ↓
Emerging Incident Detection (Velocity & Spike Analysis)
  ↓
AI Summary & Action Recommendation Generation
  ↓
Admin Review, Triage & Status Update
```

---

## 2. Product Goals & Hackathon Scope (48 Hours)

CampusPulse is a **hackathon MVP**, NOT an over-engineered enterprise distributed platform.

### Priorities
1. **Working End-to-End Demo Flow:** Student report → AI parsing → Correlation → Incident creation → Emerging spike → Admin dashboard action.
2. **Reliability:** The system must never crash if an external AI API fails or network drops.
3. **Explainability:** Admins must see *why* reports were grouped (e.g. "88% correlation: High semantic similarity, identical building [CSE Block], category [Network], within 60 min").
4. **Clean UX:** Clear information hierarchy, readable statuses, obvious severity indicators, responsive layout.
5. **No Over-Engineering:** SQLite only. Single Express backend. Single React frontend. No microservices, Kafka, Redis, or pgvector.

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 18 / 19 + TypeScript + Vite | Rapid development, fast HMR, type safety |
| **Styling** | Modern Vanilla CSS / CSS Modules | Rich design, glassmorphism, zero build baggage, no Tailwind version lock-in |
| **Backend** | Node.js + Express + TypeScript | Lightweight, fast REST API, easy asynchronous service orchestration |
| **Database** | SQLite 3 (`better-sqlite3` or `sqlite3`) | Single-file zero-config persistence, instant test resets, perfect for hackathon MVP |
| **AI Layer** | `AIService` abstraction (`MockAIService` + `GeminiAIService`) | Decoupled AI calls; zero-cost local offline development with seamless switch to Google Gemini |
| **Shared Types** | TypeScript interfaces in `/shared/types/index.ts` | Single source of truth for request/response models and entities |

---

## 4. Repository Structure

```
CampusAI/
├── AGENTS.md                  # <-- YOU ARE HERE: Master developer & agent operating rules
├── package.json               # Root scripts (optional workspace orchestrator)
│
├── docs/                      # Architectural & coordination documentation
│   ├── ARCHITECTURE.md        # Detailed system design, data flows, and layer diagrams
│   ├── DATABASE.md            # SQLite schema, tables, indexes, and queries
│   ├── DEVELOPMENT.md         # Live task status, setup steps, and handoff log
│   ├── AI_PIPELINE.md         # AI architecture, prompts, correlation formulas, emerging logic
│   └── IBM_BOB_USAGE.md       # AI assistant tracking and hackathon development logs
│
├── shared/                    # Contracts & universal types
│   ├── api-contract.md        # REST API endpoints, schemas, payloads, and mock responses
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces (Report, Incident, Stats, etc.)
│
├── backend/                   # Developer 1: Express REST API & Core Engine
│   ├── src/
│   │   ├── controllers/       # HTTP request handlers (thin routing logic)
│   │   ├── services/          # Domain services (ReportService, IncidentService, DashboardService)
│   │   ├── ai/                # AIService interface, MockAIService, GeminiAIService
│   │   ├── engine/            # CorrelationEngine, SeverityCalculator, EmergingDetector
│   │   ├── db/                # SQLite connection, schema migrations, repositories
│   │   ├── routes/            # Express route declarations
│   │   └── server.ts          # Server entry point
│   └── tsconfig.json
│
├── frontend/                  # Developers 2 & 3: React Single Page Application
│   ├── src/
│   │   ├── features/
│   │   │   ├── student/       # Developer 2: Student report submission flow & confirmation
│   │   │   └── admin/         # Developer 3: Admin dashboard, incident detail, timeline, status
│   │   ├── components/        # Shared UI components (Button, Badge, Modal, Navbar)
│   │   ├── services/          # API client & Mock API service (strictly adhering to api-contract.md)
│   │   ├── App.tsx            # Navigation & routing
│   │   ├── index.css          # Design tokens, color palette, responsive reset
│   │   └── main.tsx
│   └── tsconfig.json
│
├── demo-data/                 # Developer 4: Controlled test data & demo scenarios
│   ├── demo-scenario.json     # Standardized 8-report sequence for the demo walkthrough
│   └── seed.ts                # Database seeding script
│
└── tests/                     # Developer 4 & Team: Automated verification
    ├── unit/                  # Correlation engine & scoring formula unit tests
    └── integration/           # API integration tests
```

---

## 5. Team Ownership & Code Boundaries

Strict ownership boundaries prevent merge collisions and duplicated effort:

### Developer 1 — Backend & Architecture Owner
- **Owns:** `/backend/**`, `/docs/ARCHITECTURE.md`, `/docs/DATABASE.md`, `/shared/api-contract.md`.
- **Responsibilities:** Express server, SQLite schema, REST endpoints, `AIService`, `IncidentIntelligenceEngine`, correlation math, backend tests.
- **Rule:** May not rewrite frontend code. If API contract changes, must update `/shared/api-contract.md` first and notify the team.

### Developer 2 — Student Frontend Owner
- **Owns:** `/frontend/src/features/student/**`, student reporting UX, form validation, report tracking, student success/error feedback.
- **Responsibilities:** Polished, responsive mobile/desktop student reporting interface with category picker, building/room selectors, and submission state handling.
- **Rule:** Must strictly consume endpoints defined in `/shared/api-contract.md`. If backend is incomplete, build against `/frontend/src/services/mockApi.ts`. **Do not edit backend code.**

### Developer 3 — Admin Frontend Owner
- **Owns:** `/frontend/src/features/admin/**`, incident list, incident detail, timeline visualizer, severity badges, impact meters, emerging incident alerts, status update controls, dashboard stats.
- **Responsibilities:** High-impact, visually compelling command center for campus administrators.
- **Rule:** Must consume `/shared/api-contract.md`. If backend is incomplete, use mock fixtures. **Do not edit backend code.**

### Developer 4 — Integration, QA & Demo Owner
- **Owns:** `/demo-data/**`, `/tests/**`, `/docs/DEVELOPMENT.md`, `/docs/IBM_BOB_USAGE.md`, end-to-end verification, demo script.
- **Responsibilities:** End-to-end integration, verifying that student submissions flow into admin dashboard, creating seed scripts, maintaining `/docs/DEVELOPMENT.md` checklist, ensuring demo readiness.
- **Rule:** Acts as integration gatekeeper. Flag regressions immediately.

---

## 6. Coding Conventions & Architecture Guardrails

1. **TypeScript Everywhere:** Strict type checking. No `any` types where an interface can be defined in `/shared/types/index.ts`.
2. **Separation of Concerns:**
   - **Frontend Components:** Pure UI and local form/display state. **Never place clustering, correlation, or scoring logic in the UI.**
   - **Backend Controllers:** Accept HTTP request, validate payload, call Domain Service, return JSON envelope. No direct database queries or raw AI prompts in controllers.
   - **Domain Services:** Orchestrate operations (`ReportService`, `IncidentService`).
   - **AI Layer:** Isolated behind `AIService` interface (`classifyAndExtract`, `generateEmbedding`, `summarizeIncident`).
   - **Deterministic Engine:** Pure functions for cosine similarity, multi-factor weighting, impact score math, and emerging velocity.
3. **Resilient AI Failure Handling:**
   - AI status must be tracked per report: `ai_status: 'PENDING' | 'COMPLETED' | 'FAILED'`.
   - If Gemini API call fails (rate limit, missing key, network error), the report is saved with `ai_status = 'FAILED'`, and fallback keyword rules assign a default category. **The API must never crash or return 500 on AI failure.**
4. **Design Aesthetics (Frontend):**
   - Rich dark/light modern UI with curated HSL color palette.
   - Status indicators: Open (Amber/Orange), Investigating (Blue), In Progress (Purple), Resolved (Emerald Green), Closed (Slate/Gray).
   - Severity badges: Low (Slate/Blue), Medium (Yellow/Amber), High (Orange), Critical (Crimson Red).
   - Micro-animations, responsive layout, clear loading spinners and empty states.

---

## 7. API Rules & Parallel Development Protocol

1. **The Contract is Law:** All endpoints, parameters, and responses are frozen in `/shared/api-contract.md`.
2. **Uniform Response Envelope:**
   ```json
   {
     "success": true,
     "data": { ... },
     "error": null
   }
   ```
   Or for errors:
   ```json
   {
     "success": false,
     "data": null,
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Building and description are required",
       "details": [ ... ]
     }
   }
   ```
3. **Frontend Mocking:** Developers 2 & 3 must NOT wait for Developer 1 to finish APIs. Use the mock fixtures documented in `/shared/api-contract.md`. When the backend is ready, switch the API base URL.
4. **Contract Changes:** If an endpoint contract must change:
   1. Stop. Discuss with frontend owners.
   2. Update `/shared/api-contract.md`.
   3. Update `/shared/types/index.ts`.
   4. Update backend and frontend simultaneously.

---

## 8. Database Rules

1. **SQLite 3 Exclusively:** Do NOT install or configure Postgres, MySQL, Redis, MongoDB, or external vector stores.
2. **Schema Authority:** Canonical schema is in `/docs/DATABASE.md`.
3. **Relational Integrity:** Foreign keys enabled (`PRAGMA foreign_keys = ON;`).
4. **Embeddings:** Store 64 to 768-dimensional embeddings as JSON-serialized text strings (`TEXT`) in SQLite. Calculate cosine similarity in TypeScript memory — for a campus hackathon with <1,000 active reports, in-memory cosine similarity takes <1ms and requires zero external vector infrastructure.

---

## 9. AI vs Deterministic Logic Separation

| Task | Responsible Component | Method |
|---|---|---|
| **Text Classification** | AI Layer (`AIService`) | LLM prompt or fallback keyword matching |
| **Location & Room Extraction** | AI Layer (`AIService`) | Structured JSON extraction from report text |
| **Embedding Generation** | AI Layer (`AIService`) | Text embedding model (or deterministic vector) |
| **Incident Summarization** | AI Layer (`AIService`) | LLM synthesis of all reports in incident |
| **Recommendation Generation** | AI Layer (`AIService`) | LLM actionable advice for facilities team |
| **Cosine Similarity** | Engine (`CorrelationEngine`) | Deterministic dot-product vector math |
| **Multi-Factor Correlation** | Engine (`CorrelationEngine`) | Formula: `0.55*Sim + 0.20*Loc + 0.15*Cat + 0.10*Time` |
| **Severity & Impact Calculation**| Engine (`SeverityCalculator`) | Deterministic formula: Base + Volume + BuildingWeight |
| **Emerging Incident Detection** | Engine (`EmergingDetector`) | Velocity threshold (e.g. >= 3 reports within 60m) |

---

## 10. Git Workflow & Commit Rules

1. **Main Branch:** Protected. Always in a working, deployable state.
2. **Feature Branches:**
   - `feature/backend-api` (Dev 1)
   - `feature/ai-engine` (Dev 1)
   - `feature/student-ui` (Dev 2)
   - `feature/admin-dashboard` (Dev 3)
   - `feature/integration-demo` (Dev 4)
3. **Commit Messages:** Follow Conventional Commits:
   - `feat(api): add POST /api/reports endpoint`
   - `feat(student): build report submission form with validation`
   - `feat(admin): build incident detail view with timeline`
   - `feat(ai): integrate Gemini structured extraction with fallback`
   - `fix(engine): correct time decay calculation in correlation`
   - `docs: update API contract for incident status patch`

---

## 11. AI Agent Operating Protocol

When an AI coding agent starts a task:
1. **Read `AGENTS.md`** and verify your assigned scope.
2. **Check `/docs/DEVELOPMENT.md`** to know what is already completed.
3. **Inspect Existing Files:** Never regenerate an existing file from scratch if an incremental edit works.
4. **Honor Contracts:** Check `/shared/api-contract.md` before altering request/response formats.
5. **No Scope Creep:** Do not rewrite another developer's module because "you have a cleaner idea."
6. **Make Smallest Complete Changes:** Keep changes atomic and testable.
7. **Document Handoffs:** When completing a task, update `/docs/DEVELOPMENT.md` using the Handoff Template.
