import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-dark-900)] text-white font-sans selection:bg-brand-500/30">
      {/* Background Ambient Lights */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <Sidebar 
        isMobileOpen={mobileMenuOpen} 
        closeMobileMenu={() => setMobileMenuOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
