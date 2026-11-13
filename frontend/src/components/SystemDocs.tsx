import React, { useState } from 'react';
import { 
  FileText, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  CheckSquare, 
  ExternalLink,
  Code,
  AlertTriangle
} from 'lucide-react';

export const SystemDocs: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'architecture' | 'database' | 'rules' | 'offline' | 'security' | 'submission'>('architecture');

  const docsNav = [
    { id: 'architecture', label: 'Architecture & Stack', icon: Layers },
    { id: 'database', label: 'Database Schema', icon: Database },
    { id: 'rules', label: 'AI/ML & Review Rules', icon: Cpu },
    { id: 'offline', label: 'Offline Sync Flow', icon: RefreshCw },
    { id: 'security', label: 'Security & Privacy', icon: ShieldCheck },
    { id: 'submission', label: 'NASA 2026 Checklist', icon: CheckSquare },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              System Documentation & Architectural Specifications
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Direct implementation of project specification files (README, REQUIREMENTS, ARCHITECTURE, DATABASE, AI_ML_PLAN, OFFLINE_SYNC, SECURITY, SUBMISSION).
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
            Interactive Technical Specification
          </span>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex overflow-x-auto gap-2 mt-4 pt-3 border-t border-slate-800/80">
          {docsNav.map((item) => {
            const Icon = item.icon;
            const isSel = activeDoc === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveDoc(item.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all cursor-pointer ${
                  isSel
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 text-slate-300 space-y-6">
        {/* ARCHITECTURE */}
        {activeDoc === 'architecture' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Architecture Overview & Component Pipeline
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Astronaut Health Monitor is engineered as a resilient, offline-first client-server system designed for long-duration spaceflight (e.g. Martian transit, Lunar Gateway) and remote Earth research stations (Antarctic stations, deep wilderness field medicine).
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre className="text-[11px] leading-5">
{`+-------------------------------------------------------------+
|                 CLIENT: REACT + TYPESCRIPT PWA              |
|  - Real-time Vitals HUD & Telemetry Dashboard               |
|  - Service Worker: Cache versioned application shell        |
|  - IndexedDB / LocalStorage: Offline operation write queue  |
|  - Client UUID & Idempotency Key Generation                 |
+------------------------------+------------------------------+
                               |
                   HTTPS Sync / REST API
                               |
+------------------------------v------------------------------+
|                  BACKEND: PYTHON FASTAPI                    |
|  - Request Validation & Physiological Boundary Guardrails   |
|  - Role-Based Access Control (RBAC) Enforcement             |
|  - Idempotent Sync Batch Dispatcher (/api/v1/sync)          |
|  - Review-Flag Trigger Evaluator                            |
|  - Immutable Audit Event Recording                          |
+---------------+------------------------------+--------------+
                |                              |
+---------------v-------------+  +-------------v--------------+
|     POSTGRESQL / DATABASE   |  |   TRANSPARENT RULES ENGINE |
| - Users, Subjects, Vitals   |  | - Rules R-101 to R-106     |
| - Review Flags & Audit Log  |  | - Multivariate Z-Score     |
| - Unique Idempotency Keys   |  | - Explainability & Context |
+-----------------------------+  +----------------------------+`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 text-cyan-400">Core Technologies</h4>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li><strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS, Lucide Icons</li>
                  <li><strong>Backend:</strong> Python FastAPI, Pydantic v2, Uvicorn</li>
                  <li><strong>Offline Layer:</strong> Service Worker, Web Storage, Client UUIDs</li>
                  <li><strong>Data Model:</strong> Relational Schema matching DATABASE.md</li>
                </ul>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 text-cyan-400">Key Architectural Principles</h4>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li><strong>Deterministic Rules First:</strong> Explainable decision support over black boxes</li>
                  <li><strong>Append-Only Ingestion:</strong> Telemetry records remain immutable</li>
                  <li><strong>Idempotent Operations:</strong> Safe repeated submissions during flaky comms</li>
                  <li><strong>Explicit Provenance:</strong> Simulated tags enforced across all layers</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* DATABASE */}
        {activeDoc === 'database' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Relational Database Schema & Entities
            </h3>
            <p className="text-xs text-slate-300">
              The data model strictly implements the relational entity design outlined in <code>DATABASE.md</code>, ensuring rigorous tracking of units, sources, and idempotency identifiers.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-cyan-300 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Table</th>
                    <th className="p-2.5">Primary Key</th>
                    <th className="p-2.5">Key Columns</th>
                    <th className="p-2.5">Constraints & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  <tr>
                    <td className="p-2.5 font-bold text-white">subjects</td>
                    <td className="p-2.5 text-slate-400">id (UUID)</td>
                    <td className="p-2.5">display_label, role, mission_phase</td>
                    <td className="p-2.5 text-amber-300">is_simulated = TRUE (Demo crew)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">observations</td>
                    <td className="p-2.5 text-slate-400">id (UUID)</td>
                    <td className="p-2.5">subject_id, measurement_type, value_numeric, unit, observed_at, source</td>
                    <td className="p-2.5 text-emerald-400">UNIQUE(client_operation_id) for idempotent sync</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">review_flags</td>
                    <td className="p-2.5 text-slate-400">id (UUID)</td>
                    <td className="p-2.5">observation_id, subject_id, rule_code, severity, reason, acknowledged_by</td>
                    <td className="p-2.5 text-slate-400">Non-clinical review advisories</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">audit_events</td>
                    <td className="p-2.5 text-slate-400">id (UUID)</td>
                    <td className="p-2.5">actor_user_id, actor_role, event_type, resource_id, occurred_at, metadata</td>
                    <td className="p-2.5 text-slate-400">Immutable UTC audit trail</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RULES */}
        {activeDoc === 'rules' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              AI/ML Plan & Transparent Review Rules
            </h3>
            <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg text-xs text-amber-200">
              <strong className="block mb-1 flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Ethical AI & Clinical Disclaimer (AI_ML_PLAN.md):
              </strong>
              These rules are transparent decision-support tools for mission controllers and flight surgeons. They do NOT diagnose illness, prescribe medication, or replace clinical procedures. All thresholds are illustrative demo baselines.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="font-bold text-white text-cyan-300">Rule R-101: Resting Tachycardia</div>
                <p className="text-slate-400 text-[11px] font-sans mt-1">
                  Triggers if resting heart rate &gt; 105 bpm or &lt; 45 bpm, suggesting physical exertion or cardiovascular stress during orbital routines.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="font-bold text-white text-cyan-300">Rule R-102: Hypoxia Desaturation</div>
                <p className="text-slate-400 text-[11px] font-sans mt-1">
                  Flags arterial oxygen saturation falling below 94% (warning) or 90% (critical), alerting to airlock seal or cabin scrubber anomalies.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="font-bold text-white text-cyan-300">Rule R-103: Core Hyperthermia</div>
                <p className="text-slate-400 text-[11px] font-sans mt-1">
                  Detects core temperature &gt; 37.8°C or &lt; 35.8°C, monitoring thermal stress during spacesuit operations (EVA).
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="font-bold text-white text-cyan-300">Rule R-104: Acute Sleep Deficit</div>
                <p className="text-slate-400 text-[11px] font-sans mt-1">
                  Tracks total sleep &lt; 5.0 hours in a 24h cycle, flagging fatigue risks prior to critical spacecraft maneuvers.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="font-bold text-white text-cyan-300">Rule R-105: Telemetry Stale Alert</div>
                <p className="text-slate-400 text-[11px] font-sans mt-1">
                  Identifies biotelemetry streams with no updates for &gt; 6 hours, detecting sensor detachment or local radio interference.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="font-bold text-white text-cyan-300">Rule R-106: Multivariate Drift (ML)</div>
                <p className="text-slate-400 text-[11px] font-sans mt-1">
                  Computes rolling z-scores across coupled vitals (HR + respiration), highlighting multi-parameter anomalies exceeding 2.6σ.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OFFLINE */}
        {activeDoc === 'offline' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              Offline Operation & Idempotent Synchronization Flow
            </h3>
            <p className="text-xs text-slate-300">
              Per <code>OFFLINE_SYNC.md</code>, offline readiness is essential for spacecraft passing behind the Moon, entering planetary shadow, or experiencing Solar Particle Event (SPE) comms blackouts.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-cyan-300 block mb-1">1. Append-Only Local Storage</strong>
                <p className="text-slate-400 text-[11px]">
                  When offline, records are written locally with state <code>pending</code>. Never attempt in-place silent modification of historical server states.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-cyan-300 block mb-1">2. Idempotency Key Guarantee</strong>
                <p className="text-slate-400 text-[11px]">
                  Every queued write has a stable client-generated UUID (<code>client_operation_id</code>). Retrying the sync request after a network timeout safely returns <code>duplicate_ignored</code> rather than creating phantom duplicate observations.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-cyan-300 block mb-1">3. Clear Conflict & Error Surfacing</strong>
                <p className="text-slate-400 text-[11px]">
                  Failed submissions preserve their retry state and display actionable error logs to the crew and medical officer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeDoc === 'security' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Security & Privacy Blueprint
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-emerald-400 block mb-1">Role-Based Access Control (RBAC)</strong>
                <p className="text-slate-400 text-[11px]">
                  Enforces three distinct tiers: Flight Surgeon (Admin), Mission Reviewer (Auditor), and Crew Member (Contributor), with backend authorization checks.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-emerald-400 block mb-1">Privacy & Minimum Data Collection</strong>
                <p className="text-slate-400 text-[11px]">
                  Zero real astronaut PII. Synthetic profiles only. No clinical diagnoses are claimed or inferred.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBMISSION */}
        {activeDoc === 'submission' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-cyan-400" />
              NASA Space Apps Challenge 2026 Submission Readiness Checklist
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {[
                { label: 'All sample vitals explicitly tagged as SIMULATED DATA', done: true },
                { label: 'Required fields and physiological units strictly validated', done: true },
                { label: 'Charts plot trends with timestamps (UTC), units, and baseline bands', done: true },
                { label: 'Every review flag includes human-readable reason, rule code, and disclaimer', done: true },
                { label: 'Offline state clearly visible with simulated comms blackout toggle', done: true },
                { label: 'Queued records synchronize idempotently without duplicate records', done: true },
                { label: 'Role-based access control (Flight Surgeon vs Crew Member) demonstrated', done: true },
                { label: 'Complete immutable audit log recording sign-ins, writes, and flag acks', done: true },
                { label: 'Clean setup, zero secret leakage, and live local hosting verified', done: true }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="text-slate-200">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

