const Input = {
    keys: {},
    justPressed: {},

    init() {
        window.addEventListener('keydown', e => {
            const key = e.key.toLowerCase();
            if (!this.keys[key]) {
                this.justPressed[key] = true;
            }
            this.keys[key] = true;
            if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()) || e.key === 'z' || e.key === 'x') {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Touch controls
        this._setupTouch();
    },

    _setupTouch() {
        const buttons = document.querySelectorAll('.dpad-btn, .action-btn');
        buttons.forEach(btn => {
            const key = btn.dataset.key.toLowerCase();

            const start = (e) => {
                e.preventDefault();
                this.keys[key] = true;
                this.justPressed[key] = true;
                // Init audio on first touch
                if (GameAudio.ctx && GameAudio.ctx.state === 'suspended') {
                    GameAudio.ctx.resume();
                }
            };
            const end = (e) => {
                e.preventDefault();
                this.keys[key] = false;
            };

            btn.addEventListener('touchstart', start, { passive: false });
            btn.addEventListener('touchend', end, { passive: false });
            btn.addEventListener('touchcancel', end, { passive: false });
            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
            btn.addEventListener('mouseleave', end);
        });
    },

    consume() {
        this.justPressed = {};
    },

    isDown(key) {
        return !!this.keys[key.toLowerCase()];
    },

    wasPressed(key) {
        return !!this.justPressed[key.toLowerCase()];
    },

    getDirection() {
        if (this.isDown('ArrowUp') || this.isDown('w')) return DIR.UP;
        if (this.isDown('ArrowDown') || this.isDown('s')) return DIR.DOWN;
        if (this.isDown('ArrowLeft') || this.isDown('a')) return DIR.LEFT;
        if (this.isDown('ArrowRight') || this.isDown('d')) return DIR.RIGHT;
        return null;
    },

    confirm() {
        return this.wasPressed('z') || this.wasPressed(' ') || this.wasPressed('enter');
    },

    cancel() {
        return this.wasPressed('x') || this.wasPressed('escape');
    },

    menu() {
        return this.wasPressed('enter') || this.wasPressed('escape');
    }
};
