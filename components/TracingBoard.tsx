
import React, { useRef, useEffect, useState } from 'react';
import { ALPHABET } from '../constants.tsx';
import { geminiService } from '../services/geminiService';
import { RefreshCw, CheckCircle2, Volume2 } from 'lucide-react';

interface TracingBoardProps {
  onComplete: (letter: string) => void;
}

const TracingBoard: React.FC<TracingBoardProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const currentLetter = ALPHABET[currentIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide letter
    ctx.font = 'bold 300px Comic Neue';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f1f5f9'; // Very light gray guide
    ctx.fillText(currentLetter.letter, canvas.width / 2, canvas.height / 2);
    
    // Dotted outline
    ctx.strokeStyle = '#e2e8f0';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 4;
    ctx.strokeText(currentLetter.letter, canvas.width / 2, canvas.height / 2);
    ctx.setLineDash([]); // Reset dash

    // Welcome sound
    geminiService.speak(`Let's trace the letter ${currentLetter.letter}! ${currentLetter.letter} is for ${currentLetter.word}.`);
  }, [currentIndex]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasStarted(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentLetter.color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Sparkle effect simulation (optional improvement)
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw guide
    ctx.font = 'bold 300px Comic Neue';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(currentLetter.letter, canvas.width / 2, canvas.height / 2);
    setHasStarted(false);
  };

  const handleFinish = () => {
    geminiService.speak(`Excellent! You traced the letter ${currentLetter.letter}! You win a star!`);
    onComplete(currentLetter.letter);
    if (currentIndex < ALPHABET.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const playSound = () => {
    geminiService.speak(`${currentLetter.letter}. ${currentLetter.letter} says ${currentLetter.letter === 'A' ? 'ah' : currentLetter.letter.toLowerCase()}! ${currentLetter.word}.`);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="text-8xl mb-2">{currentLetter.image}</div>
        <h2 className="text-4xl font-black text-slate-800 comic-font tracking-widest" style={{ color: currentLetter.color }}>
          {currentLetter.letter} is for {currentLetter.word}
        </h2>
      </div>

      <div className="relative bg-white rounded-[2rem] shadow-xl border-4 border-slate-100 overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair"
        />
        
        {!hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="bg-slate-200/50 p-4 rounded-full animate-pulse">
              <PenTool className="w-12 h-12 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={playSound}
          className="flex-1 bg-sky-100 hover:bg-sky-200 text-sky-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border-b-4 border-sky-300 active:border-b-0 active:translate-y-1"
        >
          <Volume2 /> Listen
        </button>
        <button 
          onClick={clearCanvas}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
        >
          <RefreshCw /> Start Over
        </button>
      </div>

      <button 
        onClick={handleFinish}
        disabled={!hasStarted}
        className={`w-full py-5 rounded-[2rem] text-white font-black text-xl shadow-lg flex items-center justify-center gap-3 transition-all ${hasStarted ? 'bg-gradient-to-r from-emerald-500 to-teal-600 scale-100 border-b-8 border-emerald-700' : 'bg-slate-300 scale-95 opacity-50 grayscale cursor-not-allowed'}`}
      >
        <CheckCircle2 size={28} /> DONE!
      </button>
    </div>
  );
};

const PenTool: React.FC<{className?: string, size?: number}> = ({className, size=24}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l5 5"/><path d="M11 11l1 1"/></svg>
);

export default TracingBoard;
