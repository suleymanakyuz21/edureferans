'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, ArrowDownRight, Clock, ArrowUpRight, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import PremiumLock from '@/components/shared/PremiumLock';

interface Commission {
  id: number;
  amount: number;
  level: number;
  createdAt: string;
  fromUser: { name: string };
}

interface ReferralData {
  balance: number;
  commissions: Commission[];
}

interface PayoutRequest {
  id: number;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
}

export default function WalletPage() {
  const { user } = useAuthStore();
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'IBAN' | 'PAPARA'>('IBAN');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutIban, setPayoutIban] = useState('');
  const [payoutPapara, setPayoutPapara] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState('');

  const { data, isLoading, refetch } = useQuery<{ data: ReferralData }>({
    queryKey: ['referral-stats'],
    queryFn: () => api.get('/referral/stats').then((r) => r.data),
  });

  const { data: payoutsData, refetch: refetchPayouts } = useQuery<{ data: PayoutRequest[] }>({
    queryKey: ['my-payouts'],
    queryFn: () => api.get('/wallet/payout').then((r) => r.data),
  });

  const balance = data?.data.balance ?? user?.balance ?? 0;
  const commissions = data?.data.commissions ?? [];
  const payouts = payoutsData?.data ?? [];

  const now = new Date();
  const monthlyEarnings = commissions
    .filter((c) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, c) => sum + c.amount, 0);

  const handlePayout = async () => {
    setPayoutError('');
    setPayoutSuccess('');
    const amount = parseFloat(payoutAmount);
    if (!amount || amount < 100) {
      setPayoutError('Minimum çekim tutarı ₺100 olmalıdır.');
      return;
    }
    if (amount > balance) {
      setPayoutError('Yetersiz bakiye.');
      return;
    }
    if (payoutMethod === 'IBAN' && !payoutIban.match(/^TR\d{24}$/)) {
      setPayoutError('Geçerli bir IBAN giriniz (TRXX XXXX...) — boşluk olmadan.');
      return;
    }
    if (payoutMethod === 'PAPARA' && payoutPapara.length < 5) {
      setPayoutError('Geçerli bir Papara hesap numarası giriniz.');
      return;
    }

    setPayoutLoading(true);
    try {
      await api.post('/wallet/payout', {
        method: payoutMethod,
        amount,
        ...(payoutMethod === 'IBAN' ? { iban: payoutIban } : { paparaId: payoutPapara }),
      });
      setPayoutSuccess('Çekim talebiniz alındı. 1-3 iş günü içinde işleme alınacaktır.');
      setPayoutAmount('');
      setPayoutIban('');
      setPayoutPapara('');
      refetch();
      refetchPayouts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setPayoutError(e.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setPayoutLoading(false);
    }
  };

  if (!user?.isPremium) {
    return (
      <div className="space-y-7">
        <div>
          <h1 className="text-2xl font-black mb-1 text-[var(--text-primary)]">Cüzdanım</h1>
          <p className="text-sm text-[var(--text-secondary)]">Bakiyeni ve işlem geçmişini yönet.</p>
        </div>
        <PremiumLock
          title="Cüzdanınız Kilitli"
          description="Bakiye hareketlerini görüntülemek ve para çekmek için Pro Üye olmanız gerekmektedir."
        />
      </div>
    );
  }

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
          <p className="text-xs text-slate-500 mb-6">Onaylanan komisyonlar dahil</p>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={balance < 100}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-[0_0_16px_rgba(14,165,233,0.25)]"
          >
            <ArrowDownRight size={15} />
            Para Çek {balance < 100 && '(min. ₺100)'}
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
            ₺{isLoading ? '...' : monthlyEarnings.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
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
        <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">Komisyon Geçmişi</h3>
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 skeleton rounded-xl" />)}</div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-40">
              <TrendingUp size={24} className="text-[var(--accent-primary)]" />
            </div>
            <p className="text-[var(--text-secondary)] text-sm">Henüz bir işlem bulunmuyor.</p>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">Referansların premium olduğunda komisyonlar burada görünecek.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {commissions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${tx.level === 1 ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]'}`}>
                    L{tx.level}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{tx.fromUser.name} üzerinden komisyon</p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {new Date(tx.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-400 font-black text-base">+₺{tx.amount.toLocaleString('tr-TR')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout History */}
      {payouts.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-5 text-[var(--text-primary)]">Çekim Geçmişi</h3>
          <div className="divide-y divide-[var(--border-color)]">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{p.method} çekimi</p>
                  <p className="text-xs text-[var(--text-muted)]">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-orange-400">-₺{p.amount.toLocaleString('tr-TR')}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : p.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                    {p.status === 'COMPLETED' ? 'Tamamlandı' : p.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[var(--text-primary)]">Para Çek</h3>
              <button onClick={() => { setShowPayoutModal(false); setPayoutError(''); setPayoutSuccess(''); }} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <X size={18} className="text-[var(--text-muted)]" />
              </button>
            </div>

            {payoutSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <ArrowDownRight size={28} className="text-green-400" />
                </div>
                <p className="text-green-400 font-bold mb-2">Talep Oluşturuldu!</p>
                <p className="text-sm text-[var(--text-secondary)]">{payoutSuccess}</p>
                <button onClick={() => { setShowPayoutModal(false); setPayoutSuccess(''); }} className="mt-5 px-6 py-2.5 btn-gradient text-white text-sm font-semibold rounded-xl">
                  Tamam
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  Mevcut bakiyeniz: <span className="font-black text-[var(--text-primary)]">₺{balance.toLocaleString('tr-TR')}</span>
                </p>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Ödeme Yöntemi</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['IBAN', 'PAPARA'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPayoutMethod(m)}
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${payoutMethod === m ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]' : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/20'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Tutar (min. ₺100)</label>
                  <input
                    type="number"
                    min={100}
                    max={balance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 transition-all text-[var(--text-primary)]"
                  />
                </div>

                {payoutMethod === 'IBAN' ? (
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">IBAN (boşluksuz)</label>
                    <input
                      type="text"
                      value={payoutIban}
                      onChange={(e) => setPayoutIban(e.target.value.replace(/\s/g, '').toUpperCase())}
                      placeholder="TR000000000000000000000000"
                      maxLength={26}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:border-[var(--accent-primary)]/50 transition-all text-[var(--text-primary)]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Papara Hesap No</label>
                    <input
                      type="text"
                      value={payoutPapara}
                      onChange={(e) => setPayoutPapara(e.target.value)}
                      placeholder="1234567890"
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:border-[var(--accent-primary)]/50 transition-all text-[var(--text-primary)]"
                    />
                  </div>
                )}

                {payoutError && (
                  <p className="text-sm text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">{payoutError}</p>
                )}

                <button
                  onClick={handlePayout}
                  disabled={payoutLoading}
                  className="w-full py-3.5 btn-gradient text-white font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {payoutLoading ? 'İşleniyor...' : 'Çekim Talebi Oluştur'}
                </button>

                <p className="text-xs text-[var(--text-muted)] text-center">
                  Çekim talepleri 1-3 iş günü içinde işleme alınır.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
