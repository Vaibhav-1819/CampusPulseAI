# 📡 CampusPulse AI

> **From scattered complaints to campus intelligence.**  
> Transforms uncoordinated student reports into correlated, prioritized, and explainable campus infrastructure incidents in real time.

---

## 🎯 Overview

Campus infrastructure problems are often reported through fragmented channels—verbal complaints, WhatsApp groups, or individual tickets. A single complaint may look insignificant, but a pattern of related complaints reveals systemic failures.

**CampusPulse AI** solves this by recognizing that isolated reports belong to the same underlying problem. Instead of forcing campus administrators to sift through hundreds of duplicate complaints, CampusPulse correlates reports across **space, time, semantics, and category**, surfaces the **root incident**, detects **rapidly emerging crises**, and prescribes **actionable maintenance steps**.

```
Student Complaint
       ↓
AI Understanding & Extraction (Building, Room, Category)
       ↓
Semantic Vector Embedding Generation
       ↓
Multi-Factor Deterministic Correlation (55% Semantic + 20% Location + 15% Category + 10% Temporal)
       ↓
Incident Clustering (Match Score ≥ 0.68)
       ↓
Dynamic Impact Scoring (0-100) & Severity Tiering
       ↓
Emerging Incident Detection (Velocity Spike & Acceleration Analysis)
       ↓
Executive AI Summary & Action Recommendation Generation
       ↓
Admin Command Center Review, Audit Timeline & Status Triage
```

---

## ✨ Key Features

- **🧠 Dual-Tier AI Service Layer (`/backend/src/ai`):**
  - **Google Gemini Integration:** Strict JSON Schema extraction and summarization using `gemini-1.5-flash`.
  - **Deterministic Mock Fallback:** Runs 100% offline with zero external API dependencies using campus taxonomy keywords, regex spatial extractors, and unit-normalized 64-dimensional pseudo-vectors.
  - **Zero-Crash Resilience:** If external AI APIs fail or network drops, the system seamlessly activates fallback logic without crashing or dropping user reports (`ai_status: 'FAILED'`).
- **📐 Hybrid Multi-Factor Correlation Engine (`/backend/src/engine`):**
  - Evaluates similarity using a transparent, weighted formula:
    $$\text{Score} = (0.55 \times \text{Semantic}) + (0.20 \times \text{Location}) + (0.15 \times \text{Category}) + (0.10 \times \text{Temporal})$$
  - In-memory cosine similarity between vector embeddings.
  - **Transparent AI Explainability:** Every correlated report stores and displays natural-language justification (e.g., *"Correlated to 'CSE Block Network Disruption' (82% match): 74% semantic similarity, identical building [CSE Block], matching category [NETWORK]"*).
- **🚨 Emerging Incident Spike Detection:**
  - Identifies abnormal report surges ($\ge 3$ reports in 60 minutes or $2.5\times$ arrival rate spikes).
  - Automatically flags the incident with `is_emerging: true`, awards velocity impact bonuses, and broadcasts visual alerts to the Admin Command Center.
- **🛡️ Admin Incident Command Center (`/frontend/src/features/admin`):**
  - Real-time KPI telemetry bar (Active Incidents, Emerging Alerts, Total Reports, Resolved Count, Category Breakdown).
  - Multi-factor search and filter controls (Status, Severity, Building, Grid vs Table views).
  - High-visibility emerging alert banners for active crises.
  - Interactive Incident Detail Drawer featuring chronological event timelines (`incident_events`), student report receipts, and administrative triage action buttons (`INVESTIGATING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
- **📱 Student Reporting Portal (`/frontend/src/features/student`):**
  - Category selector with icon badges (`NETWORK`, `ELECTRICAL`, `PLUMBING`, `HVAC`, `PHYSICAL`, `EQUIPMENT`, `SAFETY`, `OTHER`).
  - Campus building and room auto-suggest.
  - Client-side validation, error handling, and ticket tracking receipts.
- **⚡ Lean, Zero-Overhead Persistence:**
  - Powered by SQLite 3 with Write-Ahead Logging (`WAL`) and foreign key enforcement. No PostgreSQL, Redis, Kafka, or external vector databases needed.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Modern Vanilla CSS Design System, Lucide Icons |
| **Backend** | Node.js (v22), Express, TypeScript, SQLite 3 (`better-sqlite3`), `uuid` |
| **AI Layer** | Google Gemini (`@google/generative-ai`), Custom `MockAIService` fallback |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert`, `tsx`) |
| **Monorepo Scripts** | Root `package.json` with `concurrently` orchestration |

---

## 📁 Repository Structure

