import React from 'react';
import { AuditEvent, UserRole } from '../types';
import { Shield, Clock, Key, FileCheck, CheckCircle2, User, Database } from 'lucide-react';

interface AuditTrailProps {
  events: AuditEvent[];
  currentRole: UserRole;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ events, currentRole }) => {
  const getEventBadge = (eventType: string) => {
    if (eventType.includes('acknowledged')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    if (eventType.includes('sync')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
    if (eventType.includes('created')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  };

  return (
    <div className="space-y-4">
      {/* Security Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Security, Access Control & Immutable Audit Trail
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                SECURITY.md SPEC
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Every sensitive action, synchronization batch, and review flag acknowledgment is logged with cryptographic timestamps and actor identities.
            </p>
          </div>

          {/* Current Auth / Session State */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs font-mono">
            <Key className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">ACTIVE CREDENTIAL</span>
              <strong className="text-white capitalize">{currentRole.replace('_', ' ')}</strong>
            </div>
          </div>
        </div>

        {/* Security Principles Checklist */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
            <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Server-Side Authorization
            </div>
            <p className="text-slate-400 text-[11px] mt-1">
              Permissions are enforced on every API route; hiding a UI button is not treated as a security boundary.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
            <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Privacy & Zero PII Leakage
            </div>
            <p className="text-slate-400 text-[11px] mt-1">
              Synthetic identifiers used exclusively for demo; passwords, tokens, or raw PII are never logged in metadata.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
            <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Idempotent Sync Verification
            </div>
            <p className="text-slate-400 text-[11px] mt-1">
              Client operation IDs are checked against server registry to eliminate duplicate telemetry ingestion.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            Audit Event Registry ({events.length} Recorded Events)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Retention: Demonstrative UTC Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Event Time (UTC)</th>
                <th className="p-3">Actor / Role</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Resource Target</th>
                <th className="p-3">Request Correlation ID</th>
                <th className="p-3">Context Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-850/50">
                  <td className="p-3 text-slate-300 whitespace-nowrap">
                    {new Date(evt.occurred_at).toLocaleString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="text-white font-semibold block">{evt.actor_user_id}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{evt.actor_role}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getEventBadge(evt.event_type)}`}>
                      {evt.event_type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">
                    {evt.resource_type} {evt.resource_id ? `(${evt.resource_id})` : ''}
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">
                    {evt.request_id || '--'}
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs truncate" title={JSON.stringify(evt.metadata)}>
                    {JSON.stringify(evt.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

