import { useState } from 'react';
import { Search, AlertTriangle, Plane, Cpu, Package, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { VULNERABILITIES, getImpactForCVE } from '../data/mockData';

function GaugeArc({ score, max=10 }) {
  const pct = score/max;
  const color = pct>0.7?'#e4002b':pct>0.4?'#fe5000':'#009f4d';
  const r=44, cx=60, cy=58, circ=Math.PI*r, offset=circ*(1-pct);
  return (
    <svg width="120" height="70" viewBox="0 0 120 70">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#e8ecf0" strokeWidth="9" strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 0.8s ease'}}/>
      <text x={cx} y={cy-6} textAnchor="middle" fill={color} fontSize="18" fontWeight="800" fontFamily="Inter Tight,sans-serif">{score}</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill="#6b7c8a" fontSize="9" fontFamily="Inter,sans-serif">AEROSPACE</text>
    </svg>
  );
}

export default function VulnPage() {
  const [sel, setSel] = useState(VULNERABILITIES[0]);
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState({});
  const filtered = VULNERABILITIES.filter(v => !q || v.id.toLowerCase().includes(q.toLowerCase()) || v.component.toLowerCase().includes(q.toLowerCase()));
  const impact = getImpactForCVE(sel?.id);

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:'#f4f6f9' }}>
      {/* Left */}
      <div style={{ width:280, flexShrink:0, borderRight:'1px solid #e8ecf0', background:'#fff', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px 20px', borderBottom:'2px solid #00205b' }}>
          <div style={{ fontFamily:'Inter Tight, sans-serif', fontWeight:800, fontSize:14, color:'#00205b' }}>Vulnerability Intelligence</div>
          <div style={{ fontSize:11, color:'#6b7c8a', marginTop:2 }}>Aircraft-contextual risk assessment</div>
          <div style={{ position:'relative', marginTop:12 }}>
            <Search size={13} color="#b0bec8" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }} />
            <input className="input" style={{ paddingLeft:32 }} placeholder="CVE ID or component…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {filtered.map(v => (
            <button key={v.id} onClick={()=>setSel(v)} style={{
              width:'100%', textAlign:'left', padding:'12px 20px',
              borderBottom:'1px solid #e8ecf0', cursor:'pointer',
              background: sel?.id===v.id?'#f0f5fb':'transparent',
              borderLeft:`3px solid ${sel?.id===v.id?'#0077c8':'transparent'}`,
              transition:'all 0.15s',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontWeight:700, fontSize:12, color:'#00205b', fontFamily:'Inter Tight, sans-serif' }}>{v.id}</span>
                <span className={`tag-${v.severity}`}>{v.severity}</span>
              </div>
              <div style={{ fontSize:11, color:'#6b7c8a' }}>{v.component} · v{v.version}</div>
              <div style={{ fontSize:11, color:'#b0bec8', marginTop:2 }}>CVSS {v.cvss} · {v.published}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      {sel && (
        <div style={{ flex:1, overflowY:'auto', padding:28 }} className="fade-up">
          <div style={{ maxWidth:860 }}>
            {/* CVE header */}
            <div className="card" style={{ borderLeft:`4px solid ${sel.severity==='critical'?'#e4002b':sel.severity==='high'?'#fe5000':'#fe5000'}`, marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <span style={{ fontFamily:'Inter Tight, sans-serif', fontWeight:800, fontSize:20, color:'#00205b' }}>{sel.id}</span>
                    <span className={`tag-${sel.severity}`}>{sel.severity.toUpperCase()}</span>
                    <span style={{ fontSize:12, color:'#6b7c8a', fontWeight:500 }}>CVSS Base: {sel.cvss}</span>
                  </div>
                  <p style={{ fontSize:13, color:'#1a2332', lineHeight:1.5, margin:0 }}>{sel.description}</p>
                  <div style={{ display:'flex', gap:20, marginTop:10, fontSize:12, color:'#6b7c8a' }}>
                    <span>Component: <strong style={{ color:'#0077c8' }}>{sel.component} v{sel.version}</strong></span>
                    <span>Type: {sel.type}</span>
                    <span>Published: {sel.published}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
              {/* Impact summary */}
              <div className="card">
                <div className="section-title">Aircraft Impact Summary</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {[
                    ['Affected Configurations', sel.affectedConfigs, '#e4002b'],
                    ['Affected Subsystems', sel.affectedSubsystems, '#fe5000'],
                    ['Active Installations', sel.activeInstallations, '#fe5000'],
                    ['Risk Priority', sel.riskPriority, sel.riskPriority==='Immediate'?'#e4002b':'#0077c8'],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ background:'#f4f6f9', borderRadius:3, padding:'12px 14px', borderLeft:`3px solid ${color}` }}>
                      <div style={{ fontSize:11, color:'#6b7c8a', fontWeight:500, marginBottom:4 }}>{label}</div>
                      <div style={{ fontFamily:'Inter Tight, sans-serif', fontWeight:800, fontSize:20, color }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aerospace rescoring */}
              <div className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <div className="section-title" style={{ marginBottom:0 }}>Contextual Risk Assessment</div>
                  <span style={{ fontSize:11, fontWeight:600, color:'#0077c8', background:'#e8f2fa', padding:'3px 8px', borderRadius:2 }}>Re-scored</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      ['Component installed?', sel.isComponentActive],
                      ['Network exposed?',     sel.isNetworkExposed],
                      ['Redundancy available?',sel.hasRedundancy],
                      ['Operational impact',   sel.operationalImpact],
                    ].map(([q2,a]) => (
                      <div key={q2} style={{ display:'flex', justifyContent:'space-between', fontSize:12, paddingBottom:6, borderBottom:'1px solid #e8ecf0' }}>
                        <span style={{ color:'#6b7c8a' }}>{q2}</span>
                        <span style={{ fontWeight:600, color: typeof a==='boolean'?(a?'#009f4d':'#e4002b'):'#1a2332' }}>
                          {typeof a==='boolean'?(a?'Yes':'No'):a}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <GaugeArc score={sel.aerospaceScore} />
                    <div style={{ fontFamily:'Inter Tight, sans-serif', fontWeight:700, fontSize:13, color:'#00205b', marginTop:4 }}>{sel.aerospaceLevel}</div>
                    <div style={{ fontSize:10, color:'#6b7c8a' }}>vs CVSS {sel.cvss} Base</div>
                  </div>
                </div>
                <div style={{ marginTop:12, fontSize:12, color:'#6b7c8a', background:'#f4f6f9', borderRadius:3, padding:'8px 12px', borderLeft:'3px solid #0077c8' }}>
                  💡 Plan remediation for next scheduled maintenance window.
                </div>
              </div>
            </div>

            {/* Affected assets */}
            {impact?.affected.length > 0 && (
              <div className="card">
                <div className="section-title">Affected Aircraft</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {impact.affected.map((a,i) => (
                    <div key={i} style={{ border:'1px solid #f5b8c4', borderRadius:3, background:'#fde8ec', overflow:'hidden' }}>
                      <button onClick={()=>setExpanded(e=>({...e,[i]:!e[i]}))} style={{
                        width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
                        background:'none', border:'none', cursor:'pointer', textAlign:'left',
                      }}>
                        <Plane size={14} color="#e4002b" />
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13, color:'#00205b', fontFamily:'Inter Tight, sans-serif' }}>{a.aircraft?.tail}</div>
                          <div style={{ fontSize:11, color:'#6b7c8a' }}>{a.aircraft?.airline} · {a.subsystem?.name}</div>
                        </div>
                        <div style={{ fontSize:11, color:'#6b7c8a' }}>{a.sbom?.name}</div>
                        {expanded[i] ? <ChevronDown size={13} color="#6b7c8a" /> : <ChevronRight size={13} color="#6b7c8a" />}
                      </button>
                      {expanded[i] && (
                        <div style={{ padding:'0 16px 16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                          {[[Plane,'Aircraft',a.aircraft?.tail,a.aircraft?.status],[Cpu,'Subsystem',a.subsystem?.name,a.subsystem?.supplier],[Package,'Component',a.component?.name,`v${a.component?.version}`]].map(([Icon,label,val,sub]) => (
                            <div key={label} style={{ background:'#fff', border:'1px solid #e8ecf0', borderRadius:3, padding:'10px 12px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#6b7c8a', marginBottom:6 }}>
                                <Icon size={11} /> {label}
                              </div>
                              <div style={{ fontWeight:700, fontSize:12, color:'#00205b' }}>{val}</div>
                              <div style={{ fontSize:11, color:'#6b7c8a' }}>{sub}</div>
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
        </div>
      )}
    </div>
  );
}
