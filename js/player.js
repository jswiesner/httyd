class Player extends Entity {
    constructor(gridX, gridY) {
        super(gridX, gridY, 'player');
        this.party = []; // tamed dragons, max 2
        this.moveHistory = []; // for companion following
        this.moveSpeed = 0.13;
        this.isFlying = false;
        this.flightBobTimer = 0;
        this.hasFlownBefore = false;
    }

    update(dt, map) {
        super.update(dt);

        // Flight bob animation
        if (this.isFlying) {
            this.flightBobTimer += dt;
        }

        if (!this.moving && Game.state === GameState.OVERWORLD) {
            const dir = Input.getDirection();
            if (dir) {
                this.direction = dir;
                const nx = this.gridX + DIR_DX[dir];
                const ny = this.gridY + DIR_DY[dir];

                if (this.canWalk(nx, ny, map)) {
                    this.startMove(dir);
                    GameAudio.sfx.step();
                } else {
                    GameAudio.sfx.bump();
                }
            }
        }
    }

    canWalk(nx, ny, map) {
        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) return false;
        const tileType = map.collisions[ny * map.width + nx];

        if (this.isFlying) {
            // In flight mode: can fly over trees, water, most obstacles
            // Only crystal/cave walls and stone walls remain solid
            if (tileType === TILE.SOLID) {
                const tileName = map.ground[ny * map.width + nx];
                // Can fly over trees and houses but not cave/crystal walls
                if (tileName === 'cave_wall' || tileName === 'crystal_wall' || tileName === 'stone_wall') {
                    return false;
                }
                return true; // fly over trees, houses, etc.
            }
            if (tileType === TILE.WATER) return true; // fly over water
            if (tileType === TILE.CLOUD) return true;
            // Wind tiles are always walkable in flight
            if (tileType >= TILE.WIND_UP && tileType <= TILE.WIND_RIGHT) return true;
            return true;
        }

        // Ground mode
        if (tileType === TILE.SOLID || tileType === TILE.WATER) return false;
        if (tileType === TILE.CLOUD) return false; // can't walk on clouds

        // Check NPC collisions
        if (Game.npcs) {
            for (const npc of Game.npcs) {
                if (npc.gridX === nx && npc.gridY === ny) return false;
            }
        }
        return true;
    }

    onArrival() {
        // Record position for companions
        this.moveHistory.unshift({ x: this.gridX, y: this.gridY, dir: this.direction });
        if (this.moveHistory.length > 20) this.moveHistory.pop();

        const map = Game.currentMap;
        if (!map) return;

        // Check for warps
        for (const warp of map.warps) {
            if (this.gridX === warp.x && this.gridY === warp.y) {
                if (warp.flightOnly && !this.isFlying) continue;
                if (warp.groundOnly && this.isFlying) continue;
                Game.warpTo(warp.targetMap, warp.targetX, warp.targetY);
                return;
            }
        }

        // Wind currents push player in flight mode
        if (this.isFlying) {
            const tileType = map.collisions[this.gridY * map.width + this.gridX];
            const windDir = this.getWindDirection(tileType);
            if (windDir && !this.moving) {
                const wnx = this.gridX + DIR_DX[windDir];
                const wny = this.gridY + DIR_DY[windDir];
                if (this.canWalk(wnx, wny, map)) {
                    this.startMove(windDir);
                }
            }
        }

        // Check for ground items
        if (map.id) {
            const foundItem = Inventory.checkGroundItem(map.id, this.gridX, this.gridY);
            if (foundItem) {
                const itemData = ITEMS[foundItem];
                if (itemData) {
                    GameAudio.sfx.confirm();
                    DialogueSystem.start([
                        { text: 'Found ' + itemData.name + '!\n' + itemData.desc }
                    ]);
                }
            }
        }

        // Check for encounters
        const tileType = map.collisions[this.gridY * map.width + this.gridX];

        if (this.isFlying && tileType === TILE.CLOUD) {
            // Sky encounters in cloud tiles
            const skyEncounters = map.skyEncounters || map.encounters;
            if (this.party.length > 0 && Math.random() < (map.encounterRate || 0.08)) {
                const encounter = weightedRandom(skyEncounters);
                const level = randInt(encounter.levelRange[0], encounter.levelRange[1]);
                const wildDragon = createDragonInstance(encounter.dragonId, level);
                GameAudio.sfx.encounter();
                Game.startBattle(wildDragon);
            }
        } else if (!this.isFlying && tileType === TILE.ENCOUNTER_GRASS) {
            if (this.party.length > 0 && Math.random() < map.encounterRate) {
                this.triggerEncounter(map);
            }
        }
    }

    getWindDirection(tileType) {
        switch (tileType) {
            case TILE.WIND_UP: return DIR.UP;
            case TILE.WIND_DOWN: return DIR.DOWN;
            case TILE.WIND_LEFT: return DIR.LEFT;
            case TILE.WIND_RIGHT: return DIR.RIGHT;
            default: return null;
        }
    }

    toggleFlight() {
        if (this.party.length === 0) {
            DialogueSystem.start([{ text: "You need a dragon\npartner to fly!" }]);
            return;
        }

        const map = Game.currentMap;
        if (!this.isFlying) {
            // Take off
            this.isFlying = true;
            this.moveSpeed = 0.09; // faster in flight

            // Check for lightweight saddle
            const activeDragon = this.party[0];
            if (Inventory.hasSaddleEffect(activeDragon, 'flight_speed')) {
                this.moveSpeed = 0.06; // even faster with lightweight frame
            }

            GameAudio.sfx.confirm();

            // Show tutorial dialogue only the first time
            if (!this.hasFlownBefore) {
                this.hasFlownBefore = true;
                if (map.skyWarp) {
                    DialogueSystem.start([
                        { text: "You take flight!\nPress F to land.\n" },
                        { text: "Fly to the clouds\nabove to reach the\nSky Islands!" },
                    ]);
                } else {
                    DialogueSystem.start([{ text: "You take flight!\nPress F to land." }]);
                }
            }
        } else {
            // Land - check if current tile allows landing
            const tileType = map.collisions[this.gridY * map.width + this.gridX];
            if (tileType === TILE.WATER || tileType === TILE.SOLID || tileType === TILE.CLOUD) {
                DialogueSystem.start([{ text: "Can't land here!" }]);
                return;
            }
            this.isFlying = false;
            this.moveSpeed = 0.13;
            this.flightBobTimer = 0;
            GameAudio.sfx.confirm();
        }
    }

    // Fly up to sky islands from berk
    flyToSky() {
        const map = Game.currentMap;
        if (map && map.skyWarp && this.isFlying) {
            Game.warpTo(map.skyWarp.targetMap, map.skyWarp.targetX, map.skyWarp.targetY);
        }
    }

    triggerEncounter(map) {
        const encounter = weightedRandom(map.encounters);
        const level = randInt(encounter.levelRange[0], encounter.levelRange[1]);
        const wildDragon = createDragonInstance(encounter.dragonId, level);
        GameAudio.sfx.encounter();
        Game.startBattle(wildDragon);
    }

    // Check if facing an NPC and interact
    tryInteract() {
        const fx = this.gridX + DIR_DX[this.direction];
        const fy = this.gridY + DIR_DY[this.direction];

        if (Game.npcs) {
            for (const npc of Game.npcs) {
                if (npc.gridX === fx && npc.gridY === fy) {
                    npc.interact();
                    return true;
                }
            }
        }
        return false;
    }

    healAll() {
        for (const dragon of this.party) {
            dragon.currentHp = dragon.maxHp;
            for (const move of dragon.moves) {
                move.currentPp = move.maxPp;
            }
        }
    }

    addToParty(dragon) {
        if (this.party.length < MAX_PARTY) {
            this.party.push(dragon);
            return true;
        }
        return false;
    }

    removeFromParty(index) {
        if (index >= 0 && index < this.party.length) {
            this.party.splice(index, 1);
        }
    }

    render(ctx, camX, camY) {
        if (!this.visible) return;
        const sprite = Sprites.get(this.spriteId + '_' + this.direction + '_' + this.animFrame);
        if (sprite) {
            let drawY = Math.round(this.pixelY - camY);
            // Flight bob effect
            if (this.isFlying) {
                drawY -= 4 + Math.sin(this.flightBobTimer * 3) * 2;
                // Draw shadow on ground
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#000';
                ctx.fillRect(Math.round(this.pixelX - camX) + 2, Math.round(this.pixelY - camY) + 12, 12, 4);
                ctx.globalAlpha = 1.0;
            }
            ctx.drawImage(sprite, Math.round(this.pixelX - camX), drawY);
        }
    }
}
