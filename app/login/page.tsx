'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('LOGIN SUBMIT', form);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log('LOGIN RESPONSE', { status: res.status, ok: res.ok, data });
      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        setError(data?.error || 'Credenciales incorrectas');
      }
    } catch (err: any) {
      setError(err?.message || 'Error en el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />

      <div className="bg-white p-10 rounded-2xl w-full max-w-md z-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-fade">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 mx-auto mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-['Syne'] tracking-tight mb-1">JANS</h1>
          <p className="text-slate-500 text-sm font-medium">
            Sistema de Punto de Venta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Usuario
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Ej. admin"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
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
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-600 text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button className="btn-primary w-full py-3 mt-2 text-base shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-xs">
            Usuario por defecto: <strong className="text-slate-700">admin / admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
