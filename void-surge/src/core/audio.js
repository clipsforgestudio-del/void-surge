/* ============================================
   VOID SURGE - Audio System (Web Audio API)
   ============================================ */

const Audio = {
    ctx: null,
    masterVolume: 0.7,
    sfxVolume: 0.8,
    musicVolume: 0.4,
    sounds: {},
    musicPlaying: false,
    
    /**
     * Initialize audio context
     */
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume on user interaction (autoplay policy)
            const resumeAudio = () => {
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                document.removeEventListener('click', resumeAudio);
                document.removeEventListener('keydown', resumeAudio);
            };
            
            document.addEventListener('click', resumeAudio);
            document.addEventListener('keydown', resumeAudio);
            
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.ctx = null;
        }
    },
    
    /**
     * Generate and cache a sound
     */
    createSound(name, generator) {
        if (!this.ctx) return;
        this.sounds[name] = generator;
    },
    
    /**
     * Play a sound effect
     */
    play(name, volume = 1, pitch = 1) {
        if (!this.ctx || !this.sounds[name]) return;
        
        try {
            const generator = this.sounds[name];
            const gainNode = this.ctx.createGain();
            gainNode.gain.value = this.sfxVolume * volume * this.masterVolume;
            gainNode.connect(this.ctx.destination);
            
            generator(this.ctx, gainNode, pitch);
        } catch (e) {
            // Silently fail - audio is non-critical
        }
    },
    
    /**
     * Play shoot sound (laser)
     */
    playShoot() {
        this.createSound('shoot', (ctx, gain, pitch) => {
            const osc = ctx.createOscillator();
            const now = ctx.currentTime;
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800 * pitch, now);
            osc.frequency.exponentialRampToValueAtTime(200 * pitch, now + 0.1);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            osc.connect(gain);
            osc.start(now);
            osc.stop(now + 0.15);
        });
        
        this.play('shoot', 0.5);
    },
    
    /**
     * Play enemy death sound
     */
    playDeath() {
        this.createSound('death', (ctx, gain, pitch) => {
            const now = ctx.currentTime;
            
            // Noise burst
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, now);
            filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            noise.connect(filter);
            filter.connect(gain);
            
            // Add tone
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
            
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(0.2, now);
            oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            
            noise.start(now);
            noise.stop(now + 0.1);
            osc.start(now);
            osc.stop(now + 0.15);
        });
        
        this.play('death', 0.6);
    },
    
    /**
     * Play explosion sound
     */
    playExplosion() {
        this.createSound('explosion', (ctx, gain, pitch) => {
            const now = ctx.currentTime;
            
            // Big noise burst
            const bufferSize = ctx.sampleRate * 0.3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, now);
            filter.frequency.exponentialRampToValueAtTime(50, now + 0.3);
            
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            noise.connect(filter);
            filter.connect(gain);
            
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);
            
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(0.3, now);
            oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            
            noise.start(now);
            noise.stop(now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        });
        
        this.play('explosion', 0.7);
    },
    
    /**
     * Play pickup sound
     */
    playPickup() {
        this.createSound('pickup', (ctx, gain, pitch) => {
            const now = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400 * pitch, now);
            osc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + 0.1);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            osc.connect(gain);
            osc.start(now);
            osc.stop(now + 0.15);
        });
        
        this.play('pickup', 0.5);
    },
    
    /**
     * Play level up sound
     */
    playLevelUp() {
        this.createSound('levelup', (ctx, gain) => {
            const now = ctx.currentTime;
            
            const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
            
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const noteGain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                const startTime = now + i * 0.08;
                noteGain.gain.setValueAtTime(0, startTime);
                noteGain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
                noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                
                osc.connect(noteGain);
                noteGain.connect(gain);
                osc.start(startTime);
                osc.stop(startTime + 0.2);
            });
        });
        
        this.play('levelup', 0.6);
    },
    
    /**
     * Play dash sound
     */
    playDash() {
        this.createSound('dash', (ctx, gain) => {
            const now = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            
            osc.connect(gain);
            osc.start(now);
            osc.stop(now + 0.12);
        });
        
        this.play('dash', 0.4);
    },
    
    /**
     * Play damage sound
     */
    playDamage() {
        this.createSound('damage', (ctx, gain) => {
            const now = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            
            osc.connect(gain);
            osc.start(now);
            osc.stop(now + 0.1);
        });
        
        this.play('damage', 0.5);
    },
    
    /**
     * Play wave start
     */
    playWaveStart() {
        this.createSound('wavestart', (ctx, gain) => {
            const now = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.2);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.connect(gain);
            osc.start(now);
            osc.stop(now + 0.3);
        });
        
        this.play('wavestart', 0.5);
    },
    
    /**
     * Start simple background music
     */
    startMusic() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        
        // Simple ambient drone using oscillators
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        
        // Low drone
        const drone1 = this.ctx.createOscillator();
        drone1.type = 'sine';
        drone1.frequency.value = 55; // A1
        
        const droneGain1 = this.ctx.createGain();
        droneGain1.gain.value = 0.08 * this.musicVolume * this.masterVolume;
        
        drone1.connect(droneGain1);
        droneGain1.connect(this.ctx.destination);
        drone1.start();
        
        // High pad
        const drone2 = this.ctx.createOscillator();
        drone2.type = 'sine';
        drone2.frequency.value = 110; // A2
        
        const droneGain2 = this.ctx.createGain();
        droneGain2.gain.value = 0.05 * this.musicVolume * this.masterVolume;
        
        drone2.connect(droneGain2);
        droneGain2.connect(this.ctx.destination);
        drone2.start();
        
        // Sub bass pulse
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.5; // Half beat
        
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.03;
        
        const sub = this.ctx.createOscillator();
        sub.type = 'sine';
        sub.frequency.value = 27.5; // A0
        
        const subGain = this.ctx.createGain();
        subGain.gain.value = 0.04 * this.musicVolume * this.masterVolume;
        
        lfo.connect(lfoGain);
        lfoGain.connect(subGain.gain);
        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        
        lfo.start();
        sub.start();
        
        // Store references for cleanup
        this.musicNodes = [drone1, drone2, lfo, sub];
    },
    
    /**
     * Stop background music
     */
    stopMusic() {
        if (this.musicNodes) {
            this.musicNodes.forEach(node => {
                try { node.stop(); } catch(e) {}
            });
            this.musicNodes = null;
        }
        this.musicPlaying = false;
    }
};