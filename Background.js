// ============================================
// Background Class - Infinite scrolling background
// ============================================
class Background {
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

    render(ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
        if (!this.imageLoaded) return;

        // Calculate tile positions based on camera position
        const startX = Math.floor(cameraX / this.width) * this.width;
        const startY = Math.floor(cameraY / this.height) * this.height;

        // Draw tiles in a grid to cover the visible area plus some extra
        for (let x = startX - this.width; x < cameraX + canvasWidth + this.width; x += this.width) {
            for (let y = startY - this.height; y < cameraY + canvasHeight + this.height; y += this.height) {
                ctx.drawImage(this.image, x - cameraX, y - cameraY, this.width, this.height);
            }
        }
    }

    isLoaded() {
        return this.imageLoaded;
    }
}
