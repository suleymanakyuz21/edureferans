'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, ArrowDownRight, Clock, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function WalletPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery<{
    data: {
      balance: number;
      commissions: Array<{ id: number; amount: number; level: number; createdAt: string; fromUser: { name: string } }>;
    };
  }>({
    queryKey: ['referral-stats'],
    queryFn: () => api.get('/referral/stats').then((r) => r.data),
  });

  const balance = data?.data.balance ?? user?.balance ?? 0;
  const commissions = data?.data.commissions ?? [];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-black mb-1 text-[var(--text-primary)]">Cüzdanım</h1>
        <p className="text-sm text-[var(--text-secondary)]">Bakiyeni ve işlem geçmişini yönet.</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-7 rounded-2xl text-white relative overflow-hidden shadow-[0_0_60px_rgba(14,165,233,0.12)]"
        style={{ background: 'linear-gradient(135deg, #0c2340 0%, #071e36 60%, #0b1120 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#0ea5e9]/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#06b6d4]/8 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Wallet size={16} />
            <span className="text-xs font-medium uppercase tracking-widest">Mevcut Bakiye</span>
          </div>
          <p className="text-5xl font-black mb-1">
            ₺{isLoading ? '...' : balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mb-6">Son güncelleme: Şimdi</p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-[#0ea5e9]/30 rounded-xl text-sm font-semibold transition-all">
            <ArrowDownRight size={15} />
            Para Çek (Yakında)
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-3">
            <ArrowUpRight size={14} className="text-emerald-400" /> Bu Ay Kazanılan
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">
            ₺{isLoading ? '...' : (0).toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="p-5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs mb-3">
            <TrendingUp size={14} className="text-[var(--accent-primary)]" /> Toplam İşlem
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">{commissions.length}</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
        <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">İşlem Geçmişi</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 skeleton rounded-xl" />
            ))}
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-40">
              <TrendingUp size={24} className="text-[var(--accent-primary)]" />
            </div>
            <p className="text-[var(--text-secondary)] text-sm">Henüz bir işlem bulunmuyor.</p>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              Referansların premium olduğunda komisyonlar burada görünecek.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {commissions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                      tx.level === 1
                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                        : 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]'
                    }`}
                  >
                    L{tx.level}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {tx.fromUser.name} üzerinden komisyon
                    </p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {new Date(tx.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-400 font-black text-base">
                  +₺{tx.amount.toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
