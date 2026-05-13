'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, MapPin, BookOpen, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';

const settingsSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  phone: z.string().optional(),
  profession: z.string().optional(),
  city: z.string().optional(),
  about: z.string().optional(),
  educationArea: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: SettingsValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch('/user/profile', data);
      updateUser(response.data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black mb-2">Ayarlar</h1>
        <p className="text-[var(--text-secondary)]">Profil bilgilerini ve hesap ayarlarını yönet.</p>
      </div>

      {/* Avatar */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl font-black">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-lg">{user?.name}</p>
          <p className="text-[var(--text-secondary)] text-sm">{user?.email}</p>
          <p className="text-xs mt-1 text-indigo-400 font-medium">Ref: {user?.refCode}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6">
        <h3 className="text-lg font-bold mb-6">Profil Bilgileri</h3>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} />
            Değişiklikler kaydedildi!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <input
              {...register('name')}
              type="text"
              placeholder="Ad Soyad"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all text-[var(--text-primary)]"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <input
              {...register('phone')}
              type="tel"
              placeholder="Telefon Numarası"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all text-[var(--text-primary)]"
            />
          </div>

          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <input
              {...register('profession')}
              type="text"
              placeholder="Meslek / Uzmanlık Alanı"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all text-[var(--text-primary)]"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <input
              {...register('city')}
              type="text"
              placeholder="Şehir"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all text-[var(--text-primary)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 btn-gradient text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-[var(--card-bg)] border border-red-500/20 rounded-3xl p-6">
        <h3 className="text-lg font-bold mb-2 text-red-400">Tehlikeli Bölge</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-4">Bu işlemler geri alınamaz. Dikkatli ol.</p>
        <button className="px-4 py-2 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-all">
          Hesabı Sil
        </button>
      </div>
    </div>
  );
}
