class Entity {
    constructor(gridX, gridY, spriteId) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.pixelX = gridX * TILE_SIZE;
        this.pixelY = gridY * TILE_SIZE;
        this.prevPixelX = this.pixelX;
        this.prevPixelY = this.pixelY;
        this.targetGridX = gridX;
        this.targetGridY = gridY;
        this.moving = false;
        this.moveTimer = 0;
        this.moveSpeed = 0.15; // seconds per tile
        this.direction = DIR.DOWN;
        this.spriteId = spriteId;
        this.animFrame = 0;
        this.animTimer = 0;
        this.visible = true;
    }

    update(dt) {
        if (this.moving) {
            this.moveTimer += dt;
            const t = clamp(this.moveTimer / this.moveSpeed, 0, 1);
            this.pixelX = lerp(this.prevPixelX, this.targetGridX * TILE_SIZE, t);
            this.pixelY = lerp(this.prevPixelY, this.targetGridY * TILE_SIZE, t);

            // Animation
            this.animTimer += dt;
            if (this.animTimer > 0.15) {
                this.animFrame = 1 - this.animFrame;
                this.animTimer = 0;
            }

            if (t >= 1) {
                this.gridX = this.targetGridX;
                this.gridY = this.targetGridY;
                this.pixelX = this.gridX * TILE_SIZE;
                this.pixelY = this.gridY * TILE_SIZE;
                this.moving = false;
                this.moveTimer = 0;
                this.onArrival();
            }
        } else {
            this.animFrame = 0;
            this.animTimer = 0;
        }
    }

    startMove(dir) {
        this.direction = dir;
        this.targetGridX = this.gridX + DIR_DX[dir];
        this.targetGridY = this.gridY + DIR_DY[dir];
        this.prevPixelX = this.pixelX;
        this.prevPixelY = this.pixelY;
        this.moving = true;
        this.moveTimer = 0;
    }

    onArrival() {
        // Override in subclasses
    }

    render(ctx, camX, camY) {
        if (!this.visible) return;
        const sprite = Sprites.get(this.spriteId + '_' + this.direction + '_' + this.animFrame);
        if (sprite) {
            ctx.drawImage(sprite, Math.round(this.pixelX - camX), Math.round(this.pixelY - camY));
        }
    }

    setPosition(gx, gy) {
        this.gridX = gx;
        this.gridY = gy;
        this.targetGridX = gx;
        this.targetGridY = gy;
        this.pixelX = gx * TILE_SIZE;
        this.pixelY = gy * TILE_SIZE;
        this.prevPixelX = this.pixelX;
        this.prevPixelY = this.pixelY;
        this.moving = false;
    }
}
