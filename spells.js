// ============================================
// SPELL SYSTEM - All spell-related classes and data
// ============================================

// ============================================
// Spell Base Class
// ============================================
class Spell {
    constructor(spellData, player) {
        this.id = spellData.id;
        this.name = spellData.name;
        this.description = spellData.description;
        this.type = spellData.type; // 'passive', 'ultimate', 'active'
        this.spellClass = spellData.spellClass;
        this.player = player;
        
        // Visual
        this.sprite = new Image();
        this.spritePath = spellData.sprite;
        this.sprite.src = this.spritePath;
        this.spriteLoaded = false;
        this.sprite.onload = () => {
            this.spriteLoaded = true;
            this.frameWidth = this.sprite.width / this.frameCount;
            this.frameHeight = this.sprite.height;
        };
        
        this.frameCount = spellData.frameCount || 1;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.frameDuration = 1 / 30; // 30 FPS
        this.width = spellData.width || 50;
        this.height = spellData.height || 50;
        
        // Stats
        this.damage = spellData.damage || 10;
        this.cooldown = spellData.cooldown || 1000;
        this.lastCastTime = 0;
        this.range = spellData.range || 300;
        this.speed = spellData.speed || 200;
        this.duration = spellData.duration || 3000;
        this.slow = spellData.slow || 0;
        
        // Upgrade system
        this.level = 1;
        this.maxLevel = 3;
        this.upgradeSprite = spellData.upgradeSprite;
        
        // Size multiplier (grows with upgrades)
        this.size = 1.0;
        
        // Combination
        this.combinesWith = spellData.combinesWith || [];
        this.combinedResult = spellData.combinedResult;
        
        // Effects tracking
        this.effects = [];
    }
    
    canCast(currentTime) {
        return currentTime - this.lastCastTime >= this.cooldown;
    }
    
    cast(currentTime) {
        if (!this.canCast(currentTime)) return false;
        this.lastCastTime = currentTime;
        this.onCast();
        return true;
    }
    
    onCast() {
        // Override in subclasses
    }
    
    update(deltaTime) {
        // Update animation
        this.frameTime += deltaTime;
        if (this.frameTime >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameTime = 0;
        }
        
        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].update(deltaTime);
            if (this.effects[i].isFinished && this.effects[i].isFinished()) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        // Effects are rendered by subclasses
    }
    
    upgrade() {
        if (this.level >= this.maxLevel) return false;
        
        this.level++;
        const multiplier = 1.2; // 20% increase per level
        
        // Upgrade stats
        this.damage *= multiplier;
        this.range *= multiplier;
        this.size *= multiplier;
        
        if (this.cooldown > 100) {
            this.cooldown = Math.max(100, this.cooldown * 0.9); // Reduce cooldown by 10%
        }
        
        // Switch to upgrade sprite if available
        if (this.level >= 2 && this.upgradeSprite) {
            this.sprite.src = this.upgradeSprite;
        }
        
        return true;
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width * this.size,
            height: this.height * this.size
        };
    }
}

// ============================================
// ProjectileSpell Class
// ============================================
class ProjectileSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.projectileCount = spellData.projectileCount || 1;
        this.homing = spellData.homing || false;
        this.piercing = spellData.piercing || false;
        this.chainCount = spellData.chainCount || 0;
    }
    
    onCast() {
        const nearestEnemy = this.findNearestEnemy();
        if (!nearestEnemy) return;
        
        for (let i = 0; i < this.projectileCount; i++) {
            let targetX = nearestEnemy.x + nearestEnemy.width / 2;
            let targetY = nearestEnemy.y + nearestEnemy.height / 2;
            
            if (this.projectileCount > 1) {
                const angleSpread = 0.4;
                const angle = (i - (this.projectileCount - 1) / 2) * angleSpread;
                const distance = 100;
                targetX += Math.sin(angle) * distance;
                targetY += Math.cos(angle) * distance;
            }
            
            const projectile = new SpellProjectile(this, targetX, targetY);
            this.effects.push(projectile);
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
        for (const projectile of this.effects) {
            projectile.render(ctx, cameraX, cameraY);
        }
        super.render(ctx, cameraX, cameraY);
    }
}

