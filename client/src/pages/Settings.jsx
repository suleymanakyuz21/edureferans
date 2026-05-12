import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings as SettingsIcon, Palette, Monitor, Check, 
  ChevronRight, Save, Loader2, Laptop, Smartphone, Moon, Sun
} from 'lucide-react';

// --- Sub-Components ---

const ThemePreviewCard = ({ type, active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col gap-4 p-4 rounded-[2rem] border-2 transition-all duration-500 ${
      active 
      ? 'border-brand-500 bg-brand-500/[0.03] shadow-2xl shadow-brand-500/10' 
      : 'border-[var(--border-color)] bg-[var(--bg-glass)] hover:border-[var(--border-hover)]'
    }`}
  >
    <div className={`relative h-32 rounded-2xl overflow-hidden border border-[var(--border-color)] transition-transform duration-500 group-hover:scale-[1.02] ${
      type === 'dark' ? 'bg-[#0a0a0f]' : type === 'light' ? 'bg-[#f8fafc]' : 'bg-gradient-to-br from-[#0a0a0f] to-[#f8fafc]'
    }`}>
      {/* Mock Dashboard UI */}
      <div className="absolute inset-0 p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className={`w-3 h-3 rounded-full ${type === 'light' ? 'bg-gray-200' : 'bg-white/10'}`} />
          <div className={`w-12 h-3 rounded-full ${type === 'light' ? 'bg-gray-200' : 'bg-white/10'}`} />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className={`h-12 rounded-xl ${type === 'light' ? 'bg-white shadow-sm' : 'bg-white/5'}`} />
          <div className={`h-12 rounded-xl ${type === 'light' ? 'bg-white shadow-sm' : 'bg-white/5'}`} />
        </div>
      </div>
      
      {active && (
        <motion.div 
          layoutId="active-badge"
          className="absolute inset-0 bg-brand-500/10 flex items-center justify-center backdrop-blur-[2px]"
        >
          <div className="bg-brand-500 text-white p-1.5 rounded-full shadow-xl">
            <Check className="h-4 w-4" />
          </div>
        </motion.div>
      )}
    </div>
    
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        {type === 'dark' ? <Moon className="h-4 w-4 text-brand-500" /> : type === 'light' ? <Sun className="h-4 w-4 text-orange-500" /> : <Monitor className="h-4 w-4 text-purple-500" />}
        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">{label}</span>
      </div>
    </div>
  </button>
);

const SectionSaveButton = ({ onSave, loading, disabled, text }) => (
  <div className="flex justify-end mt-12 pt-8 border-t border-[var(--border-color)]">
    <button
      onClick={onSave}
      disabled={disabled || loading}
      className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
        !disabled && !loading 
        ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-xl shadow-brand-500/20' 
        : 'bg-[var(--bg-glass)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)]'
      }`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {text}
    </button>
  </div>
);

export default function Settings() {
  const { lang, setLang, t } = useLanguage();
  const { mode, setMode } = useTheme();
  const [activeTab, setActiveTab] = useState(t('generalTab'));
  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  const [settings, setSettings] = useState({
    language: lang === 'tr' ? 'Türkçe' : 'English',
    mode: mode
  });

  useEffect(() => {
    setActiveTab(t('generalTab'));
    fetchSettingsData();
  }, [lang]);

  const fetchSettingsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
    if (key === 'mode') setMode(value);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const newLang = settings.language === 'English' ? 'en' : 'tr';
      setLang(newLang);
      setMode(settings.mode);
      setSaving(false);
      setIsChanged(false);
    }, 800);
  };

  const menuItems = [
    { id: t('generalTab'), icon: SettingsIcon },
    { id: t('appearanceTab'), icon: Palette },
    { id: t('sessionsTab'), icon: Monitor },
  ];

  const getSessionIcon = (device) => {
    if (device?.toLowerCase().includes('phone') || device?.toLowerCase().includes('mobile')) return Smartphone;
    return Laptop;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4 md:px-0">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">{t('settingsTitle')}</h1>
        <p className="text-[var(--text-secondary)] font-medium">{t('settingsDesc')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-500 ${
                activeTab === item.id 
                ? 'bg-brand-500 text-white shadow-2xl shadow-brand-500/30 -translate-y-1' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.id}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="glass-card p-10 min-h-[500px] flex flex-col justify-between"
            >
              <div>
                {activeTab === t('generalTab') && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-2">{t('systemLanguage')}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-6 font-medium">Platformun tüm içeriği seçtiğiniz dile göre anlık olarak güncellenir.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                        {['Türkçe', 'English'].map((l) => (
                          <button
                            key={l}
                            onClick={() => handleSettingChange('language', l)}
                            className={`p-4 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
                              settings.language === l 
                              ? 'border-brand-500 bg-brand-500/10 text-brand-500' 
                              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === t('appearanceTab') && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-2">{t('themeSelection')}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-8 font-medium">Platform görünümünü tercihlerinize göre özelleştirin.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <ThemePreviewCard type="dark" label="Dark" active={settings.mode === 'dark'} onClick={() => handleSettingChange('mode', 'dark')} />
                        <ThemePreviewCard type="light" label="Light" active={settings.mode === 'light'} onClick={() => handleSettingChange('mode', 'light')} />
                        <ThemePreviewCard type="system" label="System" active={settings.mode === 'system'} onClick={() => handleSettingChange('mode', 'system')} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === t('sessionsTab') && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-2">Aktif Oturumlar</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">Hesabınıza bağlı olan aktif cihazları yönetin.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {data?.sessions?.length > 0 ? data.sessions.map((session, i) => {
                        const Icon = getSessionIcon(session.device);
                        return (
                          <div key={i} className="flex items-center gap-6 p-5 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all">
                            <div className={`p-3.5 rounded-xl ${session.active ? 'bg-brand-500/10 text-brand-500' : 'bg-red-500/10 text-red-500'}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">{session.device}</span>
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                  session.active 
                                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${session.active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                  {session.active ? 'Aktif' : 'Pasif'}
                                </div>
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)] font-black mt-1 uppercase tracking-widest">
                                {t('date')}: {new Date(session.createdAt).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })} • {new Date(session.createdAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                              </p>
                            </div>
                            {i === 0 && (
                              <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-500/20">
                                {lang === 'tr' ? 'Bu Cihaz' : 'This Device'}
                              </span>
                            )}
                          </div>
                        );
                      }) : (
                        <div className="text-center py-10 text-[var(--text-muted)] font-bold uppercase text-xs tracking-widest border-2 border-dashed border-[var(--border-color)] rounded-[2rem]">
                          {loading ? 'Yükleniyor...' : 'Henüz oturum kaydı bulunmuyor.'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {activeTab !== t('sessionsTab') && (
                <SectionSaveButton 
                  onSave={handleSave} 
                  loading={saving} 
                  disabled={!isChanged} 
                  text={saving ? t('saving') : t('saveChanges')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
