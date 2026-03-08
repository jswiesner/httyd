function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function weightedRandom(items) {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let r = Math.random() * total;
    for (const item of items) {
        r -= item.weight;
        if (r <= 0) return item;
    }
    return items[items.length - 1];
}

function createCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}

function drawPixels(ctx, x, y, w, h, data, palette) {
    for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
            const color = palette[data[py * w + px]];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x + px, y + py, 1, 1);
            }
        }
    }
}

function parseSprite(str, palette) {
    const lines = str.trim().split('\n').map(l => l.trim());
    const h = lines.length;
    const w = lines[0].length;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const ch = lines[y][x];
            if (ch !== '.' && palette[ch]) {
                ctx.fillStyle = palette[ch];
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
    return canvas;
}

// Scale a canvas by an integer factor
function scaleCanvas(src, factor) {
    const dst = createCanvas(src.width * factor, src.height * factor);
    const ctx = dst.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, 0, 0, dst.width, dst.height);
    return dst;
}
