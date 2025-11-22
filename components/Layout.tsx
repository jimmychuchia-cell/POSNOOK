
import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, Calculator, Users, Settings, LogOut, Package, Leaf } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const NavButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-3xl transition-all duration-300 transform ${
      active 
        ? 'bg-nook-green text-nook-text shadow-inner -translate-y-4 scale-110 z-10 border-4 border-white' 
        : 'text-nook-brown hover:bg-nook-green/30 hover:scale-105 hover:-translate-y-1'
    }`}
  >
    <div className={`p-3 rounded-full mb-1 transition-all duration-300 ${active ? 'bg-white/60 animate-bounce-sm' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className={`text-xs font-extrabold transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
  return (
    <div className="min-h-screen bg-leaf-pattern flex flex-col overflow-hidden font-sans">
      {/* Top Bar - Status-like */}
      <header className="bg-nook-green h-16 flex items-center justify-between px-6 shadow-md z-10 relative">
        <div className="flex items-center space-x-3 animate-float">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-nook-green font-extrabold text-xl border-4 border-white shadow-sm">
            <Leaf size={20} fill="currentColor" />
          </div>
          <span className="font-extrabold text-white text-2xl tracking-wide drop-shadow-sm">NookPOS</span>
        </div>
        <div className="bg-white/20 px-4 py-1 rounded-full text-white font-bold backdrop-blur-sm border-2 border-white/30">
          {new Date().toLocaleDateString()}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-4 pb-32 relative">
        <div className="max-w-6xl mx-auto h-full">
           {children}
        </div>
      </main>

      {/* Bottom Navigation Dock (iOS Style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-nook-cream/95 backdrop-blur-md border-t-4 border-nook-brown/10 px-4 pb-safe pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] rounded-t-[2.5rem] z-50 h-24">
        <div className="flex justify-around items-end h-full pb-4 max-w-2xl mx-auto">
          <NavButton 
            active={currentView === AppView.POS} 
            onClick={() => onNavigate(AppView.POS)} 
            icon={<Calculator size={32} strokeWidth={2.5} />} 
            label="收銀台" 
          />
          <NavButton 
            active={currentView === AppView.INVENTORY} 
            onClick={() => onNavigate(AppView.INVENTORY)} 
            icon={<Package size={32} strokeWidth={2.5} />} 
            label="庫存管理" 
          />
          <NavButton 
            active={currentView === AppView.MEMBERS} 
            onClick={() => onNavigate(AppView.MEMBERS)} 
            icon={<Users size={32} strokeWidth={2.5} />} 
            label="會員中心" 
          />
          <NavButton 
            active={currentView === AppView.SETTINGS} 
            onClick={() => onNavigate(AppView.SETTINGS)} 
            icon={<Settings size={32} strokeWidth={2.5} />} 
            label="系統設定" 
          />
          <NavButton 
            active={false} 
            onClick={onLogout} 
            icon={<LogOut size={32} strokeWidth={2.5} />} 
            label="登出" 
          />
        </div>
      </nav>
    </div>
  );
};

export default Layout;
