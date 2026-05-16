'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Send, Info, Gift, Settings, Wrench, BellRing, Trash2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { cn } from '@/lib/utils';

const mockAnnouncements = [
  { id: 1, title: 'Yeni Kurs Yayında: İleri Seviye Next.js', message: 'Uzun zamandır beklenen Next.js 14 eğitimi platforma eklendi.', type: 'info', date: '2026-05-15 14:30', status: 'sent' },
  { id: 2, title: 'Hafta Sonu Kampanyası', message: 'Tüm premium üyeliklerde %20 indirim fırsatını kaçırmayın!', type: 'campaign', date: '2026-05-10 09:00', status: 'sent' },
  { id: 3, title: 'Planlı Bakım Çalışması', message: 'Bu gece 03:00 - 05:00 saatleri arasında sunucu bakımı yapılacaktır.', type: 'maintenance', date: '2026-05-08 16:45', status: 'sent' },
];

export default function AdminAnnouncementsPage() {
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      // await adminService.createAnnouncement(formData);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newAnnouncement = {
        id: Date.now(),
        ...formData,
        date: new Date().toLocaleString('tr-TR').slice(0, 16),
        status: 'sent'
      };
      
      setAnnouncements([newAnnouncement, ...announcements]);
      setFormData({ title: '', message: '', type: 'info' });
      alert('Duyuru başarıyla gönderildi!');
    } catch (error) {
      console.error('Duyuru gönderilemedi', error);
      alert('Duyuru gönderilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeDetails = (type: string) => {
    switch(type) {
      case 'info': return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Bilgi' };
      case 'campaign': return { icon: Gift, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Kampanya' };
      case 'update': return { icon: Settings, color: 'text-cyan-400', bg: 'bg-cyan-400/10', label: 'Güncelleme' };
      case 'maintenance': return { icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Bakım' };
      default: return { icon: BellRing, color: 'text-slate-400', bg: 'bg-slate-400/10', label: 'Genel' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Duyuru Yönetimi</h2>
        <p className="text-sm text-slate-400 mt-1">Platformdaki tüm kullanıcılara veya belirli gruplara bildirim gönderin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Announcement Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm h-fit"
        >
          <div className="flex items-center gap-2 mb-6 border-b border-[#1E293B] pb-4">
            <Megaphone size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white">Yeni Duyuru Oluştur</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duyuru Türü</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'info', icon: Info, label: 'Bilgi' },
                  { id: 'campaign', icon: Gift, label: 'Kampanya' },
                  { id: 'update', icon: Settings, label: 'Güncelleme' },
                  { id: 'maintenance', icon: Wrench, label: 'Bakım' }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({...formData, type: type.id})}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all",
                      formData.type === type.id 
                        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400" 
                        : "bg-[#0B0F19] border-[#1E293B] text-slate-400 hover:bg-slate-800"
                    )}
                  >
                    <type.icon size={14} />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Başlık</label>
              <input 
                required 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Duyuru başlığı..."
                className="w-full px-4 py-2.5 bg-[#0B0F19] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mesaj İçeriği</label>
              <textarea 
                required 
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
                rows={4} 
                placeholder="Kullanıcıların göreceği mesaj..."
                className="w-full px-4 py-2.5 bg-[#0B0F19] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Duyuruyu Yayınla</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Announcement History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Geçmiş Duyurular</h3>
            <span className="text-xs text-slate-400">Son 30 Gün</span>
          </div>

          <div className="space-y-3">
            {announcements.map((item, i) => {
              const typeInfo = getTypeDetails(item.type);
              const Icon = typeInfo.icon;
              
              return (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm group hover:border-cyan-500/30 transition-all flex gap-4"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1", typeInfo.bg, typeInfo.color)}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-white truncate">{item.title}</h4>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{item.date}</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{item.message}</p>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", typeInfo.bg, typeInfo.color, `border-${typeInfo.color.split('-')[1]}-500/20`)}>
                        {typeInfo.label}
                      </span>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-red-400 transition-colors" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
