'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError(data.error || 'Credenciales incorrectas');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
        top: '-100px', left: '-100px', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,101,132,0.1) 0%, transparent 70%)',
        bottom: '-50px', right: '-50px', pointerEvents: 'none'
      }} />

      <div className="glass animate-fade" style={{
        padding: '3rem 2.5rem', borderRadius: 20, width: '100%', maxWidth: 420, zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 70, height: 70, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', fontSize: '1.8rem'
          }}>🏪</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>JANS</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4, fontSize: '0.9rem' }}>
            Sistema de Punto de Venta
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 500 }}>
              Usuario
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 500 }}>
              Contraseña
            </label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,70,70,0.15)', border: '1px solid rgba(255,70,70,0.3)',
              borderRadius: 8, padding: '0.7rem 1rem', marginBottom: '1rem',
              color: '#ff6666', fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.8rem' }}>
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text2)', fontSize: '0.8rem' }}>
          Usuario por defecto: <strong style={{ color: 'var(--text)' }}>admin / admin123</strong>
        </p>
      </div>
    </div>
  );
}
