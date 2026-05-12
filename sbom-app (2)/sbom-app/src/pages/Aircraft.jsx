import { useState, useEffect } from 'react';
import { Plane, ChevronRight, Package, Cpu, AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { AIRCRAFT, SUBSYSTEMS, SBOMS, VULNERABILITIES, getImpactForCVE } from '../data/mockData';
import { db, isConnected } from '../lib/supabase';

export default function AircraftPage() {
  const [aircraft, setAircraft] = useState(AIRCRAFT);
  const [selected, setSelected] = useState(AIRCRAFT[0].id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    setLoading(true);
    db.aircraft().then(data => {
      if (data?.length) setAircraft(data);
      setLoading(false);
    });
  }, []);

  const ac = aircraft.find(a => a.id === selected) || aircraft[0];
  const subs = SUBSYSTEMS.filter(s => s.aircraftId === (ac?.id));

  const vulnsForAc = VULNERABILITIES.filter(v => {
    const impact = getImpactForCVE(v.id);
    return impact?.affected.some(a => a.aircraft?.id === ac?.id);
  });

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel: aircraft list ──────────────────────────── */}
      <div className="w-64 shrink-0 border-r border-border flex flex-col bg-surface overflow-hidden">
        <div className="px-4 py-4 border-b border-border">
          <h2 className="font-display font-bold text-text-primary text-sm">Fleet</h2>
          <p className="text-[11px] text-muted mt-0.5 font-mono">{aircraft.length} aircraft tracked</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {loading && (
            <div className="px-4 py-3 text-xs text-muted font-mono animate-pulse">Loading from Supabase…</div>
          )}
          {aircraft.map(a => {
            const acVulns = VULNERABILITIES.filter(v => {
              const impact = getImpactForCVE(v.id);
              return impact?.affected.some(x => x.aircraft?.id === a.id);
            });
            const isSelected = selected === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/50 transition-all group ${
                  isSelected ? 'bg-accent/8 border-l-2 border-l-accent' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      a.status === 'active' ? 'bg-success' : 'bg-warn'
                    }`} />
                    <div>
                      <div className={`font-mono font-bold text-sm ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                        {a.tail}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">{a.airline}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {acVulns.length > 0 && (
                      <span className="text-[10px] font-mono text-danger flex items-center gap-1">
                        <AlertTriangle size={9} /> {acVulns.length}
                      </span>
                    )}
                    {isSelected && <ChevronRight size={12} className="text-accent/60" />}
                  </div>
                </div>
                <div className="text-[10px] text-muted font-mono mt-1.5 pl-4">{a.type} · MSN {a.msn}</div>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
            {isConnected ? <Wifi size={10} className="text-success" /> : <WifiOff size={10} className="text-warn" />}
            {isConnected ? 'Live data' : 'Mock data'}
          </div>
        </div>
      </div>

      {/* ── Right panel: detail ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        {ac && (
          <div className="max-w-3xl space-y-5 fade-up">
            {/* Aircraft header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Plane size={20} className="text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="font-display font-bold text-2xl text-text-primary">{ac.tail}</h1>
                  <span className={ac.status === 'active' ? 'tag-low' : 'tag-high'}>{ac.status}</span>
                  {vulnsForAc.length > 0 && (
                    <span className="tag-critical">{vulnsForAc.length} CVE{vulnsForAc.length > 1 ? 's' : ''}</span>
                  )}
                </div>
                <p className="text-text-secondary text-sm mt-1">{ac.airline} · {ac.type} · MSN {ac.msn}</p>
              </div>
            </div>

            {/* CVE summary */}
            {vulnsForAc.length > 0 && (
              <div className="card border-danger/20 bg-danger/5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-danger" />
                  <span className="font-display font-semibold text-sm text-danger">Active Vulnerabilities</span>
                </div>
                <div className="space-y-2">
                  {vulnsForAc.map(v => (
                    <div key={v.id} className="flex items-center justify-between px-3 py-2 bg-bg border border-border/50 rounded-lg text-xs">
                      <span className="font-mono text-text-primary">{v.id}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted">CVSS {v.cvss}</span>
                        <span className={`tag-${v.severity}`}>{v.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vulnsForAc.length === 0 && (
              <div className="card flex items-center gap-3">
                <CheckCircle size={18} className="text-success shrink-0" />
                <div>
                  <div className="text-sm font-display font-semibold text-success">No active vulnerabilities</div>
                  <div className="text-xs text-muted mt-0.5">All components on this aircraft are clean</div>
                </div>
              </div>
            )}

            {/* Subsystems */}
            <div>
              <div className="text-xs font-mono text-muted uppercase tracking-widest mb-3">
                Subsystems ({subs.length})
              </div>
              {subs.length === 0 && (
                <div className="card text-center py-8 border-dashed text-muted text-sm">
                  No subsystems mapped · <a href="/upload" className="text-accent hover:underline">Upload an SBOM</a> to link one
                </div>
              )}
              <div className="space-y-3">
                {subs.map(sub => {
                  const sbom = SBOMS.find(s => s.subsystemId === sub.id);
                  return (
                    <div key={sub.id} className="card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-border flex items-center justify-center shrink-0">
                          <Cpu size={13} className="text-muted" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-semibold text-text-primary text-sm">{sub.name}</span>
                            <span className="text-[10px] text-muted font-mono">{sub.supplier}</span>
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">{sub.fullName}</div>
                        </div>
                      </div>
                      {sbom ? (
                        <div className="bg-bg border border-border rounded-lg px-4 py-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Package size={12} className="text-accent" />
                              <span className="font-mono text-xs text-accent font-semibold">{sbom.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="tag-info">{sbom.format}</span>
                              <span className="text-[10px] text-muted font-mono">v{sbom.version}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            {[
                              [sbom.componentCount, 'components'],
                              [sbom.uploadedAt, 'uploaded'],
                              [sbom.supplier, 'supplier'],
                            ].map(([val, label]) => (
                              <div key={label} className="bg-surface rounded-lg py-2">
                                <div className="font-display font-bold text-text-primary text-sm">{val}</div>
                                <div className="text-[10px] text-muted font-mono">{label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-bg border border-dashed border-border rounded-lg px-4 py-3 text-center text-xs text-muted">
                          No SBOM linked · <a href="/upload" className="text-accent hover:underline">Upload one</a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
