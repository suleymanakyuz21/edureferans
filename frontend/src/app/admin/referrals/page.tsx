'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Network, TrendingUp, Search, Award, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const mockConversionData = [
  { name: 'Oca', rate: 12 },
  { name: 'Şub', rate: 18 },
  { name: 'Mar', rate: 25 },
  { name: 'Nis', rate: 22 },
  { name: 'May', rate: 30 },
  { name: 'Haz', rate: 45 },
];

const mockLevelData = [
  { name: 'Level 1 (Doğrudan)', value: 400 },
  { name: 'Level 2 (Dolaylı)', value: 150 },
];
const COLORS = ['#22d3ee', '#3b82f6'];

const mockTopReferrers = [
  { id: 1, name: 'Süleyman Akyüz', email: 'suleyman@example.com', totalRef: 145, activeRef: 120, earnings: 4500, level: 'Diamond' },
  { id: 2, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', totalRef: 89, activeRef: 65, earnings: 2100, level: 'Gold' },
  { id: 3, name: 'Zeynep Kaya', email: 'zeynep@example.com', totalRef: 64, activeRef: 50, earnings: 1850, level: 'Silver' },
  { id: 4, name: 'Can Demir', email: 'can@example.com', totalRef: 42, activeRef: 30, earnings: 950, level: 'Bronze' },
];

export default function AdminReferralsPage() {
  const [search, setSearch] = useState('');

  const filteredReferrers = mockTopReferrers.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Referans Ağ Analizi</h2>
        <p className="text-sm text-slate-400 mt-1">Platformdaki referans sisteminin performansını ve en iyi referans verenleri inceleyin.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Toplam Referans', value: '2,845', icon: Network, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { title: 'Aktif Dönüşüm', value: '%34.2', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
          { title: 'Dağıtılan Ödül', value: '₺45,200', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { title: 'Ağ Derinliği', value: 'Level 2', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none", stat.bg)} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm"
        >
          <h3 className="text-base font-bold text-white mb-6">Referans Dönüşüm Oranı (%)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockConversionData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="rate" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm flex flex-col items-center"
        >
          <h3 className="text-base font-bold text-white mb-2 self-start">Ağ Dağılımı</h3>
          <p className="text-xs text-slate-400 self-start mb-4">Level 1 vs Level 2 oranları</p>
          <div className="h-[200px] w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {mockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid #1E293B', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex justify-center gap-4 mt-2">
            {mockLevelData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Referrers Table */}
      <div className="bg-[#0F172A]/80 border border-[#1E293B] rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-white">Liderlik Tablosu (En Çok Referans Yapanlar)</h3>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0B0F19] border border-[#1E293B] rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B0F19]/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Seviye</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Toplam Kayıt</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktif Premium</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Toplam Kazanç</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {filteredReferrers.map((user, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={user.id} 
                  className="hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-md border",
                      user.level === 'Diamond' && "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                      user.level === 'Gold' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                      user.level === 'Silver' && "bg-slate-400/10 text-slate-300 border-slate-400/20",
                      user.level === 'Bronze' && "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}>
                      {user.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-300">{user.totalRef}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-300">{user.activeRef}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold text-emerald-400">₺{user.earnings.toLocaleString()}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
