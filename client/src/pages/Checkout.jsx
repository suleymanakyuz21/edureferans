import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, ShieldCheck, Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Checkout() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const plans = {
    monthly: {
      id: 'monthly',
      name: lang === 'tr' ? 'Aylık Pro' : 'Monthly Pro',
      price: '₺199',
      period: lang === 'tr' ? '/ay' : '/mo',
      features: [
        lang === 'tr' ? 'Tüm Video Kurslara Erişim' : 'Access to all Video Courses',
        lang === 'tr' ? 'Ödül ve Komisyon Sistemi' : 'Reward and Commission System',
        lang === 'tr' ? 'Özel Topluluk Erişimi' : 'Private Community Access',
        lang === 'tr' ? '7/24 Destek' : '24/7 Support'
      ]
    },
    yearly: {
      id: 'yearly',
      name: lang === 'tr' ? 'Yıllık Pro' : 'Yearly Pro',
      price: '₺1.990',
      period: lang === 'tr' ? '/yıl' : '/yr',
      features: [
        lang === 'tr' ? 'Her Şey Dahil' : 'Everything Included',
        lang === 'tr' ? '2 Ay Ücretsiz' : '2 Months Free',
        lang === 'tr' ? 'Öncelikli Sertifikalar' : 'Priority Certificates',
        lang === 'tr' ? 'Özel Rozet' : 'Exclusive Badge'
      ],
      popular: true
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/payment/mock-payment-success', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment failed');
      }
      
      // Update local storage
      const updatedUser = { ...user, isPremium: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert(lang === 'tr' ? 'Tebrikler! Artık Pro Üyesiniz.' : 'Congratulations! You are now a Pro Member.');
      navigate('/dashboard');
      window.location.reload(); // Refresh to update context/UI
    } catch (err) {
      alert(err.message || (lang === 'tr' ? 'Ödeme sırasında bir hata oluştu.' : 'An error occurred during payment.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-8 font-black uppercase text-xs tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" /> {lang === 'tr' ? 'Geri Dön' : 'Go Back'}
      </motion.button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Plan Selection */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              {lang === 'tr' ? 'Sınırları Kaldır, Pro Ol.' : 'Break Limits, Go Pro.'}
            </h1>
            <p className="text-[var(--text-secondary)] text-lg font-medium">
              {lang === 'tr' ? 'Hemen planını seç ve tüm eğitimlere anında erişim sağla.' : 'Choose your plan now and get instant access to all courses.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(plans).map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${
                  selectedPlan === plan.id 
                    ? 'border-brand-500 bg-brand-500/5 shadow-2xl shadow-brand-500/10' 
                    : 'border-[var(--border-color)] bg-[var(--bg-glass)] hover:border-brand-500/50'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-widest">
                    {lang === 'tr' ? 'En Popüler' : 'Most Popular'}
                  </span>
                )}
                <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)] font-bold">{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                      <Check className="h-4 w-4 text-brand-500" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-6 bg-brand-500/5 border border-brand-500/20 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-wider">
                {lang === 'tr' ? 'Anında Aktivasyon' : 'Instant Activation'}
              </p>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                {lang === 'tr' ? 'Ödemeniz onaylandığı an tüm sistemler açılır.' : 'All systems open the moment your payment is confirmed.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 border-2 border-brand-500/20"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-brand-500" />
              {lang === 'tr' ? 'Ödeme Bilgileri' : 'Payment Details'}
            </h2>
            <ShieldCheck className="h-6 w-6 text-green-500" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">{lang === 'tr' ? 'Kart Sahibi' : 'Card Holder'}</label>
              <input type="text" placeholder="John Doe" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl p-4 text-white font-bold outline-none focus:border-brand-500 transition-all placeholder:text-[var(--text-muted)]/30" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">{lang === 'tr' ? 'Kart Numarası' : 'Card Number'}</label>
              <div className="relative">
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl p-4 text-white font-bold outline-none focus:border-brand-500 transition-all placeholder:text-[var(--text-muted)]/30" />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">{lang === 'tr' ? 'Son Kullanma' : 'Expiry Date'}</label>
                <input type="text" placeholder="MM/YY" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl p-4 text-white font-bold outline-none focus:border-brand-500 transition-all placeholder:text-[var(--text-muted)]/30" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">CVV</label>
                <input type="text" placeholder="000" className="w-full bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl p-4 text-white font-bold outline-none focus:border-brand-500 transition-all placeholder:text-[var(--text-muted)]/30" />
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)] mt-8">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[var(--text-secondary)] font-bold">{lang === 'tr' ? 'Toplam Tutar' : 'Total Amount'}</span>
                <span className="text-3xl font-black text-white">{plans[selectedPlan].price}</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-400 text-white p-5 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-2xl shadow-brand-500/40 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    {lang === 'tr' ? 'Ödemeyi Güvenle Tamamla' : 'Complete Secure Payment'}
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-[var(--text-muted)] font-medium leading-relaxed">
              {lang === 'tr' 
                ? 'Ödeme butonuna basarak Kullanım Koşullarını ve İptal Şartlarını kabul etmiş olursunuz. Verileriniz 256-bit SSL ile şifrelenmektedir.' 
                : 'By clicking the payment button, you accept the Terms of Use and Cancellation Policy. Your data is encrypted with 256-bit SSL.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
