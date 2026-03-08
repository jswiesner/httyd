// Map definitions - all 7 game areas
// Tile legend for ground layers:
//   g=grass, G=tall_grass, d=dirt, p=path, w=water, s=sand, S=stone
//   T=tree_trunk, t=tree_top, H=house_wall, R=house_roof, D=house_door
//   n=snow, N=snow_tree, C=cave_floor, W=cave_wall, L=lava
//   K=crystal_floor, Z=crystal_wall, k=dock, f=flower_grass, F=waterfall
//   v=stone_wall

const TILE_LOOKUP = {
    'g': { ground: 'grass', collision: TILE.WALKABLE },
    'G': { ground: 'tall_grass', collision: TILE.ENCOUNTER_GRASS },
    'd': { ground: 'dirt', collision: TILE.WALKABLE },
    'p': { ground: 'path', collision: TILE.WALKABLE },
    'w': { ground: 'water', collision: TILE.WATER },
    's': { ground: 'sand', collision: TILE.WALKABLE },
    'S': { ground: 'stone', collision: TILE.WALKABLE },
    'T': { ground: 'tree_trunk', collision: TILE.SOLID },
    't': { ground: 'tree_top', collision: TILE.SOLID },
    'H': { ground: 'house_wall', collision: TILE.SOLID },
    'R': { ground: 'house_roof', collision: TILE.SOLID },
    'D': { ground: 'house_door', collision: TILE.WALKABLE },
    'n': { ground: 'snow', collision: TILE.WALKABLE },
    'N': { ground: 'snow_tree', collision: TILE.SOLID },
    'C': { ground: 'cave_floor', collision: TILE.WALKABLE },
    'W': { ground: 'cave_wall', collision: TILE.SOLID },
    'L': { ground: 'lava', collision: TILE.SOLID },
    'K': { ground: 'crystal_floor', collision: TILE.WALKABLE },
    'Z': { ground: 'crystal_wall', collision: TILE.SOLID },
    'k': { ground: 'dock', collision: TILE.WALKABLE },
    'f': { ground: 'flower_grass', collision: TILE.WALKABLE },
    'F': { ground: 'waterfall', collision: TILE.SOLID },
    'v': { ground: 'stone_wall', collision: TILE.SOLID },
    'E': { ground: 'tall_grass', collision: TILE.ENCOUNTER_GRASS }, // encounter alias
};

function parseMap(mapStr, width) {
    const chars = mapStr.replace(/\s/g, '');
    const height = Math.floor(chars.length / width);
    const ground = [];
    const collisions = [];
    for (let i = 0; i < width * height; i++) {
        const ch = chars[i] || 'g';
        const tile = TILE_LOOKUP[ch] || TILE_LOOKUP['g'];
        ground.push(tile.ground);
        collisions.push(tile.collision);
    }
    return { ground, collisions, width, height };
}

// ========== MAP DATA ==========

const MAP_DATA = {};

