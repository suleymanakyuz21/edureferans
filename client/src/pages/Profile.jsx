import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Briefcase, MapPin, 
  BookOpen, Star, Camera, Check, AlertCircle, 
  Loader2, Save, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// --- Sub-Components ---

const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${
        type === 'success' 
          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
          : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}
    >
      {type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

const ProfileCard = ({ user, t }) => {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border-2 border-white/10 flex items-center justify-center text-4xl font-black text-brand-400 shadow-2xl relative overflow-hidden">
          {initials}
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-500 rounded-2xl border-4 border-[var(--color-dark-900)] flex items-center justify-center">
          <Star className="h-5 w-5 text-white fill-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
      <p className="text-brand-400 font-medium text-sm mb-4">{user.profession || (t('profession') + '...')}</p>
      
      <div className="w-full h-px bg-white/5 my-6" />
      
      <div className="w-full space-y-4 text-left">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{user.city || t('city')}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Briefcase className="h-4 w-4 text-gray-500" />
          <span>{user.experienceLevel || t('experienceBeginner')}</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

export default function Profile() {
  const { t, lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData(parsed);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    const hasChanges = Object.keys(newFormData).some(key => newFormData[key] !== user[key]);
    setIsChanged(hasChanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged || saving) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
        setUser(result.data.user);
        setIsChanged(false);
        setToast({ message: t('saved'), type: 'success' });
        window.dispatchEvent(new Event('storage'));
      } else {
        throw new Error(result.message || 'Error');
      }
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">{t('profileTitle')}</h1>
          <p className="text-gray-400 mt-2">Kişisel bilgilerinizi ve platform deneyiminizi özelleştirin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-2">
            <button className="w-full flex items-center gap-4 p-4 bg-brand-500/10 border border-brand-500/30 rounded-2xl text-brand-400 font-bold">
              <div className="p-2 bg-brand-500 rounded-xl text-white"><User className="h-5 w-5" /></div>
              <span className="flex-1 text-left">{t('personalInfo')}</span>
            </button>
          </div>
          <ProfileCard user={user} t={t} />
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">{t('fullName')}</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} className="modern-input font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">E-mail</label>
                <input value={user.email} readOnly className="modern-input opacity-50 cursor-not-allowed font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">{t('phone')}</label>
                <input name="phone" value={formData.phone || ''} onChange={handleChange} className="modern-input font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">{t('profession')}</label>
                <input name="profession" value={formData.profession || ''} onChange={handleChange} className="modern-input font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">{t('city')}</label>
                <input name="city" value={formData.city || ''} onChange={handleChange} className="modern-input font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">{t('experienceLevel')}</label>
                <select name="experienceLevel" value={formData.experienceLevel || ''} onChange={handleChange} className="modern-input font-bold appearance-none">
                  <option value="">{t('select')}</option>
                  <option value="Başlangıç">{t('experienceBeginner')}</option>
                  <option value="Orta">{t('experienceIntermediate')}</option>
                  <option value="İleri">{t('experienceAdvanced')}</option>
                  <option value="Uzman">{t('experienceExpert')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">{t('about')}</label>
              <textarea name="about" value={formData.about || ''} onChange={handleChange} rows="4" className="modern-input resize-none py-4 font-bold" />
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={!isChanged || saving}
                className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all duration-300 ${
                  isChanged && !saving ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 hover:scale-105' : 'bg-white/5 text-gray-500'
                }`}
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {saving ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <style>{`
        .modern-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.25rem;
          padding: 1rem 1.25rem;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .modern-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.05);
          border-color: #6366f1;
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </motion.div>
  );
}
