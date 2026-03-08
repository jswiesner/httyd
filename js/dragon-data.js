// Dragon species and moves data
const MOVES = {
    // Fire moves
    flame_spit:    { name: 'Flame Spit',    type: 'fire',      power: 20, accuracy: 100, pp: 25, desc: 'A small burst of flame.' },
    flame_breath:  { name: 'Flame Breath',  type: 'fire',      power: 35, accuracy: 95,  pp: 15, desc: 'Breathes a stream of fire.' },
    inferno:       { name: 'Inferno',       type: 'fire',      power: 50, accuracy: 85,  pp: 8,  desc: 'Engulfs foe in flames.' },
    flame_swarm:   { name: 'Flame Swarm',   type: 'fire',      power: 40, accuracy: 90,  pp: 10, desc: 'A swarm of fiery sparks.' },
    glow_burst:    { name: 'Glow Burst',    type: 'fire',      power: 30, accuracy: 100, pp: 15, desc: 'A brilliant flash of heat.' },
    gas_cloud:     { name: 'Gas Cloud',     type: 'fire',      power: 25, accuracy: 95,  pp: 20, desc: 'Releases flammable gas.' },
    spark_ignite:  { name: 'Spark Ignite',  type: 'fire',      power: 45, accuracy: 85,  pp: 10, desc: 'Ignites gas with a spark.' },

    // Lightning moves
    plasma_blast:  { name: 'Plasma Blast',  type: 'lightning',  power: 45, accuracy: 90,  pp: 10, desc: 'A bolt of purple plasma.' },
    plasma_bolt:   { name: 'Plasma Bolt',   type: 'lightning',  power: 40, accuracy: 95,  pp: 12, desc: 'A quick plasma shot.' },
    storm_breath:  { name: 'Storm Breath',  type: 'lightning',  power: 50, accuracy: 85,  pp: 8,  desc: 'Breathes lightning.' },

    // Earth moves
    rock_throw:    { name: 'Rock Throw',    type: 'earth',     power: 30, accuracy: 100, pp: 20, desc: 'Hurls a rock at the foe.' },
    lava_burst:    { name: 'Lava Burst',    type: 'earth',     power: 40, accuracy: 90,  pp: 12, desc: 'Spews molten rock.' },
    tail_blade:    { name: 'Tail Blade',    type: 'earth',     power: 40, accuracy: 85,  pp: 12, desc: 'Slashes with a metal tail.' },
    metal_wing:    { name: 'Metal Wing',    type: 'earth',     power: 35, accuracy: 95,  pp: 15, desc: 'Strikes with iron wings.' },

    // Ice moves
    frost_breath:  { name: 'Frost Breath',  type: 'ice',       power: 35, accuracy: 95,  pp: 15, desc: 'A chilling breath.' },
    ice_spike:     { name: 'Ice Spike',     type: 'ice',       power: 45, accuracy: 85,  pp: 10, desc: 'Launches ice shards.' },

    // Neutral moves
    scratch:       { name: 'Scratch',       type: 'earth',     power: 15, accuracy: 100, pp: 30, desc: 'A basic scratch attack.' },
    tail_whip:     { name: 'Tail Whip',     type: 'earth',     power: 18, accuracy: 100, pp: 25, desc: 'Strikes with the tail.' },
    wing_slash:    { name: 'Wing Slash',    type: 'fire',      power: 30, accuracy: 95,  pp: 15, desc: 'Slashes with fiery wings.' },
    spine_shot:    { name: 'Spine Shot',    type: 'earth',     power: 35, accuracy: 90,  pp: 15, desc: 'Fires sharp spines.' },
    shadow_dive:   { name: 'Shadow Dive',   type: 'lightning',  power: 50, accuracy: 80,  pp: 8,  desc: 'Vanishes, then strikes.' },
    vanish_strike: { name: 'Vanish Strike', type: 'lightning',  power: 45, accuracy: 85,  pp: 10, desc: 'A swift invisible blow.' },
    four_wing_slash: { name: 'Quad Slash',  type: 'earth',     power: 45, accuracy: 88,  pp: 10, desc: 'Slashes with four wings.' },
};

