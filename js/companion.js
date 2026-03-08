class Companion extends Entity {
    constructor(partyIndex, speciesId) {
        super(0, 0, speciesId);
        this.partyIndex = partyIndex;
        this.moveSpeed = 0.13;
    }

    update(dt, player) {
        super.update(dt);

        if (!this.moving) {
            const followIndex = this.partyIndex + 1;
            const target = player.moveHistory[followIndex];
            if (target && (this.gridX !== target.x || this.gridY !== target.y)) {
                // Determine direction to target
                const dx = target.x - this.gridX;
                const dy = target.y - this.gridY;
                if (Math.abs(dx) + Math.abs(dy) === 1) {
                    if (dx === 1) this.direction = DIR.RIGHT;
                    else if (dx === -1) this.direction = DIR.LEFT;
                    else if (dy === 1) this.direction = DIR.DOWN;
                    else if (dy === -1) this.direction = DIR.UP;
                    this.startMove(this.direction);
                } else {
                    // Too far, snap
                    this.setPosition(target.x, target.y);
                    this.direction = target.dir;
                }
            }
        }
    }

    snapBehindPlayer(player) {
        const dx = DIR_DX[player.direction];
        const dy = DIR_DY[player.direction];
        const offset = this.partyIndex + 1;
        this.setPosition(
            player.gridX - dx * offset,
            player.gridY - dy * offset
        );
        this.direction = player.direction;
    }
}

// Companion manager
const CompanionSystem = {
    companions: [],

    update(dt, player) {
        // Sync companion count with party
        while (this.companions.length > player.party.length) {
            this.companions.pop();
        }
        while (this.companions.length < player.party.length) {
            const idx = this.companions.length;
            const dragon = player.party[idx];
            const comp = new Companion(idx, dragon.speciesId);
            comp.snapBehindPlayer(player);
            this.companions.push(comp);
        }

        // Update species if party changed
        for (let i = 0; i < this.companions.length; i++) {
            if (this.companions[i].spriteId !== player.party[i].speciesId) {
                this.companions[i].spriteId = player.party[i].speciesId;
            }
        }

        // Update positions
        for (const comp of this.companions) {
            comp.update(dt, player);
        }
    },

    render(ctx, camX, camY) {
        for (const comp of this.companions) {
            comp.render(ctx, camX, camY);
        }
    },

    snapAll(player) {
        for (const comp of this.companions) {
            comp.snapBehindPlayer(player);
        }
    },

    reset() {
        this.companions = [];
    }
};
