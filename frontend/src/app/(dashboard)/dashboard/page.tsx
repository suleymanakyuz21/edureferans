'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, Wallet, TrendingUp, Copy, Check,
  ArrowRight, Zap, Star, ChevronRight, Bell, Play,
  Globe, Crown, Sparkles, Target,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const COUNTDOWN = { days: 3, hours: 14, minutes: 27, seconds: 0 };

function useCountdown(initial: typeof COUNTDOWN) {
  const [time, setTime] = useState(initial);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { days, hours, minutes, seconds: seconds - 1 };
        if (minutes > 0) return { days, hours, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { days, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const countdown = useCountdown(COUNTDOWN);

  useEffect(() => {
    api.get('/referral/stats').then((res) => {
      const d = res.data?.data;
      if (d) {
        setBalance(d.balance ?? 0);
        setReferralCount((d.level1Count ?? 0) + (d.level2Count ?? 0));
      }
    }).catch(() => {});
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user?.refCode ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const stats = [
    { label: 'Toplam Kazanç', value: `₺${balance.toFixed(2)}`, icon: Wallet, color: 'emerald', glow: 'rgba(16,185,129,0.15)' },
    { label: 'Referanslarım', value: String(referralCount), icon: Users, color: 'cyan', glow: 'rgba(6,182,212,0.15)' },
    { label: 'Kurslarım', value: '0', icon: BookOpen, color: 'violet', glow: 'rgba(139,92,246,0.15)' },
    { label: 'Aylık Büyüme', value: '%0', icon: TrendingUp, color: 'amber', glow: 'rgba(245,158,11,0.15)' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-400 to-teal-500',
    cyan: 'from-cyan-400 to-blue-500',
    violet: 'from-violet-400 to-purple-500',
    amber: 'from-amber-400 to-orange-500',
  };

  const quickActions = [
    { label: 'Kurslara Göz At', icon: BookOpen, href: '/dashboard/courses', color: 'from-cyan-500 to-blue-600' },
    { label: 'Referans Davet Et', icon: Users, href: '/dashboard/referrals', color: 'from-violet-500 to-purple-600' },
    { label: 'Kazançlarını Gör', icon: Wallet, href: '/dashboard/wallet', color: 'from-emerald-500 to-teal-600' },
    { label: 'Hedeflerini Takip Et', icon: Target, href: '/dashboard/referrals', color: 'from-amber-500 to-orange-600' },
  ];

  const proFeatures = [
    'Tüm premium kurslara erişim',
    '2 kademeli referans sistemi',
    'Sınırsız para çekme',
    'Öncelikli destek',
    'Sertifika programları',
    'Canlı ders arşivi',
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* ── WELCOME ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">
            Merhaba, {user?.name?.split(' ')[0] || 'Kullanıcı'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Bugün yeni bir şeyler öğren veya ağını genişlet.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell size={16} />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">0</span>
          </div>
          {!user?.isPremium && (
            <Link href="/dashboard/subscribe" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              <Crown size={14} />
              Pro Üye Ol
            </Link>
          )}
        </div>
      </motion.div>

      {/* ── HERO DISCOUNT CARD ── */}
      {!user?.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="relative rounded-3xl overflow-hidden p-7 md:p-10"
          style={{ background: 'linear-gradient(135deg,#1a0533 0%,#0f0a2e 40%,#0a1628 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:28px_28px]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/15 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-full tracking-wider">%60 İNDİRİM</span>
                <span className="text-slate-400 text-sm">Sınırlı süre teklifi</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                %60 İndirim Fırsatı
              </h2>
              <p className="text-slate-400 text-sm mb-5">Premium üyelik şimdi çok avantajlı.</p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-black text-white">999 <span className="text-lg font-semibold text-slate-300">TL</span></span>
                <span className="text-xl text-slate-500 line-through font-medium">2.499 TL</span>
              </div>
              <Link href="/dashboard/subscribe"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.5)] hover:shadow-[0_0_36px_rgba(139,92,246,0.7)] transition-all group"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)' }}>
                <Zap size={15} fill="white" />
                Hemen Pro Üye Ol
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                %60
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Süre Dolmadan Al</p>
              <div className="flex items-center gap-2">
                {[
                  { val: countdown.days, label: 'Gün' },
                  { val: countdown.hours, label: 'Saat' },
                  { val: countdown.minutes, label: 'Dk' },
                  { val: countdown.seconds, label: 'Sn' },
                ].map(({ val, label }, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-500 font-bold text-lg">:</span>}
                    <div className="flex flex-col items-center">
                      <span className="w-12 h-12 bg-slate-800/80 border border-slate-700/50 rounded-xl flex items-center justify-center text-lg font-black text-white tabular-nums">
                        {pad(val)}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">{label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
            className="relative p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm overflow-hidden group hover:border-slate-600/60 transition-all"
            style={{ boxShadow: `0 0 30px ${stat.glow}` }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ background: stat.glow.replace('0.15', '1') }} />
            <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg', colorMap[stat.color])}>
              <stat.icon size={16} className="text-white" />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── COURSES (Empty State) ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-white">Kurslarım</h3>
            <Link href="/dashboard/courses" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold">
              Tümünü Gör <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                <BookOpen size={32} className="text-slate-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Play size={10} className="text-white fill-white" />
              </div>
            </div>
            <p className="text-slate-300 font-bold mb-1.5">Henüz kurs satın almadın.</p>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">Satın aldığın kurslar burada görünecek. Hemen keşfet ve öğrenmeye başla!</p>
            <Link href="/dashboard/courses"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}>
              <Sparkles size={14} />
              Kursları Keşfet
            </Link>
          </div>
        </motion.div>

        {/* ── QUICK ACTIONS ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm p-6">
          <h3 className="font-black text-white mb-5">Hızlı İşlemler</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all group">
                <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-md', action.color)}>
                  <action.icon size={14} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors flex-1">{action.label}</span>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── REFERRAL CODE (if premium) ── */}
      {user?.isPremium && user?.refCode && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden p-7"
          style={{ background: 'linear-gradient(135deg,#0c2340,#071e36,#0b1120)' }}>
          <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-cyan-400" />
              <h3 className="font-black text-white">Referans Kodun</h3>
            </div>
            <p className="text-slate-400 text-sm mb-5">Paylaştığın her yeni üyeden komisyon kazan.</p>
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md max-w-sm">
              <span className="flex-1 px-3 py-2 text-sm font-mono font-bold text-white/90 truncate">{user.refCode}</span>
              <button onClick={handleCopy}
                className={cn('px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all',
                  copied ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.3)]')}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PLANS ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-white text-lg">Plans for you or your team</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* FREE */}
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-7">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Ücretsiz</p>
            <p className="text-4xl font-black text-white mb-1">₺0 <span className="text-base font-medium text-slate-400">/ yıl</span></p>
            <p className="text-slate-500 text-sm mb-6">Temel özellikler ile başlayın</p>
            <ul className="space-y-3 mb-7">
              {['Sınırlı kurs erişimi', '1 aktif cihaz', 'Temel destek', 'Referans sistemi kapalı'].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-400">
                  <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors">
              Mevcut Plan
            </button>
          </div>

          {/* PRO */}
          <div className="relative rounded-2xl overflow-hidden p-7"
            style={{ background: 'linear-gradient(135deg,#1a0533,#0f0a2e,#0a1628)', boxShadow: '0 0 50px rgba(139,92,246,0.2)' }}>
            <div className="absolute inset-0 border border-violet-500/30 rounded-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/15 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Pro</p>
                <span className="px-2.5 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-black rounded-full tracking-wider">EN POPÜLER</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-4xl font-black text-white">₺999</p>
                <p className="text-base font-medium text-slate-400">/ yıl</p>
              </div>
              <p className="text-slate-500 text-sm line-through mb-5">2.499 TL</p>
              <ul className="space-y-3 mb-7">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Star size={13} className="text-violet-400 shrink-0 fill-violet-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/subscribe"
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_36px_rgba(139,92,246,0.6)] transition-all group"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)' }}>
                <Zap size={14} fill="white" />
                Pro Üye Ol — ₺999
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
