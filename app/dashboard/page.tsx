'use client';
import { useEffect, useState } from 'react';

interface Stats {
  productos: number;
  terceros: number;
  entradas_hoy: number;
  monto_entradas: number;
  salidas_hoy: number;
  monto_salidas: number;
  stock_bajo: any[];
}

function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '1.5rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -10, right: -10, fontSize: '3.5rem', opacity: 0.07
      }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{icon}</div>
      <div style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Syne', color }}>{value}</div>
      {sub && <div style={{ color: 'var(--text2)', fontSize: '0.8rem', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setStats);
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="animate-fade">
      <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>
        {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {!stats ? (
        <div style={{ color: 'var(--text2)' }}>Cargando...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard icon="📦" label="Productos Activos" value={stats.productos} color="var(--accent)" />
            <StatCard icon="👥" label="Clientes/Proveedores" value={stats.terceros} color="#43e97b" />
            <StatCard icon="📥" label="Entradas Hoy" value={stats.entradas_hoy} sub={fmt(stats.monto_entradas)} color="#ffa726" />
            <StatCard icon="📤" label="Salidas Hoy" value={stats.salidas_hoy} sub={fmt(stats.monto_salidas)} color="var(--accent2)" />
          </div>

          {stats.stock_bajo.length > 0 && (
            <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: 16, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Syne', marginBottom: '1rem', color: 'var(--accent2)' }}>⚠️ Stock Bajo</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['ID', 'Producto', 'Marca', 'Stock'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.stock_bajo.map(p => (
                    <tr key={p.id_producto} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: 'var(--text2)' }}>{p.id_producto}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{p.nombre_producto}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text2)' }}>{p.marca || '-'}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span style={{
                          background: 'rgba(255,70,70,0.15)', color: '#ff6666',
                          padding: '2px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700
                        }}>{p.stock}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}