// --- BERK VILLAGE (30x20) ---
MAP_DATA.berk_village = (() => {
    const m = parseMap(
        'tttttwwwwwwttttttggggggggggtttt' +
        'tTTTtwwwwwwtTTTTtggggggggggtttt' +
        'ggggggwwwwwgggggggggggggggggTtt' +
        'ggRRRgwwwwwgRRRggggRRRggggggggg' +
        'ggHHHgkkkkkgHHHggggHHHggggggggg' +
        'ggHDHgkkkkkgHDHggggHDHggggggggg' +
        'ggpppgkkkkkgppppppppppggggggggg' +
        'ggpppgkkkkkgggppppppppggggggggg' +
        'ggpppgkkkkkgggppggggppggggggggg' +
        'ppppppkkkkkgggppggggppggggTTggg' +
        'ppppppppppppppppggggppggggggggg' +
        'ppppppppppppppppggggppggggggggg' +
        'ggpppgggggggggppggggppppppggggg' +
        'ggpppgggRRRgggppggggggggppggggg' +
        'ggpppgggHHHgggppggggTTggppggggg' +
        'ggpppgggHDHgggppggggggggppggggg' +
        'ggpppgggpppggpppgggggggpppggggg' +
        'ggggggggpppggpppggggggppppggggg' +
        'ggggggggggggggggggggppppggggGGG' +
        'ggggggggggggggggggggppggggggGGG',
        30
    );
    return {
        ...m,
        name: 'Berk Village',
        encounterRate: 0,
        encounters: [],
        npcs: [
            { id: 'stoick', x: 14, y: 6, spriteId: 'npc_chief', dialogue: 'stoick_intro', direction: DIR.DOWN },
            { id: 'healer', x: 4, y: 5, spriteId: 'npc_healer', dialogue: 'healer_talk', direction: DIR.DOWN },
            { id: 'trader', x: 20, y: 6, spriteId: 'npc_trader', dialogue: 'trader_talk', direction: DIR.LEFT },
            { id: 'elder', x: 11, y: 15, spriteId: 'npc_elder', dialogue: 'elder_talk', direction: DIR.DOWN },
            { id: 'child', x: 22, y: 10, spriteId: 'npc_guide', dialogue: 'berk_child', direction: DIR.LEFT },
            { id: 'fisherman', x: 8, y: 7, spriteId: 'npc_trader', dialogue: 'dock_fisherman', direction: DIR.RIGHT },
        ],
        warps: [
            { x: 0, y: 9, targetMap: 'forest_path', targetX: 29, targetY: 10 },
            { x: 0, y: 10, targetMap: 'forest_path', targetX: 29, targetY: 11 },
            { x: 29, y: 18, targetMap: 'dragon_island', targetX: 0, targetY: 15 },
            { x: 29, y: 19, targetMap: 'dragon_island', targetX: 0, targetY: 16 },
        ],
        playerStart: { x: 14, y: 10 },
    };
})();

// --- FOREST PATH (30x25) ---
MAP_DATA.forest_path = (() => {
    const m = parseMap(
        'ttttttttttGGGGGGtttttttttttttt' +
        'tTTTttTTTGGGGGGtTTTttTTTtttttt' +
        'gggggggggGGGGGGggggggggggtTTTt' +
        'gGGGggGGGGGGGGGgGGGggggggggggg' +
        'gGGGggGGGggggGGgGGGGGggggggggg' +
        'gGGGgggggggggGGgGGGGGGgggTTggg' +
        'gggggTTgpppppGGgggGGGGgggggggg' +
        'gggggggppppppGGgggggGGgggggTTg' +
        'ttggggppppggGGGggggggggggggggg' +
        'tTTgggpppgggGGGGgggggGGGgggggg' +
        'gggggppppgggGGGGggggGGGGGggggg' +
        'ppppppppggggggGGgggGGGGGGGgggg' +
        'ppppppppggTTggGGgggGGGGGGggggg' +
        'gggggpppggggggGGgggggGGGgggggg' +
        'ggGGgppppgggggGGgggggggggTTggg' +
        'gGGGgpppppppppppppppppgggggggg' +
        'gGGGggpppppppppppppppggggggggg' +
        'ggGGgggggppggggggpppggggGGGggg' +
        'gggggTTggppggttggpppgggGGGGggg' +
        'gggggggggppggtTTgpppgggGGGGggg' +
        'ggGGGGggppppgggggppppggggGGggg' +
        'gGGGGGGgpppggGGggppppggggggggg' +
        'gGGGGGggpppggGGGgggppppggggggg' +
        'ggGGGggppppggGGGGggppppppppppp' +
        'gggggggpppgggGGGGGgggggppppppp',
        30
    );
    return {
        ...m,
        name: 'Forest Path',
        encounterRate: 0.08,
        encounters: [
            { dragonId: 'terrible_terror', weight: 50, levelRange: [2, 5] },
            { dragonId: 'gronckle', weight: 25, levelRange: [3, 6] },
            { dragonId: 'deadly_nadder', weight: 10, levelRange: [4, 7] },
        ],
        npcs: [
            { id: 'forest_guide', x: 6, y: 15, spriteId: 'npc_guide', dialogue: 'forest_guide', direction: DIR.RIGHT },
        ],
        warps: [
            { x: 29, y: 10, targetMap: 'berk_village', targetX: 1, targetY: 9 },
            { x: 29, y: 11, targetMap: 'berk_village', targetX: 1, targetY: 10 },
            { x: 0, y: 11, targetMap: 'mountain_pass', targetX: 19, targetY: 24 },
            { x: 0, y: 12, targetMap: 'mountain_pass', targetX: 19, targetY: 25 },
            { x: 29, y: 23, targetMap: 'volcanic_caves', targetX: 1, targetY: 1 },
            { x: 29, y: 24, targetMap: 'volcanic_caves', targetX: 1, targetY: 2 },
        ],
    };
})();

