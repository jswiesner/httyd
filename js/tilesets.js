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
        // ── GRASS ──────────────────────────────────────────────
        this.makeTile('grass', (ctx) => {
            // Base fill with mid green
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            // Subtle darker patches for ground variation
            ctx.fillStyle = '#4e9236';
            ctx.fillRect(0, 0, 5, 4);
            ctx.fillRect(9, 6, 5, 5);
            ctx.fillRect(3, 12, 4, 4);
            // Even lighter highlights
            ctx.fillStyle = '#6aae4e';
            ctx.fillRect(6, 1, 3, 3);
            ctx.fillRect(12, 10, 3, 3);
            ctx.fillRect(1, 8, 2, 2);
            // Individual grass blades (dark)
            ctx.fillStyle = COLORS.GRASS_DARK;
            const blades = [[1,2],[3,0],[5,4],[8,1],[10,3],[13,0],[14,5],
                            [2,7],[6,9],[9,6],[12,8],[0,11],[4,13],[7,14],
                            [11,12],[14,15],[3,15],[9,10]];
            blades.forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 2);
            });
            // Tiny bright tips
            ctx.fillStyle = '#7abe5a';
            [[1,1],[5,3],[10,2],[13,0],[6,8],[2,12],[9,10],[14,14]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // ── TALL GRASS ─────────────────────────────────────────
        this.makeTile('tall_grass', (ctx) => {
            // Darker base ground
            ctx.fillStyle = COLORS.GRASS_DARK;
            ctx.fillRect(0, 0, 16, 16);
            // Mid ground layer
            ctx.fillStyle = '#4a8830';
            ctx.fillRect(0, 8, 16, 8);
            // Tall blade clusters - darker at base, lighter at tip
            const bladePositions = [0, 2, 4, 6, 8, 10, 12, 14];
            bladePositions.forEach((bx, i) => {
                const h = 8 + (i % 3) * 2; // heights: 8, 10, 12
                const top = 16 - h;
                // Dark stem base
                ctx.fillStyle = '#2a5a1a';
                ctx.fillRect(bx, 12, 1, 4);
                ctx.fillRect(bx + 1, 13, 1, 3);
                // Mid blade
                ctx.fillStyle = COLORS.GRASS_TALL;
                ctx.fillRect(bx, top + 2, 1, h - 6);
                ctx.fillRect(bx + 1, top + 3, 1, h - 6);
                // Lighter tips
                ctx.fillStyle = '#6aae4e';
                ctx.fillRect(bx, top, 1, 3);
                ctx.fillRect(bx + 1, top + 1, 1, 2);
                // Bright tip pixel
                ctx.fillStyle = '#7abe5a';
                ctx.fillRect(bx, top, 1, 1);
            });
            // Extra wispy blades leaning
            ctx.fillStyle = COLORS.GRASS_TALL;
            ctx.fillRect(3, 3, 1, 1);
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillRect(11, 2, 1, 1);
            ctx.fillRect(10, 3, 1, 1);
        });

        // ── DIRT ───────────────────────────────────────────────
        this.makeTile('dirt', (ctx) => {
            ctx.fillStyle = COLORS.DIRT;
            ctx.fillRect(0, 0, 16, 16);
            // Lighter patches
            ctx.fillStyle = '#c8a46a';
            ctx.fillRect(1, 1, 4, 3);
            ctx.fillRect(10, 5, 3, 3);
            ctx.fillRect(4, 11, 5, 3);
            // Darker soil patches
            ctx.fillStyle = COLORS.DIRT_DARK;
            ctx.fillRect(7, 0, 5, 3);
            ctx.fillRect(0, 7, 4, 4);
            ctx.fillRect(12, 11, 4, 4);
            // Pebbles (small lighter stones)
            ctx.fillStyle = '#a09070';
            [[2,5],[8,3],[13,8],[5,14],[1,13],[11,1],[14,13]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 2, 1);
                ctx.fillRect(x, y+1, 1, 1);
            });
            // Pebble highlights
            ctx.fillStyle = '#c0a880';
            [[2,5],[8,3],[13,8],[5,14]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
            // Crack lines
            ctx.fillStyle = '#7a5e30';
            ctx.fillRect(6, 6, 1, 1);
            ctx.fillRect(7, 7, 1, 1);
            ctx.fillRect(8, 7, 1, 1);
            ctx.fillRect(9, 8, 1, 1);
            ctx.fillRect(3, 9, 1, 1);
            ctx.fillRect(4, 10, 1, 1);
            // Tiny dark specks
            ctx.fillStyle = '#6a4e28';
            [[0,3],[4,7],[9,11],[15,6],[12,14],[7,15]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // ── PATH ───────────────────────────────────────────────
        this.makeTile('path', (ctx) => {
            ctx.fillStyle = COLORS.PATH;
            ctx.fillRect(0, 0, 16, 16);
            // Cobblestone pattern - darker stone outlines
            ctx.fillStyle = COLORS.DIRT_DARK;
            // Row 1
            ctx.fillRect(0, 0, 7, 1);  ctx.fillRect(0, 0, 1, 5);
            ctx.fillRect(7, 0, 1, 5);  ctx.fillRect(0, 4, 8, 1);
            ctx.fillRect(8, 0, 8, 1);  ctx.fillRect(15, 0, 1, 5);
            ctx.fillRect(8, 4, 8, 1);
            // Row 2 (offset)
            ctx.fillRect(0, 5, 1, 5);  ctx.fillRect(4, 5, 1, 5);
            ctx.fillRect(0, 9, 5, 1);
            ctx.fillRect(5, 5, 1, 5);  ctx.fillRect(11, 5, 1, 5);
            ctx.fillRect(5, 9, 7, 1);
            ctx.fillRect(12, 5, 1, 5); ctx.fillRect(12, 9, 4, 1);
            // Row 3
            ctx.fillRect(0, 10, 7, 1); ctx.fillRect(0, 10, 1, 6);
            ctx.fillRect(7, 10, 1, 6); ctx.fillRect(0, 15, 8, 1);
            ctx.fillRect(8, 10, 8, 1); ctx.fillRect(15, 10, 1, 6);
            ctx.fillRect(8, 15, 8, 1);
            // Stone fill variation - lighter stones
            ctx.fillStyle = '#d4b880';
            ctx.fillRect(1, 1, 3, 3);
            ctx.fillRect(6, 6, 3, 3);
            ctx.fillRect(13, 11, 2, 3);
            // Darker stones
            ctx.fillStyle = '#b09058';
            ctx.fillRect(9, 1, 3, 3);
            ctx.fillRect(1, 6, 2, 3);
            ctx.fillRect(1, 11, 3, 3);
            // Highlight on stones (top-left)
            ctx.fillStyle = '#dcc890';
            ctx.fillRect(1, 1, 1, 1);
            ctx.fillRect(9, 1, 1, 1);
            ctx.fillRect(6, 6, 1, 1);
            ctx.fillRect(1, 11, 1, 1);
            ctx.fillRect(9, 11, 1, 1);
        });

        // ── WATER ──────────────────────────────────────────────
        this.makeTile('water', (ctx) => {
            // Deep water base
            ctx.fillStyle = COLORS.WATER_DARK;
            ctx.fillRect(0, 0, 16, 16);
            // Mid water body
            ctx.fillStyle = COLORS.WATER;
            ctx.fillRect(0, 0, 16, 12);
            ctx.fillRect(0, 13, 16, 2);
            // Wave pattern - lighter crests
            ctx.fillStyle = COLORS.WATER_LIGHT;
            // Wave row 1
            ctx.fillRect(1, 3, 4, 1);
            ctx.fillRect(7, 2, 3, 1);
            ctx.fillRect(12, 3, 3, 1);
            // Wave row 2
            ctx.fillRect(3, 7, 5, 1);
            ctx.fillRect(10, 6, 4, 1);
            // Wave row 3
            ctx.fillRect(0, 11, 3, 1);
            ctx.fillRect(6, 10, 4, 1);
            ctx.fillRect(13, 11, 2, 1);
            // Foam/white caps
            ctx.fillStyle = '#8ab8e8';
            ctx.fillRect(2, 2, 2, 1);
            ctx.fillRect(8, 1, 1, 1);
            ctx.fillRect(4, 6, 2, 1);
            ctx.fillRect(11, 5, 2, 1);
            ctx.fillRect(7, 9, 2, 1);
            // Depth darker spots
            ctx.fillStyle = '#2a4a7a';
            ctx.fillRect(5, 5, 2, 2);
            ctx.fillRect(12, 8, 2, 2);
            ctx.fillRect(1, 13, 2, 2);
            // Bright sparkle pixels
            ctx.fillStyle = '#aad0f0';
            ctx.fillRect(3, 2, 1, 1);
            ctx.fillRect(9, 1, 1, 1);
            ctx.fillRect(5, 6, 1, 1);
            ctx.fillRect(14, 10, 1, 1);
        });

        // ── SAND ───────────────────────────────────────────────
        this.makeTile('sand', (ctx) => {
            ctx.fillStyle = COLORS.SAND;
            ctx.fillRect(0, 0, 16, 16);
            // Warm tone variation
            ctx.fillStyle = '#e0d090';
            ctx.fillRect(2, 0, 5, 4);
            ctx.fillRect(10, 8, 5, 5);
            ctx.fillRect(0, 12, 4, 4);
            // Cooler shadow variation
            ctx.fillStyle = '#c8b878';
            ctx.fillRect(8, 1, 4, 3);
            ctx.fillRect(0, 5, 6, 4);
            ctx.fillRect(12, 13, 4, 3);
            // Ripple lines
            ctx.fillStyle = '#baa868';
            ctx.fillRect(1, 4, 6, 1);
            ctx.fillRect(8, 7, 7, 1);
            ctx.fillRect(2, 11, 5, 1);
            ctx.fillRect(10, 14, 5, 1);
            // Small pebbles
            ctx.fillStyle = '#a09060';
            [[3,3],[10,7],[6,12],[13,2],[1,9]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 2, 1);
            });
            // Tiny shell shapes
            ctx.fillStyle = '#e8e0c0';
            ctx.fillRect(5, 6, 2, 1);
            ctx.fillRect(5, 7, 1, 1);
            ctx.fillRect(12, 10, 1, 2);
            ctx.fillRect(13, 11, 1, 1);
            // Shell dark outline
            ctx.fillStyle = '#b0a070';
            ctx.fillRect(4, 6, 1, 2);
            ctx.fillRect(11, 10, 1, 2);
            // Speckles
            ctx.fillStyle = COLORS.DIRT;
            [[0,2],[7,5],[14,9],[9,14],[4,15]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // ── TREE TRUNK ─────────────────────────────────────────
        this.makeTile('tree_trunk', (ctx) => {
            // Grass background
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            // Grass detail
            ctx.fillStyle = COLORS.GRASS_DARK;
            [[0,3],[2,7],[13,5],[14,10],[1,14],[12,13]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 2);
            });
            // Root flare at base
            ctx.fillStyle = '#5a3e1a';
            ctx.fillRect(3, 13, 1, 3);
            ctx.fillRect(4, 14, 1, 2);
            ctx.fillRect(11, 14, 1, 2);
            ctx.fillRect(12, 13, 1, 3);
            // Main trunk
            ctx.fillStyle = COLORS.TREE_TRUNK;
            ctx.fillRect(5, 0, 6, 16);
            // Bark dark side (right shadow)
            ctx.fillStyle = '#5a3e1a';
            ctx.fillRect(10, 0, 1, 16);
            ctx.fillRect(9, 0, 1, 16);
            // Bark lighter center
            ctx.fillStyle = '#7e5e3a';
            ctx.fillRect(6, 0, 2, 16);
            // Bark texture lines (horizontal)
            ctx.fillStyle = '#5a3e1a';
            ctx.fillRect(5, 2, 5, 1);
            ctx.fillRect(5, 6, 5, 1);
            ctx.fillRect(5, 10, 5, 1);
            ctx.fillRect(5, 14, 5, 1);
            // Knot
            ctx.fillStyle = '#4a2e0a';
            ctx.fillRect(7, 4, 2, 2);
            ctx.fillStyle = '#5a3e1a';
            ctx.fillRect(7, 4, 1, 1);
            // Bark highlight
            ctx.fillStyle = '#8e6e4a';
            ctx.fillRect(6, 1, 1, 1);
            ctx.fillRect(6, 5, 1, 1);
            ctx.fillRect(6, 8, 1, 1);
            ctx.fillRect(6, 12, 1, 1);
            // Root ground shadow
            ctx.fillStyle = COLORS.GRASS_DARK;
            ctx.fillRect(3, 15, 10, 1);
        });

        // ── TREE TOP ───────────────────────────────────────────
        this.makeTile('tree_top', (ctx) => {
            // Deepest leaf layer (shadow)
            ctx.fillStyle = '#1a5a1a';
            ctx.fillRect(1, 4, 14, 12);
            ctx.fillRect(3, 2, 10, 2);
            ctx.fillRect(5, 0, 6, 2);
            // Mid leaf layer
            ctx.fillStyle = COLORS.TREE_LEAVES;
            ctx.fillRect(2, 4, 12, 10);
            ctx.fillRect(3, 2, 10, 2);
            ctx.fillRect(5, 1, 6, 1);
            // Lighter leaf clusters (top-left lit)
            ctx.fillStyle = COLORS.TREE_LEAVES_LIGHT;
            ctx.fillRect(3, 3, 4, 3);
            ctx.fillRect(5, 1, 3, 2);
            ctx.fillRect(2, 6, 3, 3);
            ctx.fillRect(7, 5, 3, 2);
            // Brightest highlights
            ctx.fillStyle = '#4aa84a';
            ctx.fillRect(4, 3, 2, 2);
            ctx.fillRect(6, 1, 2, 1);
            ctx.fillRect(3, 6, 2, 2);
            ctx.fillRect(8, 5, 1, 1);
            // Dark depth gaps (shadow holes in canopy)
            ctx.fillStyle = '#1a4a1a';
            ctx.fillRect(9, 8, 3, 2);
            ctx.fillRect(5, 11, 2, 2);
            ctx.fillRect(11, 5, 2, 2);
            ctx.fillRect(3, 13, 2, 1);
            ctx.fillRect(10, 12, 3, 2);
            // Single dark leaf pixels for texture
            ctx.fillStyle = '#1a5a1a';
            [[2,5],[6,7],[4,10],[8,3],[12,7],[13,11],[7,13],[1,10]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
            // Bottom edge darker for depth
            ctx.fillStyle = '#1a4a1a';
            ctx.fillRect(1, 14, 14, 2);
            ctx.fillRect(2, 13, 2, 1);
            ctx.fillRect(12, 13, 2, 1);
        });

        // ── HOUSE WALL ─────────────────────────────────────────
        this.makeTile('house_wall', (ctx) => {
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(0, 0, 16, 16);
            // Plank separators (horizontal)
            ctx.fillStyle = COLORS.WOOD_DARK;
            for (let y = 0; y < 16; y += 4) {
                ctx.fillRect(0, y, 16, 1);
            }
            // Vertical stud
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(8, 0, 1, 16);
            // Wood grain on each plank
            ctx.fillStyle = '#8a6a3a';
            // Plank 1
            ctx.fillRect(1, 2, 3, 1);
            ctx.fillRect(5, 3, 2, 1);
            ctx.fillRect(10, 2, 4, 1);
            // Plank 2
            ctx.fillRect(2, 6, 4, 1);
            ctx.fillRect(11, 5, 3, 1);
            ctx.fillRect(10, 7, 2, 1);
            // Plank 3
            ctx.fillRect(1, 10, 2, 1);
            ctx.fillRect(4, 11, 3, 1);
            ctx.fillRect(12, 10, 3, 1);
            // Plank 4
            ctx.fillRect(3, 14, 4, 1);
            ctx.fillRect(10, 14, 3, 1);
            // Light grain highlights
            ctx.fillStyle = '#ae8a5a';
            ctx.fillRect(2, 1, 2, 1);
            ctx.fillRect(11, 1, 2, 1);
            ctx.fillRect(3, 5, 2, 1);
            ctx.fillRect(13, 6, 1, 1);
            ctx.fillRect(1, 9, 2, 1);
            ctx.fillRect(10, 9, 2, 1);
            ctx.fillRect(2, 13, 2, 1);
            ctx.fillRect(12, 13, 2, 1);
            // Nail heads
            ctx.fillStyle = '#5a5a6a';
            [[1,1],[14,1],[1,5],[14,5],[1,9],[14,9],[1,13],[14,13]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
            // Nail highlights
            ctx.fillStyle = '#8a8a9a';
            [[1,1],[14,5],[1,9],[14,13]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // ── HOUSE ROOF ─────────────────────────────────────────
        this.makeTile('house_roof', (ctx) => {
            // Roof base
            ctx.fillStyle = COLORS.ROOF;
            ctx.fillRect(0, 4, 16, 12);
            ctx.fillRect(2, 2, 12, 2);
            ctx.fillRect(4, 0, 8, 2);
            // Ridge cap at top
            ctx.fillStyle = '#9a4a3a';
            ctx.fillRect(4, 0, 8, 1);
            // Shingle rows (overlapping pattern)
            ctx.fillStyle = COLORS.ROOF_DARK;
            // Row dividers
            ctx.fillRect(2, 5, 12, 1);
            ctx.fillRect(0, 8, 16, 1);
            ctx.fillRect(0, 11, 16, 1);
            ctx.fillRect(0, 14, 16, 1);
            // Shingle vertical lines (staggered)
            // Row 1
            ctx.fillRect(5, 2, 1, 3);
            ctx.fillRect(8, 2, 1, 3);
            ctx.fillRect(11, 2, 1, 3);
            // Row 2
            ctx.fillRect(3, 6, 1, 2);
            ctx.fillRect(7, 6, 1, 2);
            ctx.fillRect(11, 6, 1, 2);
            // Row 3 (offset)
            ctx.fillRect(1, 9, 1, 2);
            ctx.fillRect(5, 9, 1, 2);
            ctx.fillRect(9, 9, 1, 2);
            ctx.fillRect(13, 9, 1, 2);
            // Row 4
            ctx.fillRect(3, 12, 1, 2);
            ctx.fillRect(7, 12, 1, 2);
            ctx.fillRect(11, 12, 1, 2);
            // Shingle weathering/highlights
            ctx.fillStyle = '#9a4a3a';
            ctx.fillRect(6, 3, 2, 1);
            ctx.fillRect(9, 6, 2, 1);
            ctx.fillRect(2, 9, 2, 1);
            ctx.fillRect(10, 12, 2, 1);
            ctx.fillRect(4, 13, 2, 1);
            // Darker weathering spots
            ctx.fillStyle = '#5a2218';
            ctx.fillRect(10, 7, 1, 1);
            ctx.fillRect(2, 10, 1, 1);
            ctx.fillRect(14, 13, 1, 1);
            ctx.fillRect(6, 15, 1, 1);
        });

        // ── HOUSE DOOR ─────────────────────────────────────────
        this.makeTile('house_door', (ctx) => {
            // Wall background
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(0, 0, 16, 16);
            // Wall wood grain
            ctx.fillStyle = '#8a6a3a';
            ctx.fillRect(1, 2, 2, 1);
            ctx.fillRect(13, 5, 2, 1);
            // Wall plank lines
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(0, 0, 16, 1);
            ctx.fillRect(0, 4, 4, 1);
            ctx.fillRect(12, 4, 4, 1);
            // Step at bottom
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(3, 14, 10, 2);
            ctx.fillStyle = COLORS.STONE_LIGHT;
            ctx.fillRect(3, 14, 10, 1);
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(3, 14, 1, 2);
            ctx.fillRect(12, 14, 1, 2);
            // Door frame
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(3, 1, 10, 13);
            // Door inner frame
            ctx.fillStyle = '#5a3a1a';
            ctx.fillRect(4, 1, 1, 13);
            ctx.fillRect(11, 1, 1, 13);
            ctx.fillRect(4, 1, 8, 1);
            // Door fill
            ctx.fillStyle = '#4a2a12';
            ctx.fillRect(5, 2, 6, 12);
            // Door panels
            ctx.fillStyle = '#3a2010';
            ctx.fillRect(5, 3, 6, 4);
            ctx.fillRect(5, 9, 6, 4);
            // Panel inner lighter
            ctx.fillStyle = '#5a3a20';
            ctx.fillRect(6, 4, 4, 2);
            ctx.fillRect(6, 10, 4, 2);
            // Door handle
            ctx.fillStyle = '#c8b060';
            ctx.fillRect(10, 8, 1, 2);
            // Handle highlight
            ctx.fillStyle = '#e0d080';
            ctx.fillRect(10, 8, 1, 1);
            // Handle plate
            ctx.fillStyle = '#a09040';
            ctx.fillRect(10, 7, 1, 1);
            ctx.fillRect(10, 10, 1, 1);
        });

        // ── STONE ──────────────────────────────────────────────
        this.makeTile('stone', (ctx) => {
            // Base mid stone
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(0, 0, 16, 16);
            // Varied stone shapes
            ctx.fillStyle = COLORS.STONE_DARK;
            // Stone 1 (top-left)
            ctx.fillRect(0, 0, 7, 7);
            // Stone 2 (top-right)
            ctx.fillRect(8, 0, 8, 6);
            // Stone 3 (bottom-left)
            ctx.fillRect(0, 8, 6, 8);
            // Stone 4 (bottom-right)
            ctx.fillRect(7, 7, 9, 9);
            // Lighter faces
            ctx.fillStyle = COLORS.STONE_LIGHT;
            ctx.fillRect(1, 1, 4, 4);
            ctx.fillRect(9, 1, 5, 3);
            ctx.fillRect(1, 9, 3, 5);
            ctx.fillRect(8, 8, 5, 5);
            // Highlight edges (top-left of each stone)
            ctx.fillStyle = '#bbbbd8';
            ctx.fillRect(1, 1, 4, 1);
            ctx.fillRect(1, 1, 1, 4);
            ctx.fillRect(9, 1, 5, 1);
            ctx.fillRect(9, 1, 1, 3);
            ctx.fillRect(1, 9, 3, 1);
            ctx.fillRect(1, 9, 1, 5);
            ctx.fillRect(8, 8, 5, 1);
            ctx.fillRect(8, 8, 1, 5);
            // Cracks
            ctx.fillStyle = '#4a4a6a';
            ctx.fillRect(3, 3, 1, 1);
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillRect(11, 3, 1, 1);
            ctx.fillRect(10, 11, 1, 1);
            ctx.fillRect(11, 12, 1, 1);
            ctx.fillRect(2, 12, 1, 1);
            // Moss spots (green tint)
            ctx.fillStyle = '#6a8a6a';
            ctx.fillRect(5, 5, 2, 1);
            ctx.fillRect(0, 7, 2, 1);
            ctx.fillRect(13, 13, 2, 1);
        });

        // ── STONE WALL ─────────────────────────────────────────
        this.makeTile('stone_wall', (ctx) => {
            // Mortar background
            ctx.fillStyle = '#4a4a60';
            ctx.fillRect(0, 0, 16, 16);
            // Stone blocks with varied sizes
            // Row 1
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(0, 0, 5, 4);
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(6, 0, 4, 4);
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(11, 0, 5, 4);
            // Row 2 (offset)
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(0, 5, 3, 3);
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(4, 5, 5, 3);
            ctx.fillStyle = '#7a7a98';
            ctx.fillRect(10, 5, 3, 3);
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(14, 5, 2, 3);
            // Row 3
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(0, 9, 4, 3);
            ctx.fillStyle = '#7a7a98';
            ctx.fillRect(5, 9, 4, 3);
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(10, 9, 6, 3);
            // Row 4 (offset)
            ctx.fillStyle = '#7a7a98';
            ctx.fillRect(0, 13, 6, 3);
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(7, 13, 5, 3);
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(13, 13, 3, 3);
            // Highlight edges on blocks
            ctx.fillStyle = COLORS.STONE_LIGHT;
            ctx.fillRect(0, 0, 5, 1);
            ctx.fillRect(11, 0, 5, 1);
            ctx.fillRect(4, 5, 5, 1);
            ctx.fillRect(0, 9, 4, 1);
            ctx.fillRect(10, 9, 6, 1);
            ctx.fillRect(0, 13, 6, 1);
            ctx.fillRect(13, 13, 3, 1);
            // Dark bottom edges
            ctx.fillStyle = '#3a3a50';
            ctx.fillRect(6, 3, 4, 1);
            ctx.fillRect(0, 7, 3, 1);
            ctx.fillRect(10, 7, 3, 1);
            ctx.fillRect(5, 11, 4, 1);
            ctx.fillRect(7, 15, 5, 1);
        });

        // ── SNOW ───────────────────────────────────────────────
        this.makeTile('snow', (ctx) => {
            ctx.fillStyle = COLORS.SNOW;
            ctx.fillRect(0, 0, 16, 16);
            // Subtle blue shadows
            ctx.fillStyle = COLORS.SNOW_SHADOW;
            ctx.fillRect(3, 4, 4, 2);
            ctx.fillRect(10, 8, 4, 2);
            ctx.fillRect(1, 12, 3, 2);
            ctx.fillRect(8, 1, 3, 2);
            // Deeper shadow spots
            ctx.fillStyle = '#b0b0c8';
            ctx.fillRect(4, 5, 2, 1);
            ctx.fillRect(11, 9, 2, 1);
            ctx.fillRect(2, 13, 1, 1);
            // Footprint-like impressions
            ctx.fillStyle = COLORS.SNOW_SHADOW;
            ctx.fillRect(6, 10, 2, 1);
            ctx.fillRect(7, 11, 2, 1);
            ctx.fillRect(8, 13, 2, 1);
            ctx.fillRect(9, 14, 2, 1);
            // Sparkle highlights
            ctx.fillStyle = '#ffffff';
            [[2,2],[7,1],[12,4],[5,8],[14,6],[1,10],[9,12],[13,14],[6,15],[3,7]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
            // Subtle warm tint variation
            ctx.fillStyle = '#e8e0e8';
            ctx.fillRect(0, 0, 4, 3);
            ctx.fillRect(12, 11, 4, 3);
        });

        // ── SNOW TREE ──────────────────────────────────────────
        this.makeTile('snow_tree', (ctx) => {
            // Snow ground
            ctx.fillStyle = COLORS.SNOW;
            ctx.fillRect(0, 0, 16, 16);
            // Snow shadow under tree
            ctx.fillStyle = COLORS.SNOW_SHADOW;
            ctx.fillRect(2, 13, 12, 3);
            // Tree trunk
            ctx.fillStyle = COLORS.TREE_TRUNK;
            ctx.fillRect(6, 9, 4, 7);
            // Trunk bark
            ctx.fillStyle = '#5a3e1a';
            ctx.fillRect(9, 9, 1, 7);
            ctx.fillRect(7, 11, 1, 1);
            ctx.fillRect(7, 14, 1, 1);
            // Trunk highlight
            ctx.fillStyle = '#7e5e3a';
            ctx.fillRect(6, 9, 1, 7);
            // Evergreen foliage layers (dark)
            ctx.fillStyle = '#1a4a2a';
            // Top tier
            ctx.fillRect(6, 0, 4, 3);
            // Mid tier
            ctx.fillRect(4, 3, 8, 3);
            // Bottom tier
            ctx.fillRect(2, 6, 12, 4);
            // Lighter foliage
            ctx.fillStyle = '#2a5a3a';
            ctx.fillRect(6, 0, 3, 2);
            ctx.fillRect(5, 3, 6, 2);
            ctx.fillRect(3, 6, 10, 3);
            // Snow on branches (white)
            ctx.fillStyle = COLORS.SNOW;
            ctx.fillRect(6, 0, 3, 1);
            ctx.fillRect(5, 3, 5, 1);
            ctx.fillRect(3, 6, 8, 1);
            // Extra snow clumps
            ctx.fillStyle = '#e0e0f0';
            ctx.fillRect(4, 4, 2, 1);
            ctx.fillRect(10, 3, 1, 1);
            ctx.fillRect(11, 6, 2, 1);
            ctx.fillRect(2, 7, 1, 1);
            // Icicles hanging from branches
            ctx.fillStyle = '#c8d8f0';
            ctx.fillRect(4, 5, 1, 2);
            ctx.fillRect(10, 4, 1, 2);
            ctx.fillRect(3, 9, 1, 2);
            ctx.fillRect(12, 8, 1, 2);
            // Icicle tips
            ctx.fillStyle = '#b0c0e0';
            ctx.fillRect(4, 6, 1, 1);
            ctx.fillRect(10, 5, 1, 1);
            ctx.fillRect(3, 10, 1, 1);
            ctx.fillRect(12, 9, 1, 1);
            // Ground sparkles
            ctx.fillStyle = '#ffffff';
            [[1,14],[5,15],[10,13],[14,15]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // ── CAVE FLOOR ─────────────────────────────────────────
        this.makeTile('cave_floor', (ctx) => {
            ctx.fillStyle = COLORS.CAVE_FLOOR;
            ctx.fillRect(0, 0, 16, 16);
            // Lighter rocky patches
            ctx.fillStyle = '#4a4a5a';
            ctx.fillRect(1, 0, 5, 3);
            ctx.fillRect(9, 5, 4, 4);
            ctx.fillRect(2, 10, 4, 3);
            ctx.fillRect(12, 12, 3, 3);
            // Darker crevice areas
            ctx.fillStyle = '#2a2a38';
            ctx.fillRect(7, 1, 3, 2);
            ctx.fillRect(0, 6, 3, 2);
            ctx.fillRect(13, 3, 2, 2);
            ctx.fillRect(6, 13, 3, 2);
            // Rocky bumps/debris
            ctx.fillStyle = '#5a5a6a';
            [[3,2],[10,6],[5,11],[13,13],[8,8]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 2, 1);
                ctx.fillRect(x, y+1, 1, 1);
            });
            // Debris highlight
            ctx.fillStyle = '#6a6a7a';
            [[3,2],[10,6],[5,11]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
            // Puddle spots (dark reflective)
            ctx.fillStyle = '#2a3a4a';
            ctx.fillRect(6, 4, 3, 2);
            ctx.fillRect(11, 10, 2, 2);
            // Puddle highlight
            ctx.fillStyle = '#4a5a6a';
            ctx.fillRect(6, 4, 2, 1);
            ctx.fillRect(11, 10, 1, 1);
            // Scattered pebbles
            ctx.fillStyle = '#50506a';
            [[0,4],[14,7],[1,9],[8,15],[15,0]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // ── CAVE WALL ──────────────────────────────────────────
        this.makeTile('cave_wall', (ctx) => {
            ctx.fillStyle = COLORS.CAVE_WALL;
            ctx.fillRect(0, 0, 16, 16);
            // Depth shading - darker at top (ceiling receding)
            ctx.fillStyle = '#1a1a28';
            ctx.fillRect(0, 0, 16, 4);
            // Mid-tone rock face
            ctx.fillStyle = '#323244';
            ctx.fillRect(0, 4, 16, 8);
            // Lighter bottom edge
            ctx.fillStyle = '#3a3a4e';
            ctx.fillRect(0, 12, 16, 4);
            // Rock face detail - large shapes
            ctx.fillStyle = '#2a2a3a';
            ctx.fillRect(1, 5, 5, 4);
            ctx.fillRect(8, 6, 6, 5);
            // Rock face lighter bumps
            ctx.fillStyle = '#424258';
            ctx.fillRect(3, 6, 2, 2);
            ctx.fillRect(10, 7, 3, 2);
            ctx.fillRect(1, 13, 3, 2);
            ctx.fillRect(12, 13, 3, 2);
            // Crack patterns
            ctx.fillStyle = '#1a1a2a';
            ctx.fillRect(7, 5, 1, 1);
            ctx.fillRect(7, 6, 1, 1);
            ctx.fillRect(6, 7, 1, 1);
            ctx.fillRect(6, 8, 1, 1);
            ctx.fillRect(5, 9, 1, 1);
            // Another crack
            ctx.fillRect(12, 3, 1, 1);
            ctx.fillRect(13, 4, 1, 1);
            ctx.fillRect(13, 5, 1, 1);
            ctx.fillRect(14, 6, 1, 1);
            // Stalactite silhouettes hanging from top
            ctx.fillStyle = '#1a1a28';
            ctx.fillRect(3, 0, 2, 5);
            ctx.fillRect(3, 5, 1, 2);
            ctx.fillRect(9, 0, 2, 4);
            ctx.fillRect(9, 4, 1, 2);
            ctx.fillRect(14, 0, 1, 3);
            // Stalactite tips
            ctx.fillStyle = '#222238';
            ctx.fillRect(3, 6, 1, 1);
            ctx.fillRect(9, 5, 1, 1);
        });

        // ── LAVA ───────────────────────────────────────────────
        this.makeTile('lava', (ctx) => {
            // Dark cooling crust base
            ctx.fillStyle = '#8a2010';
            ctx.fillRect(0, 0, 16, 16);
            // Main lava body
            ctx.fillStyle = COLORS.LAVA;
            ctx.fillRect(1, 1, 14, 14);
            // Glow areas
            ctx.fillStyle = COLORS.LAVA_GLOW;
            ctx.fillRect(2, 2, 5, 4);
            ctx.fillRect(9, 7, 5, 4);
            ctx.fillRect(3, 10, 4, 3);
            ctx.fillRect(7, 3, 4, 3);
            // Bright hotspots (yellow-white)
            ctx.fillStyle = '#f8a840';
            ctx.fillRect(3, 3, 3, 2);
            ctx.fillRect(10, 8, 3, 2);
            ctx.fillRect(4, 11, 2, 1);
            ctx.fillRect(8, 4, 2, 1);
            // Brightest centers
            ctx.fillStyle = '#f8d060';
            ctx.fillRect(4, 3, 1, 1);
            ctx.fillRect(11, 8, 1, 1);
            ctx.fillRect(5, 11, 1, 1);
            // Cooling crust edges (dark veins)
            ctx.fillStyle = '#6a1808';
            ctx.fillRect(0, 6, 16, 1);
            ctx.fillRect(7, 0, 1, 16);
            ctx.fillRect(0, 0, 16, 1);
            ctx.fillRect(0, 15, 16, 1);
            ctx.fillRect(0, 0, 1, 16);
            ctx.fillRect(15, 0, 1, 16);
            // Crust texture
            ctx.fillStyle = '#8a2818';
            ctx.fillRect(5, 6, 2, 1);
            ctx.fillRect(11, 6, 3, 1);
            ctx.fillRect(7, 0, 1, 3);
            ctx.fillRect(7, 12, 1, 3);
            // Ember particles (bright specks)
            ctx.fillStyle = '#f8e868';
            [[1,4],[6,1],[12,5],[14,12],[2,13],[9,2]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
        });

        // ── CRYSTAL FLOOR ──────────────────────────────────────
        this.makeTile('crystal_floor', (ctx) => {
            // Dark cave floor base
            ctx.fillStyle = '#2a2a4a';
            ctx.fillRect(0, 0, 16, 16);
            // Floor texture variation
            ctx.fillStyle = '#32325a';
            ctx.fillRect(0, 0, 6, 5);
            ctx.fillRect(10, 8, 6, 4);
            ctx.fillRect(3, 12, 5, 4);
            // Crystal shard 1 (tall)
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(4, 3, 2, 7);
            ctx.fillRect(5, 2, 1, 1);
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(4, 3, 1, 4);
            ctx.fillRect(5, 2, 1, 1);
            // Crystal shard 2
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(10, 5, 2, 6);
            ctx.fillRect(11, 4, 1, 1);
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(10, 5, 1, 3);
            ctx.fillRect(11, 4, 1, 1);
            // Crystal shard 3 (small)
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(1, 8, 1, 4);
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(1, 8, 1, 2);
            // Crystal shard 4 (small, tilted)
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(13, 1, 1, 3);
            ctx.fillRect(14, 2, 1, 2);
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(13, 1, 1, 1);
            // Scattered gem fragments on floor
            ctx.fillStyle = '#8a6ae8';
            ctx.fillRect(7, 12, 1, 1);
            ctx.fillRect(14, 8, 1, 1);
            ctx.fillRect(0, 5, 1, 1);
            // Gem highlights
            ctx.fillStyle = '#aa8af8';
            ctx.fillRect(7, 12, 1, 1);
            // Floor light reflections (glow from crystals)
            ctx.fillStyle = '#3a3a6a';
            ctx.fillRect(3, 10, 3, 1);
            ctx.fillRect(9, 11, 3, 1);
            ctx.fillRect(5, 1, 2, 1);
        });

        // ── CRYSTAL WALL ───────────────────────────────────────
        this.makeTile('crystal_wall', (ctx) => {
            ctx.fillStyle = COLORS.CAVE_WALL;
            ctx.fillRect(0, 0, 16, 16);
            // Wall depth shading
            ctx.fillStyle = '#222236';
            ctx.fillRect(0, 0, 16, 4);
            ctx.fillStyle = '#2e2e44';
            ctx.fillRect(0, 4, 16, 8);
            // Crystal formation 1 (large, left)
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(2, 1, 3, 11);
            ctx.fillRect(1, 5, 1, 6);
            ctx.fillRect(5, 3, 1, 7);
            // Faceted highlight
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(3, 1, 1, 9);
            ctx.fillRect(2, 1, 2, 1);
            // Facet edge
            ctx.fillStyle = '#5a8ac8';
            ctx.fillRect(4, 2, 1, 8);
            ctx.fillRect(1, 5, 1, 4);
            // Crystal formation 2 (right)
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(10, 3, 3, 12);
            ctx.fillRect(9, 7, 1, 7);
            ctx.fillRect(13, 5, 1, 8);
            // Faceted highlight
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(11, 3, 1, 10);
            ctx.fillRect(10, 3, 2, 1);
            // Facet edge
            ctx.fillStyle = '#5a8ac8';
            ctx.fillRect(12, 4, 1, 9);
            ctx.fillRect(9, 7, 1, 5);
            // Small crystal shard (center)
            ctx.fillStyle = COLORS.CRYSTAL;
            ctx.fillRect(7, 8, 1, 5);
            ctx.fillStyle = COLORS.CRYSTAL_GLOW;
            ctx.fillRect(7, 8, 1, 2);
            // Glow effect on surrounding wall
            ctx.fillStyle = '#3a3a5a';
            ctx.fillRect(0, 4, 2, 7);
            ctx.fillRect(5, 2, 2, 8);
            ctx.fillRect(8, 6, 2, 7);
            ctx.fillRect(13, 4, 3, 8);
            // Color variation - purple tint crystal
            ctx.fillStyle = '#8a7ae8';
            ctx.fillRect(3, 10, 1, 2);
            ctx.fillRect(11, 12, 1, 3);
            // Bright sparkle points
            ctx.fillStyle = '#ddeeff';
            ctx.fillRect(3, 2, 1, 1);
            ctx.fillRect(11, 4, 1, 1);
            ctx.fillRect(7, 8, 1, 1);
        });

        // ── DOCK ───────────────────────────────────────────────
        this.makeTile('dock', (ctx) => {
            // Water underneath
            ctx.fillStyle = COLORS.WATER;
            ctx.fillRect(0, 0, 16, 16);
            // Water detail
            ctx.fillStyle = COLORS.WATER_DARK;
            ctx.fillRect(2, 7, 3, 1);
            ctx.fillRect(10, 8, 4, 1);
            ctx.fillStyle = COLORS.WATER_LIGHT;
            ctx.fillRect(1, 1, 2, 1);
            ctx.fillRect(12, 0, 2, 1);
            ctx.fillRect(5, 8, 2, 1);
            // Plank 1
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(0, 2, 16, 3);
            // Plank 2
            ctx.fillRect(0, 6, 16, 3);
            // Plank 3
            ctx.fillRect(0, 10, 16, 3);
            // Plank 4
            ctx.fillRect(0, 14, 16, 2);
            // Plank gaps (water showing through)
            ctx.fillStyle = COLORS.WATER_DARK;
            ctx.fillRect(0, 5, 16, 1);
            ctx.fillRect(0, 9, 16, 1);
            ctx.fillRect(0, 13, 16, 1);
            // Wood grain on planks
            ctx.fillStyle = '#8a6a3a';
            ctx.fillRect(2, 3, 4, 1);
            ctx.fillRect(11, 3, 3, 1);
            ctx.fillRect(1, 7, 3, 1);
            ctx.fillRect(8, 7, 5, 1);
            ctx.fillRect(3, 11, 4, 1);
            ctx.fillRect(12, 11, 3, 1);
            ctx.fillRect(5, 14, 4, 1);
            // Dark plank edges
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(0, 2, 16, 1);
            ctx.fillRect(0, 6, 16, 1);
            ctx.fillRect(0, 10, 16, 1);
            ctx.fillRect(0, 14, 16, 1);
            // Nail details
            ctx.fillStyle = '#5a5a6a';
            [[2,2],[13,2],[2,6],[13,6],[2,10],[13,10],[2,14],[13,14]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
            // Nail highlights
            ctx.fillStyle = '#7a7a8a';
            [[2,2],[13,6],[2,10],[13,14]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 1);
            });
            // Plank lighter highlight
            ctx.fillStyle = '#ae8a5a';
            ctx.fillRect(6, 3, 2, 1);
            ctx.fillRect(5, 7, 2, 1);
            ctx.fillRect(9, 11, 2, 1);
        });

        // ── FLOWER GRASS ───────────────────────────────────────
        this.makeTile('flower_grass', (ctx) => {
            // Grass base
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            // Grass variation
            ctx.fillStyle = '#4e9236';
            ctx.fillRect(0, 4, 4, 4);
            ctx.fillRect(8, 10, 5, 4);
            ctx.fillRect(12, 0, 4, 3);
            // Grass blade details
            ctx.fillStyle = COLORS.GRASS_DARK;
            [[0,2],[5,1],[10,0],[14,3],[1,8],[7,7],[13,9],[3,13],[9,14]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 2);
            });
            // Flower stems
            ctx.fillStyle = '#3a7a2a';
            ctx.fillRect(3, 7, 1, 3);
            ctx.fillRect(10, 4, 1, 3);
            ctx.fillRect(7, 11, 1, 3);
            ctx.fillRect(13, 6, 1, 2);
            // Red flower (4-petal)
            ctx.fillStyle = '#e85080';
            ctx.fillRect(2, 5, 3, 1);
            ctx.fillRect(3, 4, 1, 3);
            ctx.fillStyle = '#f06090';
            ctx.fillRect(2, 4, 1, 1);
            ctx.fillRect(4, 4, 1, 1);
            // Yellow flower center
            ctx.fillStyle = '#e8e840';
            ctx.fillRect(3, 5, 1, 1);
            // Blue/purple flower
            ctx.fillStyle = '#6868d8';
            ctx.fillRect(9, 2, 3, 1);
            ctx.fillRect(10, 1, 1, 3);
            ctx.fillStyle = '#8080e8';
            ctx.fillRect(9, 1, 1, 1);
            ctx.fillRect(11, 1, 1, 1);
            // Purple flower center
            ctx.fillStyle = '#e8e840';
            ctx.fillRect(10, 2, 1, 1);
            // White daisy
            ctx.fillStyle = '#e8e8e0';
            ctx.fillRect(6, 10, 3, 1);
            ctx.fillRect(7, 9, 1, 3);
            ctx.fillStyle = '#f8f0e0';
            ctx.fillRect(6, 9, 1, 1);
            ctx.fillRect(8, 9, 1, 1);
            // Daisy center
            ctx.fillStyle = '#e8c820';
            ctx.fillRect(7, 10, 1, 1);
            // Small yellow flower
            ctx.fillStyle = '#e8d040';
            ctx.fillRect(13, 5, 1, 1);
            ctx.fillRect(12, 6, 1, 1);
            ctx.fillRect(14, 6, 1, 1);
            ctx.fillStyle = '#e8a020';
            ctx.fillRect(13, 6, 1, 1);
            // Leaf details
            ctx.fillStyle = '#4a9e3e';
            ctx.fillRect(2, 7, 1, 1);
            ctx.fillRect(4, 7, 1, 1);
            ctx.fillRect(9, 4, 1, 1);
            ctx.fillRect(11, 4, 1, 1);
            ctx.fillRect(6, 12, 1, 1);
            ctx.fillRect(8, 12, 1, 1);
        });

        // ── WATERFALL ──────────────────────────────────────────
        this.makeTile('waterfall', (ctx) => {
            // Stone cliff sides
            ctx.fillStyle = COLORS.STONE_DARK;
            ctx.fillRect(0, 0, 4, 16);
            ctx.fillRect(12, 0, 4, 16);
            // Cliff detail
            ctx.fillStyle = '#4a4a68';
            ctx.fillRect(0, 0, 3, 5);
            ctx.fillRect(13, 3, 3, 5);
            ctx.fillRect(0, 8, 3, 4);
            ctx.fillRect(13, 10, 3, 4);
            ctx.fillStyle = COLORS.STONE;
            ctx.fillRect(1, 1, 1, 3);
            ctx.fillRect(14, 4, 1, 3);
            ctx.fillRect(1, 9, 1, 2);
            ctx.fillRect(14, 11, 1, 2);
            // Water cascade (mid blue)
            ctx.fillStyle = COLORS.WATER_LIGHT;
            ctx.fillRect(4, 0, 8, 16);
            // Cascading water lines (darker streaks)
            ctx.fillStyle = COLORS.WATER;
            ctx.fillRect(5, 0, 1, 16);
            ctx.fillRect(8, 0, 1, 16);
            ctx.fillRect(10, 0, 1, 16);
            // White foam streaks
            ctx.fillStyle = COLORS.WHITE;
            // Column 1
            ctx.fillRect(6, 0, 1, 3);
            ctx.fillRect(6, 5, 1, 2);
            ctx.fillRect(6, 10, 1, 3);
            // Column 2
            ctx.fillRect(9, 2, 1, 3);
            ctx.fillRect(9, 8, 1, 2);
            ctx.fillRect(9, 13, 1, 3);
            // Column 3
            ctx.fillRect(7, 3, 1, 2);
            ctx.fillRect(7, 9, 1, 2);
            ctx.fillRect(7, 14, 1, 2);
            // Mist effect (light spray at edges)
            ctx.fillStyle = '#a0c8e8';
            ctx.fillRect(3, 1, 1, 2);
            ctx.fillRect(3, 7, 1, 2);
            ctx.fillRect(3, 13, 1, 2);
            ctx.fillRect(12, 3, 1, 2);
            ctx.fillRect(12, 9, 1, 2);
            ctx.fillRect(12, 14, 1, 2);
            // Mist dots
            ctx.fillStyle = '#c0daf0';
            ctx.fillRect(3, 4, 1, 1);
            ctx.fillRect(12, 6, 1, 1);
            ctx.fillRect(3, 10, 1, 1);
            ctx.fillRect(12, 12, 1, 1);
            // Foam at bottom
            ctx.fillStyle = COLORS.WHITE;
            ctx.fillRect(4, 15, 8, 1);
            ctx.fillStyle = '#c8e0f0';
            ctx.fillRect(4, 14, 2, 1);
            ctx.fillRect(10, 14, 2, 1);
            // Bright sparkle on water
            ctx.fillStyle = '#e8f0ff';
            ctx.fillRect(6, 1, 1, 1);
            ctx.fillRect(9, 4, 1, 1);
            ctx.fillRect(7, 8, 1, 1);
            ctx.fillRect(9, 12, 1, 1);
        });

        // ── SIGN POST (NEW) ────────────────────────────────────
        this.makeTile('sign_post', (ctx) => {
            // Grass background
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(0, 0, 16, 16);
            // Grass variation
            ctx.fillStyle = COLORS.GRASS_DARK;
            [[1,2],[4,0],[12,3],[14,8],[2,11],[9,14],[0,13]].forEach(([x,y]) => {
                ctx.fillRect(x, y, 1, 2);
            });
            ctx.fillStyle = '#6aae4e';
            ctx.fillRect(11, 12, 3, 2);
            ctx.fillRect(0, 6, 2, 2);
            // Post (vertical)
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(7, 6, 2, 10);
            // Post shadow
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(8, 6, 1, 10);
            // Post highlight
            ctx.fillStyle = '#ae8a5a';
            ctx.fillRect(7, 6, 1, 1);
            // Ground shadow at base
            ctx.fillStyle = COLORS.GRASS_DARK;
            ctx.fillRect(5, 15, 6, 1);
            // Sign board
            ctx.fillStyle = COLORS.WOOD;
            ctx.fillRect(3, 2, 11, 5);
            // Sign board border/frame
            ctx.fillStyle = COLORS.WOOD_DARK;
            ctx.fillRect(3, 2, 11, 1);
            ctx.fillRect(3, 6, 11, 1);
            ctx.fillRect(3, 2, 1, 5);
            ctx.fillRect(13, 2, 1, 5);
            // Sign board inner
            ctx.fillStyle = '#b8944a';
            ctx.fillRect(4, 3, 9, 3);
            // Arrow pointing right on sign
            ctx.fillStyle = '#4a2a12';
            // Arrow shaft
            ctx.fillRect(5, 4, 4, 1);
            // Arrow head
            ctx.fillRect(9, 3, 1, 3);
            ctx.fillRect(10, 4, 1, 1);
            // Arrow head detail
            ctx.fillStyle = '#3a1a08';
            ctx.fillRect(10, 4, 1, 1);
            // Wood grain on sign
            ctx.fillStyle = '#a08040';
            ctx.fillRect(5, 3, 3, 1);
            ctx.fillRect(8, 5, 4, 1);
            // Nail on post top
            ctx.fillStyle = '#5a5a6a';
            ctx.fillRect(7, 2, 1, 1);
            ctx.fillRect(8, 2, 1, 1);
        });

        // ── EXIT ARROW (NEW) ───────────────────────────────────
        this.makeTile('exit_arrow', (ctx) => {
            // Path background
            ctx.fillStyle = COLORS.PATH;
            ctx.fillRect(0, 0, 16, 16);
            // Cobblestone hints
            ctx.fillStyle = COLORS.DIRT_DARK;
            ctx.fillRect(0, 0, 16, 1);
            ctx.fillRect(0, 5, 16, 1);
            ctx.fillRect(0, 10, 16, 1);
            ctx.fillRect(0, 15, 16, 1);
            ctx.fillRect(7, 0, 1, 16);
            // Stone variation
            ctx.fillStyle = '#d4b880';
            ctx.fillRect(1, 1, 3, 2);
            ctx.fillRect(9, 6, 4, 2);
            ctx.fillRect(2, 11, 3, 2);
            ctx.fillRect(11, 11, 3, 2);
            // Arrow pointing down (directional indicator)
            // Arrow shadow
            ctx.fillStyle = '#8a6e3e';
            ctx.fillRect(6, 3, 5, 8);
            ctx.fillRect(4, 9, 9, 2);
            ctx.fillRect(5, 11, 7, 1);
            ctx.fillRect(6, 12, 5, 1);
            ctx.fillRect(7, 13, 3, 1);
            ctx.fillRect(8, 14, 1, 1);
            // Arrow body (bright)
            ctx.fillStyle = '#e8d840';
            ctx.fillRect(6, 2, 4, 7);
            // Arrow head
            ctx.fillRect(4, 8, 8, 1);
            ctx.fillRect(5, 9, 6, 1);
            ctx.fillRect(6, 10, 4, 1);
            ctx.fillRect(7, 11, 2, 1);
            // Arrow highlight
            ctx.fillStyle = '#f8e860';
            ctx.fillRect(7, 2, 2, 5);
            ctx.fillRect(5, 8, 4, 1);
            ctx.fillRect(6, 9, 2, 1);
            // Arrow outline
            ctx.fillStyle = '#a09020';
            ctx.fillRect(6, 2, 1, 7);
            ctx.fillRect(9, 2, 1, 7);
            ctx.fillRect(6, 2, 4, 1);
            ctx.fillRect(4, 8, 1, 1);
            ctx.fillRect(10, 8, 2, 1);
            ctx.fillRect(7, 11, 1, 1);
            ctx.fillRect(8, 11, 1, 1);
        });
        // ── CLOUD ─────────────────────────────────────────────
        this.makeTile('cloud', (ctx) => {
            // Transparent sky background
            ctx.fillStyle = '#b8d0e8';
            ctx.fillRect(0, 0, 16, 16);
            // Cloud puffs
            ctx.fillStyle = '#f0f0f8';
            ctx.fillRect(2, 6, 12, 6);
            ctx.fillRect(4, 4, 8, 2);
            ctx.fillRect(3, 12, 10, 2);
            ctx.fillStyle = '#e0e4f0';
            ctx.fillRect(1, 8, 2, 3);
            ctx.fillRect(13, 7, 2, 4);
            // Highlights
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(5, 5, 4, 2);
            ctx.fillRect(3, 7, 3, 2);
        });

        // ── CLOUD DENSE ──────────────────────────────────────
        this.makeTile('cloud_dense', (ctx) => {
            ctx.fillStyle = '#d0dce8';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#e8ecf4';
            ctx.fillRect(0, 3, 16, 10);
            ctx.fillRect(2, 1, 12, 2);
            ctx.fillRect(1, 13, 14, 2);
            ctx.fillStyle = '#f8f8ff';
            ctx.fillRect(3, 4, 10, 6);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(4, 5, 6, 3);
        });

        // ── SKY ──────────────────────────────────────────────
        this.makeTile('sky', (ctx) => {
            ctx.fillStyle = '#a0c0e0';
            ctx.fillRect(0, 0, 16, 16);
            // Subtle wind streaks
            ctx.fillStyle = '#b0cce8';
            ctx.fillRect(2, 4, 6, 1);
            ctx.fillRect(8, 10, 5, 1);
        });

        // ── WIND CURRENT (with directional arrows) ──────────
        this.makeTile('wind_up', (ctx) => {
            ctx.fillStyle = '#a0c0e0';
            ctx.fillRect(0, 0, 16, 16);
            // Upward arrow streaks
            ctx.fillStyle = '#c8e0f8';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(7, 2, 2, 10);
            ctx.fillRect(5, 4, 2, 2);
            ctx.fillRect(9, 4, 2, 2);
            ctx.fillRect(6, 3, 1, 1);
            ctx.fillRect(9, 3, 1, 1);
            ctx.globalAlpha = 1.0;
        });

        this.makeTile('wind_down', (ctx) => {
            ctx.fillStyle = '#a0c0e0';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#c8e0f8';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(7, 4, 2, 10);
            ctx.fillRect(5, 10, 2, 2);
            ctx.fillRect(9, 10, 2, 2);
            ctx.fillRect(6, 12, 1, 1);
            ctx.fillRect(9, 12, 1, 1);
            ctx.globalAlpha = 1.0;
        });

        this.makeTile('wind_left', (ctx) => {
            ctx.fillStyle = '#a0c0e0';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#c8e0f8';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(2, 7, 10, 2);
            ctx.fillRect(4, 5, 2, 2);
            ctx.fillRect(4, 9, 2, 2);
            ctx.fillRect(3, 6, 1, 1);
            ctx.fillRect(3, 9, 1, 1);
            ctx.globalAlpha = 1.0;
        });

        this.makeTile('wind_right', (ctx) => {
            ctx.fillStyle = '#a0c0e0';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#c8e0f8';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(4, 7, 10, 2);
            ctx.fillRect(10, 5, 2, 2);
            ctx.fillRect(10, 9, 2, 2);
            ctx.fillRect(12, 6, 1, 1);
            ctx.fillRect(12, 9, 1, 1);
            ctx.globalAlpha = 1.0;
        });

        // ── SKY ISLAND GRASS ─────────────────────────────────
        this.makeTile('sky_grass', (ctx) => {
            // Floating island grass - lighter, airier green
            ctx.fillStyle = '#6ab84e';
            ctx.fillRect(0, 0, 16, 16);
            ctx.fillStyle = '#5aa842';
            ctx.fillRect(0, 0, 5, 4);
            ctx.fillRect(9, 6, 5, 5);
            ctx.fillStyle = '#7aca5e';
            ctx.fillRect(6, 1, 3, 3);
            ctx.fillRect(12, 10, 3, 3);
            // Sparkle effect (magical floating island)
            ctx.fillStyle = '#e0f0ff';
            ctx.fillRect(3, 3, 1, 1);
            ctx.fillRect(11, 7, 1, 1);
            ctx.fillRect(7, 12, 1, 1);
        });
    },

    makeTile(id, drawFn) {
        const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
        const ctx = canvas.getContext('2d');
        drawFn(ctx);
        this.tiles[id] = canvas;
    }
};
