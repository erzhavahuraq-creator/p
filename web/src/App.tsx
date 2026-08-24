/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingDecorations } from './components/FloatingDecorations';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BirthdayCake } from './components/BirthdayCake';
import { PhotoGallery } from './components/PhotoGallery';
import { LoveLetterCard } from './components/LoveLetterCard';
import { MusicPlayer } from './components/MusicPlayer';
import { Footer } from './components/Footer';
import { initialHeroData, initialPhotos } from './data/initialData';
import { HeroData, PhotoItem } from './types';

export default function App() {
  // Session storage state initialization for text and photos
  const [heroData, setHeroData] = useState<HeroData>(() => {
    try {
      const saved = sessionStorage.getItem('birthday_hero_data');
      return saved ? JSON.parse(saved) : initialHeroData;
    } catch {
      return initialHeroData;
    }
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('birthday_photos');
      if (saved) {
        const parsed: PhotoItem[] = JSON.parse(saved);
        // Filter out legacy default placeholder photos
        const filtered = parsed.filter(
          (p) => !['photo-1', 'photo-2', 'photo-3'].includes(p.id) && !p.url.includes('images.unsplash.com')
        );
        return filtered;
      }
      return initialPhotos;
    } catch {
      return initialPhotos;
    }
  });

  // Keep session synced
  useEffect(() => {
    try {
      sessionStorage.setItem('birthday_hero_data', JSON.stringify(heroData));
    } catch (e) {
      console.warn('Session storage quota exceeded', e);
    }
  }, [heroData]);

  useEffect(() => {
    try {
      sessionStorage.setItem('birthday_photos', JSON.stringify(photos));
    } catch (e) {
      console.warn('Session storage quota exceeded', e);
    }
  }, [photos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100/90 via-pink-50/80 to-fuchsia-100/70 text-slate-800 relative font-['Plus_Jakarta_Sans'] selection:bg-pink-300/80 selection:text-pink-950 overflow-x-hidden">
      {/* Frosted Glass ambient gradient light bubbles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-400/20 to-pink-300/10 blur-[100px]" />
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-pink-400/20 to-fuchsia-400/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[15%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-fuchsia-300/20 via-rose-300/15 to-transparent blur-[110px]" />
      </div>

      {/* 1. Continuous Floating Balloons and Hearts in Background */}
      <FloatingDecorations />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar with Frosted Glass */}
        <Header recipientName={heroData.recipientName} />

        <main className="flex-1 space-y-10 sm:space-y-16">
          {/* 2. Hero Section with Live In-Page Text Customization */}
          <HeroSection data={heroData} onUpdate={setHeroData} />

          {/* 3. Birthday Cake with Blowable Candles & Heart Explosion */}
          <BirthdayCake
            recipientName={heroData.recipientName}
            age={heroData.age}
          />

          {/* 4. Photo Gallery with Multi-Upload & In-depth Photo Editor */}
          <PhotoGallery photos={photos} onUpdatePhotos={setPhotos} />

          {/* Secret Love Letter Card */}
          <LoveLetterCard
            recipientName={heroData.recipientName}
            senderName={heroData.senderName}
            loveMessage={heroData.loveMessage}
          />
        </main>

        {/* 6. Background Instrumental Birthday Music Synthesizer Widget */}
        <MusicPlayer />

        {/* Footer */}
        <Footer
          recipientName={heroData.recipientName}
          senderName={heroData.senderName}
        />
      </div>
    </div>
  );
}
