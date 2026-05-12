import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f4f6f9', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top header bar — Airbus style */}
        <div style={{ background: '#ffffff', borderBottom: '2px solid #e8ecf0', padding: '0 28px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#009f4d' }} />
            <span style={{ fontSize: 12, color: '#6b7c8a', fontWeight: 500 }}>Live · Aerospace SBOM Intelligence Platform</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#6b7c8a' }}>Airbus Fly Your Ideas 2026 · Round 2</span>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#00205b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>AJ</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
