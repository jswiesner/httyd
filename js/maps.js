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

// --- BERK VILLAGE (40x30) ---
// Exits: LEFT edge y=11,12 -> Forest Path | RIGHT edge y=28,29 -> Dragon Island
MAP_DATA.berk_village = (() => {
    const m = parseMap(
        'ttttttwwwwwwwwttttttttttggggggggggggggtt' +
        'tTTTTtwwwwwwwwtTTTTtttttggggggggggggggtt' +
        'gggggggwwwwwwwgggggggggggggggggggggggggT' +
        'gggggggwwwwwwwggRRRggRRRgggggRRRgggggggg' +
        'ggRRRggkkkkkkkggHHHggHHHgggggHHHggggggTT' +
        'ggHHHggkkkkkkkggHDHggHDHgggggHDHgggggggg' +
        'ggHDHggkkkkkkkggpppggpppppppppppgggggggg' +
        'ggpppggkkkkkkkggpppggggpppppppppgggRRRgg' +
        'ggpppggkkkkkkkggpppggggppgggggppggggHHHg' +
        'ggpppggkkkkkkkggpppggggppgggggppggggHDHg' +
        'ggpppggkkkkkkkggpppggggppggGGgppggggpppg' +
        'ppppppgkkkkkkkgppppggggppggGGgppggggpppg' +
        'ppppppppppppppppppppggggppgggggppppppppp' +
        'ppppppppppppppppppppggggppgggggggppppppp' +
        'ggpppggggggggggppppggggppggggRRRgggpppgg' +
        'ggpppggRRRgggggppggggggppggggHHHgggpppgg' +
        'ggpppggHHHgggggppggTTggppggggHDHgggpppgg' +
        'ggpppggHDHgggggppggggggppggggpppgggpppgg' +
        'ggpppggpppggggpppgggggpppppppppppggpppgg' +
        'ggpppggpppggggpppgggggppppppppppggggpppg' +
        'ggggggggpppggggppgggggggggppggggggggpppg' +
        'gggggggggggggggppgggGGGgggppggggTTggpppg' +
        'ggggggggRRRggggppgggGGGGggppggggggggpppg' +
        'ggggggggHHHggggppgggGGGGggpppppppppppppg' +
        'ggggggggHDHggggppggggggggggppppppppppppg' +
        'gggggggggppggppppgggggggggggggggggggpppg' +
        'gggggggggppggppgggggggGGGggggggggggggppg' +
        'gggggggggggggpppgggggGGGGGggggTTgggggppg' +
        'gggggggggggggggggggggggGGGgggggggggggppp' +
        'ggggggggggggggggggggggggggggggggggggggpp',
        40
    );
    return {
        ...m,
        name: 'Berk Village',
        encounterRate: 0,
        encounters: [],
        npcs: [
            { id: 'stoick', x: 18, y: 7, spriteId: 'npc_chief', dialogue: 'stoick_intro', direction: DIR.DOWN },
            { id: 'healer', x: 3, y: 7, spriteId: 'npc_healer', dialogue: 'healer_talk', direction: DIR.DOWN },
            { id: 'trader', x: 27, y: 10, spriteId: 'npc_trader', dialogue: 'trader_talk', direction: DIR.LEFT },
            { id: 'elder', x: 14, y: 17, spriteId: 'npc_elder', dialogue: 'elder_talk', direction: DIR.DOWN },
            { id: 'child', x: 30, y: 13, spriteId: 'npc_guide', dialogue: 'berk_child', direction: DIR.LEFT },
            { id: 'fisherman', x: 10, y: 8, spriteId: 'npc_trader', dialogue: 'dock_fisherman', direction: DIR.RIGHT },
        ],
        warps: [
            { x: 0, y: 11, targetMap: 'forest_path', targetX: 39, targetY: 14 },
            { x: 0, y: 12, targetMap: 'forest_path', targetX: 39, targetY: 15 },
            { x: 39, y: 28, targetMap: 'dragon_island', targetX: 0, targetY: 19 },
            { x: 39, y: 29, targetMap: 'dragon_island', targetX: 0, targetY: 20 },
        ],
        playerStart: { x: 18, y: 13 },
    };
})();

