import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { asset } from "../utils/asset";

const MASTER_LEVEL = 0.6;
/** Background music sits well under the narration and the one-shot effects. */
const MUSIC_LEVEL = 0.22;
/** The single looping bed, resolved against the Vite base (works on GitHub Pages). */
const MUSIC_SRC = asset("bgm.mp3");

/**
 * Procedural Web Audio engine. Nothing is created until the visitor opts in
 * via the sound toggle, and every method is a no-op while sound is off.
 * Discrete one-shot sounds create short-lived nodes; the only long-lived node
 * is the single ambient bed, which is torn down on disable and on leaving the
 * scene that started it.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private brown: AudioBuffer | null = null;
  private ambient: { src: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private enabled = false;
  /** The one and only music element. Created on first use, reused for the whole visit. */
  private music: HTMLAudioElement | null = null;
  private musicOn = true;
  /** Set if the file is missing or cannot be decoded, so we stop retrying. */
  private musicBroken = false;
  private gesture: (() => void) | null = null;
  private gestureEvents: string[] = [];

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (on) {
      const ctx = this.ensure();
      this.master?.gain.setTargetAtTime(MASTER_LEVEL, ctx.currentTime, 0.05);
      this.playMusic();
    } else {
      if (this.ctx && this.master) this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
      this.stopAmbient();
      this.pauseMusic();
    }
  }

  /**
   * Turns the looping bed on or off without touching the sound effects. Turning
   * it on while sound is enabled starts it immediately; the visitor's click on
   * the toggle is itself the gesture browsers need, so playback normally begins
   * without waiting for another interaction.
   */
  setMusicEnabled(on: boolean): void {
    this.musicOn = on;
    if (on) {
      this.musicBroken = false;
      if (this.enabled) this.playMusic();
    } else {
      this.pauseMusic();
    }
  }

  /** Starts (or resumes) the single looping bed. Safe to call repeatedly. */
  private playMusic(): void {
    if (!this.enabled || !this.musicOn || this.musicBroken) return;
    const element = this.ensureMusic();
    const playing = element.play();
    if (playing && typeof playing.catch === "function") {
      // Autoplay was refused, or the file is not there yet: wait for a gesture.
      playing.catch(() => this.armGesture());
    }
  }

  private pauseMusic(): void {
    this.releaseGesture();
    if (!this.music) return;
    this.music.pause();
  }

  /** Stops the bed and drops the gesture listener. Used when the app unmounts. */
  stopMusic(): void {
    this.pauseMusic();
    if (!this.music) return;
    this.music.src = "";
    this.music.load();
    this.music = null;
  }

  private ensureMusic(): HTMLAudioElement {
    if (!this.music) {
      const element = new Audio(MUSIC_SRC);
      element.loop = true;
      element.volume = MUSIC_LEVEL;
      element.preload = "auto";
      element.addEventListener("error", () => {
        // Missing or unreadable file: stop trying so the story carries on silently.
        this.musicBroken = true;
        this.releaseGesture();
      });
      this.music = element;
    }
    return this.music;
  }

  /** One-shot listeners so a blocked autoplay starts on the visitor's next click or key. */
  private armGesture(): void {
    if (this.gesture || this.musicBroken || !this.musicOn || !this.enabled) return;
    const start = () => {
      this.releaseGesture();
      this.playMusic();
    };
    this.gesture = start;
    this.gestureEvents = ["pointerdown", "keydown", "touchstart"];
    this.gestureEvents.forEach((name) => window.addEventListener(name, start, { passive: true }));
  }

  private releaseGesture(): void {
    if (!this.gesture) return;
    const listener = this.gesture;
    this.gestureEvents.forEach((name) => window.removeEventListener(name, listener));
    this.gesture = null;
    this.gestureEvents = [];
  }

  honk(intensity = 1): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const out = this.master!;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18 * intensity, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    gain.connect(out);
    for (const [type, freq] of [
      ["sawtooth", 220],
      ["square", 164],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq * intensity;
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.42);
    }
  }

  beep(freq = 880): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc.connect(gain).connect(this.master!);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  heartbeat(): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 55;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.connect(gain).connect(this.master!);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  pageTurn(): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    src.connect(filter).connect(gain).connect(this.master!);
    src.start(now, 0, 0.3);
  }

  tear(): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1500;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    src.connect(filter).connect(gain).connect(this.master!);
    src.start(now, 0, 0.5);
  }

  chime(): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.12;
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.connect(gain).connect(this.master!);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  /** Starts the single ambient traffic bed, or retunes it if already playing. */
  startAmbient(level = 0.12): void {
    if (!this.enabled) return;
    if (this.ambient) {
      this.setAmbientLevel(level);
      return;
    }
    const ctx = this.ensure();
    const src = ctx.createBufferSource();
    src.buffer = this.brownBuffer(ctx);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.gain.setTargetAtTime(level, ctx.currentTime, 0.4);
    src.connect(filter).connect(gain).connect(this.master!);
    src.start();
    this.ambient = { src, filter, gain };
  }

  setAmbientLevel(level: number): void {
    if (!this.enabled || !this.ambient || !this.ctx) return;
    this.ambient.gain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.4);
  }

  stopAmbient(): void {
    if (!this.ambient) return;
    const { src, filter, gain } = this.ambient;
    this.ambient = null;
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
    src.disconnect();
    filter.disconnect();
    gain.disconnect();
  }

  private ensure(): AudioContext {
    if (!this.ctx) {
      const AC =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noise) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noise = buffer;
    }
    return this.noise;
  }

  private brownBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.brown) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        last = (last + (Math.random() * 2 - 1) * 0.06) * 0.98;
        data[i] = last;
      }
      this.brown = buffer;
    }
    return this.brown;
  }
}

export interface SoundApi {
  enabled: boolean;
  toggle: () => void;
  /** The looping background bed is on; it only sounds while sound itself is on. */
  musicEnabled: boolean;
  toggleMusic: () => void;
  honk: (intensity?: number) => void;
  beep: (freq?: number) => void;
  heartbeat: () => void;
  pageTurn: () => void;
  tear: () => void;
  chime: () => void;
  startAmbient: (level?: number) => void;
  setAmbientLevel: (level: number) => void;
  stopAmbient: () => void;
}

const engine = new SoundEngine();

/** Owns the sound toggle state. Action functions are stable across renders. */
export function useSoundController(): SoundApi {
  const [enabled, setEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const enabledRef = useRef(false);
  const musicRef = useRef(true);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    engine.setEnabled(next);
    setEnabled(next);
  }, []);

  const toggleMusic = useCallback(() => {
    const next = !musicRef.current;
    musicRef.current = next;
    engine.setMusicEnabled(next);
    setMusicEnabled(next);
    // Asking for music is the opt-in gesture browsers require, so sound comes on with it.
    if (next && !enabledRef.current) toggle();
  }, [toggle]);

  useEffect(
    () => () => {
      engine.stopAmbient();
      engine.stopMusic();
    },
    []
  );

  return useMemo<SoundApi>(
    () => ({
      enabled,
      toggle,
      musicEnabled,
      toggleMusic,
      honk: (intensity) => engine.honk(intensity),
      beep: (freq) => engine.beep(freq),
      heartbeat: () => engine.heartbeat(),
      pageTurn: () => engine.pageTurn(),
      tear: () => engine.tear(),
      chime: () => engine.chime(),
      startAmbient: (level) => engine.startAmbient(level),
      setAmbientLevel: (level) => engine.setAmbientLevel(level),
      stopAmbient: () => engine.stopAmbient(),
    }),
    [enabled, toggle, musicEnabled, toggleMusic]
  );
}
