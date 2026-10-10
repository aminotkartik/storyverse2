import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A tiny synthesized sound engine built on the Web Audio API.
 * No external audio files are used — every sound (traffic hum, honks,
 * heartbeat, signal beep, page turns) is generated procedurally so the
 * experience stays lightweight and deploy-anywhere.
 */
class SoundEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  ambientGain: GainNode | null = null;
  ambientNodes: AudioNode[] = [];
  heartbeatInterval: number | null = null;

  ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.6;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  setMasterVolume(v: number) {
    if (this.master) this.master.gain.setTargetAtTime(v, this.ctx!.currentTime, 0.05);
  }

  private noiseBuffer(ctx: AudioContext, duration: number) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  honk(intensity = 1) {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc2.type = "square";
    osc.frequency.value = 220 * intensity;
    osc2.frequency.value = 164 * intensity;
    gain.gain.value = 0;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18 * intensity, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.master!);
    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 0.42);
    osc2.stop(ctx.currentTime + 0.42);
  }

  beep(freq = 880) {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  heartbeatPulse() {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 55;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  }

  pageTurn() {
    const ctx = this.ensureCtx();
    const buffer = this.noiseBuffer(ctx, 0.3);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    src.start();
  }

  tear() {
    const ctx = this.ensureCtx();
    const buffer = this.noiseBuffer(ctx, 0.5);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1500;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    src.start();
  }

  chime() {
    const ctx = this.ensureCtx();
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.connect(gain);
      gain.connect(this.master!);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  startAmbient(trafficLevel = 0.2) {
    const ctx = this.ensureCtx();
    this.stopAmbient();
    const buffer = this.noiseBuffer(ctx, 2);
    buffer.getChannelData(0).forEach((_, i, arr) => {
      // brownish noise for a low rumble of distant traffic
      const prev = i > 0 ? arr[i - 1] : 0;
      arr[i] = (prev + (Math.random() * 2 - 1) * 0.06) * 0.98;
    });
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = trafficLevel;
    src.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.master!);
    src.start();
    this.ambientNodes = [src, filter, this.ambientGain];
  }

  setAmbientLevel(level: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.4);
    }
  }

  stopAmbient() {
    this.ambientNodes.forEach((n) => {
      try {
        (n as AudioScheduledSourceNode).stop?.();
      } catch {
        /* already stopped */
      }
      n.disconnect();
    });
    this.ambientNodes = [];
  }
}

let engine: SoundEngine | null = null;
function getEngine() {
  if (!engine) engine = new SoundEngine();
  return engine;
}

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const engineRef = useRef<SoundEngine>(getEngine());

  useEffect(() => {
    engineRef.current.setMasterVolume(enabled ? 0.6 : 0);
    if (!enabled) engineRef.current.stopAmbient();
  }, [enabled]);

  const toggle = useCallback(() => {
    engineRef.current.ensureCtx();
    setEnabled((e) => !e);
  }, []);

  return {
    enabled,
    toggle,
    honk: (i?: number) => enabled && engineRef.current.honk(i),
    beep: (f?: number) => enabled && engineRef.current.beep(f),
    heartbeat: () => enabled && engineRef.current.heartbeatPulse(),
    pageTurn: () => enabled && engineRef.current.pageTurn(),
    tear: () => enabled && engineRef.current.tear(),
    chime: () => enabled && engineRef.current.chime(),
    startAmbient: (level?: number) => enabled && engineRef.current.startAmbient(level),
    setAmbientLevel: (level: number) => enabled && engineRef.current.setAmbientLevel(level),
    stopAmbient: () => engineRef.current.stopAmbient(),
  };
}

export type SoundApi = ReturnType<typeof useSound>;
