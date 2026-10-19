export type ResearchPhase = "Phase I" | "Phase II" | "Phase III" | "Phase IV";
export type ProjectStatus = "Active" | "Recruiting" | "Completed" | "Suspended";
export type TherapeuticArea = "Oncology" | "Cardiology" | "Neurology" | "Immunology";

export type StatusFilter = "All Statuses" | ProjectStatus;
export type AreaFilter = "All Areas" | TherapeuticArea;

export interface ClinicalProject {
  id: string;
  title: string;
  protocolNumber: string;
  phase: ResearchPhase;
  status: ProjectStatus;
  principalInvestigator: string;
  therapeuticArea: TherapeuticArea;
  enrollment: {
    current: number;
    target: number;
  };
  startDate: string;
  lastUpdated: string;
  description: string;
  primaryEndpoint: string;
}