// ============================================
// SpellProjectile Class
// ============================================
class SpellProjectile {
    constructor(spell, targetX, targetY) {
        this.spell = spell;
        this.x = spell.player.x + spell.player.width / 2;
        this.y = spell.player.y + spell.player.height / 2;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * spell.speed;
        this.vy = (dy / distance) * spell.speed;
        this.distanceTraveled = 0;
        this.active = true;
        this.hitEnemies = new Set();
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.distanceTraveled += Math.abs(this.vx * deltaTime) + Math.abs(this.vy * deltaTime);
        
        if (this.distanceTraveled > this.spell.range) {
            this.active = false;
            return;
        }
        
        // Check collision with enemies
        for (const enemy of this.spell.game.enemies) {
            if (this.hitEnemies.has(enemy)) continue;
            
            const dx = (enemy.x + enemy.width / 2) - this.x;
            const dy = (enemy.y + enemy.height / 2) - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (this.spell.width / 2 + enemy.width / 2)) {
                enemy.takeDamage(this.spell.damage);
                this.hitEnemies.add(enemy);
                
                if (this.spell.slow > 0 && enemy.applySlow) {
                    enemy.applySlow(this.spell.slow, 1000);
                }
                
                if (!this.spell.piercing) {
                    this.active = false;
                }
                break;
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        const drawX = this.x - cameraX;
        const drawY = this.y - cameraY;
        const size = this.spell.width * this.spell.size;
        
        if (this.spell.spriteLoaded) {
            ctx.save();
            ctx.globalAlpha = 0.9;
            ctx.drawImage(
                this.spell.sprite,
                this.spell.currentFrame * this.spell.frameWidth,
                0,
                this.spell.frameWidth,
                this.spell.frameHeight,
                drawX - size / 2,
                drawY - size / 2,
                size,
                size
            );
            ctx.restore();
        } else {
            ctx.fillStyle = '#ffaa00';
            ctx.beginPath();
            ctx.arc(drawX, drawY, size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    isFinished() {
        return !this.active;
    }
    
    getBounds() {
        const size = this.spell.width * this.spell.size;
        return {
            x: this.x - size / 2,
            y: this.y - size / 2,
            width: size,
            height: size
        };
    }
}

// ============================================
// AOESpell Class
// ============================================
class AOESpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.aoeRadius = spellData.aoeRadius || 150;
        this.damageInterval = spellData.damageInterval || 500;
        this.lastDamageTime = 0;
        this.followPlayer = spellData.followPlayer !== false;
    }
    
    onCast() {
        this.lastDamageTime = Date.now();
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        const currentTime = Date.now();
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
                enemy.takeDamage(this.damage / 2);
                
                if (this.slow > 0 && enemy.applySlow) {
                    enemy.applySlow(this.slow, 1000);
                }
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        const centerX = this.player.x + this.player.width / 2 - cameraX;
        const centerY = this.player.y + this.player.height / 2 - cameraY;
        const radius = this.aoeRadius * this.size;
        
        if (this.spriteLoaded) {
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
        const radius = this.aoeRadius * this.size;
        return {
            x: this.player.x + this.player.width / 2 - radius,
            y: this.player.y + this.player.height / 2 - radius,
            width: radius * 2,
            height: radius * 2
        };
    }
}

// ============================================
// OrbitalSpell Class
// ============================================
class OrbitalSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.orbitRadius = spellData.orbitRadius || 100;
        this.orbitSpeed = spellData.orbitSpeed || 2;
        this.projectileCount = spellData.projectileCount || 1;
        this.damageInterval = spellData.damageInterval || 200;
        this.orbitals = [];
        this.initializeOrbitals();
    }
    
    initializeOrbitals() {
        this.orbitals = [];
        for (let i = 0; i < this.projectileCount; i++) {
            const angle = (Math.PI * 2 / this.projectileCount) * i;
            this.orbitals.push({
                angle: angle,
                lastDamageTime: 0
            });
        }
    }
    
    onCast() {
        // Orbitals are always active
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Update orbital positions
        for (const orbital of this.orbitals) {
            orbital.angle += this.orbitSpeed * deltaTime;
        }
        
        // Check collisions
        const currentTime = Date.now();
        for (const orbital of this.orbitals) {
            if (currentTime - orbital.lastDamageTime < this.damageInterval) continue;
            
            const orbitalPos = this.getOrbitalPosition(orbital);
            
            for (const enemy of this.game.enemies) {
                const dx = (enemy.x + enemy.width / 2) - orbitalPos.x;
                const dy = (enemy.y + enemy.height / 2) - orbitalPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < (this.width * this.size / 2 + enemy.width / 2)) {
                    enemy.takeDamage(this.damage);
                    orbital.lastDamageTime = currentTime;
                    break;
                }
            }
        }
    }
    
