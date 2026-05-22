// ============================================
// StaticAOESpell Class - AOE zones placed on enemy locations
// ============================================
class StaticAOESpell extends Spell {
    constructor(config, player) {
        super(config, player);
        this.spawnOnEnemy = true;
        this.zones = []; // Active damage zones
    }
    
    cast(currentTime) {
        if (!this.canCast(currentTime)) return;
        
        // Find nearest enemy
        const enemies = this.player.game.enemies;
        if (enemies.length === 0) return;
        
        const target = this.findNearestEnemy(enemies);
        if (!target) return;
        
        // Create damage zone at target location
        const zone = {
            x: target.x + target.width / 2 - this.width / 2,
            y: target.y + target.height / 2 - this.height / 2,
            width: this.width,
            height: this.height,
            radius: this.aoeRadius || 100,
            startTime: currentTime,
            duration: this.duration,
            frameIndex: 0,
            lastDamageTime: currentTime,
            damageInterval: this.damageInterval || 300
        };
        
        this.zones.push(zone);
        this.lastCastTime = currentTime;
        
        console.log(`Cast ${this.name} at enemy location (${Math.floor(zone.x)}, ${Math.floor(zone.y)})`);
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
        
        const currentTime = Date.now();
        const enemies = this.player.game.enemies;
        
        // Update all active zones
        for (let i = this.zones.length - 1; i >= 0; i--) {
            const zone = this.zones[i];
            const elapsed = currentTime - zone.startTime;
            
            // Remove expired zones
            if (elapsed >= zone.duration) {
                this.zones.splice(i, 1);
                continue;
            }
            
            // Update animation
            const progress = elapsed / zone.duration;
            zone.frameIndex = Math.floor(progress * this.frameCount);
            
            // Apply damage to enemies in zone
            if (currentTime - zone.lastDamageTime >= zone.damageInterval) {
                this.damageEnemiesInZone(zone, enemies);
                zone.lastDamageTime = currentTime;
            }
        }
    }
    
    damageEnemiesInZone(zone, enemies) {
        const zoneCenterX = zone.x + zone.width / 2;
        const zoneCenterY = zone.y + zone.height / 2;
        
        for (const enemy of enemies) {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            const dx = enemyCenterX - zoneCenterX;
            const dy = enemyCenterY - zoneCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < zone.radius) {
                enemy.takeDamage(this.damage * (1 + this.level * 0.2));
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        if (!this.spriteLoaded) return;
        
        // Render all active zones
        for (const zone of this.zones) {
            const sourceX = zone.frameIndex * this.frameWidth;
            const sourceY = 0;
            
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.drawImage(
                this.sprite,
                sourceX, sourceY,
                this.frameWidth, this.frameHeight,
                zone.x - cameraX, zone.y - cameraY,
                zone.width, zone.height
            );
            ctx.restore();
        }
    }
    
    getBounds() {
        // Return combined bounds of all zones
        if (this.zones.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        
        // Return first zone bounds for simplicity
        const zone = this.zones[0];
        return {
            x: zone.x,
            y: zone.y,
            width: zone.width,
            height: zone.height
        };
    }
}
