import { useState, type FC, type FormEvent, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import type {
  ClinicalProject,
  ResearchPhase,
  ProjectStatus,
  RiskLevel,
  TherapeuticArea,
} from '../../types/project';

export interface NewStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudy: (project: ClinicalProject) => void;
}

const PHASES: ResearchPhase[] = ['Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Phase IX'];
const STATUSES: ProjectStatus[] = ['Active', 'Recruiting', 'Suspended', 'On Hold'];
const RISKS: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];
const AREAS: TherapeuticArea[] = [
  'Infectious Disease',
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
];

export const NewStudyModal: FC<NewStudyModalProps> = ({
  isOpen,
  onClose,
  onAddStudy,
}) => {
  const [protocolNumber, setProtocolNumber] = useState('');
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState<ResearchPhase>('Phase III');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Low');
  const [therapeuticArea, setTherapeuticArea] = useState<TherapeuticArea>('Infectious Disease');
  const [sponsor, setSponsor] = useState('Federal Health Institute');
  const [pi, setPi] = useState('');
  const [rm] = useState('DR CHINONSO EGEMMA');
  const [targetEnrollment, setTargetEnrollment] = useState<number>(500);
  const [currentEnrollment, setCurrentEnrollment] = useState<number>(0);
  const [primaryEndpoint, setPrimaryEndpoint] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!protocolNumber.trim()) errs.protocolNumber = 'Protocol Number is required.';
    if (!title.trim()) errs.title = 'Study Title is required.';
    if (!pi.trim()) errs.pi = 'Principal Investigator is required.';
    if (targetEnrollment <= 0) errs.targetEnrollment = 'Target enrollment must be greater than 0.';
    if (currentEnrollment < 0) errs.currentEnrollment = 'Current enrollment cannot be negative.';
    if (currentEnrollment > targetEnrollment) {
      errs.currentEnrollment = 'Current enrollment cannot exceed target enrollment.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const studyId = protocolNumber.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '-');
    const patientsBehind = Math.max(0, Math.round(targetEnrollment * 0.4 - currentEnrollment));

    // Auto-generate 4 standard initial trial sites
    const defaultSites = [
      {
        id: `${studyId}-site-1`,
        name: 'CENTRAL UNIVERSITY TEACHING HOSPITAL',
        status: 'Ongoing' as const,
        enrolled: Math.round(currentEnrollment * 0.4),
        target: Math.round(targetEnrollment * 0.4),
        dropOffRate: 8,
        compliance: 'High' as const,
        riskLevel: 'Low' as const,
      },
      {
        id: `${studyId}-site-2`,
        name: 'REGIONAL CLINICAL RESEARCH CENTER',
        status: 'Ongoing' as const,
        enrolled: Math.round(currentEnrollment * 0.35),
        target: Math.round(targetEnrollment * 0.35),
        dropOffRate: 15,
        compliance: 'Medium' as const,
        riskLevel: 'Medium' as const,
      },
      {
        id: `${studyId}-site-3`,
        name: 'COMMUNITY HEALTH COOPERATIVE',
        status: 'Planned' as const,
        enrolled: Math.round(currentEnrollment * 0.25),
        target: Math.round(targetEnrollment * 0.25),
        dropOffRate: 4,
        compliance: 'High' as const,
        riskLevel: 'Low' as const,
      },
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] as const;
    const defaultMonthlyTrend = months.map((m, idx) => ({
      month: m,
      target: Math.round((targetEnrollment / 12) * (idx + 1)),
      actual: idx <= 3 ? Math.round((currentEnrollment / 4) * (idx + 1)) : 0,
    }));

    const newProject: ClinicalProject = {
      id: studyId,
      title: title.trim(),
      protocolNumber: protocolNumber.trim().toUpperCase(),
      sponsor: sponsor.trim() || 'Federal Health Institute',
      phase,
      status,
      riskLevel,
      principalInvestigator: pi.trim(),
      researchManager: rm.trim() || 'DR CHINONSO EGEMMA',
      therapeuticArea,
      enrollment: {
        current: currentEnrollment,
        target: targetEnrollment,
      },
      timeline: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        elapsedPercent: 10,
        timeRemaining: '11 months remaining',
        daysRemaining: 335,
        patientsBehindTarget: patientsBehind,
      },
      metrics: {
        sitesCount: defaultSites.length,
        activeSites: 2,
        sitesAtRisk: riskLevel === 'Critical' ? 2 : riskLevel === 'High' ? 1 : 0,
        sitesNeedAttention: 1,
        dropRate: 9,
        complianceScore: 4,
        openIssuesCount: 1,
      },
      monthlyTrend: defaultMonthlyTrend,
      sites: defaultSites,
      keyFindings: [
        {
          id: `${studyId}-KF-01`,
          severity: riskLevel === 'Critical' ? 'Critical' : 'Medium',
          title: 'Initial Protocol Activation & Site Initiation',
          description: `Trial setup finalized with protocol version 1.0. Primary investigator ${pi} onboarded with ${defaultSites.length} verified trial sites.`,
          recommendation: 'Maintain monthly audit checkpoints and track patient consent compliance across all active clinical sites.',
        },
      ],
      regulatory: {
        protocolVersion: 'v1.0',
        irbStatus: 'Approved',
        fdaIndNumber: `IND-${Math.floor(100000 + Math.random() * 900000)}`,
        reportingPeriod: 'Initiation Period 2026',
        reportDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        preparedBy: rm.trim(),
        reportingPeriodEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      startDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      description: `${title}. Protocol ${protocolNumber} under ${sponsor}. Target enrollment ${targetEnrollment} patients.`,
      primaryEndpoint: primaryEndpoint.trim() || 'Primary therapeutic efficacy and safety endpoints as specified in master protocol.',
    };

    onAddStudy(newProject);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-gray-900">
                Register New Clinical Study
              </h2>
              <p className="text-xs text-gray-500">
                Add a new protocol to PaperTrail for active monitoring & compliance tracking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* Protocol & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label htmlFor="protocolNumber" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Protocol # <span className="text-red-500">*</span>
              </label>
              <input
                id="protocolNumber"
                type="text"
                placeholder="e.g. ONCO-2026-008"
                value={protocolNumber}
                onChange={(e) => setProtocolNumber(e.target.value)}
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-gray-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white font-mono uppercase ${
                  errors.protocolNumber
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.protocolNumber && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.protocolNumber}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="studyTitle" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Study Title <span className="text-red-500">*</span>
              </label>
              <input
                id="studyTitle"
                type="text"
                placeholder="e.g. Immunotherapy Combination in Advanced Melanoma"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-gray-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white ${
                  errors.title
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Phase, Status, Risk, Area */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="phaseSelect" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phase
              </label>
              <select
                id="phaseSelect"
                value={phase}
                onChange={(e) => setPhase(e.target.value as ResearchPhase)}
                className="w-full min-h-[42px] px-3 py-2 text-sm bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
              >
                {PHASES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="statusSelect" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                id="statusSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full min-h-[42px] px-3 py-2 text-sm bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="riskSelect" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Risk Level
              </label>
              <select
                id="riskSelect"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                className="w-full min-h-[42px] px-3 py-2 text-sm bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
              >
                {RISKS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="areaSelect" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Therapeutic Area
              </label>
              <select
                id="areaSelect"
                value={therapeuticArea}
                onChange={(e) => setTherapeuticArea(e.target.value as TherapeuticArea)}
                className="w-full min-h-[42px] px-3 py-2 text-sm bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sponsor & Principal Investigator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sponsorInput" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Sponsor Organization
              </label>
              <input
                id="sponsorInput"
                type="text"
                placeholder="e.g. National Institute of Allergy"
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="piInput" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Principal Investigator (PI) <span className="text-red-500">*</span>
              </label>
              <input
                id="piInput"
                type="text"
                placeholder="e.g. Dr. Jennifer Vance"
                value={pi}
                onChange={(e) => setPi(e.target.value)}
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-gray-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white ${
                  errors.pi
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.pi && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.pi}</p>
              )}
            </div>
          </div>

          {/* Enrollment Targets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetEnrollment" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Target Enrollment <span className="text-red-500">*</span>
              </label>
              <input
                id="targetEnrollment"
                type="number"
                min="1"
                value={targetEnrollment}
                onChange={(e) => setTargetEnrollment(parseInt(e.target.value) || 0)}
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-gray-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white ${
                  errors.targetEnrollment
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.targetEnrollment && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.targetEnrollment}</p>
              )}
            </div>

            <div>
              <label htmlFor="currentEnrollment" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Initial Enrolled Patients
              </label>
              <input
                id="currentEnrollment"
                type="number"
                min="0"
                value={currentEnrollment}
                onChange={(e) => setCurrentEnrollment(parseInt(e.target.value) || 0)}
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-gray-50/70 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white ${
                  errors.currentEnrollment
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.currentEnrollment && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.currentEnrollment}</p>
              )}
            </div>
          </div>

          {/* Primary Endpoint */}
          <div>
            <label htmlFor="primaryEndpoint" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Primary Endpoint
            </label>
            <textarea
              id="primaryEndpoint"
              rows={2}
              placeholder="e.g. Progression-Free Survival (PFS) at 12 months verified by blinded central review."
              value={primaryEndpoint}
              onChange={(e) => setPrimaryEndpoint(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register Study</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
