import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
