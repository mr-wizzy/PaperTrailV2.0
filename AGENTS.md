# AGENTS.md — AI Agent Operating Instructions

This file contains strict guidelines, execution rules, and system constraints for any AI coding agent working on the **PaperTrail Clinical Research Dashboard** repository.

---

## 1. Prime Directives

1. **Adhere to `Clinical Research PRD.md` Strictly:** Never add unrequested backend dependencies, external database engines, login systems, or persistent storage.
2. **Deterministic Architecture:** Use React 18+ (Vite) + Tailwind CSS + Lucide React. Build responsive native SVG/CSS data visualizations (zero external chart packages).
3. **No External Routing Libraries:** Do not install `react-router`, `wouter`, or similar. Navigation must follow the URL search param state engine defined in Section 4 of `Clinical Research PRD.md` (`?view=...&id=...`).
4. **Immutable State Handling:** Filter and search operations must calculate derived state (`useMemo`) from the static dataset in `src/data/projects.json`. Never mutate the primary data array.

---

## 2. Directory Structure Contract

You must adhere strictly to the following project layout:

```text
clinical-research-dashboard/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── PRD.md
├── AGENTS.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/
    │   └── project.ts
    ├── data/
    │   └── projects.json
    └── components/
        ├── layout/
        │   ├── Header.tsx
        │   ├── Sidebar.tsx
        │   └── Container.tsx
        ├── dashboard/
        │   ├── ExecutiveDashboard.tsx       # Screen 1
        │   ├── EnrollmentTrendChart.tsx
        │   ├── EnrollmentByStudy.tsx
        │   ├── RecentStudiesTable.tsx
        │   └── MetricCard.tsx
        ├── studies/
        │   ├── StudiesDirectory.tsx         # Screen 2
        │   ├── FilterToolbar.tsx
        │   ├── ProjectTable.tsx
        │   └── ProjectCard.tsx
        ├── details/
        │   ├── StudyOverview.tsx            # Screen 3
        │   ├── TimelineBar.tsx
        │   └── SitePreviewList.tsx
        ├── sites/
        │   ├── SitePerformanceView.tsx      # Screen 4
        │   └── SitePerformanceTable.tsx
        ├── reports/
        │   ├── StudyReportView.tsx          # Screen 5
        │   ├── KeyFindingCard.tsx
        │   └── ProtocolMetricsCard.tsx
        └── common/
            ├── Breadcrumbs.tsx
            ├── StatusBadge.tsx
            ├── RiskBadge.tsx
            ├── ProgressBar.tsx
            └── EmptyState.tsx
```

---

## 3. Strict Coding Conventions

### TypeScript & Typing

- Import interfaces only from `src/types/project.ts`.
- Strictly prohibit `any`. Explicitly type all component props, helper functions, and event parameters.
- Use union types for status, phase, and risk (`ResearchPhase`, `ProjectStatus`, `RiskLevel`, `ComplianceRating`, `SiteStatus`).

### Tailwind CSS & UI Rules

- Do not create standalone `.css` files except for Tailwind directives inside `src/index.css`.
- Use concrete semantic Tailwind color tokens for statuses and risk levels:

  | Status / Risk | Classes |
  |---|---|
  | Active | `bg-emerald-50 text-emerald-700 border-emerald-200` |
  | Recruiting | `bg-blue-50 text-blue-700 border-blue-200` |
  | Completed | `bg-slate-50 text-slate-700 border-slate-200` |
  | Suspended / On Hold | `bg-amber-50 text-amber-700 border-amber-200` |
  | Inactive | `bg-rose-50 text-rose-700 border-rose-200` |
  | Critical Risk | `bg-rose-50 text-rose-700 border-rose-200 font-semibold` |
  | High Risk | `bg-amber-50 text-amber-700 border-amber-200` |
  | Medium Risk | `bg-yellow-50 text-yellow-700 border-yellow-200` |
  | Low Risk | `bg-emerald-50 text-emerald-700 border-emerald-200` |

- Mobile responsiveness is **non-negotiable**:
  - Use `hidden md:table` for desktop tables.
  - Use `block md:hidden` for mobile card layouts.
  - Wrap tables in an overflow container: `overflow-x-auto`.
  - Maintain touch targets of at least 44px by 44px on all interactive controls.

### Data Handling

- Place complete, realistic records in `src/data/projects.json` matching the `ClinicalProject` interface.
- Ensure flagship trial `COVID-2022` is fully detailed with site data, key findings, and regulatory metadata.
- Guard all search strings using `.trim().toLowerCase()`.
- Add fallback values to prevent UI crashes if a text string is unexpectedly missing: `project.primaryEndpoint || "N/A"`.

---

## 4. Execution Workflow (Step-by-Step)

When implementing the 5-screen flow:

1. **Schema & Seed Expansion:** Update `src/types/project.ts` and `src/data/projects.json` with the expanded multi-site, risk, and regulatory data contracts.
2. **Persistent Shell Setup:** Build `Sidebar.tsx` and integrate with `Header.tsx` and `Container.tsx`.
3. **Screen 1 (Executive Dashboard):** Build `ExecutiveDashboard.tsx`, SVG `EnrollmentTrendChart.tsx`, and `EnrollmentByStudy.tsx`.
4. **Screen 2 (All Studies Directory):** Refactor existing table/card directory under `src/components/studies/`.
5. **Screen 3 (Study Command Center):** Implement `StudyOverview.tsx` with `TimelineBar.tsx` and site preview.
6. **Screen 4 (Site Performance Details):** Build `SitePerformanceView.tsx` and `SitePerformanceTable.tsx`.
7. **Screen 5 (Study Report & Export):** Build `StudyReportView.tsx` with confidential header, `KeyFindingCard.tsx`, and print/export hooks.
8. **Navigation & URL Synchronization:** Wire up `App.tsx` view router and test deep-linking and browser back/forward history.
9. **Verification & Audit:** Run `npm run build` and ensure zero TypeScript errors or linter warnings.

---

## 5. Prohibited Actions (Stop Immediately If Triggered)

- **DO NOT** configure a Node.js/Express server or serverless backend functions.
- **DO NOT** use `localStorage`, `sessionStorage`, or IndexedDB.
- **DO NOT** install full component suites like MUI, AntD, or Chakra. Use raw Tailwind components.
- **DO NOT** install external routing packages like `react-router-dom`. Use native URL state.
