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
  Sparkles,
  Globe,
  AlertTriangle,
  Info
} from 'lucide-react';

export const SystemDocs: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'nasa_resources' | 'si_disclosure' | 'architecture' | 'database' | 'rules' | 'offline' | 'submission'>('nasa_resources');

  const docsNav = [
    { id: 'nasa_resources', label: 'NASA Resources & Provenance', icon: Globe },
    { id: 'si_disclosure', label: 'SI (AI) Usage Disclosure', icon: Sparkles },
    { id: 'architecture', label: 'Architecture & Stack', icon: Layers },
    { id: 'database', label: 'Database & Provenance', icon: Database },
    { id: 'rules', label: 'AI/ML 3-Stage Plan', icon: Cpu },
    { id: 'offline', label: 'Offline Sync Flow', icon: RefreshCw },
    { id: 'submission', label: 'Submission Checklist', icon: CheckSquare },
  ];

  const nasaResources = [
    {
      name: "NASA Open Science Data Repository (OSDR)",
      url: "https://osdr.nasa.gov/bio/repo/",
      datasetId: "OSDR-Core",
      description: "OSDR provides space-life-science datasets and research resources used to ground the project's monitoring domains and scientific context.",
      usage: "Identifies relevant monitoring domains, baseline physiological boundaries, and data models for deep-space transit."
    },
    {
      name: "NASA OSDR Visualization Portal",
      url: "https://visualization.osdr.nasa.gov/",
      datasetId: "OSDR-Viz",
      description: "Provides analytical tools and portals for exploring space-life-science data and related mission applications.",
      usage: "Guides multi-domain time-series visualization, statistical distributions, and normal range band overlays."
    },
    {
      name: "NASA Environmental Data App (EDA)",
      url: "https://visualization.osdr.nasa.gov/eda/",
      datasetId: "EDA-ISS",
      description: "Provides ISS cabin and hardware environmental telemetry and radiation information, including temperature, carbon dioxide, relative humidity, and radiation-dose flux.",
      usage: "Direct scientific grounding for the Environmental Conditions and Radiation Exposure monitoring domains."
    },
    {
      name: "NASA OSDR OSD-919",
      url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-919",
      datasetId: "OSD-919",
      description: "Spaceflight-related bone deconditioning and remodeling research in microgravity.",
      usage: "Grounds the Bone and Physical Health domain, providing baseline parameters for collagen degradation (NTx biomarker)."
    },
    {
      name: "NASA OSDR OSD-918",
      url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-918",
      datasetId: "OSD-918",
      description: "Spaceflight-related blood and immune response data during long-duration flight.",
      usage: "Grounds the Immune and Physiological Indicator domain, tracking systemic inflammatory status under mission stress."
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Astronaut Health Guardian — Mission Documentation
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              NASA Space Apps Challenge 2026 • AI-Assisted, Offline-First Health Monitoring for Long-Duration Exploration
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
            Interactive Documentation Suite
          </span>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex overflow-x-auto gap-2 mt-4 pt-3 border-t border-slate-800/80 no-scrollbar">
          {docsNav.map((item) => {
            const Icon = item.icon;
            const isSel = activeDoc === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveDoc(item.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all cursor-pointer whitespace-nowrap ${
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
        
        {/* NASA RESOURCES & PROVENANCE */}
        {activeDoc === 'nasa_resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                NASA Data & Scientific Resources Integration
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                Direct Citations & URLs
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Astronaut Health Guardian grounds its health monitoring domains, environmental parameters, and clinical decision-support logic in official NASA Open Science Data Repository (OSDR) studies and NASA Environmental Data App telemetry references.
            </p>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              <strong className="block font-semibold mb-1 flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Important Limitation & Data Provenance Notice:
              </strong>
              Dashboard measurements in this prototype are synthetic/demo data unless an authorized NASA sensor stream is directly linked. Every measurement is visibly labeled <code>Simulated/Demo Data</code>. The prototype is not a medical device and does not claim to diagnose disease.
            </div>

            {/* Official NASA Resources Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 text-cyan-300 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Resource Name</th>
                    <th className="p-3">Dataset ID</th>
                    <th className="p-3">Scientific Description</th>
                    <th className="p-3">Application Usage</th>
                    <th className="p-3">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {nasaResources.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-white whitespace-nowrap">
                        {res.name}
                      </td>
                      <td className="p-3 text-cyan-400 font-semibold">
                        {res.datasetId}
                      </td>
                      <td className="p-3 text-slate-300 font-sans text-xs">
                        {res.description}
                      </td>
                      <td className="p-3 text-slate-400 font-sans text-xs">
                        {res.usage}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-sans"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Data Distinction Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-cyan-400 font-bold block mb-1">1. NASA-Derived Data</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  Sourced from OSDR/EDA studies to establish physiological reference limits and atmospheric standards.
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-amber-400 font-bold block mb-1">2. Simulated Demo Data</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  Artificially generated biotelemetry streams explicitly tagged with <code>is_simulated: true</code>.
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">3. Calculated Data</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  Derived moving averages, rolling baselines, and HRV-derived stress indices computed on device.
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-purple-400 font-bold block mb-1">4. ML Experimental Output</span>
                <p className="text-[11px] text-slate-400 font-sans">
                  Statistical anomaly scores (Stage 3 z-score drift) presented strictly as human review advisories.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUPER INTELLIGENCE (SI) USAGE DISCLOSURE */}
        {activeDoc === 'si_disclosure' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Super Intelligence (SI) & AI Usage Disclosure
            </h3>

            <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-xl text-xs space-y-3">
              <div className="text-purple-200 font-semibold text-sm">
                Disclosure Statement per NASA Space Apps Challenge Rules
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Large language models and AI-assisted tooling (ChatGPT / Claude / Gemini) were utilized during project development for:
              </p>
              <ul className="list-disc list-inside text-slate-300 font-sans space-y-1">
                <li>Project ideation and requirement refinement based on NASA challenge statements</li>
                <li>Documentation and architectural structuring (Markdown blueprints)</li>
                <li>FastAPI backend scaffold and PWA synchronization queue mechanics</li>
                <li>Deterministic rule definitions and synthetic telemetry test case generation</li>
              </ul>
              <p className="text-slate-300 leading-relaxed font-sans">
                The human developer reviewed, verified, adapted, integrated, tested, and demonstrated the resulting codebase and application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-cyan-400 font-mono">Branding & Logo Compliance</h4>
                <p className="text-slate-400 font-sans leading-relaxed">
                  <strong>Strict Compliance:</strong> No AI-generated content contains, modifies, or imitates official NASA logos, the NASA meatball or worm insignia, national flags, mission patches, or federal identifiers. All icons are generic open-source Lucide UI elements.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-cyan-400 font-mono">Explainability & Human In The Loop</h4>
                <p className="text-slate-400 font-sans leading-relaxed">
                  All review flags generated by the system are explainable (stating what changed, baseline reference, time period, and review guidance). AI outputs are never trusted blindly and require Flight Surgeon acknowledgment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ARCHITECTURE */}
        {activeDoc === 'architecture' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Architecture Overview & Flow
            </h3>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre className="text-[11px] leading-5">
{`NASA OSDR / NASA Resources (OSD-919, OSD-918, EDA)
          |
          v
NASA Data / Reference Layer
          |
     +----+----+
     |         |
     v         v
NASA-derived  Synthetic demo
/context data data
     |         |
     +----+----+
          |
          v
   React 19 + Vite Frontend PWA
          |
   Astronaut Health Guardian Dashboard
          |
 +--------+--------+
 |        |        |
 v        v        v
Personal  Trend    Explainable
Baseline  Analysis Review Flags
          |
    Offline Storage (IndexedDB / Service Worker)
          |
      Sync Queue (Idempotency UUIDs)
          |
       FastAPI Backend
          |
     PostgreSQL / DataStore`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <strong className="text-cyan-400 block mb-1">1. Visible Provenance</strong>
                <p className="text-slate-400 text-[11px]">Every record explicitly tags its origin (NASA, Synthetic, Calculated).</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <strong className="text-cyan-400 block mb-1">2. Offline-First PWA</strong>
                <p className="text-slate-400 text-[11px]">Full local HUD, offline write queue, and automatic reconnection synchronization.</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <strong className="text-cyan-400 block mb-1">3. Non-Diagnostic Decision Support</strong>
                <p className="text-slate-400 text-[11px]">Strictly advises review; never issues clinical medical diagnoses.</p>
              </div>
            </div>
          </div>
        )}

        {/* DATABASE */}
        {activeDoc === 'database' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Core Tables & Data Provenance Model
            </h3>
            <p className="text-xs text-slate-300">
              The database structure implements the 8 core tables specified in <code>DATABASE.md</code>:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {['users', 'subjects', 'observations', 'baselines', 'review_flags', 'nasa_resources', 'sync_operations', 'audit_events'].map((t, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 font-bold text-center">
                  {t}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-white font-bold">Observation Record Schema:</div>
              <pre className="text-slate-400 text-[11px]">
{`{
  "id": "obs-hr-c3-marcus-vance-2",
  "subject_id": "c3-marcus-vance",
  "measurement_type": "heart_rate",
  "domain": "cardiovascular",
  "value_numeric": 112.5,
  "unit": "bpm",
  "observed_at": "2026-11-13T21:00:00Z",
  "source_type": "synthetic_demo",
  "source_name": "Bio-Harness Telemetry Simulator",
  "dataset_id": null,
  "is_simulated": true,
  "created_at": "2026-11-13T21:00:00Z"
}`}
              </pre>
            </div>
          </div>
        )}

        {/* 3-STAGE AI/ML PLAN */}
        {activeDoc === 'rules' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              AI / ML 3-Stage Progressive Architecture
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-2">
                <span className="text-cyan-400 font-bold block text-sm">Stage 1: Deterministic Rules</span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Transparent rules (R-101 to R-106) evaluating physiological ceilings, desaturation drops, cabin CO2, and thermal dysregulation.
                </p>
                <div className="text-[10px] text-cyan-300 bg-cyan-950/60 p-2 rounded">
                  Fully explainable; audited logic; immediate trigger.
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-blue-500/30 rounded-xl space-y-2">
                <span className="text-blue-400 font-bold block text-sm">Stage 2: Personal Trends</span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Calculates individualized 30-day baseline deviations, rolling moving averages, rates of change, and diurnal circadian patterns.
                </p>
                <div className="text-[10px] text-blue-300 bg-blue-950/60 p-2 rounded">
                  Adapts to the astronaut's unique microgravity baseline.
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-purple-500/30 rounded-xl space-y-2">
                <span className="text-purple-400 font-bold block text-sm">Stage 3: Anomaly Detection</span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Multivariate statistical z-score drift and optional Isolation Forest scoring across coupled biometric vectors.
                </p>
                <div className="text-[10px] text-purple-300 bg-purple-950/60 p-2 rounded">
                  Flagged as experimental review advisory.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OFFLINE */}
        {activeDoc === 'offline' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              Offline PWA Operation & Idempotent Synchronization
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-cyan-300 block mb-1">1. Loss-of-Signal (LOS) Resilience</strong>
                <p className="text-slate-400 text-[11px]">
                  During orbital blackout or comms disruption, full biometric HUD and logging remain operational via Service Worker caching and local storage queue.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-cyan-300 block mb-1">2. Idempotency Guarantees</strong>
                <p className="text-slate-400 text-[11px]">
                  Client generates stable UUIDs for each queued operation. Re-attempted sync requests never cause phantom duplicates on the mission server.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBMISSION */}
        {activeDoc === 'submission' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              NASA Space Apps Challenge 2026 Submission Checklist
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {[
                { label: 'NASA resources entered in the submission form (OSDR, EDA, OSD-919, OSD-918)', done: true },
                { label: 'NASA sources cited with live working URLs in project documentation and UI', done: true },
                { label: 'NASA-derived vs simulated data clearly distinguished across dashboard', done: true },
                { label: 'Super Intelligence (SI) usage disclosed in docs and header modal', done: true },
                { label: 'Required SI indicators added to generated media and code documentation', done: true },
                { label: 'No NASA branding, logos, or flags generated or modified by SI tools', done: true },
                { label: 'All 8 health domains represented with baseline bands and trend charts', done: true },
                { label: 'Explainable review flags with all 5 required dimensions rendered', done: true },
                { label: 'Offline operation and idempotent synchronization verified', done: true },
                { label: 'Live cloud production deployment working on Vercel', done: true }
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
