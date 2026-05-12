import { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react';
import { SBOMS, SBOM_SUMMARY } from '../data/mockData';

function Bar({ value, color }) {
  return (
    <div className="flex-1 bg-ab-off rounded-full h-1.5 overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export default function RepositoryPage() {
  const [search, setSearch] = useState('');
  const filtered = SBOMS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.supplier.toLowerCase().includes(search.toLowerCase()) ||
    s.system.toLowerCase().includes(search.toLowerCase())
  );

  const completePercent = Math.round(SBOM_SUMMARY.complete / SBOM_SUMMARY.total * 100);
  const partialPercent  = Math.round(SBOM_SUMMARY.partial  / SBOM_SUMMARY.total * 100);
  const incompletePercent = Math.round(SBOM_SUMMARY.incomplete / SBOM_SUMMARY.total * 100);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <div>
        <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-2xl font-bold text-ab">SBOM Repository</h1>
        <p className="text-ab-grey3 text-xs mt-0.5">View and manage supplier SBOMs (verified externally)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upload */}
        <div className="lg:col-span-2 card">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-ab mb-4 flex items-center gap-2">
            <Upload size={14} className="text-ab-light" /> Upload / Import SBOM
          </h2>
          <div
            className="border-2 border-dashed border-ab-grey hover:border-accent/40 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-white/[0.02]"
            onClick={() => document.getElementById('repo-file').click()}
          >
            <input id="repo-file" type="file" accept=".json,.xml" className="hidden" />
            <Upload size={24} className="text-ab-grey2 mx-auto mb-2" />
            <p className="text-ab-grey3 text-sm font-medium">Drop files here or browse</p>
            <div className="flex justify-center gap-2 mt-2">
              <span className="tag-info">SPDX</span>
              <span className="tag-info">CycloneDX</span>
            </div>
          </div>
          <p className="text-[10px] text-ab-grey2 font-mono mt-3 flex items-center gap-1.5">
            <Shield size={10} className="text-ab-light" />
            Note: SBOMs are not verified by this platform. Only SBOMs verified through the Airbus approval process are accepted.
          </p>
        </div>

        {/* Summary */}
        <div className="card">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-ab mb-4">SBOM Summary</h2>
          <div className="text-center mb-4">
            <div style={{fontFamily:'Syne,sans-serif'}} className="text-4xl font-bold text-ab">{SBOM_SUMMARY.total.toLocaleString()}</div>
            <div className="text-[10px] text-ab-grey2 font-mono mt-1">Total SBOMs</div>
          </div>
          <div className="space-y-3">
            {[
              { label:'Complete', value: SBOM_SUMMARY.complete, pct: completePercent, color:'#00e5a0' },
              { label:'Partial',  value: SBOM_SUMMARY.partial,  pct: partialPercent,  color:'#ff6b35' },
              { label:'Incomplete', value: SBOM_SUMMARY.incomplete, pct: incompletePercent, color:'#ff2d55' },
            ].map(r => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ab-grey3">{r.label}</span>
                  <span className="font-mono" style={{color:r.color}}>{r.value.toLocaleString()} ({r.pct}%)</span>
                </div>
                <Bar value={r.pct} color={r.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-ab flex-1">SBOM Registry</h2>
          <input className="input w-56 text-xs" placeholder="Search SBOMs…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] font-mono text-ab-grey2 uppercase tracking-widest border-b border-ab-grey">
                {['SBOM ID','Supplier','Subsystem','Version','Format','Verification Status','Last Updated','Completeness'].map(h => (
                  <th key={h} className="pb-2 pr-4 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-ab-light">{s.name}</td>
                  <td className="py-2.5 pr-4 text-ab-grey3">{s.supplier}</td>
                  <td className="py-2.5 pr-4 text-text-dim">{s.system}</td>
                  <td className="py-2.5 pr-4 font-mono text-ab-grey3">{s.version}</td>
                  <td className="py-2.5 pr-4"><span className="tag-info">{s.format}</span></td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5 text-success">
                      <CheckCircle size={11} />{s.verificationStatus}
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1 text-ab-grey2">
                      <Clock size={10} />{s.lastUpdated}
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-ab-off border border-ab-grey rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width:`${s.completeness}%`,
                          background: s.completeness>=85?'#00e5a0':s.completeness>=65?'#ff6b35':'#ff2d55'
                        }} />
                      </div>
                      <span className="font-mono text-ab-grey3">{s.completeness}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
