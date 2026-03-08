// Tile generation - all tiles are 16x16 canvases drawn programmatically
const Tilesets = {
    tiles: {},

    init() {
        this.generateTiles();
    },

    get(id) {
        return this.tiles[id];
    },

    generateTiles() {
        this.makeTile('grass', (ctx) => {
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.GRASS_DARK;
            // Random grass details
            const spots = [[2,3],[7,1],[12,5],[4,9],[9,11],[14,13],[1,14],[8,7]];
            spots.forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
        });

        this.makeTile('tall_grass', (ctx) => {
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.GRASS_TALL;
            // V-shaped grass blades
            for (let i = 0; i < 4; i++) {
                const bx = 1 + i * 4;
                const by = 4 + (i % 2) * 3;
                ctx.fillRect(bx, by, 1, 4);
                ctx.fillRect(bx + 2, by, 1, 4);
                ctx.fillRect(bx + 1, by + 4, 1, 1);
            }
            ctx.fillStyle = COLORS.GRASS_DARK;
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(3 + i * 5, 2 + i * 3, 1, 1);
            }
        });

        this.makeTile('dirt', (ctx) => {
            ctx.fillStyle = COLORS.DIRT;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.DIRT_DARK;
            const spots = [[3,2],[8,5],[13,9],[1,12],[6,14],[11,1],[5,8]];
            spots.forEach(([x,y]) => ctx.fillRect(x, y, 2, 1));
        });

        this.makeTile('path', (ctx) => {
            ctx.fillStyle = COLORS.PATH;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.DIRT;
            const spots = [[2,4],[9,2],[5,10],[12,8],[7,14],[1,7]];
            spots.forEach(([x,y]) => ctx.fillRect(x, y, 2, 1));
        });

        this.makeTile('water', (ctx) => {
            ctx.fillStyle = COLORS.WATER;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.WATER_LIGHT;
            ctx.fillRect(2, 4, 4, 1);
            ctx.fillRect(10, 8, 3, 1);
            ctx.fillRect(5, 12, 5, 1);
        });

        this.makeTile('sand', (ctx) => {
            ctx.fillStyle = COLORS.SAND;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.DIRT;
            const spots = [[3,3],[10,7],[6,12],[13,2]];
            spots.forEach(([x,y]) => ctx.fillRect(x, y, 1, 1));
        });

        this.makeTile('tree_trunk', (ctx) => {
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.TREE_TRUNK;
            ctx.fillRect(5, 0, 6, 16);
            ctx.fillStyle = '#5a3e1a';
            ctx.fillRect(7, 2, 2, 12);
        });

        this.makeTile('tree_top', (ctx) => {
            ctx.fillStyle = COLORS.TREE_LEAVES;
            ctx.fillRect(1, 3, 14, 13);
            ctx.fillRect(3, 1, 10, 2);
            ctx.fillStyle = COLORS.TREE_LEAVES_LIGHT;
            ctx.fillRect(3, 3, 5, 5);
            ctx.fillRect(6, 6, 4, 3);
        });

        this.makeTile('house_wall', (ctx) => {
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.WOOD_DARK;
            for (let y = 0; y < 16; y += 4) {
                ctx.fillRect(0, y, 16, 1);
            }
            ctx.fillRect(8, 0, 1, 16);
        });

        this.makeTile('house_roof', (ctx) => {
            ctx.fillStyle = COLORS.ROOF;
            ctx.fillRect(0, 4, 16, 12);
            ctx.fillRect(2, 2, 12, 2);
            ctx.fillRect(4, 0, 8, 2);
            ctx.fillStyle = COLORS.ROOF_DARK;
            ctx.fillRect(0, 10, 16, 1);
            ctx.fillRect(2, 6, 12, 1);
        });

        this.makeTile('house_door', (ctx) => {
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(4, 2, 8, 14);
            ctx.fillStyle = '#3a2a1a';
            ctx.fillRect(5, 3, 6, 12);
            ctx.fillStyle = COLORS.PATH;
            ctx.fillRect(10, 8, 1, 2);
        });

        this.makeTile('stone', (ctx) => {
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(0, 0, 8, 8);
            ctx.fillRect(8, 8, 8, 8);
            ctx.fillStyle = COLORS.STONE_LIGHT;
            ctx.fillRect(2, 2, 4, 4);
            ctx.fillRect(10, 10, 4, 4);
        });

        this.makeTile('stone_wall', (ctx) => {
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(1, 1, 6, 6);
            ctx.fillRect(9, 1, 6, 6);
            ctx.fillRect(1, 9, 6, 6);
            ctx.fillRect(9, 9, 6, 6);
        });

        this.makeTile('snow', (ctx) => {
            ctx.fillStyle = COLORS.SNOW;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.SNOW_SHADOW;
            const spots = [[2,5],[8,3],[12,9],[5,13],[10,14]];
            spots.forEach(([x,y]) => ctx.fillRect(x, y, 2, 1));
        });

        this.makeTile('snow_tree', (ctx) => {
            ctx.fillStyle = COLORS.SNOW;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#2a5a3a';
            ctx.fillRect(5, 2, 6, 8);
            ctx.fillRect(3, 5, 10, 4);
            ctx.fillStyle = COLORS.SNOW;
            ctx.fillRect(4, 2, 3, 2);
            ctx.fillRect(9, 4, 2, 2);
            ctx.fillStyle = COLORS.TREE_TRUNK;
            ctx.fillRect(6, 10, 4, 6);
        });

        this.makeTile('cave_floor', (ctx) => {
            ctx.fillStyle = COLORS.CAVE_FLOOR;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.CAVE_WALL;
            const spots = [[3,2],[9,6],[5,11],[12,4],[1,8]];
            spots.forEach(([x,y]) => ctx.fillRect(x, y, 2, 1));
        });

        this.makeTile('cave_wall', (ctx) => {
            ctx.fillStyle = COLORS.CAVE_WALL;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#1a1a2a';
            ctx.fillRect(2, 2, 5, 5);
            ctx.fillRect(9, 8, 5, 5);
        });

        this.makeTile('lava', (ctx) => {
            ctx.fillStyle = COLORS.LAVA;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.LAVA_GLOW;
            ctx.fillRect(2, 3, 5, 3);
            ctx.fillRect(9, 8, 4, 3);
            ctx.fillRect(4, 11, 6, 2);
        });

        this.makeTile('crystal_floor', (ctx) => {
            ctx.fillStyle = '#2a2a4a';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(5, 4, 2, 6);
            ctx.fillRect(10, 6, 2, 5);
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(5, 4, 1, 3);
            ctx.fillRect(10, 6, 1, 2);
        });

        this.makeTile('crystal_wall', (ctx) => {
            ctx.fillStyle = COLORS.CAVE_WALL;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(3, 0, 3, 10);
            ctx.fillRect(10, 2, 3, 12);
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(4, 0, 1, 8);
            ctx.fillRect(11, 2, 1, 10);
        });

        this.makeTile('dock', (ctx) => {
            ctx.fillStyle = COLORS.WATER;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(0, 2, 16, 4);
            ctx.fillRect(0, 10, 16, 4);
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(0, 2, 16, 1);
            ctx.fillRect(0, 10, 16, 1);
        });

        this.makeTile('flower_grass', (ctx) => {
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#e85080';
            ctx.fillRect(3, 5, 2, 2);
            ctx.fillRect(10, 3, 2, 2);
            ctx.fillRect(7, 10, 2, 2);
            ctx.fillStyle = '#e8e840';
            ctx.fillRect(4, 6, 1, 1);
            ctx.fillRect(11, 4, 1, 1);
        });

        this.makeTile('waterfall', (ctx) => {
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = COLORS.WATER_LIGHT;
            ctx.fillRect(4, 0, 8, 16);
            ctx.fillStyle = COLORS.WHITE;
            ctx.fillRect(6, 2, 2, 3);
            ctx.fillRect(8, 7, 2, 3);
            ctx.fillRect(6, 12, 2, 3);
        });
    },

    makeTile(id, drawFn) {
        const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
        const ctx = canvas.getContext('2d');
        drawFn(ctx);
        this.tiles[id] = canvas;
    }
};
