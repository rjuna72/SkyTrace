import { useState, useMemo, useCallback } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  MarkerType, Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { SBOMS, SUBSYSTEMS, VULNERABILITIES } from '../data/mockData';
import { GitBranch, AlertTriangle, Info } from 'lucide-react';

const TYPE_COLORS = {
  firmware:  { bg: '#00d4ff22', border: '#00d4ff55', text: '#00d4ff', label: 'FIRMWARE' },
  library:   { bg: '#8899bb22', border: '#8899bb55', text: '#8899bb', label: 'LIBRARY' },
  rtos:      { bg: '#00e5a022', border: '#00e5a055', text: '#00e5a0', label: 'RTOS' },
  driver:    { bg: '#ff6b3522', border: '#ff6b3555', text: '#ff6b35', label: 'DRIVER' },
  data:      { bg: '#f5a80022', border: '#f5a80055', text: '#f5a800', label: 'DATA' },
  default:   { bg: '#4a587822', border: '#4a587855', text: '#4a5878', label: 'COMPONENT' },
};

// Check if a component has any known CVEs
function getVulnSeverity(name, version) {
  for (const v of VULNERABILITIES) {
    if (v.component === name && v.affectedVersions?.includes(version)) return v.severity;
  }
  return null;
}

function ComponentNode({ data, selected }) {
  const t = TYPE_COLORS[data.type] || TYPE_COLORS.default;
  const vulnSev = getVulnSeverity(data.name, data.version);
  const sevColors = { critical: '#ff2d55', high: '#ff6b35', medium: '#f5a800', low: '#00e5a0' };

  return (
    <div style={{
      background: vulnSev ? `${sevColors[vulnSev]}18` : t.bg,
      border: `1.5px solid ${vulnSev ? sevColors[vulnSev] + '88' : (selected ? '#00d4ff' : t.border)}`,
      boxShadow: selected ? `0 0 0 2px #00d4ff44, 0 8px 24px #00000066`
        : vulnSev ? `0 0 12px ${sevColors[vulnSev]}33`
        : `0 4px 12px #00000044`,
      borderRadius: 12,
      padding: '12px 16px',
      minWidth: 160,
      maxWidth: 200,
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: vulnSev ? sevColors[vulnSev] : t.text, marginBottom: 6, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
        {vulnSev && '⚠ '}{t.label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e8edf8', marginBottom: 3, fontFamily: 'Syne, sans-serif' }}>
        {data.name}
      </div>
      <div style={{ fontSize: 10, color: '#4a5878', fontFamily: 'JetBrains Mono, monospace' }}>
        v{data.version}
      </div>
      {vulnSev && (
        <div style={{ marginTop: 6, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: sevColors[vulnSev], background: sevColors[vulnSev] + '18', borderRadius: 4, padding: '2px 6px', display: 'inline-block' }}>
          CVE · {vulnSev}
        </div>
      )}
      {data.license && (
        <div style={{ marginTop: 4, fontSize: 9, color: '#4a5878', fontFamily: 'JetBrains Mono, monospace' }}>
          {data.license}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { component: ComponentNode };

function buildGraph(sbom) {
  if (!sbom) return { nodes: [], edges: [] };

  // Determine root nodes (not depended upon by anything)
  const depTargets = new Set(sbom.dependencies.map(d => d.to));
  const roots = sbom.components.filter(c => !depTargets.has(c.id)).map(c => c.id);

  // BFS to assign layers
  const layers = {};
  const queue = roots.map(id => ({ id, layer: 0 }));
  const visited = new Set();
  while (queue.length) {
    const { id, layer } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    layers[id] = Math.max(layers[id] ?? 0, layer);
    sbom.dependencies.filter(d => d.from === id).forEach(d => queue.push({ id: d.to, layer: layer + 1 }));
  }
  // Any orphans
  sbom.components.forEach(c => { if (!(c.id in layers)) layers[c.id] = 0; });

  // Group by layer
  const byLayer = {};
  sbom.components.forEach(c => {
    const l = layers[c.id] ?? 0;
    if (!byLayer[l]) byLayer[l] = [];
    byLayer[l].push(c);
  });

  const NODE_W = 220, NODE_H = 140, H_GAP = 60, V_GAP = 80;

  const nodes = sbom.components.map(c => {
    const layer = layers[c.id] ?? 0;
    const layerNodes = byLayer[layer];
    const idx = layerNodes.indexOf(c);
    const totalW = layerNodes.length * NODE_W + (layerNodes.length - 1) * H_GAP;
    const x = idx * (NODE_W + H_GAP) - totalW / 2 + NODE_W / 2;
    const y = layer * (NODE_H + V_GAP);
    return {
      id: c.id,
      type: 'component',
      position: { x, y },
      data: { name: c.name, version: c.version, type: c.type, license: c.license },
    };
  });

  const edges = sbom.dependencies.map(d => ({
    id: `${d.from}-${d.to}`,
    source: d.from,
    target: d.to,
    type: 'smoothstep',
    style: { stroke: '#2a3a58', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2a3a58', width: 16, height: 16 },
    animated: false,
  }));

  return { nodes, edges };
}

export default function TreePage() {
  const [selectedSbomId, setSelectedSbomId] = useState(SBOMS[0].id);
  const [selectedNode, setSelectedNode] = useState(null);

  const sbom = SBOMS.find(s => s.id === selectedSbomId);
  const subsystem = SUBSYSTEMS.find(s => s.id === sbom?.subsystemId);

  const { nodes: initNodes, edges: initEdges } = useMemo(() => buildGraph(sbom), [sbom]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  // Rebuild when sbom changes
  useMemo(() => {
    const { nodes: n, edges: e } = buildGraph(sbom);
    setNodes(n); setEdges(e); setSelectedNode(null);
  }, [selectedSbomId]);

  const onNodeClick = useCallback((_, node) => setSelectedNode(node), []);
  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const vulnNodes = nodes.filter(n => getVulnSeverity(n.data.name, n.data.version));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="px-5 py-3.5 border-b border-border flex items-center gap-4 shrink-0 bg-surface">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-accent" />
          <span className="font-display font-bold text-text-primary text-sm">Dependency Tree</span>
        </div>

        <select
          value={selectedSbomId}
          onChange={e => setSelectedSbomId(e.target.value)}
          className="input w-60 text-xs ml-2"
        >
          {SBOMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <div className="flex items-center gap-4 text-[11px] font-mono text-muted ml-2">
          {subsystem && <span>Subsystem: <span className="text-accent">{subsystem.name}</span></span>}
          <span>Supplier: <span className="text-text-secondary">{sbom?.supplier}</span></span>
          <span>{sbom?.components.length} components</span>
          <span>{sbom?.dependencies.length} edges</span>
        </div>

        {vulnNodes.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-warn bg-warn/10 border border-warn/20 rounded-lg px-3 py-1.5">
            <AlertTriangle size={12} />
            {vulnNodes.length} vulnerable component{vulnNodes.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-5 py-2 border-b border-border/50 flex items-center gap-4 text-[10px] font-mono shrink-0 bg-bg/50">
        {Object.entries(TYPE_COLORS).filter(([k]) => k !== 'default').map(([type, c]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border" style={{ background: c.bg, borderColor: c.border }} />
            <span style={{ color: c.text }}>{c.label}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-2">
          <span className="w-2.5 h-2.5 rounded-sm border" style={{ background: '#ff2d5518', borderColor: '#ff2d5588' }} />
          <span style={{ color: '#ff2d55' }}>VULNERABLE</span>
        </span>
      </div>

      {/* Main area: flow + info panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* ReactFlow — full height */}
        <div className="flex-1 overflow-hidden" style={{ height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.2}
            maxZoom={2.5}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ type: 'smoothstep' }}
          >
            <Background color="#1a2438" gap={28} size={1} variant="dots" />
            <Controls
              style={{ background: '#0e1521', border: '1px solid #1a2438', borderRadius: 8, bottom: 16, left: 16 }}
              showInteractive={false}
            />
            <MiniMap
              nodeColor={n => {
                const sev = getVulnSeverity(n.data?.name, n.data?.version);
                if (sev) return sev === 'critical' ? '#ff2d55' : '#ff6b35';
                return TYPE_COLORS[n.data?.type]?.text || '#4a5878';
              }}
              style={{ background: '#0e1521', border: '1px solid #1a2438', borderRadius: 8, bottom: 16, right: selectedNode ? 296 : 16 }}
              maskColor="rgba(8,12,20,0.75)"
              width={160}
              height={100}
            />
          </ReactFlow>
        </div>

        {/* Node detail panel */}
        {selectedNode && (
          <div className="w-72 border-l border-border bg-surface overflow-y-auto shrink-0 fade-up">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="font-display font-bold text-sm text-text-primary">Component Detail</span>
              <button onClick={() => setSelectedNode(null)} className="text-muted hover:text-text-primary text-lg leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              {(() => {
                const d = selectedNode.data;
                const t = TYPE_COLORS[d.type] || TYPE_COLORS.default;
                const vulnSev = getVulnSeverity(d.name, d.version);
                const vulns = VULNERABILITIES.filter(v => v.component === d.name && v.affectedVersions?.includes(d.version));

                return (
                  <>
                    <div>
                      <div className="text-[10px] font-mono mb-1" style={{ color: t.text }}>{t.label}</div>
                      <div className="font-display font-bold text-xl text-text-primary">{d.name}</div>
                      <div className="font-mono text-xs text-muted mt-1">v{d.version}</div>
                    </div>

                    <div className="space-y-2">
                      {[['License', d.license], ['Type', d.type]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs py-1.5 border-b border-border/50">
                          <span className="text-muted font-mono">{k}</span>
                          <span className="text-text-secondary font-mono">{v || '—'}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dependencies */}
                    <div>
                      <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Depends on</div>
                      <div className="space-y-1">
                        {sbom?.dependencies.filter(dep => dep.from === selectedNode.id).map(dep => {
                          const target = sbom.components.find(c => c.id === dep.to);
                          return target ? (
                            <div key={dep.to} className="text-xs font-mono px-2.5 py-1.5 bg-bg border border-border rounded-lg text-text-secondary">
                              {target.name} <span className="text-muted">v{target.version}</span>
                            </div>
                          ) : null;
                        })}
                        {!sbom?.dependencies.filter(dep => dep.from === selectedNode.id).length && (
                          <div className="text-xs text-muted font-mono">No outgoing dependencies</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">Required by</div>
                      <div className="space-y-1">
                        {sbom?.dependencies.filter(dep => dep.to === selectedNode.id).map(dep => {
                          const src = sbom.components.find(c => c.id === dep.from);
                          return src ? (
                            <div key={dep.from} className="text-xs font-mono px-2.5 py-1.5 bg-bg border border-border rounded-lg text-text-secondary">
                              {src.name} <span className="text-muted">v{src.version}</span>
                            </div>
                          ) : null;
                        })}
                        {!sbom?.dependencies.filter(dep => dep.to === selectedNode.id).length && (
                          <div className="text-xs text-muted font-mono">Root component</div>
                        )}
                      </div>
                    </div>

                    {/* Vulnerabilities */}
                    {vulns.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono text-danger uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <AlertTriangle size={10} /> Vulnerabilities
                        </div>
                        <div className="space-y-2">
                          {vulns.map(v => (
                            <div key={v.id} className="px-3 py-2.5 bg-danger/5 border border-danger/20 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs text-danger font-bold">{v.id}</span>
                                <span className={`tag-${v.severity}`}>{v.severity}</span>
                              </div>
                              <div className="text-[11px] text-text-secondary leading-relaxed">{v.description.slice(0, 100)}…</div>
                              <div className="text-[10px] text-muted font-mono mt-1.5">CVSS {v.cvss} · {v.published}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!vulnSev && (
                      <div className="flex items-center gap-2 text-xs text-success bg-success/8 border border-success/20 rounded-lg px-3 py-2">
                        <Info size={12} /> No known vulnerabilities
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
