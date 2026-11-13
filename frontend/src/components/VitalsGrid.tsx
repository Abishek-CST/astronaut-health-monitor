import React from 'react';
import { Observation, Subject } from '../types';
import { 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Moon, 
  Radiation, 
  Brain, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface VitalsGridProps {
  subject: Subject;
  observations: Observation[];
  onSelectMetricForChart: (metric: string) => void;
  selectedMetric: string;
}

export const VitalsGrid: React.FC<VitalsGridProps> = ({
  subject,
  observations,
  onSelectMetricForChart,
  selectedMetric
}) => {
  // Filter observations for current subject
  const subjectObs = observations.filter(o => o.subject_id === subject.id);

  // Helper to get latest observation for a metric
  const getLatest = (metric: string) => {
    const list = subjectObs
      .filter(o => o.measurement_type === metric)
      .sort((a, b) => new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime());
    return list[0];
  };

  // Helper to get previous observation for delta
  const getPrevious = (metric: string) => {
    const list = subjectObs
      .filter(o => o.measurement_type === metric)
      .sort((a, b) => new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime());
    return list[1];
  };

  const metricsConfig = [
    {
      id: 'heart_rate',
      label: 'Heart Rate',
      icon: Heart,
      iconColor: 'text-rose-400',
      borderColor: 'hover:border-rose-500/50',
      activeBorder: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      nominalRange: '60 - 85 bpm',
      unit: 'bpm',
      checkStatus: (val: number) => {
        if (val > 105) return { status: 'ELEVATED', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        if (val < 50) return { status: 'BRADYCARDIA', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
        return { status: 'NOMINAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'spo2',
      label: 'Oxygen Saturation (SpO₂)',
      icon: Wind,
      iconColor: 'text-cyan-400',
      borderColor: 'hover:border-cyan-500/50',
      activeBorder: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      nominalRange: '95 - 100%',
      unit: '%',
      checkStatus: (val: number) => {
        if (val < 90) return { status: 'CRITICAL LOW', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
        if (val < 94) return { status: 'BORDERLINE', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'OPTIMAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'core_temp',
      label: 'Core Body Temp',
      icon: Thermometer,
      iconColor: 'text-amber-400',
      borderColor: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      nominalRange: '36.5 - 37.5 °C',
      unit: '°C',
      checkStatus: (val: number) => {
        if (val > 37.8) return { status: 'PYREXIA RISK', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        if (val < 35.8) return { status: 'LOW TEMP', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
        return { status: 'NOMINAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'respiration_rate',
      label: 'Respiration Rate',
      icon: Activity,
      iconColor: 'text-indigo-400',
      borderColor: 'hover:border-indigo-500/50',
      activeBorder: 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]',
      nominalRange: '12 - 18 brpm',
      unit: 'brpm',
      checkStatus: (val: number) => {
        if (val > 20) return { status: 'TACHYPNEA', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'NOMINAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'sleep_duration',
      label: 'Sleep Duration (Last 24h)',
      icon: Moon,
      iconColor: 'text-purple-400',
      borderColor: 'hover:border-purple-500/50',
      activeBorder: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
      nominalRange: '7.0 - 8.5 hrs',
      unit: 'hrs',
      checkStatus: (val: number) => {
        if (val < 5.0) return { status: 'ACUTE DEFICIT', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
        if (val < 6.5) return { status: 'MILD DEFICIT', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'RESTED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'radiation_dose',
      label: 'Radiation Exposure',
      icon: Radiation,
      iconColor: 'text-yellow-400',
      borderColor: 'hover:border-yellow-500/50',
      activeBorder: 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.25)]',
      nominalRange: '< 0.60 mSv/day',
      unit: 'mSv/day',
      checkStatus: (val: number) => {
        if (val > 0.8) return { status: 'ELEVATED FLUX', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
        return { status: 'NORMAL ORBIT', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'stress_index',
      label: 'Cognitive Stress Score',
      icon: Brain,
      iconColor: 'text-teal-400',
      borderColor: 'hover:border-teal-500/50',
      activeBorder: 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.25)]',
      nominalRange: '10 - 40 pts',
      unit: 'pts',
      checkStatus: (val: number) => {
        if (val > 60) return { status: 'HIGH STRESS', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'RELAXED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
            Real-Time Biometric Observations: {subject.display_label}
          </h2>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
            Click metric card to inspect historical trend
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Auto-refreshing biotelemetry
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {metricsConfig.map((item) => {
          const Icon = item.icon;
          const latest = getLatest(item.id);
          const prev = getPrevious(item.id);
          const isSelected = selectedMetric === item.id;

          // Default fallback value if not recorded yet
          let val = latest ? latest.value_numeric : (item.id === 'radiation_dose' ? 0.42 : (item.id === 'stress_index' ? 28 : 0));
          const status = item.checkStatus(val);

          // Calculate delta if previous observation exists
          let delta = null;
          if (latest && prev && prev.value_numeric !== undefined) {
            delta = Number((latest.value_numeric - prev.value_numeric).toFixed(1));
          }

          const timeAgo = latest ? new Date(latest.observed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Simulated';

          return (
            <div
              key={item.id}
              onClick={() => onSelectMetricForChart(item.id)}
              className={`p-4 rounded-xl border bg-slate-900/80 transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? `${item.activeBorder} bg-slate-850 ring-1 ring-white/10`
                  : `border-slate-800 ${item.borderColor} hover:bg-slate-850/80`
              }`}
            >
              {/* Top Row: Metric Name & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${status.color}`}>
                  {status.status}
                </span>
              </div>

              {/* Main Metric Value & Unit */}
              <div className="flex items-baseline justify-between mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                    {val}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    {item.unit}
                  </span>
                </div>

                {/* Delta Badge */}
                {delta !== null && (
                  <div className={`flex items-center gap-0.5 text-xs font-mono px-1.5 py-0.5 rounded ${
                    delta > 0 
                      ? 'text-amber-400 bg-amber-950/40' 
                      : delta < 0 
                      ? 'text-cyan-400 bg-cyan-950/40' 
                      : 'text-slate-400 bg-slate-800/40'
                  }`}>
                    {delta > 0 ? <TrendingUp className="w-3 h-3" /> : delta < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                    <span>{delta > 0 ? `+${delta}` : delta}</span>
                  </div>
                )}
              </div>

              {/* Bottom Info: Nominal Range and Timestamp */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Baseline: {item.nominalRange}</span>
                <span className="text-slate-400">{timeAgo}</span>
              </div>

              {/* Active Selection Glow Dot */}
              {isSelected && (
                <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
