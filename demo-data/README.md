# CampusPulse AI — Demo Data & Seeding

## Ownership
- **Owner:** Developer 4 (Integration, QA & Demo Owner)

## Canonical Demo Walkthrough (`demo-scenario.json`)
This directory contains the controlled sequence of student reports that proves the core CampusPulse value proposition during the final hackathon presentation:

1. **Report 1:** Isolated report of WiFi failure in CSE Block → Creates initial `OPEN` incident.
2. **Report 2:** Second report from CSE Lab 3 → Correlated to existing incident (demonstrating multi-factor semantic + location matching).
3. **Report 3:** Third report within 45 minutes → Triggers **Emerging Incident** velocity alert! Impact rises to 72.
4. **Report 4:** Fourth report from CSE staff → Incident hits High severity (88 impact); AI recommendation urges core switch inspection.
5. **Report 5:** Unrelated plumbing leak in Library → Creates distinct incident (proves system doesn't falsely cluster everything).
6. **Report 6:** HVAC failure in Science Annex → Creates independent third incident.

## Seeding
```bash
cd backend
npm run db:seed-demo
```
