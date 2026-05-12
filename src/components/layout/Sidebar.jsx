import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Plane, Package, GitBranch,
  Search, Users, AlertOctagon, FileText, ChevronRight
} from 'lucide-react';
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
    <aside style={{
      width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column',
      height: '100vh', background: '#00205b', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Logo area — mimics Airbus website header */}
      <div style={{ padding: '0 20px', background: '#001640', borderBottom: '1px solid #00306b' }}>
        {/* Airbus wordmark SVG */}
        <div style={{ paddingTop: 16, paddingBottom: 14 }}>
          <svg viewBox="0 0 120 28" width="100" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylised AIRBUS text in white */}
            <text x="0" y="21" fontFamily="Inter Tight, sans-serif" fontWeight="800" fontSize="20"
              fill="white" letterSpacing="-0.5">AIRBUS</text>
          </svg>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
            SkyTrace · FYI 2026
          </div>
        </div>
      </div>

      {/* Cyan accent line — signature Airbus brand element */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, #0077c8, #74d2e7)' }} />

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', textDecoration: 'none', fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#74d2e7' : 'rgba(255,255,255,0.7)',
              background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderLeft: isActive ? '3px solid #0077c8' : '3px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={14} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                <span style={{ flex: 1, lineHeight: 1.3 }}>{label}</span>
                {isActive && <ChevronRight size={11} style={{ opacity: 0.5 }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#001640' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isConnected ? '#009f4d' : '#fe5000', flexShrink: 0 }} />
          {isConnected ? 'Supabase connected' : 'Mock data mode'}
        </div>
      </div>
    </aside>
  );
}
