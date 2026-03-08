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
            if (this.selectedDragon > 0) { this.selectedDragon--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedDragon < party.length - 1) { this.selectedDragon++; GameAudio.sfx.select(); }
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
        // Full screen dragon info
        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(4, 4, SCREEN_W - 8, SCREEN_H - 8);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(4.5, 4.5, SCREEN_W - 9, SCREEN_H - 9);

        Sprites.drawText(ctx, 'YOUR DRAGONS', 8, 8, COLORS.TEXT);

        const party = Game.player.party;
        if (party.length === 0) {
            Sprites.drawText(ctx, 'No dragons yet!', 8, 24, COLORS.GRAY);
            return;
        }

        for (let i = 0; i < party.length; i++) {
            const dragon = party[i];
            const species = dragon.species;
            const y = 22 + i * 55;
            const selected = i === this.selectedDragon;

            if (selected) {
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                ctx.fillRect(6, y - 2, SCREEN_W - 12, 53);
            }

            // Dragon sprite
            const sprite = Sprites.get(dragon.speciesId + '_front');
            if (sprite) {
                ctx.drawImage(sprite, 8, y, 32, 32);
            }

            // Name, level, type
            const prefix = selected ? '> ' : '  ';
            Sprites.drawText(ctx, prefix + species.name, 42, y, COLORS.TEXT);
            Sprites.drawText(ctx, 'Lv ' + dragon.level, 42, y + 10, COLORS.TEXT);
            Sprites.drawText(ctx, species.type.toUpperCase(), 90, y + 10, this.getTypeColor(species.type));

            // HP
            Sprites.drawText(ctx, 'HP ' + dragon.currentHp + '/' + dragon.maxHp, 42, y + 20, COLORS.TEXT);

            // HP bar
            const hpRatio = dragon.currentHp / dragon.maxHp;
            ctx.fillStyle = COLORS.BLACK;
            ctx.fillRect(42, y + 28, 100, 4);
            let barColor = COLORS.HP_GREEN;
            if (hpRatio < 0.5) barColor = COLORS.HP_YELLOW;
            if (hpRatio < 0.2) barColor = COLORS.HP_RED;
            ctx.fillStyle = barColor;
            ctx.fillRect(43, y + 29, Math.floor(98 * hpRatio), 2);

            // Stats
            Sprites.drawText(ctx, 'ATK ' + dragon.stats.attack + ' DEF ' + dragon.stats.defense + ' SPD ' + dragon.stats.speed, 42, y + 34, COLORS.GRAY);

            // Moves
            const moveNames = dragon.moves.map(m => MOVES[m.id].name).join(', ');
            Sprites.drawText(ctx, moveNames, 8, y + 44, COLORS.GRAY);
        }
    },

    getTypeColor(type) {
        const colors = { fire: COLORS.FIRE, ice: COLORS.ICE, lightning: COLORS.LIGHTNING, earth: COLORS.EARTH };
        return colors[type] || COLORS.TEXT;
    }
};
