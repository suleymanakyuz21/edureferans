'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const registerSchema = z.z.object({
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
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      setTempEmail(data.email);
      setMockCode(response.data.data.mockCode); // For testing ease
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const [verifyCode, setVerifyCode] = useState('');
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify', { email: tempEmail, code: verifyCode });
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Doğrulama başarısız.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10" />
        
        {step === 'form' ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black mb-3">Aramıza Katıl 🚀</h1>
              <p className="text-[var(--text-secondary)]">Geleceğin eğitim platformunda yerini al.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <input 
                  {...register('name')}
                  type="text" 
                  placeholder="Ad Soyad"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <input 
                  {...register('email')}
                  type="email" 
                  placeholder="E-posta"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <input 
                  {...register('password')}
                  type="password" 
                  placeholder="Şifre"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all"
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="relative pt-2">
                <input 
                  {...register('referralCode')}
                  type="text" 
                  placeholder="Referans Kodu (Opsiyonel)"
                  className="w-full bg-transparent border-b border-[var(--border-color)] py-3 px-1 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[var(--gradient-accent)] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70"
              >
                {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'} <ArrowRight size={20} />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
              Zaten hesabın var mı? <Link href="/login" className="text-indigo-500 font-bold hover:underline">Giriş Yap</Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black mb-4">E-postanı Doğrula</h2>
            <p className="text-[var(--text-secondary)] mb-8">
              {tempEmail} adresine bir doğrulama kodu gönderdik.
            </p>
            
            {mockCode && (
                <div className="mb-6 p-3 bg-indigo-500/10 rounded-lg text-indigo-400 text-xs font-mono">
                    Test Kodu: {mockCode}
                </div>
            )}

            <div className="flex gap-2 justify-center mb-8">
              <input 
                type="text" 
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="000000"
                className="w-full max-w-[200px] text-center text-3xl font-black tracking-[0.5em] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              onClick={handleVerify}
              disabled={isLoading || verifyCode.length !== 6}
              className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Başla'}
            </button>
            
            <button 
                onClick={() => setStep('form')}
                className="mt-6 text-sm text-[var(--text-secondary)] hover:text-white"
            >
                Bilgileri Düzenle
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