```
CampusPulseAI/
├── package.json               # Root workspace orchestrator (concurrently dev, build, seed)
├── AGENTS.md                  # Master developer & AI agent operating manual
│
├── docs/                      # Architectural & coordination documentation
│   ├── ARCHITECTURE.md        # Detailed system design, data flows, and layer diagrams
│   ├── DATABASE.md            # SQLite schema, tables, indexes, and queries
│   ├── DEVELOPMENT.md         # Live task status, setup steps, and handoff log
│   ├── AI_PIPELINE.md         # AI architecture, prompts, correlation formulas, emerging logic
│   └── IBM_BOB_USAGE.md       # AI assistant tracking and hackathon development logs
│
├── shared/                    # Contracts & universal types
│   ├── api-contract.md        # REST API endpoints, schemas, payloads, and mock fixtures
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces (Report, Incident, Stats, etc.)
│
├── backend/                   # Express REST API & Core Intelligence Engine
│   ├── src/
│   │   ├── ai/                # AIService interface, MockAIService, GeminiAIService, AIServiceAdapter
│   │   ├── engine/            # CorrelationEngine, SeverityCalculator, EmergingDetector
│   │   ├── db/                # SQLite connection, schema migrations, repositories, seed script
│   │   ├── services/          # Domain services (ReportService, IncidentService, DashboardService)
│   │   ├── controllers/       # HTTP request handlers & validation
│   │   ├── routes/            # Express routers (/api/reports, /api/incidents, /api/dashboard)
│   │   └── server.ts          # Server entry point
│   └── tsconfig.json
│
├── frontend/                  # React + Vite Single Page Application
│   ├── src/
│   │   ├── features/
│   │   │   ├── student/       # Student report submission form & feedback
│   │   │   └── admin/         # Admin command center, detail drawer, timeline, filter bar
│   │   ├── services/          # api.ts (Live fetch client) & mockApi.ts (Offline fallback)
│   │   ├── App.tsx            # Role switcher (Admin Command Center ↔ Student Portal)
│   │   ├── index.css          # Glassmorphism design system tokens
│   │   └── main.tsx
│   └── vite.config.ts
│
├── demo-data/                 # Controlled test data & demo scenarios
│   ├── demo-scenario.json     # Standardized 6-report sequence for the demo walkthrough
│   └── README.md
│
└── tests/                     # Automated test suites (19/19 passing)
    ├── unit/                  # Correlation engine & scoring formula unit tests
    └── integration/           # Supertest/Fetch API integration tests
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js:** v18.0.0 or higher (`node -v`)
- **npm:** v9.0.0 or higher (`npm -v`)
- **Git:** installed and configured

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Vaibhav-1819/CampusPulseAI.git
cd CampusPulseAI

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Environment Configuration (Optional)
The application works **100% offline out-of-the-box** using `MockAIService`. To enable real Google Gemini AI:
Create a `.env` file in `/backend/.env`:
```ini
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_PATH=./data/campuspulse.db
```

### 3. Seed Canonical Demo Data
```bash
npm run db:seed
```
This loads the canonical 6-report scenario from `demo-data/demo-scenario.json`, demonstrating report correlation into a CSE Block network outage, an emerging spike trigger, and distinct isolation of unrelated issues.

### 4. Run Both Services Concurrently
From the project root:
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000/api`
- **Frontend App:** `http://localhost:5173`

---

## 🧪 Verification & Automated Testing

Run the full automated test suite (19 tests covering unit math, scoring algorithms, and API endpoints):
```bash
npm test
```
```text
TAP version 13
# Subtest: API Integration Tests (8 tests)
  ok 1 - GET /api/health returns 200 OK and healthy status
  ok 2 - POST /api/reports with short description returns 400 validation error
  ok 3 - POST /api/reports with valid data creates report and anchor incident
  ok 4 - POST /api/reports with related complaint correlates into existing incident
  ok 5 - GET /api/incidents returns list containing the created incident
  ok 6 - GET /api/incidents/:id returns incident detail with reports and timeline
  ok 7 - PATCH /api/incidents/:id/status updates status and logs event
  ok 8 - GET /api/dashboard/stats returns aggregated KPI statistics
ok 1 - API Integration Tests

# Subtest: CorrelationEngine Unit Tests (7 tests)
  ok 1 - cosineSimilarity computes 1.0 for identical normalized vectors
  ok 2 - cosineSimilarity computes 0.0 for orthogonal vectors
  ok 3 - calculateLocationScore returns 1.0 for identical building
  ok 4 - calculateLocationScore returns 0.0 for completely different buildings
  ok 5 - calculateCategoryScore returns 1.0 for matching category
  ok 6 - calculateTemporalScore decays over time
  ok 7 - evaluateCorrelation produces expected score and explainability text
ok 2 - CorrelationEngine Unit Tests

# Subtest: SeverityCalculator Unit Tests (2 tests)
  ok 1 - Base impact score matches expected formula
  ok 2 - Emerging bonus adds +15 points
ok 3 - SeverityCalculator Unit Tests

# Subtest: EmergingDetector Unit Tests (2 tests)
  ok 1 - Reports spread out do not trigger emerging status
  ok 2 - 3 reports within 45 minutes triggers emerging status
ok 4 - EmergingDetector Unit Tests

# tests 19 | pass 19 | fail 0
```

---

## 📡 REST API Reference

All endpoints return a uniform response envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck & server telemetry |
| `POST` | `/api/reports` | Ingest student complaint, run AI parsing & correlation |
| `GET` | `/api/reports` | Filter reports by `incident_id`, `building`, or `category` |
| `GET` | `/api/reports/:id` | Retrieve single report detail |
| `GET` | `/api/incidents` | List active campus incidents (filters: `status`, `severity`, `is_emerging`) |
| `GET` | `/api/incidents/:id` | Deep inspection (incident, correlated reports, and event timeline) |
| `PATCH` | `/api/incidents/:id/status` | Triage incident (`OPEN`, `INVESTIGATING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) with notes |
| `GET` | `/api/dashboard/stats` | KPI counters & category/severity telemetry |

*See [`shared/api-contract.md`](file:///d:/CampusAI/shared/api-contract.md) for full request/response schemas and mock fixtures.*

---

## 👥 Team & Ownership

Built for the 48-Hour Hackathon following strict architectural separation of concerns:
- **Developer 1 (Backend & Architecture Owner):** Express REST API, SQLite schema, `AIService`, `IncidentIntelligenceEngine`.
- **Developer 2 (Student Frontend Owner):** Student reporting UX, category cards, client-side validation, ticket confirmation receipts.
- **Developer 3 (Admin Frontend Owner):** Admin command center, KPI telemetry, filter bar, inspection drawer, timeline visualizer.
- **Developer 4 (Integration, QA & Demo Owner):** Demo data scenarios, integration test suite, seed scripts, and verification.

---

## 📄 License

This project is licensed under the ISC License.
