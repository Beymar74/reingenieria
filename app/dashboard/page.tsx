'use client';
import { useEffect, useState } from 'react';
import { Package, Users, Inbox, Send, AlertTriangle, ArrowUpRight, DollarSign, PlusCircle, Activity, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  productos: number;
  terceros: number;
  entradas_hoy: number;
  monto_entradas: number;
  salidas_hoy: number;
  monto_salidas: number;
  ingresos_mes: number;
  stock_bajo: any[];
  ultimas_ventas: any[];
}

function StatCard({ icon: Icon, label, value, sub, colorClass }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`absolute -top-4 -right-4 opacity-5 select-none ${colorClass}`}>
        <Icon size={120} strokeWidth={1.5} />
      </div>
      <div className={`mb-3 ${colorClass}`}>
        <Icon size={28} strokeWidth={2} />
      </div>
      <div className="text-slate-500 text-sm font-medium mb-1">{label}</div>
      <div className={`text-3xl font-bold font-['Inter'] tracking-tight ${colorClass}`}>{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-2 font-medium">{sub}</div>}
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
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:align-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard General</h1>
          <p className="text-slate-500 text-sm font-medium">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        {/* Acciones Rápidas */}
        <div className="flex gap-2">
          <Link href="/dashboard/salidas" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
            <DollarSign size={16} /> Registrar Venta
          </Link>
          <Link href="/dashboard/entradas" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
            <ShoppingBag size={16} /> Compra
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
            <Package size={16} /> Producto
          </Link>
          <Link href="/dashboard/terceros" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
            <Users size={16} /> Tercero
          </Link>
        </div>
      </header>

      {!stats ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400 font-medium animate-pulse">Cargando métricas...</div>
        </div>
      ) : (
        <>
          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
            <StatCard icon={DollarSign} label="Ingresos del Mes" value={fmt(stats.ingresos_mes)} colorClass="text-emerald-600" />
            <StatCard icon={Send} label="Ventas Hoy" value={stats.salidas_hoy} sub={fmt(stats.monto_salidas)} colorClass="text-blue-600" />
            <StatCard icon={Inbox} label="Compras Hoy" value={stats.entradas_hoy} sub={fmt(stats.monto_entradas)} colorClass="text-amber-600" />
            <StatCard icon={Package} label="Productos Activos" value={stats.productos} colorClass="text-indigo-600" />
            <StatCard icon={Users} label="Clientes/Prov." value={stats.terceros} colorClass="text-slate-600" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Tabla Últimas Ventas */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-blue-600" /> Últimas Ventas
                </h3>
                <Link href="/dashboard/salidas" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Ver todas <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Factura</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                      <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.ultimas_ventas.map(v => (
                      <tr key={v.numero_salida} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-6 text-sm font-medium text-blue-600">{v.numero_salida}</td>
                        <td className="py-3 px-6 text-sm text-slate-500">{new Date(v.fecha).toLocaleDateString('es-CO')}</td>
                        <td className="py-3 px-6 text-sm text-slate-700 font-medium">{v.cliente || 'Desconocido'}</td>
                        <td className="py-3 px-6 text-sm font-bold text-emerald-600 text-right">{fmt(v.total)}</td>
                      </tr>
                    ))}
                    {stats.ultimas_ventas.length === 0 && (
                      <tr><td colSpan={4} className="py-8 text-center text-sm text-slate-500">No hay ventas registradas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla Stock Bajo */}
            {stats.stock_bajo.length > 0 ? (
              <div className="bg-white border border-rose-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="px-6 py-4 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between">
                  <h3 className="font-semibold text-rose-700 flex items-center gap-2">
                    <AlertTriangle size={18} strokeWidth={2.5} /> Alerta de Stock Bajo
                  </h3>
                  <Link href="/dashboard/inventario" className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1">
                    Ir al Inventario <ArrowUpRight size={14} />
                  </Link>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Producto</th>
                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.stock_bajo.map(p => (
                        <tr key={p.id_producto} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-6 text-sm text-slate-500 font-medium">{p.id_producto}</td>
                          <td className="py-3 px-6 text-sm text-slate-900 font-medium">{p.nombre_producto}</td>
                          <td className="py-3 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                              {p.stock} unid.
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-emerald-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="bg-emerald-100 text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Package size={24} />
                  </div>
                  <h3 className="font-bold text-emerald-700 mb-1">Inventario Saludable</h3>
                  <p className="text-sm text-emerald-600/80">No hay productos con stock bajo en este momento.</p>
                </div>
              </div>
            )}
            
          </div>
        </>
      )}
    </div>
  );
}