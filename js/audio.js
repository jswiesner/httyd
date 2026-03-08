const GameAudio = {
    ctx: null,
    enabled: true,

    init() {
        // Create AudioContext on first user interaction
        const initCtx = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        };
        window.addEventListener('keydown', initCtx, { once: false });
        window.addEventListener('touchstart', initCtx, { once: false });
        window.addEventListener('click', initCtx, { once: false });
    },

    playTone(freq, duration, type, volume, delay) {
        if (!this.ctx || !this.enabled) return;
        type = type || 'square';
        volume = volume || 0.08;
        delay = delay || 0;
        const t = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + duration);
    },

    playNoise(duration, volume, delay) {
        if (!this.ctx || !this.enabled) return;
        volume = volume || 0.05;
        delay = delay || 0;
        const t = this.ctx.currentTime + delay;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        source.connect(gain).connect(this.ctx.destination);
        source.start(t);
    },

    sfx: {
        step() {
            GameAudio.playTone(180, 0.04, 'square', 0.03);
        },
        bump() {
            GameAudio.playTone(80, 0.1, 'square', 0.05);
        },
        select() {
            GameAudio.playTone(700, 0.06, 'square', 0.06);
        },
        confirm() {
            GameAudio.playTone(500, 0.06, 'square', 0.06);
            GameAudio.playTone(700, 0.08, 'square', 0.06, 0.06);
        },
        cancel() {
            GameAudio.playTone(400, 0.06, 'square', 0.06);
            GameAudio.playTone(300, 0.08, 'square', 0.06, 0.06);
        },
        encounter() {
            for (let i = 0; i < 4; i++) {
                GameAudio.playTone(600 - i * 100, 0.08, 'square', 0.07, i * 0.07);
            }
        },
        hit() {
            GameAudio.playNoise(0.12, 0.08);
            GameAudio.playTone(200, 0.1, 'square', 0.05);
        },
        criticalHit() {
            GameAudio.playNoise(0.15, 0.1);
            GameAudio.playTone(300, 0.08, 'square', 0.06);
            GameAudio.playTone(150, 0.12, 'square', 0.06, 0.08);
        },
        tameShake() {
            GameAudio.playTone(300, 0.1, 'triangle', 0.06);
        },
        tameSuccess() {
            const notes = [523, 659, 784, 1047]; // C E G C
            notes.forEach((n, i) => {
                GameAudio.playTone(n, 0.2, 'square', 0.07, i * 0.15);
            });
        },
        tameFail() {
            GameAudio.playTone(300, 0.15, 'square', 0.06);
            GameAudio.playTone(200, 0.2, 'square', 0.06, 0.15);
        },
        levelUp() {
            const notes = [440, 554, 659, 880];
            notes.forEach((n, i) => {
                GameAudio.playTone(n, 0.15, 'square', 0.06, i * 0.12);
            });
        },
        heal() {
            const notes = [440, 523, 659, 784, 880];
            notes.forEach((n, i) => {
                GameAudio.playTone(n, 0.12, 'triangle', 0.05, i * 0.1);
            });
        },
        victory() {
            const notes = [523, 523, 523, 659, 784, 659, 784, 1047];
            notes.forEach((n, i) => {
                GameAudio.playTone(n, 0.15, 'square', 0.06, i * 0.12);
            });
        },
        defeat() {
            const notes = [400, 350, 300, 250, 200];
            notes.forEach((n, i) => {
                GameAudio.playTone(n, 0.2, 'square', 0.05, i * 0.18);
            });
        },
        run() {
            for (let i = 0; i < 6; i++) {
                GameAudio.playTone(300 + i * 50, 0.04, 'square', 0.04, i * 0.04);
            }
        },
        menuOpen() {
            GameAudio.playTone(600, 0.05, 'square', 0.05);
            GameAudio.playTone(800, 0.08, 'square', 0.05, 0.05);
        },
        save() {
            const notes = [523, 659, 784, 1047];
            notes.forEach((n, i) => {
                GameAudio.playTone(n, 0.1, 'triangle', 0.06, i * 0.08);
            });
        },
        titleStart() {
            const notes = [262, 330, 392, 523, 659, 784, 1047];
            notes.forEach((n, i) => {
                GameAudio.playTone(n, 0.18, 'square', 0.06, i * 0.1);
            });
        }
    }
};
