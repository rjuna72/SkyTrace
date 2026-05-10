export default function StatCard({ label, value, sub, accent, icon: Icon }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs text-text-dim font-mono uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <Icon size={13} className="text-muted" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span
          className="text-3xl font-display font-bold leading-none"
          style={{ color: accent || '#e8edf8' }}
        >
          {value}
        </span>
        {sub && <span className="text-xs text-text-dim mb-0.5 font-mono">{sub}</span>}
      </div>
    </div>
  );
}
