import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GitBranch, AlertTriangle, Info, X } from 'lucide-react';

const TREE_SBOMS = [
  {
    id: 'sbom-001', name: 'ELAC-FW-v4.2.1', supplier: 'Thales', subsystem: 'ELAC',
    components: [
      { id: 'c-001', name: 'elac-core',     version: '4.2.1',  type: 'firmware', license: 'proprietary' },
      { id: 'c-002', name: 'openssl',        version: '1.1.1w', type: 'library',  license: 'Apache-2.0', vuln: 'critical' },
      { id: 'c-003', name: 'freertos',       version: '10.4.3', type: 'rtos',     license: 'MIT' },
      { id: 'c-004', name: 'can-bus-driver', version: '1.4.0',  type: 'driver',   license: 'proprietary' },
      { id: 'c-005', name: 'mbedtls',        version: '2.28.0', type: 'library',  license: 'Apache-2.0' },
      { id: 'c-006', name: 'zlib',           version: '1.2.11', type: 'library',  license: 'zlib', vuln: 'high' },
    ],
    dependencies: [
      { from: 'c-001', to: 'c-002' }, { from: 'c-001', to: 'c-003' },
      { from: 'c-001', to: 'c-004' }, { from: 'c-001', to: 'c-005' },
      { from: 'c-002', to: 'c-006' }, { from: 'c-005', to: 'c-006' },
    ],
  },
  {
    id: 'sbom-002', name: 'FMGS-SW-v8.5.0', supplier: 'Thales', subsystem: 'FMGS',
    components: [
      { id: 'd-001', name: 'fmgs-core',    version: '8.5.0',  type: 'firmware', license: 'proprietary' },
      { id: 'd-002', name: 'openssl',       version: '3.0.7',  type: 'library',  license: 'Apache-2.0', vuln: 'high' },
      { id: 'd-003', name: 'sqlite',        version: '3.39.2', type: 'library',  license: 'public-domain' },
      { id: 'd-004', name: 'boost',         version: '1.80.0', type: 'library',  license: 'BSL-1.0' },
      { id: 'd-005', name: 'arinc-429-lib', version: '3.1.0',  type: 'library',  license: 'proprietary' },
      { id: 'd-006', name: 'nav-database',  version: '2306',   type: 'data',     license: 'proprietary' },
    ],
    dependencies: [
      { from: 'd-001', to: 'd-002' }, { from: 'd-001', to: 'd-003' },
      { from: 'd-001', to: 'd-004' }, { from: 'd-001', to: 'd-005' },
      { from: 'd-001', to: 'd-006' },
    ],
  },
  {
    id: 'sbom-003', name: 'ADIRU-FW-v6.1.2', supplier: 'Honeywell', subsystem: 'ADIRU',
    components: [
      { id: 'e-001', name: 'adiru-core', version: '6.1.2',  type: 'firmware', license: 'proprietary' },
      { id: 'e-002', name: 'openssl',    version: '3.0.7',  type: 'library',  license: 'Apache-2.0' },
      { id: 'e-003', name: 'zlib',       version: '1.2.13', type: 'library',  license: 'zlib' },
      { id: 'e-004', name: 'kalman-lib', version: '2.0.1',  type: 'library',  license: 'MIT' },
      { id: 'e-005', name: 'arinc-664',  version: '1.8.0',  type: 'library',  license: 'proprietary' },
    ],
    dependencies: [
      { from: 'e-001', to: 'e-002' }, { from: 'e-001', to: 'e-003' },
      { from: 'e-001', to: 'e-004' }, { from: 'e-001', to: 'e-005' },
    ],
  },
];

const TYPE_COLORS = {
  firmware: { border: '#00a0dc', text: '#00a0dc', label: 'FIRMWARE' },
  library:  { border: '#8fafd4', text: '#8fafd4', label: 'LIBRARY'  },
  rtos:     { border: '#00d68f', text: '#00d68f', label: 'RTOS'     },
  driver:   { border: '#ffaa00', text: '#ffaa00', label: 'DRIVER'   },
  data:     { border: '#a78bfa', text: '#a78bfa', label: 'DATA'     },
};
const VULN_COLORS = { critical: '#ff3d5a', high: '#ffaa00', medium: '#ffd060' };

