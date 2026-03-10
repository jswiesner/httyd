// Weather effects system
const WeatherSystem = {
    current: Weather.CLEAR,
    timer: 0,
    particles: [],
    fogOffset: 0,
    lightningFlash: 0,
    lightningTimer: 0,

    update(dt) {
        const map = Game.currentMap;
        if (!map) return;

        // Set weather from map (can be overridden dynamically)
        this.current = map.weather || Weather.CLEAR;

        this.timer += dt;

        if (this.current === Weather.FOG) {
            this.fogOffset += dt * 8;
        }

        if (this.current === Weather.THUNDERSTORM) {
            // Random lightning flashes
            this.lightningTimer -= dt;
            if (this.lightningTimer <= 0) {
                this.lightningTimer = 3 + Math.random() * 5;
                this.lightningFlash = 0.6;
                GameAudio.sfx.bump(); // thunder-like sound
            }
            if (this.lightningFlash > 0) {
                this.lightningFlash -= dt * 3;
            }

            // Rain particles
            while (this.particles.length < 40) {
                this.particles.push({
                    x: Math.random() * SCREEN_W,
                    y: Math.random() * SCREEN_H,
                    speed: 80 + Math.random() * 40,
                    length: 2 + Math.random() * 3,
                });
            }
            for (const p of this.particles) {
                p.y += p.speed * dt;
                p.x -= p.speed * 0.3 * dt;
                if (p.y > SCREEN_H) {
                    p.y = -p.length;
                    p.x = Math.random() * SCREEN_W;
                }
                if (p.x < 0) p.x = SCREEN_W;
            }
        } else {
            this.particles = [];
        }
    },

    render(ctx) {
        if (this.current === Weather.FOG) {
            this.renderFog(ctx);
        } else if (this.current === Weather.THUNDERSTORM) {
            this.renderThunderstorm(ctx);
        }
    },

    renderFog(ctx) {
        // Layered fog bands that drift
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#c0c8d8';
        for (let i = 0; i < 5; i++) {
            const y = (i * 40 + this.fogOffset * (0.5 + i * 0.2)) % (SCREEN_H + 30) - 15;
            const x = Math.sin(this.timer * 0.3 + i * 1.5) * 20;
            ctx.fillRect(x - 10, y, SCREEN_W + 20, 12);
        }

        // Overall fog tint
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#a0a8b8';
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        ctx.globalAlpha = 1.0;
    },

    renderThunderstorm(ctx) {
        // Dark overlay
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#1a1a3a';
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        ctx.globalAlpha = 1.0;

        // Lightning flash
        if (this.lightningFlash > 0) {
            ctx.globalAlpha = this.lightningFlash;
            ctx.fillStyle = '#e8e8ff';
            ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
            ctx.globalAlpha = 1.0;
        }

        // Rain
        ctx.strokeStyle = '#8898b8';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        for (const p of this.particles) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.length * 0.3, p.y + p.length);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
    },

    // Check if thunderstorm boosts lightning/strike class dragons
    getTypePowerBoost(type) {
        if (this.current === Weather.THUNDERSTORM && type === 'lightning') {
            return 1.3; // 30% power boost for Strike/Lightning in storms
        }
        if (this.current === Weather.FOG && type === 'ice') {
            return 1.2; // 20% power boost for Mystery/Ice in fog
        }
        return 1.0;
    },
};
