# CampusPulse AI — REST API Contract (Frozen Specification)

> **FROZEN SPECIFICATION FOR ALL FRONTEND & BACKEND DEVELOPERS**
> - **Backend Developers (Dev 1):** You MUST implement endpoints to match this exact schema.
> - **Frontend Developers (Dev 2 & 3):** You MUST build UI views against this exact contract using mock fixtures until the backend endpoints are online.
> - **Contract Updates:** No single developer may unilaterally change this contract. Any modifications require team consensus and an immediate update to this file and `/shared/types/index.ts`.

---

## 1. Global Standards & Conventions

- **Base URL:** `/api`
- **Content Type:** `application/json` for all request and response bodies.
- **Timestamp Format:** ISO 8601 UTC strings (e.g., `2026-09-07T10:30:00.000Z`).

### Standard Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Standard Error Response Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description and building are required.",
    "details": [
      { "field": "description", "issue": "Must be at least 10 characters long" }
    ]
  }
}
```

### Common HTTP Status Codes
| Code | Reason | Meaning |
|---|---|---|
| `200 OK` | Standard success | Request processed successfully |
| `201 Created` | Resource created | Report or incident successfully created |
| `400 Bad Request` | Validation failure | Missing required fields or malformed JSON |
| `404 Not Found` | Resource missing | Requested report or incident ID does not exist |
| `500 Internal Error`| Server failure | Unhandled exception (caught by error middleware) |

---

## 2. API Endpoints

### 2.1 `POST /api/reports`
Submits a new infrastructure issue from a student or staff member. The backend automatically runs AI extraction, checks for correlation against active incidents, updates/creates an incident, and recalculates impact scores.

- **Method:** `POST`
- **URL:** `/api/reports`

#### Request Body
```json
{
  "description": "WiFi is completely down in CSE Block Lab 3 since 9 AM, no one can access course materials.",
  "user_id": "usr_student_01",
  "building": "CSE Block",
  "room": "Lab 3",
  "category": "NETWORK"
}
```

| Field | Type | Required? | Description |
|---|---|---|---|
| `description` | string | **Yes** | Raw user text (min 5 characters) |
| `user_id` | string | No | Submitting user ID (default: `"anonymous"`) |
| `building` | string | No | User-selected building (if omitted, AI extracts it) |
| `room` | string | No | User-selected room or sublocation |
| `category` | string | No | One of: `NETWORK`, `ELECTRICAL`, `PLUMBING`, `HVAC`, `PHYSICAL`, `EQUIPMENT`, `SAFETY`, `OTHER` |

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "rep_a1b2c3d4",
      "description": "WiFi is completely down in CSE Block Lab 3 since 9 AM, no one can access course materials.",
      "category": "NETWORK",
      "subcategory": "WIFI",
      "building": "CSE Block",
      "room": "Lab 3",
      "severity": "HIGH",
      "impact_score": 35,
      "ai_status": "COMPLETED",
      "incident_id": "inc_cse_net_01",
      "correlation_score": 0.88,
      "correlation_reason": "Grouped into 'CSE Block Network Failure' due to high semantic similarity (92%), matching building [CSE Block], category [NETWORK], within 45m.",
      "created_at": "2026-09-07T10:30:00.000Z"
    },
    "incident": {
      "id": "inc_cse_net_01",
      "title": "CSE Block Network Failure",
      "category": "NETWORK",
      "building": "CSE Block",
      "severity": "HIGH",
      "impact_score": 75,
      "status": "OPEN",
      "is_emerging": true,
      "report_count": 4,
      "summary": "Multiple student reports confirm widespread WiFi disruption affecting CSE Block laboratories.",
      "recommendation": "Dispatch campus network team to inspect core switches and access points in CSE Block.",
      "created_at": "2026-09-07T09:45:00.000Z",
      "updated_at": "2026-09-07T10:30:00.000Z"
    }
  },
  "error": null
}
```

---

### 2.2 `GET /api/reports`
Retrieves a paginated or filtered list of student reports.

- **Method:** `GET`
- **URL:** `/api/reports`

