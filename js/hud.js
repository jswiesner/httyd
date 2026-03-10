const HUD = {
    render(ctx, player) {
        if (!player || player.party.length === 0) return;

        // Dragon party icons in top-left
        for (let i = 0; i < player.party.length; i++) {
            const dragon = player.party[i];
            const x = 2 + i * 20;
            const y = 2;

            // Mini dragon icon background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x, y, 18, 14);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, 17, 13);

            // Type color dot
            const typeColor = {
                fire: COLORS.FIRE,
                ice: COLORS.ICE,
                lightning: COLORS.LIGHTNING,
                earth: COLORS.EARTH,
            };
            ctx.fillStyle = typeColor[dragon.species.type] || COLORS.WHITE;
            ctx.fillRect(x + 2, y + 2, 4, 4);

            // Mini HP bar
            const hpRatio = dragon.currentHp / dragon.maxHp;
            const barW = 12;
            ctx.fillStyle = COLORS.BLACK;
            ctx.fillRect(x + 2, y + 8, barW, 3);

            let barColor = COLORS.HP_GREEN;
            if (hpRatio < 0.5) barColor = COLORS.HP_YELLOW;
            if (hpRatio < 0.2) barColor = COLORS.HP_RED;
            ctx.fillStyle = barColor;
            ctx.fillRect(x + 3, y + 9, Math.floor((barW - 2) * hpRatio), 1);

            // Level text
            Sprites.drawText(ctx, 'L' + dragon.level, x + 7, y + 2, COLORS.TEXT);

            // Saddle indicator
            if (dragon.saddle) {
                ctx.fillStyle = '#e8d040';
                ctx.fillRect(x + 14, y + 2, 2, 2);
            }
        }

        // Flight mode indicator (top-right area)
        if (player.isFlying) {
            const blink = Math.floor(Date.now() / 500) % 2;
            const flyText = 'FLY';
            const fx = SCREEN_W - Sprites.textWidth(flyText) - 4;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(fx - 2, 2, Sprites.textWidth(flyText) + 4, 10);
            Sprites.drawText(ctx, flyText, fx, 3, blink ? '#5ac8e8' : '#a0e0f0');
        }

        // Weather indicator (below flight indicator)
        if (typeof WeatherSystem !== 'undefined' && WeatherSystem.current !== Weather.CLEAR) {
            const weatherNames = { fog: 'FOG', thunderstorm: 'STRM' };
            const wText = weatherNames[WeatherSystem.current] || '';
            if (wText) {
                const wx = SCREEN_W - Sprites.textWidth(wText) - 4;
                const wy = player.isFlying ? 14 : 2;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(wx - 2, wy, Sprites.textWidth(wText) + 4, 10);
                const wColor = WeatherSystem.current === Weather.THUNDERSTORM ? '#e8d040' : '#a0a8c0';
                Sprites.drawText(ctx, wText, wx, wy + 1, wColor);
            }
        }

        // Area name (briefly shown on map entry)
        if (this._areaNameTimer > 0) {
            this._areaNameTimer -= 1 / 60;
            const alpha = Math.min(1, this._areaNameTimer);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            const textW = Sprites.textWidth(this._areaName);
            const tx = (SCREEN_W - textW) / 2;
            ctx.fillRect(tx - 4, 20, textW + 8, 14);
            Sprites.drawText(ctx, this._areaName, tx, 23, COLORS.TEXT);
            ctx.globalAlpha = 1;
        }

        // Exit indicators
        this._renderExitIndicators(ctx, player);

        // Flight controls hint (shown briefly when first flying)
        if (player.isFlying && Game.currentMap && Game.currentMap.skyWarp) {
            // Show sky warp hint near top of screen
            const hintTimer = Math.sin(Date.now() * 0.002) * 0.3 + 0.7;
            ctx.globalAlpha = hintTimer * 0.6;
            const hint = 'FLY UP TO SKY ISLANDS';
            const hx = (SCREEN_W - Sprites.textWidth(hint)) / 2;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(hx - 4, SCREEN_H - 14, Sprites.textWidth(hint) + 8, 12);
            Sprites.drawText(ctx, hint, hx, SCREEN_H - 12, '#5ac8e8');
            ctx.globalAlpha = 1;
        }
    },

    _renderExitIndicators(ctx, player) {
        const map = Game.currentMap;
        if (!map || !map.warps) return;
        const cam = Game.camera;
        if (!cam) return;

        const blink = Math.floor(Date.now() / 600) % 2;

        for (const warp of map.warps) {
            // Skip flight-only warps if not flying
            if (warp.flightOnly && !player.isFlying) continue;

            const screenX = Math.round(warp.x * TILE_SIZE - cam.x);
            const screenY = Math.round(warp.y * TILE_SIZE - cam.y);

            if (screenX < -16 || screenX > SCREEN_W + 16 || screenY < -16 || screenY > SCREEN_H + 16) continue;

            let arrowDir = null;
            let ax, ay;
            if (warp.x === 0) {
                arrowDir = 'left';
                ax = screenX - 2;
                ay = screenY + 4;
            } else if (warp.x >= map.width - 1) {
                arrowDir = 'right';
                ax = screenX + 12;
                ay = screenY + 4;
            } else if (warp.y === 0) {
                arrowDir = 'up';
                ax = screenX + 4;
                ay = screenY - 2;
            } else if (warp.y >= map.height - 1) {
                arrowDir = 'down';
                ax = screenX + 4;
                ay = screenY + 12;
            }

            if (!arrowDir) continue;

            ctx.globalAlpha = blink ? 0.9 : 0.5;
            ctx.fillStyle = warp.flightOnly ? '#5ac8e8' : '#ffe850';

            if (arrowDir === 'left') {
                ctx.beginPath();
                ctx.moveTo(ax, ay + 4);
                ctx.lineTo(ax + 6, ay);
                ctx.lineTo(ax + 6, ay + 8);
                ctx.fill();
            } else if (arrowDir === 'right') {
                ctx.beginPath();
                ctx.moveTo(ax + 6, ay + 4);
                ctx.lineTo(ax, ay);
                ctx.lineTo(ax, ay + 8);
                ctx.fill();
            } else if (arrowDir === 'up') {
                ctx.beginPath();
                ctx.moveTo(ax + 4, ay);
                ctx.lineTo(ax, ay + 6);
                ctx.lineTo(ax + 8, ay + 6);
                ctx.fill();
            } else if (arrowDir === 'down') {
                ctx.beginPath();
                ctx.moveTo(ax + 4, ay + 6);
                ctx.lineTo(ax, ay);
                ctx.lineTo(ax + 8, ay);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    },

    _areaName: '',
    _areaNameTimer: 0,

    showAreaName(name) {
        this._areaName = name;
        this._areaNameTimer = 2.5;
    }
};
