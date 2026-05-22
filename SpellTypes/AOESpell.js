// ============================================
// AOESpell Class - Area of Effect spells
// ============================================
class AOESpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.aoeRadius = spellData.aoeRadius || 150;
        this.damageInterval = spellData.damageInterval || 500; // Damage tick rate
        this.lastDamageTime = 0;
        this.followPlayer = spellData.followPlayer !== false; // Default true
    }
    
    onCast() {
        // Create AOE effect at player position or target location
        const effect = new AOEEffect(
            this.followPlayer ? null : this.player.x + this.player.width / 2,
            this.followPlayer ? null : this.player.y + this.player.height / 2,
            this
        );
        
        this.effects.push(effect);
        console.log(`${this.name} cast! Duration: ${this.duration}ms`);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Only damage if we have active effects (for ultimates that expire)
        if (this.effects.length === 0 && this.type === 'ultimate') {
            return; // Ultimate finished, don't damage
        }
        
        const currentTime = Date.now();
        
        // Damage enemies in range
        if (currentTime - this.lastDamageTime >= this.damageInterval) {
            this.damageNearbyEnemies();
            this.lastDamageTime = currentTime;
        }
    }
    
    damageNearbyEnemies() {
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        const radius = this.aoeRadius * this.size;
        
        for (const enemy of this.game.enemies) {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            const dx = enemyCenterX - centerX;
            const dy = enemyCenterY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
                enemy.takeDamage(this.damage / 2); // Reduced damage per tick for AOE
                
                // Apply slow effect if present
                if (this.slow > 0) {
                    enemy.applySlow(this.slow, 1000); // 1 second slow
                }
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        // Only render if we have active effects (for ultimates)
        if (this.type === 'ultimate' && this.effects.length === 0) {
            return; // Don't render finished ultimate
        }
        
        // Render AOE visual effect
        const centerX = this.player.x + this.player.width / 2 - cameraX;
        const centerY = this.player.y + this.player.height / 2 - cameraY;
        const radius = this.aoeRadius * this.size;
        
        if (this.spriteLoaded) {
            // Draw animated sprite
            const drawSize = radius * 2;
            ctx.save();
            ctx.globalAlpha = 0.7;
            
            ctx.drawImage(
                this.sprite,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight,
                centerX - drawSize / 2,
                centerY - drawSize / 2,
                drawSize,
                drawSize
            );
            
            ctx.restore();
        } else {
            // Fallback circle
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        super.render(ctx, cameraX, cameraY);
    }
    
    getBounds() {
        // Return AOE bounds for collision detection
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        const radius = this.aoeRadius * this.size;
        
        return {
            x: centerX - radius,
            y: centerY - radius,
            width: radius * 2,
            height: radius * 2
        };
    }
}

// ============================================
// AOEEffect Class - Individual AOE instance
// ============================================
class AOEEffect {
    constructor(x, y, spell) {
        this.x = x; // null if following player
        this.y = y;
        this.spell = spell;
        this.duration = spell.duration;
        this.elapsed = 0;
        this.radius = spell.aoeRadius * spell.size;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime * 1000; // Convert to ms
    }
    
    render(ctx, cameraX, cameraY) {
        // Rendered by parent spell
    }
    
    isFinished() {
        return this.elapsed >= this.duration;
    }
}
