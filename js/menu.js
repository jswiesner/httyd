const MenuSystem = {
    active: false,
    selectedItem: 0,
    menuItems: ['DRAGONS', 'SAVE', 'CLOSE'],
    subMenu: null, // 'dragons'
    selectedDragon: 0,

    open() {
        this.active = true;
        this.selectedItem = 0;
        this.subMenu = null;
        GameAudio.sfx.menuOpen();
        Game.pushState(GameState.MENU);
    },

    close() {
        this.active = false;
        this.subMenu = null;
        Game.popState();
    },

    update(dt) {
        if (!this.active) return;

        if (this.subMenu === 'dragons') {
            this.updateDragonsMenu();
            return;
        }

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.selectedItem > 0) { this.selectedItem--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedItem < this.menuItems.length - 1) { this.selectedItem++; GameAudio.sfx.select(); }
        }

        if (Input.confirm()) {
            GameAudio.sfx.confirm();
            switch (this.selectedItem) {
                case 0: // DRAGONS
                    this.subMenu = 'dragons';
                    this.selectedDragon = 0;
                    break;
                case 1: // SAVE
                    Game.saveGame();
                    GameAudio.sfx.save();
                    this.close();
                    break;
                case 2: // CLOSE
                    this.close();
                    break;
            }
        }

        if (Input.cancel()) {
            this.close();
        }
    },

    updateDragonsMenu() {
        if (Input.cancel()) {
            this.subMenu = null;
            GameAudio.sfx.cancel();
            return;
        }

        const party = Game.player.party;
        if (party.length === 0) {
            this.subMenu = null;
            return;
        }

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.selectedDragon > 0) {
                this.selectedDragon--;
                GameAudio.sfx.select();
            } else {
                // Wrap to last dragon
                this.selectedDragon = party.length - 1;
                GameAudio.sfx.select();
            }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedDragon < party.length - 1) {
                this.selectedDragon++;
                GameAudio.sfx.select();
            } else {
                // Wrap to first dragon
                this.selectedDragon = 0;
                GameAudio.sfx.select();
            }
        }
    },

    render(ctx) {
        if (!this.active) return;

        if (this.subMenu === 'dragons') {
            this.renderDragonsMenu(ctx);
            return;
        }

        // Menu box on right side
        const menuW = 60;
        const menuH = 10 + this.menuItems.length * 12;
        const menuX = SCREEN_W - menuW - 4;
        const menuY = 4;

        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(menuX, menuY, menuW, menuH);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(menuX + 0.5, menuY + 0.5, menuW - 1, menuH - 1);

        for (let i = 0; i < this.menuItems.length; i++) {
            const y = menuY + 4 + i * 12;
            if (i === this.selectedItem) {
                Sprites.drawText(ctx, '>', menuX + 4, y, COLORS.WHITE);
            }
            Sprites.drawText(ctx, this.menuItems[i], menuX + 14, y, COLORS.TEXT);
        }
    },

    renderDragonsMenu(ctx) {
        const party = Game.player.party;

        // Full screen dark background
        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

        // Outer border
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(1.5, 1.5, SCREEN_W - 3, SCREEN_H - 3);

        if (party.length === 0) {
            Sprites.drawText(ctx, 'No dragons yet!', 40, 66, COLORS.GRAY);
            Sprites.drawText(ctx, 'X:BACK', 60, 130, COLORS.GRAY);
            return;
        }

        const dragon = party[this.selectedDragon];
        const species = dragon.species;
        const typeColor = this.getTypeColor(species.type);

        // --- Top header bar with type-colored accent ---
        ctx.fillStyle = typeColor;
        ctx.fillRect(2, 2, SCREEN_W - 4, 2);

        // --- Page indicator (top right) ---
        const pageText = (this.selectedDragon + 1) + '/' + party.length;
        const pageX = SCREEN_W - Sprites.textWidth(pageText) - 6;
        Sprites.drawText(ctx, pageText, pageX, 7, COLORS.GRAY);

        // --- Dragon name prominently displayed ---
        Sprites.drawText(ctx, species.name.toUpperCase(), 6, 7, COLORS.TEXT);

        // --- Thin separator line under header ---
        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(4, 16, SCREEN_W - 8, 1);

        // --- Left side: Dragon sprite (large) ---
        const sprite = Sprites.get(dragon.speciesId + '_front');
        if (sprite) {
            // Draw sprite at 48x48 native size
            ctx.drawImage(sprite, 4, 20, 48, 48);
        }

        // Type badge under sprite
        ctx.fillStyle = typeColor;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(6, 70, 44, 10);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = typeColor;
        ctx.fillRect(6, 70, 1, 10);
        const typeLabel = species.type.toUpperCase();
        const typeLabelX = 6 + Math.floor((44 - Sprites.textWidth(typeLabel)) / 2);
        Sprites.drawText(ctx, typeLabel, typeLabelX, 72, typeColor);

        // --- Right side: Stats panel ---
        const statX = 56;

        // Level + XP
        Sprites.drawText(ctx, 'LV ' + dragon.level, statX, 20, COLORS.TEXT);

        // XP bar
        Sprites.drawText(ctx, 'XP', statX, 29, COLORS.GRAY);
        const xpBarX = statX + 18;
        const xpBarW = 82;
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(xpBarX, 29, xpBarW, 7);
        ctx.strokeStyle = COLORS.GRAY;
        ctx.strokeRect(xpBarX + 0.5, 29.5, xpBarW - 1, 6);
        const xpRatio = dragon.xpToNext > 0 ? Math.min(dragon.xp / dragon.xpToNext, 1) : 0;
        if (xpRatio > 0) {
            ctx.fillStyle = '#5a8ae8';
            ctx.fillRect(xpBarX + 1, 30, Math.floor((xpBarW - 2) * xpRatio), 5);
        }
        const xpText = dragon.xp + '/' + dragon.xpToNext;
        const xpTextX = xpBarX + Math.floor((xpBarW - Sprites.textWidth(xpText)) / 2);
        Sprites.drawText(ctx, xpText, xpTextX, 30, COLORS.TEXT);

        // HP bar
        Sprites.drawText(ctx, 'HP', statX, 40, COLORS.GRAY);
        const hpBarX = statX + 18;
        const hpBarW = 82;
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(hpBarX, 40, hpBarW, 7);
        ctx.strokeStyle = COLORS.GRAY;
        ctx.strokeRect(hpBarX + 0.5, 40.5, hpBarW - 1, 6);
        const hpRatio = dragon.maxHp > 0 ? dragon.currentHp / dragon.maxHp : 0;
        let hpColor = COLORS.HP_GREEN;
        if (hpRatio < 0.5) hpColor = COLORS.HP_YELLOW;
        if (hpRatio < 0.2) hpColor = COLORS.HP_RED;
        if (hpRatio > 0) {
            ctx.fillStyle = hpColor;
            ctx.fillRect(hpBarX + 1, 41, Math.floor((hpBarW - 2) * hpRatio), 5);
        }
        const hpText = dragon.currentHp + '/' + dragon.maxHp;
        const hpTextX = hpBarX + Math.floor((hpBarW - Sprites.textWidth(hpText)) / 2);
        Sprites.drawText(ctx, hpText, hpTextX, 41, COLORS.TEXT);

        // --- Stat bars: ATK, DEF, SPD ---
        const statBarStartY = 51;
        const statBarH = 7;
        const statBarSpacing = 10;
        const statLabels = ['ATK', 'DEF', 'SPD'];
        const statValues = [dragon.stats.attack, dragon.stats.defense, dragon.stats.speed];
        const statColors = ['#e86040', '#50a0e8', '#40c870'];
        // Max stat for bar scaling (rough max at high levels)
        const maxStatForBar = 50;

        for (let i = 0; i < 3; i++) {
            const sy = statBarStartY + i * statBarSpacing;
            Sprites.drawText(ctx, statLabels[i], statX, sy, COLORS.GRAY);
            const barX = statX + 24;
            const barW = 58;

            // Bar background
            ctx.fillStyle = COLORS.BLACK;
            ctx.fillRect(barX, sy, barW, statBarH);
            ctx.strokeStyle = COLORS.GRAY;
            ctx.strokeRect(barX + 0.5, sy + 0.5, barW - 1, statBarH - 1);

            // Bar fill
            const ratio = Math.min(statValues[i] / maxStatForBar, 1);
            if (ratio > 0) {
                ctx.fillStyle = statColors[i];
                ctx.fillRect(barX + 1, sy + 1, Math.floor((barW - 2) * ratio), statBarH - 2);
            }

            // Numeric value to the right of bar
            Sprites.drawText(ctx, '' + statValues[i], barX + barW + 3, sy, COLORS.TEXT);
        }

        // --- Moves section ---
        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(4, 83, SCREEN_W - 8, 1);

        Sprites.drawText(ctx, 'MOVES', 6, 86, COLORS.TEXT);

        const moveStartY = 95;
        const moveLineH = 11;
        for (let i = 0; i < dragon.moves.length; i++) {
            const move = dragon.moves[i];
            const moveData = MOVES[move.id];
            const my = moveStartY + i * moveLineH;
            const moveTypeColor = this.getTypeColor(moveData.type);

            // Type indicator dot
            ctx.fillStyle = moveTypeColor;
            ctx.fillRect(6, my + 2, 3, 3);

            // Move name
            Sprites.drawText(ctx, moveData.name, 12, my, moveTypeColor);

            // Power
            const pwrText = 'P:' + moveData.power;
            Sprites.drawText(ctx, pwrText, 100, my, COLORS.GRAY);

            // PP
            const ppText = move.currentPp + '/' + move.maxPp;
            const ppX = SCREEN_W - Sprites.textWidth(ppText) - 6;
            const ppRatio = move.maxPp > 0 ? move.currentPp / move.maxPp : 0;
            let ppColor = COLORS.TEXT;
            if (ppRatio <= 0.25) ppColor = COLORS.HP_RED;
            else if (ppRatio <= 0.5) ppColor = COLORS.HP_YELLOW;
            Sprites.drawText(ctx, ppText, ppX, my, ppColor);
        }

        // If fewer than 4 moves, show empty slots
        for (let i = dragon.moves.length; i < 4; i++) {
            const my = moveStartY + i * moveLineH;
            Sprites.drawText(ctx, '---', 12, my, COLORS.GRAY);
        }

        // --- Bottom bar with controls ---
        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(4, SCREEN_H - 14, SCREEN_W - 8, 1);

        // Navigation arrows indicator
        if (party.length > 1) {
            // Up/Down arrows hint
            Sprites.drawText(ctx, 'U/D:SWITCH', 6, SCREEN_H - 10, COLORS.GRAY);
        }
        Sprites.drawText(ctx, 'X:BACK', SCREEN_W - Sprites.textWidth('X:BACK') - 6, SCREEN_H - 10, COLORS.GRAY);

        // Bottom type-colored accent
        ctx.fillStyle = typeColor;
        ctx.fillRect(2, SCREEN_H - 4, SCREEN_W - 4, 2);
    },

    getTypeColor(type) {
        const colors = { fire: COLORS.FIRE, ice: COLORS.ICE, lightning: COLORS.LIGHTNING, earth: COLORS.EARTH };
        return colors[type] || COLORS.TEXT;
    }
};
