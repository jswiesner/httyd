const Game = {
    state: GameState.TITLE,
    stateStack: [],
    currentMap: null,
    player: null,
    npcs: [],
    camera: null,
    canvas: null,
    ctx: null,
    lastTime: 0,
    accumulator: 0,
    titleBlink: 0,
    titleSelected: 0,
    transitionAlpha: 0,
    transitionDir: 0, // 1 = fading out, -1 = fading in
    transitionCallback: null,
    transitionNextState: null,
    transitionPrevState: null,
    hasSave: false,

    init() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        // Initialize systems
        Input.init();
        GameAudio.init();
        Sprites.init();
        Tilesets.init();

        // Check for save
        this.hasSave = !!localStorage.getItem('httyd_save');

        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame(t => this.loop(t));
    },

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap dt to prevent spiral of death
        this.accumulator += Math.min(dt, 0.1);

        while (this.accumulator >= TICK_RATE) {
            this.update(TICK_RATE);
            this.accumulator -= TICK_RATE;
        }

        this.render();
        Input.consume();
        requestAnimationFrame(t => this.loop(t));
    },

    update(dt) {
        // Handle transitions
        if (this.state === GameState.TRANSITION) {
            this.updateTransition(dt);
            return;
        }

        switch (this.state) {
            case GameState.TITLE:
                this.updateTitle(dt);
                break;
            case GameState.OVERWORLD:
                this.updateOverworld(dt);
                break;
            case GameState.BATTLE:
                BattleEngine.update(dt);
                break;
            case GameState.DIALOGUE:
                DialogueSystem.update(dt);
                break;
            case GameState.MENU:
                MenuSystem.update(dt);
                break;
        }
    },

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, SCREEN_W, SCREEN_H);

        // During transitions, render the underlying content so it fades properly
        let renderState = this.state;
        if (this.state === GameState.TRANSITION) {
            renderState = this.transitionNextState || this.transitionPrevState || GameState.TITLE;
        }

        // Always render the base layer first
        const baseState = this.stateStack.length > 0 ? this.stateStack[0] : renderState;
        if (baseState === GameState.OVERWORLD || renderState === GameState.DIALOGUE || renderState === GameState.MENU) {
            this.renderOverworld(ctx);
        }

        switch (renderState) {
            case GameState.TITLE:
                this.renderTitle(ctx);
                break;
            case GameState.BATTLE:
                BattleRenderer.render(ctx);
                break;
            case GameState.DIALOGUE:
                DialogueSystem.render(ctx);
                break;
            case GameState.MENU:
                MenuSystem.render(ctx);
                break;
        }

        // Transition overlay
        if (this.state === GameState.TRANSITION || this.transitionAlpha > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, ' + this.transitionAlpha + ')';
            ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        }
    },

    // --- TITLE SCREEN ---
    updateTitle(dt) {
        this.titleBlink += dt;
        const hasSave = this.hasSave;
        const maxOptions = hasSave ? 2 : 1;

        if (Input.wasPressed('arrowup') || Input.wasPressed('w')) {
            if (this.titleSelected > 0) { this.titleSelected--; GameAudio.sfx.select(); }
        }
        if (Input.wasPressed('arrowdown') || Input.wasPressed('s')) {
            if (this.titleSelected < maxOptions - 1) { this.titleSelected++; GameAudio.sfx.select(); }
        }

        if (Input.confirm()) {
            GameAudio.sfx.titleStart();
            if (this.titleSelected === 0) {
                this.startNewGame();
            } else if (this.titleSelected === 1 && hasSave) {
                this.loadGame();
            }
        }
    },

    renderTitle(ctx) {
        // Dark background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

        // Stars
        ctx.fillStyle = '#ffffff';
        const starPositions = [[12,8],[45,15],[80,5],[120,12],[140,25],[30,30],[95,22],[150,8],[60,18],[110,28]];
        for (const [x, y] of starPositions) {
            const twinkle = Math.sin(Date.now() * 0.003 + x * 0.1) > 0;
            if (twinkle) ctx.fillRect(x, y, 1, 1);
        }

        // Title text
        Sprites.drawText(ctx, 'HOW TO TRAIN', 28, 20, '#e8a030');
        Sprites.drawText(ctx, 'YOUR DRAGON', 32, 32, '#e8a030');

        // Draw a Night Fury silhouette
        const dragonSprite = Sprites.get('night_fury_front');
        if (dragonSprite) {
            ctx.drawImage(dragonSprite, 56, 48);
        }

        // Menu options
        const menuY = 105;
        const blink = Math.floor(this.titleBlink * 2) % 2;

        const options = ['NEW GAME'];
        if (this.hasSave) options.push('CONTINUE');

        for (let i = 0; i < options.length; i++) {
            const y = menuY + i * 14;
            const selected = i === this.titleSelected;
            if (selected) {
                Sprites.drawText(ctx, '>', 40, y, COLORS.WHITE);
            }
            Sprites.drawText(ctx, options[i], 50, y, selected ? COLORS.WHITE : COLORS.GRAY);
        }

        // Footer
        if (blink) {
            Sprites.drawText(ctx, 'PRESS Z TO START', 22, 134, COLORS.GRAY);
        }
    },

    // --- OVERWORLD ---
    updateOverworld(dt) {
        if (!this.player || !this.currentMap) return;

        this.player.update(dt, this.currentMap);
        CompanionSystem.update(dt, this.player);

        for (const npc of this.npcs) {
            npc.update(dt);
        }

        this.camera.follow(this.player, this.currentMap.width, this.currentMap.height);

        // Check for NPC interaction
        if (Input.confirm() && !this.player.moving) {
            this.player.tryInteract();
        }

        // Open menu
        if (Input.cancel() && !this.player.moving) {
            MenuSystem.open();
        }
    },

    renderOverworld(ctx) {
        if (!this.currentMap) return;

        const cam = this.camera;
        const map = this.currentMap;

        // Calculate visible tile range
        const startCol = Math.max(0, Math.floor(cam.x / TILE_SIZE));
        const startRow = Math.max(0, Math.floor(cam.y / TILE_SIZE));
        const endCol = Math.min(map.width, Math.ceil((cam.x + SCREEN_W) / TILE_SIZE) + 1);
        const endRow = Math.min(map.height, Math.ceil((cam.y + SCREEN_H) / TILE_SIZE) + 1);

        // Draw ground tiles
        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const idx = row * map.width + col;
                const tileName = map.ground[idx];
                const tile = Tilesets.get(tileName);
                if (tile) {
                    ctx.drawImage(tile,
                        Math.round(col * TILE_SIZE - cam.x),
                        Math.round(row * TILE_SIZE - cam.y)
                    );
                }
            }
        }

        // Collect all entities and sort by Y for proper overlap
        const entities = [];
        for (const npc of this.npcs) {
            entities.push(npc);
        }
        CompanionSystem.companions.forEach(c => entities.push(c));
        if (this.player) entities.push(this.player);

        entities.sort((a, b) => a.pixelY - b.pixelY);

        for (const entity of entities) {
            entity.render(ctx, cam.x, cam.y);
        }

        // HUD
        if (this.state === GameState.OVERWORLD) {
            HUD.render(ctx, this.player);
        }
    },

    // --- GAME MANAGEMENT ---
    startNewGame() {
        this.player = new Player(14, 10);
        this.camera = new Camera();

        // Give player a starter dragon
        const starter = createDragonInstance('terrible_terror', 5);
        this.player.addToParty(starter);

        this.loadMap('berk_village');
        this.transition(() => {
            this.state = GameState.OVERWORLD;
        });
    },

    loadMap(mapId) {
        const map = MAP_DATA[mapId];
        if (!map) return;

        this.currentMap = map;
        this.currentMap.id = mapId;

        // Create NPCs
        this.npcs = (map.npcs || []).map(data => new NPC(data));

        // Show area name
        HUD.showAreaName(map.name);

        // Snap camera
        if (this.camera && this.player) {
            this.camera.snap(this.player, map.width, map.height);
        }
    },

    warpTo(mapId, x, y) {
        this.transition(() => {
            this.loadMap(mapId);
            this.player.setPosition(x, y);
            this.player.moveHistory = [{ x: x, y: y, dir: this.player.direction }];
            CompanionSystem.snapAll(this.player);
            this.camera.snap(this.player, this.currentMap.width, this.currentMap.height);
            this.state = GameState.OVERWORLD;
        });
    },

    startBattle(wildDragon) {
        this.transition(() => {
            this.pushState(GameState.BATTLE);
            BattleEngine.start(wildDragon);
        });
    },

    pushState(newState) {
        this.stateStack.push(this.state);
        this.state = newState;
    },

    popState() {
        if (this.stateStack.length > 0) {
            const prev = this.stateStack.pop();
            if (prev === GameState.OVERWORLD && this.state === GameState.BATTLE) {
                this.transition(() => {
                    this.state = prev;
                });
            } else {
                this.state = prev;
            }
        }
    },

    transition(callback) {
        this.transitionDir = 1;
        this.transitionAlpha = 0;
        this.transitionCallback = callback;
        this.transitionPrevState = this.state;
        this.state = GameState.TRANSITION;
    },

    updateTransition(dt) {
        this.transitionAlpha += this.transitionDir * dt * 3;

        if (this.transitionDir === 1 && this.transitionAlpha >= 1) {
            this.transitionAlpha = 1;
            if (this.transitionCallback) {
                // Restore pre-transition state so pushState/popState see the right value
                this.state = this.transitionPrevState;
                this.transitionCallback();
                this.transitionCallback = null;
            }
            // Callback may have changed state; restore TRANSITION for fade-out
            this.transitionNextState = this.state;
            this.state = GameState.TRANSITION;
            this.transitionDir = -1;
        }

        if (this.transitionDir === -1 && this.transitionAlpha <= 0) {
            this.transitionAlpha = 0;
            this.transitionDir = 0;
            // Apply the state the callback set
            if (this.transitionNextState) {
                this.state = this.transitionNextState;
                this.transitionNextState = null;
            }
        }
    },

    // --- SAVE/LOAD ---
    saveGame() {
        const data = {
            map: this.currentMap.id,
            playerX: this.player.gridX,
            playerY: this.player.gridY,
            playerDir: this.player.direction,
            party: this.player.party.map(d => ({
                speciesId: d.speciesId,
                level: d.level,
                currentHp: d.currentHp,
                maxHp: d.maxHp,
                stats: { ...d.stats },
                moves: d.moves.map(m => ({ id: m.id, currentPp: m.currentPp, maxPp: m.maxPp })),
                xp: d.xp,
                xpToNext: d.xpToNext,
            })),
        };
        localStorage.setItem('httyd_save', JSON.stringify(data));
        this.hasSave = true;
    },

    loadGame() {
        const raw = localStorage.getItem('httyd_save');
        if (!raw) { this.startNewGame(); return; }

        try {
            const data = JSON.parse(raw);
            this.player = new Player(data.playerX, data.playerY);
            this.player.direction = data.playerDir || DIR.DOWN;
            this.camera = new Camera();

            this.player.party = data.party.map(d => {
                const dragon = {
                    speciesId: d.speciesId,
                    species: DRAGON_SPECIES[d.speciesId],
                    level: d.level,
                    currentHp: d.currentHp,
                    maxHp: d.maxHp,
                    stats: d.stats,
                    moves: d.moves,
                    xp: d.xp,
                    xpToNext: d.xpToNext,
                };
                return dragon;
            });

            this.loadMap(data.map);
            this.transition(() => {
                this.state = GameState.OVERWORLD;
            });
        } catch (e) {
            console.error('Failed to load save:', e);
            this.startNewGame();
        }
    },
};

// Start the game when the page loads
window.addEventListener('load', () => {
    Game.init();
});
