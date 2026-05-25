// ============================================
// ProjectileSpell Class - Projectile-based spells
// ============================================
class ProjectileSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
    }
    
    onCast() {
        const enemies = this.game.enemies;
        if (enemies.length === 0) return;
        
        // Find nearest enemy for targeting
        let nearestEnemy = this.findNearestEnemy();
        if (!nearestEnemy) return;
        
        // Fire multiple projectiles if upgraded
        for (let i = 0; i < this.projectileCount; i++) {
            let targetX = nearestEnemy.x + nearestEnemy.width / 2;
            let targetY = nearestEnemy.y + nearestEnemy.height / 2;
            
            // Spread projectiles in a cone for multiple shots
            if (this.projectileCount > 1) {
                const angleSpread = 0.4;
                const angle = (i - (this.projectileCount - 1) / 2) * angleSpread;
                const distance = 200;
                targetX += Math.sin(angle) * distance;
                targetY += Math.cos(angle) * distance;
            }
            
            // Create spell projectile
            const projectile = new SpellProjectile(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                targetX,
                targetY,
                this
            );
            
            this.game.addProjectile(projectile);
        }
    }
    
    findNearestEnemy() {
        let nearestEnemy = null;
        let minDistance = Infinity;
        
        for (const enemy of this.game.enemies) {
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance && distance <= this.range) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
    }
}

// ============================================
// SpellProjectile Class - Individual projectile instance
// ============================================
class SpellProjectile {
    constructor(x, y, targetX, targetY, spell) {
        this.x = x;
        this.y = y;
        this.spell = spell;
        this.active = true;
        this.maxDistance = spell.range;
        this.traveledDistance = 0;
        
        // Visual properties from spell
        this.width = spell.width * spell.size;
        this.height = spell.height * spell.size;
        this.sprite = spell.sprite;
        this.spriteLoaded = spell.spriteLoaded;
        this.frameCount = spell.frameCount;
        this.frameWidth = spell.frameWidth;
        this.frameHeight = spell.frameHeight;
        
        // Animation
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 0.05;
        
        // Stats
        this.damage = spell.damage;
        this.speed = spell.speed;
        this.piercing = spell.piercing;
        this.homing = spell.homing;
        this.chainCount = spell.chainCount;
        this.chainedEnemies = [];
        this.slow = spell.slow;
        
        // Calculate direction
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.velocityX = (dx / distance) * this.speed;
            this.velocityY = (dy / distance) * this.speed;
            this.angle = Math.atan2(dy, dx);
        } else {
            this.velocityX = 0;
            this.velocityY = 0;
            this.angle = 0;
        }
        
        this.hitCount = 0;
    }
    
    update(deltaTime) {
        // Homing behavior
        if (this.homing && this.spell.game) {
            const nearestEnemy = this.findNearestEnemy();
            if (nearestEnemy) {
                const dx = nearestEnemy.x + nearestEnemy.width/2 - this.x;
                const dy = nearestEnemy.y + nearestEnemy.height/2 - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    // Gradual homing
                    const homingStrength = 0.05;
                    this.velocityX += (dx / distance) * this.speed * homingStrength;
                    this.velocityY += (dy / distance) * this.speed * homingStrength;
                    
                    // Normalize velocity
                    const currentSpeed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
                    this.velocityX = (this.velocityX / currentSpeed) * this.speed;
                    this.velocityY = (this.velocityY / currentSpeed) * this.speed;
                    this.angle = Math.atan2(this.velocityY, this.velocityX);
                }
            }
        }
        
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
    
    findNearestEnemy() {
        let nearestEnemy = null;
        let minDistance = Infinity;
        
        for (const enemy of this.spell.game.enemies) {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance && distance <= 300) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
    }
    
    render(ctx, cameraX, cameraY) {
        if (this.spriteLoaded) {
            ctx.save();
            
            // Rotate projectile to face direction of travel
            ctx.translate(this.x - cameraX, this.y - cameraY);
            ctx.rotate(this.angle);
            
            ctx.drawImage(
                this.sprite,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            
            ctx.restore();
        }
    }
    
    onHit(enemy) {
        this.hitCount++;
        
        // Chain lightning effect
        if (this.chainCount > 0 && !this.chainedEnemies.includes(enemy)) {
            this.chainedEnemies.push(enemy);
            
            if (this.chainedEnemies.length < this.chainCount) {
                // Find next enemy to chain to
                const nextEnemy = this.findNearestUnchainedEnemy(enemy);
                if (nextEnemy) {
                    // Create new projectile to chain to next enemy
                    const chainProjectile = new SpellProjectile(
                        enemy.x + enemy.width / 2,
                        enemy.y + enemy.height / 2,
                        nextEnemy.x + nextEnemy.width / 2,
                        nextEnemy.y + nextEnemy.height / 2,
                        this.spell
                    );
                    chainProjectile.chainedEnemies = [...this.chainedEnemies];
                    this.spell.game.addProjectile(chainProjectile);
                }
            }
        }
        
        // Deactivate if not piercing
        if (!this.piercing) {
            this.active = false;
        }
    }
    
    findNearestUnchainedEnemy(fromEnemy) {
        let nearestEnemy = null;
        let minDistance = Infinity;
        
        for (const enemy of this.spell.game.enemies) {
            if (this.chainedEnemies.includes(enemy)) continue;
            
            const dx = enemy.x - fromEnemy.x;
            const dy = enemy.y - fromEnemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance && distance <= 400) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
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
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    
    getSlow() {
        return this.slow;
    }
}
