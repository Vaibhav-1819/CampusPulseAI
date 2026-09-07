# CampusPulse AI — Backend REST API & Intelligence Engine

## Ownership
- **Owner:** Developer 1 (Backend & Architecture Owner)
- **Scope:** Express server, SQLite database, REST routes, `AIService` integration, and `IncidentIntelligenceEngine`.

## Architecture Principles
1. **Separation of Concerns:**
   - `src/controllers`: Request validation and HTTP response envelopes.
   - `src/services`: Business logic (`ReportService`, `IncidentService`, `DashboardService`).
   - `src/ai`: `AIService` interface with `MockAIService` and `GeminiAIService`.
   - `src/engine`: Pure deterministic algorithms (`CorrelationEngine`, `SeverityImpactCalculator`, `EmergingIncidentDetector`).
   - `src/db`: SQLite schema and queries.
2. **API Contract Adherence:** All responses MUST match `/shared/api-contract.md`.
3. **Resilience:** Catch and handle all AI errors gracefully. Never fail a report submission if the external LLM is unreachable.
