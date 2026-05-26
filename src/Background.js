// ============================================
// Background Class - Infinite scrolling background
// ============================================

/**
 * @class Background
 * @classdesc Végtelen ismétlődő háttér osztály. A háttérképet csempézi, 
 * hogy folyamatosan kitöltse a látható területet a kamera mozgása közben.
 */
class Background {
    /**
     * Létrehoz egy új Background példányt.
     * @param {string} imagePath - A háttérkép fájl elérési útja.
     */
    constructor(imagePath) {
        this.image = new Image();
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
            this.width = this.image.width;
            this.height = this.image.height;
        };
        this.image.src = imagePath;
        this.width = 800;
        this.height = 600;
    }

    /**
     * Megjeleníti a hátteret csempézve a látható területen.
     * @param {CanvasRenderingContext2D} ctx - A canvas 2D kontextusa.
     * @param {number} cameraX - A kamera X pozíciója.
     * @param {number} cameraY - A kamera Y pozíciója.
     * @param {number} canvasWidth - A canvas szélessége.
     * @param {number} canvasHeight - A canvas magassága.
     */
    render(ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
    if (!this.imageLoaded) return;

    // Calculate tile positions based on camera position
    const startX = Math.floor(cameraX / this.width) * this.width;
    const startY = Math.floor(cameraY / this.height) * this.height;

    // Disable image smoothing for crisp tiles, then redraw slightly larger to cover gaps
    ctx.imageSmoothingEnabled = false;

    // Draw tiles in a grid to cover the visible area plus some extra
    for (let x = startX - this.width; x < cameraX + canvasWidth + this.width; x += this.width) {
        for (let y = startY - this.height; y < cameraY + canvasHeight + this.height; y += this.height) {
            // Draw slightly larger (1px overlap) to prevent gaps
            ctx.drawImage(this.image, Math.round(x - cameraX), Math.round(y - cameraY), this.width + 1, this.height + 1);
        }
    }
}

    /**
     * Ellenőrzi, hogy a háttérkép betöltődött-e.
     * @returns {boolean} True, ha a kép betöltődött.
     */
    isLoaded() {
        return this.imageLoaded;
    }
}
