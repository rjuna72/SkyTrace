// ── Master mock data ──────────────────────────────────────────────────────────

export const FLEET_STATS = {
  totalAircraft: 1245, subsystems: 86, suppliers: 156, sboms: 1892,
  criticalVulns: 8, affectedConfigs: 14, missingSuppliers: 3, avgResponseDays: 12,
};

export const RISK_BY_SUBSYSTEM = [
  { name: 'High', value: 24, color: '#ff2d55' },
  { name: 'Medium', value: 50, color: '#ff6b35' },
  { name: 'Low', value: 26, color: '#00e5a0' },
];

export const AIRCRAFT = [
  { id: 'ac-001', tail: 'F-WXYZ', type: 'A320neo', airline: 'Air France', msn: '7842', status: 'active', config: 'Config A', overallRisk: 'medium', affectedSubsystems: '4/12' },
  { id: 'ac-002', tail: 'D-AIAB', type: 'A320neo', airline: 'Lufthansa', msn: '7901', status: 'active', config: 'Config B', overallRisk: 'high', affectedSubsystems: '6/12' },
  { id: 'ac-003', tail: 'G-EZAB', type: 'A321neo', airline: 'easyJet',   msn: '8012', status: 'grounded', config: 'Config A', overallRisk: 'low', affectedSubsystems: '1/12' },
  { id: 'ac-004', tail: 'EC-MXV', type: 'A350-1000', airline: 'Iberia',  msn: '8234', status: 'active', config: 'Config A', overallRisk: 'low', affectedSubsystems: '2/12' },
  { id: 'ac-005', tail: 'OE-LBX', type: 'A330neo', airline: 'Austrian',  msn: '8456', status: 'active', config: 'Config A', overallRisk: 'medium', affectedSubsystems: '3/12' },
  { id: 'ac-006', tail: 'EI-DEO', type: 'A320neo', airline: 'Aer Lingus', msn: '8567', status: 'active', config: 'Config B', overallRisk: 'high', affectedSubsystems: '5/12' },
  { id: 'ac-007', tail: 'CS-TNV', type: 'A321neo', airline: 'TAP Air',   msn: '8678', status: 'active', config: 'Config A', overallRisk: 'low', affectedSubsystems: '1/12' },
  { id: 'ac-008', tail: 'PH-BXA', type: 'A330neo', airline: 'KLM',       msn: '8789', status: 'active', config: 'Config A', overallRisk: 'medium', affectedSubsystems: '3/12' },
];

export const RECENT_ALERTS = [
  { id: 'CVE-2024-3094', component: 'OpenSSL', system: 'Flight Management System', date: '09 May 2026', severity: 'critical' },
  { id: 'CVE-2024-26809', component: 'Linux Kernel', system: 'Avionics Display System', date: '08 May 2026', severity: 'high' },
  { id: 'SBOM Update', component: 'Supplier B', system: 'Communications System', date: '07 May 2026', severity: 'medium' },
];

export const SUBSYSTEMS = [
  { id: 'ss-001', name: 'Flight Management System', aircraftId: 'ac-001', supplier: 'Supplier A', riskLevel: 'high', sbomStatus: 'Complete', vulnerabilities: 3, dal: 'DAL-A' },
  { id: 'ss-002', name: 'Avionics Display System',  aircraftId: 'ac-001', supplier: 'Supplier B', riskLevel: 'medium', sbomStatus: 'Complete', vulnerabilities: 2, dal: 'DAL-B' },
  { id: 'ss-003', name: 'Communications System',    aircraftId: 'ac-001', supplier: 'Supplier C', riskLevel: 'low', sbomStatus: 'Partial', vulnerabilities: 1, dal: 'DAL-C' },
  { id: 'ss-004', name: 'Navigation System',        aircraftId: 'ac-001', supplier: 'Supplier A', riskLevel: 'high', sbomStatus: 'Complete', vulnerabilities: 2, dal: 'DAL-A' },
  { id: 'ss-005', name: 'Cabin Management System',  aircraftId: 'ac-001', supplier: 'Supplier D', riskLevel: 'low', sbomStatus: 'Complete', vulnerabilities: 0, dal: 'DAL-D' },
  { id: 'ss-006', name: 'Landing Gear System',      aircraftId: 'ac-001', supplier: 'Supplier E', riskLevel: 'low', sbomStatus: 'Complete', vulnerabilities: 0, dal: 'DAL-C' },
  { id: 'ss-007', name: 'Flight Management System', aircraftId: 'ac-002', supplier: 'Supplier A', riskLevel: 'high', sbomStatus: 'Complete', vulnerabilities: 4, dal: 'DAL-A' },
  { id: 'ss-008', name: 'Avionics Display System',  aircraftId: 'ac-002', supplier: 'Supplier B', riskLevel: 'medium', sbomStatus: 'Complete', vulnerabilities: 2, dal: 'DAL-B' },
];

