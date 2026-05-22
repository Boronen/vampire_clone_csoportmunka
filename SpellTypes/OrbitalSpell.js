// ============================================
// OrbitalSpell Class - Spells that orbit the player
// ============================================
class OrbitalSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.orbitRadius = spellData.orbitRadius || 120;
        this.orbitSpeed = spellData.orbitSpeed || 2; // Radians per second
        this.orbitals = [];
        this.damageInterval = spellData.damageInterval || 200;
        this.lastDamageTime = 0;
        
        // Create initial orbitals
        this.createOrbitals();
    }
    
    createOrbitals() {
        const count = this.projectileCount;
        for (let i = 0; i < count; i++) {
            const angleOffset = (Math.PI * 2 / count) * i;
            this.orbitals.push(new OrbitalEffect(this, angleOffset, i));
        }
    }
    
    onCast() {
        // Orbital spells are always active, no need to cast
    }
    
    upgrade() {
        const oldCount = this.projectileCount;
        super.upgrade();
        
        // Add more orbitals when upgraded
        if (this.projectileCount > oldCount) {
            this.orbitals = [];
            this.createOrbitals();
        }
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        const currentTime = Date.now();
        
        // Update orbitals
        for (const orbital of this.orbitals) {
            orbital.update(deltaTime);
        }
        
        // Check collisions with enemies
        if (currentTime - this.lastDamageTime >= this.damageInterval) {
            this.checkCollisions();
            this.lastDamageTime = currentTime;
        }
    }
    
    checkCollisions() {
        for (const orbital of this.orbitals) {
            const bounds = orbital.getBounds();
            
            for (const enemy of this.game.enemies) {
                const enemyBounds = enemy.getBounds();
                
                if (this.checkRectCollision(bounds, enemyBounds)) {
                    enemy.takeDamage(this.damage);
                }
            }
        }
    }
    
    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    render(ctx, cameraX, cameraY) {
        for (const orbital of this.orbitals) {
            orbital.render(ctx, cameraX, cameraY);
        }
        
        super.render(ctx, cameraX, cameraY);
    }
}

// ============================================
// OrbitalEffect Class - Individual orbital instance
// ============================================
class OrbitalEffect {
    constructor(spell, angleOffset, index) {
        this.spell = spell;
        this.angle = angleOffset;
        this.index = index;
        this.x = 0;
        this.y = 0;
        
        // Animation
        this.currentFrame = Math.floor(Math.random() * spell.frameCount);
        this.frameTimer = 0;
        this.frameInterval = 0.06;
    }
    
    update(deltaTime) {
        // Update orbit angle
        this.angle += this.spell.orbitSpeed * deltaTime;
        if (this.angle > Math.PI * 2) {
            this.angle -= Math.PI * 2;
        }
        
        // Calculate position
        const playerCenterX = this.spell.player.x + this.spell.player.width / 2;
        const playerCenterY = this.spell.player.y + this.spell.player.height / 2;
        const radius = this.spell.orbitRadius * this.spell.size;
        
        this.x = playerCenterX + Math.cos(this.angle) * radius;
        this.y = playerCenterY + Math.sin(this.angle) * radius;
        
        // Update animation
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.spell.frameCount;
            this.frameTimer = 0;
        }
    }
    
    render(ctx, cameraX, cameraY) {
        const width = this.spell.width * this.spell.size;
        const height = this.spell.height * this.spell.size;
        
        if (this.spell.spriteLoaded) {
            ctx.save();
            
            // Rotate to face orbital direction
            ctx.translate(this.x - cameraX, this.y - cameraY);
            ctx.rotate(this.angle + Math.PI / 2);
            
            ctx.drawImage(
                this.spell.sprite,
                this.currentFrame * this.spell.frameWidth,
                0,
                this.spell.frameWidth,
                this.spell.frameHeight,
                -width / 2,
                -height / 2,
                width,
                height
            );
            
            ctx.restore();
        } else {
            // Fallback circle
            ctx.fillStyle = '#ff9900';
            ctx.beginPath();
            ctx.arc(this.x - cameraX, this.y - cameraY, width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    getBounds() {
        const width = this.spell.width * this.spell.size;
        const height = this.spell.height * this.spell.size;
        
        return {
            x: this.x - width / 2,
            y: this.y - height / 2,
            width: width,
            height: height
        };
    }
}
