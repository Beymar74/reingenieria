'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  Inbox,
  Send,
  Archive,
  BarChart3,
  Store,
  LogOut
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Productos', icon: Package },
  { href: '/dashboard/terceros', label: 'Clientes/Proveed.', icon: Users },
  { href: '/dashboard/entradas', label: 'Entradas', icon: Inbox },
  { href: '/dashboard/salidas', label: 'Salidas', icon: Send },
  { href: '/dashboard/inventario', label: 'Inventario', icon: Archive },
  { href: '/dashboard/informes', label: 'Informes', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside className="w-[240px] min-h-screen bg-white border-r border-slate-200 flex flex-col py-6 fixed left-0 top-0 bottom-0 z-10 shadow-sm">
      {/* Sección del Logo */}
      <div className="px-6 pb-6 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Store size={20} />
          </div>
          <div>
            <div className="font-['Syne'] font-bold text-lg text-slate-900 leading-none">JANS</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Punto de Venta</div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                active 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? 'text-blue-600' : 'text-slate-400'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Botón de Cerrar Sesión */}
      <div className="px-4 pt-4 border-t border-slate-100 mt-auto">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm"
        >
          <LogOut size={18} className="text-slate-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}