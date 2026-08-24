import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, RotateCcw, Heart, Flame } from 'lucide-react';
import { birthdaySynth } from '../audio/birthdaySynth';

interface BirthdayCakeProps {
  recipientName: string;
  age: number | string;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ recipientName, age }) => {
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [isBlowingAnimation, setIsBlowingAnimation] = useState<boolean>(false);
  const [showWishModal, setShowWishModal] = useState<boolean>(false);
  const [wishesCount, setWishesCount] = useState<number>(0);

  const triggerHeartConfetti = () => {
    // Canvas confetti heart blast
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#d946ef', '#ffd1dc', '#fff1f2', '#fbbf24'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Multiple angled burst waves
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      shapes: ['circle'],
      scalar: 1.2,
    });
    fire(0.2, {
      spread: 60,
      shapes: ['circle'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleBlowCandle = () => {
    if (isBlown) return;

    setIsBlowingAnimation(true);
    birthdaySynth.playCandleBlowFx();

    setTimeout(() => {
      setIsBlown(true);
      setIsBlowingAnimation(false);
      triggerHeartConfetti();
      setShowWishModal(true);
      setWishesCount((prev) => prev + 1);
    }, 450);
  };

  const handleRelight = () => {
    setIsBlown(false);
    setShowWishModal(false);
    birthdaySynth.playSparkleFx();
  };

  return (
    <section
      id="birthday-cake-section"
      className="relative py-16 px-4 max-w-4xl mx-auto text-center"
    >
      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center">
        {/* Glow backdrop with specular sheen */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-rose-400/25 via-pink-400/20 to-fuchsia-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Momen Make A Wish
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-slate-800 tracking-tight drop-shadow-xs">
            Kue Ulang Tahun Spesial
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-md font-normal">
            {isBlown
              ? '✨ Lilin telah ditiup! Semoga semua harapan manismu terkabul.'
              : 'Pejamkan mata, buat permohonan tulus dari lubuk hatimu, lalu tiup lilinnya!'}
          </p>

          {/* Interactive 3D/Layered Cake Illustration */}
          <div
            className="relative my-8 cursor-pointer group select-none"
            onClick={handleBlowCandle}
            title={isBlown ? 'Lilin sudah ditiup' : 'Klik kue atau lilin untuk meniup'}
          >
            {/* Candle Age Badge floating above with frosted pill */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill shadow-lg text-xs font-bold text-rose-700">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              Usia Ke-{age || 24}
            </div>

            {/* Candle Flames & Smoke */}
            <div className="flex justify-center items-end gap-5 mb-0.5 relative z-20">
              {[0, 1, 2].map((candleIndex) => (
                <div key={candleIndex} className="flex flex-col items-center">
                  {/* Flame or Smoke */}
                  <div className="h-9 flex items-end justify-center relative">
                    {!isBlown ? (
                      <motion.div
                        className="relative flex items-center justify-center"
                        animate={
                          isBlowingAnimation
                            ? { scale: [1, 1.4, 0], x: [0, 8, 20], opacity: [1, 0.8, 0] }
                            : {
                                scale: [1, 1.08, 0.96, 1.04, 1],
                                rotate: [-3, 3, -2, 2, 0],
                              }
                        }
                        transition={{
                          duration: isBlowingAnimation ? 0.45 : 1.2 + candleIndex * 0.2,
                          repeat: isBlowingAnimation ? 0 : Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        {/* Glow halo */}
                        <div className="absolute w-8 h-8 rounded-full bg-amber-300/60 blur-md -top-1" />
                        {/* Flame shape */}
                        <div className="w-4 h-7 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 shadow-lg shadow-amber-400/50" />
                        <div className="absolute w-2 h-4 rounded-full bg-white/90 top-2" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0.7, 0.4, 0], y: -24, x: [0, (candleIndex - 1) * 6, (candleIndex - 1) * 12] }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
                        className="w-1.5 h-6 bg-slate-300/80 rounded-full blur-[1px]"
                      />
                    )}
                  </div>

                  {/* Candle Stick */}
                  <div className="w-4 h-12 rounded-t-sm bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 border-x border-pink-300 shadow-sm relative overflow-hidden">
                    {/* Candle stripes */}
                    <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#f43f5e,#f43f5e_3px,transparent_3px,transparent_8px)]" />
                    {/* Wick */}
                    <div className="w-0.5 h-2 bg-slate-800 mx-auto -mt-1.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Layers */}
            <div className="relative w-64 sm:w-80 flex flex-col items-center">
              {/* Top Layer */}
              <div className="relative w-48 sm:w-56 h-16 rounded-t-3xl bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 border-t-2 border-pink-100 shadow-md flex flex-col justify-between overflow-hidden">
                {/* Frosting dripping drips */}
                <div className="w-full flex justify-between px-2 pt-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-white/95 rounded-full -mt-2 shadow-xs border-b border-pink-200"
                      style={{ height: `${12 + (i % 3) * 5}px` }}
                    />
                  ))}
                </div>
                {/* Decorative Pearl Sprinkles */}
                <div className="flex justify-around items-center px-4 pb-2">
                  <span className="text-[10px]">🍓</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  <span className="text-[10px]">🌸</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  <span className="text-[10px]">🍓</span>
                </div>
              </div>

              {/* Middle Layer */}
              <div className="relative w-56 sm:w-68 h-18 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 border-t-2 border-white/50 shadow-inner flex flex-col justify-between overflow-hidden">
                <div className="w-full flex justify-between px-2 pt-0.5">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-white/90 rounded-full -mt-2 border-b border-pink-200"
                      style={{ height: `${10 + (i % 4) * 4}px` }}
                    />
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 pb-2 text-xs font-semibold text-rose-900/80 font-['Dancing_Script'] text-base">
                  Happy Birthday {recipientName}
                </div>
              </div>

              {/* Bottom Layer */}
              <div className="relative w-64 sm:w-76 h-20 rounded-b-2xl bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 border-t-2 border-white/60 shadow-lg flex flex-col justify-between overflow-hidden">
                <div className="w-full flex justify-between px-2 pt-0.5">
                  {[...Array(14)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-white/95 rounded-full -mt-2 border-b border-pink-200"
                      style={{ height: `${12 + (i % 3) * 6}px` }}
                    />
                  ))}
                </div>
                {/* Ribbon border */}
                <div className="w-full h-3 bg-fuchsia-600/30 backdrop-blur-xs flex items-center justify-center">
                  <div className="w-full border-t border-dashed border-white/70" />
                </div>
              </div>

              {/* Cake Stand Plate */}
              <div className="w-72 sm:w-88 h-4 rounded-full bg-gradient-to-r from-slate-200 via-white to-slate-200 border border-slate-300 shadow-xl -mt-1" />
              <div className="w-28 sm:w-36 h-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-b-lg shadow-md" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {!isBlown ? (
              <button
                type="button"
                id="blow-candles-button"
                onClick={handleBlowCandle}
                disabled={isBlowingAnimation}
                className="px-7 py-3.5 rounded-full glass-button-primary text-white font-bold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/40"
              >
                <Wind className="w-4 h-4" />
                Tiup Lilin Sekarang!
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  id="relight-candles-button"
                  onClick={handleRelight}
                  className="px-5 py-2.5 rounded-full glass-card hover:bg-white text-rose-700 font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/80"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nyalakan Lilin Kembali
                </button>
                <button
                  type="button"
                  id="view-wish-button"
                  onClick={() => {
                    setShowWishModal(true);
                    triggerHeartConfetti();
                  }}
                  className="px-5 py-2.5 rounded-full glass-button-primary text-white font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/40"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Buka Doa & Harapan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Birthday Wish Modal Popup with Frosted Glass */}
      <AnimatePresence>
        {showWishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="relative max-w-lg w-full bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl text-center overflow-hidden"
            >
              {/* Decorative corner florals */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-transparent rounded-br-full pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-fuchsia-400/20 to-transparent rounded-tl-full pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-button-primary flex items-center justify-center text-white shadow-lg shadow-pink-500/30 animate-bounce border border-white/40">
                  <Heart className="w-8 h-8 fill-white" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-slate-800">
                  Selamat Ulang Tahun, {recipientName}! 🎉
                </h3>
                <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mt-1">
                  Permohonan Ulang Tahun Telah Terkirim Ke Semesta
                </p>

                <div className="my-6 p-4 rounded-2xl glass-pill text-slate-800 text-sm sm:text-base leading-relaxed italic font-['Dancing_Script'] text-2xl">
                  &ldquo;Di hari bertambahnya usiamu ini, semoga setiap langkahmu selalu dipenuhi cinta, tawa, kesehatan, dan kebahagiaan tak terhingga. Aku sangat bersyukur memilikimu dalam hidupku.&rdquo;
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHeartConfetti();
                      birthdaySynth.playSparkleFx();
                    }}
                    className="px-4 py-2.5 rounded-full glass-card text-rose-800 hover:bg-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-xs border border-white/80"
                  >
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    Ledakan Hati Lagi! 💖
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWishModal(false)}
                    className="px-6 py-2.5 rounded-full glass-button-primary text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer border border-white/40"
                  >
                    Tutup & Nikmati Hari Ini
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
