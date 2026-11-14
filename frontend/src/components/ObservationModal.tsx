import React, { useState } from 'react';
import { Subject, MeasurementType } from '../types';
import { Activity, X, Check, WifiOff, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  selectedSubjectId: string;
  isOffline: boolean;
  onSubmit: (data: {
    subject_id: string;
    measurement_type: string;
    value_numeric: number;
    unit: string;
    observed_at: string;
    source: string;
    is_simulated: boolean;
    note?: string;
  }) => Promise<void>;
}

export const ObservationModal: React.FC<ObservationModalProps> = ({
  isOpen,
  onClose,
  subjects,
  selectedSubjectId,
  isOffline,
  onSubmit
}) => {
  const [subjectId, setSubjectId] = useState(selectedSubjectId || 'c1-elena-rostova');
  const [metric, setMetric] = useState<MeasurementType>('heart_rate');
  const [value, setValue] = useState<string>('72');
  const [source, setSource] = useState<string>('manual_crew_entry');
  const [observedAt, setObservedAt] = useState<string>(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const metricUnits: Record<string, { unit: string; defaultVal: string; min: number; max: number }> = {
    heart_rate: { unit: 'bpm', defaultVal: '75', min: 30, max: 220 },
    spo2: { unit: '%', defaultVal: '98.5', min: 70, max: 100 },
    core_temp: { unit: '°C', defaultVal: '36.8', min: 34.0, max: 42.0 },
    respiration_rate: { unit: 'brpm', defaultVal: '14', min: 5, max: 45 },
    sleep_duration: { unit: 'hrs', defaultVal: '7.5', min: 0, max: 24 },
    cabin_radiation_flux: { unit: 'μSv/h', defaultVal: '21.5', min: 0, max: 500 },
    stress_index: { unit: 'pts', defaultVal: '30', min: 0, max: 100 },
    bone_resorption_marker: { unit: 'nmol BCE', defaultVal: '48.0', min: 10, max: 200 },
    cabin_co2_ppm: { unit: 'ppm', defaultVal: '2600', min: 400, max: 10000 },
    vestibular_score: { unit: '/100', defaultVal: '92', min: 0, max: 100 },
    immune_cytokine_index: { unit: 'pg/mL', defaultVal: '4.2', min: 0, max: 50 },
  };

  const handleMetricChange = (newMetric: MeasurementType) => {
    setMetric(newMetric);
    setValue(metricUnits[newMetric]?.defaultVal || '0');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const numVal = parseFloat(value);
    if (isNaN(numVal)) {
      setErrorMsg('Please enter a valid numeric measurement.');
      return;
    }

    const bounds = metricUnits[metric];
    if (bounds && (numVal < bounds.min || numVal > bounds.max)) {
      setErrorMsg(`Measurement value ${numVal} is outside physiologically viable range (${bounds.min} - ${bounds.max} ${bounds.unit}).`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        subject_id: subjectId,
        measurement_type: metric,
        value_numeric: numVal,
        unit: bounds.unit,
        observed_at: new Date(observedAt).toISOString(),
        source: source,
        is_simulated: true,
        note: note.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit observation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Biometric Observation</h2>
              <p className="text-xs text-slate-400">Append entry to mission telemetry record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Status Warning in Modal */}
        {isOffline && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-600/50 flex items-start gap-2.5 text-xs text-rose-200">
            <WifiOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Offline Operation Queue Engaged</strong>
              This observation will be queued locally in IndexedDB/Storage with a client-generated UUID and automatically synchronized upon reconnecting.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-600/60 text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono">
              Crew Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.display_label} ({s.role})
                </option>
              ))}
            </select>
          </div>

          {/* Measurement Type & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono">
                Measurement Type
              </label>
              <select
                value={metric}
                onChange={(e) => handleMetricChange(e.target.value as MeasurementType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="heart_rate">Heart Rate (bpm)</option>
                <option value="spo2">Oxygen SpO₂ (%)</option>
                <option value="core_temp">Core Body Temp (°C)</option>
                <option value="respiration_rate">Respiration Rate (brpm)</option>
                <option value="bone_resorption_marker">Bone Resorption NTx (OSD-919)</option>
                <option value="sleep_duration">Sleep Duration (hrs)</option>
                <option value="cabin_radiation_flux">Radiation Flux (NASA EDA)</option>
                <option value="cabin_co2_ppm">Cabin CO2 (NASA EDA)</option>
                <option value="vestibular_score">Vestibular G-Score (/100)</option>
                <option value="immune_cytokine_index">Immune Cytokines (OSD-918)</option>
                <option value="stress_index">Cognitive Stress (pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono">
                Value ({metricUnits[metric]?.unit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">
                  {metricUnits[metric]?.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Observed At (UTC) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono">
                Observed Timestamp
              </label>
              <input
                type="datetime-local"
                value={observedAt}
                onChange={(e) => setObservedAt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono">
                Data Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="manual_crew_entry">Manual Crew Entry</option>
                <option value="bio_harness_telemetry">Bio-Harness Telemetry</option>
                <option value="habitat_ambient_monitor">Habitat Ambient Monitor</option>
                <option value="eva_suit_telemetry">EVA Suit Telemetry</option>
                <option value="synthetic_demo_generator">Synthetic Demo Generator</option>
              </select>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 font-mono">
              Clinical / Operational Note (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Taken post-treadmill countermeasure session or during airlock ingress..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Provenance & Disclaimer Notice */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Tag: <strong>SIMULATED PROVENANCE</strong>
            </span>
            <span className="font-mono text-slate-500">
              Idempotency UUID Enabled
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : isOffline ? 'Queue for Offline Sync' : 'Record Observation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

