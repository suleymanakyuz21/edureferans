import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface PremiumLockProps {
  title: string;
  description: string;
}

const PremiumLock: React.FC<PremiumLockProps> = ({ title, description }) => {
  const { user } = useAuthStore();
  // Append user email to checkout link if available
  const checkoutUrl = user?.email 
    ? `https://polar.sh/checkout/polar_c_1aPn4oDN6T1ibnZ6ncCtbmsjt4vTJOoiR8Ypg1g7dza?customer_email=${encodeURIComponent(user.email)}`
    : 'https://polar.sh/checkout/polar_c_1aPn4oDN6T1ibnZ6ncCtbmsjt4vTJOoiR8Ypg1g7dza';

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20 relative">
        <Lock size={32} className="text-purple-400" />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
          <Crown size={16} className="text-yellow-400" />
        </div>
      </div>
      
      <h2 className="text-2xl font-black text-white mb-3">{title}</h2>
      <p className="text-slate-400 max-w-md mb-2">{description}</p>
      <p className="text-emerald-400 font-medium mb-8">Pro üye olarak aktif edebilirsiniz.</p>
      
      <a
        href={checkoutUrl}
        className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
      >
        <Crown size={18} />
        Pro Ol
      </a>
    </div>
  );
};

export default PremiumLock;
