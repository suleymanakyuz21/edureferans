'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Award, BookOpen, Star, TrendingUp, Zap, ShieldCheck, Code, BarChart, Heart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Home() {
  const stats = [
    { label: 'Aktif Öğrenci', value: '10K+', icon: Users },
    { label: 'Uzman Eğitmen', value: '250+', icon: Award },
    { label: 'Online Kurs', value: '500+', icon: BookOpen },
    { label: 'Referans Kazancı', value: '₺2M+', icon: TrendingUp },
  ];

  const categories = [
    { name: 'Yazılım & IT', icon: Code, gradient: 'from-[#0ea5e9] to-[#06b6d4]' },
    { name: 'Dijital Pazarlama', icon: BarChart, gradient: 'from-[#06b6d4] to-[#0284c7]' },
    { name: 'Tasarım & UI/UX', icon: Star, gradient: 'from-[#0ea5e9] to-[#7c3aed]' },
    { name: 'Kişisel Gelişim', icon: Heart, gradient: 'from-[#06b6d4] to-[#10b981]' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0ea5e9]/8 blur-[120px] rounded-full animate-blob" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#06b6d4]/6 blur-[100px] rounded-full animate-blob-delay" />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 -z-10 opacity-[0.015] bg-[linear-gradient(rgba(14,165,233,1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,1)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/8 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-semibold mb-8 tracking-wide uppercase"
            >
              <Zap size={12} fill="currentColor" />
              <span>Yeni Nesil Eğitim &amp; Referans Platformu</span>
            </motion.div>

            {/* Hero Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.04] mb-8">
              Yeteneklerini{' '}
              <span className="text-gradient relative inline-block">
                Gelire
                <motion.span
                  className="absolute -inset-2 bg-[var(--accent-primary)]/5 rounded-2xl blur-xl -z-10"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </span>{' '}
              Dönüştür
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              EduReferans ile öğrenirken kazan, kazandırırken büyü. Türkiye&apos;nin en gelişmiş referans tabanlı eğitim ekosistemi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl btn-gradient text-white font-semibold text-base flex items-center gap-2 group"
              >
                Ücretsiz Kayıt Ol
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 rounded-xl btn-glass text-[var(--text-primary)] font-semibold text-base flex items-center gap-2 group">
                <Play size={18} className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
                Sistemi Keşfet
              </button>
            </div>
          </motion.div>

          {/* Floating trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mt-16 text-xs text-[var(--text-muted)] font-medium"
          >
            {['Kredi kartı gerekmez', 'Ücretsiz başlayın', '7/24 destek', 'SSL güvenli'].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)]" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="bg-[var(--bg-secondary)] py-10 border-y border-[var(--border-color)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center group"
              >
                <div className="text-3xl md:text-5xl font-black mb-1 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section id="categories" className="py-28 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-primary)] mb-3 block">Kategoriler</span>
            <h2 className="text-4xl font-extrabold mb-4">Popüler Kategoriler</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              En çok tercih edilen alanlarda uzmanlaşın ve kariyerinize yön verin.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-7 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-center hover:border-[var(--accent-primary)]/30 hover:shadow-[0_0_24px_rgba(14,165,233,0.08)] transition-all cursor-pointer group"
              >
                <div className={cn(
                  'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg',
                  cat.gradient
                )}>
                  <cat.icon size={26} className="text-white" />
                </div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REFERRAL SECTION ─── */}
      <section id="referral" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-20"
            style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0b1120 50%, #071e36 100%)' }}>
            {/* Subtle dot grid */}
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:28px_28px]" />
            {/* Glow orb */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0ea5e9]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#06b6d4]/8 blur-[80px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[var(--accent-secondary)] mb-6">
                  <Zap size={11} fill="currentColor" /> Referans Sistemi
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Öğrenirken{' '}
                  <span className="text-gradient">Kazanmaya</span>{' '}
                  Başla
                </h2>
                <p className="text-slate-400 text-base mb-10 leading-relaxed">
                  Referans sistemimiz sayesinde, platforma kazandırdığın her üyenin abonelik ve kurs alımlarından komisyon kazanırsın. Üstelik 2 kademeli sistemle kazancın katlanarak artar!
                </p>
                <ul className="space-y-3 mb-10">
                  {[
                    'Sınırsız Referans İmkanı',
                    '%20 Birinci Seviye Komisyon',
                    '%10 İkinci Seviye Komisyon',
                    'Anında Çekilebilir Bakiye',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                      <ShieldCheck size={16} className="text-[var(--accent-secondary)] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/referral-info"
                  className="inline-flex items-center gap-2 px-8 py-3.5 btn-gradient text-white font-semibold rounded-xl text-sm group"
                >
                  Nasıl Çalışır?
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Network visualization */}
              <div className="relative h-[360px] flex items-center justify-center">
                <div className="w-28 h-28 bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] rounded-full flex items-center justify-center text-white font-black text-lg z-20 shadow-[0_0_40px_rgba(14,165,233,0.4)] animate-pulse">
                  SEN
                </div>
                <div className="absolute top-12 right-16 w-20 h-20 bg-white/5 backdrop-blur-md rounded-full border border-[#0ea5e9]/30 flex items-center justify-center text-white/80 text-sm font-bold z-10 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                  Ref 1
                </div>
                <div className="absolute bottom-12 right-24 w-16 h-16 bg-white/5 backdrop-blur-md rounded-full border border-[#06b6d4]/30 flex items-center justify-center text-white/70 text-xs font-bold z-10">
                  Ref 2
                </div>
                <div className="absolute top-1/2 right-2 w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-[#0ea5e9]/20 flex items-center justify-center text-white/60 text-xs font-bold z-10">
                  Ref 3
                </div>
                <svg className="absolute inset-0 w-full h-full -z-0">
                  <line x1="50%" y1="50%" x2="75%" y2="22%" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4,6" opacity="0.35" />
                  <line x1="50%" y1="50%" x2="72%" y2="78%" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4,6" opacity="0.3" />
                  <line x1="50%" y1="50%" x2="92%" y2="50%" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4,6" opacity="0.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
