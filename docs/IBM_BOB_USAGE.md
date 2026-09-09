# CampusPulse AI — AI Assistant & Bob Usage Documentation

This document logs the usage, prompts, architectural decisions, and workflows conducted with AI coding assistance (including IBM Bob / Antigravity Agent) throughout the CampusPulse AI hackathon project.

---

## 1. AI Usage Philosophy & Integrity Guidelines

To maintain academic and competitive hackathon integrity:
1. **Honest Attribution:** All AI-assisted workflows must be documented transparently.
2. **No Fabricated Claims:** Never represent mock or keyword heuristics as real deep neural models, and never fabricate synthetic performance metrics.
3. **Engineered Collaboration:** The AI agent acts as a lead architect, pair programmer, and QA verifier under human guidance, not an autonomous black box.

---

## 2. Agent Usage Areas in CampusPulse AI

| Lifecycle Phase | AI Agent Role | Human Developer Supervision |
|---|---|---|
| **Phase 1: Architecture & Contracts** | Scaffolding contracts, schemas, and inter-team boundaries | Human team reviewed and approved architectural trade-offs |
| **Phase 2: Backend Foundation** | Boilerplate generation for Express controllers and SQLite init | Human reviewed SQL constraints and indexing |
| **Phase 3: Student Frontend** | Form layout, client validation, and component styling | Human verified responsive UX and accessibility |
| **Phase 4: Admin Dashboard** | Timeline components, metrics cards, and state binding | Human tuned information hierarchy and triage flow |
| **Phase 5: AI Engine & Correlation** | Prompt engineering for extraction, math implementation | Human tested and calibrated similarity weights |
| **Phase 6: Testing & QA** | Writing unit test assertions and demo scenario datasets | Human executed end-to-end verification walkthroughs |

---

## 3. Key Architectural Prompts & Decision Log

### Log Entry 1: Multi-Agent Parallelism & Governance
- **Context:** Establishing 4-developer concurrent workflow for 48 hours without merge conflicts.
- **Prompt:** *"Establish team boundaries, frozen API contracts, and operating manuals so Backend, Student UI, Admin UI, and QA can develop in parallel using mock data without waiting for one another."*
- **Outcome:** Generated `AGENTS.md`, `shared/api-contract.md`, and modular directory structures.

### Log Entry 2: Hybrid Correlation Architecture
- **Context:** Deciding how to group student reports without over-reliance on LLMs or pure vector similarity.
- **Prompt:** *"Design an explainable, deterministic correlation formula combining cosine similarity, building location matching, category taxonomy, and temporal decay."*
- **Outcome:** Designed the 4-factor scoring model:
  `0.55*Semantic + 0.20*Location + 0.15*Category + 0.10*Time`, with human-readable reasoning strings.

### Log Entry 3: Resilience & Graceful Degradation
- **Context:** Preventing demo crashes when external API keys or network connections fail.
- **Prompt:** *"Design an AIService interface with a robust Mock fallback that can run completely offline during demos."*
- **Outcome:** Designed `MockAIService` with keyword taxonomy and hashing embeddings, pairing seamlessly with `GeminiAIService`.

---

## 4. Developer Prompt Log Template

### [2026-09-08 12:30] [Developer 2 — Sreeshanth S] — Student Reporting Portal
- **Tool / Assistant:** IBM Bob / Antigravity Agent
- **Objective:** Build a responsive, accessible student incident reporting interface with category selector, building/room pickers, preset demo cards, and ticket receipts.
- **Prompt Summary:** *"Implement a rich student reporting UX with preset scenario buttons, client validation, local storage ticket tracker, and dual-mode service layer matching shared/api-contract.md."*
- **Agent Output:** Created `ReportForm.tsx`, `CategorySelector.tsx`, `LocationPicker.tsx`, `ReportReceiptModal.tsx`, `TrackReportsList.tsx`, and `reportService.ts`.
- **Human Verification:** Verified form submissions, ticket copy-to-clipboard, and local storage retention.

### [2026-09-07 19:00] [Developer 3 — Vignesh Mandadapu] — Admin Command Center
- **Tool / Assistant:** IBM Bob / Antigravity Agent
- **Objective:** Create a high-density incident command center with real-time KPI telemetry, emerging crisis banners, and deep inspection modal.
- **Prompt Summary:** *"Create AdminDashboard with KPI metrics header, multi-factor filter controls, dynamic impact meters, explainability cards, and event timeline visualizer."*
- **Agent Output:** Created `AdminDashboard.tsx`, `StatsBar.tsx`, `FilterBar.tsx`, `IncidentCard.tsx`, `IncidentDetailModal.tsx`, and `EmergingAlertBanner.tsx`.
- **Human Verification:** Tested status mutations (`INVESTIGATING`, `IN_PROGRESS`, `RESOLVED`), filter toggles, and auto-sync polling.

### [2026-09-09 13:00] [Dev 1, 2, 3, 4 & Antigravity Agent] — Merge Conflict Resolution & Dual-Portal Unification
- **Tool / Assistant:** Antigravity Agent
- **Objective:** Resolve complex `add/add` merge conflicts across 10 frontend files when merging PR #2 (Student Portal) into `main` (which already had PR #1 Admin Command Center), without losing either developer's work.
- **Prompt Summary:** *"Unify both portals in App.tsx with an interactive role switcher. Unify api.ts, mockApi.ts, types, and index.css so both Student and Admin portals operate seamlessly in both live backend mode and offline standalone mock mode."*
- **Agent Output:** Unified `App.tsx` and `Navbar.tsx` with role switcher tabs, merged `api.ts` (`LiveApiClient` + `ApiClient`), merged `mockApi.ts` fixtures, unified `index.css`, cleaned up obsolete placeholder files, and verified full production build (`tsc && vite build`).
- **Human Verification:** Ran `npm run build` (0 TypeScript errors) and backend `npm test` (19/19 tests passing). Successfully concluded merge commit and pushed to `main`.

### [2026-09-09 13:15] [Developer 4 — Sumanth Teju & Vaibhav Bharathula] — Demo Seeder & End-to-End QA
- **Tool / Assistant:** IBM Bob / Antigravity Agent
- **Objective:** Verify end-to-end demo scenario execution and team attribution on GitHub.
- **Prompt Summary:** *"Verify that npm run db:seed ingests the canonical 6-report sequence with automatic clustering and emerging spike detection, and ensure all 4 team members are properly credited on GitHub."*
- **Agent Output:** Verified `src/db/seed.ts` execution, validated impact escalation from 40/100 to 79/100 and `is_emerging: true` trigger, updated `README.md` and `docs/DEVELOPMENT.md` with team ownership, and verified all 4 contributors on `origin/main`.
- **Human Verification:** Verified commit history shows distinct authors for all 4 team members.

