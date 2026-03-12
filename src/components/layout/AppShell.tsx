import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useUser } from '../../hooks/useUser';
import { Menu, X, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppShell = () => {
  const { isAuthenticated, loading, role } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-[#020617] min-h-screen relative overflow-x-hidden">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#020617]/80 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-6 z-40">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Truck size={18} className="text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-xl font-bold text-white tracking-tighter">AGROLINK</span>
        </div>

        <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-bold text-emerald-500 uppercase tracking-widest">
          {role}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[60] md:hidden overflow-y-auto"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 rounded-full border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 w-full p-6 md:p-8 pt-24 md:pt-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
