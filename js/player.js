class Player extends Entity {
    constructor(gridX, gridY) {
        super(gridX, gridY, 'player');
        this.party = []; // tamed dragons, max 2
        this.moveHistory = []; // for companion following
        this.moveSpeed = 0.13;
    }

    update(dt, map) {
        super.update(dt);

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
                    // Bump sound
                    GameAudio.sfx.bump();
                }
            }
        }
    }

    canWalk(nx, ny, map) {
        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) return false;
        const tileType = map.collisions[ny * map.width + nx];
        if (tileType === TILE.SOLID || tileType === TILE.WATER) return false;

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
                Game.warpTo(warp.targetMap, warp.targetX, warp.targetY);
                return;
            }
        }

        // Check for encounters
        const tileType = map.collisions[this.gridY * map.width + this.gridX];
        if (tileType === TILE.ENCOUNTER_GRASS) {
            if (this.party.length > 0 && Math.random() < map.encounterRate) {
                this.triggerEncounter(map);
            }
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
}
