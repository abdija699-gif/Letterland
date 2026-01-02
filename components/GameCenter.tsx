
import React, { useState, useEffect } from 'react';
import { ALPHABET } from '../constants.tsx';
import { geminiService } from '../services/geminiService';
import { Volume2, Trophy } from 'lucide-react';

interface GameCenterProps {
  onWin: () => void;
}

const GameCenter: React.FC<GameCenterProps> = ({ onWin }) => {
  const [target, setTarget] = useState(ALPHABET[0]);
  const [options, setOptions] = useState<typeof ALPHABET>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const startNewRound = () => {
    const randomTarget = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const others = ALPHABET.filter(a => a.letter !== randomTarget.letter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const newOptions = [...others, randomTarget].sort(() => 0.5 - Math.random());
    
    setTarget(randomTarget);
    setOptions(newOptions);
    setFeedback(null);
    
    geminiService.speak(`Where is the letter ${randomTarget.letter}?`);
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const handleSelect = (letter: typeof ALPHABET[0]) => {
    if (letter.letter === target.letter) {
      setFeedback('CORRECT! 🌟');
      setScore(s => s + 1);
      geminiService.speak(`Great job! That's the letter ${target.letter}!`);
      onWin();
      setTimeout(startNewRound, 1500);
    } else {
      setFeedback('Try again! ❤️');
      geminiService.speak(`Oops! That's ${letter.letter}. Try looking for ${target.letter}!`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Find the Letter</h2>
        <div className="bg-white px-6 py-4 rounded-3xl shadow-md border-b-4 border-sky-400 inline-flex items-center gap-3">
           <Volume2 className="text-sky-500" />
           <span className="text-5xl font-black text-sky-600 comic-font">{target.letter}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((opt) => (
          <button
            key={opt.letter}
            onClick={() => handleSelect(opt)}
            className="aspect-square bg-white rounded-[2rem] shadow-xl border-4 border-slate-100 flex items-center justify-center text-6xl font-black transition-transform active:scale-95 hover:border-sky-300"
            style={{ color: opt.color }}
          >
            {opt.letter}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`text-3xl font-black comic-font animate-bounce ${feedback.includes('CORRECT') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {feedback}
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-full">
        <Trophy className="text-yellow-400" />
        <span className="font-bold">Score: {score}</span>
      </div>
    </div>
  );
};

export default GameCenter;
