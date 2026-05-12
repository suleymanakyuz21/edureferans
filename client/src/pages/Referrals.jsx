import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Loader2, UserPlus, Check, Copy, Lock, Users } from 'lucide-react';

export default function Referrals() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
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

    fetchReferrals();
  }, [lang]);

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Misafir', isPremium: false };
  const isPremium = user.isPremium;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500 mb-4" />
        <p className="text-lg font-medium">Loading referrals...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400">
        <p className="text-lg font-medium">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-xl font-bold">
          {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
        </button>
      </div>
    );
  }

  const referralLink = data ? `http://localhost:3000?ref=${data.refCode}` : '';

  const copyToClipboard = () => {
    if (!isPremium) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{t('referrals')}</h1>
          <p className="text-gray-400 mt-2">{lang === 'tr' ? 'Referans sisteminizi yönetin ve kazancınızı takip edin.' : 'Manage your referral system and track your earnings.'}</p>
        </div>
        {!user.isPremium && (
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-500/30 active:scale-95"
          >
            {lang === 'tr' ? 'Pro Üye Ol' : 'Become Pro'}
          </button>
        )}
      </div>

      {!user.isPremium && (
        <div className="bg-brand-500/10 border border-brand-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-black text-white mb-2">{lang === 'tr' ? 'Referans Sistemi Kilitli! 🔒' : 'Referral System Locked! 🔒'}</h2>
            <p className="text-gray-400 max-w-md">{t('referralDesc')}</p>
          </div>
          <div className="relative z-10 flex flex-col items-center md:items-end gap-2">
            <div className="text-3xl font-black text-white">₺10.000 <span className="text-sm font-normal text-gray-500">/ One-time</span></div>
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              {lang === 'tr' ? 'Pro Üye Ol' : 'Become Pro'}
            </button>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-500 ${!user.isPremium ? 'opacity-40 pointer-events-none blur-sm grayscale' : ''}`}>
        <div className="glass-card p-6 border-brand-500/10 bg-gradient-to-br from-brand-500/5 to-transparent">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{lang === 'tr' ? 'Toplam Kazanç' : 'Total Earned'}</p>
          <h3 className="text-2xl font-black text-white">₺{(data?.totalEarned || 0).toLocaleString()}</h3>
        </div>
        <div className="glass-card p-6 border-green-500/10 bg-gradient-to-br from-green-500/5 to-transparent">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{lang === 'tr' ? '1. Seviye (%25)' : 'Level 1 (25%)'}</p>
          <h3 className="text-2xl font-black text-green-400">₺{(data?.level1Earnings || 0).toLocaleString()}</h3>
        </div>
        <div className="glass-card p-6 border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-transparent">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{lang === 'tr' ? '2. Seviye (%10)' : 'Level 2 (10%)'}</p>
          <h3 className="text-2xl font-black text-blue-400">₺{(data?.level2Earnings || 0).toLocaleString()}</h3>
        </div>
        <div className="glass-card p-6 border-brand-500/10 bg-brand-500/5">
          <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">{lang === 'tr' ? 'Cüzdan Bakiyesi' : 'Wallet Balance'}</p>
          <h3 className="text-2xl font-black text-white">₺{(data?.balance || 0).toLocaleString()}</h3>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row gap-6 transition-all duration-500 ${!user.isPremium ? 'opacity-40 pointer-events-none blur-sm grayscale' : ''}`}>
        <div className="glass-card p-8 md:w-1/2 relative overflow-hidden group border-brand-500/20 bg-brand-500/5 shadow-2xl shadow-brand-500/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserPlus className="h-24 w-24" />
          </div>
          
          <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
            {lang === 'tr' ? 'Özel Referans Kodun' : 'Your Special Referral Code'}
          </h2>
          <p className="text-sm text-gray-400 mb-8 font-medium">
            {lang === 'tr' 
              ? 'Bu kodu arkadaşlarınla paylaş, her yeni kayıtta komisyon kazanmaya başla.' 
              : 'Share this code with your friends and start earning commissions on every new sign-up.'}
          </p>
          
          <div className="relative group/code">
            <div className={`bg-white/5 border-2 border-dashed border-brand-500/30 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all ${user.isPremium ? 'group-hover/code:border-brand-500/60 bg-gradient-to-br from-brand-500/10 to-transparent' : 'border-gray-500/20'}`}>
              <span className={`text-4xl md:text-5xl font-black tracking-[0.2em] font-mono transition-all ${user.isPremium ? 'text-white' : 'text-gray-600 blur-xl select-none'}`}>
                {user.isPremium ? (data?.refCode || '------') : 'LOCKED'}
              </span>
              
              {user.isPremium ? (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(data?.refCode || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    copied ? 'bg-green-500 text-white' : 'bg-brand-500 hover:bg-brand-400 text-white shadow-xl shadow-brand-500/30 active:scale-95'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? t('linkCopied') : (lang === 'tr' ? 'Kodu Kopyala' : 'Copy Code')}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] tracking-widest">
                  <Lock className="h-3 w-3" />
                  {lang === 'tr' ? 'Kodu Görmek İçin Pro Ol' : 'Upgrade to Pro to view code'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:w-1/2">
          <div className="glass-card p-6 flex flex-col justify-center">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-400 font-bold">Level 1 Network</p>
            <h3 className="text-3xl font-black text-white mt-1">{data?.referralsCount || 0}</h3>
          </div>
          <div className="glass-card p-6 flex flex-col justify-center">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3 text-green-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-400 font-bold">Level 2 Network</p>
            <h3 className="text-3xl font-black text-white mt-1">{data?.grandReferralsCount || 0}</h3>
          </div>
        </div>
      </div>

      <div className={`glass-card p-8 text-center transition-all duration-500 ${!user.isPremium ? 'opacity-40 pointer-events-none blur-sm grayscale' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-4">{lang === 'tr' ? 'Referans Ağınız Nasıl Çalışır?' : 'How Referral Network Works?'}</h2>
          <p className="text-gray-400 leading-relaxed">
            {lang === 'tr' 
              ? 'Davet ettiğiniz her üyeden %25, onların davet ettiklerinden ise %10 komisyon kazanırsınız.' 
              : 'Earn 25% from every member you invite, and 10% from the members they invite.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
