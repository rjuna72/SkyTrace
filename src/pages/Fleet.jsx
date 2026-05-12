import { useState } from 'react';
import { Plane, CheckCircle, AlertTriangle } from 'lucide-react';
import { AIRCRAFT, SUBSYSTEMS } from '../data/mockData';

const RISK_BORDER = { high:'#e4002b', medium:'#fe5000', low:'#009f4d' };

export default function FleetPage() {
  const [selected, setSelected] = useState(AIRCRAFT[0].id);
  const [compare, setCompare] = useState(false);
  const [compareId, setCompareId] = useState(AIRCRAFT[1].id);
  const ac = AIRCRAFT.find(a => a.id === selected);
  const acB = AIRCRAFT.find(a => a.id === compareId);
  const subs  = SUBSYSTEMS.filter(s => s.aircraftId === selected);
  const subsB = SUBSYSTEMS.filter(s => s.aircraftId === compareId);

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:'#f4f6f9' }}>
      {/* Left panel */}
      <div style={{ width:240, flexShrink:0, borderRight:'1px solid #e8ecf0', background:'#fff', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'2px solid #00205b' }}>
          <div style={{ fontFamily:'Inter Tight, sans-serif', fontWeight:800, fontSize:14, color:'#00205b' }}>Fleet View</div>
          <div style={{ fontSize:11, color:'#6b7c8a', marginTop:2 }}>Select aircraft to inspect</div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {AIRCRAFT.map(a => {
            const active = selected === a.id;
            return (
              <button key={a.id} onClick={() => setSelected(a.id)} style={{
                width:'100%', textAlign:'left', padding:'12px 20px',
                borderBottom:'1px solid #e8ecf0', background: active ? '#f0f5fb' : 'transparent',
                borderLeft: `3px solid ${active ? '#0077c8' : 'transparent'}`,
                cursor:'pointer', transition:'all 0.15s',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background: a.status==='active'?'#009f4d':'#fe5000', flexShrink:0 }} />
                    <span style={{ fontWeight:700, fontSize:13, color: active?'#0077c8':'#00205b', fontFamily:'Inter Tight, sans-serif' }}>{a.tail}</span>
                  </div>
                  <span className={`tag-${a.overallRisk}`}>{a.overallRisk}</span>
                </div>
                <div style={{ fontSize:11, color:'#6b7c8a', marginTop:4, paddingLeft:15 }}>{a.type}</div>
                <div style={{ fontSize:11, color:'#b0bec8', paddingLeft:15 }}>{a.airline} · {a.config}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right detail */}
      <div style={{ flex:1, overflowY:'auto', padding:28 }} className="fade-up">
        {ac && (
          <div style={{ maxWidth:900 }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                  <Plane size={18} color="#0077c8" />
                  <h1 className="page-title">{ac.tail}</h1>
                  <span className={`tag-${ac.status==='active'?'low':'high'}`}>{ac.status}</span>
                  <span className={`tag-${ac.overallRisk}`}>{ac.overallRisk} risk</span>
                </div>
                <div style={{ fontSize:13, color:'#6b7c8a' }}>{ac.airline} · {ac.type} · {ac.config} · MSN {ac.msn}</div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setCompare(!compare)} className={compare?'btn-primary':'btn-secondary'} style={{ fontSize:12 }}>
                  {compare ? 'Exit Compare' : 'Compare Configs'}
                </button>
              </div>
            </div>

            {/* Compare selector */}
            {compare && (
              <div className="card" style={{ marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:13, color:'#6b7c8a', fontWeight:500 }}>Comparing with:</span>
                <select value={compareId} onChange={e => setCompareId(e.target.value)} className="input" style={{ width:220 }}>
                  {AIRCRAFT.filter(a => a.id !== selected).map(a => <option key={a.id} value={a.id}>{a.tail} — {a.config}</option>)}
                </select>
                <span style={{ fontSize:12, color:'#6b7c8a' }}>{ac.tail} vs {acB?.tail}</span>
              </div>
            )}

            {/* Risk summary cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
              {[
                ['Overall Risk', <span className={`tag-${ac.overallRisk}`} style={{ fontSize:14 }}>{ac.overallRisk.toUpperCase()}</span>],
                ['Affected Subsystems', <span style={{ fontSize:22, fontWeight:800, color: ac.overallRisk==='high'?'#e4002b':'#00205b', fontFamily:'Inter Tight, sans-serif' }}>{ac.affectedSubsystems}</span>],
                ['Configuration', <span style={{ fontSize:16, fontWeight:700, color:'#00205b', fontFamily:'Inter Tight, sans-serif' }}>{ac.config}</span>],
              ].map(([label, val]) => (
                <div key={label} className="card" style={{ textAlign:'center' }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#6b7c8a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>{label}</div>
                  {val}
                </div>
              ))}
            </div>

            {/* Subsystems table */}
            <div className="card">
              <div className="section-title">Subsystems & Software</div>
              <table className="ab-table">
                <thead>
                  <tr>
                    {['Subsystem','Supplier','Risk Level','SBOM Status','CVEs','DAL Level', ...(compare?[`${acB?.tail} Risk`, `${acB?.tail} Status`]:[])].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s,i) => {
                    const sc = compare ? subsB[i] : null;
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight:600, color:'#00205b' }}>{s.name}</td>
                        <td style={{ color:'#6b7c8a' }}>{s.supplier}</td>
                        <td><span className={`tag-${s.riskLevel}`}>{s.riskLevel}</span></td>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                            {s.sbomStatus==='Complete'
                              ? <CheckCircle size={12} color="#009f4d" />
                              : <AlertTriangle size={12} color="#fe5000" />}
                            <span style={{ fontSize:12, color: s.sbomStatus==='Complete'?'#009f4d':'#fe5000', fontWeight:500 }}>{s.sbomStatus}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight:700, color: s.vulnerabilities>0?'#e4002b':'#009f4d' }}>{s.vulnerabilities}</td>
                        <td>
                          <span style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:2, border:'1px solid',
                            color: s.dal==='DAL-A'?'#e4002b':s.dal==='DAL-B'?'#fe5000':'#6b7c8a',
                            borderColor: s.dal==='DAL-A'?'#f5b8c4':s.dal==='DAL-B'?'#ffc4aa':'#e8ecf0',
                            background: s.dal==='DAL-A'?'#fde8ec':s.dal==='DAL-B'?'#fff0ea':'#f4f6f9',
                          }}>{s.dal}</span>
                        </td>
                        {compare && sc && (
                          <>
                            <td><span className={`tag-${sc.riskLevel}`}>{sc.riskLevel}</span></td>
                            <td><span style={{ fontSize:12, color: sc.sbomStatus==='Complete'?'#009f4d':'#fe5000', fontWeight:500 }}>{sc.sbomStatus}</span></td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
