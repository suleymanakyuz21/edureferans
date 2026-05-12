'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  Search,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Kurslarım', icon: BookOpen, href: '/dashboard/courses' },
    { name: 'Referanslarım', icon: Users, href: '/dashboard/referrals' },
    { name: 'Ayarlar', icon: Settings, href: '/dashboard/settings' },
  ];

  if (!user) return <div className="h-screen w-full flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[var(--card-bg)] border-r border-[var(--border-color)] transition-all duration-300",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className={cn("text-xl font-black tracking-tighter", !isSidebarOpen && "lg:hidden")}>
               EDU<span className="text-indigo-500">REF</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block text-[var(--text-secondary)]">
                <ChevronRight size={20} className={cn("transition-transform", isSidebarOpen && "rotate-180")} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  pathname === item.href 
                    ? "bg-indigo-500/10 text-indigo-500" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-white"
                )}
              >
                <item.icon size={22} className="shrink-0" />
                <span className={cn("font-medium", !isSidebarOpen && "lg:hidden")}>{item.name}</span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-auto group"
          >
            <LogOut size={22} className="shrink-0" />
            <span className={cn("font-medium", !isSidebarOpen && "lg:hidden")}>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[var(--card-bg)] border-b border-[var(--border-color)] px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-[var(--text-primary)]">
                <Menu size={24} />
             </button>
             <div className="relative max-w-md w-full hidden md:block">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input 
                    type="text" 
                    placeholder="Ara..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all"
                />
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button className="relative text-[var(--text-secondary)] hover:text-white transition-colors">
                <Bell size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[var(--card-bg)] flex items-center justify-center text-[10px] text-white font-bold">3</span>
             </button>
             <div className="flex items-center gap-3 pl-6 border-l border-[var(--border-color)]">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{user.isPremium ? 'Premium Üye' : 'Ücretsiz Üye'}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-500 rounded-xl flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           {children}
        </main>
      </div>
    </div>
  );
}
