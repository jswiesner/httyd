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
MAP_DATA.berk_village = (() => {
    const m = parseMap(
        // Row 0
        'ttttttwwwwwwwwttttttttttggggggggggggggtttttt' +
        // Row 1
        'tTTTTtwwwwwwwwtTTTTtttttggggggggggggggtttttt' +
        // Row 2
        'gggggggwwwwwwwgggggggggggggggggggggggggTTttt' +
        // Row 3
        'gggggggwwwwwwwggRRRggRRRgggggRRRgggggggggggg' +
        // Row 4
        'ggRRRggkkkkkkkggHHHggHHHgggggHHHgggggggTTggg' +
        // Row 5
        'ggHHHggkkkkkkkggHDHggHDHgggggHDHgggggggggggg' +
        // Row 6
        'ggHDHggkkkkkkkggpppggpppppppppppgggggggggggg' +
        // Row 7
        'ggpppggkkkkkkkggpppggggpppppppppggggRRRggggg' +
        // Row 8
        'ggpppggkkkkkkkggpppggggppggggggpgggggHHHgggg' +
        // Row 9
        'ggpppggkkkkkkkggpppggggppggggggpgggggHDHgggg' +
        // Row 10
        'ggpppggkkkkkkkggpppggggppggGGggpgggggpppgggg' +
        // Row 11
        'ppppppgkkkkkkkgppppggggppggGGggpgggggpppgggg' +
        // Row 12
        'ppppppppppppppppppppggggppggggggpppppppppgggg' +
        // Row 13
        'ppppppppppppppppppppggggppggggggggpppppppgggg' +
        // Row 14
        'ggpppggggggggggppppggggppggggRRRggggpppgggggg' +
        // Row 15
        'ggpppggRRRgggggppggggggppggggHHHggggpppgggggg' +
        // Row 16
        'ggpppggHHHgggggppggTTggppggggHDHggggpppgggggg' +
        // Row 17
        'ggpppggHDHgggggppggggggppggggpppggggpppgggggg' +
        // Row 18
        'ggpppggpppggggpppgggggppppppppppggggpppgggggg' +
        // Row 19
        'ggpppggpppggggpppgggggpppppppppgggggpppgggggg' +
        // Row 20
        'ggggggggpppggggppgggggggggppgggggggggpppggggg' +
        // Row 21
        'gggggggggggggggppgggGGGgggppgggggTTggpppggggg' +
        // Row 22
        'ggggggggRRRggggppgggGGGGggppgggggggggpppggggg' +
        // Row 23
        'ggggggggHHHggggppgggGGGGggppppppppppppppggggg' +
        // Row 24
        'ggggggggHDHggggppggggggggggpppppppppppppggggg' +
        // Row 25
        'gggggggggppggppppgggggggggggggggggggpppppgggg' +
        // Row 26
        'gggggggggppggppgggggggGGGgggggggggggggpppggGG' +
        // Row 27
        'gggggggggggggpppgggggGGGGGgggggTTgggggpppggGG' +
        // Row 28
        'ggggggggggggggggggggggGGGgggggggggggggppppgGG' +
        // Row 29
        'ggggggggggggggggggggggggggggggggggggggppppgGG',
        40
    );
    return {
        ...m,
        name: 'Berk Village',
        encounterRate: 0,
        encounters: [],
        npcs: [
            { id: 'stoick', x: 18, y: 7, spriteId: 'npc_chief', dialogue: 'stoick_intro', direction: DIR.DOWN },
            { id: 'healer', x: 4, y: 6, spriteId: 'npc_healer', dialogue: 'healer_talk', direction: DIR.DOWN },
            { id: 'trader', x: 27, y: 10, spriteId: 'npc_trader', dialogue: 'trader_talk', direction: DIR.LEFT },
            { id: 'elder', x: 14, y: 17, spriteId: 'npc_elder', dialogue: 'elder_talk', direction: DIR.DOWN },
            { id: 'child', x: 30, y: 13, spriteId: 'npc_guide', dialogue: 'berk_child', direction: DIR.LEFT },
            { id: 'fisherman', x: 10, y: 8, spriteId: 'npc_trader', dialogue: 'dock_fisherman', direction: DIR.RIGHT },
        ],
        warps: [
            { x: 0, y: 11, targetMap: 'forest_path', targetX: 38, targetY: 15 },
            { x: 0, y: 12, targetMap: 'forest_path', targetX: 39, targetY: 15 },
            { x: 39, y: 28, targetMap: 'dragon_island', targetX: 0, targetY: 19 },
            { x: 39, y: 29, targetMap: 'dragon_island', targetX: 0, targetY: 20 },
        ],
        playerStart: { x: 18, y: 13 },
    };
})();

