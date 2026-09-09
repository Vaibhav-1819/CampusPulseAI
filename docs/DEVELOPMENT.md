# CampusPulse AI — Development Workflow & Live Status Tracker

This document is the **live central coordinator** for the 4-developer engineering team. Every team member and AI agent must update this document when starting or concluding significant tasks.

---

## 1. Quick Start & Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher (`node -v`)
- **npm:** v9.0.0 or higher (`npm -v`)
- **Git:** installed and configured

### Installation
From the root workspace directory:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install

# 3. Initialize SQLite Database & Tables
cd ../backend
npm run db:init

# 4. Optional: Seed Canonical Demo Data
npm run db:seed
```

### Running Locally in Development

**Terminal 1 — Backend (Express API):**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 — Frontend (React + Vite):**
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

---

## 2. Environment Variables Specification

Create `.env` in `/backend/.env` (refer to `/backend/.env.example`):

```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# AI Service Configuration
# AI_PROVIDER can be 'mock' (zero external dependency) or 'gemini'
AI_PROVIDER=mock
GEMINI_API_KEY=

# Database File
DATABASE_PATH=./data/campuspulse.db
```

---

## 3. Live 48-Hour Hackathon Checklist

### Phase 1: Repository Architecture & Governance (Hour 0 - 3)
- [x] Establish master coordination document (`AGENTS.md`)
- [x] Define System Architecture & Data Flows (`docs/ARCHITECTURE.md`)
- [x] Design Relational SQLite Schema & Indexes (`docs/DATABASE.md`)
- [x] Freeze Universal REST API Contract (`shared/api-contract.md`)
- [x] Create Shared TypeScript Models (`shared/types/index.ts`)
- [x] Establish Canonical Demo Dataset (`demo-data/demo-scenario.json`)
- [x] Initialize Directory Scaffolding (`/frontend`, `/backend`, `/docs`, `/demo-data`, `/tests`)

### Phase 2: Backend Foundation & Database (Hour 3 - 8) — **[Owner: Dev 1]**
- [x] Initialize Node.js + TypeScript Express setup in `/backend`
- [x] Implement SQLite schema generator and migration runner in `/backend/src/db`
- [x] Implement Repository accessors for `users`, `reports`, `incidents`, `incident_events`
- [x] Wire up Express base server, CORS, JSON parsing, and centralized error middleware
- [x] Add basic healthcheck endpoint (`GET /api/health`)

### Phase 3: Student Reporting Flow (Hour 8 - 14) — **[Owner: Dev 2]**
- [x] Initialize React + TypeScript + Vite project in `/frontend`
- [x] Set up design system tokens, typography, and palette in `/frontend/src/index.css`
- [x] Implement Student reporting view (`/frontend/src/features/student/ReportForm.tsx`)
- [x] Implement category selector, building/room inputs, and description field
- [x] Add client-side validation & error states
- [x] Implement submission success card with ticket tracking ID
- [x] Connect with Mock API (`/frontend/src/services/mockApi.ts`) matching API contract

### Phase 4: Admin Dashboard Shell & Views (Hour 14 - 20) — **[Owner: Dev 3]**
- [x] Implement Admin Dashboard layout (`/frontend/src/features/admin/AdminDashboard.tsx`)
- [x] Build key metric stats cards (Active Incidents, Emerging Alerts, Unassigned Reports, Resolved)
- [x] Build Incident Grid/List with status chips, severity badges, and emerging tags
- [x] Build Incident Detail Drawer/View with:
  - Correlated reports list & room tags
  - Explainability card ("Why were these reports grouped?")
  - Interactive Incident Timeline (`incident_events`)
  - AI Summary & Recommendation preview
  - Status mutation buttons (Investigating, In Progress, Resolved, Closed)
- [x] Connect with Mock API fixtures matching API contract

### Phase 5: AI Understanding & Classification (Hour 20 - 26) — **[Owner: Dev 1]**
- [x] Implement `AIService` interface in `/backend/src/ai/aiService.ts`
- [x] Implement `MockAIService` with deterministic keyword extraction and normalized vectors
- [x] Implement `GeminiAIService` using Google Gemini structured output schemas
- [x] Implement AI status handling (`PENDING`, `COMPLETED`, `FAILED`) with automatic fallback
- [x] Connect `ReportService` to AI pipeline on report submission

### Phase 6: Incident Correlation Engine (Hour 26 - 32) — **[Owner: Dev 1]**
- [x] Implement `CorrelationEngine` with multi-factor scoring formula:
  `Score = 0.55*Sim + 0.20*Loc + 0.15*Cat + 0.10*Time`
- [x] Implement in-memory Cosine Similarity for vector comparison
- [x] Implement human-readable correlation explainability text generator
- [x] Write unit tests verifying report clustering behavior against threshold (0.68)

### Phase 7: Severity, Impact & Emerging Detection (Hour 32 - 36) — **[Owner: Dev 1]**
- [x] Implement `SeverityImpactCalculator` (impact 0-100, severity tiering)
- [x] Implement `EmergingIncidentDetector` (velocity threshold: >= 3 reports in 60m or 2x spike)
- [x] Implement incident event logging for severity changes and emerging flags
- [x] Trigger AI Summary and Facilities Recommendation generation on incident updates

### Phase 8: End-to-End Frontend/Backend Integration (Hour 36 - 40) — **[Owner: Dev 4 + Team]**
- [ ] Replace frontend Mock API client with live backend `fetch` calls
- [ ] Verify CORS, headers, and error payload parsing
- [ ] Verify that submitting a report via Student UI immediately creates/updates an incident
- [ ] Verify that Admin UI live updates incident list, severity, and timeline
- [ ] Fix integration edge cases and boundary mismatches

### Phase 9: Demo Data Seeder & Polish (Hour 40 - 44) — **[Owner: Dev 4]**
- [ ] Build CLI command: `npm run db:seed-demo`
- [ ] Test canonical demo sequence:
  - 1st report: "WiFi slow in CSE Block" → New Incident Created
  - 2nd report: "Internet down in CSE Lab 3" → Correlated to Incident
  - 3rd report: "Cannot connect to campus WiFi in CSE" → Incident impact rises, flagged as **EMERGING**
  - 4th report: Unrelated "Water leak in Library 2nd floor" → Creates separate Plumbing Incident
- [ ] Verify AI explainability text accurately highlights why CSE reports were clustered

### Phase 10: Final Verification, Polish & Demo Script (Hour 44 - 48) — **[Owner: Dev 4]**
- [ ] Run full automated test suite (`npm test`)
- [ ] Verify UI responsiveness, dark/light contrast, empty states, and loading spinners
- [ ] Write Demo Walkthrough Script in `/docs/DEMO_SCRIPT.md`
- [ ] Complete Hackathon submission documentation and README

---

## 4. Handoff Protocol & Communication Log

When completing any significant task, paste a log entry below using this template:

```markdown
### [YYYY-MM-DD HH:MM] [Developer Name / Role]
- **Component:** Backend / Student UI / Admin UI / Integration
- **Implemented:** Brief summary of what was completed
- **Files Modified:** List of touched files
- **API Changes:** None / Updated endpoint X (with contract update)
- **Remaining Tasks:** Next steps for dependent teammates
- **Testing Instructions:** How teammates can verify this change locally
```

### Log Entries
- **2026-09-08 12:30 [Developer 2 — Student Frontend Owner]**
  - **Component:** Student Frontend Portal (`/frontend/src/**`)
  - **Implemented:**
    - Scaffolded React 18 + TypeScript + Vite architecture in `/frontend` with strict typings and path aliases.
    - Built rich glassmorphic design system in Vanilla CSS (`index.css`) with curated dark modern campus palette, responsive layout, and micro-interactions.
    - Implemented full student report flow (`ReportForm.tsx`):
      - Visual 8-card category selector with AI auto-detect option (`CategorySelector.tsx`).
      - Campus building picker with fast pill selectors & smart room suggestions (`LocationPicker.tsx`).
      - Live character counter and client-side validation for minimum description length.
      - Quick demo preset buttons (`CSE WiFi Outage`, `Library Water Leak`, `Science Annex HVAC`) for rapid demonstration.
    - Implemented post-submission ticket receipt modal (`ReportReceiptModal.tsx`):
      - Generates and copies ticket ID (e.g. `rep_...`).
      - Visual AI incident correlation card displaying cluster title, severity, status, report count, emerging flags, and clustering justification.
    - Implemented local report tracker drawer (`TrackReportsList.tsx`) persisting submitted tickets in `localStorage`.
    - Created dual-mode service layer (`reportService.ts`, `api.ts`, `mockApi.ts`) that automatically connects to the live backend when available or operates in standalone mock mode.
    - Verified all browser flows with automated subagent and zero build errors (`npm run build`).
  - **Files Modified:** `/frontend/**`, `docs/DEVELOPMENT.md`.
  - **API Changes:** None (strictly conforms to frozen `shared/api-contract.md`).
  - **Remaining Tasks:** Developer 3 can build the Admin Dashboard; Developer 4 can run end-to-end integration with the Express backend.
  - **Testing Instructions:** Run `cd frontend && npm run dev` and open `http://localhost:5173`.

- **2026-09-07 19:00 [Developer 3 — Admin Frontend Owner]**
  - **Component:** Admin Incident Command Center & Telemetry UI (`/frontend/src/features/admin/**`)
  - **Implemented:**
    - Built Admin Dashboard shell (`AdminDashboard.tsx`) with real-time KPI metrics header (`StatsBar.tsx`).
    - Built multi-factor filter & search controls (`FilterBar.tsx`) supporting status, severity, building filters, grid vs table view toggle, and auto-sync timer.
    - Built high-velocity emerging spike alert banner (`EmergingAlertBanner.tsx`).
    - Built Incident Card and Table Row views with dynamic 0-100 Impact Meter progress bars and glowing severity badges (`IncidentCard.tsx`).
    - Built Deep Inspection Drawer (`IncidentDetailModal.tsx`) featuring executive AI summaries, recommended facilities actions, student reports list, AI explainability cards (match % & reasoning), interactive event lifecycle timeline, and administrative triage action buttons (`INVESTIGATING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) with custom notes input.
    - Built unified `ApiClient` (`api.ts`) connecting to Express backend (`/api/...`) with automatic zero-crash fallback to standalone offline `mockApiService` (`mockApi.ts`).
    - Built Student Reporting UI (`StudentReportForm.tsx`) integration bridge and role view switcher (`App.tsx`).
    - Verified build (`npm run build` passing cleanly) and backend integration (19/19 tests passing).
  - **Files Modified:** `/frontend/**`, `docs/DEVELOPMENT.md`, `walkthrough.md`.
  - **API Changes:** None (100% compliant with `/shared/api-contract.md`).
  - **Testing Instructions:** Run `cd frontend && npm run dev` to start Vite dev server on `http://localhost:5173`. Toggle between live API and mock modes using top status badge.

- **2026-09-07 16:45 [Developer 1 — Backend & Architecture Owner]**
  - **Component:** Backend REST API, Database Layer, AIService & Incident Intelligence Engine
  - **Implemented:**
    - Initialized Express + TypeScript environment with SQLite persistence (WAL mode & foreign keys enabled).
    - Created database tables (`users`, `incidents`, `reports`, `incident_events`) and repositories.
    - Built `AIService` abstraction with `MockAIService` (deterministic keywords, regex extraction, 64-dim unit vectors) and `GeminiAIService` with resilient fallback adapter (`AIServiceAdapter`).
    - Built `IncidentIntelligenceEngine`:
      - `CorrelationEngine`: 4-factor scoring (`0.55*Sim + 0.20*Loc + 0.15*Cat + 0.10*Time`) with explainability string generation.
      - `SeverityCalculator`: dynamic impact score (0-100) and severity tiers (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
      - `EmergingDetector`: sliding-window velocity analysis and surge detection.
    - Implemented REST controllers and routes matching `shared/api-contract.md`:
      - `POST /api/reports`, `GET /api/reports`, `GET /api/reports/:id`
      - `GET /api/incidents`, `GET /api/incidents/:id`, `PATCH /api/incidents/:id/status`
      - `GET /api/dashboard/stats`, `GET /api/health`
    - Created demo data seeder `src/db/seed.ts` executing `demo-scenario.json`.
    - Added unit and integration tests (19/19 passing).
  - **Files Modified:** `/backend/**`, `/tests/**`, `docs/DEVELOPMENT.md`.
  - **API Changes:** None (100% compliant with frozen `shared/api-contract.md`).
  - **Remaining Tasks:** Developer 2 and Developer 3 can now connect their Student and Admin UI interfaces either against the mock fixtures or directly against the live backend at `http://localhost:5000/api`.
  - **Testing Instructions:** Run `npm test` in `/backend` to run all 19 tests, or `npm run db:seed` to inspect the demo scenario.

*(Initial setup entry)*
- **2026-09-07 16:25 [Architecture Lead]**
  - **Component:** Core Coordination & Project Scaffolding
  - **Implemented:** Created `AGENTS.md`, `ARCHITECTURE.md`, `DATABASE.md`, `DEVELOPMENT.md`, `AI_PIPELINE.md`, `IBM_BOB_USAGE.md`, `api-contract.md`, and shared TypeScript types. Initialized project directory structure.
  - **Files Modified:** Root documentation, `/shared`, `/demo-data`.
  - **Next Steps:** Dev 1 can initiate backend database & API foundation; Dev 2 and Dev 3 can start student and admin UI scaffolding in parallel using `/shared/api-contract.md`.
