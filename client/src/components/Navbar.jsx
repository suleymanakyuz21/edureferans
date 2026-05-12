import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, Menu, CheckCheck, ArrowRight, Clock, MessageCircle, Wallet, Users, CreditCard, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar({ toggleMobileMenu }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [user, setUser] = useState({ name: lang === 'tr' ? 'Misafir' : 'Guest', isPremium: false });
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user', e);
        }
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', checkUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'referral': return <Users className="h-4 w-4 text-blue-400" />;
      case 'commission': return <Wallet className="h-4 w-4 text-green-400" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-purple-400" />;
      case 'admin': return <Megaphone className="h-4 w-4 text-orange-400" />;
      default: return <Bell className="h-4 w-4 text-brand-400" />;
    }
  };

  return (
    <header className="h-16 bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4">
        <button onClick={toggleMobileMenu} className="md:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-brand-500 transition-colors">
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/dashboard" className="md:hidden flex items-center">
          <span className="text-lg font-black tracking-tighter text-[var(--text-primary)]">
            Edu<span className="text-brand-500">R.</span>
          </span>
        </Link>

        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-64 lg:w-96 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl py-2 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-500 transition-all font-bold"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {user.isPremium ? (
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full text-xs font-black text-brand-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            {t('proMember')}
          </div>
        ) : (
          <Link to="/checkout" className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-brand-500 hover:bg-brand-400 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20 active:scale-95">
            {lang === 'tr' ? 'Pro Üye Ol' : 'Become Pro'}
          </Link>
        )}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-2 rounded-xl transition-all relative ${showNotifs ? 'bg-brand-500/10 text-brand-500' : 'text-[var(--text-secondary)] hover:text-brand-500 hover:bg-[var(--bg-glass)]'}`}
          >
            <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[var(--bg-secondary)] shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 md:w-96 bg-[var(--bg-secondary)]/95 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2rem] shadow-2xl overflow-hidden z-50 shadow-black/50"
              >
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    {lang === 'tr' ? 'Bildirimler' : 'Notifications'}
                  </h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:text-brand-400 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="h-3 w-3" />
                    {lang === 'tr' ? 'Tümünü Oku' : 'Mark All'}
                  </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          setShowNotifs(false);
                        }}
                        className={`px-5 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-brand-500/5' : ''}`}
                      >
                        {!n.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${!n.isRead ? 'bg-brand-500/10 border-brand-500/20' : 'bg-white/5 border-white/5'}`}>
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black truncate uppercase tracking-tight ${!n.isRead ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-[var(--text-muted)] text-xs font-bold italic">
                      {lang === 'tr' ? 'Henüz bildirim yok.' : 'No notifications yet.'}
                    </div>
                  )}
                </div>

                <Link 
                  to="/notifications" 
                  onClick={() => setShowNotifs(false)}
                  className="p-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
                >
                  {lang === 'tr' ? 'Tüm Bildirimleri Gör' : 'View All Notifications'}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-[var(--border-color)] mx-1 hidden sm:block"></div>

        <Link to="/profile" className="flex items-center gap-3 hover:bg-[var(--bg-glass)] p-1.5 pr-4 rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xs font-black text-brand-400">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-secondary)]"></div>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-black text-[var(--text-primary)] leading-tight">{user.name}</span>
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
              {user.isPremium 
                ? (lang === 'tr' ? 'Pro Üye' : 'Pro Member') 
                : (lang === 'tr' ? 'Temel Üye' : 'Basic Member')}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
