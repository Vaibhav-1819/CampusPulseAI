# CampusPulse AI — Verification & Testing Suite

## Ownership
- **Owner:** Developer 4 (Integration & QA Owner), with contributions from Developer 1.

## Structure
- `/tests/unit/`: Pure algorithmic unit tests for `CorrelationEngine`, cosine similarity, impact score math, and emerging velocity triggers.
- `/tests/integration/`: Supertest/Fetch tests validating Express REST endpoints against `/shared/api-contract.md`.

## Running Tests
```bash
cd backend
npm test
```
