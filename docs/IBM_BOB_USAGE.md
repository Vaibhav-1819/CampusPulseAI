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

Team members should record notable prompts and agent sessions below:

```markdown
### [Date] [Developer Role] — [Feature Name]
- **Tool / Assistant:** IBM Bob / Antigravity Agent
- **Objective:** What was being implemented or debugged?
- **Prompt Summary:** Core prompt used with the assistant.
- **Agent Output:** Code, test, or documentation produced.
- **Human Verification:** How was the output tested and validated?
```
