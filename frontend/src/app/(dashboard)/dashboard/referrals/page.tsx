'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Crown, Clock } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ReferralStats {
  balance: number;
  referralCount: number;
  level2Count: number;
  referrals: Array<{ id: number; name: string; createdAt: string; isPremium: boolean }>;
  commissions: Array<{
    id: number;
    amount: number;
    level: number;
    createdAt: string;
    fromUser: { name: string };
  }>;
}

export default function ReferralsPage() {
  const { data, isLoading } = useQuery<{ data: ReferralStats }>({
    queryKey: ['referral-stats'],
    queryFn: () => api.get('/referral/stats').then((r) => r.data),
  });

  const stats = data?.data;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-black mb-1 text-[var(--text-primary)]">Referanslarım</h1>
        <p className="text-sm text-[var(--text-secondary)]">Ağını izle ve komisyon geçmişini takip et.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: 'Level 1 Referans',
            value: isLoading ? '...' : stats?.referralCount ?? 0,
            icon: Users,
            color: 'text-[var(--accent-primary)]',
            bg: 'bg-[var(--accent-primary)]/10',
            border: 'border-[var(--accent-primary)]/15',
          },
          {
            label: 'Level 2 Referans',
            value: isLoading ? '...' : stats?.level2Count ?? 0,
            icon: TrendingUp,
            color: 'text-[var(--accent-secondary)]',
            bg: 'bg-[var(--accent-secondary)]/10',
            border: 'border-[var(--accent-secondary)]/15',
          },
          {
            label: 'Toplam Kazanç',
            value: isLoading ? '...' : `₺${(stats?.balance ?? 0).toLocaleString('tr-TR')}`,
            icon: Crown,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/15',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              'p-5 bg-[var(--card-bg)] border rounded-2xl hover-glow transition-all',
              stat.border
            )}
          >
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4', stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">{stat.label}</p>
            <p className="text-3xl font-black text-[var(--text-primary)]">{String(stat.value)}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referrals List */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">Level 1 Referanslarım</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 skeleton rounded-xl" />
              ))}
            </div>
          ) : stats?.referrals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-40">
                <Users size={24} className="text-[var(--accent-primary)]" />
              </div>
              <p className="text-[var(--text-secondary)] text-sm">Henüz referansın yok.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1.5">Referans linkini paylaşmaya başla!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center text-sm font-bold border border-[var(--accent-primary)]/15">
                      {ref.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{ref.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(ref.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  {ref.isPremium && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 font-semibold border border-yellow-500/15">
                      Premium
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commission History */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">Komisyon Geçmişi</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 skeleton rounded-xl" />
              ))}
            </div>
          ) : stats?.commissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-40">
                <TrendingUp size={24} className="text-[var(--accent-secondary)]" />
              </div>
              <p className="text-[var(--text-secondary)] text-sm">Henüz komisyon kazanmadın.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.commissions.map((commission) => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border',
                        commission.level === 1
                          ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/15'
                          : 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border-[var(--accent-secondary)]/15'
                      )}
                    >
                      L{commission.level}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{commission.fromUser.name}</p>
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {new Date(commission.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">
                    +₺{commission.amount.toLocaleString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
