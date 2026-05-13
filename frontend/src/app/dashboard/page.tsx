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
  Check
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const stats = [
    { name: 'Toplam Kazanç', value: '₺0.00', icon: Wallet, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Aktif Referanslar', value: '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Puan Sıralaması', value: '#--', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Aylık Artış', value: '%0', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-black mb-2">Merhaba, {user?.name || 'Kullanıcı'}! 👋</h1>
        <p className="text-[var(--text-secondary)]">Bugün yeni bir şeyler öğrenmeye veya ağını genişletmeye ne dersin?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-[var(--text-secondary)]">Bu Ay</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">{stat.name}</p>
            <p className="text-2xl font-black mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referral Link Card */}
        <div className="lg:col-span-2 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-4">Ağını Genişlet, Kazancını Artır!</h2>
            <p className="text-indigo-100 mb-8 max-w-md">Referans linkini paylaşarak her yeni üyeden komisyon kazanmaya devam et.</p>
            
            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <input 
                type="text" 
                readOnly 
                value={referralLink}
                className="flex-1 bg-transparent border-none px-4 text-sm font-medium focus:outline-none truncate"
              />
              <button 
                onClick={handleCopy}
                className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shrink-0"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Progress */}
        <div className="p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl">
          <h3 className="text-lg font-bold mb-6">Öğrenme Durumu</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-secondary)]">Tamamlanan Kurslar</span>
                <span className="font-bold">0/0</span>
              </div>
              <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div className="w-0 h-full bg-indigo-500 transition-all duration-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-secondary)]">Haftalık Hedef</span>
                <span className="font-bold">0%</span>
              </div>
              <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div className="w-0 h-full bg-purple-500 transition-all duration-500" />
              </div>
            </div>
            <button className="w-full py-4 border border-[var(--border-color)] rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-[var(--bg-secondary)] transition-all">
              Tüm Eğitimleri Gör <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity / Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6">Son Aktiviteler</h3>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4 opacity-50">
              <TrendingUp size={32} />
            </div>
            <p className="text-[var(--text-secondary)] text-sm">Henüz bir aktivite bulunmuyor.</p>
            <p className="text-[var(--text-secondary)] text-xs mt-2 opacity-70">Kurs tamamladığında veya referans kazandığında burada görünecek.</p>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6">Sana Özel Tavsiyeler</h3>
          <div className="space-y-4">
            {[
              { title: 'Next.js ile Modern Web Geliştirme', level: 'Başlangıç', duration: '8 saat' },
              { title: 'Dijital Pazarlama Temelleri', level: 'Orta', duration: '5 saat' },
            ].map((course, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all cursor-pointer border border-transparent hover:border-[var(--border-color)] group">
                <div className="w-16 h-14 bg-indigo-500/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <PlayCircle size={22} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{course.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{course.level} · {course.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
