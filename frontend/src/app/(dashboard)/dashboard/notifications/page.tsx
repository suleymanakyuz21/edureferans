'use client';

import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Users, CreditCard, Gift, Shield } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  referral: { icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  commission: { icon: CreditCard, color: 'text-green-400', bg: 'bg-green-500/10' },
  payment: { icon: Gift, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  admin: { icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/10' },
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ data: Notification[] }>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data),
  });

  const markAllRead = useMutation({
    mutationFn: () => api.patch('/notifications'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2">Bildirimler</h1>
          <p className="text-[var(--text-secondary)]">
            {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm font-medium hover:bg-[var(--bg-secondary)] transition-all"
          >
            <CheckCheck size={16} />
            Tümünü Oku
          </button>
        )}
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl divide-y divide-[var(--border-color)] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-[var(--bg-secondary)] rounded-xl animate-pulse" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-[var(--text-secondary)]">Henüz bildirim yok.</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const config = typeConfig[notif.type] || typeConfig.admin;
            const Icon = config.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'flex items-start gap-4 p-5 hover:bg-[var(--bg-secondary)] transition-all',
                  !notif.isRead && 'bg-indigo-500/3'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', config.bg, config.color)}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold">{notif.title}</p>
                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">{notif.message}</p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-60 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