// --- FOREST PATH (40x35) ---
// Exits: RIGHT edge y=14,15 -> Berk | LEFT edge y=14,15 -> Mountain Pass | RIGHT edge y=32,33 -> Volcanic Caves
MAP_DATA.forest_path = (() => {
    const m = parseMap(
        'ttttttttttttGGGGGGGttttttttttttttttttttt' +
        'tTTTttTTTttGGGGGGGttTTTttTTTtttttttTTttt' +
        'ggggggggggggGGGGGGggggggggggggttttgggggg' +
        'gGGGggGGGgggGGGGGGggGGGgggggggggggggTTgg' +
        'gGGGggGGGGggggggGGggGGGGGggggggTTggggggg' +
        'gGGGgggggggggggpGGggGGGGGGgggggggggggggg' +
        'gggggTTggpppppppGGggggGGGGggggTTgggggggg' +
        'gggggggpppppppppGGggggggGGgggggggggTTggg' +
        'ttggggpppppgggGGGGgggggggggggGGGGggggggg' +
        'tTTggppppppggggGGGGggggGGGGggGGGGGgggggg' +
        'ggggpppppppgggggGGGgggGGGGGGgGGGGGgggggg' +
        'gggpppppppggggggGGGggGGGGGGGggGGGggGGGGG' +
        'ggppppppppgggggggGGgggGGGGGGgggggggGGGgg' +
        'ggppppppgggTTgggGGGgggggGGGggggTTggggggg' +
        'ppppppppgggggggggGGggggggggggggggppppppp' +
        'ppppppppgggggggggGGggggggggGGGggpppppppp' +
        'gggpppppgggggggggGGggggggGGGGGggpppppggg' +
        'gggpppppppppppppppppppppppppppppppppgggg' +
        'ggggppppppppppppppppppppppppppppppgggggg' +
        'ggGGgggggpppggggggggpppgggggggggggTTgggg' +
        'gGGGgTTggpppggtttggpppgggGGGGgggTTgggggg' +
        'gGGGggggppppggtTTTgpppggGGGGGGgggggGGGGG' +
        'ggGGggggppppgggggggppppgGGGGGGGggggGGGGG' +
        'gggggTTgppppggGGGggppppgGGGGGGggTTgGGggg' +
        'gggggggpppppggGGGGgppppgggGGGggggggggggg' +
        'ggGGGGgpppppggGGGGgpppppggggggggggGGGggg' +
        'gGGGGGGpppppgggGGggpppppggggTTgggGGGGGGG' +
        'gGGGGGgpppppggggggggppppppggggggGGGGGggg' +
        'ggGGGggpppppgggggggggpppppgggggggGGGgggg' +
        'gggggggpppppggGGGGggggppppppggTTgggggggg' +
        'ggggggpppppggGGGGGGgggppppppgggggggggggg' +
        'gTTggpppppgggGGGGGGggggppppppggGGGGggggg' +
        'gggggpppppgggggGGGGgggggpppppppppppppppp' +
        'gggggpppppggggggGGGGggggpppppppppppppppp' +
        'ggggppppgggggggggGGGggggggggpppppppppppp',
        40
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
            { id: 'forest_guide', x: 8, y: 17, spriteId: 'npc_guide', dialogue: 'forest_guide', direction: DIR.RIGHT },
        ],
        warps: [
            { x: 39, y: 14, targetMap: 'berk_village', targetX: 1, targetY: 11 },
            { x: 39, y: 15, targetMap: 'berk_village', targetX: 1, targetY: 12 },
            { x: 0, y: 14, targetMap: 'mountain_pass', targetX: 29, targetY: 28 },
            { x: 0, y: 15, targetMap: 'mountain_pass', targetX: 29, targetY: 29 },
            { x: 39, y: 32, targetMap: 'volcanic_caves', targetX: 1, targetY: 2 },
            { x: 39, y: 33, targetMap: 'volcanic_caves', targetX: 1, targetY: 3 },
        ],
    };
})();

