
import React from 'react';
import { Screen, UserStats } from '../types';
import { Home, PenTool, Gamepad2, Award, Star } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  stats: UserStats;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setActiveScreen, stats }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-sky-400 -z-10 rounded-b-[3rem] opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-full h-32 bg-yellow-400 -z-10 rounded-t-[3rem] opacity-20"></div>

      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl shadow-lg">
            <span className="text-white font-bold text-xl comic-font">LL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">LetterLand</h1>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border-2 border-yellow-400 shadow-sm animate-bounce">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-yellow-700">{stats.stars}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 z-10">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-4 px-6 z-50">
        <NavButton 
          active={activeScreen === 'home'} 
          onClick={() => setActiveScreen('home')} 
          icon={<Home />} 
          label="Play" 
          color="bg-sky-500" 
        />
        <NavButton 
          active={activeScreen === 'trace'} 
          onClick={() => setActiveScreen('trace')} 
          icon={<PenTool />} 
          label="Trace" 
          color="bg-purple-500" 
        />
        <NavButton 
          active={activeScreen === 'games'} 
          onClick={() => setActiveScreen('games')} 
          icon={<Gamepad2 />} 
          label="Games" 
          color="bg-emerald-500" 
        />
        <NavButton 
          active={activeScreen === 'rewards'} 
          onClick={() => setActiveScreen('rewards')} 
          icon={<Award />} 
          label="Awards" 
          color="bg-amber-500" 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  color: string;
}> = ({ active, onClick, icon, label, color }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'scale-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
  >
    <div className={`p-2 rounded-2xl ${active ? color : 'bg-slate-100'} text-white shadow-md`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24, className: active ? 'text-white' : 'text-slate-500' })}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-slate-800' : 'text-slate-400'}`}>
      {label}
    </span>
  </button>
);

export default Layout;
