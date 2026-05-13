'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  BookOpen, 
  Settings, 
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Genel Bakış', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Referanslarım', href: '/dashboard/referrals', icon: Users },
  { name: 'Cüzdanım', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Kurslar', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Bildirimler', href: '/dashboard/notifications', icon: Bell },
  { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-full bg-[var(--card-bg)] border-r border-[var(--border-color)] z-40 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-extrabold text-lg tracking-tighter"
            >
              EDU<span className="text-indigo-500">REFERANS</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebarCollapse}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User */}
      <div className={cn(
        "p-4 border-b border-[var(--border-color)] flex items-center gap-3",
        sidebarCollapsed && "justify-center"
      )}>
        <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold shrink-0">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {user?.isPremium ? (
                  <span className="text-yellow-500 flex items-center gap-1">
                    <Crown size={10} /> Premium
                  </span>
                ) : 'Free Üye'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',
                sidebarCollapsed && 'justify-center'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-indigo-500/10 rounded-xl"
                />
              )}
              <item.icon size={18} className="shrink-0 relative z-10" />
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium relative z-10"
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
      <div className="p-3 border-t border-[var(--border-color)]">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all',
            sidebarCollapsed && 'justify-center'
          )}
        >
          <LogOut size={18} />
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.span
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
    </motion.aside>
  );
}
