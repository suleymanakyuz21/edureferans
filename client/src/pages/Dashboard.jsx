import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Users, PlaySquare, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Kullanıcı', isPremium: false });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error(lang === 'tr' ? 'Oturum bulunamadı.' : 'Session not found.');

        const response = await fetch('http://localhost:3000/api/users/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(lang === 'tr' ? 'Veriler alınamadı.' : 'Failed to fetch data.');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [lang]);

  const stats = data ? [
    { name: t('totalEarned'), value: `₺${(data.totalEarned || 0).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}`, change: '+0%', trend: 'up', icon: Wallet },
    { name: t('activeReferrals'), value: data.referralsCount || 0, change: '+0%', trend: 'up', icon: Users },
    { name: t('completedCourses'), value: '0', change: '+0%', trend: 'up', icon: PlaySquare },
    { name: t('walletBalance'), value: `₺${(data.balance || 0).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}`, change: '+0%', trend: 'up', icon: TrendingUp },
  ] : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500 mb-4" />
        <p className="text-lg font-medium">Dashboard loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400">
        <p className="text-lg font-medium">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{t('welcome')}, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1">Platformdaki güncel durumun.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {data?.refCode && (
            <div className={`bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center sm:items-start gap-1 transition-all ${!user.isPremium ? 'opacity-50 grayscale' : ''}`}>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{lang === 'tr' ? 'Referans Kodun' : 'Ref Code'}</span>
              <span className={`text-xl font-black tracking-widest font-mono ${user.isPremium ? 'text-brand-400' : 'text-gray-600 blur-[4px] select-none'}`}>
                {user.isPremium ? data.refCode : 'PRO-ONLY'}
              </span>
            </div>
          )}
          {!user.isPremium && (
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-500/30 active:scale-95"
            >
              {lang === 'tr' ? 'Pro Üye Ol' : 'Become Pro'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-5 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-brand-500/10 rounded-xl">
                <stat.icon className="h-6 w-6 text-brand-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.name}</p>
              <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Kazanç Analizi</h2>
          </div>
          <div className="flex-1 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center justify-center relative overflow-hidden">
            <div className="text-gray-500 text-sm font-medium">{t('walletBalance')}: ₺{(data.balance || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">{t('recentActivity')}</h2>
          </div>
          <div className="space-y-5">
            {data.recentCommissions?.length > 0 ? data.recentCommissions.map((commission, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{commission.from}</p>
                  <p className="text-xs text-gray-500">{t('commission')} (L{commission.level})</p>
                </div>
                <div className="text-sm font-black text-green-400">+₺{commission.amount}</div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">Henüz aktivite yok.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
