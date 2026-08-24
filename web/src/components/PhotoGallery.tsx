import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Sliders,
  RotateCw,
  Trash2,
  Maximize2,
  Sparkles,
  Heart,
  Check,
  X,
  Plus
} from 'lucide-react';
import { PhotoItem, PhotoFilterPreset } from '../types';
import { birthdaySynth } from '../audio/birthdaySynth';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onUpdatePhotos: (photos: PhotoItem[]) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onUpdatePhotos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Filter styles generator based on preset and sliders
  const getFilterStyle = (photo: PhotoItem) => {
    let presetFilter = '';
    switch (photo.filterPreset) {
      case 'bw':
        presetFilter = 'grayscale(100%)';
        break;
      case 'sepia':
        presetFilter = 'sepia(80%)';
        break;
      case 'vintage':
        presetFilter = 'sepia(45%) contrast(110%) hue-rotate(-15deg)';
        break;
      case 'softpink':
        presetFilter = 'sepia(25%) saturate(140%) hue-rotate(320deg)';
        break;
      case 'romantic':
        presetFilter = 'saturate(150%) contrast(108%) hue-rotate(345deg)';
        break;
      case 'golden':
        presetFilter = 'sepia(40%) saturate(160%) hue-rotate(15deg)';
        break;
      default:
        presetFilter = '';
        break;
    }

    const brightnessFilter = `brightness(${photo.brightness}%)`;
    const saturationFilter = `saturate(${photo.saturation}%)`;
    const contrastFilter = `contrast(${photo.contrast || 100}%)`;

    return {
      filter: `${presetFilter} ${brightnessFilter} ${saturationFilter} ${contrastFilter}`.trim(),
      transform: `rotate(${photo.rotation}deg)`,
      transition: 'filter 0.2s ease, transform 0.3s ease',
    };
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: PhotoItem[] = [];
    const readers: Promise<void>[] = [];

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;

      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          newItems.push({
            id: `photo-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
            url,
            caption: file.name.replace(/\.[^/.]+$/, '').substring(0, 30),
            filterPreset: 'normal',
            brightness: 100,
            saturation: 100,
            contrast: 100,
            rotation: 0,
            date: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
      readers.push(promise);
    });

    Promise.all(readers).then(() => {
      onUpdatePhotos([...photos, ...newItems]);
      birthdaySynth.playSparkleFx();
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleUpdateCurrentEditing = (updater: (prev: PhotoItem) => PhotoItem) => {
    if (!selectedPhoto) return;
    const updated = updater(selectedPhoto);
    setSelectedPhoto(updated);
    onUpdatePhotos(photos.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeletePhoto = (id: string) => {
    onUpdatePhotos(photos.filter((p) => p.id !== id));
    if (selectedPhoto?.id === id) setSelectedPhoto(null);
    if (lightboxPhoto?.id === id) setLightboxPhoto(null);
  };

  return (
    <section id="photo-gallery-section" className="py-16 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
          <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
          Galeri & Potret Cinta
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-slate-800 tracking-tight drop-shadow-xs">
          Koleksi Momen Terindah
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-700 font-normal">
          Unggah fotomu bersama dia, lalu edit dengan filter hangat, rotasi, kecerahan, dan saturasi romantis.
        </p>

        {/* Upload Buttons & Drag Zone */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
            id="multi-photo-file-input"
          />
          <button
            type="button"
            id="upload-photos-btn"
            onClick={() => fileInputRef.current?.click()}
            className="px-7 py-3 rounded-full glass-button-primary text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/40"
          >
            <Upload className="w-4 h-4" />
            Unggah Foto Sekaligus
          </button>
        </div>
      </div>

      {/* Drag and Drop Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-3xl transition-all duration-300 p-2 ${
          isDragging ? 'bg-pink-200/40 backdrop-blur-xl border-2 border-dashed border-rose-500 scale-[1.01]' : ''
        }`}
      >
        {photos.length === 0 ? (
          <div className="text-center py-16 px-4 glass-panel rounded-3xl border-2 border-white/80 border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-button-primary flex items-center justify-center text-white border border-white/40 shadow-md">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Foto Terunggah</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
              Tarik dan lepaskan foto kenanganmu ke sini atau klik tombol unggah di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between"
              >
                {/* Image Container with Custom CSS Filters */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-rose-50/50 flex items-center justify-center border border-white/50">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Foto Kenangan'}
                    style={getFilterStyle(photo)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Filter Preset Pill Badge */}
                  {photo.filterPreset !== 'normal' && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/30">
                      {photo.filterPreset}
                    </span>
                  )}

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <button
                      type="button"
                      onClick={() => setLightboxPhoto(photo)}
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center text-xs shadow-md transition cursor-pointer"
                      title="Perbesar Foto"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPhoto(photo)}
                        className="px-3 py-1.5 rounded-full glass-button-primary text-white text-xs font-semibold shadow-md transition flex items-center gap-1 cursor-pointer border border-white/40"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        Edit Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md transition cursor-pointer"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Caption & Date Footer */}
                <div className="mt-3.5 flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-sm text-slate-800 font-['Playfair_Display'] truncate">
                      {photo.caption || 'Momen Penuh Cinta'}
                    </p>
                    {photo.date && (
                      <p className="text-[11px] text-rose-600 font-semibold">{photo.date}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Buka Pengaturan Filter"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Quick Add Extra Card with Frosted Treatment */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-rose-300/80 bg-white/35 hover:bg-white/60 backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center cursor-pointer p-6 text-center group shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/70 text-rose-600 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white transition-all flex items-center justify-center mb-3 shadow-sm border border-white/70">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-800 group-hover:text-rose-600">
                Tambah Foto Lain
              </span>
              <span className="text-xs text-slate-500 mt-1">Klik untuk memilih file foto</span>
            </div>
          </div>
        )}
      </div>

      {/* PHOTO EDITOR MODAL WITH FROSTED GLASS */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="relative max-w-4xl w-full bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden my-6 flex flex-col lg:flex-row max-h-[90vh]"
            >
              {/* Left Side: Live Filtered Preview */}
              <div className="lg:w-1/2 bg-slate-950/90 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="relative max-h-[50vh] lg:max-h-[65vh] w-full flex items-center justify-center overflow-hidden rounded-xl">
                  <img
                    src={selectedPhoto.url}
                    alt="Editing"
                    style={getFilterStyle(selectedPhoto)}
                    className="max-h-[48vh] lg:max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </div>

                <div className="mt-4 flex items-center gap-3 z-10">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateCurrentEditing((prev) => ({
                        ...prev,
                        rotation: (prev.rotation + 90) % 360,
                      }))
                    }
                    className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition cursor-pointer border border-white/30"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Putar Foto 90° ({selectedPhoto.rotation}°)
                  </button>
                </div>
              </div>

              {/* Right Side: Controls & Sliders */}
              <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[65vh] lg:max-h-[80vh]">
                <div className="space-y-6">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                    <div>
                      <h3 className="text-lg font-bold font-['Playfair_Display'] text-slate-900 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-rose-500" />
                        Edit Foto & Filter
                      </h3>
                      <p className="text-xs text-slate-500">Sesuaikan mood dan nuansa foto</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(null)}
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 border border-white/80 flex items-center justify-center text-sm font-bold cursor-pointer transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Caption Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Keterangan / Caption Foto
                    </label>
                    <input
                      type="text"
                      value={selectedPhoto.caption}
                      onChange={(e) =>
                        handleUpdateCurrentEditing((prev) => ({ ...prev, caption: e.target.value }))
                      }
                      placeholder="Tulis kenangan untuk foto ini..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Preset Filters Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      ✨ Preset Filter Nuansa
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'normal', name: 'Normal', icon: '🎨' },
                        { id: 'softpink', name: 'Pink Lembut', icon: '🌸' },
                        { id: 'romantic', name: 'Rose Glow', icon: '💖' },
                        { id: 'vintage', name: 'Vintage', icon: '🎞️' },
                        { id: 'sepia', name: 'Sepia', icon: '☕' },
                        { id: 'golden', name: 'Golden Hour', icon: '🌅' },
                        { id: 'bw', name: 'B & W', icon: '🖤' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            handleUpdateCurrentEditing((prev) => ({
                              ...prev,
                              filterPreset: preset.id as PhotoFilterPreset,
                            }));
                            birthdaySynth.playSparkleFx();
                          }}
                          className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer border ${
                            selectedPhoto.filterPreset === preset.id
                              ? 'glass-button-primary text-white border-white/50 shadow-md scale-102'
                              : 'glass-card text-slate-700 border-white/70 hover:bg-white/80'
                          }`}
                        >
                          <div className="text-base mb-0.5">{preset.icon}</div>
                          <div className="truncate text-[11px]">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders: Brightness, Saturation, Contrast */}
                  <div className="space-y-4 pt-2">
                    {/* Brightness */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Kecerahan (Brightness)</span>
                        <span className="font-bold text-rose-600">{selectedPhoto.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="160"
                        step="1"
                        value={selectedPhoto.brightness}
                        onChange={(e) =>
                          handleUpdateCurrentEditing((prev) => ({
                            ...prev,
                            brightness: Number(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Saturasi Warna</span>
                        <span className="font-bold text-rose-600">{selectedPhoto.saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="2"
                        value={selectedPhoto.saturation}
                        onChange={(e) =>
                          handleUpdateCurrentEditing((prev) => ({
                            ...prev,
                            saturation: Number(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>

                    {/* Contrast */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Kontras</span>
                        <span className="font-bold text-rose-600">{selectedPhoto.contrast || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="150"
                        step="1"
                        value={selectedPhoto.contrast || 100}
                        onChange={(e) =>
                          handleUpdateCurrentEditing((prev) => ({
                            ...prev,
                            contrast: Number(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="mt-8 pt-4 border-t border-rose-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateCurrentEditing((prev) => ({
                        ...prev,
                        filterPreset: 'normal',
                        brightness: 100,
                        saturation: 100,
                        contrast: 100,
                        rotation: 0,
                      }));
                    }}
                    className="text-xs text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
                  >
                    Reset Filter
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="px-6 py-2.5 rounded-full glass-button-primary text-white text-xs sm:text-sm font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer border border-white/40"
                  >
                    <Check className="w-4 h-4" /> Selesai Mengedit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setLightboxPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption}
                style={getFilterStyle(lightboxPhoto)}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border-2 border-white/30"
              />
              <div className="mt-4 text-center">
                <h4 className="text-white text-xl font-bold font-['Playfair_Display']">
                  {lightboxPhoto.caption}
                </h4>
                {lightboxPhoto.date && (
                  <p className="text-pink-300 text-xs mt-1">{lightboxPhoto.date}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center font-bold shadow-xl hover:scale-110 transition cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