// --- DRAGON ISLAND (35x30) ---
// Exits: LEFT edge y=19,20 -> Berk Village
MAP_DATA.dragon_island = (() => {
    const m = parseMap(
        'wwwwwwwwwwwwwwwSSSSSSSSSSSSSSSSSSSS' +
        'wwwwwwwwwwwwwSSSSSSvvvvvSSSSSSSSSSS' +
        'wwwwwwwwwwwwSSSSSvvvvvvvSSSSSSSSSSS' +
        'wwwwwwwwwwwSSSSSSSSSSSSSSSSSSSSGGGG' +
        'wwwwwwwwwwSSSSSSSSSppppppSSSSGGGGGG' +
        'wwwwwwwwwSSSSSSSSSpppppppSSSGGGGGgg' +
        'wwwwwwwwSSSSSGGGGpppGGppppSSSSGGggg' +
        'wwwwwwwSSSSGGGGGGpppGGGGppSSSSSGggg' +
        'wwwwwwSSSSSGGGGGGpppGGGGGppSSSSgggg' +
        'wwwwwwSSSSSSGGGGpppGGGGGGppSSSSgggg' +
        'wwwwwSSSSSSSSGGpppGGGGGGGpSSSSggggg' +
        'wwwwSSSSSSSSSSSpppGGGGGGGppSSSSgggg' +
        'wwwSSSSSSSSSSSppppGGGGGppSSSSSggggg' +
        'wwwSSSSGGGSSSSppppppppppSSSSSSSgggg' +
        'wwSSSSSGGGSSSpppppppppSSSSSSSSSgggg' +
        'wwSSSSGGGSSSppppppppSSSSSSvvSSSgggg' +
        'wwSSSSGGGGSSppppSSSSSSSSvvvvSSSgggg' +
        'wwSSSGGGGGSSSSSSSSSSSSvvvvvvSSSSggg' +
        'wwSSSSGGGGGSSSSSSSSSSSvvvvSSSSSSggg' +
        'ppppppppppppppSSSSSSSSSSSSSSSSggggg' +
        'pppppppppppppSSSSSGGGGSSSSSSSSggggg' +
        'wwwSSSSSSSSSSSSSSGGGGGGSSSSSSSSgggg' +
        'wwwwSSSSSSSSGGGSSSGGGGGGSSSSSSSgggg' +
        'wwwwwSSSSSGGGGGGSSSGGGGGSSSSSSggggg' +
        'wwwwwwSSSSGGGGGGGSSSSGGSSSSSSSSgggg' +
        'wwwwwwwSSSGGGGGGSSSSSSSSSSSSSSSSggg' +
        'wwwwwwwwSSSSGGGSSSSSSSSSSSSSSSSgggg' +
        'wwwwwwwwwSSSSSSSSSSSSSSSSSSSSSSgggg' +
        'wwwwwwwwwwSSSSSSSSSSSSSSSSSSSSggggg' +
        'wwwwwwwwwwwSSSSSSSSSSSSSSSSSSSggggg',
        35
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
            { x: 0, y: 19, targetMap: 'berk_village', targetX: 38, targetY: 28 },
            { x: 0, y: 20, targetMap: 'berk_village', targetX: 38, targetY: 29 },
        ],
    };
})();

// --- MOUNTAIN PASS (30x35) ---
// Exits: RIGHT edge y=28,29 -> Forest Path | RIGHT edge y=33,34 -> Hidden World
MAP_DATA.mountain_pass = (() => {
    const m = parseMap(
        'vvvvvvvvvnnnnnnnnnnnvvvvvvvvvv' +
        'vvvvvvnnnnnnnnNnnnnnnnvvvvvvvv' +
        'vvvvnnnnnnnnnnnnnnnnnnnnvvvvvv' +
        'vvvnnnGGGGnnnnNnnnnnnnnnvvvvvv' +
        'vvnnnGGGGGGnnnnnnnnNnnnnvvvvvv' +
        'vvnnnGGGGGGGnnnnnnnnnnnnvvvvvv' +
        'vnnnNnnnGGGGGnnnnnnnNnnnnvvvvv' +
        'vnnnnnppppppnnnnnnnnnnnnvvvvvv' +
        'nnnnnpppppppnnnnnGGGnnnnvvvvvv' +
        'nnnnppppppppppnnnGGGGnnnvvvvvv' +
        'nnnpppppnnnnnppnnnGGGGnnvvvvvv' +
        'nnnppppnnnNnnnppnnGGGnnnvvvvvv' +
        'nNnpppnnnnnnnnppnnnnnnnnnnvvvv' +
        'nnnpppGGGGnnnnnppnnnnnNnnnnnnn' +
        'nnnpppGGGGGnnnnpppnnnnnnnNnnnn' +
        'nnppppGGGGGGnnnppppnnnnnnnnnnn' +
        'nnppppnGGGGnnnnnpppppnGGGnnnnn' +
        'nnpppnnnnnNnnnnnnppppnGGGGnnnn' +
        'npppppnnnnnnnnnnnpppppnGGGGnnn' +
        'nppppppnNnnnnGGGnnppppnnGGnnnn' +
        'nppppppnnnnnnGGGGnnpppppnnnnnn' +
        'nnppppppnnnnnGGGGnnpppppnNnnnn' +
        'nnnpppppppnnnGGGGnnnppppnnnnnn' +
        'nnnNpppppppnnnGGnnnnnpppnnnnnn' +
        'nnnnppppppppppppppppppppppnnnn' +
        'nnnnnppppppppppppppppppppnnnnn' +
        'nnNnnnnnnnnnnnnnnnnnppppnnnnnn' +
        'nnnnnnGGGGnnNnnnnnppppnnnNnnnn' +
        'nnnnnGGGGGGnnnnnpppppnpppppppp' +
        'nnnnnnGGGGnnnnnpppppnnpppppppp' +
        'nnnnnnnGGnnNnnppppnnnnnnnnnnnn' +
        'nnNnnnnnnnnnnnpppnnnGGGGnnnnnn' +
        'nnnnnGGGGnnnppppnnnGGGGGGnnnnn' +
        'nnnnGGGGGGnnpppnnnnnGGGGnnnnnn' +
        'nnnnnGGGGnnnpppnnnnnnnGGnnnnnn',
        30
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
            { id: 'mountain_guide', x: 10, y: 9, spriteId: 'npc_guide', dialogue: 'mountain_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 29, y: 28, targetMap: 'forest_path', targetX: 1, targetY: 14 },
            { x: 29, y: 29, targetMap: 'forest_path', targetX: 1, targetY: 15 },
            { x: 29, y: 33, targetMap: 'hidden_world', targetX: 1, targetY: 2 },
            { x: 29, y: 34, targetMap: 'hidden_world', targetX: 1, targetY: 3 },
        ],
    };
})();