#### Query Parameters
| Param | Type | Default | Description |
|---|---|---|---|
| `incident_id` | string | null | Filter reports belonging to a specific incident |
| `building` | string | null | Filter by campus building |
| `category` | string | null | Filter by category |
| `limit` | number | 50 | Maximum number of records to return |
| `offset` | number | 0 | Pagination offset |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "rep_a1b2c3d4",
        "description": "WiFi is completely down in CSE Block Lab 3 since 9 AM.",
        "category": "NETWORK",
        "subcategory": "WIFI",
        "building": "CSE Block",
        "room": "Lab 3",
        "severity": "HIGH",
        "impact_score": 35,
        "ai_status": "COMPLETED",
        "incident_id": "inc_cse_net_01",
        "correlation_score": 0.88,
        "correlation_reason": "High semantic similarity and identical location.",
        "created_at": "2026-09-07T10:30:00.000Z"
      }
    ],
    "total": 1
  },
  "error": null
}
```

---

### 2.3 `GET /api/incidents`
Lists all campus incidents for the Admin Dashboard.

- **Method:** `GET`
- **URL:** `/api/incidents`

#### Query Parameters
| Param | Type | Default | Description |
|---|---|---|---|
| `status` | string | null | Filter by status: `OPEN`, `INVESTIGATING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `severity` | string | null | Filter by severity: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `building` | string | null | Filter by building |
| `is_emerging` | boolean| null | If `true`, returns only rapidly growing incidents |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "incidents": [
      {
        "id": "inc_cse_net_01",
        "title": "CSE Block Network Failure",
        "category": "NETWORK",
        "building": "CSE Block",
        "severity": "HIGH",
        "impact_score": 75,
        "status": "OPEN",
        "is_emerging": true,
        "report_count": 4,
        "summary": "Multiple student reports confirm widespread WiFi disruption affecting CSE Block laboratories.",
        "recommendation": "Dispatch campus network team to inspect core switches and access points in CSE Block.",
        "created_at": "2026-09-07T09:45:00.000Z",
        "updated_at": "2026-09-07T10:30:00.000Z"
      },
      {
        "id": "inc_lib_plumb_02",
        "title": "Library 2nd Floor Water Leak",
        "category": "PLUMBING",
        "building": "Central Library",
        "severity": "MEDIUM",
        "impact_score": 42,
        "status": "INVESTIGATING",
        "is_emerging": false,
        "report_count": 2,
        "summary": "Pipe leak reported near 2nd floor restrooms spreading towards reading room.",
        "recommendation": "Shut off local water valve and send maintenance technician.",
        "created_at": "2026-09-07T08:15:00.000Z",
        "updated_at": "2026-09-07T09:10:00.000Z"
      }
    ],
    "total": 2
  },
  "error": null
}
```

---

### 2.4 `GET /api/incidents/:id`
Retrieves detailed information for a single incident, including all correlated student reports and the chronological event timeline.

- **Method:** `GET`
- **URL:** `/api/incidents/:id` (e.g., `/api/incidents/inc_cse_net_01`)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "incident": {
      "id": "inc_cse_net_01",
      "title": "CSE Block Network Failure",
      "category": "NETWORK",
      "building": "CSE Block",
      "severity": "HIGH",
      "impact_score": 75,
      "status": "OPEN",
      "is_emerging": true,
      "report_count": 4,
      "summary": "Multiple student reports confirm widespread WiFi disruption affecting CSE Block laboratories.",
      "recommendation": "Dispatch campus network team to inspect core switches and access points in CSE Block.",
      "created_at": "2026-09-07T09:45:00.000Z",
      "updated_at": "2026-09-07T10:30:00.000Z"
    },
    "reports": [
      {
        "id": "rep_01",
        "description": "WiFi isn't working in CSE Block.",
        "category": "NETWORK",
        "subcategory": "WIFI",
        "building": "CSE Block",
        "room": "General",
        "severity": "MEDIUM",
        "impact_score": 25,
        "correlation_score": 1.0,
        "correlation_reason": "Anchor report that initiated this incident.",
        "created_at": "2026-09-07T09:45:00.000Z"
      },
      {
        "id": "rep_02",
        "description": "Internet has been down since morning in CSE Lab 3.",
        "category": "NETWORK",
        "subcategory": "WIFI",
        "building": "CSE Block",
        "room": "Lab 3",
        "severity": "HIGH",
        "impact_score": 30,
        "correlation_score": 0.89,
        "correlation_reason": "High semantic similarity (91%) and exact building match.",
        "created_at": "2026-09-07T10:05:00.000Z"
      }
    ],
    "timeline": [
      {
        "id": "evt_01",
        "event_type": "CREATED",
        "description": "Incident initialized from report rep_01",
        "created_at": "2026-09-07T09:45:00.000Z"
      },
      {
        "id": "evt_02",
        "event_type": "REPORT_LINKED",
        "description": "Correlated report rep_02 from CSE Lab 3 (Score: 0.89)",
        "created_at": "2026-09-07T10:05:00.000Z"
      },
      {
        "id": "evt_03",
        "event_type": "EMERGING_FLAGGED",
        "description": "Report arrival velocity exceeded 3 reports/hr. Flagged as EMERGING.",
        "created_at": "2026-09-07T10:25:00.000Z"
      }
    ]
  },
  "error": null
}
```

