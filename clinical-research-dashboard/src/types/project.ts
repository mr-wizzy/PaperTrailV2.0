export type ResearchPhase = "Phase I" | "Phase II" | "Phase III" | "Phase IV";
export type ProjectStatus = "Active" | "Recruiting" | "Completed" | "Suspended";

export interface ClinicalProject {
  id: string;
  title: string;
  protocolNumber: string;
  phase: ResearchPhase;
  status: ProjectStatus;
  principalInvestigator: string;
  therapeuticArea: "Oncology" | "Cardiology" | "Neurology" | "Immunology";
  enrollment: {
    current: number;
    target: number;
  };
  startDate: string;
  lastUpdated: string;
  description: string;
  primaryEndpoint: string;
}
