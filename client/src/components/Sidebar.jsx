import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, PlaySquare, Users, Gift, 
  Wallet, MessageCircle, User, Settings, LogOut,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useLanguage } from '../context/LanguageContext';

export default function Sidebar() {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { name: t('myCourses'), icon: BookOpen, path: '/my-courses' },
    { name: t('videoCourses'), icon: PlaySquare, path: '/courses' },
    { name: t('referrals'), icon: Users, path: '/referrals' },
    { name: t('rewards'), icon: Gift, path: '/rewards' },
    { name: t('history'), icon: Wallet, path: '/history' },
    { name: t('community'), icon: MessageCircle, path: '/community' },
  ];

  const bottomItems = [
    { name: t('profile'), icon: User, path: '/profile' },
    { name: t('settings'), icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = `http://${window.location.hostname}:3000?logout=true`;
  };

  const SidebarItem = ({ item }) => {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => twMerge(
          clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
            isActive 
              ? "bg-brand-500/10 text-brand-500" 
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]"
          )
        )}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.div
                layoutId="active-indicator"
                className="absolute left-0 w-1.5 h-6 bg-brand-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                initial={false}
              />
            )}
            <item.icon className={clsx("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-brand-500" : "group-hover:text-brand-500")} />
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold whitespace-nowrap uppercase text-[10px] tracking-widest"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="hidden md:flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-color)] h-screen sticky top-0 z-40 transition-all duration-300 relative"
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
        <Link to="/dashboard" className="flex items-center">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xl font-black tracking-tighter text-[var(--text-primary)] hover:opacity-80 transition-opacity"
              >
                Edu<span className="text-brand-500">Referans</span>
              </motion.span>
            )}
          </AnimatePresence>
          
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center font-black text-xl border border-brand-500/20 hover:scale-105 transition-transform">
              E
            </div>
          )}
        </Link>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-1.5 text-[var(--text-secondary)] hover:text-brand-500 shadow-xl z-50 transition-all"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} />
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border-color)] flex flex-col gap-2 bg-[var(--bg-primary)]/50">
        {bottomItems.map((item) => (
          <SidebarItem key={item.path} item={item} />
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 w-full text-left"
        >
          <LogOut className="h-5 w-5 flex-shrink-0 group-hover:text-red-400 transition-colors" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold whitespace-nowrap uppercase text-[10px] tracking-widest"
              >
                {t('logout')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
