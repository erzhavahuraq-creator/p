import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MailOpen, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from '../audio/birthdaySynth';

interface LoveLetterCardProps {
  recipientName: string;
  senderName: string;
  loveMessage: string;
}

export const LoveLetterCard: React.FC<LoveLetterCardProps> = ({
  recipientName,
  senderName,
  loveMessage,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenEnvelope = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    birthdaySynth.playSparkleFx();

    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#fb7185', '#f43f5e', '#ec4899', '#ffd1dc'],
      });
    }
  };

  return (
    <section id="love-letter-section" className="py-12 px-4 max-w-3xl mx-auto text-center">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        {/* Ambient specular highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Amplop Rahasia Cinta
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-slate-800 tracking-tight drop-shadow-xs">
            Ada Surat Spesial Untuk {recipientName}
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-md font-normal">
            Klik amplop dengan segel hati di bawah untuk membuka pesan cinta yang tersimpan khusus untukmu.
          </p>

          {/* Interactive Envelope Card */}
          <div className="mt-8 relative cursor-pointer group" onClick={handleOpenEnvelope}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`w-72 sm:w-88 rounded-3xl transition-all duration-500 p-6 flex flex-col items-center justify-center border ${
                isOpen
                  ? 'bg-white/85 backdrop-blur-2xl shadow-2xl border-white/80'
                  : 'glass-button-primary text-white shadow-xl shadow-pink-500/25 border-white/40'
              }`}
            >
              {!isOpen ? (
                <div className="py-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/30">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/95 text-rose-600 flex items-center justify-center shadow-lg font-bold mb-2 border border-white">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">
                    sayang lok
                  </span>
                  <span className="text-xs text-rose-100 mt-1 font-medium">Klik untuk membuka</span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-left w-full text-slate-800"
                >
                  <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
                    <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                      <MailOpen className="w-4 h-4 text-rose-500" />
                      <span>UNTUK {recipientName.toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-rose-600 font-['Dancing_Script'] font-bold text-lg">
                      Selamanya 💖
                    </span>
                  </div>

                  <p className="text-slate-800 text-base sm:text-lg leading-relaxed italic font-['Dancing_Script'] text-2xl sm:text-3xl">
                    &ldquo;{loveMessage}&rdquo;
                  </p>

                  <div className="mt-6 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-['Playfair_Display'] font-bold text-rose-800 text-sm">
                      {senderName}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="text-slate-500 hover:text-rose-600 font-semibold underline cursor-pointer"
                    >
                      Lipat Kembali
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
