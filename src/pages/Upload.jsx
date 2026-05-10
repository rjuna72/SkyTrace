import { useState, useCallback } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, X, Package } from 'lucide-react';
import { parseCycloneDX } from '../data/mockData';

const SAMPLE_SBOM = {
  bomFormat: "CycloneDX",
  specVersion: "1.4",
  metadata: {
    component: { name: "sample-avionics-fw", version: "2.1.0" }
  },
  components: [
    { name: "openssl", version: "1.1.1t", type: "library", licenses: [{ license: { id: "Apache-2.0" } }] },
    { name: "zlib", version: "1.2.11", type: "library", licenses: [{ license: { id: "zlib" } }] },
    { name: "freertos", version: "10.4.3", type: "library", licenses: [{ license: { id: "MIT" } }] },
    { name: "lwip", version: "2.1.3", type: "library", licenses: [{ license: { id: "BSD-3-Clause" } }] },
  ],
  dependencies: [
    { ref: "sample-avionics-fw@2.1.0", dependsOn: ["openssl@1.1.1t", "freertos@10.4.3"] },
    { ref: "openssl@1.1.1t", dependsOn: ["zlib@1.2.11"] },
  ]
};

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [subsystem, setSubsystem] = useState('');
  const [aircraft, setAircraft] = useState('');

  const handleFile = useCallback((file) => {
    setError(null); setParsed(null);
    if (!file.name.endsWith('.json')) {
      setError('Only CycloneDX JSON files are supported right now.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const result = parseCycloneDX(e.target.result);
      if (!result) setError('Could not parse file. Make sure it is valid CycloneDX JSON.');
      else setParsed(result);
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const loadSample = () => {
    const result = parseCycloneDX(SAMPLE_SBOM);
    setParsed(result); setError(null);
  };

  const handleSubmit = () => {
    if (!subsystem || !aircraft) { setError('Please select a subsystem and aircraft.'); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="p-8 max-w-2xl mx-auto fade-up">
      <div className="card text-center py-16">
        <CheckCircle size={48} className="text-success mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-text-primary mb-2">SBOM Ingested</h2>
        <p className="text-text-secondary text-sm mb-6">
          <span className="font-mono text-accent">{parsed?.name}</span> has been validated,
          stored, and linked to {aircraft} / {subsystem}.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setParsed(null); setSubmitted(false); setSubsystem(''); setAircraft(''); }} className="btn-ghost">
            Upload another
          </button>
          <a href="/tree" className="btn-primary">View dependency tree →</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto fade-up overflow-y-auto h-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">Upload SBOM</h1>
        <p className="text-text-secondary text-sm mt-1">Ingest a CycloneDX or SPDX bill of materials from a supplier</p>
      </div>

      {!parsed ? (
        <>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
              ${dragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40 hover:bg-white/[0.02]'}`}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input" type="file" accept=".json"
              className="hidden"
              onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
            />
            <Upload size={32} className={`mx-auto mb-3 ${dragging ? 'text-accent' : 'text-muted'}`} />
            <p className="text-text-primary font-display font-semibold">Drop CycloneDX JSON here</p>
            <p className="text-text-dim text-sm mt-1">or click to browse</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="tag-info">CycloneDX</span>
              <span className="tag-info">SPDX</span>
              <span className="text-xs text-muted">· JSON format</span>
            </div>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted font-mono">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={loadSample} className="btn-ghost w-full flex items-center justify-center gap-2">
            <FileJson size={14} /> Load sample CycloneDX SBOM
          </button>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4 fade-up">
          {/* Parsed result */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={14} className="text-success" />
                  <span className="text-success text-sm font-mono">Validated</span>
                </div>
                <h2 className="font-display font-bold text-text-primary">{parsed.name}</h2>
                <p className="text-xs text-muted font-mono mt-0.5">v{parsed.version} · {parsed.format}</p>
              </div>
              <button onClick={() => { setParsed(null); setError(null); }} className="text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-bg rounded-lg px-3 py-3 border border-border text-center">
                <div className="font-display font-bold text-xl text-accent">{parsed.components.length}</div>
                <div className="text-[10px] text-muted font-mono mt-0.5">Components</div>
              </div>
              <div className="bg-bg rounded-lg px-3 py-3 border border-border text-center">
                <div className="font-display font-bold text-xl text-text-primary">{parsed.dependencies.length}</div>
                <div className="text-[10px] text-muted font-mono mt-0.5">Dependencies</div>
              </div>
              <div className="bg-bg rounded-lg px-3 py-3 border border-border text-center">
                <div className="font-display font-bold text-xl text-text-primary">{parsed.format}</div>
                <div className="text-[10px] text-muted font-mono mt-0.5">Format</div>
              </div>
            </div>
          </div>

          {/* Component list */}
          <div className="card">
            <h3 className="font-display font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
              <Package size={14} className="text-muted" /> Components
            </h3>
            <div className="space-y-1.5">
              {parsed.components.map(c => (
                <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg border border-border text-xs">
                  <span className="font-mono text-text-primary">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted">v{c.version}</span>
                    <span className="tag-info">{c.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapping */}
          <div className="card">
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4">Link to Aircraft</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted font-mono mb-1.5 block">Subsystem</label>
                <select value={subsystem} onChange={e => setSubsystem(e.target.value)} className="input">
                  <option value="">Select subsystem…</option>
                  <option>ELAC</option><option>FMGS</option><option>ADIRU</option>
                  <option>ACARS</option><option>FWC</option><option>LGCIU</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted font-mono mb-1.5 block">Aircraft</label>
                <select value={aircraft} onChange={e => setAircraft(e.target.value)} className="input">
                  <option value="">Select aircraft…</option>
                  <option>F-WXYZ (Air France)</option>
                  <option>D-AIAB (Lufthansa)</option>
                  <option>G-EZAB (easyJet)</option>
                  <option>EC-MXV (Iberia)</option>
                </select>
              </div>
            </div>
            {error && (
              <div className="mt-3 text-danger text-xs flex items-center gap-1.5">
                <AlertCircle size={12} />{error}
              </div>
            )}
            <button onClick={handleSubmit} className="btn-primary mt-4 w-full">
              Ingest SBOM →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
