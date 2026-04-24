'use client';
import { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Tercero {
  id_tercero: string; nombre_tercero: string; telefono?: string;
  correo?: string; direccion?: string; tipo: string; estado: boolean;
}

const empty = (): Partial<Tercero> => ({ id_tercero: '', nombre_tercero: '', telefono: '', correo: '', direccion: '', tipo: 'CLIENTE', estado: true });

export default function TercerosPage() {
  const [terceros, setTerceros] = useState<Tercero[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Tercero | null>(null);
  const [form, setForm] = useState<Partial<Tercero>>(empty());
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/terceros').then(r => r.json()).then(setTerceros);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty()); setModal(true); };
  const openEdit = (t: Tercero) => { setEditing(t); setForm({ ...t }); setModal(true); };

  async function handleSave() {
    const url = editing ? `/api/terceros/${editing.id_tercero}` : '/api/terceros';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setModal(false); load(); setMsg('Guardado exitosamente'); setTimeout(() => setMsg(''), 3000); }
    else setMsg(data.error);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este tercero?')) return;
    const res = await fetch(`/api/terceros/${id}`, { method: 'DELETE' });
    if (res.ok) load(); else setMsg('No se puede eliminar, tiene registros asociados');
  }

  const filtered = terceros.filter(t =>
    (filtroTipo === 'TODOS' || t.tipo === filtroTipo) &&
    (t.nombre_tercero.toLowerCase().includes(search.toLowerCase()) || t.id_tercero.toLowerCase().includes(search.toLowerCase()))
  );

  const tipoColor: any = { 'CLIENTE': '#43e97b', 'PROVEEDOR': '#ffa726', 'CLIENTE/PROVEEDOR': 'var(--accent)' };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Clientes / Proveedores</h1>
          <p style={{ color: 'var(--text2)', margin: '4px 0 0' }}>{terceros.length} registros</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ Nuevo</button>
      </div>

      {msg && <div style={{ background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 8, padding: '0.7rem 1rem', marginBottom: '1rem', color: '#43e97b' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input className="input-field" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        <select className="input-field" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="TODOS">Todos</option>
          <option value="CLIENTE">Clientes</option>
          <option value="PROVEEDOR">Proveedores</option>
          <option value="CLIENTE/PROVEEDOR">Ambos</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              {['ID', 'Nombre', 'Teléfono', 'Correo', 'Tipo', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id_tercero} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.7rem 1rem', fontSize: '0.85rem', color: 'var(--text2)' }}>{t.id_tercero}</td>
                <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>{t.nombre_tercero}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)' }}>{t.telefono || '-'}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text2)', fontSize: '0.85rem' }}>{t.correo || '-'}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span style={{ background: `${tipoColor[t.tipo]}22`, color: tipoColor[t.tipo], padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{t.tipo}</span>
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span className={t.estado ? 'badge-active' : 'badge-inactive'}>{t.estado ? 'Activo' : 'Inactivo'}</span>
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-secondary" onClick={() => openEdit(t)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Edit2 size={16} /></button>
                    <button className="btn-danger" onClick={() => handleDelete(t.id_tercero)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>No hay registros</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Syne', marginBottom: '1.5rem' }}>{editing ? 'Editar' : 'Nuevo'} Tercero</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {!editing && (
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>ID (NIT/CC) *</label>
                  <input className="input-field" value={form.id_tercero} onChange={e => setForm({ ...form, id_tercero: e.target.value })} />
                </div>
              )}
              <div style={{ gridColumn: editing ? '1/-1' : '' }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Tipo *</label>
                <select className="input-field" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  <option value="CLIENTE">Cliente</option>
                  <option value="PROVEEDOR">Proveedor</option>
                  <option value="CLIENTE/PROVEEDOR">Cliente/Proveedor</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Nombre *</label>
                <input className="input-field" value={form.nombre_tercero} onChange={e => setForm({ ...form, nombre_tercero: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Teléfono</label>
                <input className="input-field" value={form.telefono || ''} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Correo</label>
                <input className="input-field" type="email" value={form.correo || ''} onChange={e => setForm({ ...form, correo: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)' }}>Dirección</label>
                <input className="input-field" value={form.direccion || ''} onChange={e => setForm({ ...form, direccion: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="estadoT" checked={form.estado} onChange={e => setForm({ ...form, estado: e.target.checked })} />
                <label htmlFor="estadoT" style={{ fontSize: '0.9rem' }}>Activo</label>
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