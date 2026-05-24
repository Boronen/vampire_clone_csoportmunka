// ============================================
// Entity Class - Base class for Player and Enemy
// ============================================
class Entity {
    constructor(x, y, width, height, speed, health, spritePath, frameCount = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.health = health;
        this.maxHealth = health;
        this.sprite = new Image();
        this.spriteLoaded = false;
        this.sprite.onload = () => {
            this.spriteLoaded = true;
            this.frameWidth = this.sprite.width / this.frameCount;
            this.frameHeight = this.sprite.height;
        };
        this.sprite.src = spritePath;
        
        // Animation properties
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 0.1; // 100ms per frame
        this.frameWidth = width;
        this.frameHeight = height;
        
        // Direction for sprite flipping
        this.facingLeft = false;
    }

    update(deltaTime) {
        // Update animation
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameTimer = 0;
        }
    }

    render(ctx, cameraX, cameraY) {
        if (this.spriteLoaded) {
            ctx.save();
            
            // Flip sprite if facing left
            if (this.facingLeft) {
                ctx.translate(this.x - cameraX + this.width, this.y - cameraY);
                ctx.scale(-1, 1);
                ctx.drawImage(
                    this.sprite,
                    this.currentFrame * this.frameWidth,
                    0,
                    this.frameWidth,
                    this.frameHeight,
                    0,
                    0,
                    this.width,
                    this.height
                );
            } else {
                ctx.drawImage(
                    this.sprite,
                    this.currentFrame * this.frameWidth,
                    0,
                    this.frameWidth,
                    this.frameHeight,
                    this.x - cameraX,
                    this.y - cameraY,
                    this.width,
                    this.height
                );
            }
            
            ctx.restore();
        } else {
            // Draw placeholder rectangle if sprite not loaded
            ctx.fillStyle = 'gray';
            ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
        }

        // Draw health bar
        const healthBarWidth = this.width;
        const healthBarHeight = 5;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX, this.y - cameraY - 10, healthBarWidth, healthBarHeight);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - cameraX, this.y - cameraY - 10, healthBarWidth * healthPercent, healthBarHeight);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        
        // Show damage number if game exists
        if (this.game && this.game.damageNumbers) {
            const x = this.x + this.width / 2;
            const y = this.y + this.height / 4;
            this.game.damageNumbers.addDamage(x, y, amount, false);
        }
        
        // Play damage sound for player
        if (this.game && this.game.soundManager && this === this.game.player) {
            this.game.soundManager.playDamage();
        }
    }

    isAlive() {
        return this.health > 0;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
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
