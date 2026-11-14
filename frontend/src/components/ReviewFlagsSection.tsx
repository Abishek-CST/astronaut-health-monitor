import React, { useState } from 'react';
import { ReviewFlag, Subject, UserRole, RuleDefinition } from '../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Info, 
  User, 
  Check, 
  Filter,
  HelpCircle,
  Activity,
  FileSearch,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

interface ReviewFlagsSectionProps {
  flags: ReviewFlag[];
  subjects: Subject[];
  currentRole: UserRole;
  rules: RuleDefinition[];
  onAcknowledgeFlag: (flagId: string, notes?: string) => Promise<void>;
}

export const ReviewFlagsSection: React.FC<ReviewFlagsSectionProps> = ({
  flags,
  subjects,
  currentRole,
  rules,
  onAcknowledgeFlag
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('all');
  const [acknowledgingFlagId, setAcknowledgingFlagId] = useState<string | null>(null);
  const [ackNote, setAckNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedRuleInfo, setSelectedRuleInfo] = useState<RuleDefinition | null>(null);

  const getSubjectName = (id: string) => {
    const sub = subjects.find(s => s.id === id);
    return sub ? sub.display_label : id;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'MEDIUM':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  const filteredFlags = flags.filter(f => {
    if (selectedSubjectFilter !== 'all' && f.subject_id !== selectedSubjectFilter) return false;
    if (selectedSeverityFilter !== 'all' && f.severity !== selectedSeverityFilter) return false;
    return true;
  });

  const handleOpenAckModal = (flagId: string) => {
    setAcknowledgingFlagId(flagId);
    setAckNote('');
  };

  const handleConfirmAck = async () => {
    if (!acknowledgingFlagId) return;
    try {
      setIsSubmitting(true);
      await onAcknowledgeFlag(acknowledgingFlagId, ackNote.trim() || undefined);
      setAcknowledgingFlagId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInspectRule = (ruleCode: string) => {
    const found = rules.find(r => r.code === ruleCode);
    if (found) {
      setSelectedRuleInfo(found);
    }
  };

  const canAcknowledge = currentRole === 'flight_surgeon' || currentRole === 'reviewer';

  return (
    <div className="space-y-4">
      {/* Top Banner & Filters */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Explainable Review Flags & Decision Support Engine
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300">
              NOT A MEDICAL DIAGNOSIS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic rules + personal trends. Every flag transparently details what changed, baseline reference, time period, rationale, and review recommendations.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Crew Members</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.display_label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Severities</option>
              <option value="CRITICAL" className="bg-slate-900 text-slate-200">Critical</option>
              <option value="HIGH" className="bg-slate-900 text-slate-200">High</option>
              <option value="MEDIUM" className="bg-slate-900 text-slate-200">Medium</option>
              <option value="LOW" className="bg-slate-900 text-slate-200">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* RBAC Notice if Crew Member is selected */}
      {!canAcknowledge && (
        <div className="p-3 bg-blue-950/40 border border-blue-600/40 rounded-xl text-xs text-blue-200 flex items-center justify-between">
          <span>
            Current role is <strong>Crew Member</strong> (read-only flags view). Switch to <strong>Flight Surgeon (Admin)</strong> in the top header to acknowledge flags.
          </span>
          <span className="font-mono text-[11px] text-blue-300">
            RBAC Enforced
          </span>
        </div>
      )}

      {/* Flags List */}
      <div className="space-y-4">
        {filteredFlags.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">No Review Flags Matching Criteria</h3>
            <p className="text-xs text-slate-400 mt-1">All monitored biometrics are within configured baselines.</p>
          </div>
        ) : (
          filteredFlags.map((flag) => {
            const isAcked = !!flag.acknowledged_at;
            const subjectName = getSubjectName(flag.subject_id);

            return (
              <div
                key={flag.id}
                className={`p-4 rounded-xl border transition-all ${
                  isAcked
                    ? 'bg-slate-950/60 border-slate-800 opacity-80'
                    : 'bg-slate-900/90 border-slate-700/80 shadow-md'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(flag.severity)}`}>
                        {flag.severity} PRIORITY
                      </span>
                      <button
                        onClick={() => handleInspectRule(flag.rule_code)}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Click to view rule parameters"
                      >
                        <Info className="w-3.5 h-3.5" />
                        Rule {flag.rule_code}
                      </button>
                      <span className="text-xs font-semibold text-slate-300">
                        • {subjectName}
                      </span>
                    </div>

                    {/* Summary headline */}
                    <p className="text-sm text-slate-100 font-bold">
                      {flag.reason}
                    </p>

                    {/* 5-Point Explainability Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                      {/* 1. What changed */}
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-bold block mb-0.5">
                          1. What Changed
                        </span>
                        <span className="text-slate-300">
                          {flag.what_changed || flag.reason}
                        </span>
                      </div>

                      {/* 2. Baseline / Reference */}
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold block mb-0.5">
                          2. Baseline / Reference Used
                        </span>
                        <span className="text-slate-300">
                          {flag.baseline_reference || "Personal 30-day rolling baseline"}
                        </span>
                      </div>

                      {/* 3. Period Considered */}
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block mb-0.5">
                          3. Period Considered
                        </span>
                        <span className="text-slate-300">
                          {flag.period_considered || "Rolling telemetry window"}
                        </span>
                      </div>

                      {/* 4. Why Flagged */}
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-bold block mb-0.5">
                          4. Why Flagged
                        </span>
                        <span className="text-slate-300">
                          {flag.flag_reason || "Deterministic threshold crossed"}
                        </span>
                      </div>
                    </div>

                    {/* 5. What User Should Review */}
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        5. Recommended Review Action
                      </span>
                      <span className="text-emerald-200">
                        {flag.action_to_review || "Flight Surgeon evaluation suggested. Check sensor contact and mission activity context."}
                      </span>
                    </div>

                    {/* Timestamp & Disclaimer */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Triggered: {new Date(flag.created_at).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span className="text-amber-400/80">
                        Decision Support Only — Does Not Diagnose Disease
                      </span>
                    </div>
                  </div>

                  {/* Right Action / Acknowledged Status */}
                  <div className="flex items-center gap-2 self-start">
                    {isAcked ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Acknowledged
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">
                          By: {flag.acknowledged_by || 'Flight Surgeon'}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenAckModal(flag.id)}
                        disabled={!canAcknowledge}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          canAcknowledge
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 cursor-pointer shadow-md shadow-amber-500/10'
                            : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                        title={canAcknowledge ? "Acknowledge this review flag" : "Requires Flight Surgeon role"}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Acknowledged Notes if available */}
                {flag.notes && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs bg-slate-950/70 p-2.5 rounded-lg font-mono text-slate-300">
                    <strong className="text-cyan-400">Flight Surgeon Notes:</strong> {flag.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Acknowledge Modal */}
      {acknowledgingFlagId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Acknowledge Review Flag
              </h3>
              <button
                onClick={() => setAcknowledgingFlagId(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Confirming this flag logs your flight surgeon role credentials and records an immutable entry into the audit trail.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 font-mono">
                Clinical / Mission Follow-up Note (Optional)
              </label>
              <textarea
                rows={3}
                value={ackNote}
                onChange={(e) => setAckNote(e.target.value)}
                placeholder="e.g. Consulted with commander; sensor recalibrated; subsequent observation nominal."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setAcknowledgingFlagId(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAck}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : 'Confirm Acknowledgment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rule Details Modal */}
      {selectedRuleInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Rule Specification: {selectedRuleInfo.code}
              </h3>
              <button
                onClick={() => setSelectedRuleInfo(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-cyan-300 font-bold">{selectedRuleInfo.name}</div>
              <p className="text-slate-300 font-sans">{selectedRuleInfo.description}</p>
              
              <div className="bg-slate-950 p-2.5 rounded-lg space-y-1 text-slate-400">
                <div>Metric Monitored: <strong className="text-white">{selectedRuleInfo.metric}</strong></div>
                {selectedRuleInfo.threshold_high && (
                  <div>High Threshold: <strong className="text-amber-400">&gt; {selectedRuleInfo.threshold_high} {selectedRuleInfo.unit}</strong></div>
                )}
                {selectedRuleInfo.threshold_low && (
                  <div>Low Threshold: <strong className="text-blue-400">&lt; {selectedRuleInfo.threshold_low} {selectedRuleInfo.unit}</strong></div>
                )}
                <div>Assigned Severity: <strong className="text-white">{selectedRuleInfo.severity}</strong></div>
                {selectedRuleInfo.nasa_context && (
                  <div className="pt-1 text-cyan-300 text-[11px]">
                    NASA Context: {selectedRuleInfo.nasa_context}
                  </div>
                )}
              </div>

              <div className="text-amber-400/90 text-[11px] font-sans italic">
                Rule logic is fully deterministic, transparent, and non-diagnostic per NASA Space Apps requirements.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRuleInfo(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
