'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, ArrowDownRight, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function WalletPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery<{ data: { balance: number; commissions: Array<{ id: number; amount: number; level: number; createdAt: string; fromUser: { name: string } }> } }>({
    queryKey: ['referral-stats'],
    queryFn: () => api.get('/referral/stats').then(r => r.data),
  });

  const balance = data?.data.balance ?? user?.balance ?? 0;
  const commissions = data?.data.commissions ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">Cüzdanım</h1>
        <p className="text-[var(--text-secondary)]">Bakiyeni ve işlem geçmişini yönet.</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 mb-4">
            <Wallet size={18} />
            <span className="text-sm font-medium">Mevcut Bakiye</span>
          </div>
          <p className="text-5xl font-black mb-6">
            ₺{isLoading ? '...' : balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <ArrowDownRight size={16} />
            Para Çek (Yakında)
          </button>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6">
        <h3 className="text-lg font-bold mb-6">İşlem Geçmişi</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-[var(--bg-secondary)] rounded-xl animate-pulse" />)}
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-[var(--text-secondary)]">Henüz bir işlem bulunmuyor.</p>
            <p className="text-xs text-[var(--text-secondary)] opacity-60 mt-2">
              Referansların premium olduğunda komisyonlar burada görünecek.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {commissions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                    tx.level === 1 ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                  }`}>
                    L{tx.level}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{tx.fromUser.name} üzerinden komisyon</p>
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {new Date(tx.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="text-green-500 font-black text-lg">+₺{tx.amount.toLocaleString('tr-TR')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
