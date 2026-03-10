const DialogueSystem = {
    active: false,
    pages: [],
    currentPage: 0,
    displayText: '',
    fullText: '',
    charIndex: 0,
    charTimer: 0,
    charSpeed: 0.03, // seconds per character
    waitingForInput: false,

    start(pages) {
        this.active = true;
        this.pages = pages;
        this.currentPage = 0;
        this.startPage();
        Game.pushState(GameState.DIALOGUE);
    },

    startPage() {
        const page = this.pages[this.currentPage];
        if (page.action) {
            this.executeAction(page.action);
            // If executeAction closed dialogue (e.g. openForge, openSanctuary, trainerBattle), don't advance
            if (!this.active) return;
            this.advance();
            return;
        }
        this.fullText = page.text;
        this.displayText = '';
        this.charIndex = 0;
        this.charTimer = 0;
        this.waitingForInput = false;
    },

    executeAction(action) {
        if (action === 'healParty') {
            Game.player.healAll();
            GameAudio.sfx.heal();
        } else if (action === 'openForge') {
            this.active = false;
            Game.popState();
            MenuSystem.openForge();
            return;
        } else if (action === 'openSanctuary') {
            this.active = false;
            Game.popState();
            MenuSystem.openSanctuary();
            return;
        } else if (typeof action === 'object' && action.type === 'trainerBattle') {
            this.active = false;
            Game.popState();
            Game.startTrainerBattle(action.trainer);
            return;
        }
    },

    update(dt) {
        if (!this.active) return;

        if (!this.waitingForInput) {
            this.charTimer += dt;
            while (this.charTimer >= this.charSpeed && this.charIndex < this.fullText.length) {
                this.charIndex++;
                this.displayText = this.fullText.substring(0, this.charIndex);
                this.charTimer -= this.charSpeed;
            }
            if (this.charIndex >= this.fullText.length) {
                this.waitingForInput = true;
            }

            // Skip text with confirm
            if (Input.confirm()) {
                if (this.charIndex < this.fullText.length) {
                    this.displayText = this.fullText;
                    this.charIndex = this.fullText.length;
                    this.waitingForInput = true;
                }
            }
        } else {
            if (Input.confirm()) {
                this.advance();
            }
        }
    },

    advance() {
        this.currentPage++;
        if (this.currentPage >= this.pages.length) {
            this.close();
        } else {
            this.startPage();
        }
    },

    close() {
        this.active = false;
        Game.popState();
    },

    render(ctx) {
        if (!this.active) return;

        // Draw dialogue box at bottom of screen
        const boxH = 40;
        const boxY = SCREEN_H - boxH - 2;

        // Background
        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(2, boxY, SCREEN_W - 4, boxH);

        // Border
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(2.5, boxY + 0.5, SCREEN_W - 5, boxH - 1);

        // Text
        Sprites.drawText(ctx, this.displayText, 6, boxY + 4, COLORS.TEXT);

        // Blinking triangle indicator
        if (this.waitingForInput) {
            const blink = Math.floor(Date.now() / 400) % 2;
            if (blink) {
                ctx.fillStyle = COLORS.WHITE;
                const tx = SCREEN_W - 10;
                const ty = boxY + boxH - 8;
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(tx + 4, ty);
                ctx.lineTo(tx + 2, ty + 3);
                ctx.fill();
            }
        }
    }
};
