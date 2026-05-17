'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Wallet,
  Network,
  BarChart3,
  BellRing,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Kullanıcılar', href: '/admin/users', icon: Users },
  { name: 'Kurs Yönetimi', href: '/admin/courses', icon: BookOpen },
  { name: 'Ödemeler', href: '/admin/payments', icon: Wallet },
  { name: 'Referans Ağı', href: '/admin/referrals', icon: Network },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Duyurular', href: '/admin/announcements', icon: BellRing },
  { name: 'Sistem Ayarları', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Role check
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (item: typeof adminNavItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  if (!user || user.role !== 'ADMIN') return null;

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0B0F19] border-r border-[#1E293B]">
      {/* Logo Area */}
      <div className={cn(
        'flex items-center justify-between px-4 py-5 border-b border-[#1E293B] shrink-0',
        collapsed && 'lg:justify-center'
      )}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <ShieldAlert size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-white leading-tight">
                  EDU<span className="text-cyan-400">ADMIN</span>
                </span>
                <span className="text-[10px] text-cyan-500 font-medium">Control Center</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Desktop Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-slate-400"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className={cn("mb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider", collapsed && "hidden")}>
          Platform Yönetimi
        </div>
        {adminNavItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                active
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
                collapsed && 'lg:justify-center'
              )}
            >
              {active && (
                <motion.div
                  layoutId="admin-sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon
                size={18}
                className={cn(
                  'shrink-0 transition-all duration-200',
                  active ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'group-hover:text-slate-300'
                )}
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#1E293B] shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group',
            collapsed && 'lg:justify-center'
          )}
        >
          <LogOut size={18} className="shrink-0 group-hover:text-red-400" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Sistemden Çık
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex selection:bg-cyan-500/30">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 overflow-hidden shrink-0"
      >
        {SidebarContent}
      </motion.aside>

      {/* Mobile Overlay & Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col overflow-hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 relative"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-[#1E293B] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="hidden md:flex flex-col">
              <h1 className="text-sm font-bold text-slate-200">Admin Control Center</h1>
              <p className="text-[11px] text-slate-500">Production Environment</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEM ACTIVE
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-[#1E293B]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[11px] text-cyan-500 font-medium">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
          
          {children}
        </main>
      </div>
    </div>
  );
}
