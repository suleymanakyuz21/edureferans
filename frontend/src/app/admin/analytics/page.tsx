'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';

const mockDailyRegistrations = [
  { day: 'Pzt', users: 12 }, { day: 'Sal', users: 19 }, { day: 'Çar', users: 15 },
  { day: 'Per', users: 22 }, { day: 'Cum', users: 30 }, { day: 'Cmt', users: 45 }, { day: 'Paz', users: 38 }
];

const mockCoursePerformance = [
  { name: 'React', views: 4000, completion: 65 },
  { name: 'Next.js', views: 3000, completion: 75 },
  { name: 'Tailwind', views: 2000, completion: 80 },
  { name: 'Node.js', views: 2780, completion: 55 },
  { name: 'Prisma', views: 1890, completion: 48 },
];

const mockRetention = [
  { month: 'Oca', rate: 100 }, { month: 'Şub', rate: 85 }, { month: 'Mar', rate: 75 },
  { month: 'Nis', rate: 65 }, { month: 'May', rate: 60 }, { month: 'Haz', rate: 58 }
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Gelişmiş Analitikler</h2>
          <p className="text-sm text-slate-400 mt-1">Kapsamlı metrikler ve platform büyüme analizleri.</p>
        </div>
        <div className="flex bg-[#0F172A] border border-[#1E293B] rounded-lg p-1">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                timeRange === range ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-white"
              )}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Registrations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">Günlük Kayıtlar</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDailyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #1E293B', borderRadius: '12px' }}
                />
                <Bar dataKey="users" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Retention Analytics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-purple-400" />
            <h3 className="text-base font-bold text-white">Kullanıcı Tutma (Retention) Oranı %</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRetention}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #1E293B', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#c084fc" strokeWidth={3} dot={{ fill: '#c084fc', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Course Performance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">Kurs Performansı ve Tamamlama Oranları</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockCoursePerformance}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #1E293B', borderRadius: '12px' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="views" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Line yAxisId="right" type="monotone" dataKey="completion" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
