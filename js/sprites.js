// Sprite generation system - all pixel art is drawn programmatically
const Sprites = {
    cache: {},

    init() {
        this.generateFont();
        this.generatePlayerSprites();
        this.generateDragonOverworldSprites();
        this.generateDragonBattleSprites();
        this.generateNPCSprites();
        this.generateUISprites();
    },

    get(name) {
        return this.cache[name];
    },

    store(name, canvas) {
        this.cache[name] = canvas;
    },

    // --- PIXEL FONT ---
    fontData: {},

    generateFont() {
        // 5x7 pixel font for ASCII 32-122
        const chars = {
            ' ': '00000.00000.00000.00000.00000.00000.00000',
            '!': '00100.00100.00100.00100.00100.00000.00100',
            '?': '01110.10001.00010.00100.00100.00000.00100',
            '.': '00000.00000.00000.00000.00000.00000.00100',
            ',': '00000.00000.00000.00000.00000.00010.00100',
            ':': '00000.00100.00000.00000.00100.00000.00000',
            '-': '00000.00000.00000.01110.00000.00000.00000',
            '+': '00000.00100.00100.11111.00100.00100.00000',
            '/': '00001.00010.00010.00100.01000.01000.10000',
            '\'': '00100.00100.00000.00000.00000.00000.00000',
            '"': '01010.01010.00000.00000.00000.00000.00000',
            '(': '00010.00100.01000.01000.01000.00100.00010',
            ')': '01000.00100.00010.00010.00010.00100.01000',
            'A': '01110.10001.10001.11111.10001.10001.10001',
            'B': '11110.10001.10001.11110.10001.10001.11110',
            'C': '01110.10001.10000.10000.10000.10001.01110',
            'D': '11110.10001.10001.10001.10001.10001.11110',
            'E': '11111.10000.10000.11110.10000.10000.11111',
            'F': '11111.10000.10000.11110.10000.10000.10000',
            'G': '01110.10001.10000.10111.10001.10001.01111',
            'H': '10001.10001.10001.11111.10001.10001.10001',
            'I': '01110.00100.00100.00100.00100.00100.01110',
            'J': '00111.00010.00010.00010.00010.10010.01100',
            'K': '10001.10010.10100.11000.10100.10010.10001',
            'L': '10000.10000.10000.10000.10000.10000.11111',
            'M': '10001.11011.10101.10101.10001.10001.10001',
            'N': '10001.10001.11001.10101.10011.10001.10001',
            'O': '01110.10001.10001.10001.10001.10001.01110',
            'P': '11110.10001.10001.11110.10000.10000.10000',
            'Q': '01110.10001.10001.10001.10101.10010.01101',
            'R': '11110.10001.10001.11110.10100.10010.10001',
            'S': '01111.10000.10000.01110.00001.00001.11110',
            'T': '11111.00100.00100.00100.00100.00100.00100',
            'U': '10001.10001.10001.10001.10001.10001.01110',
            'V': '10001.10001.10001.10001.01010.01010.00100',
            'W': '10001.10001.10001.10101.10101.10101.01010',
            'X': '10001.10001.01010.00100.01010.10001.10001',
            'Y': '10001.10001.01010.00100.00100.00100.00100',
            'Z': '11111.00001.00010.00100.01000.10000.11111',
            '0': '01110.10011.10101.10101.10101.11001.01110',
            '1': '00100.01100.00100.00100.00100.00100.01110',
            '2': '01110.10001.00001.00110.01000.10000.11111',
            '3': '01110.10001.00001.00110.00001.10001.01110',
            '4': '00010.00110.01010.10010.11111.00010.00010',
            '5': '11111.10000.11110.00001.00001.10001.01110',
            '6': '01110.10000.10000.11110.10001.10001.01110',
            '7': '11111.00001.00010.00100.01000.01000.01000',
            '8': '01110.10001.10001.01110.10001.10001.01110',
            '9': '01110.10001.10001.01111.00001.00001.01110',
        };
        // Add lowercase as copies of uppercase
        for (let c = 97; c <= 122; c++) {
            const upper = String.fromCharCode(c - 32);
            if (chars[upper]) {
                chars[String.fromCharCode(c)] = chars[upper];
            }
        }
        this.fontData = {};
        for (const [ch, data] of Object.entries(chars)) {
            const rows = data.split('.');
            const bitmap = [];
            for (const row of rows) {
                for (const pixel of row) {
                    bitmap.push(pixel === '1' ? 1 : 0);
                }
            }
            this.fontData[ch] = { w: 5, h: 7, data: bitmap };
        }
    },

    drawText(ctx, text, x, y, color, scale) {
        color = color || COLORS.WHITE;
        scale = scale || 1;
        let cx = x;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '\n') {
                cx = x;
                y += (7 + 2) * scale;
                continue;
            }
            const glyph = this.fontData[ch];
            if (glyph) {
                ctx.fillStyle = color;
                for (let py = 0; py < glyph.h; py++) {
                    for (let px = 0; px < glyph.w; px++) {
                        if (glyph.data[py * glyph.w + px]) {
                            ctx.fillRect(cx + px * scale, y + py * scale, scale, scale);
                        }
                    }
                }
            }
            cx += 6 * scale;
        }
    },

    textWidth(text, scale) {
        scale = scale || 1;
        return text.length * 6 * scale;
    },

    // --- PLAYER SPRITES (16x16, 4 directions, 2 frames each) ---
    generatePlayerSprites() {
        const P = { // palette
            '.': null,
            'h': '#8a6e3e',  // hair/helmet
            'H': '#6e4e2a',  // helmet dark
            'S': '#c8a86e',  // skin
            'T': '#3a6e3e',  // tunic
            't': '#2a5e2a',  // tunic dark
            'B': '#5a3a1a',  // belt
            'P': '#4a3a2a',  // pants
            'p': '#3a2a1a',  // boots
        };

        const frames = {
            down: [
                // Frame 0
                '......hHh...' +
                '.....HhhhH..' +
                '.....SSSSS..' +
                '.....SSSSS..' +
                '....tTTTTt..' +
                '....TTTTTT..' +
                '....TBTBTT..' +
                '....TTTTTT..' +
                '.....PPPP...' +
                '.....PPPP...' +
                '.....P..P...' +
                '.....pp.pp..',
                // Frame 1
                '......hHh...' +
                '.....HhhhH..' +
                '.....SSSSS..' +
                '.....SSSSS..' +
                '....tTTTTt..' +
                '....TTTTTT..' +
                '....TBTBTT..' +
                '....TTTTTT..' +
                '.....PPPP...' +
                '....PP.PP...' +
                '....P...P...' +
                '....pp..pp..',
            ],
            up: [
                '......hHh...' +
                '.....HhhhH..' +
                '.....hhhhh..' +
                '.....hhhhh..' +
                '....tTTTTt..' +
                '....TTTTTT..' +
                '....TTTTTT..' +
                '....TTTTTT..' +
                '.....PPPP...' +
                '.....PPPP...' +
                '.....P..P...' +
                '.....pp.pp..',
                '......hHh...' +
                '.....HhhhH..' +
                '.....hhhhh..' +
                '.....hhhhh..' +
                '....tTTTTt..' +
                '....TTTTTT..' +
                '....TTTTTT..' +
                '....TTTTTT..' +
                '.....PPPP...' +
                '....PP.PP...' +
                '....P...P...' +
                '....pp..pp..',
            ],
            left: [
                '.....hHh....' +
                '....Hhhh....' +
                '....SSSS....' +
                '....SSSS....' +
                '...tTTTt....' +
                '...TTTTT....' +
                '...TBTTT....' +
                '...TTTTT....' +
                '....PPP.....' +
                '....PPP.....' +
                '....P.P.....' +
                '....p.pp....',
                '.....hHh....' +
                '....Hhhh....' +
                '....SSSS....' +
                '....SSSS....' +
                '...tTTTt....' +
                '...TTTTT....' +
                '...TBTTT....' +
                '...TTTTT....' +
                '....PPP.....' +
                '...PP.P.....' +
                '...P..P.....' +
                '...pp.pp....',
            ],
            right: [
                '....hHh.....' +
                '....hhhH....' +
                '....SSSS....' +
                '....SSSS....' +
                '....tTTTt...' +
                '....TTTTT...' +
                '....TTTBT...' +
                '....TTTTT...' +
                '.....PPP....' +
                '.....PPP....' +
                '.....P.P....' +
                '....pp.p....',
                '....hHh.....' +
                '....hhhH....' +
                '....SSSS....' +
                '....SSSS....' +
                '....tTTTt...' +
                '....TTTTT...' +
                '....TTTBT...' +
                '....TTTTT...' +
                '.....PPP....' +
                '.....P.PP...' +
                '.....P..P...' +
                '....pp.pp...',
            ],
        };

        for (const [dir, framePair] of Object.entries(frames)) {
            for (let f = 0; f < 2; f++) {
                const canvas = createCanvas(12, 12);
                const ctx = canvas.getContext('2d');
                const data = framePair[f];
                for (let y = 0; y < 12; y++) {
                    for (let x = 0; x < 12; x++) {
                        const ch = data[y * 12 + x];
                        if (ch !== '.' && P[ch]) {
                            ctx.fillStyle = P[ch];
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                }
                // Scale to 16x16
                const scaled = createCanvas(16, 16);
                const sctx = scaled.getContext('2d');
                sctx.imageSmoothingEnabled = false;
                // Center the 12x12 sprite in 16x16
                sctx.drawImage(canvas, 2, 2, 12, 12);
                this.store('player_' + dir + '_' + f, scaled);
            }
        }
    },

    // --- DRAGON OVERWORLD SPRITES (16x16) ---
    // Each dragon has unique procedurally-drawn sprites per direction
    generateDragonOverworldSprites() {
        const dragonDefs = {
            terrible_terror: {
                palette: { d: '#a83020', c: '#d85030', l: '#f87050', e: '#ffee00', w: '#c04828', s: '#882018' },
                down: [
                    '................',
                    '....dd..dd......',
                    '....dlddld......',
                    '...ddccccdd.....',
                    '...dccccccd.....',
                    '...dcleclcd.....',
                    '...dccccccd.....',
                    '....dlccld......',
                    '..wddccccddw...',
                    '..wdccllccdw...',
                    '...dccllccd.....',
                    '....dccccd......',
                    '....dc..cd......',
                    '....dd..dd......',
                    '................',
                    '................',
                ],
                up: [
                    '................',
                    '....dd..dd......',
                    '....dddddd......',
                    '...ddccccdd.....',
                    '...dccccccd.....',
                    '...dccccccd.....',
                    '..wddccccddw...',
                    '..wdccccccddw..',
                    '...dcclcccdd...',
                    '...dccllccd.....',
                    '....dccccd......',
                    '....dcccd.......',
                    '....dc..cd......',
                    '....dd..dd......',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '......dd........',
                    '.....ddd........',
                    '....dccc........',
                    '...decccd.......',
                    '...dccccd.......',
                    '..wdccccd.......',
                    '..wdclccd.......',
                    '...dcllcd.......',
                    '...dccccdddd...',
                    '....dccddccl...',
                    '....dccd........',
                    '....d..d........',
                    '....d..d........',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '........dd......',
                    '........ddd.....',
                    '........cccd....',
                    '.......dccced...',
                    '.......dcccd....',
                    '.......dcccddw.',
                    '.......dcclddw.',
                    '.......dcllcd...',
                    '...ddddccccd...',
                    '...lccddccd.....',
                    '........dccd....',
                    '........d..d....',
                    '........d..d....',
                    '................',
                    '................',
                ],
            },
            gronckle: {
                palette: { d: '#5a6a3a', c: '#7a8a5a', l: '#9aaa7a', e: '#ffee00', w: '#6a7a4a', s: '#4a5a2a' },
                down: [
                    '................',
                    '.....dddddd.....',
                    '....dccccccd....',
                    '...dccldlccd....',
                    '...dcleelccd....',
                    '...ddcccccdd....',
                    '..wdcccccccdw..',
                    '..wdcclllccdw..',
                    '..ddccllllccdd..',
                    '...dccclllccd...',
                    '...ddsccccsd....',
                    '....dscccsd.....',
                    '....dd.dd.dd....',
                    '....dd.dd.dd....',
                    '................',
                    '................',
                ],
                up: [
                    '................',
                    '.....dddddd.....',
                    '....ddddddd.....',
                    '...dccddddccd...',
                    '...dccccccccd...',
                    '..wdcccccccdw..',
                    '..wdcclllccdw..',
                    '..ddccllllccdd..',
                    '...dccclllccd...',
                    '...dccccccccd...',
                    '....ddccccdd....',
                    '....dscccsd.....',
                    '....dd.dd.dd....',
                    '....dd.dd.dd....',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '....ddddd.......',
                    '...dcccccdd.....',
                    '..decccccccd....',
                    '..dcccccccd.....',
                    '.wdccccccd......',
                    '.wdcclllcd......',
                    '..dccllllcd.....',
                    '..dcccllccddd..',
                    '...dccccccddl..',
                    '...ddccccdd.....',
                    '....dsccsd......',
                    '....dd.dd.......',
                    '....dd.dd.......',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '.......ddddd....',
                    '.....ddcccccd...',
                    '....dccccccced..',
                    '.....dcccccccd..',
                    '......dcccccddw',
                    '......dcllccdw.',
                    '.....dcllllccd..',
                    '..dddccllcccd..',
                    '..lddccccccd...',
                    '.....ddccccdd...',
                    '......dsccsd....',
                    '.......dd.dd....',
                    '.......dd.dd....',
                    '................',
                    '................',
                ],
            },
            deadly_nadder: {
                palette: { d: '#2a6ab8', c: '#3a9ae8', l: '#5abaff', e: '#ffee00', w: '#3080c8', s: '#1a5a98' },
                down: [
                    '.......l........',
                    '......lll.......',
                    '.....ldccdl.....',
                    '....dcccccd.....',
                    '....dcleclcd....',
                    '....dccccccd....',
                    '...wdcccccdw....',
                    '..wwdcclccdww..',
                    '..wddccllccddw.',
                    '...dcclllcccd...',
                    '....dccccccd....',
                    '....dccccccd....',
                    '.....dc..cd.....',
                    '.....dd..dd.....',
                    '................',
                    '................',
                ],
                up: [
                    '.......l........',
                    '......lll.......',
                    '.....lddddl.....',
                    '....dcccccd.....',
                    '....dccccccd....',
                    '...wdcccccdw....',
                    '..wwdcclccdww..',
                    '..wddccllccddw.',
                    '...dcclllcccd...',
                    '....dccccccd....',
                    '....dccccccd....',
                    '.....dcccd......',
                    '.....dc..cd.....',
                    '.....dd..dd.....',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '.....ll.........',
                    '....lddd........',
                    '...decccd.......',
                    '...dccccd.......',
                    '..wdccccd.......',
                    '.wwdccccd.......',
                    '.wddclccd.......',
                    '..ddcllccdddd..',
                    '...dcclccddccl.',
                    '....dcccdd......',
                    '....dcccd.......',
                    '....d..d........',
                    '....d..d........',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '.........ll.....',
                    '........dddl....',
                    '.......dccced...',
                    '.......dcccd....',
                    '.......dcccddw.',
                    '.......dcccdwww',
                    '.......dcclddw.',
                    '..ddddccllcdd..',
                    '.lccddcclccd...',
                    '......ddcccd....',
                    '.......dcccd....',
                    '........d..d....',
                    '........d..d....',
                    '................',
                    '................',
                ],
            },
            monstrous_nightmare: {
                palette: { d: '#a82020', c: '#d83030', l: '#f85050', e: '#ffee00', w: '#c82828', s: '#881818' },
                down: [
                    '...dl....ld.....',
                    '...dd....dd.....',
                    '....dddddd......',
                    '...dccccccd.....',
                    '...dcleclcd.....',
                    '...dcccccdd.....',
                    '..wdccccccddw..',
                    '.wwdcclllccdww.',
                    '.wddccllllcddw.',
                    '..dcclllllccd...',
                    '...dcccccccd....',
                    '....ddccccdd....',
                    '....dc....cd....',
                    '....dd....dd....',
                    '................',
                    '................',
                ],
                up: [
                    '...dl....ld.....',
                    '...dd....dd.....',
                    '....dddddd......',
                    '...dccccccd.....',
                    '...dccccccd.....',
                    '..wdccccccddw..',
                    '.wwdcclllccdww.',
                    '.wddccllllcddw.',
                    '..dcclllllccd...',
                    '...dcccccccd....',
                    '....ddccccdd....',
                    '.....dccccd.....',
                    '....dc....cd....',
                    '....dd....dd....',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '....dl..........',
                    '....dd..........',
                    '...dcccd........',
                    '..decccccd......',
                    '..dccccccd......',
                    '.wdcccccd.......',
                    'wwdclllcd.......',
                    '.wdcllllcdddd..',
                    '..dclllcddccl..',
                    '..dccccdd.......',
                    '...dccdd........',
                    '...d...d........',
                    '...d...d........',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '..........ld....',
                    '..........dd....',
                    '........dccd....',
                    '......dccccced..',
                    '......dccccccd..',
                    '.......dccccddw',
                    '.......dcllldww',
                    '..ddddcllllddw.',
                    '..lccddclllcd..',
                    '.......ddccccd.',
                    '........ddccd...',
                    '........d...d...',
                    '........d...d...',
                    '................',
                    '................',
                ],
            },
            hideous_zippleback: {
                palette: { d: '#2a6a2a', c: '#4a8a4a', l: '#6aaa6a', e: '#ffee00', w: '#3a7a3a', s: '#1a5a1a' },
                down: [
                    '....dd..dd......',
                    '...dccd.dccd....',
                    '...dced.decd....',
                    '...dccd.dccd....',
                    '....ddddddd.....',
                    '...dcccccccd....',
                    '..wdccccccdw...',
                    '..wdcclllccdw..',
                    '...dcclllccd....',
                    '....dccccccd....',
                    '....dcccccd.....',
                    '.....dc..cd.....',
                    '.....dd..dd.....',
                    '................',
                    '................',
                    '................',
                ],
                up: [
                    '....dd..dd......',
                    '...dddd.dddd....',
                    '...dccd.dccd....',
                    '....ddddddd.....',
                    '...dcccccccd....',
                    '..wdccccccdw...',
                    '..wdcclllccdw..',
                    '...dcclllccd....',
                    '....dccccccd....',
                    '....dcccccd.....',
                    '.....dcccd......',
                    '.....dc..cd.....',
                    '.....dd..dd.....',
                    '................',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '...dd...........',
                    '..decd..........',
                    '..dccd..........',
                    '..ddddd.........',
                    '..dccccd........',
                    '.wdccccd........',
                    '.wdclccd........',
                    '..dcllcdddd....',
                    '..dccccddccl...',
                    '...dccdd........',
                    '...dccd.........',
                    '....d.d.........',
                    '....d.d.........',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '...........dd...',
                    '..........dced..',
                    '..........dccd..',
                    '.........ddddd..',
                    '........dcccd...',
                    '........dcccddw',
                    '........dccldw.',
                    '....ddddcllcd..',
                    '...lccddccccd..',
                    '........ddccd...',
                    '.........dccd...',
                    '.........d.d....',
                    '.........d.d....',
                    '................',
                    '................',
                ],
            },
            razorwhip: {
                palette: { d: '#808098', c: '#b0b0c0', l: '#d0d0e0', e: '#ffee00', w: '#9090a8', s: '#6a6a80' },
                down: [
                    '................',
                    '.....dddddd.....',
                    '....dccccccd....',
                    '....dcleclcd....',
                    '....dcccccdd....',
                    '...wdcccccdw....',
                    '..wwdcclccdww..',
                    '..wddccllccddw.',
                    '...dcclllcccd...',
                    '....dccccccd....',
                    '....dccccccddl.',
                    '.....dc..cdddll',
                    '.....dd..dd.....',
                    '................',
                    '................',
                    '................',
                ],
                up: [
                    '................',
                    '.....dddddd.....',
                    '....ddddddd.....',
                    '....dccccccd....',
                    '...wdcccccdw....',
                    '..wwdcclccdww..',
                    '..wddccllccddw.',
                    '...dcclllcccd...',
                    '....dccccccd....',
                    '....dccccccddl.',
                    '.....dcccdddll.',
                    '.....dc..cd.....',
                    '.....dd..dd.....',
                    '................',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '....ddddd.......',
                    '...decccccd.....',
                    '...dccccccd.....',
                    '..wdccccccd.....',
                    '.wwdcclcccd.....',
                    '.wddcllccd......',
                    '..ddcllccd......',
                    '...dcccccdddd..',
                    '...dccccddccl..',
                    '....dccdd..dll.',
                    '....dccd....ll.',
                    '....d..d........',
                    '....d..d........',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '.......ddddd....',
                    '.....dccccced...',
                    '.....dcccccccd..',
                    '.....dcccccddw.',
                    '.....dccclccdww',
                    '......dccllcddw',
                    '......dccllcdd.',
                    '..ddddccccccd..',
                    '..lccddccccd...',
                    '.lld..ddccd.....',
                    '.ll....dccd.....',
                    '........d..d....',
                    '........d..d....',
                    '................',
                    '................',
                ],
            },
            fireworm: {
                palette: { d: '#c86820', c: '#e88830', l: '#ffaa50', e: '#ffee00', w: '#d87828', s: '#a85818' },
                down: [
                    '................',
                    '.....dddddd.....',
                    '....dlccccld....',
                    '....dclelcld....',
                    '....dcccccdd....',
                    '...wdlcclcdw...',
                    '..wwdcclccdww..',
                    '..wddlcllcddw..',
                    '...dlcllllcld...',
                    '....dlccccld....',
                    '....dcccccdd....',
                    '.....dc..cd.....',
                    '.....dd..dd.....',
                    '................',
                    '................',
                    '................',
                ],
                up: [
                    '................',
                    '.....dddddd.....',
                    '....ddddddd.....',
                    '....dlccccld....',
                    '...wdlcclcdw...',
                    '..wwdcclccdww..',
                    '..wddlcllcddw..',
                    '...dlcllllcld...',
                    '....dlccccld....',
                    '....dcccccdd....',
                    '.....dcccd......',
                    '.....dc..cd.....',
                    '.....dd..dd.....',
                    '................',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '....ddddd.......',
                    '...dlcccld......',
                    '..delccccld.....',
                    '..dcccccld......',
                    '.wdlcclcd.......',
                    'wwdccllcd.......',
                    '.wdlcllccddd...',
                    '..dlclccddccl..',
                    '...dlccdd.......',
                    '....dccd........',
                    '....d..d........',
                    '....d..d........',
                    '................',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '.......ddddd....',
                    '......dlcccld...',
                    '.....dlccccleld.',
                    '......dlccccccd.',
                    '.......dcclcldw',
                    '.......dcllcdww',
                    '...dddccllcldw.',
                    '..lccddcclcld..',
                    '.......ddccld...',
                    '........dccd....',
                    '........d..d....',
                    '........d..d....',
                    '................',
                    '................',
                    '................',
                ],
            },
            stormcutter: {
                palette: { d: '#6a3a2a', c: '#8a5a3a', l: '#aa7a5a', e: '#ffee00', w: '#7a4a30', s: '#5a2a1a' },
                down: [
                    '......dl........',
                    '.....dddd.......',
                    '....dcccccd.....',
                    '....dcleclcd....',
                    '....dcccccdd....',
                    '.wwdccccccddww.',
                    'wwwdcclllccdwww',
                    '.wwdccllllcddw.',
                    '.wddcclllccddw.',
                    '..dccccccccd...',
                    '...dcccccccd....',
                    '....dc....cd....',
                    '....dd....dd....',
                    '................',
                    '................',
                    '................',
                ],
                up: [
                    '......dl........',
                    '.....dddd.......',
                    '....dccccccd....',
                    '....dccccccd....',
                    '.wwdccccccddww.',
                    'wwwdcclllccdwww',
                    '.wwdccllllcddw.',
                    '.wddcclllccddw.',
                    '..dccccccccd...',
                    '...dcccccccd....',
                    '....ddccccdd....',
                    '....dc....cd....',
                    '....dd....dd....',
                    '................',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '....dl..........',
                    '...dddd.........',
                    '..decccccd......',
                    '..dcccccccd.....',
                    'wwdcccccd.......',
                    'wwdclllcd.......',
                    '.wdcllllcdddd..',
                    '.wdcclllddccl..',
                    '..dcccccdd......',
                    '..dcccdd........',
                    '...d...d........',
                    '...d...d........',
                    '................',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '..........ld....',
                    '.........dddd...',
                    '......dccccced..',
                    '.....dcccccccd..',
                    '.......dccccddww',
                    '.......dclllddww',
                    '..ddddcllllddw.',
                    '..lccddlllccdw.',
                    '......ddcccccd.',
                    '........ddcccd.',
                    '........d...d...',
                    '........d...d...',
                    '................',
                    '................',
                    '................',
                ],
            },
            light_fury: {
                palette: { d: '#b0b0d0', c: '#e0e0f0', l: '#ffffff', e: '#88ccff', w: '#c8c8e0', s: '#9090b0' },
                down: [
                    '................',
                    '...dl....ld.....',
                    '....dddddd......',
                    '...dlccccld.....',
                    '...dcleclcld....',
                    '...dcccccccdd...',
                    '..wdlccccldw...',
                    '.wwdccllccdww..',
                    '.wddlclllcddw..',
                    '..dcclllllccd...',
                    '...dlcccccld....',
                    '....dlccld......',
                    '....dc..cd......',
                    '....dd..dd......',
                    '................',
                    '................',
                ],
                up: [
                    '................',
                    '...dl....ld.....',
                    '....dddddd......',
                    '...dlccccld.....',
                    '...dcccccccdd...',
                    '..wdlccccldw...',
                    '.wwdccllccdww..',
                    '.wddlclllcddw..',
                    '..dcclllllccd...',
                    '...dlcccccld....',
                    '....dlccld......',
                    '....dcccd.......',
                    '....dc..cd......',
                    '....dd..dd......',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '....dl..........',
                    '...dldd.........',
                    '..dlccccd.......',
                    '..deccccccd.....',
                    '..dccccccd......',
                    '.wdlccccld......',
                    'wwdccllccd......',
                    '.wdlclllcdddd..',
                    '..dcclllddccl..',
                    '...dlcccdd......',
                    '....dlcd........',
                    '....d..d........',
                    '....d..d........',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '..........ld....',
                    '.........ddld...',
                    '.......dcccld...',
                    '.....dcccccced..',
                    '......dccccccd..',
                    '......dlcccclddw',
                    '......dccllcddww',
                    '..ddddclllcldw.',
                    '..lccddlllccd..',
                    '......ddcccldd.',
                    '........dcld....',
                    '........d..d....',
                    '........d..d....',
                    '................',
                    '................',
                ],
            },
            night_fury: {
                palette: { d: '#1a1a2a', c: '#2a2a3a', l: '#4a4a5a', e: '#88ff88', w: '#202030', s: '#101020' },
                down: [
                    '................',
                    '...dl....ld.....',
                    '....dddddd......',
                    '...dlccccld.....',
                    '...dcleclcld....',
                    '...dcccccccdd...',
                    '..wdlccccldw...',
                    '.wwdccllccdww..',
                    '.wddlclllcddw..',
                    '..dcclllllccd...',
                    '...dlcccccld....',
                    '....dlccld......',
                    '....dc..cd......',
                    '....dd..dd......',
                    '................',
                    '................',
                ],
                up: [
                    '................',
                    '...dl....ld.....',
                    '....dddddd......',
                    '...dlccccld.....',
                    '...dcccccccdd...',
                    '..wdlccccldw...',
                    '.wwdccllccdww..',
                    '.wddlclllcddw..',
                    '..dcclllllccd...',
                    '...dlcccccld....',
                    '....dlccld......',
                    '....dcccd.......',
                    '....dc..cd......',
                    '....dd..dd......',
                    '................',
                    '................',
                ],
                left: [
                    '................',
                    '....dl..........',
                    '...dldd.........',
                    '..dlccccd.......',
                    '..deccccccd.....',
                    '..dccccccd......',
                    '.wdlccccld......',
                    'wwdccllccd......',
                    '.wdlclllcdddd..',
                    '..dcclllddccl..',
                    '...dlcccdd......',
                    '....dlcd........',
                    '....d..d........',
                    '....d..d........',
                    '................',
                    '................',
                ],
                right: [
                    '................',
                    '..........ld....',
                    '.........ddld...',
                    '.......dcccld...',
                    '.....dcccccced..',
                    '......dccccccd..',
                    '......dlcccclddw',
                    '......dccllcddww',
                    '..ddddclllcldw.',
                    '..lccddlllccd..',
                    '......ddcccldd.',
                    '........dcld....',
                    '........d..d....',
                    '........d..d....',
                    '................',
                    '................',
                ],
            },
        };

        for (const [id, dragon] of Object.entries(dragonDefs)) {
            const palette = { '.': null };
            for (const [key, color] of Object.entries(dragon.palette)) {
                palette[key] = color;
            }

            for (const dir of ['down', 'up', 'left', 'right']) {
                const design = dragon[dir];
                for (let f = 0; f < 2; f++) {
                    const canvas = createCanvas(16, 16);
                    const ctx = canvas.getContext('2d');
                    const offsetY = f === 1 ? 1 : 0; // walk bob

                    for (let y = 0; y < 16; y++) {
                        const row = (design[y] || '').padEnd(16, '.');
                        if (!row) continue;
                        for (let x = 0; x < 16; x++) {
                            const ch = row[x];
                            if (ch && palette[ch]) {
                                ctx.fillStyle = palette[ch];
                                ctx.fillRect(x, y + offsetY > 15 ? 15 : y + offsetY, 1, 1);
                            }
                        }
                    }
                    this.store(id + '_' + dir + '_' + f, canvas);
                }
            }
        }
    },

    // --- DRAGON BATTLE SPRITES (48x48 front, 32x32 back) ---
    generateDragonBattleSprites() {
        const battleDesigns = {
            terrible_terror: { color: '#d85030', dark: '#a83020', light: '#f87050', eye: '#ffee00' },
            gronckle: { color: '#7a8a5a', dark: '#5a6a3a', light: '#9aaa7a', eye: '#ffee00' },
            deadly_nadder: { color: '#3a9ae8', dark: '#2a6ab8', light: '#5abaff', eye: '#ffee00' },
            monstrous_nightmare: { color: '#d83030', dark: '#a82020', light: '#f85050', eye: '#ffee00' },
            hideous_zippleback: { color: '#4a8a4a', dark: '#2a6a2a', light: '#6aaa6a', eye: '#ffee00' },
            razorwhip: { color: '#b0b0c0', dark: '#808098', light: '#d0d0e0', eye: '#ffee00' },
            fireworm: { color: '#e88830', dark: '#c86820', light: '#ffaa50', eye: '#ffee00' },
            stormcutter: { color: '#8a5a3a', dark: '#6a3a2a', light: '#aa7a5a', eye: '#ffee00' },
            light_fury: { color: '#e0e0f0', dark: '#b0b0d0', light: '#ffffff', eye: '#88ccff' },
            night_fury: { color: '#2a2a3a', dark: '#1a1a2a', light: '#4a4a5a', eye: '#88ff88' },
        };

        for (const [id, d] of Object.entries(battleDesigns)) {
            // Front sprite (enemy) - 48x48
            const front = createCanvas(48, 48);
            const fctx = front.getContext('2d');
            this._drawDragonBattle(fctx, d, 48, false, id);
            this.store(id + '_front', front);

            // Back sprite (player's dragon) - 48x48
            const back = createCanvas(48, 48);
            const bctx = back.getContext('2d');
            this._drawDragonBattle(bctx, d, 48, true, id);
            this.store(id + '_back', back);
        }
    },

    _drawDragonBattle(ctx, d, size, isBack, speciesId) {
        const cx = size / 2;
        const cy = size / 2;

        // Tail (drawn first so body overlaps it)
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.moveTo(cx + 12, cy + 8);
        ctx.quadraticCurveTo(cx + 20, cy + 16, cx + 22, cy + 12);
        ctx.lineTo(cx + 20, cy + 14);
        ctx.quadraticCurveTo(cx + 16, cy + 14, cx + 10, cy + 10);
        ctx.fill();
        // Tail tip fin
        ctx.fillStyle = d.light;
        ctx.beginPath();
        ctx.moveTo(cx + 21, cy + 11);
        ctx.lineTo(cx + 24, cy + 8);
        ctx.lineTo(cx + 24, cy + 15);
        ctx.lineTo(cx + 21, cy + 13);
        ctx.fill();

        // Wings (behind body)
        ctx.fillStyle = d.light;
        if (!isBack) {
            // Left wing - multi-segment
            ctx.beginPath();
            ctx.moveTo(cx - 14, cy);
            ctx.lineTo(cx - 20, cy - 8);
            ctx.lineTo(cx - 22, cy - 16);
            ctx.lineTo(cx - 16, cy - 10);
            ctx.lineTo(cx - 8, cy - 4);
            ctx.fill();
            // Wing membrane
            ctx.fillStyle = d.color;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(cx - 14, cy);
            ctx.lineTo(cx - 20, cy - 12);
            ctx.lineTo(cx - 8, cy - 4);
            ctx.fill();
            ctx.globalAlpha = 1;
            // Right wing
            ctx.fillStyle = d.light;
            ctx.beginPath();
            ctx.moveTo(cx + 14, cy);
            ctx.lineTo(cx + 20, cy - 8);
            ctx.lineTo(cx + 22, cy - 16);
            ctx.lineTo(cx + 16, cy - 10);
            ctx.lineTo(cx + 8, cy - 4);
            ctx.fill();
            ctx.fillStyle = d.color;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(cx + 14, cy);
            ctx.lineTo(cx + 20, cy - 12);
            ctx.lineTo(cx + 8, cy - 4);
            ctx.fill();
            ctx.globalAlpha = 1;
        } else {
            // Wings from behind - spread wide
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy + 2);
            ctx.lineTo(cx - 18, cy - 6);
            ctx.lineTo(cx - 22, cy - 14);
            ctx.lineTo(cx - 14, cy - 8);
            ctx.lineTo(cx - 6, cy - 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 12, cy + 2);
            ctx.lineTo(cx + 18, cy - 6);
            ctx.lineTo(cx + 22, cy - 14);
            ctx.lineTo(cx + 14, cy - 8);
            ctx.lineTo(cx + 6, cy - 2);
            ctx.fill();
            // Wing bones
            ctx.strokeStyle = d.dark;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy + 2);
            ctx.lineTo(cx - 22, cy - 14);
            ctx.moveTo(cx + 12, cy + 2);
            ctx.lineTo(cx + 22, cy - 14);
            ctx.stroke();
        }

        // Body
        ctx.fillStyle = d.color;
        this._fillEllipse(ctx, cx, cy + 4, 16, 12);

        // Scale pattern on body
        ctx.fillStyle = d.dark;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 6; i++) {
            const sx = cx - 8 + i * 3 + (i % 2);
            const sy = cy + 1 + (i % 2) * 3;
            ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;

        // Lighter belly
        ctx.fillStyle = d.light;
        ctx.globalAlpha = 0.5;
        this._fillEllipse(ctx, cx, cy + 6, 10, 6);
        ctx.globalAlpha = 1;

        // Darker underbelly shadow
        ctx.fillStyle = d.dark;
        this._fillEllipse(ctx, cx, cy + 10, 12, 4);

        // Neck
        ctx.fillStyle = d.color;
        const headY = cy - 10;
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 2);
        ctx.quadraticCurveTo(cx - 4, headY + 6, cx - 6, headY + 2);
        ctx.lineTo(cx + 6, headY + 2);
        ctx.quadraticCurveTo(cx + 4, headY + 6, cx + 6, cy - 2);
        ctx.fill();

        // Head
        ctx.fillStyle = d.color;
        this._fillEllipse(ctx, cx, headY, 10, 8);

        // Head highlight
        ctx.fillStyle = d.light;
        ctx.globalAlpha = 0.3;
        this._fillEllipse(ctx, cx - 2, headY - 2, 6, 4);
        ctx.globalAlpha = 1;

        // Legs with claws
        ctx.fillStyle = d.dark;
        ctx.fillRect(cx - 9, cy + 12, 4, 7);
        ctx.fillRect(cx + 5, cy + 12, 4, 7);
        // Claws
        ctx.fillStyle = d.light;
        ctx.fillRect(cx - 10, cy + 18, 2, 2);
        ctx.fillRect(cx - 7, cy + 18, 2, 2);
        ctx.fillRect(cx + 4, cy + 18, 2, 2);
        ctx.fillRect(cx + 7, cy + 18, 2, 2);

        if (!isBack) {
            // Snout/jaw
            ctx.fillStyle = d.dark;
            this._fillEllipse(ctx, cx, headY + 4, 6, 3);

            // Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(cx - 6, headY - 3, 4, 4);
            ctx.fillRect(cx + 2, headY - 3, 4, 4);
            ctx.fillStyle = d.eye;
            ctx.fillRect(cx - 5, headY - 2, 3, 3);
            ctx.fillRect(cx + 3, headY - 2, 3, 3);
            // Pupils
            ctx.fillStyle = '#000';
            ctx.fillRect(cx - 4, headY - 1, 2, 2);
            ctx.fillRect(cx + 3, headY - 1, 2, 2);
            // Eye shine
            ctx.fillStyle = '#fff';
            ctx.fillRect(cx - 5, headY - 2, 1, 1);
            ctx.fillRect(cx + 3, headY - 2, 1, 1);

            // Nostrils
            ctx.fillStyle = d.dark;
            ctx.fillRect(cx - 3, headY + 4, 2, 1);
            ctx.fillRect(cx + 1, headY + 4, 2, 1);

            // Mouth line
            ctx.strokeStyle = d.dark;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 4, headY + 6);
            ctx.lineTo(cx + 4, headY + 6);
            ctx.stroke();
        } else {
            // Back of head - spine ridges
            ctx.fillStyle = d.dark;
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(cx - 1, headY - 4 + i * 4, 2, 3);
            }
        }

        // Species-specific details
        if (speciesId === 'deadly_nadder') {
            // Crown of spikes
            ctx.fillStyle = d.light;
            for (let i = 0; i < 5; i++) {
                const angle = -Math.PI / 2 + (i - 2) * 0.4;
                const sx = cx + Math.cos(angle) * 8;
                const sy = headY + Math.sin(angle) * 8 - 2;
                ctx.fillRect(sx - 1, sy - 4, 2, 5);
            }
            // Tail spines
            ctx.fillStyle = d.light;
            ctx.fillRect(cx + 18, cy + 10, 2, 3);
            ctx.fillRect(cx + 20, cy + 9, 2, 3);
        } else if (speciesId === 'monstrous_nightmare') {
            // Curved horns
            ctx.fillStyle = d.dark;
            ctx.beginPath();
            ctx.moveTo(cx - 6, headY - 2);
            ctx.quadraticCurveTo(cx - 8, headY - 10, cx - 4, headY - 8);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 6, headY - 2);
            ctx.quadraticCurveTo(cx + 8, headY - 10, cx + 4, headY - 8);
            ctx.fill();
            // Fire glow on body
            ctx.fillStyle = '#f86830';
            ctx.globalAlpha = 0.3;
            this._fillEllipse(ctx, cx, cy + 4, 14, 10);
            ctx.globalAlpha = 1;
        } else if (speciesId === 'night_fury' || speciesId === 'light_fury') {
            // Ear flaps / head plates
            ctx.fillStyle = d.light;
            ctx.beginPath();
            ctx.moveTo(cx - 8, headY);
            ctx.lineTo(cx - 12, headY - 6);
            ctx.lineTo(cx - 6, headY - 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 8, headY);
            ctx.lineTo(cx + 12, headY - 6);
            ctx.lineTo(cx + 6, headY - 2);
            ctx.fill();
            // Sleek body highlight
            ctx.fillStyle = d.light;
            ctx.globalAlpha = 0.2;
            this._fillEllipse(ctx, cx, cy + 2, 14, 8);
            ctx.globalAlpha = 1;
        } else if (speciesId === 'stormcutter') {
            // Four wings (extra lower pair)
            ctx.fillStyle = d.color;
            ctx.beginPath();
            ctx.moveTo(cx - 10, cy + 6);
            ctx.lineTo(cx - 18, cy - 4);
            ctx.lineTo(cx - 12, cy);
            ctx.lineTo(cx - 6, cy + 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 10, cy + 6);
            ctx.lineTo(cx + 18, cy - 4);
            ctx.lineTo(cx + 12, cy);
            ctx.lineTo(cx + 6, cy + 2);
            ctx.fill();
            // Head crest
            ctx.fillStyle = d.light;
            ctx.fillRect(cx - 1, headY - 8, 2, 6);
        } else if (speciesId === 'hideous_zippleback') {
            // Two necks and heads
            ctx.fillStyle = d.color;
            // Left neck
            ctx.beginPath();
            ctx.moveTo(cx - 4, cy - 2);
            ctx.quadraticCurveTo(cx - 8, headY + 4, cx - 8, headY);
            ctx.lineTo(cx - 2, headY);
            ctx.quadraticCurveTo(cx - 2, headY + 4, cx, cy - 2);
            ctx.fill();
            // Right neck
            ctx.beginPath();
            ctx.moveTo(cx, cy - 2);
            ctx.quadraticCurveTo(cx + 2, headY + 4, cx + 2, headY);
            ctx.lineTo(cx + 8, headY);
            ctx.quadraticCurveTo(cx + 8, headY + 4, cx + 4, cy - 2);
            ctx.fill();
            this._fillEllipse(ctx, cx - 6, headY - 2, 7, 6);
            this._fillEllipse(ctx, cx + 6, headY - 2, 7, 6);
            if (!isBack) {
                ctx.fillStyle = d.eye;
                ctx.fillRect(cx - 9, headY - 4, 2, 2);
                ctx.fillRect(cx - 5, headY - 4, 2, 2);
                ctx.fillRect(cx + 4, headY - 4, 2, 2);
                ctx.fillRect(cx + 8, headY - 4, 2, 2);
                ctx.fillStyle = '#000';
                ctx.fillRect(cx - 8, headY - 3, 1, 1);
                ctx.fillRect(cx - 4, headY - 3, 1, 1);
                ctx.fillRect(cx + 5, headY - 3, 1, 1);
                ctx.fillRect(cx + 9, headY - 3, 1, 1);
            }
        } else if (speciesId === 'gronckle') {
            // Rocky bumps on body
            ctx.fillStyle = d.dark;
            const bumps = [[-10,0],[-5,3],[0,-1],[5,2],[10,1],[-7,5],[3,6],[8,4]];
            for (const [bx, by] of bumps) {
                ctx.fillRect(cx + bx, cy + by, 3, 3);
                ctx.fillStyle = d.light;
                ctx.fillRect(cx + bx, cy + by, 1, 1);
                ctx.fillStyle = d.dark;
            }
            // Stubby wings
            ctx.fillStyle = d.color;
            ctx.beginPath();
            ctx.moveTo(cx - 14, cy + 2);
            ctx.lineTo(cx - 18, cy - 6);
            ctx.lineTo(cx - 10, cy - 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 14, cy + 2);
            ctx.lineTo(cx + 18, cy - 6);
            ctx.lineTo(cx + 10, cy - 2);
            ctx.fill();
        } else if (speciesId === 'fireworm') {
            // Glowing bioluminescent spots
            const spots = [[-8,0],[-3,4],[2,1],[7,3],[-5,7],[4,6]];
            for (const [bx, by] of spots) {
                ctx.fillStyle = '#ffcc00';
                ctx.globalAlpha = 0.8;
                ctx.fillRect(cx + bx, cy + by, 3, 3);
                ctx.fillStyle = '#fff';
                ctx.globalAlpha = 0.6;
                ctx.fillRect(cx + bx + 1, cy + by + 1, 1, 1);
            }
            ctx.globalAlpha = 1;
        } else if (speciesId === 'razorwhip') {
            // Metallic sheen
            ctx.fillStyle = d.light;
            ctx.globalAlpha = 0.4;
            this._fillEllipse(ctx, cx - 4, cy + 2, 8, 6);
            ctx.globalAlpha = 1;
            // Sharp tail blade (bigger)
            ctx.fillStyle = d.light;
            ctx.beginPath();
            ctx.moveTo(cx + 20, cy + 12);
            ctx.lineTo(cx + 26, cy + 8);
            ctx.lineTo(cx + 24, cy + 14);
            ctx.lineTo(cx + 26, cy + 18);
            ctx.lineTo(cx + 20, cy + 14);
            ctx.fill();
            // Metal spine ridges
            ctx.fillStyle = d.light;
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(cx - 2 + i * 3, cy - 2 + i, 2, 3);
            }
        } else if (speciesId === 'terrible_terror') {
            // Small horns
            ctx.fillStyle = d.dark;
            ctx.fillRect(cx - 4, headY - 5, 2, 3);
            ctx.fillRect(cx + 2, headY - 5, 2, 3);
        }
    },

    _fillEllipse(ctx, cx, cy, rx, ry) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
    },

    // --- NPC SPRITES ---
    generateNPCSprites() {
        const npcDesigns = {
            npc_chief: {
                P: { '.': null, 'h': '#c88830', 'H': '#a86820', 'S': '#deb887', 'A': '#8b0000', 'a': '#6b0000', 'B': '#4a3a2a', 'P': '#5a4a3a', 'p': '#3a2a1a', 'b': '#c0c0c0' },
            },
            npc_healer: {
                P: { '.': null, 'h': '#e8e8e8', 'H': '#c0c0c0', 'S': '#deb887', 'A': '#4a8a4a', 'a': '#3a6a3a', 'B': '#8a6e3e', 'P': '#5a5a3a', 'p': '#3a3a2a', 'b': null },
            },
            npc_trader: {
                P: { '.': null, 'h': '#4a3a2a', 'H': '#3a2a1a', 'S': '#deb887', 'A': '#8a5a2a', 'a': '#6a4a1a', 'B': '#c0a040', 'P': '#5a4a3a', 'p': '#3a2a1a', 'b': null },
            },
            npc_elder: {
                P: { '.': null, 'h': '#c0c0c0', 'H': '#a0a0a0', 'S': '#deb887', 'A': '#5a3a8a', 'a': '#4a2a6a', 'B': '#8a6e3e', 'P': '#5a4a3a', 'p': '#3a2a1a', 'b': null },
            },
            npc_guide: {
                P: { '.': null, 'h': '#c88830', 'H': '#a86820', 'S': '#deb887', 'A': '#2a5a8a', 'a': '#1a4a6a', 'B': '#8a6e3e', 'P': '#4a4a4a', 'p': '#2a2a2a', 'b': null },
            },
            npc_trainer: {
                P: { '.': null, 'h': '#2a2a2a', 'H': '#1a1a1a', 'S': '#deb887', 'A': '#8a2020', 'a': '#6a1010', 'B': '#c0c0c0', 'P': '#4a4a5a', 'p': '#2a2a3a', 'b': '#e8d040' },
            },
        };

        const baseSprite =
            '......hHh...' +
            '.....HhhhH..' +
            '.....SSSSS..' +
            '.....SSSSS..' +
            '....aAAAAa..' +
            '....AAAAAA..' +
            '....ABABAA..' +
            '....AAAAAA..' +
            '.....PPPP...' +
            '.....PPPP...' +
            '.....P..P...' +
            '.....pp.pp..';

        for (const [id, npc] of Object.entries(npcDesigns)) {
            const canvas = createCanvas(16, 16);
            const ctx = canvas.getContext('2d');
            for (let y = 0; y < 12; y++) {
                for (let x = 0; x < 12; x++) {
                    const ch = baseSprite[y * 12 + x];
                    if (ch !== '.' && npc.P[ch]) {
                        ctx.fillStyle = npc.P[ch];
                        ctx.fillRect(x + 2, y + 2, 1, 1);
                    }
                }
            }
            this.store(id + '_down_0', canvas);
            this.store(id + '_down_1', canvas);
            this.store(id + '_up_0', canvas);
            this.store(id + '_up_1', canvas);
            this.store(id + '_left_0', canvas);
            this.store(id + '_left_1', canvas);
            this.store(id + '_right_0', canvas);
            this.store(id + '_right_1', canvas);
        }
    },

    // --- UI SPRITES ---
    generateUISprites() {
        // Battle cursor arrow
        const arrow = createCanvas(8, 8);
        const actx = arrow.getContext('2d');
        actx.fillStyle = COLORS.WHITE;
        actx.fillRect(2, 1, 1, 5);
        actx.fillRect(3, 2, 1, 3);
        actx.fillRect(4, 3, 1, 1);
        this.store('cursor', arrow);

        // Dragon type icons (8x8)
        const typeColors = { fire: COLORS.FIRE, ice: COLORS.ICE, lightning: COLORS.LIGHTNING, earth: COLORS.EARTH };
        for (const [type, color] of Object.entries(typeColors)) {
            const icon = createCanvas(8, 8);
            const ictx = icon.getContext('2d');
            ictx.fillStyle = color;
            ictx.beginPath();
            ictx.arc(4, 4, 3, 0, Math.PI * 2);
            ictx.fill();
            ictx.fillStyle = COLORS.WHITE;
            ictx.fillRect(3, 3, 2, 2);
            this.store('type_' + type, icon);
        }
    }
};
