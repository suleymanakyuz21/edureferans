'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Crown, CreditCard, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function SubscribePage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Simulate POS payment and backend upgrade
      // Since we don't have a real POS yet, we just mock the upgrade
      const response = await api.post('/payment/mock', { amount: 299, type: 'subscription' });
      if (response.data.success) {
        updateUser({ isPremium: true });
        alert('Tebrikler! Premium üyeliğiniz aktif edildi.');
        router.push('/dashboard');
      }
    } catch (error) {
      alert('Ödeme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
          <Check size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Zaten Pro Üyesiniz</h2>
        <p className="text-slate-400 mb-8">Tüm premium özelliklere sınırsız erişiminiz bulunmaktadır.</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-[var(--bg-secondary)] text-white rounded-xl font-medium border border-[var(--border-color)]">
          Dashboard'a Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-3 text-white">Pro Üyeliğe Geçiş Yap</h1>
        <p className="text-slate-400">Referans ağını oluşturmak ve tüm kurslara erişmek için hemen abone ol.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Features */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Crown size={24} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">Pro Üyelik Avantajları</h2>
          </div>
          
          <ul className="space-y-4">
            {[
              'Referans sistemine tam erişim',
              'Kayıt olan üyelerden %20 komisyon',
              '2. seviye üyelerden %10 komisyon',
              'Tüm eğitim ve kurslara sınırsız erişim',
              'Sertifika programlarına katılım',
              'Öncelikli 7/24 canlı destek',
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-emerald-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Form (Mock) */}
        <div className="bg-[var(--card-bg)] border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Ödeme Bilgileri</h3>
            <p className="text-sm text-slate-400 mb-6">Sanal POS entegrasyonu ile güvenli ödeme (Test Aşaması)</p>
            
            <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <span className="text-purple-300 font-medium">Aylık Abonelik</span>
              <span className="text-2xl font-black text-white">₺299<span className="text-sm text-purple-400 font-normal">/ay</span></span>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Kart Üzerindeki İsim</label>
                <input type="text" placeholder="Ad Soyad" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-sm focus:border-purple-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Kart Numarası</label>
                <div className="relative">
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 pl-4 pr-10 text-sm focus:border-purple-500/50 focus:outline-none font-mono" />
                  <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Son Kullanma</label>
                  <input type="text" placeholder="AA/YY" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-sm focus:border-purple-500/50 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">CVV</label>
                  <input type="text" placeholder="***" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-sm focus:border-purple-500/50 focus:outline-none font-mono" />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla ve Başla'}
              {!loading && <ArrowRight size={18} />}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck size={14} className="text-emerald-500" />
              256-bit SSL Güvenli Ödeme
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
