'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Award, BookOpen, Star, TrendingUp, Zap, ShieldCheck } from 'lucide-react';
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
    { name: 'Yazılım & IT', icon: Zap, color: 'text-yellow-500' },
    { name: 'Dijital Pazarlama', icon: TrendingUp, color: 'text-blue-500' },
    { name: 'Tasarım & UI/UX', icon: Star, color: 'text-purple-500' },
    { name: 'Kişisel Gelişim', icon: Award, color: 'text-green-500' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] -z-10 rounded-full" />
        
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-semibold mb-8">
              <TrendingUp size={16} />
              <span>Yeni Nesil Eğitim & Referans Platformu</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] mb-10">
              Yeteneklerini <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Gelire</span> Dönüştür
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
              EduReferans ile öğrenirken kazan, kazandırırken büyü. Türkiye'nin en gelişmiş referans tabanlı eğitim ekosistemi.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/register" 
                className="px-10 py-5 rounded-full bg-[var(--gradient-accent)] text-white font-bold text-lg flex items-center gap-2 hover:scale-105 transition-all shadow-2xl shadow-indigo-500/40"
              >
                Ücretsiz Kayıt Ol <ArrowRight size={22} />
              </Link>
              <button className="px-10 py-5 rounded-full border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-lg flex items-center gap-2 hover:bg-[var(--bg-secondary)] transition-all">
                <Play size={22} className="fill-current" /> Sistemi Keşfet
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Area */}
      <section className="bg-[var(--bg-secondary)] py-12 border-y border-[var(--border-color)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl md:text-5xl font-black mb-2 group-hover:text-indigo-500 transition-colors">{stat.value}</div>
                <div className="text-xs md:text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Popüler Kategoriler</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">En çok tercih edilen alanlarda uzmanlaşın ve kariyerinize yön verin.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl text-center hover:border-indigo-500/50 transition-all cursor-pointer group"
              >
                <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform", cat.color)}>
                  <cat.icon size={32} />
                </div>
                <h3 className="font-bold text-lg">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Info */}
      <section id="referral" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:30px_30px]" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Öğrenirken <span className="text-yellow-400">Kazanmaya</span> Başla
                </h2>
                <p className="text-indigo-100 text-lg mb-12 leading-relaxed">
                  Referans sistemimiz sayesinde, platforma kazandırdığın her üyenin abonelik ve kurs alımlarından komisyon kazanırsın. Üstelik 2 kademeli sistemle kazancın katlanarak artar!
                </p>
                <ul className="space-y-4 mb-12">
                  {[
                    'Sınırsız Referans İmkanı',
                    '%20 Birinci Seviye Komisyon',
                    '%10 İkinci Seviye Komisyon',
                    'Anında Çekilebilir Bakiye'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <ShieldCheck className="text-yellow-400" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/referral-info" className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-xl">
                  Nasıl Çalışır?
                </Link>
              </div>
              <div className="relative h-[400px] flex items-center justify-center">
                {/* Visual representation of network */}
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-indigo-600 font-black text-2xl z-20 shadow-2xl animate-pulse">SEN</div>
                <div className="absolute top-10 right-10 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white font-bold z-10">Ref 1</div>
                <div className="absolute bottom-10 right-20 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white font-bold z-10">Ref 2</div>
                <div className="absolute top-1/2 -right-4 w-16 h-16 bg-white/5 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white font-bold z-10">Ref 3</div>
                
                {/* Connection Lines (SVGs) */}
                <svg className="absolute inset-0 w-full h-full -z-0">
                    <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="white" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
                    <line x1="50%" y1="50%" x2="70%" y2="75%" stroke="white" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
                    <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
