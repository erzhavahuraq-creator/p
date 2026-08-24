import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from '../audio/birthdaySynth';

interface FooterProps {
  recipientName: string;
  senderName: string;
}

export const Footer: React.FC<FooterProps> = ({ recipientName, senderName }) => {
  const triggerGrandConfetti = () => {
    birthdaySynth.playSparkleFx();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.9 },
      colors: ['#fb7185', '#f43f5e', '#ec4899', '#f472b6', '#d946ef', '#fbbf24'],
    });
  };

  return (
    <footer className="relative mt-20 pb-24 pt-12 px-4 border-t border-white/60 bg-white/45 backdrop-blur-2xl text-center text-slate-600 shadow-[0_-8px_32px_rgba(244,63,94,0.06)]">
      <div className="max-w-4xl mx-auto space-y-4">
        <div
          onClick={triggerGrandConfetti}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl glass-button-primary text-white shadow-lg shadow-pink-500/25 cursor-pointer hover:scale-110 active:scale-95 transition-transform border border-white/40"
          title="Klik untuk kejutan cinta!"
        >
          <Heart className="w-6 h-6 fill-white" />
        </div>

        <h4 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-slate-800 tracking-tight drop-shadow-xs">
          Selamat Ulang Tahun, {recipientName} 🎂
        </h4>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-rose-700 font-bold">
          <span className="glass-pill px-3 py-1 rounded-full">{senderName}</span>
        </div>
      </div>
    </footer>
  );
};
