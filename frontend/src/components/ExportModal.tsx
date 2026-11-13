import React, { useState } from 'react';
import { Observation, Subject } from '../types';
import { Download, X, Copy, Check, FileSpreadsheet, FileCode, ShieldAlert } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: Observation[];
  subjects: Subject[];
  selectedSubjectId: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  observations,
  subjects,
  selectedSubjectId
}) => {
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Filter observations for export (or all if desired)
  const exportData = observations.map(o => ({
    ...o,
    disclaimer: "SIMULATED DATA - Educational prototype - Not a clinical diagnosis"
  }));

  const generateExportText = () => {
    if (format === 'json') {
      return JSON.stringify(
        {
          provenance: "ARES-IV MISSION SIMULATED BIO-TELEMETRY DATASET",
          disclaimer: "SYNTHETIC DATA ONLY - NOT A MEDICAL DEVICE - NO CLINICAL DIAGNOSIS",
          exported_at: new Date().toISOString(),
          record_count: exportData.length,
          records: exportData
        },
        null,
        2
      );
    } else {
      const headers = ['id', 'subject_id', 'measurement_type', 'value_numeric', 'unit', 'observed_at', 'source', 'is_simulated', 'note'];
      const rows = exportData.map(o => [
        o.id,
        o.subject_id,
        o.measurement_type,
        o.value_numeric,
        o.unit,
        o.observed_at,
        o.source,
        o.is_simulated,
        `"${(o.note || '').replace(/"/g, '""')}"`
      ]);
      return [
        '# SIMULATED DATA ONLY - Educational Prototype - No Clinical Diagnosis',
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateExportText();
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astronaut_health_simulated_${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Export Mission Telemetry Dataset</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg text-xs text-amber-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>FR-12 Compliance:</strong> Exported dataset is automatically watermarked as <strong>SIMULATED DATA</strong>. It must not be presented or analyzed as clinical patient records.
          </div>
        </div>

        {/* Format Selection */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">Export Format:</span>
          <button
            onClick={() => setFormat('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              format === 'json'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>JSON Object</span>
          </button>
          <button
            onClick={() => setFormat('csv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              format === 'csv'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV Table</span>
          </button>
        </div>

        {/* Preview box */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-400 select-all">
          <pre>{generateExportText().slice(0, 700)}...</pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">
            {exportData.length} records ready
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{format}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

