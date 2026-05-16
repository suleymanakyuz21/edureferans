'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Wallet,
  Award,
  ChevronRight,
  PlayCircle,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import PremiumLock from '@/components/shared/PremiumLock';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const stats = [
    {
      name: 'Toplam Kazanç',
      value: '₺0.00',
      icon: Wallet,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/15',
      trend: '+0%',
    },
    {
      name: 'Aktif Referanslar',
      value: '0',
      icon: Users,
      color: 'text-[var(--accent-primary)]',
      bg: 'bg-[var(--accent-primary)]/10',
      border: 'border-[var(--accent-primary)]/15',
      trend: '+0',
    },
    {
      name: 'Puan Sıralaması',
      value: '#--',
      icon: Award,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/15',
      trend: '—',
    },
    {
      name: 'Aylık Artış',
      value: '%0',
      icon: TrendingUp,
      color: 'text-[var(--accent-secondary)]',
      bg: 'bg-[var(--accent-secondary)]/10',
      border: 'border-[var(--accent-secondary)]/15',
      trend: '0',
    },
  ];

  const referralLink = `https://edureferans.com/register?ref=${user?.refCode || '---'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black mb-1 text-[var(--text-primary)]">
            Merhaba, {user?.name || 'Kullanıcı'} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Bugün yeni bir şeyler öğrenmeye veya ağını genişletmeye ne dersin?
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              'p-5 bg-[var(--card-bg)] border rounded-2xl hover-glow transition-all group cursor-default',
              stat.border
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-2.5 rounded-xl', stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className={cn('text-xs font-semibold flex items-center gap-0.5', stat.color)}>
                <ArrowUpRight size={12} />
                {stat.trend}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium mb-1">{stat.name}</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Link Card or Premium Lock */}
        {user?.isPremium ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-2 p-7 rounded-2xl text-white relative overflow-hidden shadow-[0_0_60px_rgba(14,165,233,0.12)]"
            style={{ background: 'linear-gradient(135deg, #0c2340 0%, #071e36 50%, #0b1120 100%)' }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#0ea5e9]/12 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#06b6d4]/8 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]" />

            <div className="relative z-10">
              <h2 className="text-xl font-black mb-2">Ağını Genişlet, Kazancını Artır!</h2>
              <p className="text-slate-400 text-sm mb-6 max-w-md">
                Referans linkini paylaşarak her yeni üyeden komisyon kazanmaya devam et.
              </p>

              <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 bg-transparent border-none px-3 text-xs font-mono text-white/70 focus:outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all',
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white shadow-[0_0_16px_rgba(14,165,233,0.3)]'
                  )}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Kopyalandı!' : 'Kopyala'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="lg:col-span-2">
            <PremiumLock
              title="Referans Ağınız Kilitli"
              description="Referans kodunuzu görüntülemek ve ağınızdan kazanç sağlamak için Pro Üye olmalısınız."
            />
          </div>
        )}

        {/* Quick Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl"
        >
          <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">Öğrenme Durumu</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--text-muted)]">Tamamlanan Kurslar</span>
                <span className="font-bold text-[var(--text-primary)]">0/0</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div className="w-0 h-full bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] transition-all duration-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--text-muted)]">Haftalık Hedef</span>
                <span className="font-bold text-[var(--text-primary)]">0%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div className="w-0 h-full bg-gradient-to-r from-[#06b6d4] to-[#0284c7] transition-all duration-500 rounded-full" />
              </div>
            </div>
            <button className="w-full py-3 border border-[var(--border-color)] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)] transition-all group">
              Tüm Eğitimleri Gör
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6"
        >
          <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">Son Aktiviteler</h3>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mb-4 opacity-40">
              <TrendingUp size={26} className="text-[var(--accent-primary)]" />
            </div>
            <p className="text-[var(--text-secondary)] text-sm">Henüz bir aktivite bulunmuyor.</p>
            <p className="text-[var(--text-muted)] text-xs mt-1.5">Kurs tamamladığında burada görünecek.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6"
        >
          <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">Sana Özel Tavsiyeler</h3>
          <div className="space-y-3">
            {[
              { title: 'Next.js ile Modern Web Geliştirme', level: 'Başlangıç', duration: '8 saat' },
              { title: 'Dijital Pazarlama Temelleri', level: 'Orta', duration: '5 saat' },
            ].map((course, i) => (
              <div
                key={i}
                className="flex gap-3 p-3.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-all cursor-pointer border border-transparent hover:border-[var(--border-color)] group"
              >
                <div className="w-14 h-12 bg-[var(--accent-primary)]/8 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent-primary)]/15 transition-colors shrink-0">
                  <PlayCircle size={20} className="text-[var(--accent-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-[var(--text-primary)]">{course.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{course.level} · {course.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