const DRAGON_SPECIES = {
    terrible_terror: {
        name: 'Terrible Terror',
        type: 'fire',
        baseHp: 20,
        baseAtk: 6,
        baseDef: 5,
        baseSpd: 10,
        tameDifficulty: 0.30,
        learnedMoves: ['flame_spit', 'scratch'],
        evolvedMoves: { 8: 'flame_breath' },
        desc: 'A tiny but fierce fire dragon. Easy to tame.',
        xpYield: 30,
    },
    gronckle: {
        name: 'Gronckle',
        type: 'earth',
        baseHp: 35,
        baseAtk: 8,
        baseDef: 14,
        baseSpd: 4,
        tameDifficulty: 0.20,
        learnedMoves: ['rock_throw', 'lava_burst'],
        evolvedMoves: { 10: 'tail_whip' },
        desc: 'A tough boulder-like dragon. Very defensive.',
        xpYield: 50,
    },
    deadly_nadder: {
        name: 'Deadly Nadder',
        type: 'fire',
        baseHp: 28,
        baseAtk: 12,
        baseDef: 8,
        baseSpd: 11,
        tameDifficulty: 0.15,
        learnedMoves: ['spine_shot', 'flame_breath'],
        evolvedMoves: { 10: 'wing_slash' },
        desc: 'A colorful and agile dragon with sharp spines.',
        xpYield: 60,
    },
    monstrous_nightmare: {
        name: 'M. Nightmare',
        type: 'fire',
        baseHp: 38,
        baseAtk: 15,
        baseDef: 7,
        baseSpd: 8,
        tameDifficulty: 0.12,
        learnedMoves: ['inferno', 'wing_slash'],
        evolvedMoves: { 12: 'flame_breath' },
        desc: 'A fearsome dragon that sets itself on fire.',
        xpYield: 80,
    },
    hideous_zippleback: {
        name: 'H. Zippleback',
        type: 'fire',
        baseHp: 32,
        baseAtk: 11,
        baseDef: 10,
        baseSpd: 6,
        tameDifficulty: 0.15,
        learnedMoves: ['gas_cloud', 'spark_ignite'],
        evolvedMoves: { 10: 'flame_breath' },
        desc: 'A two-headed dragon. One head sprays gas, the other ignites it.',
        xpYield: 65,
    },
    razorwhip: {
        name: 'Razorwhip',
        type: 'earth',
        baseHp: 30,
        baseAtk: 13,
        baseDef: 12,
        baseSpd: 9,
        tameDifficulty: 0.12,
        learnedMoves: ['tail_blade', 'metal_wing'],
        evolvedMoves: { 12: 'spine_shot' },
        desc: 'A metallic dragon with a razor-sharp tail.',
        xpYield: 75,
    },
    fireworm: {
        name: 'Fireworm Queen',
        type: 'fire',
        baseHp: 25,
        baseAtk: 14,
        baseDef: 6,
        baseSpd: 12,
        tameDifficulty: 0.18,
        learnedMoves: ['flame_swarm', 'glow_burst'],
        evolvedMoves: { 10: 'inferno' },
        desc: 'A glowing dragon queen. Small but powerful.',
        xpYield: 60,
    },
    stormcutter: {
        name: 'Stormcutter',
        type: 'lightning',
        baseHp: 34,
        baseAtk: 13,
        baseDef: 11,
        baseSpd: 10,
        tameDifficulty: 0.08,
        learnedMoves: ['storm_breath', 'four_wing_slash'],
        evolvedMoves: { 14: 'plasma_bolt' },
        desc: 'A majestic four-winged dragon of storms.',
        xpYield: 100,
    },
    light_fury: {
        name: 'Light Fury',
        type: 'lightning',
        baseHp: 32,
        baseAtk: 12,
        baseDef: 10,
        baseSpd: 16,
        tameDifficulty: 0.06,
        learnedMoves: ['plasma_bolt', 'vanish_strike'],
        evolvedMoves: { 15: 'plasma_blast' },
        desc: 'A radiant, elusive dragon. Incredibly fast.',
        xpYield: 120,
    },
    night_fury: {
        name: 'Night Fury',
        type: 'lightning',
        baseHp: 35,
        baseAtk: 14,
        baseDef: 11,
        baseSpd: 18,
        tameDifficulty: 0.04,
        learnedMoves: ['plasma_blast', 'shadow_dive'],
        evolvedMoves: { 15: 'storm_breath' },
        desc: 'The rarest dragon. Speed and power unmatched.',
        xpYield: 150,
    },
};

// Helper to create a dragon instance at a given level
function createDragonInstance(speciesId, level) {
    const species = DRAGON_SPECIES[speciesId];
    const statScale = 1 + level * 0.1;
    const maxHp = Math.floor(species.baseHp * statScale);
    const moves = species.learnedMoves.slice();

    // Add evolved moves if level is high enough
    for (const [lvl, move] of Object.entries(species.evolvedMoves)) {
        if (level >= parseInt(lvl) && moves.length < 4) {
            moves.push(move);
        }
    }

    return {
        speciesId: speciesId,
        species: species,
        level: level,
        currentHp: maxHp,
        maxHp: maxHp,
        stats: {
            attack: Math.floor(species.baseAtk * statScale),
            defense: Math.floor(species.baseDef * statScale),
            speed: Math.floor(species.baseSpd * statScale),
        },
        moves: moves.map(m => ({
            id: m,
            currentPp: MOVES[m].pp,
            maxPp: MOVES[m].pp,
        })),
        xp: 0,
        xpToNext: Math.floor(50 * Math.pow(1.2, level - 1)),
    };
}

// Recalculate stats for a level-up
function recalcStats(dragon) {
    const species = DRAGON_SPECIES[dragon.speciesId];
    const statScale = 1 + dragon.level * 0.1;
    const oldMaxHp = dragon.maxHp;
    dragon.maxHp = Math.floor(species.baseHp * statScale);
    dragon.currentHp += dragon.maxHp - oldMaxHp;
    dragon.stats.attack = Math.floor(species.baseAtk * statScale);
    dragon.stats.defense = Math.floor(species.baseDef * statScale);
    dragon.stats.speed = Math.floor(species.baseSpd * statScale);

    // Learn new moves
    for (const [lvl, move] of Object.entries(species.evolvedMoves)) {
        if (dragon.level >= parseInt(lvl)) {
            const hasMoveAlready = dragon.moves.some(m => m.id === move);
            if (!hasMoveAlready && dragon.moves.length < 4) {
                dragon.moves.push({ id: move, currentPp: MOVES[move].pp, maxPp: MOVES[move].pp });
            }
        }
    }
}
