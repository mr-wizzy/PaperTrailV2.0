# Product Requirements Document (PRD)

| | |
|---|---|
| **Project** | Clinical Research Dashboard MVP |
| **Version** | 1.1 (AI-Executable Baseline) |
| **Status** | Ready for Development |
| **Architecture** | Single Page Application (SPA), Client-Side State |

---

## 1. System Architecture & Tech Stack

The application **MUST** use the following technical stack:

- **Framework:** React 18+ (bootstrapped with Vite)
- **Styling:** Tailwind CSS (utility-first, no custom unconstrained CSS files)
- **Icons:** Lucide React
- **State Management:** Native React state (`useState`, `useMemo`, `useCallback`)
- **Persistence:** Read-only bundled JSON file (`src/data/projects.json`)
- **Deployment Target:** Vercel (static single-page build: `vite build`)

---

## 2. Data Schema Contract

All project listings must adhere strictly to the following data contract. No fields outside this schema may be generated or referenced.

```typescript
export type ResearchPhase = "Phase I" | "Phase II" | "Phase III" | "Phase IV";
export type ProjectStatus = "Active" | "Recruiting" | "Completed" | "Suspended";

export interface ClinicalProject {
  id: string; // Format: "CRD-XXXX" (e.g., "CRD-1001")
  title: string;
  protocolNumber: string; // Format: "PRT-XXXXX"
  phase: ResearchPhase;
  status: ProjectStatus;
  principalInvestigator: string;
  therapeuticArea: "Oncology" | "Cardiology" | "Neurology" | "Immunology";
  enrollment: {
    current: number;
    target: number;
  };
  startDate: string; // ISO 8601 string: "YYYY-MM-DD"
  lastUpdated: string; // ISO 8601 string: "YYYY-MM-DD"
  description: string;
  primaryEndpoint: string;
}
```

A minimum of **8 mock records** spanning all statuses and therapeutic areas must be provided in `src/data/projects.json`.

---

## 3. Core State & Navigation Logic

The application does **NOT** use an external routing library. It uses a single-state view switcher synchronized with URL parameters to support deep links and native browser history.

### State Variables

| Variable | Type |
|---|---|
| `activeView` | `"dashboard"` \| `"details"` |
| `selectedProjectId` | `string` \| `null` |

### Transitions

- **Transition to Details:** Clicking any project card or table row sets `selectedProjectId = id` and `activeView = "details"`. Updates the browser URL to `?project=CRD-XXXX` via `window.history.pushState`.
- **Transition to Dashboard:** Clicking the "Back" button sets `selectedProjectId = null` and `activeView = "dashboard"`. Updates the browser URL to `/` via `window.history.pushState`.
- **Initial Page Load:** Read `window.location.search`. If `?project=CRD-XXXX` exists and matches a record in `projects.json`, mount directly to `activeView = "details"`. If no match, fall back to `activeView = "dashboard"`.
- **Browser Navigation:** Listen to `window.onpopstate` to ensure the Forward and Back browser buttons correctly synchronize `activeView` and `selectedProjectId`.

---

## 4. Screen-by-Screen Specifications

### Screen 1: Dashboard View

#### Metric Summary Ribbon

Display 4 non-clickable, auto-calculated metric cards derived directly from `src/data/projects.json`:

| Metric | Calculation |
|---|---|
| **Total Studies** | Total length of the projects array |
| **Active Studies** | Count where `status === "Active" \|\| status === "Recruiting"` |
| **Total Enrollment** | Sum of all `enrollment.current` across all studies |
| **Completion Rate** | Percentage integer: `Math.round((completedCount / totalCount) * 100)` |

#### Controls Toolbar

**Search Input**
- Placeholder: `"Search by title, protocol, or PI..."`
- Action: Debounced input (150ms). Updates the `searchTerm` string.

**Status Filter Dropdown**
- Options: `"All Statuses"`, `"Active"`, `"Recruiting"`, `"Completed"`, `"Suspended"`
- Default: `"All Statuses"`

**Therapeutic Area Filter Dropdown**
- Options: `"All Areas"`, `"Oncology"`, `"Cardiology"`, `"Neurology"`, `"Immunology"`
- Default: `"All Areas"`

