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

  // Auth guard (fallback — middleware handles server-side)
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  // Restore theme
  useEffect(() => {
    const stored = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  // Close mobile sidebar on route change
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
      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[var(--border-color)] shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="text-xl font-extrabold tracking-tighter"
            >
              EDU<span className="text-indigo-500">REFERANS</span>
            </motion.span>
          )}
        </AnimatePresence>
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)]"
        >
          <X size={18} />
        </button>
      </div>

      {/* User card */}
      <div className={cn(
        'px-4 py-4 border-b border-[var(--border-color)] flex items-center gap-3 shrink-0',
        collapsed && 'lg:justify-center'
      )}>
        <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black shrink-0">
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
              <p className="text-sm font-bold truncate leading-tight">{user?.name ?? 'Kullanıcı'}</p>
              <p className="text-xs truncate mt-0.5">
                {user?.isPremium
                  ? <span className="text-yellow-500 flex items-center gap-1"><Crown size={10} />Premium</span>
                  : <span className="text-[var(--text-secondary)]">Ücretsiz</span>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                active
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',
                collapsed && 'lg:justify-center'
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-indigo-500/10 rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon size={18} className="shrink-0 relative z-10" />
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
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all',
            collapsed && 'lg:justify-center'
          )}
        >
          <LogOut size={18} className="shrink-0" />
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
      {/* ─── DESKTOP SIDEBAR ──────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full bg-[var(--card-bg)] border-r border-[var(--border-color)] z-40 overflow-hidden shrink-0"
      >
        {SidebarContent}
      </motion.aside>

      {/* ─── MOBILE SIDEBAR OVERLAY ───────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
              className="lg:hidden fixed top-0 left-0 h-full w-64 bg-[var(--card-bg)] border-r border-[var(--border-color)] z-50 flex flex-col overflow-hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN AREA ────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-250"
        style={{ marginLeft: collapsed ? 72 : 256 }}
      >
        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)]"
            >
              <Menu size={18} />
            </button>

            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search size={15} className="absolute left-3.5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Ara..."
                className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all w-56 text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Link>

            {/* User */}
            <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-[var(--border-color)]">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold leading-tight">{user?.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {user?.isPremium ? 'Premium' : 'Ücretsiz'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-black">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
