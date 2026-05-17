'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SubscribePage() {
  const { user } = useAuthStore();

  useEffect(() => {
    const checkoutUrl = user?.email 
      ? `https://buy.polar.sh/polar_cl_5LfGZYF5aQcdHxR5chT94MLMyr8K4knZcVHyH0Oc1Wv?customer_email=${encodeURIComponent(user.email)}`
      : 'https://buy.polar.sh/polar_cl_5LfGZYF5aQcdHxR5chT94MLMyr8K4knZcVHyH0Oc1Wv';
    
    window.location.href = checkoutUrl;
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
    </div>
  );
}