// --- DRAGON ISLAND (25x25) ---
MAP_DATA.dragon_island = (() => {
    const m = parseMap(
        'wwwwwwwwwwwwwSSSSSSSSSSSSSSS' +
        'wwwwwwwwwwwwSSSSvvvvSSSSSSS' +
        'wwwwwwwwwwwSSSSvvvvvSSSSSSS' +
        'wwwwwwwwwwSSSSSSSSSSSSSSSGG' +
        'wwwwwwwwwSSSSSSppppSSSSSGGG' +
        'wwwwwwwwSSSSSSppppppSSSGGGG' +
        'wwwwwwwSSSSGGGppGGppSSSSGGG' +
        'wwwwwwSSSSGGGGppGGGpSSSSSGG' +
        'wwwwwSSSSSGGGGppGGGppSSSSgS' +
        'wwwwSSSSSSGGGppGGGGppSSSSgS' +
        'wwwwSSSSSSGGppGGGGGpSSSSggS' +
        'wwwSSSSSSSSppGGGGGppSSSSggg' +
        'wwSSSSSSSSpppGGGGppSSSSgggg' +
        'wwSSSGGGSSpppppppppSSSSgggg' +
        'wSSSSGGGSSppppppppSSSSSSggg' +
        'pppppppppppppSSSSSSSSSSgggg' +
        'ppppppppppppSSSSSSSSSSSgggg' +
        'wwSSSSSSSSSSSSSSSSvvSSSSggg' +
        'wwwSSSSSSGGGSSSSSvvvvSSSSgg' +
        'wwwwSSSSGGGGGSSSSvvvvSSSggg' +
        'wwwwwSSSGGGGGGSSSSSSSSSSggg' +
        'wwwwwwSSGGGGGSSSSSSSSSSSSSg' +
        'wwwwwwwSSGGGSSSSSSSSSSSSSSS' +
        'wwwwwwwwSSSSSSSSSSSSSSSSSSS' +
        'wwwwwwwwwSSSSSSSSSSSSSSSSSS',
        25
    );
    return {
        ...m,
        name: 'Dragon Island',
        encounterRate: 0.10,
        encounters: [
            { dragonId: 'monstrous_nightmare', weight: 35, levelRange: [6, 10] },
            { dragonId: 'hideous_zippleback', weight: 35, levelRange: [5, 9] },
            { dragonId: 'gronckle', weight: 20, levelRange: [5, 8] },
            { dragonId: 'terrible_terror', weight: 10, levelRange: [4, 7] },
        ],
        npcs: [],
        warps: [
            { x: 0, y: 15, targetMap: 'berk_village', targetX: 28, targetY: 18 },
            { x: 0, y: 16, targetMap: 'berk_village', targetX: 28, targetY: 19 },
        ],
    };
})();

