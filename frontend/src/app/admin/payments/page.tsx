'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, RefreshCcw, MoreVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { cn } from '@/lib/utils';

interface PayoutRequest {
  id: number;
  amount: number;
  method: string;
  status: string;
  iban?: string;
  paparaId?: string;
  createdAt: string;
  adminNote?: string;
  user: { id: number; name: string; email: string };
}

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ data: { requests: PayoutRequest[] } }>({
    queryKey: ['admin-payouts', filterStatus],
    queryFn: () => adminService.getPayouts({ status: filterStatus }).then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: (payload: { id: number; status: 'PROCESSING' | 'COMPLETED' | 'REJECTED'; adminNote?: string }) =>
      adminService.updatePayout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      setRejectTarget(null);
      setRejectNote('');
      setActionLoading(null);
    },
    onError: () => setActionLoading(null),
  });

  const handleAction = (id: number, status: 'PROCESSING' | 'COMPLETED' | 'REJECTED', note?: string) => {
    setActionLoading(id);
    mutation.mutate({ id, status, adminNote: note });
  };

  const requests = data?.data?.requests ?? [];
  const filtered = requests.filter((p) => {
    const matchSearch =
      p.user.name.toLowerCase().includes(search.toLowerCase()) ||
      p.user.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20"><Clock size={12} /> BEKLEYEN</span>;
      case 'PROCESSING':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20"><RefreshCcw size={12} className="animate-spin" /> İŞLENİYOR</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20"><CheckCircle size={12} /> TAMAMLANDI</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20"><XCircle size={12} /> REDDEDİLDİ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Ödeme Yönetimi</h2>
          <p className="text-sm text-slate-400 mt-1">Kullanıcıların çekim taleplerini inceleyin ve yönetin.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 text-white placeholder:text-slate-500 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48 px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 text-white appearance-none transition-all"
        >
          <option value="all">Tüm Statüler</option>
          <option value="PENDING">Bekleyen</option>
          <option value="PROCESSING">İşlenen</option>
          <option value="COMPLETED">Tamamlanan</option>
          <option value="REJECTED">Reddedilen</option>
        </select>
      </div>

      <div className="bg-[#0F172A]/80 border border-[#1E293B] rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B0F19]/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Yöntem & Hesap</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-8 bg-slate-800/50 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
                    Aranan kriterlere uygun talep bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((payout, i) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    key={payout.id}
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-white">{payout.user.name}</p>
                      <p className="text-xs text-slate-400">{payout.user.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-400">₺{payout.amount.toLocaleString('tr-TR')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-slate-300">{payout.method}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{payout.iban || payout.paparaId || '—'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(payout.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payout.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={cn('flex items-center justify-end gap-2 transition-opacity', payout.status === 'PENDING' || payout.status === 'PROCESSING' ? 'opacity-100' : 'opacity-0 group-hover:opacity-60')}>
                        {payout.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAction(payout.id, 'PROCESSING')}
                              disabled={actionLoading === payout.id}
                              className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-colors disabled:opacity-50"
                            >
                              İşleme Al
                            </button>
                            <button
                              onClick={() => setRejectTarget(payout.id)}
                              disabled={actionLoading === payout.id}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {payout.status === 'PROCESSING' && (
                          <>
                            <button
                              onClick={() => handleAction(payout.id, 'COMPLETED')}
                              disabled={actionLoading === payout.id}
                              className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-bold transition-colors disabled:opacity-50"
                            >
                              Tamamla
                            </button>
                            <button
                              onClick={() => setRejectTarget(payout.id)}
                              disabled={actionLoading === payout.id}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {payout.adminNote && (
                          <button className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400" title={payout.adminNote}>
                            <MoreVertical size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Talebi Reddet</h3>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Red gerekçesi (opsiyonel)..."
              rows={3}
              className="w-full bg-[#0B0F19] border border-[#1E293B] rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/40 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectTarget(null); setRejectNote(''); }}
                className="flex-1 py-2.5 border border-[#1E293B] text-slate-400 rounded-xl text-sm font-semibold hover:border-slate-600 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleAction(rejectTarget, 'REJECTED', rejectNote || undefined)}
                className="flex-1 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