// --- VOLCANIC CAVES (35x25) ---
// Exits: LEFT edge y=2,3 -> Forest Path | RIGHT edge y=21,22 -> Dragon Sanctuary
MAP_DATA.volcanic_caves = (() => {
    const m = parseMap(
        'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' +
        'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' +
        'WCCCCCCCCWWWWWCCCCCCCCWWWWCCCCCCWWW' +
        'WCCCCCCCCCWWWCCCCCCCCCWWCCCCCCCCCWW' +
        'WCCCLLCCCCCCCCCCCLLCCCCCCCCCLLCCCWW' +
        'WCCCLLLCCCCCCCCCLLLCCCCCCCCCLLCCCCW' +
        'WCCCCCCGGGCCCCCCCCGGGCCCCCCCCCCCCCW' +
        'WCCCCCGGGGGCCCCCGGGGGCCCGGCCCCCCCCW' +
        'WCCCCCCGGGCCCCCCCCGGGCCGGGGCCCCCCCW' +
        'WCCCCCCCCCCCCWWCCCCCCCCCGGCCCCCCWWW' +
        'WCCCGGCCCCCWWWWWCCCCCGGCCCCCCCCWWWW' +
        'WCCGGGCCCCWWWWWWCCCCGGGCCCCLLCCCWWW' +
        'WCCCCCCCCCCCCWWCCCCCCCCCCCLLLLCCWWW' +
        'WCCCCLLCCCCCCCCCCCLLCCCCCCLLCCCCCCW' +
        'WCCCCLLLCCCCCCCCCLLLLCCCCCCCCGGCCCW' +
        'WCCCCLLCCCCGGCCCCLLCCCCCCCCCCGGGGCW' +
        'WCCCCCCCCCCGGGCCCCCCCCCCCCCCCGGGCCW' +
        'WCCCCCCCCCCCGGCCCCCCCCCCCCCCCCCCWWW' +
        'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCWW' +
        'WWCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCWWW' +
        'WWWCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCWW' +
        'WWWWCCCCCCCCCCCCCCCCCCCCCCCCppCCppp' +
        'WWWWWCCCCCCCCCCCCCCCCCCCCCCCppCCppp' +
        'WWWWWWWCCCCCCCCCCCCCCCCCCCCCCCCCCCW' +
        'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
        35
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
            { id: 'cave_guide', x: 6, y: 3, spriteId: 'npc_guide', dialogue: 'cave_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 1, y: 2, targetMap: 'forest_path', targetX: 38, targetY: 32 },
            { x: 1, y: 3, targetMap: 'forest_path', targetX: 38, targetY: 33 },
            { x: 34, y: 21, targetMap: 'dragon_sanctuary', targetX: 1, targetY: 12 },
            { x: 34, y: 22, targetMap: 'dragon_sanctuary', targetX: 1, targetY: 13 },
        ],
    };
})();

