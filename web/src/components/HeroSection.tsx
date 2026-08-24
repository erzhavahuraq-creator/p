import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Check, RotateCcw, Heart, Sparkles, Calendar, User, Gift, MessageSquareHeart } from 'lucide-react';
import { HeroData } from '../types';
import { birthdaySynth } from '../audio/birthdaySynth';

interface HeroSectionProps {
  data: HeroData;
  onUpdate: (newData: HeroData) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<HeroData>(data);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    birthdaySynth.playSparkleFx();
  };

  const handleReset = () => {
    const defaultData: HeroData = {
      title: 'Selamat Ulang Tahun, Sayangku! 💖',
      subtitle: 'Hari istimewa untuk jiwa yang paling memesona di seluruh duniaku.',
      recipientName: 'Dinda Permata',
      age: 24,
      badgeText: 'Momen Paling Bahagia',
      loveMessage: 'Terima kasih telah hadir dan memberi warna terindah dalam hidupku. Senyummu adalah cahaya hariku, dan tawamu adalah melodi paling merdu. Semoga usiamu yang baru dipenuhi berkah, cinta, dan impian yang menjadi nyata.',
      senderName: 'Selalu Milikmu, Rayhan',
      dateStr: '23 Agustus',
    };
    setFormData(defaultData);
    onUpdate(defaultData);
  };

  const applyPreset = (preset: 'sweet' | 'poetic' | 'deep') => {
    let presetData: Partial<HeroData> = {};
    if (preset === 'sweet') {
      presetData = {
        title: 'Happy Birthday, Manisku! 🍰✨',
        subtitle: 'Semoga hari ini semanis senyummu dan sehangat pelukanmu.',
        badgeText: 'Sweetest Birthday Ever',
        loveMessage: 'Selamat bertambah umur, kesayangan! Jangan pernah berhenti tersenyum, karena senyummu adalah sumber energiku setiap hari. Love you to the moon and back!',
      };
    } else if (preset === 'poetic') {
      presetData = {
        title: 'Untuk Bidadari Hatiku 🌹',
        subtitle: 'Bersamamu, setiap detik adalah puisi cinta yang tak pernah usai.',
        badgeText: 'Mekar Indah Dalam Cinta',
        loveMessage: 'Waktu boleh terus berputar, namun rasa kagum dan cintaku padamu kian bertambah di setiap hembusan nafas. Selamat merayakan hari kelahiranmu, permata hatiku.',
      };
    } else {
      presetData = {
        title: 'Selamat Ulang Tahun, Teman Hidupku 💍',
        subtitle: 'Satu tahun lagi perjalanan indah yang kita lewati bersama.',
        badgeText: 'Cinta Abadi & Selamanya',
        loveMessage: 'Terima kasih telah menjadi rumah tempatku pulang, sahabat terhebatku, dan belahan jiwaku. Aku berjanji akan selalu ada di sampingmu dalam setiap tawa dan haru.',
      };
    }
    setFormData((prev) => ({ ...prev, ...presetData }));
  };

  return (
    <section id="hero-section" className="relative pt-10 pb-16 px-4 max-w-5xl mx-auto text-center">
      {/* Top Floating Badge with Frosted Glass Pill */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill text-rose-700 text-xs sm:text-sm font-semibold mb-6"
      >
        <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
        <span>{data.badgeText}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        <span className="text-slate-600 font-medium">{data.dateStr}</span>
      </motion.div>

      {/* Main Title & Subtitle with Romantic Display Typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="space-y-4"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-['Playfair_Display'] text-slate-800 tracking-tight leading-tight drop-shadow-xs">
          {data.title.replace(data.recipientName, '')}
          <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 font-['Dancing_Script'] font-bold text-5xl sm:text-7xl md:text-8xl drop-shadow-sm">
            {data.recipientName}
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-700 max-w-2xl mx-auto font-normal font-['Plus_Jakarta_Sans'] leading-relaxed">
          {data.subtitle}
        </p>

        {/* Milestone Age Pill */}
        <div className="flex justify-center items-center gap-3 pt-2">
          <div className="px-5 py-2 rounded-full glass-button-primary text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-500/25 flex items-center gap-2 border border-white/40">
            <Gift className="w-4 h-4" />
            <span>Merayakan Usia Ke-{data.age}</span>
            <Heart className="w-4 h-4 fill-white" />
          </div>
        </div>
      </motion.div>

      {/* Love Message Card (Frosted Glass Panel) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-10 max-w-3xl mx-auto relative group"
      >
        <div className="glass-panel rounded-3xl p-6 sm:p-10 text-left relative overflow-hidden">
          {/* Subtle specular sheen overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-3xl" />

          {/* Subtle watermark flower */}
          <div className="absolute -right-8 -bottom-8 text-9xl text-pink-300/20 select-none pointer-events-none font-['Dancing_Script']">
            Love
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-white/70 pb-4 mb-5">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                <MessageSquareHeart className="w-5 h-5 text-rose-500" />
                <span className="font-['Playfair_Display'] text-base text-rose-950 font-bold">Isi Pikiranku</span>
              </div>
              <div className="text-xs text-rose-700 font-semibold glass-pill px-3.5 py-1 rounded-full">
                Spesial Untuk {data.recipientName}
              </div>
            </div>

            <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-['Plus_Jakarta_Sans'] font-normal whitespace-pre-line">
              &ldquo;{data.loveMessage}&rdquo;
            </p>

            <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between text-xs sm:text-sm text-slate-600">
              <div className="font-['Dancing_Script'] text-2xl sm:text-3xl text-rose-600 font-bold">
                {data.senderName}
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                <span>lopyo</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Trigger Button */}
      <div className="mt-8 flex justify-center items-center gap-3">
        <button
          type="button"
          id="custom-hero-text-btn"
          onClick={() => {
            setFormData(data);
            setIsEditing(true);
          }}
          className="px-6 py-3 rounded-full glass-card hover:bg-white/80 text-rose-800 border border-white/80 shadow-md hover:shadow-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 cursor-pointer group"
        >
          <Edit3 className="w-4 h-4 text-pink-600 group-hover:rotate-12 transition-transform" />
          Kustomisasi Teks & Nama Sendiri
        </button>
      </div>

      {/* In-Page Modal for Customizing All Hero Texts with Frosted Glass */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/80 shadow-2xl text-left my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-slate-800 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-rose-500" />
                    Kustomisasi Ucapan Ulang Tahun
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ubah nama pasangan, usia, judul, dan pesan cinta sesukamu
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-full bg-white/60 hover:bg-white text-slate-600 border border-white/70 flex items-center justify-center text-sm font-bold cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              {/* Quick Romantic Presets */}
              <div className="mb-6 p-4 rounded-2xl glass-pill">
                <span className="text-xs font-bold text-rose-900 block mb-2">
                  ✨ Pilih Gaya Pesan Cepat:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('sweet')}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white/80 text-rose-700 border border-white/80 hover:bg-rose-50 font-semibold transition cursor-pointer shadow-2xs"
                  >
                    🍰 Manis & Ceria
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('poetic')}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white/80 text-rose-700 border border-white/80 hover:bg-rose-50 font-semibold transition cursor-pointer shadow-2xs"
                  >
                    🌹 Puitis & Romantis
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('deep')}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white/80 text-rose-700 border border-white/80 hover:bg-rose-50 font-semibold transition cursor-pointer shadow-2xs"
                  >
                    💍 Janji & Masa Depan
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-sm text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-rose-500" /> Nama yang Berulang Tahun
                    </label>
                    <input
                      type="text"
                      id="input-recipient-name"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                      placeholder="Contoh: Dinda Permata"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-rose-500" /> Usia / Angka Ulang Tahun
                    </label>
                    <input
                      type="text"
                      id="input-age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                      placeholder="Contoh: 24"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Judul Utama Halaman
                    </label>
                    <input
                      type="text"
                      id="input-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                      placeholder="Contoh: Selamat Ulang Tahun, Sayangku! 💖"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" /> Tanggal / Badge
                    </label>
                    <input
                      type="text"
                      id="input-date"
                      value={formData.dateStr}
                      onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                      placeholder="Contoh: 23 Agustus"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-Judul Romantis
                  </label>
                  <input
                    type="text"
                    id="input-subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                    placeholder="Contoh: Hari istimewa untuk jiwa yang paling memesona..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pesan Cinta / Surat Hati
                  </label>
                  <textarea
                    rows={4}
                    id="input-love-message"
                    value={formData.loveMessage}
                    onChange={(e) => setFormData({ ...formData, loveMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 placeholder-slate-400 text-sm leading-relaxed focus:outline-none"
                    placeholder="Tuliskan ucapan cinta terdalammu di sini..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pengirim / Tanda Tangan
                  </label>
                  <input
                    type="text"
                    id="input-sender"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                    placeholder="Contoh: Selalu Milikmu, Rayhan"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Default
                </button>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-full glass-card hover:bg-white text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    id="save-hero-changes-btn"
                    onClick={handleSave}
                    className="px-6 py-2 rounded-full glass-button-primary text-white text-xs sm:text-sm font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Simpan Perubahan
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
