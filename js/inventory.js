// Inventory & Crafting system
const Inventory = {
    items: {},           // { itemId: count }
    collectedItems: {},  // tracks which ground items have been picked up: { 'mapId_x_y': true }

    addItem(itemId, count) {
        count = count || 1;
        this.items[itemId] = (this.items[itemId] || 0) + count;
    },

    removeItem(itemId, count) {
        count = count || 1;
        if (this.items[itemId]) {
            this.items[itemId] -= count;
            if (this.items[itemId] <= 0) {
                delete this.items[itemId];
            }
            return true;
        }
        return false;
    },

    getCount(itemId) {
        return this.items[itemId] || 0;
    },

    hasItems(recipe) {
        for (const [itemId, needed] of Object.entries(recipe)) {
            if (this.getCount(itemId) < needed) return false;
        }
        return true;
    },

    consumeRecipe(recipe) {
        if (!this.hasItems(recipe)) return false;
        for (const [itemId, needed] of Object.entries(recipe)) {
            this.removeItem(itemId, needed);
        }
        return true;
    },

    // Get all items as an array for display
    getItemList() {
        const list = [];
        for (const [id, count] of Object.entries(this.items)) {
            const item = ITEMS[id];
            if (item) {
                list.push({ id, name: item.name, desc: item.desc, count });
            }
        }
        return list;
    },

    // Check if player stepped on a ground item
    checkGroundItem(mapId, x, y) {
        const key = mapId + '_' + x + '_' + y;
        if (this.collectedItems[key]) return null;

        const map = MAP_DATA[mapId];
        if (!map || !map.groundItems) return null;

        for (const gi of map.groundItems) {
            if (gi.x === x && gi.y === y) {
                this.collectedItems[key] = true;
                this.addItem(gi.itemId, 1);
                return gi.itemId;
            }
        }
        return null;
    },

    // Dragon drop items after battle victory
    getDropFromBattle(speciesId) {
        // Dragons drop scales; some drop other materials
        const roll = Math.random();
        if (roll < 0.4) {
            return 'dragon_scales';
        }
        if (roll < 0.55 && (speciesId === 'razorwhip' || speciesId === 'gronckle')) {
            return 'iron_ore';
        }
        if (roll < 0.55) {
            return 'leather';
        }
        return null;
    },

    // Equip saddle to a dragon
    equipSaddle(dragon, saddleId) {
        dragon.saddle = saddleId;
    },

    // Check if a dragon has a specific saddle effect
    hasSaddleEffect(dragon, effect) {
        if (!dragon.saddle) return false;
        const saddle = SADDLES[dragon.saddle];
        return saddle && saddle.effect === effect;
    },
};

// Forge system - crafting saddles
const Forge = {
    active: false,
    selectedRecipe: 0,

    getRecipes() {
        const recipes = [];
        for (const [id, saddle] of Object.entries(SADDLES)) {
            recipes.push({
                id,
                name: saddle.name,
                desc: saddle.desc,
                recipe: saddle.recipe,
                canCraft: Inventory.hasItems(saddle.recipe),
            });
        }
        return recipes;
    },

    craft(saddleId) {
        const saddle = SADDLES[saddleId];
        if (!saddle) return false;
        if (!Inventory.consumeRecipe(saddle.recipe)) return false;
        // Add the saddle as a craftable item to equip later
        Inventory.addItem('saddle_' + saddleId, 1);
        return true;
    },
};
