import React, { useState } from 'react';
import { QueuedOperation } from '../types';
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Send, 
  PlusCircle, 
  Trash2,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface OfflineSyncManagerProps {
  queue: QueuedOperation[];
  isOffline: boolean;
  onToggleOffline: () => void;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  onInjectTestRecord: () => void;
  onClearQueue: () => void;
}

export const OfflineSyncManager: React.FC<OfflineSyncManagerProps> = ({
  queue,
  isOffline,
  onToggleOffline,
  onSync,
  isSyncing,
  onInjectTestRecord,
  onClearQueue
}) => {
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncWithFeedback = async () => {
    try {
      setSyncFeedback(null);
      await onSync();
      setSyncFeedback('Synchronization complete: all pending operations accepted with verified idempotency.');
    } catch (err: any) {
      setSyncFeedback(`Sync error: ${err.message || 'Network error'}`);
    }
  };

  const pendingCount = queue.filter(op => op.status === 'pending' || op.status === 'failed').length;
  const syncedCount = queue.filter(op => op.status === 'synced').length;

  return (
    <div className="space-y-4">
      {/* Overview & Architecture Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Offline-First Operation Queue & Synchronization Engine
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                OFFLINE_SYNC.md SPEC
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Guarantees zero-data-loss biometric telemetry during Deep Space Network (DSN) blackout or Earth remote field station network drops.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={onToggleOffline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isOffline
                  ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                  : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span>{isOffline ? 'Offline (LOS Active)' : 'Comms Link Online'}</span>
            </button>

            <button
              onClick={handleSyncWithFeedback}
              disabled={isSyncing || isOffline || pendingCount === 0}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                pendingCount > 0 && !isOffline
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400/50 shadow-md shadow-cyan-600/30 cursor-pointer'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : `Synchronize Queue (${pendingCount})`}</span>
            </button>

            <button
              onClick={onInjectTestRecord}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
              title="Add a synthetic measurement to local queue to test offline functionality"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Inject Test Offline Record</span>
            </button>

            {queue.length > 0 && (
              <button
                onClick={onClearQueue}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear local sync queue history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sync Feedback Message */}
        {syncFeedback && (
          <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-cyan-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Offline Architecture Flow Diagram */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">1</span>
              Client UUID Generation
            </div>
            <p className="text-slate-400 text-[11px] mt-1 font-sans">
              Stable client operation ID created upfront on device before network transmission.
            </p>
          </div>

          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">2</span>
              IndexedDB Local Queue
            </div>
            <p className="text-slate-400 text-[11px] mt-1 font-sans">
              Operations persist safely across tab closures, battery exhaustion, or browser restarts.
            </p>
          </div>

          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">3</span>
              Idempotent Batch POST
            </div>
            <p className="text-slate-400 text-[11px] mt-1 font-sans">
              Reconnecting sends batch to <code>/api/v1/sync</code> with duplicate rejection protection.
            </p>
          </div>

          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">4</span>
              Server Acknowledgment
            </div>
            <p className="text-slate-400 text-[11px] mt-1 font-sans">
              Records marked synchronized; audit event recorded in mission database.
            </p>
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Client Storage Operation Queue ({queue.length} Total)
          </h3>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-amber-400">Pending: {pendingCount}</span>
            <span className="text-emerald-400">Synchronized: {syncedCount}</span>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No queued operations. All observations are synchronized with the central telemetry database.
            <div className="mt-2">
              <button
                onClick={onInjectTestRecord}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Inject a sample observation into offline queue to test
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Operation ID (UUID)</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Metric / Value</th>
                  <th className="p-3">Subject ID</th>
                  <th className="p-3">Queued At</th>
                  <th className="p-3">Retries</th>
                  <th className="p-3">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queue.map((op) => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400">
                      {op.status}
                    </span>
                  );
                  if (op.status === 'pending') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Pending Sync
                      </span>
                    );
                  } else if (op.status === 'syncing') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                        Syncing...
                      </span>
                    );
                  } else if (op.status === 'synced') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ✓ Synchronized
                      </span>
                    );
                  } else if (op.status === 'failed') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40" title={op.error}>
                        Failed (Will Retry)
                      </span>
                    );
                  }

                  return (
                    <tr key={op.operation_id} className="hover:bg-slate-850/50">
                      <td className="p-3 text-cyan-300 max-w-[160px] truncate" title={op.operation_id}>
                        {op.operation_id}
                      </td>
                      <td className="p-3 text-slate-300">{op.operation_type}</td>
                      <td className="p-3 text-white font-bold">
                        {op.payload.measurement_type}: {op.payload.value_numeric} {op.payload.unit}
                      </td>
                      <td className="p-3 text-slate-400">{op.payload.subject_id}</td>
                      <td className="p-3 text-slate-400">
                        {new Date(op.created_at).toLocaleTimeString()}
                      </td>
                      <td className="p-3 text-slate-400">{op.client_attempt_count}</td>
                      <td className="p-3">{statusBadge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

