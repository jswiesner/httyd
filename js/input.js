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
            if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()) || e.key === 'z' || e.key === 'x' || e.key === 'f') {
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
        // Action buttons (A, B, F) - simple touch handlers
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            const key = btn.dataset.key.toLowerCase();

            const start = (e) => {
                e.preventDefault();
                this.keys[key] = true;
                this.justPressed[key] = true;
                btn.classList.add('active');
                if (GameAudio.ctx && GameAudio.ctx.state === 'suspended') {
                    GameAudio.ctx.resume();
                }
            };
            const end = (e) => {
                e.preventDefault();
                this.keys[key] = false;
                btn.classList.remove('active');
            };

            btn.addEventListener('touchstart', start, { passive: false });
            btn.addEventListener('touchend', end, { passive: false });
            btn.addEventListener('touchcancel', end, { passive: false });
            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
            btn.addEventListener('mouseleave', end);
        });

        // D-pad: support sliding between buttons
        const dpad = document.getElementById('dpad');
        if (!dpad) return;

        const dpadBtns = {
            up: document.getElementById('btn-up'),
            down: document.getElementById('btn-down'),
            left: document.getElementById('btn-left'),
            right: document.getElementById('btn-right'),
        };

        const dpadKeys = {
            up: 'arrowup',
            down: 'arrowdown',
            left: 'arrowleft',
            right: 'arrowright',
        };

        let activeDpadDir = null;

        const getDpadDirFromTouch = (touch) => {
            // Check which d-pad button the touch point is over
            for (const [dir, btn] of Object.entries(dpadBtns)) {
                const rect = btn.getBoundingClientRect();
                if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                    touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                    return dir;
                }
            }
            // Also detect direction from center of dpad for smoother sliding
            const dpadRect = dpad.getBoundingClientRect();
            const cx = dpadRect.left + dpadRect.width / 2;
            const cy = dpadRect.top + dpadRect.height / 2;
            const dx = touch.clientX - cx;
            const dy = touch.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const deadzone = dpadRect.width * 0.15;
            if (dist < deadzone) return null;

            // Within the dpad bounds?
            if (touch.clientX < dpadRect.left - 10 || touch.clientX > dpadRect.right + 10 ||
                touch.clientY < dpadRect.top - 10 || touch.clientY > dpadRect.bottom + 10) {
                return null;
            }

            if (Math.abs(dx) > Math.abs(dy)) {
                return dx > 0 ? 'right' : 'left';
            } else {
                return dy > 0 ? 'down' : 'up';
            }
        };

        const setDpadDir = (dir) => {
            if (dir === activeDpadDir) return;

            // Release old direction
            if (activeDpadDir) {
                this.keys[dpadKeys[activeDpadDir]] = false;
                dpadBtns[activeDpadDir].classList.remove('active');
            }

            activeDpadDir = dir;

            // Press new direction
            if (dir) {
                this.keys[dpadKeys[dir]] = true;
                this.justPressed[dpadKeys[dir]] = true;
                dpadBtns[dir].classList.add('active');
                if (GameAudio.ctx && GameAudio.ctx.state === 'suspended') {
                    GameAudio.ctx.resume();
                }
            }
        };

        // Track which touch ID is on the dpad
        let dpadTouchId = null;

        dpad.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (dpadTouchId !== null) return; // already tracking a touch
            const touch = e.changedTouches[0];
            dpadTouchId = touch.identifier;
            const dir = getDpadDirFromTouch(touch);
            setDpadDir(dir);
        }, { passive: false });

        dpad.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (const touch of e.changedTouches) {
                if (touch.identifier === dpadTouchId) {
                    const dir = getDpadDirFromTouch(touch);
                    setDpadDir(dir);
                    break;
                }
            }
        }, { passive: false });

        const dpadEnd = (e) => {
            e.preventDefault();
            for (const touch of e.changedTouches) {
                if (touch.identifier === dpadTouchId) {
                    setDpadDir(null);
                    dpadTouchId = null;
                    break;
                }
            }
        };

        dpad.addEventListener('touchend', dpadEnd, { passive: false });
        dpad.addEventListener('touchcancel', dpadEnd, { passive: false });

        // Mouse fallback for dpad buttons
        for (const [dir, btn] of Object.entries(dpadBtns)) {
            const key = dpadKeys[dir];
            btn.addEventListener('mousedown', (e) => {
                this.keys[key] = true;
                this.justPressed[key] = true;
                btn.classList.add('active');
            });
            btn.addEventListener('mouseup', (e) => {
                this.keys[key] = false;
                btn.classList.remove('active');
            });
            btn.addEventListener('mouseleave', (e) => {
                this.keys[key] = false;
                btn.classList.remove('active');
            });
        }
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