// --- FOREST PATH (40x35) ---
MAP_DATA.forest_path = (() => {
    const m = parseMap(
        // Row 0
        'ttttttttttttGGGGGGGttttttttttttttttttttttt' +
        // Row 1
        'tTTTttTTTttGGGGGGGttTTTttTTTtttttttttTTttt' +
        // Row 2
        'ggggggggggggGGGGGGgggggggggggggttttgggggggg' +
        // Row 3
        'gGGGggGGGgggGGGGGGggGGGgggggggggggggggTTggg' +
        // Row 4
        'gGGGggGGGGggggggGGggGGGGGgggggggggTTggggggg' +
        // Row 5
        'gGGGgggggggggggpGGggGGGGGGggggggggggggggggg' +
        // Row 6
        'gggggTTggpppppppGGggggGGGGggggTTgggggggggggg' +
        // Row 7
        'gggggggpppppppppGGggggggGGggggggggggggggTTgg' +
        // Row 8
        'ttggggpppppgggGGGGgggggggggggGGGGggggggggggg' +
        // Row 9
        'tTTggppppppggggGGGGggggGGGGggGGGGGgggggggggg' +
        // Row 10
        'ggggpppppppgggggGGGgggGGGGGGgGGGGGggggGGGggg' +
        // Row 11
        'gggpppppppggggggGGGggGGGGGGGggGGGgggggGGGGgg' +
        // Row 12
        'ggppppppppgggggggGGgggGGGGGGgggggggggggGGGgg' +
        // Row 13
        'ggppppppgggTTgggGGGgggggGGGgggggggTTgggggggg' +
        // Row 14
        'ppppppppgggggggggGGgggggggggggggggggggppppppp' +
        // Row 15
        'ppppppppgggggggggGGgggggggggGGGggggggpppppppp' +
        // Row 16
        'gggpppppgggggggggGGgggggggGGGGGgggggpppppgggg' +
        // Row 17
        'gggpppppppppppppppppppppppppppppppppppppgggggg' +
        // Row 18
        'ggggppppppppppppppppppppppppppppppppppgggggggg' +
        // Row 19
        'ggGGgggggpppggggggggpppgggggggggggggggggTTggg' +
        // Row 20
        'gGGGgTTggpppggtttggpppgggGGGGgggTTgggggggGGg' +
        // Row 21
        'gGGGggggppppggtTTTgpppggGGGGGGggggggggggGGGg' +
        // Row 22
        'ggGGggggppppgggggggppppgGGGGGGGggggggggGGGGg' +
        // Row 23
        'gggggTTgppppggGGGggppppgGGGGGGggTTggggggGGgg' +
        // Row 24
        'gggggggpppppggGGGGgppppgggGGGggggggggggggggg' +
        // Row 25
        'ggGGGGgpppppggGGGGgpppppgggggggggggggGGGgggg' +
        // Row 26
        'gGGGGGGpppppgggGGggpppppggggTTggggggGGGGGggg' +
        // Row 27
        'gGGGGGgpppppggggggggppppppggggggggggGGGGGgggg' +
        // Row 28
        'ggGGGggpppppgggggggggpppppgggggggggggGGGggggg' +
        // Row 29
        'gggggggpppppggGGGGggggppppppggggTTggggggggggg' +
        // Row 30
        'ggggggpppppggGGGGGGgggppppppggggggggggggggggg' +
        // Row 31
        'gTTggpppppgggGGGGGGggggpppppppggggggGGGGggggg' +
        // Row 32
        'gggggpppppgggggGGGGggggggpppppppppppppppppppp' +
        // Row 33
        'gggggpppppggggggGGGGggggggpppppppppppppppppp' +
        // Row 34 (last row, y=34)
        'ggggppppgggggggggGGGggggggggggggpppppppppppp',
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
            { x: 39, y: 33, targetMap: 'volcanic_caves', targetX: 2, targetY: 3 },
        ],
    };
})();

