import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Plane, Package, TrendingUp, ArrowRight, FileCode2 } from 'lucide-react';
import { FLEET_STATS, RISK_BY_SUBSYSTEM, RECENT_ALERTS, AIRCRAFT, VULNERABILITIES } from '../data/mockData';

const RISK_COLORS = { high:'#e4002b', medium:'#fe5000', low:'#009f4d' };

function StatCard({ label, value, sub, color, icon: Icon, linkTo }) {
  return (
    <div className="card" style={{ borderTop: `3px solid ${color || '#0077c8'}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7c8a', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</span>
        {Icon && <Icon size={16} color={color || '#0077c8'} />}
      </div>
      <div style={{ display:'flex', alignItems:'baseline', gap: 6 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: color || '#00205b', fontFamily:'Inter Tight, sans-serif', lineHeight: 1 }}>{value}</span>
        {sub && <span style={{ fontSize: 12, color: '#6b7c8a', fontWeight: 500 }}>{sub}</span>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ height:'100%', overflowY:'auto', padding: 28, background:'#f4f6f9' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
          <div style={{ height: 3, width: 32, background:'#0077c8', borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight:600, color:'#0077c8', textTransform:'uppercase', letterSpacing:'0.1em' }}>Executive Overview</span>
        </div>
        <h1 className="page-title">Fleet Cyber Risk Dashboard</h1>
        <p style={{ fontSize: 13, color:'#6b7c8a', marginTop: 4 }}>Real-time software supply chain visibility across your fleet</p>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Aircraft in Fleet"        value={FLEET_STATS.totalAircraft.toLocaleString()} icon={Plane} color="#00205b" />
        <StatCard label="Critical Vulnerabilities" value={FLEET_STATS.criticalVulns}  color="#e4002b" icon={AlertTriangle} />
        <StatCard label="Affected Configs"         value={FLEET_STATS.affectedConfigs} color="#fe5000" sub="High Risk" />
        <StatCard label="Suppliers Missing SBOMs"  value={FLEET_STATS.missingSuppliers} color="#fe5000" sub="Action Req." />
        <StatCard label="Avg. Response Time"       value={FLEET_STATS.avgResponseDays} sub="days" color="#0077c8" icon={TrendingUp} />
        <StatCard label="Total SBOMs"              value={FLEET_STATS.sboms.toLocaleString()} icon={FileCode2} color="#4298b5" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Risk donut */}
        <div className="card">
          <div className="section-title">Risk by Subsystem</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={RISK_BY_SUBSYSTEM} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" strokeWidth={0}>
                {RISK_BY_SUBSYSTEM.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v,n) => [`${v}%`, n]} contentStyle={{ background:'#fff', border:'1px solid #e8ecf0', borderRadius:3, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap: 8, marginTop: 8 }}>
            {RISK_BY_SUBSYSTEM.map(r => (
              <div key={r.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:13 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <span style={{ width:10, height:10, borderRadius:2, background:r.color, display:'inline-block' }} />
                  <span style={{ color:'#1a2332' }}>{r.name}</span>
                </div>
                <span style={{ fontWeight:700, color:r.color }}>{r.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risks */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom:0 }}>Top Risks</div>
            <Link to="/query" style={{ fontSize:12, color:'#0077c8', textDecoration:'none', display:'flex', alignItems:'center', gap:4, fontWeight:500 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {VULNERABILITIES.slice(0,5).map(v => (
              <div key={v.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f8fafc', border:'1px solid #e8ecf0', borderRadius:3, borderLeft:`3px solid ${RISK_COLORS[v.severity]||'#0077c8'}` }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:12, color:'#00205b', fontFamily:'Inter Tight, sans-serif' }}>{v.id}</div>
                  <div style={{ fontSize:11, color:'#6b7c8a', marginTop:2 }}>{v.component} · CVSS {v.cvss}</div>
                </div>
                <span className={`tag-${v.severity}`}>{v.severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <div className="section-title">Recent Alerts</div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {RECENT_ALERTS.map((a,i) => (
              <div key={i} style={{ padding:'12px 0', borderBottom:'1px solid #e8ecf0', display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:RISK_COLORS[a.severity]||'#0077c8', marginTop:3, flexShrink:0 }} />
                <div>
                  <div style={{ fontWeight:600, fontSize:12, color:'#0077c8' }}>{a.id}</div>
                  <div style={{ fontSize:12, color:'#1a2332', marginTop:1 }}>{a.component}</div>
                  <div style={{ fontSize:11, color:'#6b7c8a', marginTop:1 }}>{a.system}</div>
                  <div style={{ fontSize:11, color:'#b0bec8', marginTop:1 }}>{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet table */}
      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom:0 }}>Aircraft Overview</div>
          <Link to="/fleet"><button className="btn-secondary" style={{ fontSize:12, padding:'6px 14px' }}>View Full Fleet</button></Link>
        </div>
        <table className="ab-table">
          <thead>
            <tr>
              {['Tail Number','Type','Airline','Config','Overall Risk','Affected Subsystems','Status'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AIRCRAFT.slice(0,6).map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight:700, color:'#00205b', fontFamily:'Inter Tight, sans-serif' }}>{a.tail}</td>
                <td style={{ color:'#6b7c8a' }}>{a.type}</td>
                <td>{a.airline}</td>
                <td style={{ color:'#6b7c8a' }}>{a.config}</td>
                <td><span className={`tag-${a.overallRisk}`}>{a.overallRisk}</span></td>
                <td style={{ fontWeight:600, color: a.overallRisk==='high'?'#e4002b':'#1a2332' }}>{a.affectedSubsystems}</td>
                <td><span className={a.status==='active'?'tag-low':'tag-high'}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
