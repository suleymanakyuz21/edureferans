import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Lock, Loader2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function History() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ isPremium: false });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchHistory = async () => {
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

    fetchHistory();
  }, [lang]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500 mb-4" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  const LockedOverlay = () => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/40 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-brand-500/20 p-8 text-center">
      <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mb-6 border border-brand-500/30">
        <Lock className="h-10 w-10 text-brand-500" />
      </div>
      <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Gelir Sistemi Sistemi Kilitli! 🔒</h2>
      <p className="text-gray-400 mb-8 max-w-md font-medium">Referans gelirlerini görmek ve gelir analizi yapmak için Pro Üye olmalısın.</p>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t('historyTitle')}</h1>
            <p className="text-gray-400 mt-1">Platform üzerinden elde ettiğiniz tüm gelirlerin analizi.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card p-6">
              <p className="text-xs text-gray-400 font-black uppercase mb-1">{t('walletBalance')}</p>
              <h3 className="text-3xl font-black text-white">₺{(data?.balance || 0).toLocaleString()}</h3>
            </div>
            <div className="glass-card p-6">
              <p className="text-xs text-gray-400 font-black uppercase mb-1">{t('totalEarned')}</p>
              <h3 className="text-3xl font-black text-white">₺{(data?.totalEarned || 0).toLocaleString()}</h3>
            </div>
          </div>

          <div className="glass-card p-8 lg:col-span-3 flex items-center justify-center bg-brand-500/5">
             <p className="text-sm text-gray-500 font-black uppercase tracking-widest">Gelir verileri şifrelendi.</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-black text-white">{lang === 'tr' ? 'Son İşlemler' : 'Recent Transactions'}</h2>
          </div>
          <div className="p-8 text-center text-gray-500 italic uppercase font-black tracking-widest text-xs">
            {lang === 'tr' ? 'Veriler kilitlendi.' : 'Data locked.'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
