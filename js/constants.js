// Canvas and rendering - portrait resolution (2x scaled to 360x640)
const SCREEN_W = 180;
const SCREEN_H = 320;
const TILE_SIZE = 16;
const TICK_RATE = 1 / 60;

// Color palette - retro but full color
const COLORS = {
    // UI colors
    BLACK: '#0f0f0f',
    DARK: '#2a2a3a',
    WHITE: '#f0f0e8',
    GRAY: '#8888a0',

    // Nature
    GRASS_LIGHT: '#5a9e3e',
    GRASS_DARK: '#3d7a2a',
    GRASS_TALL: '#4a8e34',
    DIRT: '#b8945a',
    DIRT_DARK: '#8a6e3e',
    PATH: '#c8a86e',
    WATER: '#3a6eb5',
    WATER_DARK: '#2a4e85',
    WATER_LIGHT: '#5a8ed5',
    SAND: '#d8c888',

    // Trees
    TREE_TRUNK: '#6e4e2a',
    TREE_LEAVES: '#2a6e2a',
    TREE_LEAVES_LIGHT: '#3a8e3a',

    // Stone/Mountain
    STONE: '#8888a0',
    STONE_DARK: '#5a5a7a',
    STONE_LIGHT: '#aaaacc',
    SNOW: '#e8e8f8',
    SNOW_SHADOW: '#c0c0d8',

    // Buildings
    WOOD: '#9e7a4a',
    WOOD_DARK: '#7a5a2a',
    ROOF: '#8a3a2a',
    ROOF_DARK: '#6a2a1a',

    // Volcanic/Cave
    LAVA: '#e84420',
    LAVA_GLOW: '#f86830',
    CAVE_FLOOR: '#3a3a4a',
    CAVE_WALL: '#2a2a3a',
    CRYSTAL: '#7aaae8',
    CRYSTAL_GLOW: '#aaccff',

    // Dragon types
    FIRE: '#e84420',
    ICE: '#5ac8e8',
    LIGHTNING: '#e8d040',
    EARTH: '#8a6e3e',

    // UI specific
    HP_GREEN: '#3abe3a',
    HP_YELLOW: '#e8c820',
    HP_RED: '#d83030',
    MENU_BG: '#1a1a2e',
    MENU_BORDER: '#f0f0e8',
    TEXT: '#f0f0e8',
    TEXT_SHADOW: '#2a2a3a',
};

// Tile types for collision map
const TILE = {
    WALKABLE: 0,
    SOLID: 1,
    ENCOUNTER_GRASS: 2,
    WATER: 3,
    WARP: 4,
    CLOUD: 5,         // walkable only in flight mode, encounter grass in sky
    WIND_UP: 6,       // pushes player upward in flight
    WIND_DOWN: 7,     // pushes player downward in flight
    WIND_LEFT: 8,     // pushes player left in flight
    WIND_RIGHT: 9,    // pushes player right in flight
};

// Game states
const GameState = {
    TITLE: 'title',
    OVERWORLD: 'overworld',
    BATTLE: 'battle',
    DIALOGUE: 'dialogue',
    MENU: 'menu',
    TRANSITION: 'transition',
};

// Directions
const DIR = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
};

const DIR_DX = { up: 0, down: 0, left: -1, right: 1 };
const DIR_DY = { up: -1, down: 1, left: 0, right: 0 };

// Battle phases
const BattlePhase = {
    START: 'start',
    MENU: 'menu',
    MOVE_SELECT: 'move_select',
    PLAYER_TURN: 'player_turn',
    ENEMY_TURN: 'enemy_turn',
    CHECK: 'check',
    VICTORY: 'victory',
    DEFEAT: 'defeat',
    TAME_ATTEMPT: 'tame_attempt',
    TAME_SUCCESS: 'tame_success',
    PARTY_FULL: 'party_full',
    RUN: 'run',
    TEXT: 'text',
};

// Type effectiveness: attacker type -> defender type -> multiplier
const TYPE_CHART = {
    fire:      { fire: 0.5, ice: 2.0, lightning: 1.0, earth: 0.5 },
    ice:       { fire: 0.5, ice: 0.5, lightning: 2.0, earth: 1.0 },
    lightning: { fire: 1.0, ice: 0.5, lightning: 0.5, earth: 2.0 },
    earth:     { fire: 2.0, ice: 1.0, lightning: 0.5, earth: 0.5 },
};

// Max party size
const MAX_PARTY = 2;

// Weather types
const Weather = {
    CLEAR: 'clear',
    FOG: 'fog',
    THUNDERSTORM: 'thunderstorm',
};

// Item definitions
const ITEMS = {
    dragon_scales: { name: 'Dragon Scales', desc: 'Tough scales shed by dragons.', stackable: true },
    iron_ore: { name: 'Iron Ore', desc: 'Raw iron for the forge.', stackable: true },
    leather: { name: 'Leather', desc: 'Sturdy Viking leather.', stackable: true },
    tail_fin_blueprint: { name: 'Tail Fin Plans', desc: 'Plans for a prosthetic tail fin.', stackable: false },
};

// Saddle definitions
const SADDLES = {
    lead_lined: {
        name: 'Lead-Lined Saddle',
        desc: 'Immunity to lightning damage.',
        recipe: { iron_ore: 3, dragon_scales: 2 },
        effect: 'lightning_immune',
    },
    lightweight: {
        name: 'Lightweight Frame',
        desc: 'Increases flight speed.',
        recipe: { leather: 2, dragon_scales: 1 },
        effect: 'flight_speed',
    },
    tail_fin: {
        name: 'Tail Fin Prosthetic',
        desc: 'Allows an injured dragon to fly.',
        recipe: { iron_ore: 2, leather: 2, tail_fin_blueprint: 1 },
        effect: 'enable_flight',
    },
};
