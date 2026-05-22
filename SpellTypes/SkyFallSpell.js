// ============================================
// SkyFallSpell Class - Projectiles that fall from above
// ============================================
class SkyFallSpell extends Spell {
    constructor(config, player) {
        super(config, player);
        this.fallFromSky = true;
        this.fallingProjectiles = [];
        this.fallSpeed = config.fallSpeed || 400; // pixels per second
        this.skyHeight = 300; // How high above target to spawn
    }
    
    cast(currentTime) {
        if (!this.canCast(currentTime)) return;
        
        // Find nearest enemy
        const enemies = this.player.game.enemies;
        if (enemies.length === 0) return;
        
        const target = this.findNearestEnemy(enemies);
        if (!target) return;
        
        // Create projectile(s) falling from sky
        const count = this.projectileCount || 1;
        for (let i = 0; i < count; i++) {
            const targetX = target.x + target.width / 2;
            const targetY = target.y + target.height / 2;
            
            // Add some spread for multiple projectiles
            const spreadX = (Math.random() - 0.5) * 100;
            const spreadY = (Math.random() - 0.5) * 100;
            
            const projectile = {
                x: targetX + spreadX,
                y: targetY - this.skyHeight + spreadY, // Start above target
                targetY: targetY + spreadY,
                width: this.width,
                height: this.height,
                speed: this.fallSpeed,
                frameIndex: 0,
                startTime: currentTime,
                hasHit: false
            };
            
            this.fallingProjectiles.push(projectile);
        }
        
        this.lastCastTime = currentTime;
        console.log(`Cast ${this.name} - ${count} projectile(s) falling from sky`);
    }
    
    findNearestEnemy(enemies) {
        let nearest = null;
        let minDist = Infinity;
        
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        
        for (const enemy of enemies) {
            const dx = (enemy.x + enemy.width / 2) - playerCenterX;
            const dy = (enemy.y + enemy.height / 2) - playerCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < minDist && dist < (this.range || 600)) {
                minDist = dist;
                nearest = enemy;
            }
        }
        
        return nearest;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        const enemies = this.player.game.enemies;
        
        // Update falling projectiles
        for (let i = this.fallingProjectiles.length - 1; i >= 0; i--) {
            const proj = this.fallingProjectiles[i];
            
            // Move downward
            proj.y += proj.speed * deltaTime;
            
            // Update animation
            const elapsed = Date.now() - proj.startTime;
            proj.frameIndex = Math.floor((elapsed / 100) % this.frameCount);
            
            // Check if reached target or below
            if (proj.y >= proj.targetY && !proj.hasHit) {
                proj.hasHit = true;
                this.onImpact(proj, enemies);
            }
            
            // Remove if way below target
            if (proj.y > proj.targetY + 100) {
                this.fallingProjectiles.splice(i, 1);
            }
        }
    }
    
    onImpact(projectile, enemies) {
        // Deal damage to enemies in impact area
        const impactRadius = this.aoeRadius || 80;
        
        for (const enemy of enemies) {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            const dx = enemyCenterX - projectile.x;
            const dy = enemyCenterY - projectile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < impactRadius) {
                const damage = this.damage * (1 + this.level * 0.2);
                enemy.takeDamage(damage);
            }
        }
        
        console.log(`${this.name} impact at (${Math.floor(projectile.x)}, ${Math.floor(projectile.y)})`);
    }
    
    render(ctx, cameraX, cameraY) {
        if (!this.spriteLoaded) return;
        
        // Render all falling projectiles
        for (const proj of this.fallingProjectiles) {
            const sourceX = proj.frameIndex * this.frameWidth;
            const sourceY = 0;
            
            ctx.save();
            
            // Add shadow effect for falling
            const alpha = proj.hasHit ? 0.5 : 1.0;
            ctx.globalAlpha = alpha;
            
            ctx.drawImage(
                this.sprite,
                sourceX, sourceY,
                this.frameWidth, this.frameHeight,
                proj.x - proj.width / 2 - cameraX,
                proj.y - proj.height / 2 - cameraY,
                proj.width, proj.height
            );
            
            // Draw impact circle when hit
            if (proj.hasHit) {
                ctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(
                    proj.x - cameraX,
                    proj.y - cameraY,
                    this.aoeRadius || 80,
                    0, Math.PI * 2
                );
                ctx.stroke();
            }
            
            ctx.restore();
        }
    }
    
    getBounds() {
        // Return bounds of first falling projectile
        if (this.fallingProjectiles.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        
        const proj = this.fallingProjectiles[0];
        return {
            x: proj.x - proj.width / 2,
            y: proj.y - proj.height / 2,
            width: proj.width,
            height: proj.height
        };
    }
}