    getOrbitalPosition(orbital) {
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        const radius = this.orbitRadius * this.size;
        
        return {
            x: centerX + Math.cos(orbital.angle) * radius,
            y: centerY + Math.sin(orbital.angle) * radius
        };
    }
    
    render(ctx, cameraX, cameraY) {
        for (const orbital of this.orbitals) {
            const pos = this.getOrbitalPosition(orbital);
            const drawX = pos.x - cameraX;
            const drawY = pos.y - cameraY;
            const size = this.width * this.size;
            
            if (this.spriteLoaded) {
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.drawImage(
                    this.sprite,
                    this.currentFrame * this.frameWidth,
                    0,
                    this.frameWidth,
                    this.frameHeight,
                    drawX - size / 2,
                    drawY - size / 2,
                    size,
                    size
                );
                ctx.restore();
            } else {
                ctx.fillStyle = '#ff0000';
                ctx.beginPath();
                ctx.arc(drawX, drawY, size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        super.render(ctx, cameraX, cameraY);
    }
    
    upgrade() {
        const result = super.upgrade();
        if (result && this.level % 2 === 0) {
            this.projectileCount++;
            this.initializeOrbitals();
        }
        return result;
    }
    
    getBounds() {
        // Return bounds of all orbitals combined
        const radius = this.orbitRadius * this.size;
        return {
            x: this.player.x + this.player.width / 2 - radius - this.width / 2,
            y: this.player.y + this.player.height / 2 - radius - this.width / 2,
            width: (radius + this.width / 2) * 2,
            height: (radius + this.width / 2) * 2
        };
    }
}

// ============================================
// ShieldSpell Class
// ============================================
class ShieldSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.shieldHealth = spellData.shieldHealth || 100;
        this.currentShieldHealth = this.shieldHealth;
        this.regenRate = spellData.regenRate || 10;
        this.reflectDamage = spellData.reflectDamage || false;
        this.reflectPercent = spellData.reflectPercent || 0.5;
        this.isActive = false;
    }
    
    onCast() {
        this.isActive = true;
        this.currentShieldHealth = this.shieldHealth * this.size;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.isActive) {
            this.currentShieldHealth = Math.min(
                this.currentShieldHealth + this.regenRate * deltaTime,
                this.shieldHealth * this.size
            );
            
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
        
        return damage - absorbed;
    }
    
    render(ctx, cameraX, cameraY) {
        if (!this.isActive) return;
        
        const centerX = this.player.x + this.player.width / 2 - cameraX;
        const centerY = this.player.y + this.player.height / 2 - cameraY;
        const radius = (this.player.width / 2 + 30) * this.size;
        
        if (this.spriteLoaded) {
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
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Shield health bar
        const barWidth = 60;
        const barHeight = 6;
        const healthPercent = this.currentShieldHealth / (this.shieldHealth * this.size);
        const barY = centerY - radius - 15;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(centerX - barWidth / 2, barY, barWidth, barHeight);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(centerX - barWidth / 2, barY, barWidth * healthPercent, barHeight);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - barWidth / 2, barY, barWidth, barHeight);
        
        super.render(ctx, cameraX, cameraY);
    }
    
    isShieldActive() {
        return this.isActive;
    }
    
    getBounds() {
        if (!this.isActive) return { x: 0, y: 0, width: 0, height: 0 };
        const radius = (this.player.width / 2 + 30) * this.size;
        return {
            x: this.player.x + this.player.width / 2 - radius,
            y: this.player.y + this.player.height / 2 - radius,
            width: radius * 2,
            height: radius * 2
        };
    }
}

// ============================================
// MeleeSpell Class
// ============================================
class MeleeSpell extends Spell {
    constructor(spellData, player) {
        super(spellData, player);
        this.game = player.game;
        this.meleeRange = spellData.meleeRange || 100;
        this.attackArc = spellData.attackArc || Math.PI / 2;
        this.knockbackForce = spellData.knockbackForce || 200;
    }
    
