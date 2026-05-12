import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Download, Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Rewards() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ isPremium: false });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchRewards = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error(lang === 'tr' ? 'Oturum bulunamadı.' : 'Session not found.');

        const response = await fetch('http://localhost:3000/api/users/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
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

    fetchRewards();
  }, [lang]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500 mb-4" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  const transactions = (data?.recentCommissions || []).map((c, i) => ({
    id: `CM-${i + 1000}`,
    user: c.from,
    type: lang === 'tr' ? `Seviye ${c.level} Komisyon` : `Level ${c.level} Commission`,
    amount: `+₺${c.amount.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}`,
    status: 'completed',
    date: new Date(c.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
  }));

  const LockedOverlay = () => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/40 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-brand-500/20 p-8 text-center">
      <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mb-6 border border-brand-500/30">
        <Lock className="h-10 w-10 text-brand-500" />
      </div>
      <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Ödüllerim Sistemi Kilitli! 🔒</h2>
      <p className="text-gray-400 mb-8 max-w-md font-medium">Kazançlarını takip etmek ve ödüllerini çekmek için Pro Üye olmalısın.</p>
      <button 
        onClick={() => navigate('/checkout')}
        className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-brand-500/40 active:scale-95"
      >
        {lang === 'tr' ? 'Pro Üye Ol' : 'Become Pro'}
      </button>
    </div>
  );

  return (
    <div className="relative min-h-[600px] rounded-[2rem] overflow-hidden">
      {!user.isPremium && <LockedOverlay />}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={`space-y-6 ${!user.isPremium ? 'opacity-20 pointer-events-none' : ''}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-8 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2 font-bold">
                <Wallet className="h-5 w-5" />
                <span>{t('walletBalance')}</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tight">
                ₺{(data?.balance || 0).toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-card p-5">
              <p className="text-sm text-gray-400 font-bold mb-1">{t('totalEarned')}</p>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                ₺{(data?.totalEarned || 0).toLocaleString()} <CheckCircle2 className="h-4 w-4 text-green-500" />
              </h3>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-lg font-black text-white">{lang === 'tr' ? 'İşlem Geçmişi' : 'Transaction History'}</h3>
          </div>
          <div className="overflow-x-auto p-4">
             <p className="text-sm text-gray-500 italic uppercase font-black tracking-widest">Veriler şifrelendi ve kilitlendi.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
