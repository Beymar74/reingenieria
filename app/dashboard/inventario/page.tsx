'use client';
import { useEffect, useState } from 'react';

interface Item {
  id_producto: string; nombre_producto: string; marca?: string;
  precio_compra: number; precio_venta: number; stock: number;
  estado: boolean; total_entradas: number; total_salidas: number;
  utilidad_unitaria: number; margen_pct: number;
}

export default function InventarioPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => { fetch('/api/inventario').then(r => r.json()).then(setItems); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  const filtered = items.filter(i => {
    const matchSearch = i.nombre_producto.toLowerCase().includes(search.toLowerCase()) || i.id_producto.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === 'TODOS' || (filtro === 'BAJO' && i.stock < 5) || (filtro === 'ACTIVO' && i.estado) || (filtro === 'INACTIVO' && !i.estado);
    return matchSearch && matchFiltro;
  });

  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const valorInventario = items.reduce((s, i) => s + i.stock * Number(i.precio_compra), 0);
  const valorVenta = items.reduce((s, i) => s + i.stock * Number(i.precio_venta), 0);
  const utilidadPotencial = valorVenta - valorInventario;

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Inventario</h1>
        <p style={{ color: 'var(--text2)', margin: '4px 0 0' }}>Estado actual del stock</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Unidades', value: totalStock.toLocaleString(), icon: '📦', color: 'var(--accent)' },
          { label: 'Valor Compra', value: fmt(valorInventario), icon: '💰', color: '#ffa726' },
          { label: 'Valor Venta', value: fmt(valorVenta), icon: '🏷️', color: '#43e97b' },
          { label: 'Utilidad Potencial', value: fmt(utilidadPotencial), icon: '📈', color: 'var(--accent2)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.2rem' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.8rem', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input className="input-field" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
        <select className="input-field" value={filtro} onChange={e => setFiltro(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="TODOS">Todos</option>
          <option value="BAJO">Stock Bajo (&lt;5)</option>
          <option value="ACTIVO">Activos</option>
          <option value="INACTIVO">Inactivos</option>
        </select>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              {['ID', 'Producto', 'Marca', 'P. Compra', 'P. Venta', 'Margen', 'Entradas', 'Salidas', 'Stock', 'Estado'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i.id_producto} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.7rem 1rem', fontSize: '0.85rem', color: 'var(--text2)' }}>{i.id_producto}</td>
                <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>{i.nombre_producto}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)' }}>{i.marca || '-'}</td>
                <td style={{ padding: '0.7rem 1rem', fontSize: '0.85rem' }}>{fmt(i.precio_compra)}</td>
                <td style={{ padding: '0.7rem 1rem', fontSize: '0.85rem', color: '#43e97b' }}>{fmt(i.precio_venta)}</td>
                <td style={{ padding: '0.7rem 1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: Number(i.margen_pct) > 30 ? '#43e97b' : '#ffa726', fontWeight: 600 }}>{i.margen_pct}%</span>
                </td>
                <td style={{ padding: '0.7rem 1rem', textAlign: 'center' }}>{i.total_entradas}</td>
                <td style={{ padding: '0.7rem 1rem', textAlign: 'center' }}>{i.total_salidas}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span style={{
                    background: i.stock < 5 ? 'rgba(255,70,70,0.15)' : i.stock < 10 ? 'rgba(255,167,38,0.15)' : 'rgba(67,233,123,0.1)',
                    color: i.stock < 5 ? '#ff6666' : i.stock < 10 ? '#ffa726' : '#43e97b',
                    padding: '2px 10px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700
                  }}>{i.stock}</span>
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span className={i.estado ? 'badge-active' : 'badge-inactive'}>{i.estado ? 'Activo' : 'Inactivo'}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>No hay productos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}