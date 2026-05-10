import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, GitBranch, Plane, Search, ShieldAlert, ChevronRight, Package, Users, FileText, AlertOctagon } from 'lucide-react';
import { isConnected } from '../../lib/supabase';

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/fleet',       icon: Plane,           label: 'Fleet View' },
  { to: '/repository',  icon: Package,         label: 'SBOM Repository' },
  { to: '/tree',        icon: GitBranch,       label: 'Dependency Graph' },
  { to: '/query',       icon: Search,          label: 'Vulnerability Intel' },
  { to: '/suppliers',   icon: Users,           label: 'Supplier Compliance' },
  { to: '/incidents',   icon: AlertOctagon,    label: 'Incident Investigation' },
  { to: '/reports',     icon: FileText,        label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-border bg-surface h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <ShieldAlert size={13} className="text-accent" />
          </div>
          <div>
            <div style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-sm text-text-primary tracking-tight">SkyTrace</div>
            <div className="text-[10px] text-muted font-mono">Airbus FYI 2026</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={14} className={isActive ? 'text-accent' : 'text-muted group-hover:text-text-secondary'} />
                <span className="flex-1 text-sm">{label}</span>
                {isActive && <ChevronRight size={11} className="text-accent/50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success' : 'bg-warn'}`} />
          <span className="text-muted">{isConnected ? 'Supabase live' : 'Mock data'}</span>
        </div>
      </div>
    </aside>
  );
}
