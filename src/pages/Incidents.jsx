import { useState } from 'react';
import { AlertOctagon, Search, Clock, ArrowRight, GitBranch } from 'lucide-react';
import { INCIDENTS } from '../data/mockData';

export default function IncidentsPage() {
  const [selected, setSelected] = useState(INCIDENTS[0]);
  const [searching, setSearching] = useState('');

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left */}
      <div className="w-72 shrink-0 border-r border-ab-grey flex flex-col bg-white">
        <div className="px-4 py-4 border-b border-ab-grey">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-ab text-sm">Incident Investigation</h2>
          <p className="text-[10px] text-ab-grey2 mt-0.5">Quickly identify root cause and affected assets</p>
          <div className="relative mt-3">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-ab-grey2" />
            <input className="input pl-8 text-xs" placeholder="Search incident…" value={searching} onChange={e => setSearching(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {INCIDENTS.filter(i => !searching || i.title.toLowerCase().includes(searching.toLowerCase())).map(inc => (
            <button key={inc.id} onClick={() => setSelected(inc)}
              className={`w-full text-left px-4 py-3 border-b border-ab-grey/50 transition-all ${
                selected?.id === inc.id ? 'bg-accent/8 border-l-2 border-l-accent' : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-ab-grey2">{inc.id}</span>
                <span className={`tag-${inc.severity}`}>{inc.severity}</span>
              </div>
              <div className="text-xs text-ab font-medium leading-tight">{inc.title}</div>
              <div className="text-[10px] text-ab-grey2 mt-1">{inc.reported}</div>
            </button>
          ))}
          {/* placeholder incidents */}
          {[1,2,3].map(i => (
            <div key={i} className="px-4 py-3 border-b border-ab-grey/50 opacity-40">
              <div className="h-2.5 bg-border rounded w-20 mb-2" />
              <div className="h-2 bg-border/60 rounded w-40" />
            </div>
          ))}
        </div>
      </div>

      {/* Right: detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5 fade-up">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-warn/10 border border-warn/20 flex items-center justify-center shrink-0">
              <AlertOctagon size={18} className="text-warn" />
            </div>
            <div className="flex-1">
              <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-xl font-bold text-ab">{selected.title}</h1>
              <div className="flex items-center gap-4 mt-1 text-[11px] font-mono text-ab-grey2">
                <span>ID: <span className="text-ab-grey3">{selected.id}</span></span>
                <span>Reported: {selected.reported}</span>
                <span>Aircraft: <span className="text-ab-light">{selected.aircraft}</span></span>
                <span className={`tag-${selected.severity}`}>{selected.severity}</span>
                <span className="tag-medium">{selected.status}</span>
              </div>
            </div>
            <button className="bg-danger text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Start Investigation
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Timeline */}
            <div className="card">
              <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-ab mb-4 flex items-center gap-2">
                <Clock size={13} className="text-ab-light" /> Investigation Timeline
              </h2>
              <div className="space-y-0">
                {selected.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent border-2 border-bg shrink-0 mt-0.5" />
                      {i < selected.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-1">
                      <div className="text-[10px] text-ab-grey2 font-mono">{t.date}</div>
                      <div className="text-xs text-ab-grey3 mt-0.5">{t.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related systems */}
            <div className="card">
              <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-ab mb-4">Related Systems</h2>
              <div className="space-y-2 mb-4">
                {selected.relatedSystems.map((s, i) => (
                  <div key={s} className={`px-3 py-2.5 rounded-lg border text-xs font-medium ${
                    i === 0 ? 'bg-accent/10 border-accent/30 text-ab-light' : 'bg-ab-off border-ab-grey text-ab-grey3'
                  }`}>{s}</div>
                ))}
              </div>
              <div className="pt-3 border-t border-ab-grey">
                <div className="text-[10px] text-ab-grey2 font-mono mb-2 flex items-center gap-1.5">
                  <GitBranch size={10} /> Suggested Investigation Path
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selected.path.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono bg-ab-off border border-ab-grey rounded px-2 py-1 text-ab-grey3">{p}</span>
                      {i < selected.path.length - 1 && <ArrowRight size={10} className="text-ab-grey2" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
