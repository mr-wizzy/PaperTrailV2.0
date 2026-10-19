export type ResearchPhase = "Phase I" | "Phase II" | "Phase III" | "Phase IV" | "Phase IX";
export type ProjectStatus = "Active" | "Recruiting" | "Completed" | "Suspended" | "On Hold" | "Inactive";
export type RiskLevel = "Critical" | "High" | "Medium" | "Low";
export type SiteStatus = "Ongoing" | "Planned" | "Completed" | "Pending";
export type ComplianceRating = "High" | "Medium" | "Low";
export type TherapeuticArea = "Oncology" | "Cardiology" | "Neurology" | "Immunology" | "Infectious Disease";

export type StatusFilter = "All Statuses" | ProjectStatus;
export type AreaFilter = "All Areas" | TherapeuticArea;
export type RiskFilter = "All Risks" | RiskLevel;

export interface TrialSite {
  id: string;
  name: string;
  status: SiteStatus;
  enrolled: number;
  target: number;
  dropOffRate: number; // e.g. 14 for 14%
  compliance: ComplianceRating;
  riskLevel: RiskLevel;
}

export interface KeyFinding {
  id: string;
  severity: "Critical" | "High" | "Medium";
  title: string;
  description: string;
  recommendation: string;
}

export interface MonthlyEnrollmentPoint {
  month: "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sept" | "Oct" | "Nov" | "Dec";
  actual: number;
  target: number;
}

export interface ClinicalProject {
  id: string; // Identifier & slug: "COVID-2022", "CRD-1001", etc.
  title: string;
  protocolNumber: string; // e.g. "CNT-2022-004", "PRT-90210"
  sponsor: string; // e.g. "Federal Government", "National Institute of Health"
  phase: ResearchPhase;
  status: ProjectStatus;
  riskLevel: RiskLevel;
  principalInvestigator: string;
  researchManager: string;
  therapeuticArea: TherapeuticArea;
  enrollment: {
    current: number;
    target: number;
  };
  timeline: {
    startDate: string;
    endDate: string;
    elapsedPercent: number;
    timeRemaining: string;
    daysRemaining: number;
    patientsBehindTarget?: number;
  };
  metrics: {
    sitesCount: number;
    activeSites: number;
    sitesAtRisk: number;
    sitesNeedAttention: number;
    dropRate: number;
    complianceScore: number;
    openIssuesCount: number;
  };
  monthlyTrend: MonthlyEnrollmentPoint[];
  sites: TrialSite[];
  keyFindings: KeyFinding[];
  regulatory: {
    protocolVersion: string;
    irbStatus: "Approved" | "Pending" | "Under Review";
    fdaIndNumber: string;
    reportingPeriod: string;
    reportDate: string;
    preparedBy: string;
    reportingPeriodEnd: string;
  };
  startDate: string;
  lastUpdated: string;
  description: string;
  primaryEndpoint: string;
}
