import { useState } from 'react';
import { FileText, Download, Eye, Shield, Plane, Users, AlertTriangle } from 'lucide-react';

const REPORT_TYPES = [
  { id: 'exposure',    icon: Plane,         title: 'Aircraft Vulnerability\nExposure Report',     desc: 'Full CVE impact per aircraft' },
  { id: 'supplier',    icon: Users,         title: 'Supplier SBOM\nCompliance Report',            desc: 'Completeness and quality scores' },
  { id: 'traceability',icon: FileText,      title: 'Incident Traceability\nReport',               desc: 'Root cause chain for incidents' },
  { id: 'regulatory',  icon: Shield,        title: 'Regulatory Snapshot\nReport',                 desc: 'EASA/FAA compliance summary' },
];

const PREVIEW = {
  exposure: {
    title: 'Aircraft Vulnerability Exposure Report',
    generated: '09 May 2026',
    stats: [['Affected Aircraft', 14], ['Critical Vulnerabilities', 8], ['Affected Subsystems', 6], ['High Priority Actions', 5]],
  },
};

export default function ReportsPage() {
  const [selected, setSelected] = useState('exposure');
  const preview = PREVIEW[selected];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <div>
        <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-2xl font-bold text-ab">Reports / Compliance</h1>
        <p className="text-ab-grey3 text-xs mt-0.5">Generate reports for decision-makers and regulators</p>
      </div>

      {/* Report type selector */}
      <div>
        <div className="text-[10px] font-mono text-ab-grey2 uppercase tracking-widest mb-3">Select Report Type</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {REPORT_TYPES.map(r => (
            <button key={r.id} onClick={() => setSelected(r.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selected === r.id
                  ? 'bg-accent/10 border-accent/30 text-ab-light'
                  : 'bg-white border-ab-grey hover:border-accent/30 text-ab-grey3'
              }`}
            >
              <r.icon size={24} className={`mb-3 ${selected===r.id?'text-ab-light':'text-ab-grey2'}`} />
              <div className="text-xs font-semibold leading-tight whitespace-pre-line text-ab">{r.title}</div>
              <div className="text-[10px] text-ab-grey2 mt-1">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-ab">Report Preview</h2>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"><Eye size={12} /> Preview</button>
            <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"><Download size={12} /> Export Report (PDF)</button>
          </div>
        </div>

        {preview ? (
          <div className="bg-ab-off border border-ab-grey rounded-xl p-5">
            <div className="border-b border-ab-grey pb-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
                  <Shield size={11} className="text-ab-light" />
                </div>
                <span style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-ab text-sm">{preview.title}</span>
              </div>
              <div className="text-[10px] text-ab-grey2 font-mono">Generated: {preview.generated}</div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {preview.stats.map(([label, value]) => (
                <div key={label} className="bg-white border border-ab-grey rounded-lg p-3 text-center">
                  <div style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-xl text-ab">{value}</div>
                  <div className="text-[10px] text-ab-grey2 font-mono mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {[
                ['1.', 'Executive Summary', 'Overview of fleet-wide vulnerability exposure'],
                ['2.', 'Critical Findings', '8 critical CVEs requiring immediate action'],
                ['3.', 'Aircraft-Level Impact', 'Per-aircraft breakdown with subsystem detail'],
                ['4.', 'Recommended Actions', 'Prioritised remediation schedule'],
                ['5.', 'Regulatory Compliance', 'EASA ED-203A alignment status'],
              ].map(([num, title, sub]) => (
                <div key={title} className="flex items-start gap-3 py-2 border-b border-ab-grey/40 last:border-0">
                  <span className="font-mono text-[10px] text-ab-grey2 w-4">{num}</span>
                  <div>
                    <div className="text-xs font-medium text-ab">{title}</div>
                    <div className="text-[10px] text-ab-grey2">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-ab-grey2 text-sm">Select a report type above</div>
        )}
      </div>

      {/* Platform summary */}
      <div className="card">
        <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-ab mb-2 text-center">Platform at a Glance</h2>
        <p className="text-[11px] text-ab-grey2 text-center mb-5">From vulnerability disclosure to aircraft-level decision support</p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {[
            [AlertTriangle, 'Vulnerability\nDiscovered'],
            ['→', ''],
            [Shield, 'Matched to\nSBOM Component'],
            ['→', ''],
            [FileText, 'Dependency\nTraced'],
            ['→', ''],
            [Plane, 'Aircraft Impact\nIdentified'],
            ['→', ''],
            [Shield, 'Risk Status\nUpdated'],
          ].map(([Icon, label], i) => (
            Icon === '→'
              ? <span key={i} className="text-ab-grey2 text-lg">→</span>
              : (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-2">
                    <Icon size={16} className="text-ab-light" />
                  </div>
                  <div className="text-[9px] text-ab-grey2 font-mono whitespace-pre-line leading-tight">{label}</div>
                </div>
              )
          ))}
        </div>
        <div className="text-center mt-5 text-[10px] font-mono text-ab-light/70 uppercase tracking-widest">
          Improving aircraft safety and cyber resilience through software supply chain visibility
        </div>
      </div>
    </div>
  );
}
