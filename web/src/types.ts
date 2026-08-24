export interface HeroData {
  title: string;
  subtitle: string;
  recipientName: string;
  age: number | string;
  badgeText: string;
  loveMessage: string;
  senderName: string;
  dateStr: string;
}

export type PhotoFilterPreset = 'normal' | 'bw' | 'sepia' | 'vintage' | 'softpink' | 'romantic' | 'golden';

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  filterPreset: PhotoFilterPreset;
  brightness: number; // 50 - 150 (default 100)
  saturation: number; // 0 - 200 (default 100)
  contrast: number;   // 50 - 150 (default 100)
  rotation: number;   // 0, 90, 180, 270
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  emoji: string;
  color?: string;
}

export interface FloatingElement {
  id: number;
  type: 'heart' | 'balloon' | 'sparkle' | 'rose';
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  sway: number;
  opacity: number;
}
