'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SubscribePage() {
  const { user } = useAuthStore();

  useEffect(() => {
    const checkoutUrl = user?.email 
      ? `https://polar.sh/checkout/polar_c_1aPn4oDN6T1ibnZ6ncCtbmsjt4vTJOoiR8Ypg1g7dza?customer_email=${encodeURIComponent(user.email)}`
      : 'https://polar.sh/checkout/polar_c_1aPn4oDN6T1ibnZ6ncCtbmsjt4vTJOoiR8Ypg1g7dza';
    
    window.location.href = checkoutUrl;
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
    </div>
  );
}
