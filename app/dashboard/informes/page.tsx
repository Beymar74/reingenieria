'use client';
import { useEffect, useState } from 'react';

type Tab = 'general' | 'inventario' | 'ventas' | 'compras' | 'utilidad';

export default function InformesPage() {
  const hoy = new Date().toISOString().slice(0, 10);
  const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

  const [desde, setDesde] = useState(primerDiaMes);
  const [hasta, setHasta] = useState(hoy);
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState<Tab>('general');

  const load = () => fetch(`/api/informes?desde=${desde}&hasta=${hasta}`).then(r => r.json()).then(setData);
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n));

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'general', label: 'General', icon: '📊' },
    { key: 'inventario', label: 'Inventario', icon: '🗃️' },
    { key: 'ventas', label: 'Consulta Ventas', icon: '📤' },
    { key: 'compras', label: 'Consulta Compras', icon: '📥' },
    { key: 'utilidad', label: 'Consulta Utilidad', icon: '💹' },
  ];

  const maxDia = data ? Math.max(...data.porDia.map((d: any) => Math.max(Number(d.monto_entradas), Number(d.monto_salidas))), 1) : 1;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Informes</h1>
          <p style={{ color: 'var(--text2)', margin: '4px 0 0' }}>Análisis de movimientos</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input className="input-field" type="date" value={desde} onChange={e => setDesde(e.target.value)} style={{ width: 150 }} />
          <span style={{ color: 'var(--text2)' }}>—</span>
          <input className="input-field" type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={{ width: 150 }} />
          <button className="btn-primary" onClick={load}>Filtrar</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontFamily: 'Syne',
            fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6,
            background: tab === t.key ? 'var(--accent)' : 'var(--surface)',
            color: tab === t.key ? 'white' : 'var(--text2)',
            border: tab === t.key ? 'none' : '1px solid var(--border)',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {!data ? <div style={{ color: 'var(--text2)' }}>Cargando...</div> : (
        <>
          {/* GENERAL */}
          {tab === 'general' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total Compras', value: fmt(data.resumen.entradas.monto), sub: `${data.resumen.entradas.cantidad} facturas`, color: '#ffa726', icon: '📥' },
                  { label: 'Total Ventas', value: fmt(data.resumen.salidas.monto), sub: `${data.resumen.salidas.cantidad} facturas`, color: '#43e97b', icon: '📤' },
                  { label: 'Utilidad', value: fmt(data.resumen.utilidad), sub: data.resumen.utilidad >= 0 ? '✅ Positiva' : '❌ Negativa', color: data.resumen.utilidad >= 0 ? '#43e97b' : '#ff6666', icon: '💹' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ color: 'var(--text2)', fontSize: '0.8rem', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: s.color }}>{s.value}</div>
                    <div style={{ color: 'var(--text2)', fontSize: '0.8rem', marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Syne', marginBottom: '1.5rem' }}>Movimientos por Día</h3>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 160, overflowX: 'auto', paddingBottom: 8 }}>
                  {data.porDia.map((d: any, i: number) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 32 }}>
                      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                        <div style={{ width: 12, background: '#ffa726', borderRadius: '3px 3px 0 0', height: `${(Number(d.monto_entradas) / maxDia) * 120}px`, minHeight: 2 }} />
                        <div style={{ width: 12, background: '#43e97b', borderRadius: '3px 3px 0 0', height: `${(Number(d.monto_salidas) / maxDia) * 120}px`, minHeight: 2 }} />
                      </div>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text2)', transform: 'rotate(-45deg)', marginTop: 4 }}>
                        {new Date(d.dia).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text2)' }}><div style={{ width: 12, height: 12, background: '#ffa726', borderRadius: 2 }} /> Compras</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text2)' }}><div style={{ width: 12, height: 12, background: '#43e97b', borderRadius: 2 }} /> Ventas</div>
                </div>
              </div>
            </>
          )}

          {/* INVENTARIO */}
          {tab === 'inventario' && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    {['ID Producto', 'Nombre Producto', 'Entradas', 'Salidas', 'Saldo'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.inventario.map((r: any) => (
                    <tr key={r.id_producto} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)', fontSize: '0.85rem' }}>{r.id_producto}</td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>{r.nombre_producto}</td>
                      <td style={{ padding: '0.7rem 1rem', color: '#ffa726', fontWeight: 600 }}>{r.entradas}</td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--accent2)', fontWeight: 600 }}>{r.salidas}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <span style={{ background: r.saldo < 5 ? 'rgba(255,70,70,0.15)' : 'rgba(67,233,123,0.1)', color: r.saldo < 5 ? '#ff6666' : '#43e97b', padding: '2px 10px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>{r.saldo}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VENTAS */}
          {tab === 'ventas' && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    {['ID Producto', 'Nombre Producto', 'Unidades', 'Valor Venta'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.ventas.map((r: any) => (
                    <tr key={r.id_producto} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)', fontSize: '0.85rem' }}>{r.id_producto}</td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>{r.nombre_producto}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{r.unidades}</td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: '#43e97b' }}>{fmt(r.valor_venta)}</td>
                    </tr>
                  ))}
                  {data.ventas.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>Sin ventas en el período</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* COMPRAS */}
          {tab === 'compras' && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    {['ID Producto', 'Nombre Producto', 'Unidades', 'Valor Compra'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.compras.map((r: any) => (
                    <tr key={r.id_producto} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)', fontSize: '0.85rem' }}>{r.id_producto}</td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>{r.nombre_producto}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{r.unidades}</td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: '#ffa726' }}>{fmt(r.valor_compra)}</td>
                    </tr>
                  ))}
                  {data.compras.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>Sin compras en el período</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* UTILIDAD */}
          {tab === 'utilidad' && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                    {['ID Producto', 'Nombre Producto', 'Ventas', 'Compras', 'Utilidad'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.utilidad.map((r: any) => (
                    <tr key={r.id_producto} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)', fontSize: '0.85rem' }}>{r.id_producto}</td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>{r.nombre_producto}</td>
                      <td style={{ padding: '0.7rem 1rem', color: '#43e97b', fontWeight: 600 }}>{fmt(r.ventas)}</td>
                      <td style={{ padding: '0.7rem 1rem', color: '#ffa726', fontWeight: 600 }}>{fmt(r.compras)}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <span style={{ color: Number(r.utilidad) >= 0 ? '#43e97b' : '#ff6666', fontWeight: 700, fontSize: '0.95rem' }}>{fmt(r.utilidad)}</span>
                      </td>
                    </tr>
                  ))}
                  {data.utilidad.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>Sin datos en el período</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}