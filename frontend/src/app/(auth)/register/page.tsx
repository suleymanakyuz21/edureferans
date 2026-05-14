'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  referralCode: z.string().optional(),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [tempEmail, setTempEmail] = useState('');
  const [mockCode, setMockCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      setTempEmail(data.email);
      setMockCode(response.data.data.mockCode || '');
      setStep('verify');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/verify', { email: tempEmail, code: verifyCode });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      setAuth(user, token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Doğrulama başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0ea5e9]/6 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#06b6d4]/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(rgba(14,165,233,1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,1)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:shadow-[0_0_30px_rgba(14,165,233,0.45)] transition-all">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
              EDU<span className="text-gradient">REFERANS</span>
            </span>
          </Link>
          {step === 'form' && (
            <>
              <h1 className="text-3xl font-black mb-2 text-[var(--text-primary)]">Aramıza Katıl 🚀</h1>
              <p className="text-[var(--text-secondary)] text-sm">Geleceğin eğitim platformunda yerini al.</p>
            </>
          )}
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-7 shadow-[var(--shadow-card)]">
          {step === 'form' ? (
            <>
              {error && (
                <div className="mb-5 p-3.5 bg-red-500/8 border border-red-500/20 text-red-400 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                  <input
                    {...register('name')}
                    id="register-name"
                    type="text"
                    placeholder="Ad Soyad"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/15 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                  <input
                    {...register('email')}
                    id="register-email"
                    type="email"
                    placeholder="E-posta"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/15 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                  <input
                    {...register('password')}
                    id="register-password"
                    type="password"
                    placeholder="Şifre (en az 6 karakter)"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/15 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                </div>

                <div className="relative">
                  <input
                    {...register('referralCode')}
                    id="register-ref"
                    type="text"
                    placeholder="Referans Kodu (Opsiyonel)"
                    className="w-full bg-transparent border-b border-[var(--border-color)] py-3 px-1 text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                </div>

                <button
                  id="register-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 btn-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                  {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle2 size={52} className="text-emerald-400 mx-auto mb-5" />
              <h2 className="text-2xl font-black mb-3 text-[var(--text-primary)]">E-postanı Doğrula</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                <span className="font-semibold text-[var(--text-primary)]">{tempEmail}</span> adresine bir doğrulama kodu gönderdik.
              </p>

              {mockCode && (
                <div className="mb-5 p-3 bg-[var(--accent-primary)]/8 rounded-xl text-[var(--accent-primary)] text-xs font-mono border border-[var(--accent-primary)]/15">
                  Test Kodu: <span className="font-bold">{mockCode}</span>
                </div>
              )}

              {error && (
                <div className="mb-5 p-3.5 bg-red-500/8 border border-red-500/20 text-red-400 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex justify-center mb-6">
                <input
                  id="verify-code"
                  type="text"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full max-w-[180px] text-center text-3xl font-black tracking-[0.4em] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/15 text-[var(--text-primary)] transition-all"
                />
              </div>

              <button
                id="verify-submit"
                onClick={handleVerify}
                disabled={isLoading || verifyCode.length !== 6}
                className="w-full py-3.5 btn-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Başla'}
                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
              </button>

              <button
                onClick={() => { setStep('form'); setError(null); }}
                className="mt-5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                ← Bilgileri Düzenle
              </button>
            </div>
          )}
        </div>

        {step === 'form' && (
          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="text-[var(--accent-primary)] font-semibold hover:underline">
              Giriş Yap
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
