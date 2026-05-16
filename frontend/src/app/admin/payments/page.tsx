'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, MoreVertical, CreditCard, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data for UI
const mockPayments = [
  { id: 'PAY-1001', user: 'Ahmet Yılmaz', email: 'ahmet@example.com', amount: 1500, method: 'Banka Transferi', status: 'pending', date: '2026-05-16', iban: 'TR12 3456 7890 1234 5678 90' },
  { id: 'PAY-1002', user: 'Ayşe Demir', email: 'ayse@example.com', amount: 450, method: 'Papara', status: 'processing', date: '2026-05-15', accountId: '1234567890' },
  { id: 'PAY-1003', user: 'Mehmet Kaya', email: 'mehmet@example.com', amount: 3200, method: 'Banka Transferi', status: 'completed', date: '2026-05-14', iban: 'TR98 7654 3210 9876 5432 10' },
  { id: 'PAY-1004', user: 'Zeynep Çelik', email: 'zeynep@example.com', amount: 850, method: 'Kripto', status: 'rejected', date: '2026-05-13', wallet: '0x123...abc' },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(mockPayments);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPayments = payments.filter((p) => {
    const matchSearch = p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20"><Clock size={12} /> BEKLEYEN</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20"><RefreshCcw size={12} className="animate-spin-slow" /> İŞLENİYOR</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20"><CheckCircle size={12} /> TAMAMLANDI</span>;
      case 'rejected':
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
          <p className="text-sm text-slate-400 mt-1">Kullanıcıların ödeme taleplerini inceleyin ve yönetin.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Kullanıcı veya İşlem ID ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-white placeholder:text-slate-500 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48 px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-white appearance-none transition-all"
        >
          <option value="all">Tüm Statüler</option>
          <option value="pending">Bekleyen</option>
          <option value="processing">İşlenen</option>
          <option value="completed">Tamamlanan</option>
          <option value="rejected">Reddedilen</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-[#0F172A]/80 border border-[#1E293B] rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B0F19]/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">İşlem Detayı</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hesap / Cüzdan</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {filteredPayments.map((payment, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={payment.id} 
                  className="hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-white">{payment.id}</p>
                    <p className="text-xs text-slate-400">{payment.date}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-white">{payment.user}</p>
                    <p className="text-xs text-slate-400">{payment.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-400">₺{payment.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-300">{payment.method}</span>
                      <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {payment.iban || payment.accountId || payment.wallet}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {payment.status === 'pending' && (
                        <>
                          <button className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors" title="Onayla">
                            <CheckCircle size={16} />
                          </button>
                          <button className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors" title="Reddet">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors" title="Detay">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Aranan kriterlere uygun ödeme bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
