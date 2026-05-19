'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, Users, BookOpen, TrendingUp, Award,
  Star, ShieldCheck, Code, BarChart, Heart, Globe,
  Check, Crown,
} from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.52V6.74a4.85 4.85 0 0 1-1.02-.05z" />
  </svg>
);
import Link from 'next/link';
import { cn } from '@/lib/utils';

const COUNTDOWN = { days: 3, hours: 14, minutes: 27, seconds: 0 };
const pad = (n: number) => String(n).padStart(2, '0');

function useCountdown(init: typeof COUNTDOWN) {
  const [t, setT] = useState(init);
  useEffect(() => {
    const id = setInterval(() => setT((p) => {
      let { days, hours, minutes, seconds } = p;
      if (seconds > 0) return { days, hours, minutes, seconds: seconds - 1 };
      if (minutes > 0) return { days, hours, minutes: minutes - 1, seconds: 59 };
      if (hours > 0) return { days, hours: hours - 1, minutes: 59, seconds: 59 };
      if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
      return p;
    }), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Home() {
  const countdown = useCountdown(COUNTDOWN);

  const stats = [
    { label: 'Aktif Öğrenci', value: '10K+', icon: Users },
    { label: 'Uzman Eğitmen', value: '250+', icon: Award },
    { label: 'Online Kurs', value: '500+', icon: BookOpen },
    { label: 'Referans Kazancı', value: '₺2M+', icon: TrendingUp },
  ];

  const categories = [
    { name: 'Yazılım & IT', icon: Code, gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Dijital Pazarlama', icon: BarChart, gradient: 'from-violet-500 to-purple-600' },
    { name: 'Tasarım & UI/UX', icon: Star, gradient: 'from-pink-500 to-rose-600' },
    { name: 'Kişisel Gelişim', icon: Heart, gradient: 'from-emerald-500 to-teal-600' },
  ];

  const freePlan = ['Sınırlı kurs erişimi', '1 aktif cihaz', 'Temel destek', 'Referans sistemi kapalı'];
  const proPlan = ['Tüm premium kurslara erişim', '2 kademeli referans sistemi', 'Sınırsız para çekme', 'Öncelikli destek', 'Sertifika programları', 'Canlı ders arşivi'];

  const comparison = [
    { label: 'Premium Kurs Erişimi', free: false, pro: true },
    { label: 'Referans Komisyonu (%20)', free: false, pro: true },
    { label: 'İkinci Seviye Komisyon (%10)', free: false, pro: true },
    { label: 'Para Çekme', free: false, pro: true },
    { label: 'Sertifika Programları', free: false, pro: true },
    { label: 'Temel Kurslar', free: true, pro: true },
    { label: 'Topluluk Erişimi', free: true, pro: true },
  ];

  const socials = [
    { name: 'Instagram', handle: '@edureferans', Icon: InstagramIcon, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-500/10', border: 'border-pink-500/20', href: 'https://instagram.com/edureferans' },
    { name: 'TikTok', handle: '@edureferans', Icon: TikTokIcon, color: 'from-slate-200 to-white', bg: 'bg-white/5', border: 'border-white/10', href: 'https://tiktok.com/@edureferans' },
    { name: 'X (Twitter)', handle: '@edureferans', Icon: XIcon, color: 'from-sky-400 to-blue-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20', href: 'https://twitter.com/edureferans' },
  ];

  const footerLinks = {
    Platform: ['Kurslar', 'Referans Sistemi', 'Fiyatlar', 'Blog'],
    Destek: ['Yardım Merkezi', 'SSS', 'İletişim', 'Durum Sayfası'],
    'Hakkımızda': ['Hakkımızda', 'Kariyer', 'Basın', 'Ortaklar'],
    Yasal: ['Gizlilik Politikası', 'Kullanım Şartları', 'Çerez Politikası'],
  };

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-16 md:pt-52 md:pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/8 blur-[120px] rounded-full" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/6 blur-[100px] rounded-full" />
        </div>
        <div className="absolute inset-0 -z-10 opacity-[0.015] bg-[linear-gradient(rgba(139,92,246,1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,1)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold mb-8 tracking-wider uppercase">
                <Zap size={11} fill="currentColor" />
                Yeni Nesil Eğitim & Referans Platformu
              </motion.div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04] mb-6 text-white">
                Yeteneklerini{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Gelire</span>
                  <motion.span className="absolute -inset-2 bg-violet-500/8 rounded-2xl blur-xl -z-10"
                    animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 4, repeat: Infinity }} />
                </span>{' '}
                Dönüştür
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
                EduReferans ile öğrenirken kazan, kazandırırken büyü. Türkiye&apos;nin en gelişmiş referans tabanlı eğitim ekosistemi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register"
                  className="px-8 py-4 rounded-2xl text-white font-bold text-sm flex items-center gap-2 group shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)' }}>
                  <Zap size={16} fill="white" />
                  Ücretsiz Başla
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login"
                  className="px-8 py-4 rounded-2xl text-slate-300 font-semibold text-sm border border-slate-700/60 hover:border-slate-600 hover:text-white transition-all">
                  Giriş Yap
                </Link>
              </div>
              <div className="flex flex-wrap gap-5 mt-10 text-xs text-slate-500 font-medium">
                {['Kredi kartı gerekmez', 'Ücretsiz başlayın', '7/24 destek', 'SSL güvenli'].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — Promo Card */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
              <div className="relative rounded-3xl overflow-hidden p-8"
                style={{ background: 'linear-gradient(135deg,#1a0533,#0f0a2e,#0a1628)', boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}>
                <div className="absolute inset-0 border border-violet-500/20 rounded-3xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-60 h-60 bg-violet-600/15 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-full">%60 İNDİRİM</span>
                    <Crown size={16} className="text-amber-400" />
                    <span className="text-slate-400 text-sm font-medium">Pro Üyelik</span>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-1">%60 İndirim Fırsatı</h2>
                  <p className="text-slate-400 text-sm mb-6">Premium üyelik şimdi çok avantajlı.</p>
                  <div className="flex items-baseline gap-3 mb-7">
                    <span className="text-5xl font-black text-white">2.499 <span className="text-xl font-medium text-slate-300">TL</span></span>
                    <span className="text-2xl text-slate-500 line-through font-medium">6.249 TL</span>
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center gap-2 mb-7">
                    {[{ val: countdown.days, l: 'Gün' }, { val: countdown.hours, l: 'Saat' }, { val: countdown.minutes, l: 'Dk' }, { val: countdown.seconds, l: 'Sn' }].map(({ val, l }, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-slate-600 font-bold text-xl">:</span>}
                        <div className="flex flex-col items-center">
                          <span className="w-14 h-14 bg-slate-800/80 border border-slate-700/50 rounded-xl flex items-center justify-center text-xl font-black text-white tabular-nums">
                            {pad(val)}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-1.5 font-medium">{l}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  <Link href="/register"
                    className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] transition-all group"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)' }}>
                    <Zap size={15} fill="white" />
                    Hemen Pro Üye Ol
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    Güvenli ödeme · 30 gün iade garantisi
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-slate-900/50 border-y border-slate-800/50 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center group">
                <p className="text-4xl md:text-5xl font-black text-white mb-1 group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{s.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="py-28 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-violet-400 mb-3 block">Kategoriler</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Popüler Kategoriler</h2>
            <p className="text-slate-400 max-w-xl mx-auto">En çok tercih edilen alanlarda uzmanlaşın ve kariyerinize yön verin.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-7 rounded-2xl border border-slate-700/40 bg-slate-900/60 text-center hover:border-slate-600/60 transition-all cursor-pointer group"
                style={{ boxShadow: '0 0 0 0 transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0 transparent')}>
                <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform', cat.gradient)}>
                  <cat.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERRAL SECTION ── */}
      <section id="referral" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-20"
            style={{ background: 'linear-gradient(135deg,#0c1a3a,#0b1120,#071e36)' }}>
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:28px_28px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/8 blur-[80px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />
            <div className="absolute inset-0 border border-slate-700/30 rounded-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-cyan-400 mb-6">
                  <Zap size={11} fill="currentColor" /> Referans Sistemi
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Öğrenirken{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Kazanmaya</span>{' '}
                  Başla
                </h2>
                <p className="text-slate-400 text-base mb-10 leading-relaxed">
                  Referans sistemimiz sayesinde, platforma kazandırdığın her üyenin abonelik ve kurs alımlarından komisyon kazanırsın. 2 kademeli sistemle kazancın katlanarak artar!
                </p>
                <ul className="space-y-3.5 mb-10">
                  {['Sınırsız Referans İmkanı', '%20 Birinci Seviye Komisyon', '%10 İkinci Seviye Komisyon', 'Anında Çekilebilir Bakiye'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm group shadow-[0_0_24px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all"
                  style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}>
                  Hemen Başla
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 2-Level Referral Diagram */}
              <div className="space-y-3">
                {/* SEN */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-[0_0_24px_rgba(6,182,212,0.2)]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-[0_0_16px_rgba(6,182,212,0.5)]">
                      SEN
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">Sen (Üye)</p>
                      <p className="text-cyan-400 text-xs font-semibold">Referans kodunu paylaşıyorsun</p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-gradient-to-b from-cyan-500/60 to-cyan-500/20" />
                    <p className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">Davet ediyorsun</p>
                    <div className="w-px h-4 bg-gradient-to-b from-cyan-500/20 to-transparent" />
                  </div>
                </div>

                {/* 1. Seviye */}
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-black text-white">1</div>
                      <p className="text-white font-black text-sm">1. Seviye Referansların</p>
                    </div>
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black rounded-full">%20 KOMİSYON</span>
                  </div>
                  <div className="flex gap-2">
                    {['Ali', 'Ayşe', 'Mehmet', '+daha fazla'].map((n, i) => (
                      <div key={i} className="flex-1 py-2 px-2 bg-slate-800/60 rounded-xl border border-slate-700/40 text-center">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-1">
                          <Users size={12} className="text-cyan-400" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">{n}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-2">Doğrudan davet ettiğin kişiler pro üye olursa <span className="text-cyan-400 font-bold">%20</span> komisyon kazanırsın.</p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-gradient-to-b from-violet-500/60 to-violet-500/20" />
                    <p className="text-[10px] text-violet-400 font-bold bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">Onlar da davet ediyor</p>
                    <div className="w-px h-4 bg-gradient-to-b from-violet-500/20 to-transparent" />
                  </div>
                </div>

                {/* 2. Seviye */}
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">2</div>
                      <p className="text-white font-black text-sm">2. Seviye Referansların</p>
                    </div>
                    <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-black rounded-full">%10 KOMİSYON</span>
                  </div>
                  <div className="flex gap-2">
                    {['Zeynep', 'Can', 'Selin', '+daha fazla'].map((n, i) => (
                      <div key={i} className="flex-1 py-2 px-2 bg-slate-800/60 rounded-xl border border-slate-700/40 text-center">
                        <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-1">
                          <Users size={12} className="text-violet-400" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">{n}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-2">1. seviyenin davet ettikleri pro üye olursa <span className="text-violet-400 font-bold">%10</span> komisyon kazanırsın. Sen hiç çabalamadan!</p>
                </div>

                {/* Total */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp size={16} className="text-emerald-400 shrink-0" />
                  <p className="text-emerald-300 text-xs font-semibold">Ağın büyüdükçe kazancın katlanır — sınır yok!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="py-28 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-violet-400 mb-3 block">Fiyatlandırma</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Sana Özel Planlar</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Hedeflerinize en uygun planı seçin ve hemen başlayın.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* FREE */}
            <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-8">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Ücretsiz</p>
              <p className="text-5xl font-black text-white mb-1">₺0 <span className="text-lg font-medium text-slate-400">/ yıl</span></p>
              <p className="text-slate-500 text-sm mb-7">Temel özellikler ile başlayın</p>
              <ul className="space-y-3.5 mb-8">
                {freePlan.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold text-center hover:border-slate-600 hover:text-white transition-all">
                Ücretsiz Başla
              </Link>
            </div>

            {/* PRO */}
            <div className="relative rounded-2xl overflow-hidden p-8"
              style={{ background: 'linear-gradient(135deg,#1a0533,#0f0a2e,#0a1628)', boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}>
              <div className="absolute inset-0 border border-violet-500/30 rounded-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-56 h-56 bg-violet-600/15 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Pro</p>
                  <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-black rounded-full tracking-wider">EN POPÜLER</span>
                </div>
                <div className="flex items-baseline gap-3 mb-1">
                  <p className="text-5xl font-black text-white">₺2.499</p>
                  <p className="text-lg font-medium text-slate-400">/ yıl</p>
                </div>
                <p className="text-slate-500 text-sm line-through mb-7">6.249 TL</p>
                <ul className="space-y-3.5 mb-8">
                  {proPlan.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className="block w-full py-4 rounded-2xl text-white font-bold text-sm text-center shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)' }}>
                  Pro Üye Ol — ₺2.499
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-sm pt-16 pb-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                  <Zap size={15} className="text-white" fill="white" />
                </div>
                <span className="text-base font-extrabold text-white tracking-tight">
                  EDU<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">REFERANS</span>
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">Türkiye&apos;nin en gelişmiş referans tabanlı eğitim platformu.</p>
            </div>

            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{group}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800/60">
            <p className="text-xs text-slate-600">© 2026 EduReferans. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Gizlilik Politikası</a>
              <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Kullanım Şartları</a>
              <div className="flex items-center gap-2 ml-2">
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-600 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all"
                    aria-label={s.name}>
                    <s.Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
