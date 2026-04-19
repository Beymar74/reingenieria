'use client';
import { useEffect, useState } from 'react';

interface Producto {
  id_producto: string; nombre_producto: string; marca?: string;
  precio_compra: number; precio_venta: number; estado: boolean; stock: number;
}

const empty = (): Partial<Producto> => ({ id_producto: '', nombre_producto: '', marca: '', precio_compra: 0, precio_venta: 0, estado: true, stock: 0 });

export default function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState<Partial<Producto>>(empty());
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/products').then(r => r.json()).then(setProductos);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty()); setModal(true); };
  const openEdit = (p: Producto) => { setEditing(p); setForm({ ...p }); setModal(true); };

  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  async function handleSave() {
    const url = editing ? `/api/products/${editing.id_producto}` : '/api/products';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setModal(false); load(); setMsg('Guardado exitosamente'); setTimeout(() => setMsg(''), 3000); }
    else setMsg(data.error);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    load();
  }

  const filtered = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(search.toLowerCase()) ||
    p.id_producto.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Productos</h1>
          <p style={{ color: 'var(--text2)', margin: '4px 0 0' }}>{productos.length} productos registrados</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ Nuevo Producto</button>
      </div>

      {msg && <div style={{ background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 8, padding: '0.7rem 1rem', marginBottom: '1rem', color: '#43e97b' }}>{msg}</div>}

      <div style={{ marginBottom: '1rem' }}>
        <input className="input-field" placeholder="🔍 Buscar por nombre o ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 380 }} />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              {['ID', 'Nombre', 'Marca', 'P. Compra', 'P. Venta', 'Stock', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id_producto} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.7rem 1rem', fontSize: '0.85rem', color: 'var(--text2)' }}>{p.id_producto}</td>
                <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>{p.nombre_producto}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)' }}>{p.marca || '-'}</td>
                <td style={{ padding: '0.7rem 1rem' }}>{fmt(p.precio_compra)}</td>
                <td style={{ padding: '0.7rem 1rem', color: '#43e97b', fontWeight: 600 }}>{fmt(p.precio_venta)}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span style={{ background: p.stock < 5 ? 'rgba(255,70,70,0.15)' : 'rgba(67,233,123,0.1)', color: p.stock < 5 ? '#ff6666' : '#43e97b', padding: '2px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>{p.stock}</span>
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span className={p.estado ? 'badge-active' : 'badge-inactive'}>{p.estado ? 'Activo' : 'Inactivo'}</span>
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-secondary" onClick={() => openEdit(p)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>✏️</button>
                    <button className="btn-danger" onClick={() => handleDelete(p.id_producto)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>No hay productos</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Syne', marginBottom: '1.5rem' }}>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {!editing && (
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>ID Producto *</label>
                  <input className="input-field" value={form.id_producto} onChange={e => setForm({ ...form, id_producto: e.target.value })} />
                </div>
              )}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Nombre *</label>
                <input className="input-field" value={form.nombre_producto} onChange={e => setForm({ ...form, nombre_producto: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Marca</label>
                <input className="input-field" value={form.marca || ''} onChange={e => setForm({ ...form, marca: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Stock</label>
                <input className="input-field" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Precio Compra *</label>
                <input className="input-field" type="number" value={form.precio_compra} onChange={e => setForm({ ...form, precio_compra: Number(e.target.value) })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Precio Venta *</label>
                <input className="input-field" type="number" value={form.precio_venta} onChange={e => setForm({ ...form, precio_venta: Number(e.target.value) })} />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="estado" checked={form.estado} onChange={e => setForm({ ...form, estado: e.target.checked })} />
                <label htmlFor="estado" style={{ fontSize: '0.9rem' }}>Activo</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
