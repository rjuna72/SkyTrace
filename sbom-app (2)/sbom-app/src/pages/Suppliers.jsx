import { TrendingUp, TrendingDown, Minus, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { SUPPLIERS } from '../data/mockData';

const FACTORS = ['SBOM Completeness','Update Frequency','Vulnerability Response Time','Format Consistency','Dependency Traceability','Missing Dependencies'];

function ScoreBar({ value }) {
  const color = value >= 80 ? '#00e5a0' : value >= 55 ? '#ff6b35' : '#ff2d55';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-bg border border-border rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function TrendIcon({ trend }) {
  if (trend === 'up')   return <TrendingUp   size={13} className="text-success" />;
  if (trend === 'down') return <TrendingDown  size={13} className="text-danger" />;
  return <Minus size={13} className="text-muted" />;
}

export default function SuppliersPage() {
  const highC   = SUPPLIERS.filter(s => s.compliance >= 80).length;
  const medC    = SUPPLIERS.filter(s => s.compliance >= 50 && s.compliance < 80).length;
  const lowC    = SUPPLIERS.filter(s => s.compliance < 50).length;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <div>
        <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-2xl font-bold text-text-primary">Supplier Compliance</h1>
        <p className="text-text-secondary text-xs mt-0.5">Monitor supplier transparency and SBOM quality</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ['Total Suppliers', SUPPLIERS.length, '#e8edf8', Users],
          ['High Compliance', `${highC} (${Math.round(highC/SUPPLIERS.length*100)}%)`, '#00e5a0', CheckCircle],
          ['Medium Compliance', `${medC} (${Math.round(medC/SUPPLIERS.length*100)}%)`, '#ff6b35', AlertTriangle],
          ['Low Compliance', `${lowC} (${Math.round(lowC/SUPPLIERS.length*100)}%)`, '#ff2d55', AlertTriangle],
        ].map(([label, value, color, Icon]) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted font-mono uppercase tracking-widest">{label}</span>
              <Icon size={13} style={{ color }} />
            </div>
            <div style={{fontFamily:'Syne,sans-serif', color}} className="font-bold text-2xl">{value}</div>
          </div>
        ))}
      </div>

      {/* Supplier table */}
      <div className="card">
        <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary mb-4">Supplier Registry</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] font-mono text-muted uppercase tracking-widest border-b border-border">
              {['Supplier','Tier','SBOM Completeness','Update Frequency','Avg. Response Time','Compliance Score','Trend'].map(h => (
                <th key={h} className="pb-2 pr-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {SUPPLIERS.map(s => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <td className="py-3 pr-4">
                  <div className="font-semibold text-text-primary">{s.name}</div>
                  <div className="text-[10px] text-muted mt-0.5">{s.systems.slice(0,2).join(', ')}</div>
                </td>
                <td className="py-3 pr-4">
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                    s.tier==='Tier 1' ? 'text-accent border-accent/30 bg-accent/10' : 'text-muted border-border'
                  }`}>{s.tier}</span>
                </td>
                <td className="py-3 pr-4 w-32"><ScoreBar value={s.compliance} /></td>
                <td className="py-3 pr-4 text-text-secondary">{s.updateFreq}</td>
                <td className="py-3 pr-4">
                  <span className={s.avgResponse > 20 ? 'text-danger font-mono' : s.avgResponse > 12 ? 'text-warn font-mono' : 'text-success font-mono'}>
                    {s.avgResponse} days
                  </span>
                </td>
                <td className="py-3 pr-4 w-32"><ScoreBar value={s.score} /></td>
                <td className="py-3 pr-4"><TrendIcon trend={s.trend} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compliance score factors */}
      <div className="card">
        <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary mb-4">Compliance Score Factors</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {FACTORS.map(f => (
            <div key={f} className="bg-bg border border-border rounded-xl p-4 text-center hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-2">
                <CheckCircle size={16} className="text-accent" />
              </div>
              <div className="text-[10px] text-text-secondary font-medium leading-tight">{f}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
