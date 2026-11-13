import React, { useState, useEffect, useCallback } from 'react';
import { Subject, Observation, ReviewFlag, QueuedOperation, AuditEvent, UserRole, RuleDefinition } from './types';
import { ApiService } from './services/api';
import { Header } from './components/Header';
import { CrewSelector } from './components/CrewSelector';
import { VitalsGrid } from './components/VitalsGrid';
import { TrendChart } from './components/TrendChart';
import { ReviewFlagsSection } from './components/ReviewFlagsSection';
import { OfflineSyncManager } from './components/OfflineSyncManager';
import { AuditTrail } from './components/AuditTrail';
import { SystemDocs } from './components/SystemDocs';
import { ObservationModal } from './components/ObservationModal';
import { ExportModal } from './components/ExportModal';
import { 
  Activity, 
  WifiOff, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('flight_surgeon');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('c1-elena-rostova');
  const [selectedMetric, setSelectedMetric] = useState<string>('heart_rate');
  
  // Data State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [reviewFlags, setReviewFlags] = useState<ReviewFlag[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [rules, setRules] = useState<RuleDefinition[]>([]);
  
  // Offline & Sync State
  const [isOffline, setIsOffline] = useState<boolean>(ApiService.isOffline());
  const [queue, setQueue] = useState<QueuedOperation[]>(ApiService.getQueuedOperations());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals & Notifications
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [subs, obs, flags, audits, rulesManifest] = await Promise.all([
        ApiService.getSubjects(),
        ApiService.getObservations(),
        ApiService.getReviewFlags(),
        ApiService.getAuditEvents(),
        ApiService.getRules()
      ]);

      setSubjects(subs);
      setObservations(obs);
      setReviewFlags(flags);
      setAuditEvents(audits);
      setRules(rulesManifest.rules);
      setQueue(ApiService.getQueuedOperations());
    } catch (err) {
      console.warn('Network fetch error; using offline caches or fallbacks', err);
      setQueue(ApiService.getQueuedOperations());
    }
  }, []);

  useEffect(() => {
    loadData();
    // Listen to real window online/offline events
    const handleOnline = () => {
      if (localStorage.getItem('astronaut_simulated_offline') !== 'true') {
        setIsOffline(false);
      }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadData]);

  // Periodic biotelemetry simulation: add subtle realistic micro-fluctuations to live feed
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOffline && subjects.length > 0) {
        setObservations(prev => {
          if (prev.length === 0) return prev;
          // Randomly fluctuate latest heart rate by ±1 bpm to show live sensor feed
          return prev.map(o => {
            if (o.measurement_type === 'heart_rate' && (new Date().getTime() - new Date(o.observed_at).getTime()) < 3600000) {
              const delta = (Math.random() - 0.5) * 1.5;
              return { ...o, value_numeric: Math.round((o.value_numeric + delta) * 10) / 10 };
            }
            return o;
          });
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isOffline, subjects]);

  // Toggle simulated offline mode
  const handleToggleOffline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    ApiService.setSimulatedOffline(nextState);
    showToast(nextState ? 'Loss-of-Signal (LOS) simulated. App is now in OFFLINE mode.' : 'Comms link re-established. Online mode restored.');
  };

  // Submit new observation
  const handleRecordObservation = async (data: any) => {
    const res = await ApiService.createObservation(data);
    if (res.queued) {
      setQueue(ApiService.getQueuedOperations());
      showToast(`Biometric observation queued locally (${res.queued.operation_id.slice(0, 10)}...). Will sync on reconnect.`);
    } else if (res.observation) {
      setObservations(prev => [res.observation!, ...prev]);
      // Refresh flags and audits
      const [flags, audits] = await Promise.all([
        ApiService.getReviewFlags(),
        ApiService.getAuditEvents()
      ]);
      setReviewFlags(flags);
      setAuditEvents(audits);
      showToast('Observation recorded and analyzed against review rules.');
    }
  };

  // Trigger batch sync
  const handleTriggerSync = async () => {
    if (isOffline) {
      showToast('Cannot sync while comms link is offline.');
      return;
    }
    try {
      setIsSyncing(true);
      const res = await ApiService.syncQueue();
      setQueue(ApiService.getQueuedOperations());
      await loadData();
      showToast(`Sync finished: ${res.synced} synced, ${res.duplicates} duplicates safely ignored.`);
    } catch (err: any) {
      showToast(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Acknowledge review flag
  const handleAcknowledgeFlag = async (flagId: string, notes?: string) => {
    const roleLabel = currentRole === 'flight_surgeon' ? 'Dr. Alex Chen (Flight Surgeon)' : 'Mission Reviewer';
    await ApiService.acknowledgeFlag(flagId, roleLabel, notes);
    const [updatedFlags, updatedAudits] = await Promise.all([
      ApiService.getReviewFlags(),
      ApiService.getAuditEvents()
    ]);
    setReviewFlags(updatedFlags);
    setAuditEvents(updatedAudits);
    showToast('Review flag successfully acknowledged and logged to audit trail.');
  };

  // Inject test offline observation
  const handleInjectTestRecord = () => {
    const testOp = ApiService.queueOperation({
      subject_id: selectedSubjectId,
      measurement_type: 'heart_rate',
      value_numeric: 84.0,
      unit: 'bpm',
      observed_at: new Date().toISOString(),
      source: 'offline_field_injection',
      is_simulated: true,
      note: 'Offline injection test during simulated DSN blackout'
    });
    setQueue(ApiService.getQueuedOperations());
    showToast(`Injected test record into local queue (${testOp.operation_id.slice(0, 8)}).`);
  };

  // Clear queue
  const handleClearQueue = () => {
    ApiService.saveQueuedOperations([]);
    setQueue([]);
    showToast('Local offline queue cleared.');
  };

  // Quick scenario triggers
  const triggerScenario = (scenarioName: string) => {
    if (scenarioName === 'eva_spike') {
      setSelectedSubjectId('c3-marcus-vance');
      setSelectedMetric('heart_rate');
      setActiveTab('dashboard');
      showToast('Triggered Scenario: Spacewalk EVA Exertion — Marcus Vance elevated HR (114 bpm).');
    } else if (scenarioName === 'hypoxia') {
      setSelectedSubjectId('c4-sarah-jenkins');
      setSelectedMetric('spo2');
      setActiveTab('dashboard');
      showToast('Triggered Scenario: Airlock Hypoxia Drill — Sarah Jenkins SpO2 drop (93.4%).');
    } else if (scenarioName === 'sleep_deficit') {
      setSelectedSubjectId('c1-elena-rostova');
      setSelectedMetric('sleep_duration');
      setActiveTab('dashboard');
      showToast('Triggered Scenario: Orbital Burn Prep — Commander Elena Rostova acute sleep deficit (4.6h).');
    } else if (scenarioName === 'offline_drill') {
      handleToggleOffline();
      setActiveTab('sync');
      showToast('Triggered Scenario: Deep Space Loss-of-Signal Blackout drill.');
    }
  };

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0] || {
    id: 'c1-elena-rostova',
    display_label: 'Commander Elena Rostova',
    role: 'Mission Commander',
    mission_phase: 'Ares-IV Transit (Sol 142)',
    avatar_initials: 'ER',
    is_simulated: true,
    created_at: new Date().toISOString()
  };

  const pendingSyncCount = queue.filter(op => op.status === 'pending' || op.status === 'failed').length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/80 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        pendingSyncCount={pendingSyncCount}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenRecordModal={() => setIsRecordModalOpen(true)}
      />

      {/* Quick Scenario Preset Launcher Bar */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 lg:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold uppercase text-slate-300">Demo Mission Scenarios:</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => triggerScenario('eva_spike')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-300 text-[11px] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-3 h-3 text-amber-400" />
            <span>EVA Spacewalk Exertion (HR 114 bpm)</span>
          </button>

          <button
            onClick={() => triggerScenario('hypoxia')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-rose-500/40 text-rose-300 text-[11px] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-3 h-3 text-rose-400" />
            <span>Airlock Hypoxia Drop (SpO₂ 93.4%)</span>
          </button>

          <button
            onClick={() => triggerScenario('sleep_deficit')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-blue-500/40 text-blue-300 text-[11px] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-3 h-3 text-blue-400" />
            <span>Burn Prep Sleep Debt (4.6h)</span>
          </button>

          <button
            onClick={() => triggerScenario('offline_drill')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white text-[11px] transition-all flex items-center gap-1 cursor-pointer"
          >
            <WifiOff className="w-3 h-3 text-cyan-400" />
            <span>Simulate DSN Comms Loss</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Offline Banner when offline */}
        {isOffline && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/70 border border-rose-600/70 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <WifiOff className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  DEEP SPACE NETWORK COMM LOSS • LOCAL OFFLINE MODE ACTIVE
                </h3>
                <p className="text-xs text-rose-200 mt-0.5">
                  All new observations will be stored locally in IndexedDB with cryptographic client UUIDs. Zero telemetry data loss.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-amber-300 bg-amber-950/60 border border-amber-600/50 px-2.5 py-1 rounded-lg">
                {pendingSyncCount} operations queued
              </span>
              <button
                onClick={handleToggleOffline}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all cursor-pointer"
              >
                Reconnect Link
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Mission Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Crew Selector */}
            <CrewSelector
              subjects={subjects}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
              observations={observations}
            />

            {/* Vitals Grid */}
            <VitalsGrid
              subject={currentSubject}
              observations={observations}
              onSelectMetricForChart={(m) => {
                setSelectedMetric(m);
                setActiveTab('trends');
              }}
              selectedMetric={selectedMetric}
            />

            {/* Quick Trend Preview for currently selected metric */}
            <TrendChart
              subject={currentSubject}
              observations={observations}
              selectedMetric={selectedMetric}
              onSelectMetric={setSelectedMetric}
            />
          </div>
        )}

        {/* Tab 2: Biometric Trends */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <CrewSelector
              subjects={subjects}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
              observations={observations}
            />

            <TrendChart
              subject={currentSubject}
              observations={observations}
              selectedMetric={selectedMetric}
              onSelectMetric={setSelectedMetric}
            />
          </div>
        )}

        {/* Tab 3: Review Flags */}
        {activeTab === 'flags' && (
          <ReviewFlagsSection
            flags={reviewFlags}
            subjects={subjects}
            currentRole={currentRole}
            rules={rules}
            onAcknowledgeFlag={handleAcknowledgeFlag}
          />
        )}

        {/* Tab 4: Offline Sync Queue */}
        {activeTab === 'sync' && (
          <OfflineSyncManager
            queue={queue}
            isOffline={isOffline}
            onToggleOffline={handleToggleOffline}
            onSync={handleTriggerSync}
            isSyncing={isSyncing}
            onInjectTestRecord={handleInjectTestRecord}
            onClearQueue={handleClearQueue}
          />
        )}

        {/* Tab 5: Security & Audit */}
        {activeTab === 'audit' && (
          <AuditTrail
            events={auditEvents}
            currentRole={currentRole}
          />
        )}

        {/* Tab 6: Architecture & Specs */}
        {activeTab === 'docs' && (
          <SystemDocs />
        )}
      </main>

      {/* Record Observation Modal */}
      <ObservationModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        isOffline={isOffline}
        onSubmit={handleRecordObservation}
      />

      {/* Export Dataset Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        observations={observations}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-4 lg:px-8 py-4 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-slate-400">Astronaut Health Monitor</span> • NASA Space Apps Challenge 2026 Prototype
        </div>
        <div className="text-amber-400/80 text-[11px]">
          SIMULATED DATA DEMONSTRATION • NOT A CLINICAL MEDICAL DEVICE • NO REAL HEALTH RECORDS
        </div>
        <div className="text-slate-400">
          Offline PWA & FastAPI Telemetry Engine
        </div>
      </footer>
    </div>
  );
};

export default App;
