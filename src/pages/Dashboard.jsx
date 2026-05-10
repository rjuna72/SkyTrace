import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Plane, Package, Users, FileCode2, ArrowRight, TrendingUp } from 'lucide-react';
import { FLEET_STATS, RISK_BY_SUBSYSTEM, RECENT_ALERTS, AIRCRAFT, VULNERABILITIES } from '../data/mockData';

const SEV = { critical:'#ff2d55', high:'#ff6b35', medium:'#f5a800', low:'#00e5a0' };

function StatCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted font-mono uppercase tracking-widest">{label}</span>
        {Icon && <Icon size={13} className="text-muted" />}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold leading-none" style={{ color: color || '#e8edf8', fontFamily:'Syne,sans-serif' }}>{value}</span>
        {sub && <span className="text-xs text-muted font-mono mb-0.5">{sub}</span>}
      </div>
    </div>
  );
}

function RiskDot({ s }) {
  return <span className="w-2 h-2 rounded-full inline-block" style={{ background: SEV[s] || '#4a5878' }} />;
}

export default function Dashboard() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" style={{animation:'pulse 2s infinite'}} />
          Live · {new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}
        </div>
        <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-2xl font-bold text-text-primary">Home / Executive Dashboard</h1>
        <p className="text-text-secondary text-xs mt-0.5">High-level overview of cyber risk across the fleet</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Aircraft in Fleet"         value={FLEET_STATS.totalAircraft.toLocaleString()} icon={Plane} />
        <StatCard label="Critical Vulnerabilities"  value={FLEET_STATS.criticalVulns} color="#ff2d55" icon={AlertTriangle} />
        <StatCard label="Affected Configurations"   value={FLEET_STATS.affectedConfigs} color="#ff6b35" sub="High Risk" />
        <StatCard label="Suppliers Missing SBOMs"   value={FLEET_STATS.missingSuppliers} color="#f5a800" sub="Action Required" />
        <StatCard label="Avg. Response Time"        value={FLEET_STATS.avgResponseDays} sub="days" icon={TrendingUp} />
        <StatCard label="Total SBOMs"               value={FLEET_STATS.sboms.toLocaleString()} icon={FileCode2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk donut */}
        <div className="card">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary mb-4">Risk by Subsystem</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={RISK_BY_SUBSYSTEM} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {RISK_BY_SUBSYSTEM.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background:'#0e1521', border:'1px solid #1a2438', borderRadius:8, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {RISK_BY_SUBSYSTEM.map(r => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="text-text-secondary">{r.name}</span>
                </div>
                <span className="font-mono" style={{ color: r.color }}>{r.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary">Top Risks</h2>
            <Link to="/query" className="text-[10px] text-accent hover:underline flex items-center gap-1">View all <ArrowRight size={9} /></Link>
          </div>
          <div className="space-y-2">
            {VULNERABILITIES.slice(0, 5).map(v => (
              <div key={v.id} className="flex items-center gap-3 px-3 py-2.5 bg-bg border border-border rounded-lg hover:border-accent/30 transition-colors">
                <RiskDot s={v.severity} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-text-primary">{v.id}</div>
                  <div className="text-[10px] text-muted truncate">{v.component}</div>
                </div>
                <span className={`tag-${v.severity}`}>{v.severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts + Fleet */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary">Recent Alerts</h2>
            </div>
            <div className="space-y-2">
              {RECENT_ALERTS.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-border/50 last:border-0">
                  <RiskDot s={a.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[11px] text-accent">{a.id}</div>
                    <div className="text-[10px] text-muted truncate">{a.component} · {a.system}</div>
                    <div className="text-[10px] text-muted/60">{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary">Fleet Summary</h2>
              <Link to="/fleet" className="text-[10px] text-accent hover:underline flex items-center gap-1">Full view <ArrowRight size={9} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Subsystems', FLEET_STATS.subsystems],
                ['Suppliers', FLEET_STATS.suppliers],
                ['SBOMs', FLEET_STATS.sboms],
                ['Monitored', '24/7'],
              ].map(([k, v]) => (
                <div key={k} className="bg-bg border border-border rounded-lg p-2.5 text-center">
                  <div style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-lg text-text-primary">{v}</div>
                  <div className="text-[10px] text-muted font-mono">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fleet table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-sm text-text-primary">Aircraft Overview</h2>
          <Link to="/fleet" className="btn-ghost text-xs py-1.5 px-3">View fleet</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] font-mono text-muted uppercase tracking-widest border-b border-border">
                {['Aircraft','Config','Airline','Overall Risk','Affected Subsystems','Status'].map(h => (
                  <th key={h} className="pb-2 pr-4 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {AIRCRAFT.slice(0,6).map(a => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-accent">{a.tail}</td>
                  <td className="py-2.5 pr-4 text-text-dim font-mono">{a.config}</td>
                  <td className="py-2.5 pr-4 text-text-secondary">{a.airline}</td>
                  <td className="py-2.5 pr-4"><span className={`tag-${a.overallRisk}`}>{a.overallRisk}</span></td>
                  <td className="py-2.5 pr-4 font-mono text-text-secondary">{a.affectedSubsystems}</td>
                  <td className="py-2.5"><span className={a.status==='active'?'tag-low':'tag-high'}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
