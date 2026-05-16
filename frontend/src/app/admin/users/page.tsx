'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Crown, UserX, UserCheck, Shield } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error('Users fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (id: number, currentStatus: boolean) => {
    try {
      await adminService.updateUserStatus(id, { isPremium: !currentStatus });
      fetchUsers(); // Refresh
    } catch (error) {
      console.error('Error toggling premium', error);
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await adminService.updateUserStatus(id, { isActive: !currentStatus });
      fetchUsers(); // Refresh
    } catch (error) {
      console.error('Error toggling active', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-slate-400 mt-1">Platformdaki tüm kullanıcıları yönetin ve detaylarını inceleyin.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Kullanıcı ara (isim, email)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-white placeholder:text-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0F172A]/80 border border-[#1E293B] rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B0F19]/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Bakiye</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Referanslar</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Yükleniyor...</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={user.id} 
                  className="hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      {user.isPremium ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 w-max">
                          <Crown size={10} /> PREMIUM
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700 w-max">
                          STANDART
                        </span>
                      )}
                      
                      {!user.isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 w-max">
                          <Shield size={10} /> SUSPENDED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">₺{user.balance.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                      {user._count.referrals}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => togglePremium(user.id, user.isPremium)}
                        className={cn(
                          "p-2 rounded-lg transition-colors border",
                          user.isPremium ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20"
                        )}
                        title={user.isPremium ? "Premium İptal" : "Premium Ver"}
                      >
                        <Crown size={14} />
                      </button>
                      <button 
                        onClick={() => toggleActive(user.id, user.isActive)}
                        className={cn(
                          "p-2 rounded-lg transition-colors border",
                          user.isActive ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                        )}
                        title={user.isActive ? "Hesabı Askıya Al" : "Hesabı Aç"}
                      >
                        {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
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
