// ============================================
// MeleeSpell Class - Close-range melee spells
// ============================================
class MeleeSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.meleeRange = spellData.meleeRange || 100;
        this.attackArc = spellData.attackArc || Math.PI / 2; // 90 degree arc
        this.knockbackForce = spellData.knockbackForce || 200;
    }
    
    onCast() {
        // Create melee attack effect
        const effect = new MeleeEffect(this);
        this.effects.push(effect);
        
        // Damage enemies in melee range
        this.hitEnemiesInRange();
    }
    
    hitEnemiesInRange() {
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        const range = this.meleeRange * this.size;
        
        // Determine attack direction (based on player facing or nearest enemy)
        let attackAngle = 0;
        const nearestEnemy = this.findNearestEnemy();
        
        if (nearestEnemy) {
            const dx = nearestEnemy.x + nearestEnemy.width / 2 - playerCenterX;
            const dy = nearestEnemy.y + nearestEnemy.height / 2 - playerCenterY;
            attackAngle = Math.atan2(dy, dx);
        } else if (this.player.facingLeft !== undefined) {
            attackAngle = this.player.facingLeft ? Math.PI : 0;
        }
        
        // Hit all enemies in the attack arc
        for (const enemy of this.game.enemies) {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            const dx = enemyCenterX - playerCenterX;
            const dy = enemyCenterY - playerCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= range) {
                // Check if enemy is within attack arc
                const angleToEnemy = Math.atan2(dy, dx);
                let angleDiff = angleToEnemy - attackAngle;
                
                // Normalize angle difference
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                
                if (Math.abs(angleDiff) <= this.attackArc / 2) {
                    enemy.takeDamage(this.damage);
                    
                    // Apply knockback
                    if (this.knockbackForce > 0) {
                        const knockbackX = (dx / distance) * this.knockbackForce;
                        const knockbackY = (dy / distance) * this.knockbackForce;

                    }
                }
            }
        }
    }
    
    findNearestEnemy() {
        let nearestEnemy = null;
        let minDistance = Infinity;
        
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        
        for (const enemy of this.game.enemies) {
            const dx = enemy.x - playerCenterX;
            const dy = enemy.y - playerCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
    }
    
    render(ctx, cameraX, cameraY) {
        // Render melee effects
        for (const effect of this.effects) {
            effect.render(ctx, cameraX, cameraY);
        }
        
        super.render(ctx, cameraX, cameraY);
    }
}

// ============================================
// MeleeEffect Class - Visual melee attack effect
// ============================================
class MeleeEffect {
    constructor(spell) {
        this.spell = spell;
        this.duration = 300; // ms
        this.elapsed = 0;
        this.range = spell.meleeRange * spell.size;
        
        // Determine attack direction
        this.angle = 0;
        const playerCenterX = spell.player.x + spell.player.width / 2;
        const playerCenterY = spell.player.y + spell.player.height / 2;
        
        const nearestEnemy = spell.findNearestEnemy();
        if (nearestEnemy) {
            const dx = nearestEnemy.x + nearestEnemy.width / 2 - playerCenterX;
            const dy = nearestEnemy.y + nearestEnemy.height / 2 - playerCenterY;
            this.angle = Math.atan2(dy, dx);
        } else if (spell.player.facingLeft !== undefined) {
            this.angle = spell.player.facingLeft ? Math.PI : 0;
        }
        
        this.startAngle = this.angle - spell.attackArc / 2;
        this.endAngle = this.angle + spell.attackArc / 2;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime * 1000;
    }
    
    render(ctx, cameraX, cameraY) {
        const progress = this.elapsed / this.duration;
        if (progress >= 1) return;
        
        const playerCenterX = this.spell.player.x + this.spell.player.width / 2 - cameraX;
        const playerCenterY = this.spell.player.y + this.spell.player.height / 2 - cameraY;
        
        if (this.spell.spriteLoaded) {
            // Draw animated melee sprite
            const frame = Math.floor(progress * this.spell.frameCount);
            const currentFrame = Math.min(frame, this.spell.frameCount - 1);
            
            ctx.save();
            ctx.globalAlpha = 1 - progress;
            ctx.translate(playerCenterX, playerCenterY);
            ctx.rotate(this.angle);
            
            const size = this.range * 2;
            ctx.drawImage(
                this.spell.sprite,
                currentFrame * this.spell.frameWidth,
                0,
                this.spell.frameWidth,
                this.spell.frameHeight,
                0,
                -size / 2,
                size,
                size
            );
            
            ctx.restore();
        } else {
            // Fallback arc visualization
            ctx.save();
            ctx.globalAlpha = 0.5 * (1 - progress);
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, this.range, this.startAngle, this.endAngle);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    isFinished() {
        return this.elapsed >= this.duration;
    }
}
