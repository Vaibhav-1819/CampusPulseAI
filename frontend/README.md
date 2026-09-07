# CampusPulse AI — Frontend Application

## Ownership Breakdown
- **Developer 2 (Student Frontend Owner):** `/src/features/student/**` (Student report submission flow, input validation, success receipts).
- **Developer 3 (Admin Frontend Owner):** `/src/features/admin/**` (Admin incident command center, timeline visualizer, metrics cards, triage action buttons).

## Rules of Engagement
1. **Parallel Development:** Develop against `/shared/api-contract.md` using `/src/services/mockApi.ts` before the backend is complete.
2. **No Backend Edits:** Frontend developers must not modify backend controllers, routes, or database schemas.
3. **Types:** Import models and response envelopes directly from `/shared/types/index.ts`.
4. **Design Aesthetics:** Use modern CSS with glassmorphism, rich color accents, and responsive layout.
