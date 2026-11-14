import React, { useState } from 'react';
import { Observation, Subject, HealthDomain } from '../types';
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
  Layers,
  Database,
  Compass,
  ShieldCheck,
  Flame,
  Globe2
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
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const subjectObs = observations.filter(o => o.subject_id === subject.id);

  const getLatest = (metric: string) => {
    const list = subjectObs
      .filter(o => o.measurement_type === metric)
      .sort((a, b) => new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime());
    return list[0];
  };

  const getPrevious = (metric: string) => {
    const list = subjectObs
      .filter(o => o.measurement_type === metric)
      .sort((a, b) => new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime());
    return list[1];
  };

  const metricsConfig = [
    // 1. Cardiovascular Health
    {
      id: 'heart_rate',
      label: 'Heart Rate',
      domain: 'cardiovascular' as HealthDomain,
      domainLabel: 'Cardiovascular',
      icon: Heart,
      iconColor: 'text-rose-400',
      borderColor: 'hover:border-rose-500/50',
      activeBorder: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      nominalRange: '60 - 85 bpm',
      unit: 'bpm',
      provenance: 'Synthetic Demo Generator',
      datasetId: null,
      isNasaReference: false,
      checkStatus: (val: number) => {
        if (val > 105) return { status: 'ELEVATED', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        if (val < 50) return { status: 'BRADYCARDIA', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
        return { status: 'NOMINAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'spo2',
      label: 'Oxygen Saturation (SpO₂)',
      domain: 'cardiovascular' as HealthDomain,
      domainLabel: 'Cardiovascular',
      icon: Wind,
      iconColor: 'text-cyan-400',
      borderColor: 'hover:border-cyan-500/50',
      activeBorder: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      nominalRange: '95 - 100%',
      unit: '%',
      provenance: 'Pulse Oximeter Telemetry',
      datasetId: null,
      isNasaReference: false,
      checkStatus: (val: number) => {
        if (val < 90) return { status: 'CRITICAL LOW', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
        if (val < 94) return { status: 'BORDERLINE', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'OPTIMAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'blood_pressure_sys',
      label: 'Systolic Blood Pressure',
      domain: 'cardiovascular' as HealthDomain,
      domainLabel: 'Cardiovascular',
      icon: Activity,
      iconColor: 'text-pink-400',
      borderColor: 'hover:border-pink-500/50',
      activeBorder: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.25)]',
      nominalRange: '110 - 130 mmHg',
      unit: 'mmHg',
      provenance: 'Arterial Pressure Sensor',
      datasetId: null,
      isNasaReference: false,
      checkStatus: (val: number) => {
        if (val > 140) return { status: 'HYPERTENSIVE', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'NOMINAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },

    // 2. Bone and Physical Health (NASA OSDR OSD-919 Grounded)
    {
      id: 'bone_resorption_marker',
      label: 'Bone Resorption (NTx Marker)',
      domain: 'bone_physical' as HealthDomain,
      domainLabel: 'Bone & Physical',
      icon: Flame,
      iconColor: 'text-orange-400',
      borderColor: 'hover:border-orange-500/50',
      activeBorder: 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)]',
      nominalRange: '35 - 65 nmol BCE',
      unit: 'nmol BCE',
      provenance: 'NASA OSDR OSD-919 Research Model',
      datasetId: 'OSD-919',
      isNasaReference: true,
      checkStatus: (val: number) => {
        if (val > 68) return { status: 'ELEVATED TURNOVER', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
        return { status: 'CONTROLLED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },

    // 3. Behavioral Health and Wellbeing
    {
      id: 'sleep_duration',
      label: 'Sleep Duration (Last 24h)',
      domain: 'behavioral' as HealthDomain,
      domainLabel: 'Behavioral Health',
      icon: Moon,
      iconColor: 'text-purple-400',
      borderColor: 'hover:border-purple-500/50',
      activeBorder: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
      nominalRange: '7.0 - 8.5 hrs',
      unit: 'hrs',
      provenance: 'Sleep Quarters Actigraph',
      datasetId: null,
      isNasaReference: false,
      checkStatus: (val: number) => {
        if (val < 5.0) return { status: 'ACUTE DEFICIT', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
        if (val < 6.5) return { status: 'MILD DEFICIT', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'RESTED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },
    {
      id: 'stress_index',
      label: 'Autonomic Stress Index',
      domain: 'behavioral' as HealthDomain,
      domainLabel: 'Behavioral Health',
      icon: Brain,
      iconColor: 'text-teal-400',
      borderColor: 'hover:border-teal-500/50',
      activeBorder: 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.25)]',
      nominalRange: '10 - 45 pts',
      unit: '/100',
      provenance: 'Calculated (HRV Frequency Shift)',
      datasetId: null,
      isNasaReference: false,
      checkStatus: (val: number) => {
        if (val > 60) return { status: 'ELEVATED STRESS', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'BALANCED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },

    // 4. Radiation Exposure / Context (NASA EDA Grounded)
    {
      id: 'cabin_radiation_flux',
      label: 'Active Radiation Flux',
      domain: 'radiation' as HealthDomain,
      domainLabel: 'Radiation Exposure',
      icon: Radiation,
      iconColor: 'text-yellow-400',
      borderColor: 'hover:border-yellow-500/50',
      activeBorder: 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.25)]',
      nominalRange: '< 25.0 μSv/h',
      unit: 'μSv/h',
      provenance: 'NASA Environmental Data App (EDA)',
      datasetId: 'EDA-ISS',
      isNasaReference: true,
      checkStatus: (val: number) => {
        if (val > 24) return { status: 'ELEVATED GCR', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'NOMINAL FLUX', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },

    // 5. Environmental Conditions (NASA EDA Grounded)
    {
      id: 'cabin_co2_ppm',
      label: 'Cabin CO₂ Partial Pressure',
      domain: 'environmental' as HealthDomain,
      domainLabel: 'Environmental',
      icon: Globe2,
      iconColor: 'text-sky-400',
      borderColor: 'hover:border-sky-500/50',
      activeBorder: 'border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.25)]',
      nominalRange: '1800 - 3000 ppm',
      unit: 'ppm',
      provenance: 'NASA Environmental Data App (EDA)',
      datasetId: 'EDA-ISS',
      isNasaReference: true,
      checkStatus: (val: number) => {
        if (val > 3500) return { status: 'SCRUBBER ADVISORY', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
        if (val > 3000) return { status: 'ELEVATED CO2', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'NOMINAL CABIN', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },

    // 6. Altered Gravity / Microgravity
    {
      id: 'vestibular_score',
      label: 'Neuro-Vestibular G-Index',
      domain: 'altered_gravity' as HealthDomain,
      domainLabel: 'Altered Gravity',
      icon: Compass,
      iconColor: 'text-indigo-400',
      borderColor: 'hover:border-indigo-500/50',
      activeBorder: 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]',
      nominalRange: '80 - 100 pts',
      unit: '/100',
      provenance: 'Neuro-Vestibular Task Assessment',
      datasetId: null,
      isNasaReference: false,
      checkStatus: (val: number) => {
        if (val < 75) return { status: 'SPACE SICKNESS RISK', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'ADAPTED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    },

    // 7. Immune and Blood Indicators (NASA OSDR OSD-918 Grounded)
    {
      id: 'immune_cytokine_index',
      label: 'Immune Cytokine Profile (TNF-α)',
      domain: 'immune' as HealthDomain,
      domainLabel: 'Immune Indicators',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      borderColor: 'hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      nominalRange: '2.0 - 5.5 pg/mL',
      unit: 'pg/mL',
      provenance: 'NASA OSDR OSD-918 Research Reference',
      datasetId: 'OSD-918',
      isNasaReference: true,
      checkStatus: (val: number) => {
        if (val > 5.5) return { status: 'INFLAMMATION SHIFT', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
        return { status: 'HOMEOSTASIS', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      }
    }
  ];

  const domains = [
    { id: 'all', label: 'All 8 Health Domains' },
    { id: 'cardiovascular', label: 'Cardiovascular' },
    { id: 'bone_physical', label: 'Bone & Physical' },
    { id: 'behavioral', label: 'Behavioral & Sleep' },
    { id: 'radiation', label: 'Radiation' },
    { id: 'environmental', label: 'Environmental' },
    { id: 'altered_gravity', label: 'Altered Gravity' },
    { id: 'immune', label: 'Immune & Blood' },
  ];

  const filteredMetrics = selectedDomain === 'all'
    ? metricsConfig
    : metricsConfig.filter(m => m.domain === selectedDomain);

  return (
    <div className="space-y-4">
      {/* Domain Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Layers className="w-4 h-4 text-cyan-400 ml-1 mr-1" />
          {domains.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${selectedDomain === d.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono hidden md:flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Subject: <strong className="text-slate-200">{subject.display_label}</strong>
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredMetrics.map((item) => {
          const Icon = item.icon;
          const latest = getLatest(item.id);
          const prev = getPrevious(item.id);
          const isSelected = selectedMetric === item.id;

          let val = latest ? latest.value_numeric : 0;
          const status = item.checkStatus(val);

          let delta = null;
          if (latest && prev && prev.value_numeric !== undefined) {
            delta = Number((latest.value_numeric - prev.value_numeric).toFixed(1));
          }

          const timeAgo = latest ? new Date(latest.observed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Simulated';

          return (
            <div
              key={item.id}
              onClick={() => onSelectMetricForChart(item.id)}
              className={`p-4 rounded-xl border bg-slate-900/80 transition-all cursor-pointer relative overflow-hidden group ${isSelected
                  ? `${item.activeBorder} bg-slate-850 ring-1 ring-white/10`
                  : `border-slate-800 ${item.borderColor} hover:bg-slate-850/80`
                }`}
            >
              {/* Header: Domain Tag & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors block">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.domainLabel}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${status.color}`}>
                  {status.status}
                </span>
              </div>

              {/* Main Metric Value & Unit */}
              <div className="flex items-baseline justify-between mt-2.5">
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
                  <div className={`flex items-center gap-0.5 text-xs font-mono px-1.5 py-0.5 rounded ${delta > 0
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

              {/* Data Provenance & NASA Context Label */}
              <div className="mt-2.5 px-2 py-1 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1 text-slate-400 truncate">
                  <Database className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{item.provenance}</span>
                </span>
                {item.datasetId && (
                  <span className="text-cyan-300 font-bold ml-1 bg-cyan-950 px-1 rounded border border-cyan-800/50">
                    {item.datasetId}
                  </span>
                )}
              </div>

              {/* Bottom Info: Nominal Range and Timestamp */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Ref: {item.nominalRange}</span>
                <span className="text-slate-400">{timeAgo}</span>
              </div>

              {/* Simulated Tag Watermark */}
              <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-amber-500/80">
                <span>• SIMULATED / DEMO DATA</span>
                <span>NOT A MEDICAL DIAGNOSIS</span>
              </div>

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