#### Error Response (`404 Not Found`)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Incident with ID inc_99999 was not found."
  }
}
```

---

### 2.5 `PATCH /api/incidents/:id/status`
Updates the operational status of an incident (triage action by administrator).

- **Method:** `PATCH`
- **URL:** `/api/incidents/:id/status`

#### Request Body
```json
{
  "status": "INVESTIGATING",
  "notes": "Network team notified. Field technician dispatched to CSE server room."
}
```

| Field | Type | Required? | Allowed Values |
|---|---|---|---|
| `status` | string | **Yes** | `OPEN`, `INVESTIGATING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `notes` | string | No | Optional administrative triage notes logged to timeline |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "incident": {
      "id": "inc_cse_net_01",
      "status": "INVESTIGATING",
      "updated_at": "2026-09-07T10:45:00.000Z"
    },
    "event": {
      "id": "evt_04",
      "event_type": "STATUS_CHANGED",
      "description": "Status updated from OPEN to INVESTIGATING. Notes: Network team notified.",
      "created_at": "2026-09-07T10:45:00.000Z"
    }
  },
  "error": null
}
```

---

### 2.6 `GET /api/dashboard/stats`
Provides aggregated metrics and telemetry for the Admin Dashboard overview.

- **Method:** `GET`
- **URL:** `/api/dashboard/stats`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "active_incidents": 5,
    "emerging_incidents": 2,
    "total_reports_today": 24,
    "resolved_today": 8,
    "severity_breakdown": {
      "CRITICAL": 1,
      "HIGH": 2,
      "MEDIUM": 2,
      "LOW": 0
    },
    "category_breakdown": {
      "NETWORK": 11,
      "ELECTRICAL": 5,
      "PLUMBING": 4,
      "HVAC": 3,
      "OTHER": 1
    },
    "recent_activity": [
      {
        "id": "evt_03",
        "incident_id": "inc_cse_net_01",
        "incident_title": "CSE Block Network Failure",
        "event_type": "EMERGING_FLAGGED",
        "description": "Velocity surge: 4 reports in 45m",
        "created_at": "2026-09-07T10:25:00.000Z"
      }
    ]
  },
  "error": null
}
```

---

## 3. Mock Data Fixtures for Frontend Parallel Development

Frontend developers can copy this exact structure directly into `/frontend/src/services/mockData.ts` to power the Student UI and Admin Dashboard before backend implementation begins:

```typescript
export const MOCK_DASHBOARD_STATS = {
  active_incidents: 3,
  emerging_incidents: 1,
  total_reports_today: 14,
  resolved_today: 4,
  severity_breakdown: { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 0 },
  category_breakdown: { NETWORK: 7, PLUMBING: 4, ELECTRICAL: 3 },
  recent_activity: []
};

export const MOCK_INCIDENTS = [
  {
    id: "inc_cse_net_01",
    title: "CSE Block Network Failure",
    category: "NETWORK",
    building: "CSE Block",
    severity: "HIGH",
    impact_score: 75,
    status: "OPEN",
    is_emerging: true,
    report_count: 4,
    summary: "Multiple reports indicate a campus WiFi outage localized to CSE Block laboratories.",
    recommendation: "Reboot building switch stack and inspect AP power supplies.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString()
  }
];
```
