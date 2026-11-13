import React, { useState } from 'react';
import { Observation, Subject } from '../types';
import { Activity, Calendar, ShieldAlert, Info, TrendingUp } from 'lucide-react';

interface TrendChartProps {
  subject: Subject;
  observations: Observation[];
  selectedMetric: string;
  onSelectMetric: (metric: string) => void;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  subject,
  observations,
  selectedMetric,
  onSelectMetric
}) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<Observation | null>(null);

  // Metric definitions & thresholds
  const metricMeta: Record<string, { label: string; unit: string; min: number; max: number; safeMin: number; safeMax: number; color: string }> = {
    heart_rate: { label: 'Heart Rate', unit: 'bpm', min: 40, max: 130, safeMin: 60, safeMax: 85, color: '#f43f5e' },
    spo2: { label: 'Oxygen Saturation (SpO₂)', unit: '%', min: 88, max: 100, safeMin: 95, safeMax: 100, color: '#06b6d4' },
    core_temp: { label: 'Core Body Temperature', unit: '°C', min: 35.0, max: 39.0, safeMin: 36.5, safeMax: 37.5, color: '#f59e0b' },
    respiration_rate: { label: 'Respiration Rate', unit: 'brpm', min: 8, max: 26, safeMin: 12, safeMax: 18, color: '#6366f1' },
    sleep_duration: { label: 'Sleep Duration', unit: 'hrs', min: 3, max: 10, safeMin: 7, safeMax: 9, color: '#a855f7' },
    radiation_dose: { label: 'Radiation Exposure', unit: 'mSv/day', min: 0.1, max: 1.0, safeMin: 0.2, safeMax: 0.6, color: '#eab308' },
    stress_index: { label: 'Cognitive Stress Score', unit: 'pts', min: 0, max: 100, safeMin: 10, safeMax: 40, color: '#14b8a6' },
  };

  const meta = metricMeta[selectedMetric] || metricMeta.heart_rate;

  // Filter observations for current subject and metric
  const filtered = observations
    .filter(o => o.subject_id === subject.id && o.measurement_type === selectedMetric)
    .sort((a, b) => new Date(a.observed_at).getTime() - new Date(b.observed_at).getTime());

  // Filter by timeframe
  const now = new Date().getTime();
  const timeframeHours = timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 720;
  const cutoff = now - timeframeHours * 3600 * 1000;
  const chartData = filtered.filter(o => new Date(o.observed_at).getTime() >= cutoff);

  // Fallback if data is sparse: use all available data
  const points = chartData.length > 0 ? chartData : filtered;

  // Calculate summary stats
  const values = points.map(p => p.value_numeric);
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 0;
  const avgVal = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0';
  
  // Calculate standard deviation
  let stdDev = '0.0';
  if (values.length > 1) {
    const mean = Number(avgVal);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    stdDev = Math.sqrt(variance).toFixed(1);
  }

  // SVG Chart Dimensions
  const svgWidth = 850;
  const svgHeight = 280;
  const padding = { top: 25, right: 35, bottom: 40, left: 60 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Value scale
  const yMin = meta.min;
  const yMax = meta.max;
  const getY = (val: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    return padding.top + graphHeight - ((clamped - yMin) / (yMax - yMin)) * graphHeight;
  };

  // Safe reference band
  const safeTop = getY(meta.safeMax);
  const safeBottom = getY(meta.safeMin);
  const safeBandHeight = Math.max(2, safeBottom - safeTop);

  // Time scale
  const getX = (index: number, total: number) => {
    if (total <= 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (total - 1)) * graphWidth;
  };

  // Build SVG path
  let pathD = '';
  let areaD = '';
  if (points.length > 0) {
    points.forEach((p, idx) => {
      const x = getX(idx, points.length);
      const y = getY(p.value_numeric);
      if (idx === 0) {
        pathD += `M ${x} ${y}`;
        areaD += `M ${x} ${padding.top + graphHeight} L ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
        areaD += ` L ${x} ${y}`;
      }
    });
    const lastX = getX(points.length - 1, points.length);
    areaD += ` L ${lastX} ${padding.top + graphHeight} Z`;
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {meta.label} Trend Analysis: {subject.display_label}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              SIMULATED DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Nominal reference baseline: {meta.safeMin} – {meta.safeMax} {meta.unit} • Timezone: UTC
          </p>
        </div>

        {/* Metric Selector Dropdown & Timeframe Tabs */}
        <div className="flex items-center flex-wrap gap-2.5">
          <select
            value={selectedMetric}
            onChange={(e) => onSelectMetric(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {Object.entries(metricMeta).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label} ({v.unit})
              </option>
            ))}
          </select>

          {/* Timeframe Buttons */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {(['24h', '7d', '30d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistical Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
        <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-lg">
          <span className="text-slate-400 block text-[10px]">CURRENT VALUE</span>
          <strong className="text-white text-sm">
            {points.length > 0 ? points[points.length - 1].value_numeric : '--'} {meta.unit}
          </strong>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-lg">
          <span className="text-slate-400 block text-[10px]">MEAN (AVERAGE)</span>
          <strong className="text-cyan-300 text-sm">{avgVal} {meta.unit}</strong>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-lg">
          <span className="text-slate-400 block text-[10px]">MIN RECORDED</span>
          <strong className="text-emerald-400 text-sm">{minVal} {meta.unit}</strong>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-lg">
          <span className="text-slate-400 block text-[10px]">MAX RECORDED</span>
          <strong className="text-amber-400 text-sm">{maxVal} {meta.unit}</strong>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-lg">
          <span className="text-slate-400 block text-[10px]">VARIABILITY (σ)</span>
          <strong className="text-purple-300 text-sm">±{stdDev} {meta.unit}</strong>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative border border-slate-800/90 rounded-xl bg-slate-950/90 p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[650px] overflow-visible"
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id={`grad-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={meta.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((step, i) => {
            const val = Math.round(yMin + step * (yMax - yMin));
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Nominal Safety Reference Band */}
          <rect
            x={padding.left}
            y={safeTop}
            width={graphWidth}
            height={safeBandHeight}
            fill="#10b981"
            fillOpacity="0.08"
            stroke="#10b981"
            strokeOpacity="0.25"
            strokeDasharray="2 2"
          />
          <text
            x={padding.left + 8}
            y={safeTop + 12}
            fill="#10b981"
            fontSize="9"
            fontFamily="monospace"
            fillOpacity="0.7"
          >
            Nominal Range ({meta.safeMin} - {meta.safeMax} {meta.unit})
          </text>

          {/* Area fill */}
          {areaD && <path d={areaD} fill={`url(#grad-${selectedMetric})`} />}

          {/* Main trend line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={meta.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => {
            const x = getX(idx, points.length);
            const y = getY(p.value_numeric);
            const isAnomaly = p.value_numeric > meta.safeMax || p.value_numeric < meta.safeMin;

            return (
              <g key={p.id || idx}>
                <circle
                  cx={x}
                  cy={y}
                  r={isAnomaly ? 4.5 : 3}
                  fill={isAnomaly ? '#f59e0b' : meta.color}
                  stroke="#090d16"
                  strokeWidth="2"
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* X-axis labels (Sample Timestamps) */}
          {points.length > 0 && [0, Math.floor(points.length / 2), points.length - 1].map((idx) => {
            if (!points[idx]) return null;
            const x = getX(idx, points.length);
            const dateStr = new Date(points[idx].observed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <text
                key={idx}
                x={x}
                y={svgHeight - 12}
                fill="#64748b"
                fontSize="10"
                textAnchor={idx === 0 ? 'start' : idx === points.length - 1 ? 'end' : 'middle'}
                fontFamily="monospace"
              >
                {dateStr}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono z-20 pointer-events-none">
            <div className="text-cyan-300 font-bold">
              {hoveredPoint.value_numeric} {hoveredPoint.unit}
            </div>
            <div className="text-slate-400 text-[10px]">
              Observed: {new Date(hoveredPoint.observed_at).toLocaleString()}
            </div>
            <div className="text-slate-400 text-[10px]">
              Source: {hoveredPoint.source}
            </div>
            {hoveredPoint.note && (
              <div className="text-amber-300/80 text-[10px] italic mt-1">
                Note: {hoveredPoint.note}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