**Reset Filters Button**
- Visible only when `searchTerm !== ""` **OR** any dropdown is not at its default value.
- Action: Resets `searchTerm = ""`, `statusFilter = "All Statuses"`, `areaFilter = "All Areas"`.

#### Data Presentation (Project Table / Card Grid)

**Compound Filtering Logic:** Evaluated synchronously against the immutable master list.

```javascript
const matchesSearch =
  project.title.toLowerCase().includes(term) ||
  project.protocolNumber.toLowerCase().includes(term) ||
  project.principalInvestigator.toLowerCase().includes(term);

const matchesStatus = statusFilter === "All Statuses" || project.status === statusFilter;
const matchesArea = areaFilter === "All Areas" || project.therapeuticArea === areaFilter;

const visible = matchesSearch && matchesStatus && matchesArea;
```

**Record Presentation**

- Protocol number and study title
- Status badge (see table below)
- Therapeutic Area badge
- Enrollment fraction: `current / target` with a visual progress bar (`(current / target) * 100%`)
- Principal Investigator name

**Status Badge Styles**

| Status | Color | Classes |
|---|---|---|
| Active | Emerald | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| Recruiting | Blue | `bg-blue-50 text-blue-700 border-blue-200` |
| Completed | Slate | `bg-slate-50 text-slate-700 border-slate-200` |
| Suspended | Amber | `bg-amber-50 text-amber-700 border-amber-200` |

**Row/Card Click:** Triggers navigation to Screen 2.

---

### Screen 2: Project Details View

#### Header

- "Back to Dashboard" button (includes Lucide `ArrowLeft` icon)
- Project Title and Status Badge
- Protocol Number and Primary Investigator

#### Details Grid

Two-column responsive layout:

**Left Column (Core Metadata)**
- Therapeutic Area
- Start Date
- Last Updated Date
- Enrollment metrics (Current count, Target count, % completed progress bar)

**Right Column (Study Content)**
- Study Description (full text paragraph)
- Primary Endpoint (highlighted callout card)

#### Fallback Behavior

If `selectedProjectId` does not resolve to an existing record, render the Empty State: **"Study not found"** with a direct button back to the Dashboard.

---

## 5. UI Boundary States

### No Filter Results

- **Trigger:** Filtered array length is 0, but the source array is not empty.
- **Display:**
  - Icon: `SearchX`
  - Heading: "No matching clinical studies"
  - Subtext: "Try adjusting your search terms or clearing your filters."
  - Button: "Reset All Filters"

### Zero Global Data

- **Trigger:** Source JSON array is empty (`[]`).
- **Display:**
  - Heading: "No research projects available"
  - Subtext: "No data has been loaded into the system."

---

## 6. Non-Functional Requirements & Guardrails

- **Zero Hydration Mismatches:** All calculations (`useMemo`) are deterministic and execute synchronously during client render.
- **Layout Constraints:**
  - Max container width: 1280px (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
  - Data display must switch from table to stacked cards on screen widths less than 768px (`md:` breakpoint).
  - Minimum touch target for all buttons and interactive controls: 44px by 44px.
- **Zero Console Warnings:** Clean build with no missing React keys (`key={project.id}` strictly enforced on all lists).

---

## 7. Explicit Exclusions (Out of Scope for AI Generation)

To prevent code generation drift, the AI must **NOT** generate code for:

- Backend endpoints, Express/Node servers, or mock API interceptors (Mirage/MSW)
- LocalStorage/SessionStorage syncing
- Edit, Create, or Delete modal dialogs or write-actions
- User authentication views or mock login splash screens
- CSV/PDF export routines

---

## 8. Definition of Done (Code Acceptance Criteria)

- [ ] `npm run build` exits with code 0 without TypeScript or bundle warnings.
- [ ] Metric cards accurately reflect exact counts from `projects.json`.
- [ ] Searching "Oncology" filters the table immediately without breaking, regardless of character case.
- [ ] Combining Search + Status Filter + Area Filter resolves using strict AND logic.
- [ ] Clicking a project displays the full detail view with the matching ID.
- [ ] Clicking "Back" restores the previous dashboard view with filters intact.
- [ ] Responsive inspection confirms no horizontal scrollbars on a 375px mobile viewport.
