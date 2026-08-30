class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private volume: number = 1.0;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(volumePercent: number) {
    this.volume = Math.max(0, Math.min(1, volumePercent / 100));
  }

  public async playSound(name: string): Promise<void> {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(ctx.destination);

      switch (name) {
        case "pop": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case "ding": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(987.77, now); // B5
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }

        case "laser": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(900, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case "jump": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }

        case "coin": {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sine";
          osc2.type = "sine";
          osc1.frequency.setValueAtTime(987.77, now); // B5
          osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc1.connect(gain);
          gain.connect(masterGain);
          osc1.start(now);
          osc1.stop(now + 0.3);
          break;
        }

        case "cheer": {
          for (let i = 0; i < 4; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(400 + i * 120, now + i * 0.06);
            gain.gain.setValueAtTime(0.3, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.2);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.2);
          }
          break;
        }

        default: {
          // Default synth beep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(523.25, now);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.2);
        }
      }
    } catch {
      // Ignore audio autoplay restrictions gracefully
    }
  }
}

export const soundSynth = new SoundSynthesizer();
