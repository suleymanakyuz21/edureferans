import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Users, Wallet, CreditCard, Megaphone, 
  CheckCheck, Trash2, Clock, Filter, ArrowRight 
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

export default function Notifications() {
  const { lang } = useLanguage();
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: lang === 'tr' ? 'Tümü' : 'All', icon: Bell },
    { id: 'referral', label: lang === 'tr' ? 'Referans' : 'Referrals', icon: Users },
    { id: 'commission', label: lang === 'tr' ? 'Kazançlar' : 'Earnings', icon: Wallet },
    { id: 'payment', label: lang === 'tr' ? 'Ödemeler' : 'Payments', icon: CreditCard },
    { id: 'admin', label: lang === 'tr' ? 'Duyurular' : 'Announcements', icon: Megaphone },
  ];

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const getIcon = (type) => {
    switch (type) {
      case 'referral': return <Users className="h-5 w-5 text-blue-400" />;
      case 'commission': return <Wallet className="h-5 w-5 text-green-400" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-purple-400" />;
      case 'admin': return <Megaphone className="h-5 w-5 text-orange-400" />;
      default: return <Bell className="h-5 w-5 text-brand-400" />;
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {lang === 'tr' ? 'Bildirim Merkezi' : 'Notification Center'}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {lang === 'tr' ? 'Hesabınızla ilgili tüm gelişmeleri buradan takip edin.' : 'Track all developments related to your account here.'}
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl text-xs font-black text-white uppercase tracking-widest hover:border-brand-500/50 transition-all"
        >
          <CheckCheck className="h-4 w-4 text-brand-500" />
          {lang === 'tr' ? 'Tümünü Okundu İşaretle' : 'Mark All As Read'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeTab === tab.id 
                ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20' 
                : 'bg-[var(--bg-glass)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-brand-500/30'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card p-6 flex items-start gap-5 group cursor-pointer transition-all ${
                  !notification.isRead ? 'border-brand-500/30 bg-brand-500/5' : 'hover:border-white/10'
                }`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                  !notification.isRead ? 'bg-brand-500/20 border-brand-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5'
                }`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className={`text-base font-black truncate ${!notification.isRead ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${!notification.isRead ? 'text-[var(--text-secondary)] font-medium' : 'text-[var(--text-muted)]'}`}>
                    {notification.message}
                  </p>
                </div>

                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shadow-[0_0_10px_rgba(99,102,241,1)]" />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="glass-card p-20 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-gray-600">
                <Bell className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-gray-500 font-bold tracking-tight">
                {lang === 'tr' ? 'Henüz bildiriminiz bulunmuyor.' : 'You have no notifications yet.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
