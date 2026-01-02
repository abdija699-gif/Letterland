
import React from 'react';
import { STICKER_SHOP } from '../constants.tsx';
import { UserStats, Sticker } from '../types';
import { geminiService } from '../services/geminiService';
import { ShoppingBag, Lock } from 'lucide-react';

interface RewardStoreProps {
  stats: UserStats;
  onPurchase: (sticker: Sticker) => void;
}

const RewardStore: React.FC<RewardStoreProps> = ({ stats, onPurchase }) => {
  const handleBuy = (sticker: Sticker) => {
    if (stats.stars >= sticker.cost && !stats.stickers.includes(sticker.id)) {
      geminiService.speak(`Wow! You got the ${sticker.name}! It looks amazing!`);
      onPurchase(sticker);
    } else if (stats.stickers.includes(sticker.id)) {
      geminiService.speak(`You already have this sticker!`);
    } else {
      geminiService.speak(`You need ${sticker.cost - stats.stars} more stars for the ${sticker.name}. Keep playing!`);
    }
  };

  return (
    <div className="py-6 space-y-8">
      <section>
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="text-amber-500" />
          <h2 className="text-2xl font-black text-slate-800">Sticker Shop</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {STICKER_SHOP.map(sticker => {
            const isOwned = stats.stickers.includes(sticker.id);
            const canAfford = stats.stars >= sticker.cost;
            return (
              <button
                key={sticker.id}
                onClick={() => handleBuy(sticker)}
                disabled={isOwned}
                className={`relative p-4 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-2 ${
                  isOwned 
                    ? 'bg-slate-100 border-slate-200 opacity-60' 
                    : canAfford
                      ? 'bg-white border-yellow-200 hover:border-yellow-400 shadow-lg'
                      : 'bg-white border-slate-100 shadow-sm opacity-80'
                }`}
              >
                <span className="text-5xl">{sticker.emoji}</span>
                <span className="font-bold text-slate-800 text-sm">{sticker.name}</span>
                {!isOwned && (
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" /> {sticker.cost}
                  </div>
                )}
                {isOwned && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                    <Lock size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-slate-800 mb-4">Your Collection</h2>
        {stats.stickers.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
            <p className="text-slate-400 font-medium">Earn stars to collect stickers!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 p-4 bg-white rounded-3xl shadow-inner border border-slate-100">
            {stats.stickers.map(id => {
              const sticker = STICKER_SHOP.find(s => s.id === id);
              return (
                <div key={id} className="text-4xl animate-in zoom-in duration-300">
                  {sticker?.emoji}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default RewardStore;
