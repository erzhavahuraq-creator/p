import React from 'react';
import { Heart, Sparkles, Cake, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from '../audio/birthdaySynth';

interface HeaderProps {
  recipientName: string;
}

export const Header: React.FC<HeaderProps> = ({ recipientName }) => {
  const triggerSparks = () => {
    birthdaySynth.playSparkleFx();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.1, x: 0.5 },
      colors: ['#fb7185', '#f43f5e', '#ec4899', '#f472b6', '#ffd1dc'],
    });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-white/45 backdrop-blur-2xl border-b border-white/70 shadow-[0_8px_30px_rgb(244,114,182,0.12)] transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={triggerSparks}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 border border-white/50 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="font-['Dancing_Script'] text-2xl font-bold text-rose-600 block leading-tight drop-shadow-xs">
              Happy Birthday
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block -mt-1">
              Untuk {recipientName} 💖
            </span>
          </div>
        </div>

        {/* Navigation Anchor Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white/35 backdrop-blur-md px-2 py-1 rounded-full border border-white/60 shadow-inner">
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="px-3.5 py-1.5 rounded-full hover:bg-white/70 hover:text-rose-700 hover:shadow-xs transition-all cursor-pointer"
          >
            Ucapan
          </button>
          <button
            type="button"
            onClick={() => scrollTo('birthday-cake-section')}
            className="px-3.5 py-1.5 rounded-full hover:bg-white/70 hover:text-rose-700 hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Cake className="w-3.5 h-3.5 text-pink-500" />
            Tiup Lilin
          </button>
          <button
            type="button"
            onClick={() => scrollTo('photo-gallery-section')}
            className="px-3.5 py-1.5 rounded-full hover:bg-white/70 hover:text-rose-700 hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
            Galeri Foto
          </button>
          <button
            type="button"
            onClick={() => scrollTo('love-letter-section')}
            className="px-3.5 py-1.5 rounded-full hover:bg-white/70 hover:text-rose-700 hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Amplop Cinta
          </button>
        </nav>

        {/* Quick Action Sparkle Button */}
        <button
          type="button"
          onClick={triggerSparks}
          className="px-4 py-2 rounded-full glass-button-primary text-white text-xs font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-white/40"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="hidden sm:inline">Kirim Taburan Cinta</span>
          <span className="sm:hidden">Sparkle</span>
        </button>
      </div>
    </header>
  );
};
