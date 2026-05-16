'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Save, Server, Globe, Bell, Lock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    alert('Ayarlar başarıyla kaydedildi.');
  };

  const tabs = [
    { id: 'general', label: 'Genel Ayarlar', icon: Globe },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'audit', label: 'Sistem Logları', icon: Activity },
  ];

  const mockAuditLogs = [
    { id: 1, action: 'ADMIN_LOGIN', user: 'Süleyman Akyüz', ip: '192.168.1.1', date: '2026-05-16 10:24', status: 'success' },
    { id: 2, action: 'UPDATE_COURSE', user: 'Süleyman Akyüz', ip: '192.168.1.1', date: '2026-05-15 14:12', status: 'success' },
    { id: 3, action: 'FAILED_LOGIN_ATTEMPT', user: 'Bilinmeyen', ip: '45.22.12.99', date: '2026-05-14 03:45', status: 'warning' },
    { id: 4, action: 'DELETE_USER', user: 'Ahmet Yılmaz', ip: '192.168.1.5', date: '2026-05-13 16:30', status: 'danger' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sistem Ayarları</h2>
          <p className="text-sm text-slate-400 mt-1">Platformun temel yapılandırmasını ve güvenlik politikalarını yönetin.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:opacity-50"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          <span>Değişiklikleri Kaydet</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold",
                activeTab === tab.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F172A]/80 border border-[#1E293B] rounded-2xl p-6 backdrop-blur-sm"
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="text-cyan-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Platform Ayarları</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Site Adı</label>
                    <input defaultValue="EduReferans" className="w-full px-4 py-2.5 bg-[#0B0F19] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destek Email</label>
                    <input defaultValue="support@edureferans.com" className="w-full px-4 py-2.5 bg-[#0B0F19] border border-[#1E293B] rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bakım Modu</label>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#0B0F19]">
                      <div>
                        <p className="text-sm font-bold text-white">Sistemi Bakıma Al</p>
                        <p className="text-xs text-slate-400 mt-1">Sadece adminler sisteme giriş yapabilir.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="text-cyan-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Güvenlik ve Erişim</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Rate Limiting (API Ddos Koruması)', desc: 'Dakika başına API isteklerini sınırlandırır.', checked: true },
                    { title: 'Secure Sessions', desc: 'Sadece HTTPS üzerinden oturum açılmasına izin ver.', checked: true },
                    { title: 'Admin 2FA Zorunluluğu', desc: 'Tüm admin hesapları için iki faktörlü doğrulamayı zorunlu kıl.', checked: false },
                    { title: 'Sıkı Şifre Politikası', desc: 'En az 12 karakter, büyük/küçük harf, sayı ve özel karakter zorunluluğu.', checked: true },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[#1E293B] bg-[#0B0F19]">
                      <div>
                        <p className="text-sm font-bold text-white">{setting.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.checked} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="text-cyan-400" size={20} />
                    <h3 className="text-lg font-bold text-white">Sistem Logları</h3>
                  </div>
                  <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300">Tümünü İndir (CSV)</button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0B0F19]">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Tarih</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">İşlem</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Kullanıcı / IP</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase text-right">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]">
                      {mockAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/20">
                          <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{log.date}</td>
                          <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{log.action}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-slate-300">{log.user}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{log.ip}</div>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <span className={cn(
                              "px-2 py-1 rounded text-[10px] font-bold uppercase",
                              log.status === 'success' && "bg-green-500/10 text-green-400",
                              log.status === 'warning' && "bg-yellow-500/10 text-yellow-400",
                              log.status === 'danger' && "bg-red-500/10 text-red-400",
                            )}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4">
                  <Bell className="text-cyan-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Bildirim Tercihleri</h3>
                </div>
                <p className="text-sm text-slate-400">Admin olarak almak istediğiniz anlık bildirim türlerini seçin.</p>
                <div className="space-y-4 mt-4">
                  {['Yeni Kullanıcı Kaydı', 'Ödeme Talepleri', 'Sistem Hataları', 'Kullanıcı Raporları'].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#1E293B] bg-[#0B0F19] cursor-pointer hover:border-cyan-500/30 transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0" />
                      <span className="text-sm font-medium text-slate-300">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
