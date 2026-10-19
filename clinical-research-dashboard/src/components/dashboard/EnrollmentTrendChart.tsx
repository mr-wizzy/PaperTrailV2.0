import { useState, type FC } from 'react';

export interface MonthlyTrendData {
  month: string;
  actual: number;
  target: number;
}

const DEFAULT_MONTHLY_TREND: MonthlyTrendData[] = [
  { month: 'JAN', actual: 80, target: 70 },
  { month: 'FEB', actual: 110, target: 95 },
  { month: 'MAR', actual: 155, target: 120 },
  { month: 'APR', actual: 175, target: 145 },
  { month: 'MAY', actual: 160, target: 160 },
  { month: 'JUN', actual: 175, target: 170 },
  { month: 'JUL', actual: 170, target: 180 },
  { month: 'AUG', actual: 165, target: 190 },
  { month: 'SEPT', actual: 185, target: 200 },
  { month: 'OCT', actual: 215, target: 215 },
  { month: 'NOV', actual: 230, target: 230 },
  { month: 'DEC', actual: 250, target: 245 },
];

export interface EnrollmentTrendChartProps {
  data?: MonthlyTrendData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const EnrollmentTrendChart: FC<EnrollmentTrendChartProps> = ({
  data = DEFAULT_MONTHLY_TREND,
  title = 'Monthly Enrollment Trend',
  subtitle = 'Actual vs target across all studies',
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 640;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 250;
  const yTicks = [0, 50, 100, 150, 200, 250];

  // Helper to map (index, value) to SVG coordinates
  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxY) * chartHeight;

  // Generate SVG path command with smooth Catmull-Rom or Bezier curve
  const generateSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX1 = current.x + (next.x - current.x) * 0.45;
      const controlY1 = current.y;
      const controlX2 = current.x + (next.x - current.x) * 0.55;
      const controlY2 = next.y;
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const actualPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.actual) }));
  const targetPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.target) }));

  const actualPath = generateSmoothPath(actualPoints);
  const targetPath = generateSmoothPath(targetPoints);

  return (
    <div className={`card-panel bg-white p-5 sm:p-6 border border-gray-200/80 rounded-xl shadow-xs ${className}`}>
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-5 h-1 bg-blue-600 rounded-full inline-block" />
            <span>Enrolled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-1 bg-blue-200 rounded-full inline-block" />
            <span>Target</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full aspect-[16/7] min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          aria-label="Monthly enrollment trend line graph"
        >
          {/* Subtle horizontal grid lines & Y labels */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={tick === 0 ? undefined : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-gray-400 font-sans"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Target Reference Line (Light Blue) */}
          <path
            d={targetPath}
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Actual Enrolled Line (Vibrant Blue) */}
          <path
            d={actualPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive Data Nodes & Tooltip */}
          {data.map((point, index) => {
            const x = getX(index);
            const actualY = getY(point.actual);
            const isHovered = hoveredIndex === index;

            return (
              <g key={point.month}>
                {/* Invisible hover capture column */}
                <rect
                  x={x - 18}
                  y={paddingTop}
                  width="36"
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X-Axis Month Labels */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered ? 'fill-blue-600 font-bold' : 'fill-gray-500'
                  }`}
                >
                  {point.month}
                </text>

                {/* Highlight dot when hovered */}
                {isHovered && (
                  <circle
                    cx={x}
                    cy={actualY}
                    r="5"
                    className="fill-blue-600 stroke-white stroke-2 shadow-sm"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute -top-2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 pointer-events-none shadow-lg z-10 whitespace-nowrap"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
            }}
          >
            <div className="font-semibold text-gray-200 mb-0.5">{data[hoveredIndex].month}</div>
            <div className="text-blue-300">Enrolled: {data[hoveredIndex].actual}</div>
            <div className="text-gray-400">Target: {data[hoveredIndex].target}</div>
          </div>
        )}
      </div>
    </div>
  );
};