    onCast() {
        const effect = { spell: this, duration: 300, elapsed: 0 };
        this.effects.push(effect);
        this.hitEnemiesInRange();
    }
    
    hitEnemiesInRange() {
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        const range = this.meleeRange * this.size;
        
        let attackAngle = 0;
        const nearestEnemy = this.findNearestEnemy();
        
        if (nearestEnemy) {
            const dx = nearestEnemy.x + nearestEnemy.width / 2 - playerCenterX;
            const dy = nearestEnemy.y + nearestEnemy.height / 2 - playerCenterY;
            attackAngle = Math.atan2(dy, dx);
        } else if (this.player.facingLeft !== undefined) {
            attackAngle = this.player.facingLeft ? Math.PI : 0;
        }
        
        for (const enemy of this.game.enemies) {
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            const dx = enemyCenterX - playerCenterX;
            const dy = enemyCenterY - playerCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= range) {
                const angleToEnemy = Math.atan2(dy, dx);
                let angleDiff = angleToEnemy - attackAngle;
                
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                
                if (Math.abs(angleDiff) <= this.attackArc / 2) {
                    enemy.takeDamage(this.damage);
                    
                    if (this.knockbackForce > 0 && enemy.applyKnockback) {
                        const knockbackX = (dx / distance) * this.knockbackForce;
                        const knockbackY = (dy / distance) * this.knockbackForce;
                        enemy.applyKnockback(knockbackX, knockbackY);
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
    
    update(deltaTime) {
        super.update(deltaTime);
        
        for (const effect of this.effects) {
            effect.elapsed += deltaTime * 1000;
        }
    }
    
    render(ctx, cameraX, cameraY) {
        for (const effect of this.effects) {
            const progress = effect.elapsed / effect.duration;
            if (progress >= 1) continue;
            
            const playerCenterX = this.player.x + this.player.width / 2 - cameraX;
            const playerCenterY = this.player.y + this.player.height / 2 - cameraY;
            
            ctx.save();
            ctx.globalAlpha = 0.5 * (1 - progress);
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(playerCenterX, playerCenterY, this.meleeRange * this.size, 0, this.attackArc);
            ctx.stroke();
            ctx.restore();
        }
        
        super.render(ctx, cameraX, cameraY);
    }
    
    getBounds() {
        const range = this.meleeRange * this.size;
        return {
            x: this.player.x + this.player.width / 2 - range,
            y: this.player.y + this.player.height / 2 - range,
            width: range * 2,
            height: range * 2
        };
    }
}

// ============================================
// SpellManager Class
// ============================================
class SpellManager {
    constructor(player) {
        this.player = player;
        this.game = player.game;
        this.activeSpells = [];
        this.ultimateSpell = null;
        this.dashSpell = null;
        this.discoveredSpells = new Set();
    }
    
    addSpell(spellId) {
        const existing = this.activeSpells.find(s => s.id === spellId);
        if (existing) return this.upgradeSpell(spellId);
        
        const spellData = SPELL_DATA[spellId];
        if (!spellData) {
            console.error(`Spell ${spellId} not found`);
            return false;
        }
        
        let spell;
        switch (spellData.spellClass) {
            case 'projectile': spell = new ProjectileSpell(spellData, this.player); break;
            case 'aoe': spell = new AOESpell(spellData, this.player); break;
            case 'orbital': spell = new OrbitalSpell(spellData, this.player); break;
            case 'shield': spell = new ShieldSpell(spellData, this.player); break;
            case 'melee': spell = new MeleeSpell(spellData, this.player); break;
            default: spell = new Spell(spellData, this.player);
        }
        
        if (spellData.type === 'ultimate') {
            this.ultimateSpell = spell;
        } else if (spellData.type === 'active' && spellData.id.includes('dash')) {
            this.dashSpell = spell;
        } else {
            this.activeSpells.push(spell);
            // Auto-activate orbital and aoe spells
            if (spellData.spellClass === 'orbital' || spellData.spellClass === 'aoe') {
                spell.cast(Date.now());
            }
        }
        
        this.discoveredSpells.add(spellId);
        console.log(`✨ Added spell: ${spell.name} (Level ${spell.level})`);
        return true;
    }
    
    upgradeSpell(spellId) {
        let spell = this.activeSpells.find(s => s.id === spellId);
        if (!spell && this.ultimateSpell && this.ultimateSpell.id === spellId) spell = this.ultimateSpell;
        if (!spell && this.dashSpell && this.dashSpell.id === spellId) spell = this.dashSpell;
        
        if (!spell) return false;
        
        const success = spell.upgrade();
        if (success) {
            console.log(`⬆️ Upgraded ${spell.name} to Level ${spell.level}`);
            if (spell.level === 3) this.checkCombinations(spell);
        }
        return success;
    }
    
    checkCombinations(spell) {
        if (!spell.combinesWith || spell.combinesWith.length === 0) return;
        
        for (const otherSpellId of spell.combinesWith) {
            const otherSpell = this.activeSpells.find(s => s.id === otherSpellId);
            if (otherSpell && otherSpell.level === 3) {
                console.log(`🌟 Combination Available: ${spell.name} + ${otherSpell.name}!`);
            }
        }
    }
    
    update(deltaTime) {
        const currentTime = Date.now();
        
        for (const spell of this.activeSpells) {
            spell.update(deltaTime);
            if (spell.type === 'passive' && spell.canCast(currentTime)) {
                spell.cast(currentTime);
            }
        }
        
        if (this.ultimateSpell) this.ultimateSpell.update(deltaTime);
        if (this.dashSpell) this.dashSpell.update(deltaTime);
    }
    
    render(ctx, cameraX, cameraY) {
        for (const spell of this.activeSpells) {
            spell.render(ctx, cameraX, cameraY);
        }
        if (this.ultimateSpell) this.ultimateSpell.render(ctx, cameraX, cameraY);
        if (this.dashSpell) this.dashSpell.render(ctx, cameraX, cameraY);
    }
    
    castUltimate() {
        if (!this.ultimateSpell) return false;
        const currentTime = Date.now();
        if (this.ultimateSpell.canCast(currentTime)) {
            this.ultimateSpell.cast(currentTime);
            console.log(`💥 Cast ultimate: ${this.ultimateSpell.name}`);
            return true;
        }
        return false;
    }
    
    castDash() {
        if (!this.dashSpell) return false;
        const currentTime = Date.now();
        return this.dashSpell.canCast(currentTime) && this.dashSpell.cast(currentTime);
    }
    
    getUpgradeOptions(count = 3) {
        const options = [];
        
        for (const spell of this.activeSpells) {
            if (spell.level < spell.maxLevel) {
                options.push({
                    type: 'upgrade',
                    spellId: spell.id,
                    spell: spell,
                    display: `${spell.name} → Level ${spell.level + 1}`
                });
            }
        }
        
        if (this.ultimateSpell && this.ultimateSpell.level < this.ultimateSpell.maxLevel) {
            options.push({
                type: 'upgrade',
                spellId: this.ultimateSpell.id,
                spell: this.ultimateSpell,
                display: `${this.ultimateSpell.name} → Level ${this.ultimateSpell.level + 1}`
            });
        }
        
        for (const spellId of Object.keys(SPELL_DATA)) {
            if (!this.discoveredSpells.has(spellId)) {
                const spellData = SPELL_DATA[spellId];
                options.push({
                    type: 'new',
                    spellId: spellId,
                    spellData: spellData,
                    display: `NEW: ${spellData.name}`
                });
            }
        }
        
        const shuffled = options.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    
    applyUpgrade(option) {
        if (option.type === 'upgrade') return this.upgradeSpell(option.spellId);
        else if (option.type === 'new') return this.addSpell(option.spellId);
        return false;
    }
    
    getActiveShields() {
        return this.activeSpells.filter(s => s instanceof ShieldSpell && s.isShieldActive());
    }
    
    getAllSpells() {
        const all = [...this.activeSpells];
        if (this.ultimateSpell) all.push(this.ultimateSpell);
        if (this.dashSpell) all.push(this.dashSpell);
        return all;
    }
}

// ============================================
// SPELL DATA - All spell configurations
// ============================================
const SPELL_DATA = {
    // ULTIMATES
    powerChords: {
        id: 'powerChords', name: 'Power Chords', description: 'Massive sound wave hits all on-screen enemies',
        type: 'ultimate', spellClass: 'aoe', sprite: 'Sprites/Effect_PowerChords_1_517x353-ultimate-92.png',
        frameCount: 92, width: 200, height: 200, damage: 200, cooldown: 10000,
        aoeRadius: 400, damageInterval: 100, duration: 2000, followPlayer: false
    },
    
    // PROJECTILES
    magicSpell: {
        id: 'magicSpell', name: 'Arcane Missiles', description: 'Homing magic projectiles',
        type: 'passive', spellClass: 'projectile', sprite: 'Sprites/1_magicspell_spritesheet-73.png',
        frameCount: 73, width: 48, height: 48, damage: 25, cooldown: 1500,
        range: 500, speed: 350, projectileCount: 1, homing: true
    },
    
    bluefire: {
        id: 'bluefire', name: 'Blue Flames', description: 'Intense blue fire projectiles',
        type: 'passive', spellClass: 'projectile', sprite: 'Sprites/3_bluefire_spritesheet-61.png',
        frameCount: 61, width: 52, height: 52, damage: 35, cooldown: 1600,
        range: 400, speed: 320, projectileCount: 1
    },
    
    chainLightning: {
        id: 'chainLightning', name: 'Chain Lightning', description: 'Lightning that chains between enemies',
        type: 'passive', spellClass: 'projectile', sprite: 'Sprites/chain-light-4.png',
        frameCount: 4, width: 40, height: 40, damage: 30, cooldown: 2000,
        range: 400, speed: 500, projectileCount: 1, chainCount: 3
    },
    
    // ORBITAL
    fireSpin: {
        id: 'fireSpin', name: 'Fire Spin', description: 'Spinning fire orbs around player',
        type: 'passive', spellClass: 'orbital', sprite: 'Sprites/7_firespin_spritesheet-61.png',
        frameCount: 61, width: 50, height: 50, damage: 25, cooldown: 0,
        orbitRadius: 120, orbitSpeed: 3, projectileCount: 2, damageInterval: 200
    },
    
    // AOE
    protectionCircle: {
        id: 'protectionCircle', name: 'Protection Circle', description: 'Protective aura around player',
        type: 'passive', spellClass: 'aoe', sprite: 'Sprites/8_protectioncircle_spritesheet-61.png',
        frameCount: 61, width: 80, height: 80, damage: 15, cooldown: 0,
        aoeRadius: 130, damageInterval: 400, duration: 999999, followPlayer: true
    },
    
    garlic: {
        id: 'garlic', name: 'Garlic', description: 'Close-range damage field',
        type: 'passive', spellClass: 'aoe', sprite: 'Sprites/garlic-31.png',
        frameCount: 31, width: 70, height: 70, damage: 20, cooldown: 0,
        aoeRadius: 110, damageInterval: 300, duration: 999999, followPlayer: true
    },
    
    // SHIELD
    electricShield: {
        id: 'electricShield', name: 'Electric Shield', description: 'Energy shield with damage reflection',
        type: 'passive', spellClass: 'shield', sprite: 'Sprites/Effect_ElectricShield_1_265x265-63.png',
        frameCount: 63, width: 100, height: 100, damage: 20, cooldown: 5000,
        shieldHealth: 150, regenRate: 15, reflectDamage: true, reflectPercent: 0.6
    },
    
    // MELEE
    hammerSmash: {
        id: 'hammerSmash', name: 'Hammer Smash', description: 'Powerful ground pound',
        type: 'passive', spellClass: 'melee', sprite: 'Sprites/hammer-smash-14.png',
        frameCount: 14, width: 100, height: 100, damage: 50, cooldown: 2500,
        meleeRange: 120, attackArc: Math.PI, knockbackForce: 250
    }
};