export const SBOMS = [
  { id: 'sbom-001', name: 'SBOM-001', subsystemId: 'ss-001', supplier: 'Supplier A', system: 'Flight Management System', version: 'v4.2.1', format: 'SPDX',      verificationStatus: 'Verified Externally', lastUpdated: '09 May 2026', completeness: 95, componentCount: 47 },
  { id: 'sbom-002', name: 'SBOM-002', subsystemId: 'ss-002', supplier: 'Supplier B', system: 'Avionics Display System',  version: 'v2.8.0', format: 'CycloneDX',  verificationStatus: 'Verified Externally', lastUpdated: '07 May 2026', completeness: 88, componentCount: 112 },
  { id: 'sbom-003', name: 'SBOM-003', subsystemId: 'ss-003', supplier: 'Supplier C', system: 'Communications System',    version: 'v3.1.4', format: 'SPDX',      verificationStatus: 'Verified Externally', lastUpdated: '06 May 2026', completeness: 72, componentCount: 38 },
  { id: 'sbom-004', name: 'SBOM-004', subsystemId: 'ss-004', supplier: 'Supplier D', system: 'Cabin Management System',  version: 'v1.6.0', format: 'CycloneDX',  verificationStatus: 'Verified Externally', lastUpdated: '05 May 2026', completeness: 68, componentCount: 29 },
  { id: 'sbom-005', name: 'SBOM-005', subsystemId: 'ss-005', supplier: 'Supplier E', system: 'Navigation System',        version: 'v5.0.0', format: 'CycloneDX',  verificationStatus: 'Verified Externally', lastUpdated: '04 May 2026', completeness: 92, componentCount: 61 },
];

export const SBOM_SUMMARY = { total: 1892, complete: 1512, partial: 312, incomplete: 68 };

export const VULNERABILITIES = [
  { id: 'CVE-2024-3094',  component: 'openssl',      version: '1.1.1w', affectedVersions: ['1.1.1t','1.1.1w','3.0.7'], severity: 'critical', cvss: 9.8, aerospaceScore: 6.2, aerospaceLevel: 'Medium', type: 'Use-after-free', description: 'Use-after-free vulnerability in OpenSSL. Allows remote code execution via crafted certificate.', published: '03 May 2026', affectedConfigs: 14, affectedSubsystems: 2, activeInstallations: 28, riskPriority: 'Immediate', isComponentActive: true, isNetworkExposed: false, hasRedundancy: true, operationalImpact: 'Medium' },
  { id: 'CVE-2024-26809', component: 'linux-kernel', version: '5.15.0',  affectedVersions: ['5.15.0','5.10.0'],         severity: 'high',     cvss: 7.8, aerospaceScore: 5.1, aerospaceLevel: 'Medium', type: 'Privilege Escalation', description: 'Linux kernel privilege escalation via netfilter.', published: '08 May 2026', affectedConfigs: 8, affectedSubsystems: 3, activeInstallations: 18, riskPriority: 'High', isComponentActive: true, isNetworkExposed: false, hasRedundancy: true, operationalImpact: 'Low' },
  { id: 'CVE-2024-12345', component: 'zlib',         version: '1.2.11',  affectedVersions: ['1.2.11','1.2.12'],         severity: 'medium',   cvss: 5.5, aerospaceScore: 3.2, aerospaceLevel: 'Low',    type: 'Buffer Overflow', description: 'Heap buffer overflow in zlib inflate function.', published: '01 May 2026', affectedConfigs: 4, affectedSubsystems: 1, activeInstallations: 9, riskPriority: 'Plan', isComponentActive: true, isNetworkExposed: false, hasRedundancy: false, operationalImpact: 'Low' },
  { id: 'CVE-2024-67890', component: 'busybox',      version: '1.35.0',  affectedVersions: ['1.35.0'],                  severity: 'low',      cvss: 3.1, aerospaceScore: 1.8, aerospaceLevel: 'Low',    type: 'Command Injection', description: 'Command injection in BusyBox shell.', published: '28 Apr 2026', affectedConfigs: 2, affectedSubsystems: 1, activeInstallations: 4, riskPriority: 'Monitor', isComponentActive: false, isNetworkExposed: false, hasRedundancy: true, operationalImpact: 'Low' },
  { id: 'CVE-2024-04321', component: 'libxml2',      version: '2.9.14',  affectedVersions: ['2.9.14'],                  severity: 'medium',   cvss: 6.1, aerospaceScore: 4.0, aerospaceLevel: 'Medium', type: 'XXE Injection', description: 'XML External Entity injection in libxml2.', published: '25 Apr 2026', affectedConfigs: 6, affectedSubsystems: 2, activeInstallations: 14, riskPriority: 'Plan', isComponentActive: true, isNetworkExposed: false, hasRedundancy: true, operationalImpact: 'Medium' },
];

