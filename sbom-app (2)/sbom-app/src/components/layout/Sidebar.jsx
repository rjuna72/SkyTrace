import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, GitBranch, Plane, Search, ShieldAlert, ChevronRight, Package, Users, FileText, AlertOctagon } from 'lucide-react';
import { isConnected } from '../../lib/supabase';

const NAV = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/fleet',      icon: Plane,           label: 'Fleet View' },
  { to: '/repository', icon: Package,         label: 'SBOM Repository' },
  { to: '/tree',       icon: GitBranch,       label: 'Dependency Graph' },
  { to: '/query',      icon: Search,          label: 'Vulnerability Intel' },
  { to: '/suppliers',  icon: Users,           label: 'Supplier Compliance' },
  { to: '/incidents',  icon: AlertOctagon,    label: 'Incident Investigation' },
  { to: '/reports',    icon: FileText,        label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside style={{ width: 210, background: '#001840', borderRight: '1px solid #00306b', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '16px', borderBottom: '1px solid #00306b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,160,220,0.12)', border: '1px solid rgba(0,160,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={15} color="#00a0dc" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#e8f0fb', letterSpacing: '-0.01em' }}>SkyTrace</div>
            <div style={{ fontSize: 9, color: '#3d6080', fontFamily: 'JetBrains Mono, monospace', marginTop: 1 }}>AIRBUS FYI 2026</div>
          </div>
        </div>
      </div>

      {/* Airbus brand bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #00205b, #00a0dc, #ffffff22)' }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 13, transition: 'all 0.15s',
              background: isActive ? 'rgba(0,160,220,0.12)' : 'transparent',
              color: isActive ? '#00a0dc' : '#8fafd4',
              border: isActive ? '1px solid rgba(0,160,220,0.25)' : '1px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={14} color={isActive ? '#00a0dc' : '#3d6080'} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={11} color="rgba(0,160,220,0.5)" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #00306b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#3d6080' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isConnected ? '#00d68f' : '#ffaa00', flexShrink: 0 }} />
          {isConnected ? 'Supabase live' : 'Mock data mode'}
        </div>
        <div style={{ fontSize: 9, color: '#3d6080', fontFamily: 'JetBrains Mono, monospace', marginTop: 4, opacity: 0.6 }}>
          Round 2 Prototype · May 2026
        </div>
      </div>
    </aside>
  );
}
