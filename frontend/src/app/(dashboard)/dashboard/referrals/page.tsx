'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, ChevronRight, Crown, Clock } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ReferralStats {
  balance: number;
  referralCount: number;
  level2Count: number;
  referrals: Array<{ id: number; name: string; createdAt: string; isPremium: boolean }>;
  commissions: Array<{ id: number; amount: number; level: number; createdAt: string; fromUser: { name: string } }>;
}

export default function ReferralsPage() {
  const { data, isLoading } = useQuery<{ data: ReferralStats }>({
    queryKey: ['referral-stats'],
    queryFn: () => api.get('/referral/stats').then(r => r.data),
  });

  const stats = data?.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">Referanslarım</h1>
        <p className="text-[var(--text-secondary)]">Ağını izle ve komisyon geçmişini takip et.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Level 1 Referans', value: isLoading ? '...' : stats?.referralCount ?? 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Level 2 Referans', value: isLoading ? '...' : stats?.level2Count ?? 0, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Toplam Kazanç', value: isLoading ? '...' : `₺${(stats?.balance ?? 0).toLocaleString('tr-TR')}`, icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl"
          >
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', stat.bg, stat.color)}>
              <stat.icon size={22} />
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">{stat.label}</p>
            <p className="text-3xl font-black">{String(stat.value)}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referrals List */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Level 1 Referanslarım</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-[var(--bg-secondary)] rounded-xl animate-pulse" />)}
            </div>
          ) : stats?.referrals.length === 0 ? (
            <div className="text-center py-10">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-[var(--text-secondary)] text-sm">Henüz referansın yok.</p>
              <p className="text-xs text-[var(--text-secondary)] opacity-60 mt-1">Referans linkini paylaşmaya başla!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-secondary)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm font-bold">
                      {ref.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{ref.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {new Date(ref.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  {ref.isPremium && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 font-bold">
                      Premium
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commission History */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Komisyon Geçmişi</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-[var(--bg-secondary)] rounded-xl animate-pulse" />)}
            </div>
          ) : stats?.commissions.length === 0 ? (
            <div className="text-center py-10">
              <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-[var(--text-secondary)] text-sm">Henüz komisyon kazanmadın.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.commissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-secondary)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold',
                      commission.level === 1 ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                    )}>
                      L{commission.level}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{commission.fromUser.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(commission.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-500 font-black">+₺{commission.amount.toLocaleString('tr-TR')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
