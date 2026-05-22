// ============================================
// Spell Class - Base class for all spells
// ============================================
class Spell {
    constructor(spellData, player) {
        this.id = spellData.id;
        this.name = spellData.name;
        this.description = spellData.description || '';
        this.type = spellData.type; // 'projectile', 'aoe', 'orbital', 'shield', 'melee', 'ultimate', 'active'
        this.level = 1;
        this.player = player;
        
        // Sprite properties
        this.sprite = new Image();
        this.spriteLoaded = false;
        this.sprite.onload = () => {
            this.spriteLoaded = true;
            this.frameWidth = this.sprite.width / this.frameCount;
            this.frameHeight = this.sprite.height;
        };
        this.sprite.src = spellData.sprite;
        this.frameCount = spellData.frameCount;
        
        // Animation
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 0.08; // 80ms per frame
        
        // Visual properties
        this.width = spellData.width || 64;
        this.height = spellData.height || 64;
        this.scale = spellData.scale || 1.0;
        
        // Base stats (will be modified by level)
        this.baseDamage = spellData.damage || 20;
        this.baseCooldown = spellData.cooldown || 2000;
        this.baseRange = spellData.range || 400;
        this.baseSpeed = spellData.speed || 300;
        this.baseDuration = spellData.duration || 5000;
        this.baseProjectileCount = spellData.projectileCount || 1;
        this.baseSize = spellData.size || 1.0;
        
        // Current stats
        this.damage = this.baseDamage;
        this.cooldown = this.baseCooldown;
        this.range = this.baseRange;
        this.speed = this.baseSpeed;
        this.duration = this.baseDuration;
        this.projectileCount = this.baseProjectileCount;
        this.size = this.baseSize;
        
        // Special properties
        this.piercing = spellData.piercing || false;
        this.homing = spellData.homing || false;
        this.chainCount = spellData.chainCount || 0;
        this.knockback = spellData.knockback || 0;
        this.slow = spellData.slow || 0;
        
        // State
        this.lastCastTime = 0;
        this.active = true;
        
        // Upgrade properties
        this.maxLevel = 3;
        this.upgradeSprite = spellData.upgradeSprite || null;
        this.upgradesInto = spellData.upgradesInto || null;
        this.combinesWith = spellData.combinesWith || [];
        this.combinedResult = spellData.combinedResult || null;
        
        // Effect instances (for spells that create multiple effects)
        this.effects = [];
    }
    
    canCast(currentTime) {
        return (currentTime - this.lastCastTime) >= this.cooldown;
    }
    
    cast(currentTime) {
        if (!this.canCast(currentTime)) return false;
        
        this.lastCastTime = currentTime;
        this.onCast();
        return true;
    }
    
    // Override in subclasses
    onCast() {
        // Implemented by spell type subclasses
    }
    
    upgrade() {
        if (this.level >= this.maxLevel) return false;
        
        this.level++;
        
        // Level 2: +50% damage, -25% cooldown
        if (this.level === 2) {
            this.damage = Math.floor(this.baseDamage * 1.5);
            this.cooldown = Math.floor(this.baseCooldown * 0.75);
            this.range = Math.floor(this.baseRange * 1.2);
        }
        
        // Level 3: +100% damage, -50% cooldown, +bonus effects
        if (this.level === 3) {
            this.damage = Math.floor(this.baseDamage * 2);
            this.cooldown = Math.floor(this.baseCooldown * 0.5);
            this.range = Math.floor(this.baseRange * 1.5);
            this.projectileCount = Math.ceil(this.baseProjectileCount * 1.5);
            this.size = this.baseSize * 1.3;
            
            // Use upgrade sprite if available
            if (this.upgradeSprite) {
                this.sprite.src = this.upgradeSprite;
            }
        }
        
        return true;
    }
    
    update(deltaTime) {
        // Update animation
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameTimer = 0;
        }
        
        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].update(deltaTime);
            if (this.effects[i].isFinished()) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        // Render effects
        for (const effect of this.effects) {
            effect.render(ctx, cameraX, cameraY);
        }
    }
    
    getStats() {
        return {
            name: this.name,
            level: this.level,
            damage: this.damage,
            cooldown: (this.cooldown / 1000).toFixed(1) + 's',
            range: this.range,
            special: this.getSpecialText()
        };
    }
    
    getSpecialText() {
        const specials = [];
        if (this.piercing) specials.push('Piercing');
        if (this.homing) specials.push('Homing');
        if (this.chainCount > 0) specials.push(`Chain x${this.chainCount}`);
        if (this.slow > 0) specials.push('Slow');
        if (this.projectileCount > 1) specials.push(`${this.projectileCount} projectiles`);
        return specials.join(', ') || 'None';
    }
    
    deactivate() {
        this.active = false;
    }
    
    isActive() {
        return this.active;
    }
    
    getBounds() {
        // Default bounds for spell (centered on player)
        // Override in subclasses for specific behavior
        return {
            x: this.player.x,
            y: this.player.y,
            width: this.width,
            height: this.height
        };
    }
}
