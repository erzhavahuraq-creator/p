import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, BookmarkCheck, Heart, Sparkles, Calendar, BookOpen, Check, X } from 'lucide-react';
import { MemoryItem } from '../types';
import { birthdaySynth } from '../audio/birthdaySynth';

interface MemoriesTimelineProps {
  memories: MemoryItem[];
  onUpdateMemories: (memories: MemoryItem[]) => void;
}

export const MemoriesTimeline: React.FC<MemoriesTimelineProps> = ({
  memories,
  onUpdateMemories,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Momen Spesial');
  const [emoji, setEmoji] = useState<string>('💖');

  const categories = [
    'Pertama Bertemu',
    'Kencan Pertama',
    'Liburan Bersama',
    'Momen Manis',
    'Janji Cinta',
    'Tawa & Canda',
  ];

  const emojis = ['💖', '🌹', '✨', '☕', '🌅', '✈️', '🎁', '🎂', '🥂', '💌', '💍', '🧸'];

  const handleOpenAdd = () => {
    setTitle('');
    setDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setDescription('');
    setCategory('Momen Manis');
    setEmoji('💖');
    setEditingMemory(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: MemoryItem) => {
    setEditingMemory(item);
    setTitle(item.title);
    setDate(item.date);
    setDescription(item.description);
    setCategory(item.category);
    setEmoji(item.emoji);
    setIsAddModalOpen(true);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingMemory) {
      // Update existing
      const updated = memories.map((m) =>
        m.id === editingMemory.id
          ? {
              ...m,
              title,
              date,
              description,
              category,
              emoji,
            }
          : m
      );
      onUpdateMemories(updated);
    } else {
      // Add new
      const newItem: MemoryItem = {
        id: `memory-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        date: date || 'Momen Berharga',
        description,
        category,
        emoji,
      };
      onUpdateMemories([newItem, ...memories]);
    }

    birthdaySynth.playSparkleFx();
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onUpdateMemories(memories.filter((m) => m.id !== id));
  };

  return (
    <section id="memories-section" className="py-16 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
          <BookOpen className="w-3.5 h-3.5 text-rose-500" />
          Kisah & Jejak Kenangan
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-slate-800 tracking-tight drop-shadow-xs">
          Cerita Perjalanan Cinta Kita
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-700 font-normal">
          Setiap momen bersamamu adalah lembaran kenangan indah yang selalu terukir abadi di hatiku.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            id="add-memory-button"
            onClick={handleOpenAdd}
            className="px-7 py-3 rounded-full glass-button-primary text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/40"
          >
            <Plus className="w-4 h-4" />
            Tambah Cerita Baru
          </button>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Center/Left Glowing Line with Frosted aesthetic */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-rose-400 via-pink-400 to-fuchsia-400 opacity-60 rounded-full transform -translate-x-1/2" />

        {memories.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl border-2 border-white/80 border-dashed p-6">
            <Heart className="w-10 h-10 text-rose-400 mx-auto mb-2" />
            <p className="text-slate-700 text-sm font-semibold">Belum ada cerita yang dicatat.</p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-3 text-xs text-rose-600 hover:underline font-bold cursor-pointer"
            >
              + Buat Cerita Pertama Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {memories.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`relative flex items-center ${
                    isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  } flex-row pl-12 sm:pl-0`}
                >
                  {/* Timeline Center Node */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full glass-button-primary text-white flex items-center justify-center text-sm select-none border border-white/60 shadow-lg shadow-pink-500/25">
                    {item.emoji || '💖'}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full sm:w-[calc(50%-2rem)] ${
                      isEven ? 'sm:pr-6 sm:text-right' : 'sm:pl-6 sm:text-left'
                    }`}
                  >
                    <div className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 text-left group relative">
                      {/* Top metadata */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/60 pb-2.5 mb-3">
                        <span className="text-[11px] font-bold px-3 py-0.5 rounded-full glass-pill text-rose-700 flex items-center gap-1">
                          <BookmarkCheck className="w-3 h-3 text-rose-500" />
                          {item.category}
                        </span>

                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3 text-rose-400" />
                          {item.date}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-bold text-base sm:text-lg text-slate-800 font-['Playfair_Display']">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-['Plus_Jakarta_Sans'] whitespace-pre-line font-normal">
                        {item.description}
                      </p>

                      {/* Card Action footer */}
                      <div className="mt-4 pt-3 border-t border-white/50 flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-white/80 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Memory Modal with Frosted Glass */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/80 shadow-2xl text-left my-8"
            >
              <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-5">
                <h3 className="text-lg font-bold font-['Playfair_Display'] text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  {editingMemory ? 'Edit Cerita Kenangan' : 'Tambah Cerita Kenangan Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 border border-white/80 flex items-center justify-center text-sm font-bold cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMemory} className="space-y-4 text-sm text-slate-700">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Kenangan
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Saat Pertama Kali Bertatap Mata"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Cerita
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 text-sm focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal / Waktu
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="Contoh: 14 Februari 2024"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Emoji Mood
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl glass-pill">
                    {emojis.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setEmoji(em)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all cursor-pointer border ${
                          emoji === em
                            ? 'glass-button-primary text-white border-white/60 shadow-md scale-110'
                            : 'glass-card border-white/70 hover:bg-white'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi Cerita / Kenangan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ceritakan bagaimana momen manis itu terjadi..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 text-sm leading-relaxed focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-rose-100 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full glass-card hover:bg-white text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full glass-button-primary text-white text-xs sm:text-sm font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer border border-white/40"
                  >
                    <Check className="w-4 h-4" /> Simpan Cerita
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
