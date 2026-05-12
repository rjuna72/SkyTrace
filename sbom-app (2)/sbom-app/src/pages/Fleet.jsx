import { useState } from 'react';
import { Plane, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { AIRCRAFT, SUBSYSTEMS } from '../data/mockData';

const RISK_COLOR = { high:'text-danger', medium:'text-warn', low:'text-success' };
const RISK_BG    = { high:'bg-danger/10 border-danger/20', medium:'bg-warn/10 border-warn/20', low:'bg-success/10 border-success/20' };

export default function FleetPage() {
  const [selected, setSelected] = useState(AIRCRAFT[0].id);
  const [compareMode, setCompareMode] = useState(false);
  const [compareId, setCompareId] = useState(AIRCRAFT[1].id);

  const ac = AIRCRAFT.find(a => a.id === selected);
  const acComp = AIRCRAFT.find(a => a.id === compareId);
  const subs = SUBSYSTEMS.filter(s => s.aircraftId === selected);
  const subComp = SUBSYSTEMS.filter(s => s.aircraftId === compareId);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: aircraft list */}
      <div className="w-60 shrink-0 border-r border-border flex flex-col bg-surface">
        <div className="px-4 py-4 border-b border-border">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-text-primary text-sm">Aircraft / Fleet View</h2>
          <p className="text-[10px] text-muted mt-0.5 font-mono">See risk by aircraft and configuration</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {AIRCRAFT.map(a => {
            const isSelected = selected === a.id;
            return (
              <button key={a.id} onClick={() => setSelected(a.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/50 transition-all ${
                  isSelected ? 'bg-accent/8 border-l-2 border-l-accent' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${a.status==='active'?'bg-success':'bg-warn'}`} />
                    <span className={`font-mono font-bold text-sm ${isSelected?'text-accent':'text-text-primary'}`}>{a.tail}</span>
                  </div>
                  <span className={`tag-${a.overallRisk} text-[9px]`}>{a.overallRisk}</span>
                </div>
                <div className="text-[10px] text-muted font-mono mt-1 pl-3.5">{a.type} · {a.config}</div>
                <div className="text-[10px] text-muted/60 pl-3.5">{a.airline}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: detail */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 fade-up">
        {ac && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Plane size={18} className="text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-xl font-bold text-text-primary">{ac.tail}</h1>
                    <span className="text-sm text-muted font-mono">– {ac.config}</span>
                  </div>
                  <div className="text-xs text-muted">{ac.airline} · {ac.type} · MSN {ac.msn}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`border rounded-xl px-4 py-2 ${RISK_BG[ac.overallRisk]}`}>
                  <div className="text-[10px] text-muted font-mono mb-0.5">Overall Risk</div>
                  <div className={`font-bold text-lg capitalize ${RISK_COLOR[ac.overallRisk]}`} style={{fontFamily:'Syne,sans-serif'}}>{ac.overallRisk}</div>
                </div>
                <div className="card py-2 px-4">
                  <div className="text-[10px] text-muted font-mono mb-0.5">Affected Subsystems</div>
                  <div className="font-bold text-lg text-text-primary" style={{fontFamily:'Syne,sans-serif'}}>{ac.affectedSubsystems}</div>
                </div>
                <button onClick={() => setCompareMode(!compareMode)}
                  className={`btn-ghost text-xs ${compareMode?'border-accent text-accent':''}`}>
                  {compareMode ? 'Exit Compare' : 'Compare Configs'}
                </button>
              </div>
            </div>

            {/* Compare selector */}
            {compareMode && (
              <div className="card flex items-center gap-4">
                <span className="text-xs text-muted font-mono">Compare with:</span>
                <select value={compareId} onChange={e => setCompareId(e.target.value)} className="input w-56 text-xs">
                  {AIRCRAFT.filter(a => a.id !== selected).map(a => (
                    <option key={a.id} value={a.id}>{a.tail} ({a.config})</option>
                  ))}
                </select>
                <span className="text-[10px] text-muted font-mono">Comparing {ac.tail} vs {acComp?.tail}</span>
              </div>
            )}

            {/* Subsystems table */}
            <div className="card">
              <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary mb-4">
                Subsystems {compareMode && <span className="text-muted text-xs ml-2 font-mono">({ac.tail} vs {acComp?.tail})</span>}
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[10px] font-mono text-muted uppercase tracking-widest border-b border-border">
                    {['Subsystem','Supplier','Risk Level','SBOM Status','Vulnerabilities', ...(compareMode?['Compare Risk','Compare SBOMs']:['DAL Level'])].map(h => (
                      <th key={h} className="pb-2 pr-4 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {subs.map((s, i) => {
                    const sc = subComp[i];
                    return (
                      <tr key={s.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 pr-4 text-text-primary font-medium">{s.name}</td>
                        <td className="py-2.5 pr-4 text-text-dim">{s.supplier}</td>
                        <td className="py-2.5 pr-4"><span className={`tag-${s.riskLevel}`}>{s.riskLevel.charAt(0).toUpperCase()+s.riskLevel.slice(1)}</span></td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-1.5">
                            {s.sbomStatus === 'Complete'
                              ? <CheckCircle size={11} className="text-success" />
                              : <AlertTriangle size={11} className="text-warn" />}
                            <span className={s.sbomStatus==='Complete'?'text-success':'text-warn'}>{s.sbomStatus}</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className={s.vulnerabilities > 0 ? 'text-danger font-mono font-bold' : 'text-success font-mono'}>{s.vulnerabilities}</span>
                        </td>
                        {compareMode ? (
                          <>
                            <td className="py-2.5 pr-4">{sc && <span className={`tag-${sc.riskLevel}`}>{sc.riskLevel}</span>}</td>
                            <td className="py-2.5 pr-4">{sc && <span className={sc.sbomStatus==='Complete'?'text-success text-xs':'text-warn text-xs'}>{sc.sbomStatus}</span>}</td>
                          </>
                        ) : (
                          <td className="py-2.5 pr-4">
                            <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                              s.dal==='DAL-A'?'text-danger border-danger/30 bg-danger/10':
                              s.dal==='DAL-B'?'text-warn border-warn/30 bg-warn/10':
                              'text-text-dim border-border'
                            }`}>{s.dal}</span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
