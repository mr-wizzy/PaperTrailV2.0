import type { FC } from 'react';
import { AlertCircle } from 'lucide-react';
import type { KeyFinding } from '../../types/project';

export interface KeyFindingCardProps {
  finding: KeyFinding;
}

const SEVERITY_CLASSES: Record<string, { pill: string; border: string }> = {
  Critical: {
    pill: 'bg-rose-100 text-rose-700 border-rose-300 font-bold',
    border: 'border-rose-100 hover:border-rose-200',
  },
  High: {
    pill: 'bg-amber-100 text-amber-700 border-amber-300 font-bold',
    border: 'border-amber-100 hover:border-amber-200',
  },
  Medium: {
    pill: 'bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold',
    border: 'border-gray-200 hover:border-gray-300',
  },
};

export const KeyFindingCard: FC<KeyFindingCardProps> = ({ finding }) => {
  const styles = SEVERITY_CLASSES[finding.severity] || SEVERITY_CLASSES.Medium;

  return (
    <div className={`card-panel bg-white p-5 border rounded-xl shadow-xs transition-colors ${styles.border}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-rose-500 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>

        <div className="space-y-2 flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-2xs uppercase tracking-wider border ${styles.pill}`}
            >
              {finding.severity}
            </span>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              {finding.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 leading-relaxed">
            {finding.description}
          </p>

          {/* Recommendation */}
          <div className="pt-2 text-xs">
            <span className="font-bold text-gray-900 uppercase tracking-wide mr-1.5">
              RECOMMENDATION:
            </span>
            <span className="text-gray-700 leading-relaxed font-medium">
              {finding.recommendation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
