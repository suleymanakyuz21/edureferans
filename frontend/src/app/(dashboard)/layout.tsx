'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Wallet,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Crown,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Genel Bakış', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'Kurslar', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Referanslarım', href: '/dashboard/referrals', icon: Users },
  { name: 'Cüzdanım', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Bildirimler', href: '/dashboard/notifications', icon: Bell },
  { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center justify-between px-4 py-5 border-b border-[var(--border-color)] shrink-0',
        collapsed && 'lg:justify-center'
      )}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-[0_0_12px_rgba(14,165,233,0.3)] shrink-0">
                <Zap size={13} className="text-white" fill="white" />
              </div>
              <span className="text-base font-extrabold tracking-tight">
                EDU<span className="text-gradient">REFERANS</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-[0_0_12px_rgba(14,165,233,0.25)]">
            <Zap size={13} className="text-white" fill="white" />
          </div>
        )}
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-primary)] transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)]"
        >
          <X size={16} />
        </button>
      </div>

      {/* User card */}
      <div className={cn(
        'px-4 py-4 border-b border-[var(--border-color)] flex items-center gap-3 shrink-0',
        collapsed && 'lg:justify-center'
      )}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#06b6d4]/20 border border-[#0ea5e9]/20 text-[var(--accent-primary)] flex items-center justify-center text-xs font-black shrink-0">
          {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="user-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden min-w-0"
            >
              <p className="text-sm font-bold truncate leading-tight text-[var(--text-primary)]">
                {user?.name ?? 'Kullanıcı'}
              </p>
              <p className="text-xs truncate mt-0.5">
                {user?.isPremium
                  ? <span className="text-yellow-500 flex items-center gap-1"><Crown size={9} />Premium</span>
                  : <span className="text-[var(--text-muted)]">Ücretsiz Plan</span>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                active
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-[inset_2px_0_0_var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',
                collapsed && 'lg:justify-center'
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[var(--accent-primary)]/8 rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                />
              )}
              <item.icon
                size={17}
                className={cn(
                  'shrink-0 relative z-10 transition-all',
                  active ? 'text-[var(--accent-primary)]' : 'group-hover:text-[var(--accent-primary)]'
                )}
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium relative z-10 whitespace-nowrap"
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
      <div className="px-3 py-4 border-t border-[var(--border-color)] shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-red-500/8 hover:text-red-400 transition-all',
            collapsed && 'lg:justify-center'
          )}
        >
          <LogOut size={17} className="shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="logout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Çıkış Yap
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 248 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full bg-[var(--card-bg)] border-r border-[var(--border-color)] z-40 overflow-hidden shrink-0"
      >
        {SidebarContent}
      </motion.aside>

      {/* ─── MOBILE OVERLAY ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', bounce: 0.08, duration: 0.32 }}
              className="lg:hidden fixed top-0 left-0 h-full w-60 bg-[var(--card-bg)] border-r border-[var(--border-color)] z-50 flex flex-col overflow-hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN AREA ─── */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-220"
        style={{ marginLeft: collapsed ? 68 : 248 }}
      >
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 h-14 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all"
            >
              <Menu size={16} />
            </button>

            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search size={14} className="absolute left-3 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Ara..."
                className="pl-9 pr-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent-primary)]/40 focus:ring-1 focus:ring-[var(--accent-primary)]/10 transition-all w-52 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="relative w-8 h-8 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all"
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent-primary)] rounded-full badge-pulse" />
            </Link>

            {/* User */}
            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-[var(--border-color)]">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold leading-tight text-[var(--text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {user?.isPremium ? 'Premium' : 'Ücretsiz'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#06b6d4]/20 border border-[#0ea5e9]/20 text-[var(--accent-primary)] flex items-center justify-center text-xs font-black">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-5 lg:p-7 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
