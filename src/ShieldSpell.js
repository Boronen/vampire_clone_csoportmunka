// ============================================
// ShieldSpell Class - Defensive shield spells
// ============================================
class ShieldSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.shieldHealth = spellData.shieldHealth || 100;
        this.currentShieldHealth = this.shieldHealth;
        this.regenRate = spellData.regenRate || 10; // HP per second
        this.reflectDamage = spellData.reflectDamage || false;
        this.reflectPercent = spellData.reflectPercent || 0.5;
        this.isActive = false;
    }
    
    onCast() {
        // Activate shield
        this.isActive = true;
        this.currentShieldHealth = this.shieldHealth * this.size;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.isActive) {
            // Regenerate shield
            this.currentShieldHealth = Math.min(
                this.currentShieldHealth + this.regenRate * deltaTime,
                this.shieldHealth * this.size
            );
            
            // Shield breaks if health depleted
            if (this.currentShieldHealth <= 0) {
                this.isActive = false;
            }
        }
    }
    
    absorbDamage(damage) {
        if (!this.isActive) return damage;
        
        const absorbed = Math.min(damage, this.currentShieldHealth);
        this.currentShieldHealth -= absorbed;
        
        if (this.currentShieldHealth <= 0) {
            this.isActive = false;
            this.currentShieldHealth = 0;
        }
        
        // Return remaining damage
        return damage - absorbed;
    }
    
    onEnemyContact(enemy) {
        if (!this.isActive || !this.reflectDamage) return;
        
        // Reflect damage back to enemy
        const reflectedDamage = this.damage * this.reflectPercent;
        enemy.takeDamage(reflectedDamage);
    }
    
    render(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const centerX = this.player.x + this.player.width / 2 - cameraX;
        const centerY = this.player.y + this.player.height / 2 - cameraY;
        const radius = (this.player.width / 2 + 30) * this.size;
        
        if (this.spriteLoaded) {
            // Draw animated shield sprite
            const drawSize = radius * 2.5;
            ctx.save();
            ctx.globalAlpha = 0.6;
            
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
            // Fallback shield circle
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Draw shield health bar
        this.renderShieldBar(ctx, centerX, centerY - radius - 15);
        
        super.render(ctx, cameraX, cameraY);
    }
    
    renderShieldBar(ctx, x, y) {
        const barWidth = 60;
        const barHeight = 6;
        const healthPercent = this.currentShieldHealth / (this.shieldHealth * this.size);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
        
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(x - barWidth / 2, y, barWidth * healthPercent, barHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - barWidth / 2, y, barWidth, barHeight);
    }
    
    isShieldActive() {
        return this.isActive;
    }
}