// --- HIDDEN WORLD (35x25) ---
// Exits: LEFT edge y=2,3 -> Mountain Pass
MAP_DATA.hidden_world = (() => {
    const m = parseMap(
        'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ' +
        'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ' +
        'ZKKKKKKKKZZZZZKKKKKKKKKZZZZZKKKKKKZ' +
        'ZKKKKKKKKKZZZKKKKKKKKKKZZZKKKKKKKKZ' +
        'ZKKKKGGKKKKKKKKKKGGKKKKKKKKKKKKKKZZ' +
        'ZKKKGGGGKKKKKKKKGGGGKKKKKKKKGGKKKZZ' +
        'ZKKKGGGGKKKZZKKKKGGGGKKKKKKGGGGKKZZ' +
        'ZKKKKGGKKZZZZKKKKKKKKKKKKKKGGGKKZZZ' +
        'ZKKKKKKKKKZZZZKKKKKKKKKKKKKKKKKKKZZ' +
        'ZZKKKKKKZZZZZZZKKKKKKKKKKKKKKKKKZZZ' +
        'ZZZKKKKKKKKZZZKKKKKGGKKKKKKKKKKKZZZ' +
        'ZZKKKKKKKKKKZKKKKKGGGKKKKKKKKKKKZZZ' +
        'ZZKKKKGGKKKKKKKKKGGGKKKKKKKKKKKZZZZ' +
        'ZKKKGGGGGKKKKKKKKKKGKKKKKGGGKKKKZZZ' +
        'ZKKKGGGGGKKKKKKKKKKKKKKGGGGGKKKKZZZ' +
        'ZKKKKGGGKKKKKKKKKKKKKKKKKGGGKKKKKZZ' +
        'ZKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKZZ' +
        'ZKKKKKKKKKKKKKKKKGGGKKKKKKKKKKKKKZZ' +
        'ZKKKKKKKKKKKKKKKGGGGKKKKKKKKKKKKKZZ' +
        'ZKKKKKKKKKKKKKKKKGGGKKKKKKKKKKKKZZZ' +
        'ZKKKKKKKKKKKKKKKKKKKKKKKKGGGKKKKKZZ' +
        'ZZKKKKKKKKKKKKKKKKKKKKKKGGGGGKKKKZZ' +
        'ZZZKKKKKKKKKKKKKKKKKKKKKKKGGGKKKZZZ' +
        'ZZZZKKKKKKKKKKKKKKKKKKKKKKKKKKZZZZZ' +
        'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
        35
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
            { id: 'hidden_guide', x: 6, y: 3, spriteId: 'npc_elder', dialogue: 'hidden_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 1, y: 2, targetMap: 'mountain_pass', targetX: 28, targetY: 33 },
            { x: 1, y: 3, targetMap: 'mountain_pass', targetX: 28, targetY: 34 },
        ],
    };
})();

// --- DRAGON SANCTUARY (30x25) ---
// Exits: LEFT edge y=12,13 -> Volcanic Caves
MAP_DATA.dragon_sanctuary = (() => {
    const m = parseMap(
        'tttttttttttttttttttttttttttTTt' +
        'tTTTttfffffffffftttTTTttgggggg' +
        'gggggggfffffffffgggggggggggTTg' +
        'ggffffffffffffgggggggggggggggg' +
        'gfffffGGGGGGGGffffffgggggggggg' +
        'gfffffGGGGGGGGGfffffgggggggggg' +
        'ggffffGGGGGGGGGGffffggggTTgggg' +
        'gggfffGGGGGGGGGfffffgggggggggg' +
        'ggggffffGGGGGffffffggggggggggg' +
        'gggggffffffffffffffgggggTTgggg' +
        'ggggggfffffffwwwwwgggggggggggg' +
        'gggggffffffwwwwwwwgggggGGGgggg' +
        'ppppppppppppwwwwwwggggGGGGGggg' +
        'pppppppppppwwwwwwwgggGGGGGGggg' +
        'ggggggfffffwFwwwwggGGGGGGGgggg' +
        'gggfffffffwwwwwggggGGGGGGggggg' +
        'ggffffffffffgggGGGGGGGGggggggg' +
        'gfffffffgggggGGGGGGGGGGggggggg' +
        'gfffGGGGgggGGGGGGGGGGGgggggggg' +
        'ggffGGGGggGGGGGGGGGGGggggggggg' +
        'gggfGGGGgggGGGGGGGGgggTTgggggg' +
        'ggggGGGGggggGGGGGGgggggggggTTT' +
        'gggggGGGgggggGGGGggggTTggggggg' +
        'gggggggggggggggGGggggggggggggg' +
        'gggggggggggggggggggggggggggTTg',
        30
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
            { id: 'sanctuary_guide', x: 10, y: 12, spriteId: 'npc_elder', dialogue: 'sanctuary_guide', direction: DIR.DOWN },
        ],
        warps: [
            { x: 0, y: 12, targetMap: 'volcanic_caves', targetX: 33, targetY: 21 },
            { x: 0, y: 13, targetMap: 'volcanic_caves', targetX: 33, targetY: 22 },
        ],
    };
})();
