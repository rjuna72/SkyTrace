import { useState } from 'react';
import { Search, AlertTriangle, Plane, Cpu, Package, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { VULNERABILITIES, getImpactForCVE } from '../data/mockData';

function GaugeArc({ score, max = 10 }) {
  const pct = score / max;
  const color = pct > 0.7 ? '#ff2d55' : pct > 0.4 ? '#ff6b35' : '#00e5a0';
  const r = 44, cx = 60, cy = 60;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - pct);
  return (
    <svg width="120" height="70" viewBox="0 0 120 70">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1a2438" strokeWidth="10" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 0.8s ease'}} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="Syne,sans-serif">{score}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#4a5878" fontSize="9" fontFamily="monospace">AEROSPACE SCORE</text>
    </svg>
  );
}

export default function VulnIntelPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(VULNERABILITIES[0]);
  const [expanded, setExpanded] = useState({});

  const filtered = VULNERABILITIES.filter(v =>
    !query || v.id.toLowerCase().includes(query.toLowerCase()) || v.component.toLowerCase().includes(query.toLowerCase())
  );

  const impact = getImpactForCVE(selected?.id);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: CVE list */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col bg-surface">
        <div className="px-4 py-4 border-b border-border">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-text-primary text-sm">Vulnerability Intelligence</h2>
          <p className="text-[10px] text-muted mt-0.5">Understand actual impact in aircraft context</p>
          <div className="relative mt-3">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-8 text-xs" placeholder="Source CVE ID or component…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(v => (
            <button key={v.id} onClick={() => setSelected(v)}
              className={`w-full text-left px-4 py-3 border-b border-border/50 transition-all ${
                selected?.id === v.id ? 'bg-accent/8 border-l-2 border-l-accent' : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-text-primary font-semibold">{v.id}</span>
                <span className={`tag-${v.severity}`}>{v.severity}</span>
              </div>
              <div className="text-[10px] text-muted">{v.component} · v{v.version}</div>
              <div className="text-[10px] text-muted/60 mt-0.5">CVSS {v.cvss} · Published {v.published}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5 fade-up">
          {/* CVE header */}
          <div className="card border-l-4" style={{ borderLeftColor: selected.severity==='critical'?'#ff2d55':selected.severity==='high'?'#ff6b35':'#f5a800' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-xl text-text-primary">{selected.id}</span>
                  <span className={`tag-${selected.severity}`}>{selected.severity.toUpperCase()}</span>
                </div>
                <p className="text-sm text-text-secondary">{selected.description}</p>
                <div className="flex gap-4 mt-2 text-[11px] font-mono text-muted">
                  <span>Component: <span className="text-accent">{selected.component} v{selected.version}</span></span>
                  <span>Type: {selected.type}</span>
                  <span>Published: {selected.published}</span>
                  <span>CVSS: <span className="text-warn">{selected.cvss} (Base)</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Aircraft Impact Summary */}
            <div className="card">
              <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary mb-4">Aircraft Impact Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Affected Aircraft\nConfigurations', selected.affectedConfigs, '#ff2d55'],
                  ['Affected Subsystems', selected.affectedSubsystems, '#ff6b35'],
                  ['Active Installations', selected.activeInstallations, '#f5a800'],
                  ['Risk Priority', selected.riskPriority, selected.riskPriority==='Immediate'?'#ff2d55':'#ff6b35'],
                ].map(([label, val, color]) => (
                  <div key={label} className="bg-bg border border-border rounded-xl p-3">
                    <div className="text-[10px] text-muted font-mono whitespace-pre-line mb-1">{label}</div>
                    <div style={{fontFamily:'Syne,sans-serif', color}} className="font-bold text-xl">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contextual Risk Assessment */}
            <div className="card">
              <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary mb-4 flex items-center gap-2">
                <Shield size={13} className="text-accent" /> Contextual Risk Assessment
                <span className="text-[10px] text-accent font-mono ml-auto">Re-scored Severity</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {[
                    ['Is component installed?', selected.isComponentActive],
                    ['Is component active?',    selected.isComponentActive],
                    ['Network exposed?',         selected.isNetworkExposed],
                    ['Redundancy available?',    selected.hasRedundancy],
                    ['Operational impact',       selected.operationalImpact],
                  ].map(([q, a]) => (
                    <div key={q} className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted">{q}</span>
                      <span className={typeof a === 'boolean' ? (a ? 'text-success' : 'text-danger') : 'text-text-secondary'}>
                        {typeof a === 'boolean' ? (a ? 'Yes' : 'No') : a}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <GaugeArc score={selected.aerospaceScore} />
                  <div className="text-center mt-1">
                    <div style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-text-primary">{selected.aerospaceLevel}</div>
                    <div className="text-[10px] text-muted font-mono">vs CVSS {selected.cvss} Base</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-muted font-mono bg-bg border border-border rounded-lg px-3 py-2">
                💡 Recommended: Plan remediation for next maintenance window.
              </div>
            </div>
          </div>

          {/* Affected assets expandable */}
          {impact?.affected.length > 0 && (
            <div className="card">
              <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary mb-3">Affected Assets</h3>
              <div className="space-y-2">
                {impact.affected.map((a, i) => (
                  <div key={i} className="border border-danger/20 bg-danger/5 rounded-xl">
                    <button onClick={() => setExpanded(e => ({...e, [i]: !e[i]}))} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                      <Plane size={14} className="text-danger shrink-0" />
                      <div className="flex-1">
                        <div className="font-mono text-sm text-text-primary font-semibold">{a.aircraft?.tail}</div>
                        <div className="text-[10px] text-muted">{a.aircraft?.airline} · {a.subsystem?.name}</div>
                      </div>
                      <div className="text-[10px] font-mono text-muted">{a.sbom?.name}</div>
                      {expanded[i] ? <ChevronDown size={13} className="text-muted" /> : <ChevronRight size={13} className="text-muted" />}
                    </button>
                    {expanded[i] && (
                      <div className="px-4 pb-4 pt-0 grid grid-cols-3 gap-3 fade-up">
                        {[
                          [<Plane size={11} />, 'Aircraft', a.aircraft?.tail, a.aircraft?.status],
                          [<Cpu size={11} />,   'Subsystem', a.subsystem?.name, a.subsystem?.supplier],
                          [<Package size={11} />, 'Component', a.component?.name, `v${a.component?.version}`],
                        ].map(([icon, label, val, sub]) => (
                          <div key={label} className="bg-bg border border-border rounded-lg p-3">
                            <div className="flex items-center gap-1 text-muted text-[10px] mb-1.5">{icon} {label}</div>
                            <div className="font-mono text-xs text-text-primary font-semibold">{val}</div>
                            <div className="text-[10px] text-muted mt-0.5">{sub}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
