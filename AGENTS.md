# AGENTS.md — AI Agent Operating Instructions

This file contains strict guidelines, execution rules, and system constraints for any AI coding agent working on the **Clinical Research Dashboard MVP** repository.

---

## 1. Prime Directives

1. **Adhere to `PRD.md` Strictly:** Never add unrequested features (e.g., login, edit modals, dark mode toggles, persistent storage, third-party state managers).
2. **Deterministic Architecture:** Use React 18+ (Vite) + Tailwind CSS + Lucide React. Do not install additional dependencies without explicit developer confirmation.
3. **No External Routing Libraries:** Do not install `react-router`, `wouter`, or similar. Navigation must follow the URL search param state engine defined in Section 3 of `PRD.md`.
4. **Immutable State Handling:** Filter and search operations must calculate derived state (`useMemo`) from the static dataset. Never mutate the primary data array.

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
        │   └── Container.tsx
        ├── dashboard/
        │   ├── MetricRibbon.tsx
        │   ├── MetricCard.tsx
        │   ├── FilterToolbar.tsx
        │   ├── ProjectTable.tsx
        │   └── ProjectCard.tsx
        ├── details/
        │   └── ProjectDetailView.tsx
        └── common/
            ├── StatusBadge.tsx
            ├── ProgressBar.tsx
            └── EmptyState.tsx
```

---

## 3. Strict Coding Conventions

### TypeScript & Typing

- Import interfaces only from `src/types/project.ts`.
- Strictly prohibit `any`. Explicitly type all component props, helper functions, and event parameters.
- Use union types for status and phase (`ResearchPhase`, `ProjectStatus`).

### Tailwind CSS & UI Rules

- Do not create standalone `.css` files except for Tailwind directives inside `src/index.css`.
- Use concrete semantic Tailwind color tokens for statuses:

  | Status | Classes |
  |---|---|
  | Active | `bg-emerald-50 text-emerald-700 border-emerald-200` |
  | Recruiting | `bg-blue-50 text-blue-700 border-blue-200` |
  | Completed | `bg-slate-50 text-slate-700 border-slate-200` |
  | Suspended | `bg-amber-50 text-amber-700 border-amber-200` |

- Mobile responsiveness is **non-negotiable**:
  - Use `hidden md:table` for the desktop table.
  - Use `block md:hidden` for the mobile card layout.
  - Wrap tables in an overflow container: `overflow-x-auto`.

### Data Handling

- Place at least 8 complete, realistic records in `src/data/projects.json` matching the `ClinicalProject` interface.
- Guard all search strings using `.trim().toLowerCase()`.
- Add fallback values to prevent UI crashes if a text string is unexpectedly missing: `project.primaryEndpoint || "N/A"`.

---

## 4. Execution Workflow (Step-by-Step)

When tasked with generating or modifying the codebase, execute in this order:

1. **Scaffold Types & Mock Data:** Ensure `src/types/project.ts` and `src/data/projects.json` are generated and strictly validate against the schema contract.
2. **Setup Base Layout & UI Shell:** Create `Header.tsx` and `Container.tsx`, and verify root typography and responsiveness.
3. **Build Core Logic & Metrics:** Implement `useMemo` hooks for total studies, active studies, total enrollment, and completion rate calculations.
4. **Implement Search & Filtering:** Build `FilterToolbar.tsx` with controlled inputs and verify compound boolean logic.
5. **Implement Table & Card Displays:** Build both desktop table rows and mobile card views using shared atomic components (`StatusBadge.tsx`, `ProgressBar.tsx`).
6. **Implement Details View & Navigation:** Implement the URL search parameter synchronizer (`?project=ID`) and verify browser Back/Forward functionality.
7. **Verification & Audit:** Run `npm run build` and ensure zero TypeScript errors or linter warnings.

---

## 5. Prohibited Actions (Stop Immediately If Triggered)

- **DO NOT** attempt to configure a Node.js/Express server or serverless backend functions.
- **DO NOT** use `localStorage`, `sessionStorage`, or IndexedDB.
- **DO NOT** create modals or forms for "Add New Study" or "Edit Study".
- **DO NOT** install full component suites like MUI, AntD, or Chakra. Use raw Tailwind components.