function ComponentNode({ data, selected }) {
  const t = TYPE_COLORS[data.type] || TYPE_COLORS.library;
  const vulnColor = data.vuln ? VULN_COLORS[data.vuln] : null;
  const borderColor = selected ? '#00a0dc' : vulnColor ? vulnColor : t.border;

  return (
    <div style={{
      background: vulnColor ? `rgba(${vulnColor === '#ff3d5a' ? '255,61,90' : '255,170,0'},0.08)` : 'rgba(0,36,92,0.95)',
      border: `1.5px solid ${borderColor}`,
      boxShadow: selected
        ? '0 0 0 2px rgba(0,160,220,0.4), 0 8px 24px rgba(0,0,0,0.5)'
        : vulnColor ? `0 0 14px ${vulnColor}44` : '0 4px 16px rgba(0,0,0,0.4)',
      borderRadius: 10,
      padding: '12px 16px',
      minWidth: 155,
      maxWidth: 195,
      cursor: 'pointer',
      fontFamily: 'DM Sans, sans-serif',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: vulnColor || t.text, letterSpacing: '0.1em', marginBottom: 5 }}>
        {data.vuln ? `⚠ ${t.label}` : t.label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f0fb', marginBottom: 3 }}>
        {data.name}
      </div>
      <div style={{ fontSize: 10, color: '#3d6080', fontFamily: 'JetBrains Mono, monospace' }}>
        v{data.version}
      </div>
      {data.vuln && (
        <div style={{
          marginTop: 6, fontSize: 9, fontFamily: 'JetBrains Mono, monospace',
          color: VULN_COLORS[data.vuln],
          background: `${VULN_COLORS[data.vuln]}18`,
          borderRadius: 4, padding: '2px 6px', display: 'inline-block',
        }}>
          CVE · {data.vuln}
        </div>
      )}
      {data.license && (
        <div style={{ marginTop: 4, fontSize: 9, color: '#3d6080', fontFamily: 'JetBrains Mono, monospace' }}>
          {data.license}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { component: ComponentNode };

function buildGraph(sbom) {
  if (!sbom || !sbom.components || !sbom.dependencies) return { nodes: [], edges: [] };

  const depTargets = new Set(sbom.dependencies.map(d => d.to));
  const roots = sbom.components.filter(c => !depTargets.has(c.id));

  const layers = {};
  const visited = new Set();
  const queue = roots.map(c => ({ id: c.id, layer: 0 }));

  while (queue.length) {
    const { id, layer } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    layers[id] = Math.max(layers[id] ?? 0, layer);
    sbom.dependencies.filter(d => d.from === id).forEach(d => queue.push({ id: d.to, layer: layer + 1 }));
  }
  sbom.components.forEach(c => { if (!(c.id in layers)) layers[c.id] = 0; });

  const byLayer = {};
  sbom.components.forEach(c => {
    const l = layers[c.id] ?? 0;
    if (!byLayer[l]) byLayer[l] = [];
    byLayer[l].push(c);
  });

  const NODE_W = 220, NODE_H = 130;
  const layerIdx = {};

  const nodes = sbom.components.map(c => {
    const layer = layers[c.id] ?? 0;
    const layerNodes = byLayer[layer];
    if (!(layer in layerIdx)) layerIdx[layer] = 0;
    const idx = layerIdx[layer]++;
    const totalW = layerNodes.length * NODE_W;
    const x = idx * NODE_W - totalW / 2 + NODE_W / 2;
    const y = layer * NODE_H;
    return {
      id: c.id,
      type: 'component',
      position: { x, y },
      data: { name: c.name, version: c.version, type: c.type, license: c.license, vuln: c.vuln },
    };
  });

  const edges = sbom.dependencies.map(d => ({
    id: `${d.from}-${d.to}`,
    source: d.from,
    target: d.to,
    type: 'smoothstep',
    style: { stroke: '#00306b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00306b', width: 14, height: 14 },
  }));

  return { nodes, edges };
}

export default function TreePage() {
  const [selectedId, setSelectedId] = useState(TREE_SBOMS[0].id);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Rebuild whenever SBOM changes
  useEffect(() => {
    const sbom = TREE_SBOMS.find(s => s.id === selectedId);
    if (!sbom) return;
    const { nodes: n, edges: e } = buildGraph(sbom);
    setNodes(n);
    setEdges(e);
    setSelectedNode(null);
  }, [selectedId, setNodes, setEdges]);

  const onNodeClick = useCallback((_, node) => setSelectedNode(node), []);
  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const sbom = TREE_SBOMS.find(s => s.id === selectedId);
  const vulnCount = sbom?.components.filter(c => c.vuln).length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#00152e' }}>

      {/* Top bar */}
      <div style={{ background: '#001840', borderBottom: '1px solid #00306b', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <GitBranch size={15} color="#00a0dc" />
        <span style={{ fontWeight: 700, fontSize: 14, color: '#e8f0fb' }}>Dependency Graph</span>

        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{ background: '#00205b', border: '1px solid #00306b', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#e8f0fb', outline: 'none', marginLeft: 8 }}
        >
          {TREE_SBOMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#8fafd4', marginLeft: 8 }}>
          <span>Subsystem: <span style={{ color: '#00a0dc' }}>{sbom?.subsystem}</span></span>
          <span>Supplier: <span style={{ color: '#e8f0fb' }}>{sbom?.supplier}</span></span>
          <span>{sbom?.components.length} components · {sbom?.dependencies.length} edges</span>
        </div>

        {vulnCount > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ffaa00', background: 'rgba(255,170,0,0.1)', border: '1px solid rgba(255,170,0,0.25)', borderRadius: 8, padding: '5px 12px' }}>
            <AlertTriangle size={12} />
            {vulnCount} vulnerable component{vulnCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ background: '#001230', borderBottom: '1px solid #00306b', padding: '6px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, flexWrap: 'wrap' }}>
        {Object.entries(TYPE_COLORS).map(([type, c]) => (
          <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: c.text }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, border: `1.5px solid ${c.border}`, background: `${c.border}18`, display: 'inline-block' }} />
            {c.label}
          </span>
        ))}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#ff3d5a', marginLeft: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, border: '1.5px solid #ff3d5a', background: 'rgba(255,61,90,0.15)', display: 'inline-block' }} />
          VULNERABLE
        </span>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#3d6080', marginLeft: 'auto' }}>
          Click a node to inspect · Scroll to zoom · Drag to pan
        </span>
      </div>

      {/* Canvas + side panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.2}
            maxZoom={2.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#00306b" gap={28} size={1} variant="dots" />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={n => n.data?.vuln ? VULN_COLORS[n.data.vuln] : TYPE_COLORS[n.data?.type]?.border || '#8fafd4'}
              maskColor="rgba(0,21,46,0.75)"
              width={150} height={90}
            />
          </ReactFlow>
        </div>

        {/* Node detail panel */}
        {selectedNode && (
          <div style={{ width: 280, borderLeft: '1px solid #00306b', background: '#001840', overflow: 'auto', flexShrink: 0 }} className="fade-up">
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #00306b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#e8f0fb' }}>Component Detail</span>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8fafd4', fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(() => {
                const d = selectedNode.data;
                const t = TYPE_COLORS[d.type] || TYPE_COLORS.library;
                const sbomData = TREE_SBOMS.find(s => s.id === selectedId);
                const depsOut = sbomData?.dependencies.filter(dep => dep.from === selectedNode.id) || [];
                const depsIn  = sbomData?.dependencies.filter(dep => dep.to === selectedNode.id) || [];

                return (
                  <>
                    <div>
                      <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: t.text, letterSpacing: '0.1em', marginBottom: 6 }}>{t.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#e8f0fb' }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: '#3d6080', fontFamily: 'JetBrains Mono', marginTop: 3 }}>v{d.version}</div>
                    </div>

                    {[['License', d.license], ['Type', d.type]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingBottom: 8, borderBottom: '1px solid #00306b' }}>
                        <span style={{ color: '#3d6080', fontFamily: 'JetBrains Mono' }}>{k}</span>
                        <span style={{ color: '#8fafd4', fontFamily: 'JetBrains Mono' }}>{v || '—'}</span>
                      </div>
                    ))}

                    <div>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3d6080', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Depends On</div>
                      {depsOut.length === 0
                        ? <div style={{ fontSize: 11, color: '#3d6080', fontFamily: 'JetBrains Mono' }}>No outgoing deps</div>
                        : depsOut.map(dep => {
                          const target = sbomData?.components.find(c => c.id === dep.to);
                          return target ? (
                            <div key={dep.to} style={{ fontSize: 11, fontFamily: 'JetBrains Mono', padding: '6px 10px', background: '#00205b', border: '1px solid #00306b', borderRadius: 6, marginBottom: 4, color: '#8fafd4' }}>
                              {target.name} <span style={{ color: '#3d6080' }}>v{target.version}</span>
                            </div>
                          ) : null;
                        })
                      }
                    </div>

                    <div>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3d6080', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Required By</div>
                      {depsIn.length === 0
                        ? <div style={{ fontSize: 11, color: '#3d6080', fontFamily: 'JetBrains Mono' }}>Root component</div>
                        : depsIn.map(dep => {
                          const src = sbomData?.components.find(c => c.id === dep.from);
                          return src ? (
                            <div key={dep.from} style={{ fontSize: 11, fontFamily: 'JetBrains Mono', padding: '6px 10px', background: '#00205b', border: '1px solid #00306b', borderRadius: 6, marginBottom: 4, color: '#8fafd4' }}>
                              {src.name} <span style={{ color: '#3d6080' }}>v{src.version}</span>
                            </div>
                          ) : null;
                        })
                      }
                    </div>

                    {d.vuln ? (
                      <div style={{ background: `${VULN_COLORS[d.vuln]}10`, border: `1px solid ${VULN_COLORS[d.vuln]}44`, borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: VULN_COLORS[d.vuln], marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <AlertTriangle size={10} /> VULNERABILITY DETECTED
                        </div>
                        <div style={{ fontSize: 11, color: '#8fafd4' }}>
                          This component version has known {d.vuln}-severity CVEs. Patch recommended.
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.25)', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Info size={12} color="#00d68f" />
                        <span style={{ fontSize: 11, color: '#00d68f' }}>No known vulnerabilities</span>
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
