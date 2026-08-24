/**
 * Web Audio API Synthesizer with crystal-clear, warm acoustic mobile-optimized audio.
 * Features:
 * - Anti-clipping architecture: soft saturation waveshaper + gentle compressor
 * - High-pass rumble filter (180Hz) to prevent mobile speaker cone rattling
 * - Smooth Butterworth low-pass filter (3000Hz, Q=0.5) to remove harsh high-frequency crackle
 * - Recalibrated headroom & gain staging for pristine sound on iPhone & Android speakers
 * - 4 Unique Birthday Melody arrangements with sweet music box, acoustic plucks, and ambient serenades.
 */

export interface NoteEvent {
  note: string;
  dur: number;
  bass?: string;
  harmony?: string[];
  detune?: number;
}

export interface BirthdayTrack {
  id: string;
  title: string;
  subtitle: string;
  instrumentName: string;
  icon: string;
  beatSec: number;
  instrument: 'musicbox' | 'acoustic' | 'celebration' | 'serenade';
  melody: NoteEvent[];
}

class BirthdaySynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;
  private masterGain: GainNode | null = null;
  private highpassFilter: BiquadFilterNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private waveShaper: WaveShaperNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private delayWetGain: GainNode | null = null;
  private sequenceTimeout: number | null = null;
  private currentStepIndex: number = 0;
  private activeTrackIndex: number = 0;
  private onNotePlayCallback?: (note: string) => void;
  private onTrackChangeCallback?: (track: BirthdayTrack) => void;

  // Notes frequencies in Hz
  public readonly notes: Record<string, number> = {
    C3: 130.81, 'C#3': 138.59, Db3: 138.59, D3: 146.83, 'D#3': 155.56, Eb3: 155.56, E3: 164.81,
    F3: 174.61, 'F#3': 185.00, Gb3: 185.00, G3: 196.00, 'G#3': 207.65, Ab3: 207.65, A3: 220.00,
    'A#3': 233.08, Bb3: 233.08, B3: 246.94,
    C4: 261.63, 'C#4': 277.18, Db4: 277.18, D4: 293.66, 'D#4': 311.13, Eb4: 311.13, E4: 329.63,
    F4: 349.23, 'F#4': 369.99, Gb4: 369.99, G4: 392.00, 'G#4': 415.30, Ab4: 415.30, A4: 440.00,
    'A#4': 466.16, Bb4: 466.16, B4: 493.88,
    C5: 523.25, 'C#5': 554.37, Db5: 554.37, D5: 587.33, 'D#5': 622.25, Eb5: 622.25, E5: 659.25,
    F5: 698.46, 'F#5': 739.99, Gb5: 739.99, G5: 783.99, 'G#5': 830.61, Ab5: 830.61, A5: 880.00,
    'A#5': 932.33, Bb5: 932.33, B5: 987.77,
    C6: 1046.50, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98,
  };

  public readonly tracks: BirthdayTrack[] = [
    {
      id: 'waltz-musicbox',
      title: 'Kotak Musik Romantis',
      subtitle: 'Alunan lembut waltz berpadu dentingan celesta manis',
      instrumentName: 'Celesta & Sweet Music Box',
      icon: '🎀',
      beatSec: 0.58,
      instrument: 'musicbox',
      melody: [
        // Bar 1: Hap-py
        { note: 'C4', dur: 0.75, bass: 'F3', harmony: ['A3'] },
        { note: 'C4', dur: 0.25 },
        // Bar 2: Birth-day to
        { note: 'D4', dur: 1.0, harmony: ['F3', 'A3'] },
        { note: 'C4', dur: 1.0, harmony: ['A3'] },
        // Bar 3: you...
        { note: 'F4', dur: 1.0, bass: 'C4', harmony: ['G3', 'C4'] },
        { note: 'E4', dur: 2.0, harmony: ['G3', 'C4'] },

        // Bar 4: Hap-py
        { note: 'C4', dur: 0.75, bass: 'C4', harmony: ['G3'] },
        { note: 'C4', dur: 0.25 },
        // Bar 5: Birth-day to
        { note: 'D4', dur: 1.0, harmony: ['G3', 'B3'] },
        { note: 'C4', dur: 1.0, harmony: ['G3'] },
        // Bar 6: you...
        { note: 'G4', dur: 1.0, bass: 'F3', harmony: ['A3', 'C4'] },
        { note: 'F4', dur: 2.0, harmony: ['A3', 'C4'] },

        // Bar 7: Hap-py
        { note: 'C4', dur: 0.75, bass: 'F3', harmony: ['A3'] },
        { note: 'C4', dur: 0.25 },
        // Bar 8: Birth-day dear...
        { note: 'C5', dur: 1.0, bass: 'A3', harmony: ['C4', 'E4'] },
        { note: 'A4', dur: 1.0, harmony: ['C4', 'F4'] },
        // Bar 9: [Name]...
        { note: 'F4', dur: 1.0, bass: 'Bb3', harmony: ['D4', 'F4'] },
        { note: 'E4', dur: 1.0, harmony: ['C4', 'G4'] },
        { note: 'D4', dur: 1.0, harmony: ['Bb3', 'F4'] },

        // Bar 10: Hap-py
        { note: 'Bb4', dur: 0.75, bass: 'Bb3', harmony: ['D4'] },
        { note: 'Bb4', dur: 0.25 },
        // Bar 11: Birth-day to
        { note: 'A4', dur: 1.0, bass: 'F3', harmony: ['C4', 'F4'] },
        { note: 'F4', dur: 1.0, harmony: ['A3', 'C4'] },
        // Bar 12: you!
        { note: 'G4', dur: 1.0, bass: 'C4', harmony: ['G3', 'C4'] },
        { note: 'F4', dur: 2.6, bass: 'F3', harmony: ['A3', 'C4', 'F5'] },
      ],
    },
    {
      id: 'acoustic-warmth',
      title: 'Petikan Akustik Hangat',
      subtitle: 'Arpeggio balada yang jernih, hangat & menyentuh hati',
      instrumentName: 'Acoustic Guitar & Piano Pluck',
      icon: '🎸',
      beatSec: 0.54,
      instrument: 'acoustic',
      melody: [
        // Intro flourish
        { note: 'G4', dur: 0.5, bass: 'C4', harmony: ['E3', 'G3'] },
        { note: 'C5', dur: 0.5, harmony: ['E4'] },
        { note: 'E5', dur: 0.5, harmony: ['G4'] },
        { note: 'D5', dur: 0.5, bass: 'G3', harmony: ['B3', 'D4'] },

        // Verse: Happy Birthday
        { note: 'C4', dur: 0.75, bass: 'C4', harmony: ['G3', 'E4'] },
        { note: 'C4', dur: 0.25 },
        { note: 'D4', dur: 1.0, bass: 'F3', harmony: ['A3', 'C4'] },
        { note: 'C4', dur: 1.0, harmony: ['E4'] },
        { note: 'F4', dur: 1.0, bass: 'A3', harmony: ['C4', 'F4'] },
        { note: 'E4', dur: 1.8, bass: 'G3', harmony: ['C4', 'G4'] },

        // Second phrase
        { note: 'C4', dur: 0.75, bass: 'C4', harmony: ['G3'] },
        { note: 'C4', dur: 0.25 },
        { note: 'D4', dur: 1.0, bass: 'G3', harmony: ['B3', 'D4'] },
        { note: 'C4', dur: 1.0, harmony: ['G3'] },
        { note: 'G4', dur: 1.0, bass: 'A3', harmony: ['C4', 'E4'] },
        { note: 'F4', dur: 1.8, bass: 'F3', harmony: ['A3', 'C4'] },

        // Climactic bridge
        { note: 'C4', dur: 0.75, bass: 'F3', harmony: ['A3'] },
        { note: 'C4', dur: 0.25 },
        { note: 'C5', dur: 1.0, bass: 'A3', harmony: ['E4', 'A4'] },
        { note: 'A4', dur: 1.0, bass: 'F3', harmony: ['C4', 'F4'] },
        { note: 'F4', dur: 1.0, bass: 'D4', harmony: ['F3', 'A3', 'D4'] },
        { note: 'E4', dur: 1.0, bass: 'C4', harmony: ['G3', 'C4'] },
        { note: 'D4', dur: 1.2, bass: 'G3', harmony: ['B3', 'D4'] },

        // Sweet resolution
        { note: 'Bb4', dur: 0.75, bass: 'Bb3', harmony: ['D4', 'F4'] },
        { note: 'Bb4', dur: 0.25 },
        { note: 'A4', dur: 1.0, bass: 'F3', harmony: ['C4', 'F4'] },
        { note: 'F4', dur: 1.0, bass: 'A3', harmony: ['C4', 'A4'] },
        { note: 'G4', dur: 1.0, bass: 'G3', harmony: ['D4', 'G4'] },
        { note: 'F4', dur: 2.8, bass: 'F3', harmony: ['A3', 'C4', 'E4', 'A4'] },
      ],
    },
    {
      id: 'celebration-joy',
      title: 'Dentingan Ceria & Manis',
      subtitle: 'Irama manis bersemangat dengan kelembutan lonceng perayaan',
      instrumentName: 'Sparkle Bells & Sweet Chimes',
      icon: '✨',
      beatSec: 0.46,
      instrument: 'celebration',
      melody: [
        // Bright syncopated celebration
        { note: 'G4', dur: 0.5, bass: 'C4', harmony: ['E4'] },
        { note: 'G4', dur: 0.5, harmony: ['E4'] },
        { note: 'A4', dur: 1.0, bass: 'F3', harmony: ['C4', 'F4'] },
        { note: 'G4', dur: 1.0, bass: 'C4', harmony: ['E4'] },
        { note: 'C5', dur: 1.0, bass: 'A3', harmony: ['E4', 'G4'] },
        { note: 'B4', dur: 2.0, bass: 'G3', harmony: ['D4', 'G4'] },

        { note: 'G4', dur: 0.5, bass: 'C4', harmony: ['E4'] },
        { note: 'G4', dur: 0.5, harmony: ['E4'] },
        { note: 'A4', dur: 1.0, bass: 'F3', harmony: ['C4', 'F4'] },
        { note: 'G4', dur: 1.0, bass: 'C4', harmony: ['E4'] },
        { note: 'D5', dur: 1.0, bass: 'G3', harmony: ['F4', 'B4'] },
        { note: 'C5', dur: 2.0, bass: 'C4', harmony: ['E4', 'G4', 'C5'] },

        { note: 'G4', dur: 0.5, bass: 'C4', harmony: ['E4'] },
        { note: 'G4', dur: 0.5, harmony: ['E4'] },
        { note: 'G5', dur: 1.0, bass: 'E4', harmony: ['G4', 'B4', 'E5'] },
        { note: 'E5', dur: 1.0, bass: 'C4', harmony: ['G4', 'C5'] },
        { note: 'C5', dur: 1.0, bass: 'A3', harmony: ['E4', 'A4'] },
        { note: 'B4', dur: 1.0, bass: 'F3', harmony: ['D4', 'F4'] },
        { note: 'A4', dur: 1.5, bass: 'D4', harmony: ['F3', 'A3', 'D4'] },

        { note: 'F5', dur: 0.5, bass: 'F3', harmony: ['A4', 'C5'] },
        { note: 'F5', dur: 0.5, harmony: ['A4'] },
        { note: 'E5', dur: 1.0, bass: 'C4', harmony: ['G4', 'C5'] },
        { note: 'C5', dur: 1.0, bass: 'A3', harmony: ['E4', 'A4'] },
        { note: 'D5', dur: 1.0, bass: 'G3', harmony: ['F4', 'B4'] },
        { note: 'C5', dur: 2.5, bass: 'C4', harmony: ['E4', 'G4', 'C5'] },
      ],
    },
    {
      id: 'midnight-serenade',
      title: 'Serenade Malam Lembut',
      subtitle: 'Alunan pelan penuh ketenangan bagai lagu tidur cinta di bawah bintang',
      instrumentName: 'Warm Ambient Lullaby Synth',
      icon: '🌙',
      beatSec: 0.68,
      instrument: 'serenade',
      melody: [
        // Gentle slow dreamy opening
        { note: 'C4', dur: 1.0, bass: 'F3', harmony: ['A3', 'C4'] },
        { note: 'C4', dur: 0.5, harmony: ['E4'] },
        { note: 'D4', dur: 1.5, bass: 'Bb3', harmony: ['F4', 'A4'] },
        { note: 'C4', dur: 1.5, bass: 'C4', harmony: ['G3', 'E4'] },
        { note: 'F4', dur: 1.5, bass: 'A3', harmony: ['C4', 'F4'] },
        { note: 'E4', dur: 2.5, bass: 'C4', harmony: ['G3', 'C4', 'G4'] },

        { note: 'C4', dur: 1.0, bass: 'C4', harmony: ['G3'] },
        { note: 'C4', dur: 0.5, harmony: ['E4'] },
        { note: 'D4', dur: 1.5, bass: 'G3', harmony: ['B3', 'D4'] },
        { note: 'C4', dur: 1.5, bass: 'E4', harmony: ['G3', 'C4'] },
        { note: 'G4', dur: 1.5, bass: 'A3', harmony: ['C4', 'E4'] },
        { note: 'F4', dur: 2.5, bass: 'F3', harmony: ['A3', 'C4', 'F4'] },

        { note: 'C4', dur: 1.0, bass: 'F3', harmony: ['A3'] },
        { note: 'C4', dur: 0.5, harmony: ['C4'] },
        { note: 'C5', dur: 1.5, bass: 'A3', harmony: ['E4', 'A4', 'C5'] },
        { note: 'A4', dur: 1.5, bass: 'F3', harmony: ['C4', 'F4'] },
        { note: 'F4', dur: 1.5, bass: 'D4', harmony: ['A3', 'D4', 'F4'] },
        { note: 'E4', dur: 1.5, bass: 'C4', harmony: ['G3', 'C4'] },
        { note: 'D4', dur: 2.0, bass: 'Bb3', harmony: ['D4', 'F4'] },

        { note: 'Bb4', dur: 1.0, bass: 'Bb3', harmony: ['D4', 'F4'] },
        { note: 'Bb4', dur: 0.5, harmony: ['D4'] },
        { note: 'A4', dur: 1.5, bass: 'F3', harmony: ['C4', 'F4', 'A4'] },
        { note: 'F4', dur: 1.5, bass: 'A3', harmony: ['C4', 'F4'] },
        { note: 'G4', dur: 1.5, bass: 'C4', harmony: ['G3', 'C4', 'E4'] },
        { note: 'F4', dur: 3.2, bass: 'F3', harmony: ['A3', 'C4', 'F4'] },
      ],
    },
  ];

  // Generates a soft-knee hyperbolic tangent curve to gently prevent harsh clipping
  private createSoftLimiterCurve(): Float32Array {
    const samples = 1024;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; ++i) {
      const x = (i * 2) / samples - 1;
      // Soft saturation curve: linear in the center, smoothly compressive at extremes
      curve[i] = Math.tanh(x * 1.15) * 0.92;
    }
    return curve;
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.masterGain) {
      // 1. High-Pass Filter: Cuts sub-180Hz frequencies that cause mobile speaker distortion/rattling
      this.highpassFilter = this.ctx.createBiquadFilter();
      this.highpassFilter.type = 'highpass';
      this.highpassFilter.frequency.setValueAtTime(175, this.ctx.currentTime);
      this.highpassFilter.Q.setValueAtTime(0.65, this.ctx.currentTime);

      // 2. Low-Pass Filter: Cuts piercing harsh treble above 2800Hz with gentle Butterworth roll-off (no peak)
      this.lowpassFilter = this.ctx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.setValueAtTime(2700, this.ctx.currentTime);
      this.lowpassFilter.Q.setValueAtTime(0.5, this.ctx.currentTime); // Q=0.5 prevents resonant peak distortion

      // 3. Gentle Studio Compressor (Transparent leveling without pumping)
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(20, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.015, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);

      // 4. Soft Saturation Limiter (Guarantees zero harsh clipping even on high volumes)
      this.waveShaper = this.ctx.createWaveShaper();
      this.waveShaper.curve = this.createSoftLimiterCurve();
      this.waveShaper.oversample = '2x';

      // 5. Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume * 0.75, this.ctx.currentTime);

      // 6. Subtle Ambient Delay (Reverb warmth with conservative feedback)
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.16, this.ctx.currentTime);

      this.delayWetGain = this.ctx.createGain();
      this.delayWetGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      // Delay chain
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayNode.connect(this.delayWetGain);

      // Routing:
      // Sources -> lowpassFilter -> highpassFilter
      // highpassFilter -> compressor (Direct)
      // highpassFilter -> delayNode -> delayWetGain -> compressor (Ambient Reverb)
      // compressor -> waveShaper (Soft Limiter) -> masterGain -> Destination

      this.lowpassFilter.connect(this.highpassFilter);
      this.highpassFilter.connect(this.compressor);

      this.highpassFilter.connect(this.delayNode);
      this.delayWetGain.connect(this.compressor);

      this.compressor.connect(this.waveShaper);
      this.waveShaper.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setCallback(cb: (note: string) => void) {
    this.onNotePlayCallback = cb;
  }

  public setTrackCallback(cb: (track: BirthdayTrack) => void) {
    this.onTrackChangeCallback = cb;
  }

  public getTracks(): BirthdayTrack[] {
    return this.tracks;
  }

  public getCurrentTrack(): BirthdayTrack {
    return this.tracks[this.activeTrackIndex] || this.tracks[0];
  }

  public setTrack(trackId: string) {
    const idx = this.tracks.findIndex((t) => t.id === trackId);
    if (idx !== -1 && idx !== this.activeTrackIndex) {
      this.activeTrackIndex = idx;
      this.currentStepIndex = 0;
      if (this.onTrackChangeCallback) {
        this.onTrackChangeCallback(this.tracks[idx]);
      }
      if (this.isPlaying) {
        if (this.sequenceTimeout) {
          clearTimeout(this.sequenceTimeout);
          this.sequenceTimeout = null;
        }
        this.step();
      }
    }
  }

  public nextTrack(): BirthdayTrack {
    const nextIdx = (this.activeTrackIndex + 1) % this.tracks.length;
    this.setTrack(this.tracks[nextIdx].id);
    return this.tracks[nextIdx];
  }

  public prevTrack(): BirthdayTrack {
    const prevIdx = (this.activeTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.setTrack(this.tracks[prevIdx].id);
    return this.tracks[prevIdx];
  }

  // Play instrument voice optimized with anti-distortion gain staging
  private playVoice(
    freq: number,
    duration: number,
    gainLevel: number = 0.12,
    detune: number = 0,
    instrumentType: BirthdayTrack['instrument'] = 'musicbox'
  ) {
    if (!this.ctx || !this.lowpassFilter) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const harmonicGain = this.ctx.createGain();

    if (instrumentType === 'acoustic') {
      // Warm acoustic nylon pluck
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(detune, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Smooth anti-pop attack
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(gainLevel * 0.75, now + 0.012);
      const decayDuration = Math.max(0.4, duration * 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

      harmonicGain.gain.setValueAtTime(0, now);
      harmonicGain.gain.linearRampToValueAtTime(gainLevel * 0.14, now + 0.012);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration * 0.6);
    } else if (instrumentType === 'celebration') {
      // Gentle chime / sparkle bell
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(detune, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.005, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(gainLevel * 0.7, now + 0.01);
      const decayDuration = Math.max(0.35, duration * 1.0);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

      harmonicGain.gain.setValueAtTime(0, now);
      harmonicGain.gain.linearRampToValueAtTime(gainLevel * 0.16, now + 0.01);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration * 0.5);
    } else if (instrumentType === 'serenade') {
      // Pure sine ambient lullaby
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(detune, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(gainLevel * 0.65, now + 0.03);
      const decayDuration = Math.max(0.6, duration * 1.5);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

      harmonicGain.gain.setValueAtTime(0, now);
      harmonicGain.gain.linearRampToValueAtTime(gainLevel * 0.1, now + 0.03);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration * 0.8);
    } else {
      // Sweet Celesta & Music Box (Sine + Triangle)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(detune, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(gainLevel * 0.72, now + 0.012);
      const decayDuration = Math.max(0.5, duration * 1.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

      harmonicGain.gain.setValueAtTime(0, now);
      harmonicGain.gain.linearRampToValueAtTime(gainLevel * 0.12, now + 0.012);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration * 0.5);
    }

    osc1.connect(noteGain);
    osc2.connect(harmonicGain);

    noteGain.connect(this.lowpassFilter);
    harmonicGain.connect(this.lowpassFilter);

    const stopTime = now + Math.max(0.7, duration * 1.6);
    osc1.start(now);
    osc2.start(now);

    osc1.stop(stopTime);
    osc2.stop(stopTime);
  }

  private step() {
    if (!this.isPlaying || !this.ctx) return;

    const track = this.getCurrentTrack();
    const item = track.melody[this.currentStepIndex];

    if (item) {
      const freq = this.notes[item.note];
      const beatSec = track.beatSec || 0.55;
      const noteSec = item.dur * beatSec;

      if (freq) {
        // Main melody voice - clean & controlled
        this.playVoice(freq, noteSec, 0.14, item.detune || 0, track.instrument);
        if (this.onNotePlayCallback) {
          this.onNotePlayCallback(item.note);
        }
      }

      // Bass note voice - softly rounded
      if (item.bass && this.notes[item.bass]) {
        this.playVoice(
          this.notes[item.bass],
          noteSec * 1.4,
          0.08,
          -2,
          track.instrument
        );
      }

      // Harmony note voice - subtle arpeggiated sparkle
      if (item.harmony) {
        item.harmony.forEach((hNote, idx) => {
          if (this.notes[hNote]) {
            setTimeout(() => {
              if (this.isPlaying) {
                this.playVoice(
                  this.notes[hNote],
                  noteSec * 0.9,
                  0.05,
                  (idx + 1) * 2,
                  track.instrument
                );
              }
            }, idx * 60);
          }
        });
      }

      // Schedule next note
      this.currentStepIndex = (this.currentStepIndex + 1) % track.melody.length;
      this.sequenceTimeout = window.setTimeout(() => {
        this.step();
      }, noteSec * 1000);
    }
  }

  public async start() {
    this.initAudio();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step();
  }

  public stop() {
    this.isPlaying = false;
    if (this.sequenceTimeout) {
      clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = null;
    }
    this.currentStepIndex = 0;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      // Scaled master volume to maintain warm headroom
      this.masterGain.gain.setValueAtTime(this.volume * 0.75, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public playCandleBlowFx() {
    this.initAudio();
    if (!this.ctx || !this.lowpassFilter) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(140, now + 0.5);
    noiseFilter.Q.setValueAtTime(1.2, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.lowpassFilter);

    noise.start(now);
    noise.stop(now + 0.55);

    const sparkles = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    sparkles.forEach((freq, index) => {
      setTimeout(() => {
        if (!this.ctx) return;
        this.playVoice(freq, 0.6, 0.08, index * 2, 'celebration');
      }, 300 + index * 75);
    });
  }

  public playSparkleFx() {
    this.initAudio();
    if (!this.ctx) return;
    const freqs = [880, 1174.66, 1760];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        this.playVoice(f, 0.35, 0.08, 0, 'celebration');
      }, i * 60);
    });
  }

  public playHeartPopFx() {
    this.initAudio();
    if (!this.ctx || !this.lowpassFilter) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.lowpassFilter);

    osc.start(now);
    osc.stop(now + 0.11);
  }
}

export const birthdaySynth = new BirthdaySynthesizer();
