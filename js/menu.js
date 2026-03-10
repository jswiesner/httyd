const MenuSystem = {
    active: false,
    selectedItem: 0,
    menuItems: ['DRAGONS', 'BAG', 'SAVE', 'CLOSE'],
    subMenu: null,
    selectedDragon: 0,
    bagScroll: 0,
    selectedBagItem: 0,
    forgeMode: false,
    selectedRecipe: 0,
    equipMode: false,
    selectedEquipDragon: 0,

    open() {
        this.active = true;
        this.selectedItem = 0;
        this.subMenu = null;
        this.forgeMode = false;
        this.equipMode = false;
        GameAudio.sfx.menuOpen();
        Game.pushState(GameState.MENU);
    },

    close() {
        this.active = false;
        this.subMenu = null;
        this.forgeMode = false;
        this.equipMode = false;
        Game.popState();
    },

    update(dt) {
        if (!this.active) return;

        if (this.forgeMode) {
            this.updateForge();
            return;
        }

        if (this.equipMode) {
            this.updateEquip();
            return;
        }

        if (this.subMenu === 'dragons') {
            this.updateDragonsMenu();
            return;
        }

        if (this.subMenu === 'bag') {
            this.updateBag();
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
                case 1: // BAG
                    this.subMenu = 'bag';
                    this.selectedBagItem = 0;
                    break;
                case 2: // SAVE
                    Game.saveGame();
                    GameAudio.sfx.save();
                    this.close();
                    break;
                case 3: // CLOSE
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
            } else {
                this.selectedDragon = party.length - 1;
            }
            GameAudio.sfx.select();
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedDragon < party.length - 1) {
                this.selectedDragon++;
            } else {
                this.selectedDragon = 0;
            }
            GameAudio.sfx.select();
        }
    },

    updateBag() {
        if (Input.cancel()) {
            this.subMenu = null;
            GameAudio.sfx.cancel();
            return;
        }

        const allItems = this._getAllBagItems();

        if (allItems.length === 0) return;

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.selectedBagItem > 0) { this.selectedBagItem--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedBagItem < allItems.length - 1) { this.selectedBagItem++; GameAudio.sfx.select(); }
        }

        // Equip saddle with confirm
        if (Input.confirm()) {
            const item = allItems[this.selectedBagItem];
            if (item && item.isSaddle) {
                this.equipMode = true;
                this.selectedEquipDragon = 0;
                GameAudio.sfx.confirm();
            }
        }
    },

    updateForge() {
        if (Input.cancel()) {
            this.forgeMode = false;
            this.close();
            GameAudio.sfx.cancel();
            return;
        }

        const recipes = Forge.getRecipes();

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.selectedRecipe > 0) { this.selectedRecipe--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedRecipe < recipes.length - 1) { this.selectedRecipe++; GameAudio.sfx.select(); }
        }

        if (Input.confirm()) {
            const recipe = recipes[this.selectedRecipe];
            if (recipe && recipe.canCraft) {
                if (Forge.craft(recipe.id)) {
                    GameAudio.sfx.confirm();
                    this.forgeMode = false;
                    this.close();
                    DialogueSystem.start([
                        { text: 'Gobber forged a\n' + recipe.name + '!\nCheck your bag.' }
                    ]);
                }
            } else {
                GameAudio.sfx.bump();
            }
        }
    },

    updateEquip() {
        if (Input.cancel()) {
            this.equipMode = false;
            GameAudio.sfx.cancel();
            return;
        }

        const party = Game.player.party;
        if (party.length === 0) {
            this.equipMode = false;
            return;
        }

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.selectedEquipDragon > 0) { this.selectedEquipDragon--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.selectedEquipDragon < party.length - 1) { this.selectedEquipDragon++; GameAudio.sfx.select(); }
        }

        if (Input.confirm()) {
            const allItems = this._getAllBagItems();
            const selectedItem = allItems[this.selectedBagItem];

            if (selectedItem && selectedItem.saddleId) {
                const dragon = party[this.selectedEquipDragon];
                Inventory.equipSaddle(dragon, selectedItem.saddleId);
                Inventory.removeItem('saddle_' + selectedItem.saddleId);
                GameAudio.sfx.confirm();
                this.equipMode = false;
                this.subMenu = null;
                DialogueSystem.start([
                    { text: 'Equipped ' + SADDLES[selectedItem.saddleId].name + '\non ' + dragon.species.name + '!' }
                ]);
            }
        }
    },

    _getAllBagItems() {
        const items = Inventory.getItemList();
        const saddleItems = [];
        for (const [id, saddle] of Object.entries(SADDLES)) {
            const count = Inventory.getCount('saddle_' + id);
            if (count > 0) {
                saddleItems.push({ id: 'saddle_' + id, name: saddle.name, desc: saddle.desc, count, isSaddle: true, saddleId: id });
            }
        }
        return [...items, ...saddleItems];
    },

    render(ctx) {
        if (!this.active) return;

        if (this.forgeMode) {
            this.renderForge(ctx);
            return;
        }

        if (this.equipMode) {
            this.renderEquip(ctx);
            return;
        }

        if (this.subMenu === 'dragons') {
            this.renderDragonsMenu(ctx);
            return;
        }

        if (this.subMenu === 'bag') {
            this.renderBag(ctx);
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

        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(1.5, 1.5, SCREEN_W - 3, SCREEN_H - 3);

        if (party.length === 0) {
            Sprites.drawText(ctx, 'No dragons yet!', 40, 66, COLORS.GRAY);
            Sprites.drawText(ctx, 'X:BACK', 60, SCREEN_H - 14, COLORS.GRAY);
            return;
        }

        const dragon = party[this.selectedDragon];
        const species = dragon.species;
        const typeColor = this.getTypeColor(species.type);

        // Top header bar
        ctx.fillStyle = typeColor;
        ctx.fillRect(2, 2, SCREEN_W - 4, 2);

        // Page indicator
        const pageText = (this.selectedDragon + 1) + '/' + party.length;
        Sprites.drawText(ctx, pageText, SCREEN_W - Sprites.textWidth(pageText) - 6, 7, COLORS.GRAY);

        // Dragon name
        Sprites.drawText(ctx, species.name.toUpperCase(), 6, 7, COLORS.TEXT);

        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(4, 16, SCREEN_W - 8, 1);

        // Dragon sprite
        const sprite = Sprites.get(dragon.speciesId + '_front');
        if (sprite) {
            ctx.drawImage(sprite, 4, 20, 48, 48);
        }

        // Type badge
        ctx.fillStyle = typeColor;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(6, 70, 44, 10);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = typeColor;
        ctx.fillRect(6, 70, 1, 10);
        const typeLabel = species.type.toUpperCase();
        const typeLabelX = 6 + Math.floor((44 - Sprites.textWidth(typeLabel)) / 2);
        Sprites.drawText(ctx, typeLabel, typeLabelX, 72, typeColor);

        // Saddle indicator
        if (dragon.saddle) {
            const saddleName = SADDLES[dragon.saddle] ? SADDLES[dragon.saddle].name : 'Unknown';
            Sprites.drawText(ctx, saddleName, 6, 82, '#e8d040');
        }

        // Stats panel
        const statX = 56;
        Sprites.drawText(ctx, 'LV ' + dragon.level, statX, 20, COLORS.TEXT);

        // XP bar
        Sprites.drawText(ctx, 'XP', statX, 29, COLORS.GRAY);
        const xpBarX = statX + 18;
        const xpBarW = SCREEN_W - xpBarX - 6;
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
        Sprites.drawText(ctx, xpText, xpBarX + Math.floor((xpBarW - Sprites.textWidth(xpText)) / 2), 30, COLORS.TEXT);

        // HP bar
        Sprites.drawText(ctx, 'HP', statX, 40, COLORS.GRAY);
        const hpBarX = statX + 18;
        const hpBarW = SCREEN_W - hpBarX - 6;
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
        Sprites.drawText(ctx, hpText, hpBarX + Math.floor((hpBarW - Sprites.textWidth(hpText)) / 2), 41, COLORS.TEXT);

        // Stat bars
        const statBarStartY = 51;
        const statBarSpacing = 10;
        const statLabels = ['ATK', 'DEF', 'SPD'];
        const statValues = [dragon.stats.attack, dragon.stats.defense, dragon.stats.speed];
        const statColors = ['#e86040', '#50a0e8', '#40c870'];
        const maxStatForBar = 50;

        for (let i = 0; i < 3; i++) {
            const sy = statBarStartY + i * statBarSpacing;
            Sprites.drawText(ctx, statLabels[i], statX, sy, COLORS.GRAY);
            const barX = statX + 24;
            const barW = SCREEN_W - barX - 30;
            const statBarH = 7;

            ctx.fillStyle = COLORS.BLACK;
            ctx.fillRect(barX, sy, barW, statBarH);
            ctx.strokeStyle = COLORS.GRAY;
            ctx.strokeRect(barX + 0.5, sy + 0.5, barW - 1, statBarH - 1);

            const ratio = Math.min(statValues[i] / maxStatForBar, 1);
            if (ratio > 0) {
                ctx.fillStyle = statColors[i];
                ctx.fillRect(barX + 1, sy + 1, Math.floor((barW - 2) * ratio), statBarH - 2);
            }
            Sprites.drawText(ctx, '' + statValues[i], barX + barW + 3, sy, COLORS.TEXT);
        }

        // Moves section
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

            ctx.fillStyle = moveTypeColor;
            ctx.fillRect(6, my + 2, 3, 3);
            Sprites.drawText(ctx, moveData.name, 12, my, moveTypeColor);

            const pwrText = 'P:' + moveData.power;
            Sprites.drawText(ctx, pwrText, SCREEN_W - 60, my, COLORS.GRAY);

            const ppText = move.currentPp + '/' + move.maxPp;
            const ppX = SCREEN_W - Sprites.textWidth(ppText) - 6;
            const ppRatio = move.maxPp > 0 ? move.currentPp / move.maxPp : 0;
            let ppColor = COLORS.TEXT;
            if (ppRatio <= 0.25) ppColor = COLORS.HP_RED;
            else if (ppRatio <= 0.5) ppColor = COLORS.HP_YELLOW;
            Sprites.drawText(ctx, ppText, ppX, my, ppColor);
        }

        for (let i = dragon.moves.length; i < 4; i++) {
            const my = moveStartY + i * moveLineH;
            Sprites.drawText(ctx, '---', 12, my, COLORS.GRAY);
        }

        // Bottom bar
        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(4, SCREEN_H - 14, SCREEN_W - 8, 1);
        if (party.length > 1) {
            Sprites.drawText(ctx, 'U/D:SWITCH', 6, SCREEN_H - 10, COLORS.GRAY);
        }
        Sprites.drawText(ctx, 'X:BACK', SCREEN_W - Sprites.textWidth('X:BACK') - 6, SCREEN_H - 10, COLORS.GRAY);

        ctx.fillStyle = typeColor;
        ctx.fillRect(2, SCREEN_H - 4, SCREEN_W - 4, 2);
    },

    renderBag(ctx) {
        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(1.5, 1.5, SCREEN_W - 3, SCREEN_H - 3);

        Sprites.drawText(ctx, 'UTILITY BELT', 6, 6, '#e8a030');
        ctx.fillStyle = '#e8a030';
        ctx.fillRect(4, 14, SCREEN_W - 8, 1);

        const allItems = this._getAllBagItems();

        if (allItems.length === 0) {
            Sprites.drawText(ctx, 'Nothing here yet!', 6, 30, COLORS.GRAY);
            Sprites.drawText(ctx, 'Defeat dragons and', 6, 42, COLORS.GRAY);
            Sprites.drawText(ctx, 'explore to find items.', 6, 54, COLORS.GRAY);
        } else {
            const startY = 20;
            const lineH = 12;
            const maxVisible = Math.floor((SCREEN_H - 40) / lineH);

            for (let i = 0; i < Math.min(allItems.length, maxVisible); i++) {
                const item = allItems[i];
                const y = startY + i * lineH;

                if (i === this.selectedBagItem) {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect(4, y - 1, SCREEN_W - 8, lineH);
                    Sprites.drawText(ctx, '>', 6, y, COLORS.WHITE);
                }

                const nameColor = item.isSaddle ? '#e8d040' : COLORS.TEXT;
                Sprites.drawText(ctx, item.name, 16, y, nameColor);
                Sprites.drawText(ctx, 'x' + item.count, SCREEN_W - 24, y, COLORS.GRAY);
            }

            // Selected item description
            if (allItems[this.selectedBagItem]) {
                const desc = allItems[this.selectedBagItem].desc;
                ctx.fillStyle = COLORS.GRAY;
                ctx.fillRect(4, SCREEN_H - 26, SCREEN_W - 8, 1);
                Sprites.drawText(ctx, desc, 6, SCREEN_H - 22, COLORS.GRAY);

                if (allItems[this.selectedBagItem].isSaddle) {
                    Sprites.drawText(ctx, 'Z:EQUIP', 6, SCREEN_H - 10, COLORS.TEXT);
                }
            }
        }

        Sprites.drawText(ctx, 'X:BACK', SCREEN_W - Sprites.textWidth('X:BACK') - 6, SCREEN_H - 10, COLORS.GRAY);
    },

    renderForge(ctx) {
        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(1.5, 1.5, SCREEN_W - 3, SCREEN_H - 3);

        Sprites.drawText(ctx, "GOBBER'S FORGE", 6, 6, '#e84420');
        ctx.fillStyle = '#e84420';
        ctx.fillRect(4, 14, SCREEN_W - 8, 1);

        const recipes = Forge.getRecipes();
        const startY = 20;
        const lineH = 28;

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const y = startY + i * lineH;

            if (i === this.selectedRecipe) {
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fillRect(4, y - 1, SCREEN_W - 8, lineH);
                Sprites.drawText(ctx, '>', 6, y, COLORS.WHITE);
            }

            const nameColor = recipe.canCraft ? '#e8d040' : COLORS.GRAY;
            Sprites.drawText(ctx, recipe.name, 16, y, nameColor);
            Sprites.drawText(ctx, recipe.desc, 16, y + 9, COLORS.GRAY);

            // Show ingredients
            let ingX = 16;
            const ingY = y + 18;
            for (const [itemId, needed] of Object.entries(recipe.recipe)) {
                const itemName = ITEMS[itemId] ? ITEMS[itemId].name : itemId;
                const have = Inventory.getCount(itemId);
                const color = have >= needed ? COLORS.HP_GREEN : COLORS.HP_RED;
                const text = itemName + ':' + have + '/' + needed;
                Sprites.drawText(ctx, text, ingX, ingY, color);
                ingX += Sprites.textWidth(text) + 8;
            }
        }

        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(4, SCREEN_H - 14, SCREEN_W - 8, 1);
        Sprites.drawText(ctx, 'Z:CRAFT', 6, SCREEN_H - 10, COLORS.TEXT);
        Sprites.drawText(ctx, 'X:BACK', SCREEN_W - Sprites.textWidth('X:BACK') - 6, SCREEN_H - 10, COLORS.GRAY);
    },

    renderEquip(ctx) {
        ctx.fillStyle = COLORS.MENU_BG;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        ctx.strokeStyle = COLORS.MENU_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(1.5, 1.5, SCREEN_W - 3, SCREEN_H - 3);

        Sprites.drawText(ctx, 'EQUIP TO WHICH DRAGON?', 6, 6, '#e8d040');
        ctx.fillStyle = '#e8d040';
        ctx.fillRect(4, 14, SCREEN_W - 8, 1);

        const party = Game.player.party;
        for (let i = 0; i < party.length; i++) {
            const dragon = party[i];
            const y = 24 + i * 24;

            if (i === this.selectedEquipDragon) {
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fillRect(4, y - 2, SCREEN_W - 8, 22);
                Sprites.drawText(ctx, '>', 6, y, COLORS.WHITE);
            }

            Sprites.drawText(ctx, dragon.species.name, 16, y, COLORS.TEXT);
            Sprites.drawText(ctx, 'Lv' + dragon.level, 16, y + 10, COLORS.GRAY);

            if (dragon.saddle) {
                const saddleName = SADDLES[dragon.saddle] ? SADDLES[dragon.saddle].name : '?';
                Sprites.drawText(ctx, 'Saddle: ' + saddleName, SCREEN_W / 2, y, '#e8d040');
            } else {
                Sprites.drawText(ctx, 'No saddle', SCREEN_W / 2, y, COLORS.GRAY);
            }
        }

        Sprites.drawText(ctx, 'Z:EQUIP', 6, SCREEN_H - 10, COLORS.TEXT);
        Sprites.drawText(ctx, 'X:BACK', SCREEN_W - Sprites.textWidth('X:BACK') - 6, SCREEN_H - 10, COLORS.GRAY);
    },

    openForge() {
        this.active = true;
        this.forgeMode = true;
        this.selectedRecipe = 0;
        GameAudio.sfx.menuOpen();
        Game.pushState(GameState.MENU);
    },

    getTypeColor(type) {
        const colors = { fire: COLORS.FIRE, ice: COLORS.ICE, lightning: COLORS.LIGHTNING, earth: COLORS.EARTH };
        return colors[type] || COLORS.TEXT;
    }
};
