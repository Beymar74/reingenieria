'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/products', label: 'Productos', icon: '📦' },
  { href: '/dashboard/terceros', label: 'Clientes/Proveed.', icon: '👥' },
  { href: '/dashboard/entradas', label: 'Entradas', icon: '📥' },
  { href: '/dashboard/salidas', label: 'Salidas', icon: '📤' },
  { href: '/dashboard/inventario', label: 'Inventario', icon: '🗃️' },
  { href: '/dashboard/informes', label: 'Informes', icon: '📈' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside style={{
      width: 230, minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '1.5rem 0', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10
    }}>
      <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
          }}>🏪</div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem' }}>JANS</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>Punto de Venta</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.9rem',
              borderRadius: 10, marginBottom: 4, textDecoration: 'none',
              background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text2)',
              fontWeight: active ? 600 : 400, transition: 'all 0.2s',
              border: active ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent'
            }}>
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '0 0.75rem' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.9rem',
          borderRadius: 10, width: '100%', background: 'transparent',
          border: '1px solid var(--border)', color: 'var(--text2)',
          cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem'
        }}>
          <span>🚪</span><span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}