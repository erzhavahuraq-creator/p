import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  Heart,
  Sparkles,
  SkipBack,
  SkipForward,
  Disc3,
  ListMusic,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { birthdaySynth, BirthdayTrack } from '../audio/birthdaySynth';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeNote, setActiveNote] = useState<string>('');
  const [currentTrack, setCurrentTrack] = useState<BirthdayTrack>(birthdaySynth.getCurrentTrack());
  const tracks = birthdaySynth.getTracks();

  useEffect(() => {
    birthdaySynth.setCallback((note) => {
      setActiveNote(note);
    });

    birthdaySynth.setTrackCallback((track) => {
      setCurrentTrack(track);
    });

    return () => {
      birthdaySynth.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    const nextState = birthdaySynth.toggle();
    setIsPlaying(nextState);
  };

  const handleSelectTrack = (trackId: string) => {
    birthdaySynth.setTrack(trackId);
    setCurrentTrack(birthdaySynth.getCurrentTrack());
    if (!isPlaying) {
      birthdaySynth.start();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = birthdaySynth.nextTrack();
    setCurrentTrack(next);
    if (!isPlaying) {
      birthdaySynth.start();
      setIsPlaying(true);
    }
  };

  const handlePrevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = birthdaySynth.prevTrack();
    setCurrentTrack(prev);
    if (!isPlaying) {
      birthdaySynth.start();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    birthdaySynth.setVolume(val);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      birthdaySynth.setVolume(volume || 0.5);
    } else {
      setIsMuted(true);
      birthdaySynth.setVolume(0);
    }
  };

  return (
    <div
      id="music-player-widget"
      className="fixed bottom-6 right-6 z-40 flex items-center"
    >
      <div className="relative group">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              className="absolute bottom-16 right-0 w-80 sm:w-88 p-5 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_16px_40px_rgba(244,63,94,0.16)] mb-2 text-slate-800"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between mb-3 border-b border-rose-100/70 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-2xl glass-button-primary flex items-center justify-center text-white border border-white/40 shadow-xs">
                    <Disc3 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{currentTrack.title}</span>
                      <span className="text-xs">{currentTrack.icon}</span>
                    </h4>
                    <p className="text-[10px] text-rose-600 font-semibold">
                      {currentTrack.instrumentName}
                    </p>
                  </div>
                </div>
                {activeNote && isPlaying && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full glass-pill text-rose-700 font-mono font-bold animate-pulse">
                    🎵 {activeNote}
                  </span>
                )}
              </div>

              {/* Subtitle / Description of current melody */}
              <p className="text-[11px] text-slate-600 mb-3 px-1 leading-relaxed italic">
                &ldquo;{currentTrack.subtitle}&rdquo;
              </p>

              {/* Track Selection Menu */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1 px-1">
                  <span className="flex items-center gap-1">
                    <ListMusic className="w-3.5 h-3.5 text-rose-500" />
                    Pilihan Melodi Ulang Tahun
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {tracks.length} Versi Musik
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {tracks.map((t) => {
                    const isSelected = currentTrack.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTrack(t.id)}
                        className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center justify-between border cursor-pointer ${
                          isSelected
                            ? 'glass-card border-rose-300 bg-rose-50/70 shadow-xs'
                            : 'bg-white/40 hover:bg-white/70 border-white/60 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base flex-shrink-0">{t.icon}</span>
                          <div className="truncate">
                            <p
                              className={`text-xs font-bold truncate ${
                                isSelected ? 'text-rose-700' : 'text-slate-700'
                              }`}
                            >
                              {t.title}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {t.instrumentName}
                            </p>
                          </div>
                        </div>

                        {isSelected && isPlaying ? (
                          <div className="flex items-center gap-0.5 h-3 ml-2 flex-shrink-0">
                            {[0.6, 1.0, 0.4].map((h, idx) => (
                              <motion.div
                                key={idx}
                                className="w-0.5 bg-rose-500 rounded-full"
                                animate={{ height: ['20%', `${h * 100}%`, '30%'] }}
                                transition={{
                                  duration: 0.5 + idx * 0.1,
                                  repeat: Infinity,
                                  repeatType: 'reverse',
                                }}
                              />
                            ))}
                          </div>
                        ) : isSelected ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                            Aktif
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Playback Controls: Prev, Play/Pause, Next */}
              <div className="flex items-center justify-center gap-4 py-2 border-t border-rose-100/70">
                <button
                  type="button"
                  onClick={handlePrevTrack}
                  title="Melodi Sebelumnya"
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-700 border border-white/70 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <SkipBack className="w-4 h-4 fill-slate-700" />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-10 h-10 rounded-full glass-button-primary text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextTrack}
                  title="Melodi Selanjutnya"
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-700 border border-white/70 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <SkipForward className="w-4 h-4 fill-slate-700" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1.5 mt-2 pt-2.5 border-t border-rose-100/70">
                <div className="flex items-center justify-between text-[11px] text-slate-700">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="flex items-center gap-1 font-semibold hover:text-rose-600 cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    Volume
                  </button>
                  <span className="font-bold text-rose-600">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Bottom Sparkle FX */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-[10px] text-slate-400 font-medium">
                  Limiter + Dynamic Reverb ON
                </span>
                <button
                  type="button"
                  onClick={() => birthdaySynth.playSparkleFx()}
                  className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-pink-500" /> Sparkle FX
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button with Frosted Glass */}
        <div className="flex items-center gap-2.5 glass-panel p-1.5 pr-4 rounded-full border border-white/80 shadow-[0_8px_32px_rgba(244,63,94,0.18)] hover:shadow-pink-500/25 transition-all">
          <button
            type="button"
            id="play-music-button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause Musik' : 'Putar Musik Ulang Tahun'}
            className="relative w-11 h-11 rounded-full glass-button-primary text-white flex items-center justify-center shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}

            {/* Glowing ring when active */}
            {isPlaying && (
              <span className="absolute -inset-1 rounded-full bg-pink-400 opacity-40 animate-ping -z-10" />
            )}
          </button>

          <button
            type="button"
            id="toggle-music-panel-button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2.5 text-left cursor-pointer select-none"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                {isPlaying ? currentTrack.title : 'Putar Musik'}
                <Heart
                  className={`w-3 h-3 ${
                    isPlaying ? 'fill-rose-500 text-rose-500 animate-bounce' : 'text-slate-400'
                  }`}
                />
              </span>
              <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                <span>{currentTrack.icon}</span>
                {isPlaying ? `${currentTrack.instrumentName}` : '4 Pilihan Melodi'}
              </span>
            </div>

            {/* Animated Equalizer Waves */}
            <div className="flex items-end gap-0.5 h-4 ml-1">
              {[0.4, 0.9, 0.6, 1.0, 0.5].map((heightScale, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-rose-500 to-pink-400 rounded-full"
                  animate={
                    isPlaying
                      ? {
                          height: ['20%', `${heightScale * 100}%`, '30%'],
                        }
                      : { height: '25%' }
                  }
                  transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