// --- DRAGON ISLAND (35x30) ---
MAP_DATA.dragon_island = (() => {
    const m = parseMap(
        // Row 0
        'wwwwwwwwwwwwwwwwSSSSSSSSSSSSSSSSSSSSS' +
        // Row 1
        'wwwwwwwwwwwwwwSSSSSSvvvvvSSSSSSSSSSSSS' +
        // Row 2
        'wwwwwwwwwwwwwSSSSSvvvvvvvSSSSSSSSSSSS' +
        // Row 3
        'wwwwwwwwwwwwSSSSSSSSSSSSSSSSSSSSSSGGGG' +
        // Row 4
        'wwwwwwwwwwwSSSSSSSSSppppppSSSSSSGGGGGG' +
        // Row 5
        'wwwwwwwwwwSSSSSSSSSpppppppSSSSGGGGGGGg' +
        // Row 6
        'wwwwwwwwwSSSSSGGGGpppGGppppSSSSGGGGGgg' +
        // Row 7
        'wwwwwwwwSSSSGGGGGGpppGGGGpppSSSSGGGggg' +
        // Row 8
        'wwwwwwwSSSSSGGGGGGpppGGGGGppSSSSSGGggg' +
        // Row 9
        'wwwwwwSSSSSSGGGGGpppGGGGGGppSSSSSSgggg' +
        // Row 10
        'wwwwwwSSSSSSSSGGpppGGGGGGGpSSSSSSggggg' +
        // Row 11
        'wwwwSSSSSSSSSSSpppGGGGGGGppSSSSSSggggg' +
        // Row 12
        'wwwSSSSSSSSSSSppppGGGGGppSSSSSSggggggg' +
        // Row 13
        'wwwSSSSGGGSSSSppppppppppSSSSSSSSgggggg' +
        // Row 14
        'wwSSSSSGGGSSSpppppppppSSSSSSSSSSgggggg' +
        // Row 15
        'wwSSSSGGGSSSppppppppSSSSSSvvSSSSSggggg' +
        // Row 16
        'wwSSSSGGGGSSppppSSSSSSSSvvvvSSSSgggggg' +
        // Row 17
        'wwSSSGGGGGSSSSSSSSSSSSvvvvvvSSSSSggggg' +
        // Row 18
        'wwSSSSGGGGGSSSSSSSSSSSSvvvvSSSSSSggggg' +
        // Row 19
        'pppppppppppppppSSSSSSSSSSSSSSSSSSSgggg' +
        // Row 20
        'ppppppppppppppSSSSSSGGGGSSSSSSSSSSgggg' +
        // Row 21
        'wwwSSSSSSSSSSSSSSSSGGGGGGSSSSSSSSSgggg' +
        // Row 22
        'wwwwSSSSSSSSGGGSSSSGGGGGGGSSSSSSSSSggg' +
        // Row 23
        'wwwwwSSSSSGGGGGGSSSSGGGGGSSSSSSSSSSggg' +
        // Row 24
        'wwwwwwSSSSGGGGGGGSSSSSGGSSSSSSSSSSSggg' +
        // Row 25
        'wwwwwwwSSSGGGGGGSSSSSSSSSSSSSSSSSSSSgg' +
        // Row 26
        'wwwwwwwwSSSSGGGSSSSSSSSSSSSSSSSSSSSSgg' +
        // Row 27
        'wwwwwwwwwSSSSSSSSSSSSSSSSSSSSSSSSSSSSg' +
        // Row 28
        'wwwwwwwwwwSSSSSSSSSSSSSSSSSSSSSSSSSSgg' +
        // Row 29
        'wwwwwwwwwwwSSSSSSSSSSSSSSSSSSSSSSSSSgg',
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
MAP_DATA.mountain_pass = (() => {
    const m = parseMap(
        // Row 0
        'vvvvvvvvvnnnnnnnnnnnvvvvvvvvvv' +
        // Row 1
        'vvvvvvnnnnnnnnNnnnnnnnvvvvvvvv' +
        // Row 2
        'vvvvnnnnnnnnnnnnnnnnnnnnvvvvvv' +
        // Row 3
        'vvvnnnGGGGnnnnNnnnnnnnnnvvvvvv' +
        // Row 4
        'vvnnnGGGGGGnnnnnnnnnNnnnnnvvvv' +
        // Row 5
        'vvnnnGGGGGGGnnnnnnnnnnnnnnnvvv' +
        // Row 6
        'vnnnNnnnGGGGGnnnnnnnNnnnnnnvvv' +
        // Row 7
        'vnnnnnppppppnnnnnnnnnnnnnnnvvv' +
        // Row 8
        'nnnnnpppppppnnnnnGGGnnnnnnnvvv' +
        // Row 9
        'nnnnppppppppppnnnGGGGnnnnnnvvv' +
        // Row 10
        'nnnpppppnnnnnppnnnGGGGnnnnnvvv' +
        // Row 11
        'nnnppppnnnNnnnppnnGGGnnnnnnnvv' +
        // Row 12
        'nNnpppnnnnnnnnppnnnnnnnnnnnnnv' +
        // Row 13
        'nnnpppGGGGnnnnnppnnnnnnnNnnnnn' +
        // Row 14
        'nnnpppGGGGGnnnnpppnnnnnnnnnNnn' +
        // Row 15
        'nnppppGGGGGGnnnppppnnnnnnnnnnn' +
        // Row 16
        'nnppppnGGGGnnnnnpppppnnnGGGnnn' +
        // Row 17
        'nnpppnnnnnNnnnnnnpppppnnGGGGnn' +
        // Row 18
        'npppppnnnnnnnnnnnpppppnnGGGGnn' +
        // Row 19
        'nppppppnNnnnnGGGnnppppnnnGGnnn' +
        // Row 20
        'nppppppnnnnnnGGGGnnpppppnnnnnn' +
        // Row 21
        'nnppppppnnnnnGGGGnnpppppnNnnnn' +
        // Row 22
        'nnnpppppppnnnGGGGnnnppppppnnnn' +
        // Row 23
        'nnnNpppppppnnnGGnnnnnppppppnnn' +
        // Row 24
        'nnnnpppppppppppppppppppppppnnn' +
        // Row 25
        'nnnnnpppppppppppppppppppppnnnn' +
        // Row 26
        'nnNnnnnnnnnnnnnnnnnnppppnnnnnn' +
        // Row 27
        'nnnnnnGGGGnnNnnnnnppppnnnNnnnn' +
        // Row 28
        'nnnnnGGGGGGnnnnnnpppppnnnppppp' +
        // Row 29
        'nnnnnnGGGGnnnnnnnpppppnnnppppp' +
        // Row 30
        'nnnnnnnGGnnNnnnnpppppnnnnnnnnn' +
        // Row 31
        'nnNnnnnnnnnnnnnnpppnnnGGGGnnnn' +
        // Row 32
        'nnnnnGGGGnnnnnppppnnnGGGGGGnnn' +
        // Row 33
        'nnnnGGGGGGnnnnpppnnnnGGGGGnnnn' +
        // Row 34
        'nnnnnGGGGnnnnnpppnnnnnnGGnnnnn',
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
            { x: 29, y: 34, targetMap: 'hidden_world', targetX: 2, targetY: 3 },
        ],
    };
})();

// --- VOLCANIC CAVES (35x25) ---
MAP_DATA.volcanic_caves = (() => {
    const m = parseMap(
        // Row 0
        'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' +
        // Row 1
        'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' +
        // Row 2
        'WCCCCCCCCWWWWWCCCCCCCCWWWWCCCCCCWWWW' +
        // Row 3
        'WCCCCCCCCCWWWCCCCCCCCCWWCCCCCCCCCWWW' +
        // Row 4
        'WCCCLLCCCCCCCCCCCLLCCCCCCCCCLLCCCWWW' +
        // Row 5
        'WCCCLLLCCCCCCCCCLLLCCCCCCCCCLLCCCCWW' +
        // Row 6
        'WCCCCCCGGGCCCCCCCCGGGCCCCCCCCCCCCCWW' +
        // Row 7
        'WCCCCCGGGGGCCCCCGGGGGCCCGGCCCCCCCCWW' +
        // Row 8
        'WCCCCCCGGGCCCCCCCCGGGCCGGGGCCCCCCCWW' +
        // Row 9
        'WCCCCCCCCCCCCWWCCCCCCCCCGGCCCCCCCCWW' +
        // Row 10
        'WCCCGGCCCCCWWWWWCCCCCGGCCCCCCCCCCCWW' +
        // Row 11
        'WCCGGGCCCCWWWWWWCCCCGGGCCCCLLCCCCWWW' +
        // Row 12
        'WCCCCCCCCCCCCWWCCCCCCCCCCCLLLLCCCCWW' +
        // Row 13
        'WCCCCLLCCCCCCCCCCCLLCCCCCCLLCCCCCCCW' +
        // Row 14
        'WCCCCLLLCCCCCCCCCLLLLCCCCCCCCCGGCCCW' +
        // Row 15
        'WCCCCLLCCCCGGCCCCLLCCCCCCCCCCGGGGCCW' +
        // Row 16
        'WCCCCCCCCCCGGGCCCCCCCCCCCCCCCGGGCCCW' +
        // Row 17
        'WCCCCCCCCCCCGGCCCCCCCCCCCCCCCCCCCCCW' +
        // Row 18
        'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCW' +
        // Row 19
        'WWCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCWW' +
        // Row 20
        'WWWCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCW' +
        // Row 21
        'WWWWCCCCCCCCCCCCCCCCCCCCCCCCCCPPPCPW' +
        // Row 22
        'WWWWWCCCCCCCCCCCCCCCCCCCCCCCCCPPPCPW' +
        // Row 23
        'WWWWWWWCCCCCCCCCCCCCCCCCCCCCCCCCCCCW' +
        // Row 24
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
MAP_DATA.hidden_world = (() => {
    const m = parseMap(
        // Row 0
        'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ' +
        // Row 1
        'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ' +
        // Row 2
        'ZKKKKKKKKZZZZZKKKKKKKKKZZZZZKKKKKKZZ' +
        // Row 3
        'ZKKKKKKKKKZZZKKKKKKKKKKZZZKKKKKKKKZZ' +
        // Row 4
        'ZKKKKGGKKKKKKKKKKGGKKKKKKKKKKKKKKKZZ' +
        // Row 5
        'ZKKKGGGGKKKKKKKKGGGGKKKKKKKKKGGKKKZZ' +
        // Row 6
        'ZKKKGGGGKKKZZKKKKGGGGKKKKKKGGGGKKZZZ' +
        // Row 7
        'ZKKKKGGKKZZZZKKKKKKKKKKKKKKGGGKKKZZZ' +
        // Row 8
        'ZKKKKKKKKKZZZZKKKKKKKKKKKKKKKKKKKZZZ' +
        // Row 9
        'ZZKKKKKKZZZZZZZKKKKKKKKKKKKKKKKKZZZZ' +
        // Row 10
        'ZZZKKKKKKKKZZZKKKKKGGKKKKKKKKKKKZZZZ' +
        // Row 11
        'ZZKKKKKKKKKKZKKKKKGGGKKKKKKKKKKKZZZZ' +
        // Row 12
        'ZZKKKKGGKKKKKKKKKGGGKKKKKKKKKKKZZZZZ' +
        // Row 13
        'ZKKKGGGGGKKKKKKKKKKGKKKKKKGGGKKKZZZZ' +
        // Row 14
        'ZKKKGGGGGKKKKKKKKKKKKKKKGGGGGKKKKZZZ' +
        // Row 15
        'ZKKKKGGGKKKKKKKKKKKKKKKKKGGGKKKKKZZZ' +
        // Row 16
        'ZKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKZZ' +
        // Row 17
        'ZKKKKKKKKKKKKKKKKGGGKKKKKKKKKKKKKKZZ' +
        // Row 18
        'ZKKKKKKKKKKKKKKKGGGGKKKKKKKKKKKKKKZZ' +
        // Row 19
        'ZKKKKKKKKKKKKKKKKGGGKKKKKKKKKKKKKZZZ' +
        // Row 20
        'ZKKKKKKKKKKKKKKKKKKKKKKKKGGGKKKKKZZZ' +
        // Row 21
        'ZZKKKKKKKKKKKKKKKKKKKKKKGGGGGKKKKZZZ' +
        // Row 22
        'ZZZKKKKKKKKKKKKKKKKKKKKKKGGGKKKKZZZZ' +
        // Row 23
        'ZZZZKKKKKKKKKKKKKKKKKKKKKKKKKKKZZZZZ' +
        // Row 24
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
MAP_DATA.dragon_sanctuary = (() => {
    const m = parseMap(
        // Row 0
        'tttttttttttttttttttttttttttTTt' +
        // Row 1
        'tTTTttfffffffffftttTTTttgggggg' +
        // Row 2
        'gggggggfffffffffgggggggggggTTg' +
        // Row 3
        'ggffffffffffffgggggggggggggggg' +
        // Row 4
        'gfffffGGGGGGGGffffffggggggggg' +
        // Row 5
        'gfffffGGGGGGGGGfffffggggggggg' +
        // Row 6
        'ggffffGGGGGGGGGGffffggggTTggg' +
        // Row 7
        'gggfffGGGGGGGGGfffffggggggggg' +
        // Row 8
        'ggggffffGGGGGffffffggggggggggg' +
        // Row 9
        'gggggffffffffffffffggggggTTggg' +
        // Row 10
        'ggggggfffffffwwwwwgggggggggggg' +
        // Row 11
        'gggggffffffwwwwwwwgggggggGGGgg' +
        // Row 12
        'ppppppppppppwwwwwwggggggGGGGGg' +
        // Row 13
        'pppppppppppwwwwwwwggggGGGGGGGg' +
        // Row 14
        'ggggggfffffwFwwwwggggGGGGGGGgg' +
        // Row 15
        'gggfffffffwwwwwgggggGGGGGGgggg' +
        // Row 16
        'ggffffffffffgggggGGGGGGGGggggg' +
        // Row 17
        'gfffffffgggggGGGGGGGGGGGgggggg' +
        // Row 18
        'gfffGGGGgggGGGGGGGGGGGGggggggg' +
        // Row 19
        'ggffGGGGggGGGGGGGGGGGGgggggggg' +
        // Row 20
        'gggfGGGGgggGGGGGGGGgggggTTgggg' +
        // Row 21
        'ggggGGGGggggGGGGGGgggggggggTTg' +
        // Row 22
        'gggggGGGgggggGGGGggggTTggggggg' +
        // Row 23
        'ggggggggggggggGGggggggggggggggg' +
        // Row 24
        'ggggggggggggggggggggggggggggTTg',
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
