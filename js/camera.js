class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
    }

    follow(entity, mapWidth, mapHeight) {
        // Center on entity
        this.targetX = entity.pixelX + TILE_SIZE / 2 - SCREEN_W / 2;
        this.targetY = entity.pixelY + TILE_SIZE / 2 - SCREEN_H / 2;

        // Clamp to map bounds
        const maxX = mapWidth * TILE_SIZE - SCREEN_W;
        const maxY = mapHeight * TILE_SIZE - SCREEN_H;
        this.targetX = clamp(this.targetX, 0, Math.max(0, maxX));
        this.targetY = clamp(this.targetY, 0, Math.max(0, maxY));

        // Smooth follow
        this.x = lerp(this.x, this.targetX, 0.2);
        this.y = lerp(this.y, this.targetY, 0.2);

        // Snap when close
        if (Math.abs(this.x - this.targetX) < 0.5) this.x = this.targetX;
        if (Math.abs(this.y - this.targetY) < 0.5) this.y = this.targetY;
    }

    snap(entity, mapWidth, mapHeight) {
        this.x = entity.pixelX + TILE_SIZE / 2 - SCREEN_W / 2;
        this.y = entity.pixelY + TILE_SIZE / 2 - SCREEN_H / 2;
        const maxX = mapWidth * TILE_SIZE - SCREEN_W;
        const maxY = mapHeight * TILE_SIZE - SCREEN_H;
        this.x = clamp(this.x, 0, Math.max(0, maxX));
        this.y = clamp(this.y, 0, Math.max(0, maxY));
        this.targetX = this.x;
        this.targetY = this.y;
    }
}
