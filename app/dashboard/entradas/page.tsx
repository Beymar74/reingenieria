'use client';
import { useEffect, useState } from 'react';

interface Detalle { id_producto_entrada: string; nombre_producto: string; costo_unitario_entrada: number; unidades_entradas: number; }
interface Entrada { numero_entrada: string; fecha: string; proveedor: string; nombre_proveedor?: string; total: number; }
interface Producto { id_producto: string; nombre_producto: string; precio_compra: number; }
interface Tercero { id_tercero: string; nombre_tercero: string; tipo: string; }

export default function EntradasPage() {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Tercero[]>([]);
  const [modal, setModal] = useState(false);
  const [detalleModal, setDetalleModal] = useState<{ entry: Entrada; rows: any[] } | null>(null);
  const [form, setForm] = useState({ numero_entrada: '', fecha: new Date().toISOString().slice(0,10), proveedor: '' });
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/entradas').then(r => r.json()).then(setEntradas);
  useEffect(() => {
    load();
    fetch('/api/products').then(r => r.json()).then(setProductos);
    fetch('/api/terceros').then(r => r.json()).then(d => setProveedores(d.filter((t: Tercero) => t.tipo !== 'CLIENTE')));
  }, []);

  const addDetalle = () => setDetalles([...detalles, { id_producto_entrada: '', nombre_producto: '', costo_unitario_entrada: 0, unidades_entradas: 1 }]);
  const removeDetalle = (i: number) => setDetalles(detalles.filter((_, idx) => idx !== i));
  const updateDetalle = (i: number, field: string, value: any) => {
    const copy = [...detalles];
    copy[i] = { ...copy[i], [field]: value };
    if (field === 'id_producto_entrada') {
      const prod = productos.find(p => p.id_producto === value);
      if (prod) { copy[i].nombre_producto = prod.nombre_producto; copy[i].costo_unitario_entrada = prod.precio_compra; }
    }
    setDetalles(copy);
  };

  const totalCalc = detalles.reduce((s, d) => s + d.costo_unitario_entrada * d.unidades_entradas, 0);
  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  async function handleSave() {
    if (!form.numero_entrada || !form.proveedor || detalles.length === 0) { setMsg('Complete todos los campos'); return; }
    const res = await fetch('/api/entradas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, detalles }) });
    const data = await res.json();
    if (res.ok) { setModal(false); load(); setMsg('Entrada registrada'); setTimeout(() => setMsg(''), 3000); setDetalles([]); }
    else setMsg(data.error);
  }

  async function verDetalle(entry: Entrada) {
    const rows = await fetch(`/api/entradas/${entry.numero_entrada}`).then(r => r.json());
    setDetalleModal({ entry, rows });
  }

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Entradas</h1>
          <p style={{ color: 'var(--text2)', margin: '4px 0 0' }}>Registro de compras / entradas de inventario</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({ numero_entrada: `ENT-${Date.now()}`, fecha: new Date().toISOString().slice(0,10), proveedor: '' }); setDetalles([]); setModal(true); }}>+ Nueva Entrada</button>
      </div>

      {msg && <div style={{ background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 8, padding: '0.7rem 1rem', marginBottom: '1rem', color: '#43e97b' }}>{msg}</div>}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              {['# Entrada', 'Fecha', 'Proveedor', 'Total', 'Detalle'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entradas.map(e => (
              <tr key={e.numero_entrada} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--accent)' }}>{e.numero_entrada}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)' }}>{new Date(e.fecha).toLocaleDateString('es-CO')}</td>
                <td style={{ padding: '0.7rem 1rem' }}>{e.nombre_proveedor || e.proveedor}</td>
                <td style={{ padding: '0.7rem 1rem', fontWeight: 600 }}>{fmt(e.total)}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <button className="btn-secondary" onClick={() => verDetalle(e)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>👁️ Ver</button>
                </td>
              </tr>
            ))}
            {entradas.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>No hay entradas registradas</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal nueva entrada */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Syne', marginBottom: '1.5rem' }}>Nueva Entrada</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}># Entrada</label>
                <input className="input-field" value={form.numero_entrada} onChange={e => setForm({ ...form, numero_entrada: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Fecha</label>
                <input className="input-field" type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Proveedor</label>
                <select className="input-field" value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {proveedores.map(p => <option key={p.id_tercero} value={p.id_tercero}>{p.nombre_tercero}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: '1rem', margin: 0 }}>Productos</h3>
              <button className="btn-secondary" onClick={addDetalle} style={{ fontSize: '0.85rem' }}>+ Agregar</button>
            </div>
            {detalles.map((d, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                <select className="input-field" value={d.id_producto_entrada} onChange={e => updateDetalle(i, 'id_producto_entrada', e.target.value)} style={{ fontSize: '0.85rem' }}>
                  <option value="">Producto...</option>
                  {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre_producto}</option>)}
                </select>
                <input className="input-field" type="number" placeholder="Costo unit." value={d.costo_unitario_entrada} onChange={e => updateDetalle(i, 'costo_unitario_entrada', Number(e.target.value))} style={{ fontSize: '0.85rem' }} />
                <input className="input-field" type="number" min="1" placeholder="Unidades" value={d.unidades_entradas} onChange={e => updateDetalle(i, 'unidades_entradas', Number(e.target.value))} style={{ fontSize: '0.85rem' }} />
                <button className="btn-danger" onClick={() => removeDetalle(i)} style={{ padding: '6px 10px' }}>✕</button>
              </div>
            ))}
            {detalles.length === 0 && <p style={{ color: 'var(--text2)', fontSize: '0.9rem', margin: '0.5rem 0 1rem' }}>Agrega productos a la entrada</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>Total: {fmt(totalCalc)}</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                <button className="btn-primary" onClick={handleSave}>Registrar Entrada</button>
              </div>
            </div>
            {msg && <p style={{ color: '#ff6666', marginTop: 8, fontSize: '0.85rem' }}>{msg}</p>}
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {detalleModal && (
        <div className="modal-overlay" onClick={() => setDetalleModal(null)}>
          <div className="modal-box" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Syne', marginBottom: 4 }}>Detalle: {detalleModal.entry.numero_entrada}</h2>
            <p style={{ color: 'var(--text2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{detalleModal.entry.nombre_proveedor} — {new Date(detalleModal.entry.fecha).toLocaleDateString('es-CO')}</p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Producto', 'Costo Unit.', 'Unidades', 'Subtotal'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text2)', fontSize: '0.8rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detalleModal.rows.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.6rem 0.5rem' }}>{r.nombre_producto}</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>{fmt(r.costo_unitario_entrada)}</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>{r.unidades_entradas}</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{fmt(r.sub_total_e)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', marginTop: '1rem', fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>Total: {fmt(detalleModal.entry.total)}</div>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className="btn-secondary" onClick={() => setDetalleModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
