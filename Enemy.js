// ============================================
// Enemy Class - Enemies that chase the player
// ============================================
class Enemy extends Entity {
    constructor(x, y, player) {
        super(x, y, 200, 200, 100, 30, 'Sprites/enemies/frogger_move.png', 8); // 8 frames for frog (4x scale)
        this.player = player;
        this.damage = 10;
        this.scoreValue = 10;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    moveTowardsPlayer(deltaTime) {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.velocityX = (dx / distance);
            this.velocityY = (dy / distance);

            this.x += this.velocityX * this.speed * deltaTime;
            this.y += this.velocityY * this.speed * deltaTime;
            
            // Update facing direction based on horizontal movement towards player
            if (dx < 0) {
                this.facingLeft = true;
            } else if (dx > 0) {
                this.facingLeft = false;
            }
        }
    }

    getScoreValue() {
        return this.scoreValue;
    }

    getDamage() {
        return this.damage;
    }

    update(deltaTime) {
        this.moveTowardsPlayer(deltaTime);
        super.update(deltaTime); // Update animation
    }
}
