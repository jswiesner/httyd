// Dragon Sanctuary - storage system for extra tamed dragons
const Sanctuary = {
    stored: [], // Array of dragon objects stored in the sanctuary
    maxStorage: 10,

    deposit(dragon, partyIndex) {
        if (this.stored.length >= this.maxStorage) return false;
        if (Game.player.party.length <= 1) return false; // Must keep at least 1
        this.stored.push(dragon);
        Game.player.removeFromParty(partyIndex);
        CompanionSystem.snapAll(Game.player);
        return true;
    },

    withdraw(storageIndex) {
        if (storageIndex < 0 || storageIndex >= this.stored.length) return false;
        if (Game.player.party.length >= MAX_PARTY) return false;
        const dragon = this.stored.splice(storageIndex, 1)[0];
        Game.player.addToParty(dragon);
        CompanionSystem.snapAll(Game.player);
        return true;
    },

    // Store a newly tamed dragon directly (when party is full)
    storeDirectly(dragon) {
        if (this.stored.length >= this.maxStorage) return false;
        this.stored.push(dragon);
        return true;
    },

    getSaveData() {
        return this.stored.map(d => ({
            speciesId: d.speciesId,
            level: d.level,
            currentHp: d.currentHp,
            maxHp: d.maxHp,
            stats: { ...d.stats },
            moves: d.moves.map(m => ({ id: m.id, currentPp: m.currentPp, maxPp: m.maxPp })),
            xp: d.xp,
            xpToNext: d.xpToNext,
            saddle: d.saddle || null,
        }));
    },

    loadSaveData(data) {
        this.stored = (data || []).map(d => ({
            speciesId: d.speciesId,
            species: DRAGON_SPECIES[d.speciesId],
            level: d.level,
            currentHp: d.currentHp,
            maxHp: d.maxHp,
            stats: d.stats,
            moves: d.moves,
            xp: d.xp,
            xpToNext: d.xpToNext,
            saddle: d.saddle || null,
        }));
    },
};