export const SUPPLIERS = [
  { id: 'sup-001', name: 'Supplier A', tier: 'Tier 1', compliance: 95, updateFreq: 'Monthly',   avgResponse: 6,  score: 92, trend: 'up',   systems: ['Flight Management System', 'Navigation System'] },
  { id: 'sup-002', name: 'Supplier B', tier: 'Tier 1', compliance: 72, updateFreq: 'Quarterly', avgResponse: 18, score: 68, trend: 'down', systems: ['Avionics Display System'] },
  { id: 'sup-003', name: 'Supplier C', tier: 'Tier 2', compliance: 45, updateFreq: 'Irregular', avgResponse: 32, score: 38, trend: 'down', systems: ['Communications System'] },
  { id: 'sup-004', name: 'Supplier D', tier: 'Tier 2', compliance: 80, updateFreq: 'Monthly',   avgResponse: 10, score: 80, trend: 'up',   systems: ['Cabin Management System'] },
  { id: 'sup-005', name: 'Supplier E', tier: 'Tier 2', compliance: 60, updateFreq: 'Quarterly', avgResponse: 25, score: 55, trend: 'flat', systems: ['Landing Gear System'] },
];

export const INCIDENTS = [
  {
    id: 'INC-2026-0507', title: 'Navigation display anomaly - Config B',
    aircraft: 'A320neo – Config B', reported: '07 May 2026 10:15',
    status: 'Investigating', severity: 'medium',
    relatedSystems: ['Avionics Display System', 'Flight Management System', 'Communications System'],
    timeline: [
      { date: '01 May 2026', event: 'Supplier B submitted updated SBOM' },
      { date: '03 May 2026', event: 'CVE-2024-3094 published (OpenSSL)' },
      { date: '05 May 2026', event: 'Similar anomaly reported on 2 aircraft' },
      { date: '07 May 2026', event: 'Investigation started' },
    ],
    path: ['Avionics Display SW', 'Shared Libraries', 'OpenSSL', 'CVE-2024-3094'],
  },
];

export const GRAPH_NODES = [
  { id: 'n-ac',   label: 'A320neo',              type: 'aircraft',  x: 60,  y: 180 },
  { id: 'n-fms',  label: 'Flight Management\nSystem', type: 'subsystem', x: 220, y: 100 },
  { id: 'n-ads',  label: 'Avionics Display\nSystem', type: 'subsystem', x: 220, y: 260 },
  { id: 'n-sup',  label: 'LibNav\nv2.3.0',        type: 'supplier',  x: 420, y: 100 },
  { id: 'n-sup2', label: 'NaviStar\nv4.3.1',      type: 'supplier',  x: 420, y: 260 },
  { id: 'n-ssl',  label: 'OpenSSL\n1.1.1w',       type: 'vuln',      x: 620, y: 180 },
  { id: 'n-zlib', label: 'zlib\nv1.2.13',         type: 'component', x: 620, y: 320 },
];

export const GRAPH_EDGES = [
  { from: 'n-ac', to: 'n-fms' }, { from: 'n-ac', to: 'n-ads' },
  { from: 'n-fms', to: 'n-sup' }, { from: 'n-ads', to: 'n-sup2' },
  { from: 'n-sup', to: 'n-ssl' }, { from: 'n-sup2', to: 'n-ssl' },
  { from: 'n-ssl', to: 'n-zlib' },
];

export function getImpactForCVE(cveId) {
  const vuln = VULNERABILITIES.find(v => v.id === cveId);
  if (!vuln) return null;
  const affected = SBOMS.filter(s =>
    s.system.toLowerCase().includes('flight') || s.system.toLowerCase().includes('avionics')
  ).map(s => ({
    sbom: s,
    subsystem: SUBSYSTEMS.find(ss => ss.id === s.subsystemId),
    aircraft: AIRCRAFT[0],
    component: { name: vuln.component, version: vuln.version },
  }));
  return { vuln, affected };
}

export function parseCycloneDX(json) {
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const components = (data.components || []).map((c, i) => ({
      id: `upload-c-${i}`, name: c.name, version: c.version || 'unknown',
      type: c.type || 'library', license: c.licenses?.[0]?.license?.id || 'unknown',
    }));
    return {
      name: data.metadata?.component?.name || 'Uploaded SBOM',
      version: data.metadata?.component?.version || '1.0.0',
      format: 'CycloneDX', components,
      dependencies: (data.dependencies || []).flatMap(dep =>
        (dep.dependsOn || []).map(d2 => ({ from: dep.ref, to: d2 }))
      ),
    };
  } catch { return null; }
}
