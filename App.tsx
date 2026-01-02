
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TracingBoard from './components/TracingBoard';
import GameCenter from './components/GameCenter';
import RewardStore from './components/RewardStore';
import { Screen, UserStats, Sticker } from './types';
import { ALPHABET } from './constants.tsx';
import { geminiService } from './services/geminiService';
import { Sparkles, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('letterland_stats');
    return saved ? JSON.parse(saved) : {
      stars: 5,
      stickers: [],
      completedLetters: []
    };
  });

  useEffect(() => {
    localStorage.setItem('letterland_stats', JSON.stringify(stats));
  }, [stats]);

  const handleCompleteLetter = (letter: string) => {
    setStats(prev => ({
      ...prev,
      stars: prev.stars + 2,
      completedLetters: prev.completedLetters.includes(letter) 
        ? prev.completedLetters 
        : [...prev.completedLetters, letter]
    }));
  };

  const handleGameWin = () => {
    setStats(prev => ({ ...prev, stars: prev.stars + 1 }));
  };

  const handlePurchase = (sticker: Sticker) => {
    setStats(prev => ({
      ...prev,
      stars: prev.stars - sticker.cost,
      stickers: [...prev.stickers, sticker.id]
    }));
  };

  const renderContent = () => {
    switch (activeScreen) {
      case 'home':
        return (
          <div className="flex flex-col items-center py-8 text-center space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="space-y-4">
              <div className="relative inline-block">
                <div className="absolute -top-4 -right-4 bg-yellow-400 p-2 rounded-full animate-pulse shadow-lg">
                  <Sparkles className="text-white" />
                </div>
                <img 
                  src="https://picsum.photos/seed/kids/400/400" 
                  alt="LetterLand" 
                  className="w-48 h-48 rounded-[3rem] shadow-2xl border-4 border-white rotate-3"
                />
              </div>
              <h1 className="text-4xl font-black text-slate-800 comic-font">Welcome to LetterLand!</h1>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">
                Discover the magic of letters through drawing and games.
              </p>
            </div>

            <div className="grid grid-cols-1 w-full gap-4">
              <button 
                onClick={() => setActiveScreen('trace')}
                className="group relative bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-[2.5rem] text-left text-white shadow-xl hover:scale-[1.02] transition-transform overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12">
                   <PlayCircle size={100} />
                </div>
                <h3 className="text-2xl font-black mb-1">Interactive Tracing</h3>
                <p className="text-purple-100 text-sm">Draw letters and learn sounds!</p>
              </button>

              <button 
                onClick={() => setActiveScreen('games')}
                className="bg-gradient-to-r from-emerald-400 to-teal-500 p-6 rounded-[2.5rem] text-left text-white shadow-xl hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-2xl font-black mb-1">Play & Learn</h3>
                <p className="text-emerald-500 bg-white/20 px-2 py-0.5 rounded inline-block text-xs mt-1">NEW GAMES!</p>
                <p className="text-emerald-50 text-sm mt-2">Win stars with matching games!</p>
              </button>
            </div>

            <div className="bg-white/50 p-6 rounded-[2rem] w-full border border-white backdrop-blur">
              <h4 className="text-slate-800 font-bold mb-4 flex items-center justify-center gap-2">
                 Your Progress
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {ALPHABET.slice(0, 10).map(item => (
                  <div 
                    key={item.letter}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${stats.completedLetters.includes(item.letter) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                  >
                    {item.letter}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 font-black">...</div>
              </div>
            </div>
          </div>
        );
      case 'trace':
        return <TracingBoard onComplete={handleCompleteLetter} />;
      case 'games':
        return <GameCenter onWin={handleGameWin} />;
      case 'rewards':
        return <RewardStore stats={stats} onPurchase={handlePurchase} />;
      default:
        return null;
    }
  };

  return (
    <Layout activeScreen={activeScreen} setActiveScreen={setActiveScreen} stats={stats}>
      {renderContent()}
    </Layout>
  );
};

export default App;
