import React from 'react';
import { Subject, Observation } from '../types';
import { User, AlertCircle, CheckCircle, Heart, Wind } from 'lucide-react';

interface CrewSelectorProps {
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (id: string) => void;
  observations: Observation[];
}

export const CrewSelector: React.FC<CrewSelectorProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  observations
}) => {
  // Helper to get latest vital for a subject
  const getLatestVital = (subjectId: string, metric: string) => {
    const matching = observations
      .filter(o => o.subject_id === subjectId && o.measurement_type === metric)
      .sort((a, b) => new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime());
    return matching[0];
  };

  const getStatusBadge = (subjectId: string) => {
    if (subjectId === 'c3-marcus-vance') {
      return { text: 'Elevated HR', color: 'bg-amber-500/15 border-amber-500/40 text-amber-300' };
    }
    if (subjectId === 'c4-sarah-jenkins') {
      return { text: 'SpO2 Review', color: 'bg-rose-500/15 border-rose-500/40 text-rose-300' };
    }
    if (subjectId === 'c1-elena-rostova') {
      return { text: 'Sleep Deficit', color: 'bg-blue-500/15 border-blue-500/40 text-blue-300' };
    }
    if (subjectId === 'c2-alex-chen') {
      return { text: 'Core Temp Spike', color: 'bg-amber-500/15 border-amber-500/40 text-amber-300' };
    }
    return { text: 'Nominal', color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' };
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300 flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          Ares-IV Expedition Crew Profiles (Simulated)
        </h2>
        <span className="text-xs text-slate-500 font-mono">
          4 Active Subjects Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          const status = getStatusBadge(sub.id);
          const latestHr = getLatestVital(sub.id, 'heart_rate');
          const latestSpo2 = getLatestVital(sub.id, 'spo2');

          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* Active selection accent line */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow-inner border ${
                    isSelected 
                      ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {sub.avatar_initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sub.display_label}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {sub.role}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap ${status.color}`}>
                  {status.text}
                </span>
              </div>

              {/* Vitals summary preview */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-300" title="Latest Heart Rate">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{latestHr ? `${latestHr.value_numeric} bpm` : '--'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300" title="Latest SpO2">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{latestSpo2 ? `${latestSpo2.value_numeric}%` : '--'}</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  Sol 142
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

