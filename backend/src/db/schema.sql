-- CampusPulse AI SQLite Database Schema
PRAGMA foreign_keys = ON;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('student', 'staff', 'admin')) NOT NULL DEFAULT 'student',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT CHECK(category IN ('NETWORK', 'ELECTRICAL', 'PLUMBING', 'HVAC', 'PHYSICAL', 'EQUIPMENT', 'SAFETY', 'OTHER')) NOT NULL,
    building TEXT NOT NULL,
    severity TEXT CHECK(severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL DEFAULT 'LOW',
    impact_score INTEGER NOT NULL DEFAULT 0 CHECK(impact_score >= 0 AND impact_score <= 100),
    status TEXT CHECK(status IN ('OPEN', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')) NOT NULL DEFAULT 'OPEN',
    summary TEXT,
    recommendation TEXT,
    is_emerging INTEGER NOT NULL DEFAULT 0 CHECK(is_emerging IN (0, 1)),
    report_count INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    category TEXT CHECK(category IN ('NETWORK', 'ELECTRICAL', 'PLUMBING', 'HVAC', 'PHYSICAL', 'EQUIPMENT', 'SAFETY', 'OTHER')) NOT NULL DEFAULT 'OTHER',
    subcategory TEXT,
    building TEXT NOT NULL DEFAULT 'Unknown',
    room TEXT,
    severity TEXT CHECK(severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL DEFAULT 'LOW',
    impact_score INTEGER NOT NULL DEFAULT 10,
    ai_status TEXT CHECK(ai_status IN ('PENDING', 'COMPLETED', 'FAILED')) NOT NULL DEFAULT 'PENDING',
    ai_error TEXT,
    embedding TEXT,
    incident_id TEXT REFERENCES incidents(id) ON DELETE SET NULL,
    correlation_score REAL,
    correlation_reason TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Incident Events Table
CREATE TABLE IF NOT EXISTS incident_events (
    id TEXT PRIMARY KEY,
    incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    event_type TEXT CHECK(event_type IN ('CREATED', 'REPORT_LINKED', 'STATUS_CHANGED', 'SEVERITY_UPDATED', 'EMERGING_FLAGGED', 'AI_UPDATED')) NOT NULL,
    description TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_building ON incidents(building);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_updated_at ON incidents(updated_at);

CREATE INDEX IF NOT EXISTS idx_reports_incident_id ON reports(incident_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_building ON reports(building);

CREATE INDEX IF NOT EXISTS idx_incident_events_incident_id ON incident_events(incident_id, created_at);
