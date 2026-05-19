// ============================================
// Projectile Class - Player weapons/spells
// ============================================
class Projectile {
    constructor(x, y, targetX, targetY, type, baseDamage = 20) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.maxDistance = 600;
        this.traveledDistance = 0;
        
        // Animation properties
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 0.08; // 80ms per frame

        // Different properties based on type (2x scale)
        if (type === 'thunder') {
            this.width = 80;
            this.height = 80;
            this.speed = 400;
            this.damage = baseDamage;
            this.frameCount = 5; // Thunder has 5 frames
            this.loadSprite('Sprites/Thunder Projectile 1/Thunder projectile1 wo blur.png');
        } else if (type === 'magic') {
            this.width = 64;
            this.height = 64;
            this.speed = 350;
            this.damage = baseDamage;
            this.frameCount = 16; // Projectile 2 has 16 frames
            this.loadSprite('Sprites/Projectile 2/Projectile 2 wo blur.png');
        }

        // Calculate direction
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.velocityX = (dx / distance) * this.speed;
            this.velocityY = (dy / distance) * this.speed;
        } else {
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }

    loadSprite(path) {
        this.sprite = new Image();
        this.spriteLoaded = false;
        this.sprite.onload = () => {
            this.spriteLoaded = true;
            this.frameWidth = this.sprite.width / this.frameCount;
            this.frameHeight = this.sprite.height;
        };
        this.sprite.src = path;
        this.frameWidth = this.width;
        this.frameHeight = this.height;
    }

    update(deltaTime) {
        const moveX = this.velocityX * deltaTime;
        const moveY = this.velocityY * deltaTime;
        
        this.x += moveX;
        this.y += moveY;

        const moveDist = Math.sqrt(moveX * moveX + moveY * moveY);
        this.traveledDistance += moveDist;

        if (this.traveledDistance > this.maxDistance) {
            this.active = false;
        }
        
        // Update animation
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameTimer = 0;
        }
    }

    render(ctx, cameraX, cameraY) {
        if (this.spriteLoaded) {
            // Draw the current frame from the spritesheet
            ctx.drawImage(
                this.sprite,
                this.currentFrame * this.frameWidth, // source X
                0, // source Y
                this.frameWidth, // source width
                this.frameHeight, // source height
                this.x - cameraX, // destination X
                this.y - cameraY, // destination Y
                this.width, // destination width
                this.height // destination height
            );
        } else {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
        }
    }

    isActive() {
        return this.active;
    }

    deactivate() {
        this.active = false;
    }

    getDamage() {
        return this.damage;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