// --- MOUNTAIN PASS (20x30) ---
MAP_DATA.mountain_pass = (() => {
    const m = parseMap(
        'vvvvvvnnnnnnnnvvvvvv' +
        'vvvvnnnnnNnnnnvvvvvv' +
        'vvvnnnnnnnnnnnnnvvvv' +
        'vvnnnGGGnnnNnnnnnvvv' +
        'vvnnnGGGGnnnnnnnnnvv' +
        'vnnnnGGGGGnnnnnnnnvv' +
        'vnnNnnnGGGnnnnnNnnvv' +
        'vnnnnnppppnnnnnnnvvv' +
        'nnnnnpppppnnnGGnvvvv' +
        'nnnnpppppppnnGGGnnvv' +
        'nnnpppnnnnppnGGGnnvv' +
        'nnnppnnnNnnppnGGnnnv' +
        'nNnppnnnnnnppnnnnnnn' +
        'nnnppGGGnnnppnnnnnnn' +
        'nnnppGGGGnnpppnnNnnn' +
        'nnpppGGGGnnppppnnnnn' +
        'nnpppnGGnnnpppppnnnn' +
        'nnppnnnnNnnnnpppnnnn' +
        'npppnnnnnnnnnppppnnn' +
        'nppppnNnnnnnnppppnnn' +
        'npppppnnnGGGnnpppnnn' +
        'nnpppppnnGGGGnpppnNn' +
        'nnnpppppnGGGGnppppnn' +
        'nnnNppppnnnGGnpppppn' +
        'nnnnpppppppppppppppp' +
        'nnnnnppppppppppppppp' +
        'nnNnnnnnnnnnnnnppnnn' +
        'nnnnnGGGnnNnnnppnnnn' +
        'nnnnGGGGGnnnnnppnnnn' +
        'nnnnnGGGnnnnnnppnnnn',
        20
    );
    return {
        ...m,
        name: 'Mountain Pass',
        encounterRate: 0.07,
        encounters: [
            { dragonId: 'deadly_nadder', weight: 40, levelRange: [7, 11] },
            { dragonId: 'razorwhip', weight: 35, levelRange: [8, 12] },
            { dragonId: 'gronckle', weight: 15, levelRange: [6, 9] },
            { dragonId: 'terrible_terror', weight: 10, levelRange: [5, 8] },
        ],
        npcs: [
            { id: 'mountain_guide', x: 10, y: 7, spriteId: 'npc_guide', dialogue: 'mountain_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 19, y: 24, targetMap: 'forest_path', targetX: 1, targetY: 11 },
            { x: 19, y: 25, targetMap: 'forest_path', targetX: 1, targetY: 12 },
            { x: 19, y: 28, targetMap: 'hidden_world', targetX: 1, targetY: 1 },
            { x: 19, y: 29, targetMap: 'hidden_world', targetX: 1, targetY: 2 },
        ],
    };
})();

// --- VOLCANIC CAVES (25x20) ---
MAP_DATA.volcanic_caves = (() => {
    const m = parseMap(
        'WWWWWWWWWWWWWWWWWWWWWWWWW' +
        'WCCCCCCWWWWWCCCCCCWWWWWWW' +
        'WCCCCCCCWWWCCCCCCCCWWWWWW' +
        'WCCCLLCCCCCCCCLLCCCCCWWWW' +
        'WCCCLLCCCCCCCCLLCCCCCCWWW' +
        'WCCCCCCGGGCCCCCCGGGCCWWW' +
        'WCCCCCCGGGCCCCCGGGCCCCWW' +
        'WCCCCCCCGCCCCCCCCGCCCCCW' +
        'WCCCCCCCCCCWWCCCCCCCCCCW' +
        'WCCGGCCCCWWWWWCCCGGCCCWW' +
        'WCCGGCCCWWWWWWCCCGGCCWWW' +
        'WCCCCCCCCCWWCCCCCCCCCCWW' +
        'WCCCCLLCCCCCCCCLLCCCCCWW' +
        'WCCCCLLLCCCCCCLLLLCCCCWW' +
        'WCCCCLLCCCGGCCCLLCCCCCWW' +
        'WCCCCCCCCGGGGCCCCCCCCCCW' +
        'WCCCCCCCCCGGCCCCCCCCCCCW' +
        'WCCCCCCCCCCCCCCCCCCGGGCW' +
        'WWCCCCCCCCCCCCCCCCGGGCCW' +
        'WWWWWWWWWWWWWWWWWWWWWWWW',
        25
    );
    return {
        ...m,
        name: 'Volcanic Caves',
        encounterRate: 0.12,
        encounters: [
            { dragonId: 'monstrous_nightmare', weight: 30, levelRange: [8, 13] },
            { dragonId: 'fireworm', weight: 35, levelRange: [7, 11] },
            { dragonId: 'gronckle', weight: 20, levelRange: [7, 10] },
            { dragonId: 'terrible_terror', weight: 15, levelRange: [5, 8] },
        ],
        npcs: [
            { id: 'cave_guide', x: 5, y: 2, spriteId: 'npc_guide', dialogue: 'cave_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 1, y: 1, targetMap: 'forest_path', targetX: 28, targetY: 23 },
            { x: 1, y: 2, targetMap: 'forest_path', targetX: 28, targetY: 24 },
            { x: 23, y: 17, targetMap: 'dragon_sanctuary', targetX: 1, targetY: 10 },
            { x: 23, y: 18, targetMap: 'dragon_sanctuary', targetX: 1, targetY: 11 },
        ],
    };
})();

// --- HIDDEN WORLD (25x20) ---
MAP_DATA.hidden_world = (() => {
    const m = parseMap(
        'ZZZZZZZZZZZZZZZZZZZZZZZZZ' +
        'ZKKKKKKZZZZKKKKKKZZZZKKZZ' +
        'ZKKKKKKKKZKKKKKKKKZKKKKZZ' +
        'ZKKKGGKKKKKKKGGKKKKKKKKZZ' +
        'ZKKGGGGKKKKKGGGGGKKKKKKZZ' +
        'ZKKGGGGKZKKKKGGGKKKGGKKZZ' +
        'ZKKKGGKZZZKKKKKKKKGGGGKZZ' +
        'ZKKKKKKZZZKKKKKKKKKGGKKZZ' +
        'ZKKKKKKZZZZKKKKKKKKKKKKZZ' +
        'ZZKKKKZZZZZZKKKKKKKKKKKZZ' +
        'ZZZKKKKKZZZKKKKGGKKKKKKZZ' +
        'ZZKKKKKKKZKKKKGGGKKKKKKZZ' +
        'ZZKKGGKKKKKKKGGGKKKKKKZZZ' +
        'ZKKGGGKKKKKKKKGKKKKKKKZZZ' +
        'ZKKGGGKKKKKKKKKKKGGGKKZZZ' +
        'ZKKKGKKKKKKKKKKKGGGGGKZZZ' +
        'ZKKKKKKKKKKKKKKKKKGGGKZZZ' +
        'ZKKKKKKKKKKKKKKKKKKKKKZZZ' +
        'ZZKKKKKKKKKKKKKKKKKKKKZZZ' +
        'ZZZZZZZZZZZZZZZZZZZZZZZZZ',
        25
    );
    return {
        ...m,
        name: 'Hidden World',
        encounterRate: 0.06,
        encounters: [
            { dragonId: 'night_fury', weight: 15, levelRange: [12, 18] },
            { dragonId: 'light_fury', weight: 25, levelRange: [10, 16] },
            { dragonId: 'stormcutter', weight: 30, levelRange: [10, 14] },
            { dragonId: 'razorwhip', weight: 30, levelRange: [9, 13] },
        ],
        npcs: [
            { id: 'hidden_guide', x: 5, y: 2, spriteId: 'npc_elder', dialogue: 'hidden_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 1, y: 1, targetMap: 'mountain_pass', targetX: 18, targetY: 28 },
            { x: 1, y: 2, targetMap: 'mountain_pass', targetX: 18, targetY: 29 },
        ],
    };
})();

// --- DRAGON SANCTUARY (20x20) ---
MAP_DATA.dragon_sanctuary = (() => {
    const m = parseMap(
        'tttttttttttttttttttt' +
        'tTTTtfffffffttTTTtt' +
        'gggggfffffffggggggg' +
        'ggffffffffffggggggg' +
        'gfffGGGGGGffffffggg' +
        'gfffGGGGGGGfffffggg' +
        'ggffGGGGGGGGffffggg' +
        'gggfGGGGGGGffffgggg' +
        'ggggfffGGGfffffggggg' +
        'gggggffffffwwwgggggg' +
        'ppppppppppwwwwgggggg' +
        'pppppppppwwwwwgggGGg' +
        'ggggfffffwFwwggGGGGg' +
        'gggffffffwwwggGGGGGg' +
        'ggffffffffggggGGGGgg' +
        'gfffffffgggGGGGGGggg' +
        'gfffGGGggGGGGGGGGggg' +
        'ggffGGGgGGGGGGGGgggg' +
        'gggfGGGggGGGGGgggggg' +
        'ggggggggggGGgggggTTg',
        20
    );
    return {
        ...m,
        name: 'Dragon Sanctuary',
        encounterRate: 0.08,
        encounters: [
            { dragonId: 'stormcutter', weight: 40, levelRange: [12, 16] },
            { dragonId: 'deadly_nadder', weight: 25, levelRange: [10, 14] },
            { dragonId: 'razorwhip', weight: 20, levelRange: [10, 14] },
            { dragonId: 'monstrous_nightmare', weight: 15, levelRange: [11, 15] },
        ],
        npcs: [
            { id: 'sanctuary_guide', x: 8, y: 10, spriteId: 'npc_elder', dialogue: 'sanctuary_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 1, y: 10, targetMap: 'volcanic_caves', targetX: 22, targetY: 17 },
            { x: 1, y: 11, targetMap: 'volcanic_caves', targetX: 22, targetY: 18 },
        ],
    };
})();
