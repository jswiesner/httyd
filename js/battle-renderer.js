const BattleRenderer = {
    shakeOffset: 0,
    flashTimer: 0,
    enemyShake: 0,
    playerShake: 0,

    render(ctx) {
        const be = BattleEngine;

        // Sky gradient
        const skyColors = ['#c8d8e8', '#d0dce8', '#d8e0e8', '#dce4ec', '#e0e8f0'];
        for (let i = 0; i < skyColors.length; i++) {
            ctx.fillStyle = skyColors[i];
            ctx.fillRect(0, i * 14, SCREEN_W, 14);
        }

        // Distant mountains
        ctx.fillStyle = '#98a8b8';
        ctx.beginPath();
        ctx.moveTo(0, 60);
        ctx.lineTo(20, 45);
        ctx.lineTo(45, 55);
        ctx.lineTo(70, 40);
        ctx.lineTo(95, 52);
        ctx.lineTo(120, 42);
        ctx.lineTo(145, 50);
        ctx.lineTo(SCREEN_W, 55);
        ctx.lineTo(SCREEN_W, 70);
        ctx.lineTo(0, 70);
        ctx.fill();

        // Ground with grass texture
        ctx.fillStyle = '#8aaa78';
        ctx.fillRect(0, 70, SCREEN_W, 30);
        ctx.fillStyle = '#7a9a68';
        ctx.fillRect(0, 70, SCREEN_W, 2);
        // Grass detail
        ctx.fillStyle = '#9aba88';
        for (let x = 0; x < SCREEN_W; x += 6) {
            ctx.fillRect(x, 72 + (x % 3), 2, 1);
            ctx.fillRect(x + 3, 78 + (x % 4), 1, 1);
        }

        // Enemy dragon (top-right area)
        if (be.enemyDragon) {
            const sprite = Sprites.get(be.enemyDragon.speciesId + '_front');
            if (sprite) {
                let ex = 100;
                let ey = 8;
                // Shake during tame attempt
                if (be.phase === BattlePhase.TAME_ATTEMPT) {
                    ex += Math.sin(Date.now() * 0.02) * 3;
                }
                ctx.drawImage(sprite, ex, ey);
            }

            // Enemy info box (top-left)
            this.drawInfoBox(ctx, 2, 2, 78, 24, be.enemyDragon, true);
        }

        // Player dragon (bottom-left area)
        if (be.playerDragon) {
            const sprite = Sprites.get(be.playerDragon.speciesId + '_back');
            if (sprite) {
                ctx.drawImage(sprite, 8, 44);
            }

            // Player info box (bottom-right)
            this.drawInfoBox(ctx, 80, 52, 78, 32, be.playerDragon, false);
        }

        // Bottom text/menu area
        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(0, 96, SCREEN_W, 48);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 96.5, SCREEN_W - 1, 47);

        // Phase-specific rendering
        switch (be.phase) {
            case BattlePhase.TEXT:
            case BattlePhase.VICTORY:
            case BattlePhase.DEFEAT:
            case BattlePhase.RUN:
                this.renderText(ctx, be.currentText);
                break;
            case BattlePhase.MENU:
                this.renderMenu(ctx);
                break;
            case BattlePhase.MOVE_SELECT:
                this.renderMoveSelect(ctx);
                break;
            case BattlePhase.TAME_ATTEMPT:
                this.renderTameAttempt(ctx);
                break;
            case BattlePhase.PARTY_FULL:
                this.renderText(ctx, be.currentText);
                break;
        }
    },

    drawInfoBox(ctx, x, y, w, h, dragon, isEnemy) {
        // Box background
        ctx.fillStyle = 'rgba(20, 20, 40, 0.85)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

        // Name and level
        const species = DRAGON_SPECIES[dragon.speciesId];
        Sprites.drawText(ctx, species.name, x + 2, y + 2, COLORS.TEXT);
        Sprites.drawText(ctx, 'Lv' + dragon.level, x + w - 20, y + 2, COLORS.TEXT);

        // HP bar
        const barX = x + 2;
        const barY = y + 12;
        const barW = w - 4;
        const barH = 4;
        const hpRatio = dragon.currentHp / dragon.maxHp;

        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(barX, barY, barW, barH);

        let barColor = COLORS.HP_GREEN;
        if (hpRatio < 0.5) barColor = COLORS.HP_YELLOW;
        if (hpRatio < 0.2) barColor = COLORS.HP_RED;

        ctx.fillStyle = barColor;
        ctx.fillRect(barX + 1, barY + 1, Math.floor((barW - 2) * hpRatio), barH - 2);

        // HP numbers for player's dragon
        if (!isEnemy) {
            Sprites.drawText(ctx, dragon.currentHp + '/' + dragon.maxHp, x + 2, y + 18, COLORS.TEXT);

            // XP bar
            const xpBarY = y + 26;
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, xpBarY, barW, 3);
            const xpRatio = dragon.xpToNext > 0 ? dragon.xp / dragon.xpToNext : 0;
            ctx.fillStyle = '#5080d0';
            ctx.fillRect(barX + 1, xpBarY + 1, Math.floor((barW - 2) * xpRatio), 1);
        }

        // Type indicator
        const typeIcon = Sprites.get('type_' + species.type);
        if (typeIcon) {
            ctx.drawImage(typeIcon, x + w - 10, y + 12);
        }
    },

    renderText(ctx, text) {
        Sprites.drawText(ctx, text || '', 4, 100, COLORS.TEXT);

        // Blinking continue indicator
        if (BattleEngine._textDone || BattleEngine.phase !== BattlePhase.TEXT) {
            const blink = Math.floor(Date.now() / 400) % 2;
            if (blink) {
                ctx.fillStyle = COLORS.WHITE;
                ctx.beginPath();
                ctx.moveTo(SCREEN_W - 10, 138);
                ctx.lineTo(SCREEN_W - 6, 138);
                ctx.lineTo(SCREEN_W - 8, 141);
                ctx.fill();
            }
        }
    },

    renderMenu(ctx) {
        const actions = ['FIGHT', 'TAME', 'DRAGON', 'RUN'];
        const be = BattleEngine;

        // Info text
        Sprites.drawText(ctx, 'What will you do?', 4, 100, COLORS.TEXT);

        // 2x2 action grid
        const gridX = 84;
        const gridY = 110;
        const cellW = 38;
        const cellH = 14;

        for (let i = 0; i < 4; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = gridX + col * cellW;
            const y = gridY + row * cellH;

            if (i === be.selectedAction) {
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(x - 1, y - 1, cellW, cellH);
                Sprites.drawText(ctx, '>', x, y + 2, COLORS.WHITE);
            }
            Sprites.drawText(ctx, actions[i], x + 8, y + 2, COLORS.TEXT);
        }
    },

    renderMoveSelect(ctx) {
        const be = BattleEngine;
        const moves = be.playerDragon.moves;

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const moveData = MOVES[move.id];
            const y = 100 + i * 11;

            if (i === be.selectedMove) {
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(2, y - 1, SCREEN_W - 4, 11);
                Sprites.drawText(ctx, '>', 4, y + 1, COLORS.WHITE);
            }

            const ppColor = move.currentPp > 0 ? COLORS.TEXT : COLORS.HP_RED;
            Sprites.drawText(ctx, moveData.name, 12, y + 1, COLORS.TEXT);
            Sprites.drawText(ctx, move.currentPp + '/' + move.maxPp, SCREEN_W - 30, y + 1, ppColor);
        }
    },

    renderTameAttempt(ctx) {
        const be = BattleEngine;
        Sprites.drawText(ctx, 'Taming...', 4, 100, COLORS.TEXT);

        // Draw shake dots
        for (let i = 0; i < be.shakeCount; i++) {
            ctx.fillStyle = COLORS.WHITE;
            ctx.beginPath();
            ctx.arc(SCREEN_W / 2 - 10 + i * 10, 130, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
