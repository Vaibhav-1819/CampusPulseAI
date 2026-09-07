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
- [ ] Initialize Node.js + TypeScript Express setup in `/backend`
- [ ] Implement SQLite schema generator and migration runner in `/backend/src/db`
- [ ] Implement Repository accessors for `users`, `reports`, `incidents`, `incident_events`
- [ ] Wire up Express base server, CORS, JSON parsing, and centralized error middleware
- [ ] Add basic healthcheck endpoint (`GET /api/health`)

### Phase 3: Student Reporting Flow (Hour 8 - 14) — **[Owner: Dev 2]**
- [ ] Initialize React + TypeScript + Vite project in `/frontend`
- [ ] Set up design system tokens, typography, and palette in `/frontend/src/index.css`
- [ ] Implement Student reporting view (`/frontend/src/features/student/ReportForm.tsx`)
- [ ] Implement category selector, building/room inputs, and description field
- [ ] Add client-side validation & error states
- [ ] Implement submission success card with ticket tracking ID
- [ ] Connect with Mock API (`/frontend/src/services/mockApi.ts`) matching API contract

### Phase 4: Admin Dashboard Shell & Views (Hour 14 - 20) — **[Owner: Dev 3]**
- [ ] Implement Admin Dashboard layout (`/frontend/src/features/admin/Dashboard.tsx`)
- [ ] Build key metric stats cards (Active Incidents, Emerging Alerts, Unassigned Reports)
- [ ] Build Incident Grid/List with status chips, severity badges, and emerging tags
- [ ] Build Incident Detail Drawer/View with:
  - Correlated reports list & room tags
  - Explainability card ("Why were these reports grouped?")
  - Interactive Incident Timeline (`incident_events`)
  - AI Summary & Recommendation preview
  - Status mutation buttons (Investigating, In Progress, Resolved)
- [ ] Connect with Mock API fixtures matching API contract

### Phase 5: AI Understanding & Classification (Hour 20 - 26) — **[Owner: Dev 1]**
- [ ] Implement `AIService` interface in `/backend/src/ai/aiService.ts`
- [ ] Implement `MockAIService` with deterministic keyword extraction and normalized vectors
- [ ] Implement `GeminiAIService` using Google Gemini structured output schemas
- [ ] Implement AI status handling (`PENDING`, `COMPLETED`, `FAILED`) with automatic fallback
- [ ] Connect `ReportService` to AI pipeline on report submission

### Phase 6: Incident Correlation Engine (Hour 26 - 32) — **[Owner: Dev 1]**
- [ ] Implement `CorrelationEngine` with multi-factor scoring formula:
  `Score = 0.55*Sim + 0.20*Loc + 0.15*Cat + 0.10*Time`
- [ ] Implement in-memory Cosine Similarity for vector comparison
- [ ] Implement human-readable correlation explainability text generator
- [ ] Write unit tests verifying report clustering behavior against threshold (0.70)

### Phase 7: Severity, Impact & Emerging Detection (Hour 32 - 36) — **[Owner: Dev 1]**
- [ ] Implement `SeverityImpactCalculator` (impact 0-100, severity tiering)
- [ ] Implement `EmergingIncidentDetector` (velocity threshold: >= 3 reports in 60m or 2x spike)
- [ ] Implement incident event logging for severity changes and emerging flags
- [ ] Trigger AI Summary and Facilities Recommendation generation on incident updates

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
*(Initial setup entry)*
- **2026-09-07 16:25 [Architecture Lead]**
  - **Component:** Core Coordination & Project Scaffolding
  - **Implemented:** Created `AGENTS.md`, `ARCHITECTURE.md`, `DATABASE.md`, `DEVELOPMENT.md`, `AI_PIPELINE.md`, `IBM_BOB_USAGE.md`, `api-contract.md`, and shared TypeScript types. Initialized project directory structure.
  - **Files Modified:** Root documentation, `/shared`, `/demo-data`.
  - **Next Steps:** Dev 1 can initiate backend database & API foundation; Dev 2 and Dev 3 can start student and admin UI scaffolding in parallel using `/shared/api-contract.md`.
