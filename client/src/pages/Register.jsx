import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Hash, Loader2 } from 'lucide-react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Redirect to verify email
        navigate(`/login?verify=${formData.email}`);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Aramıza Katıl</h1>
        <p className="text-[var(--text-secondary)] text-sm font-medium tracking-wide italic">SaaS platformumuza katılarak öğrenmeye ve kazanmaya başla.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 text-gray-500">Ad Soyad</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all font-bold"
              placeholder="Adınız Soyadınız"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 text-gray-500">Email Adresi</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all font-bold"
              placeholder="ornek@mail.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 text-gray-500">Şifre</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all font-bold"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 text-gray-500">Referans Kodu (Opsiyonel)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <Hash className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value.toUpperCase()})}
              className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-brand-400 placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all font-mono font-black tracking-widest"
              placeholder="ÖRN: SUL-X123"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors font-bold">
            <input type="checkbox" required className="mt-1 rounded border-white/10 bg-white/5 text-brand-500 focus:ring-brand-500/50 mr-3" />
            <span>Kullanım koşullarını ve Gizlilik politikasını kabul ediyorum.</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-500/20 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Hesabını Oluştur
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-xs font-black uppercase tracking-widest text-gray-500">
        Zaten hesabın var mı?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
          Giriş Yap
        </Link>
      </p>
    </motion.div>
  );
}
