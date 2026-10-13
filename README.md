# CivicFix AI — Smart Civic Issue Reporting & Resolution Platform

> **Hackathon Prototype**: Fast-track civic issue reporting with transparent heuristic prioritization, real-time spatial mapping, and demo administration. No database configuration required.

[![Node Version](https://img.shields.io/badge/Node-v18%2B-blue)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://react.js.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)](https://tailwindcss.com/)

---

## 🏛️ Problem Statement & Overview
Citizens encounter potholes, garbage overflows, drinking water line bursts, damaged streetlights, and dangerous open manholes daily. Conventional grievance portals suffer from opaque processing times, slow manual triage, and lack of citizen visibility.

**CivicFix AI** provides an end-to-end municipal issue reporting and resolution platform:
1. **Citizens** submit complaints with instant heuristic priority scoring, attached photos, and geocoded landmarks.
2. **Operations Teams** monitor urgency queues, triage safety-critical reports, dispatch field crews, and escalate lifecycles.
3. **Transparent Algorithm**: Replaces black-box AI claims with an auditable rule-based engine factoring category risk baselines and life-safety hazard triggers.

---

## ⚡ Quick Start (Under 1 Minute)

### 1. Install All Dependencies
From the repository root:
```bash
npm run install:all
```
*(Or install manually: `npm install && cd backend && npm install && cd ../frontend && npm install`)*

### 2. One-Click Launch (Python or Batch)
```bash
python start.py
```
*(Or double-click `start.bat` in Windows. This frees up ports 5000 & 5173, starts both servers, and opens your browser automatically!)*

### Alternative: Start via npm
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🏗️ Architecture & In-Memory Persistence Model

> [!IMPORTANT]
> **Zero Database / Hackathon Design**: 
> This prototype deliberately avoids Supabase, Firebase, MongoDB, or PostgreSQL.
> - **Server Memory**: The Express backend operates with in-memory JavaScript data structures for blazing fast CRUD and zero setup. Server restarts restore the default 14 realistic demo cases.
> - **Client-Side Resilience**: The React frontend synchronizes with browser `localStorage`. If the server goes offline or restarts, the UI continues operating seamlessly with cached data and local computation.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│   React 18 + Vite + Tailwind CSS + Lucide Icons + Leaflet   │
│   - Live Heuristics Preview Form                            │
│   - localStorage Backup & Cache                             │
└──────────────────────────────▲──────────────────────────────┘
                               │ JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    Express.js Backend                       │
│   Node.js (Port 5000)                                       │
│   - Rule-Based Classifier Service                           │
│   - In-Memory Data Store (14 Realistic Seed Cases)          │
│   - CSV Streaming & Analytics Aggregator                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Implemented Features

| Feature | Description |
| :--- | :--- |
| **Operational Dashboard** | 5 live KPI cards (Total, Open, In Progress, Resolved, Critical/High), weekly trend bar chart, category breakdown, and recent reports table. |
| **Interactive Issue Submission** | Validated form with categories (pothole, garbage, water leakage, streetlight, drainage, road damage, other), landmark presets, photo upload preview, and reporter name. |
| **Live Heuristics Assessment** | Deterministic score (0–100) and label (Low, Medium, High, Critical) computed in real-time as the citizen types, highlighting life safety triggers. |
| **Reports Explorer** | Multi-attribute search (ID, title, description, location), category filter, status filter, priority filter, newest/priority sorting, and Table/Card view toggles. |
| **Report Details & Audit Trail** | Full modal view showing issue breakdown, rationale reasons, attached photo, and visual 4-step resolution lifecycle with timestamped history. |
| **Demo Admin Operations** | Toggleable demo administration mode enabling one-click lifecycle transitions (`Submitted` → `Acknowledged` → `In Progress` → `Resolved`) with operator audit notes. |
| **Interactive Spatial Map** | Leaflet OpenStreetMap view rendering geocoded colored pins by priority, interactive popups, and click-to-view modal integration. |
| **CSV Export** | Export currently filtered issues both via browser-side JavaScript generation and backend `/api/reports/export`. |
| **Demo Seed & Reset** | Pre-seeded with 14 diverse realistic metropolitan cases across all categories and priority tiers. Includes a one-click reset with confirmation. |

---

## 🧮 Transparent Heuristic Scoring Rules

CivicFix AI computes priority deterministically:
$$\text{Priority Score} = \text{Base Category Score} + \sum(\text{Hazard Boosts}) - \text{Mitigating Context}$$

### 1. Baseline Scores
- **Drainage / Sewage Clog**: 68 pts
- **Water Leakage / Pipe Burst**: 64 pts
- **Road / Sidewalk Structural Damage**: 58 pts
- **Damaged Streetlight**: 55 pts
- **Pothole**: 52 pts
- **Garbage Overflow**: 46 pts
- **Other**: 40 pts

### 2. High-Impact Safety Hazard Rules
- `exposed wire`, `live wire`, `sparking`, `electric shock`: **+38 pts** (Life-safety electrocution risk)
- `open manhole`, `missing manhole cover`, `sinkhole`: **+36 pts** (Fall / collision hazard)
- `ambulance blocked`, `hospital entrance`: **+35 pts** (Emergency corridor blockage)
- `gas leak`, `toxic fumes`, `explosion risk`: **+40 pts** (Atmospheric hazard)
- `school zone`, `kindergarten`, `hospital`: **+22 pts** (Vulnerable population vicinity)
- `highway`, `expressway`, `busy intersection`: **+20 pts** (High-speed traffic corridor)
- `flooding`, `waterlogging`, `submerged`: **+22 pts** (Urban flooding hazard)
- `foul smell`, `mosquito breeding`, `dengue`: **+18 pts** (Public health vector risk)
- `total darkness`, `pitch black`, `women safety`: **+18 pts** (Nighttime security hazard)
- `minor`, `cosmetic`, `slow drip`, `side alley`: **-14 pts** (Mitigating context)

### 3. Priority Tiers
- **Critical (85 – 100)**: Immediate 4–12 hour response
- **High (65 – 84)**: Prompt 24–48 hour response
- **Medium (40 – 64)**: 3–5 day standard resolution
- **Low (10 – 39)**: 7–14 day routine maintenance

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server uptime and in-memory status disclaimer | — |
| `GET` | `/api/reports` | List reports with search, filter, and pagination | `search`, `category`, `status`, `priority`, `sort`, `page`, `limit` |
| `GET` | `/api/reports/:id` | Fetch detailed single report | `:id` (e.g. `CF-2026-1001`) |
| `POST` | `/api/reports` | Create & classify new report | `{ title, description, category, location, reporterName, imagePreview }` |
| `PATCH`| `/api/reports/:id/status`| Update status & append history | `{ status, note, updatedBy }` |
| `GET` | `/api/stats` | Dashboard KPI metrics and weekly trends | — |
| `GET` | `/api/reports/export` | Download filtered reports as CSV | `search`, `category`, `status`, `priority` |
| `POST` | `/api/reports/reset` | Restore 14 default seed reports | — |

---

## 📂 Project Directory Structure

```
civicfix-ai/
├── package.json               # Root scripts (install:all, dev, build)
├── README.md                  # Complete documentation & guide
├── backend/
│   ├── package.json           # Express, CORS
│   ├── server.js              # Express app setup, logging, routes
│   ├── controllers/
│   │   ├── reportsController.js  # CRUD, status patch, CSV export, reset
│   │   └── statsController.js    # Aggregations & KPIs
│   ├── routes/
│   │   ├── reportsRoutes.js
│   │   ├── statsRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   ├── classifierService.js  # Heuristic scoring engine
│   │   └── reportsStore.js       # In-memory database with query filters
│   ├── data/
│   │   └── seedData.js           # 14 realistic metropolitan civic cases
│   └── middleware/
│       └── errorHandler.js       # Centralized error handler & 404
└── frontend/
    ├── package.json           # React, Vite, Tailwind, Lucide, Leaflet
    ├── vite.config.js         # Port 5173 + /api proxy to 5000
    ├── tailwind.config.js     # Custom brand teal & navy color palette
    ├── index.html             # Inter typography & Leaflet CDN
    └── src/
        ├── main.jsx           # App entry point
        ├── App.jsx            # Shell with responsive tabs & drawer
        ├── index.css          # Tailwind base & custom scrollbars
        ├── api/
        │   └── apiClient.js   # Resilient fetch client with timeout
        ├── context/
        │   └── ReportsContext.jsx # React context, toasts, localStorage sync
        ├── utils/
        │   ├── classifier.js  # Client-side heuristic mirror
        │   ├── csvExporter.js # UTF-8 BOM CSV generator
        │   └── formatters.js  # Badges, dates, relative time
        └── components/
            ├── Common/        # StatusPill, PriorityBadge, Toast, ConfirmModal
            ├── Layout/        # Collapsible Sidebar, Navbar, Brand Header
            ├── Dashboard/     # MetricCards, TrendsChart, CategoryChart, RecentReports
            ├── Reports/       # ReportForm, ReportFilters, ReportTable, ReportCard, ReportDetailModal
            ├── Map/           # CivicMap with Leaflet pins & hotspot drawer
            ├── Admin/         # AdminOverview with fast triage & dispatch
            └── ClassifierExplainer/ # ClassificationPreview sandbox & rules
```

---

## 🧪 Demo Flow Walkthrough

1. **Dashboard Overview**: Open [http://localhost:5173](http://localhost:5173). View real-time KPIs, 7-day trend chart, and category distribution.
2. **Submit an Urgent Report**:
   - Click **Report Issue**.
   - Select category `Damaged Streetlight`.
   - In Description, type *"There is an exposed live wire hanging down with sparks near the school entrance"*.
   - Observe the **Live Assessment Box** immediately compute **Critical Priority (98/100)** with specific reasons.
   - Click **Submit Civic Issue Report**. A success notification appears, and the new report is shown instantly.
3. **Explore & Filter**:
   - Go to **Reports Explorer**. Filter by category `Drainage` or search for `pothole`.
   - Switch between **Table View** and **Card View**.
   - Click **Export CSV** to download the filtered table.
4. **Spatial Map**:
   - Open **Civic Map View**. Pan and zoom across the metropolitan area, click pins to inspect popups, and click any item to open full details.
5. **Admin Operations**:
   - Toggle **Admin Mode** in the top navigation bar.
   - Open **Admin Command**. Review the urgent triage queue and click **Dispatch Crew** or **Mark Resolved**.
   - Inspect the visual 4-step status timeline with updated notes and timestamps.
6. **Reset Demo Data**:
   - Click **Reset Demo** in the top bar and confirm to restore the pristine 14 demo cases anytime.

---

## 🔒 Limitations & Production Considerations
- **In-Memory Storage**: Current backend entities exist in Node.js process memory. In production, connect an ORM (e.g. Prisma) with PostgreSQL.
- **Image Uploads**: Image previews are handled via safe client-side data URLs and are not stored in memory to preserve server resources. In production, integrate S3 or Google Cloud Storage buckets.
- **Authentication**: Admin mode is a convenient zero-friction toggle designed for live demonstrations and hackathon judges. In production, enforce JWT / OAuth 2.0 authentication.
