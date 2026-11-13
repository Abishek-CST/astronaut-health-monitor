import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Shield, 
  UserCheck, 
  Clock, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Radio
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
  onTriggerSync: () => void;
  isSyncing: boolean;
  onOpenExport: () => void;
  onOpenRecordModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  isOffline,
  onToggleOffline,
  pendingSyncCount,
  onTriggerSync,
  isSyncing,
  onOpenExport,
  onOpenRecordModal
}) => {
  const [utcTime, setUtcTime] = useState<string>('');
  const [metSeconds, setMetSeconds] = useState<number>(142 * 86400 + 8 * 3600 + 45 * 60 + 12);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
      setMetSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMet = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `T+ ${days}d ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Mission Overview', icon: Activity },
    { id: 'trends', label: 'Biometric Trends', icon: Radio },
    { id: 'flags', label: 'Review Flags', icon: AlertTriangle },
    { id: 'sync', label: 'Offline Sync Queue', icon: RefreshCw },
    { id: 'audit', label: 'Security & Audit', icon: Shield },
    { id: 'docs', label: 'Architecture Specs', icon: FileText },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Telemetry Ticker & Safety Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-cyan-400 font-semibold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            ARES-IV MISSION CONTROL
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="font-mono text-slate-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            MET: <strong className="text-cyan-300">{formatMet(metSeconds)}</strong>
          </span>
          <span className="hidden md:inline-block font-mono text-slate-400">
            ({utcTime || 'CALCULATING...'})
          </span>
        </div>

        {/* Prominent Simulated Data & Disclaimer Tag */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            SIMULATED DATA ONLY
          </div>
          <span className="hidden lg:inline-block text-[11px] text-slate-400">
            Prototype Demo — Not a Medical Device — No Clinical Diagnosis
          </span>
        </div>

        {/* Life Support Status */}
        <div className="hidden xl:flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>Cabin O₂: <strong className="text-emerald-400">21.2%</strong></span>
          <span>Press: <strong className="text-emerald-400">101.3 kPa</strong></span>
          <span>Temp: <strong className="text-cyan-300">21.4°C</strong></span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Astronaut Health Monitor
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                Offline-First PWA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              NASA Space Apps 2026 Prototype • Expedition Bio-Telemetry & Remote Field Station
            </p>
          </div>
        </div>

        {/* Quick Actions & Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Simulated Offline Toggle */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? "Click to reconnect telemetry link" : "Click to simulate Deep Space Loss-of-Signal"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isOffline
                ? 'bg-rose-950/70 border-rose-600/80 text-rose-300 shadow-[0_0_12px_rgba(225,29,72,0.3)] animate-pulse'
                : 'bg-emerald-950/50 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/40'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-rose-400" />
                <span>Simulated Offline (LOS)</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>Deep Space Link Active</span>
              </>
            )}
          </button>

          {/* Sync Queue Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing || isOffline || pendingSyncCount === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              pendingSyncCount > 0
                ? 'bg-amber-950/60 border-amber-500 text-amber-200 hover:bg-amber-900/60 cursor-pointer animate-bounce'
                : 'bg-slate-900 border-slate-700/80 text-slate-400 cursor-default'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>
              {isSyncing ? 'Syncing...' : pendingSyncCount > 0 ? `${pendingSyncCount} Pending Sync` : 'Synced'}
            </span>
          </button>

          {/* Record Observation Button */}
          <button
            onClick={onOpenRecordModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-medium shadow-md shadow-cyan-600/20 border border-cyan-400/30 transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>+ Log Vitals</span>
          </button>

          {/* Role Switcher (RBAC) */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400 font-medium">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="flight_surgeon" className="bg-slate-900 text-slate-200">
                Flight Surgeon (Admin)
              </option>
              <option value="reviewer" className="bg-slate-900 text-slate-200">
                Mission Reviewer
              </option>
              <option value="astronaut" className="bg-slate-900 text-slate-200">
                Crew Member (Elena)
              </option>
            </select>
          </div>

          {/* Export Data */}
          <button
            onClick={onOpenExport}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title="Export Simulated Mission Dataset"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 lg:px-8 flex overflow-x-auto gap-1 border-t border-slate-800/60 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.id === 'flags' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  4 Active
                </span>
              )}
              {item.id === 'sync' && pendingSyncCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                  {pendingSyncCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

