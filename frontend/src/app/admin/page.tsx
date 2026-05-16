'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, CreditCard, Video, Activity, TrendingUp } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const mockData = [
  { name: 'Oca', users: 400, revenue: 2400 },
  { name: 'Şub', users: 300, revenue: 1398 },
  { name: 'Mar', users: 200, revenue: 9800 },
  { name: 'Nis', users: 278, revenue: 3908 },
  { name: 'May', users: 189, revenue: 4800 },
  { name: 'Haz', users: 239, revenue: 3800 },
  { name: 'Tem', users: 349, revenue: 4300 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data.data);
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-cyan-400">Yükleniyor...</div>;
  }

  const statCards = [
    { title: 'Toplam Kullanıcı', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Premium Üyeler', value: stats?.premiumUsers || 0, icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Toplam Gelir', value: `₺${stats?.totalRevenue || 0}`, icon: CreditCard, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Aktif Kurslar', value: stats?.totalCourses || 0, icon: Video, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Bekleyen Ödemeler', value: stats?.pendingPayouts || 0, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { title: 'Dönüşüm Oranı', value: `${((stats?.premiumUsers / stats?.totalUsers) * 100 || 0).toFixed(1)}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Platform Overview</h2>
        <p className="text-sm text-slate-400 mt-1">Sistem metriklerini ve gerçek zamanlı analizleri görüntüleyin.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm"
        >
          <h3 className="text-base font-bold text-white mb-6">Kullanıcı Büyümesi</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #1E293B', borderRadius: '12px' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area type="monotone" dataKey="users" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm"
        >
          <h3 className="text-base font-bold text-white mb-6">Gelir Analizi</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #1E293B', borderRadius: '12px' }}
                  itemStyle={{ color: '#4ade80' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
