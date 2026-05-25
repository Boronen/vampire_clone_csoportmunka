// ============================================
// Player Class - Playable character
// ============================================
class Player extends Entity {
    constructor(x, y, game) {
        super(x, y, 256, 256, 250, 100, 'assets/Sprites/Idle.png', 8); // 8 frames for idle (4x scale)
        this.game = game;
        this.keys = {};
        this.weapons = ['thunder']; // Start with thunder weapon (legacy)
        this.lastShootTime = 0;
        this.shootInterval = 500; // Shoot every 500ms
        this.velocityX = 0;
        this.velocityY = 0;
        
        // XP and Level system
        this.xp = 0;
        this.level = 1;
        this.xpToNextLevel = 50;
        this.projectileCount = 1; // Number of projectiles per shot
        this.projectileDamage = 20; // Base damage
        this.infiniteHP = false; // Debug mode infinite HP
        
        // Invincibility frames
        this.invincible = false;
        this.invincibilityDuration = 1.0; // 1 second invincibility
        this.invincibilityTimer = 0;
        
        // Spell system
        this.spellManager = new SpellManager(this);
        
        // Load different sprite animations
        this.animations = {
            idle: { sprite: new Image(), frameCount: 8, loaded: false },
            run: { sprite: new Image(), frameCount: 8, loaded: false },
            attack1: { sprite: new Image(), frameCount: 8, loaded: false }
        };
        
        this.animations.idle.sprite.onload = () => this.animations.idle.loaded = true;
        this.animations.idle.sprite.src = 'assets/Sprites/Idle.png';
        
        this.animations.run.sprite.onload = () => this.animations.run.loaded = true;
        this.animations.run.sprite.src = 'assets/Sprites/Run.png';
        
        this.animations.attack1.sprite.onload = () => this.animations.attack1.loaded = true;
        this.animations.attack1.sprite.src = 'assets/Sprites/Attack1.png';
        
        this.currentAnimation = 'idle';
        
        this.setupInputListeners();
    }

    setupInputListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Ultimate ability (E key) - kept for backwards compatibility
            if (e.key.toLowerCase() === 'e') {
                this.spellManager.castUltimate();
            }
            
            // Dash ability (Space key)
            if (e.key === ' ' || e.key.toLowerCase() === 'space') {
                this.spellManager.castDash();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    activateUltimate(index) {
        // Ultimate abilities activated with number keys 1-5
        // For now, cast the equipped ultimate
        // TODO: Implement multiple ultimate slots
        if (index === 0) {
            this.spellManager.castUltimate();
        } else {
            console.log(`Ultimate slot ${index + 1} not implemented yet`);
        }
    }

    handleInput() {
        this.velocityX = 0;
        this.velocityY = 0;

        // WASD and Arrow keys
        if (this.keys['w'] || this.keys['arrowup']) {
            this.velocityY = -1;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.velocityY = 1;
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.velocityX = -1;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.velocityX = 1;
        }

        // Normalize diagonal movement
        if (this.velocityX !== 0 && this.velocityY !== 0) {
            this.velocityX *= 0.707;
            this.velocityY *= 0.707;
        }
    }

    move(deltaTime) {
        this.x += this.velocityX * this.speed * deltaTime;
        this.y += this.velocityY * this.speed * deltaTime;
        
        // Update facing direction based on horizontal movement
        if (this.velocityX < 0) {
            this.facingLeft = true;
        } else if (this.velocityX > 0) {
            this.facingLeft = false;
        }
    }

    shoot(currentTime) {
        if (currentTime - this.lastShootTime < this.shootInterval) {
            return;
        }

        const nearestEnemy = this.findNearestEnemy();
        if (!nearestEnemy) return;

        // Shoot multiple projectiles based on projectileCount
        for (let i = 0; i < this.projectileCount; i++) {
            for (const weaponType of this.weapons) {
                // Spread projectiles in a cone for multiple shots
                let targetX = nearestEnemy.x + nearestEnemy.width / 2;
                let targetY = nearestEnemy.y + nearestEnemy.height / 2;
                
                if (this.projectileCount > 1) {
                    const angleSpread = 0.3;
                    const angle = (i - (this.projectileCount - 1) / 2) * angleSpread;
                    const distance = 100;
                    targetX += Math.sin(angle) * distance;
                    targetY += Math.cos(angle) * distance;
                }
                
                const projectile = new Projectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    targetX,
                    targetY,
                    weaponType,
                    this.projectileDamage
                );
                this.game.addProjectile(projectile);
            }
        }

        this.lastShootTime = currentTime;
    }

    findNearestEnemy() {
        let nearestEnemy = null;
        let minDistance = Infinity;

        for (const enemy of this.game.enemies) {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }

        return nearestEnemy;
    }

    addWeapon(weaponType) {
        if (!this.weapons.includes(weaponType)) {
            this.weapons.push(weaponType);
        }
    }

    gainXP(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        
        // Pause game and show upgrade options
        this.game.showUpgradeMenu();
    }

    applyUpgrade(upgradeType) {
        switch(upgradeType) {
            case 'health':
                this.maxHealth += 20;
                this.health = this.maxHealth; // Fully heal
                break;
            case 'projectiles':
                this.projectileCount++;
                break;
            case 'damage':
                this.projectileDamage += 10;
                break;
        }
    }
    
    takeDamage(amount) {
        // Infinite HP in debug mode
        if (this.infiniteHP) {
            return;
        }
        
        // Invincibility frames prevent damage
        if (this.invincible) {
            return;
        }
        
        // Check for active shields
        const shields = this.spellManager.getActiveShields();
        for (const shield of shields) {
            amount = shield.absorbDamage(amount);
            if (amount <= 0) return; // All damage absorbed
        }
        
        // Apply remaining damage
        super.takeDamage(amount);
        
        // Activate invincibility frames after taking damage
        this.invincible = true;
        this.invincibilityTimer = this.invincibilityDuration;
    }

    update(deltaTime) {
        this.handleInput();
        this.move(deltaTime);
        this.shoot(Date.now());
        
        // Update invincibility timer
        if (this.invincible) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
                this.invincibilityTimer = 0;
            }
        }
        
        // Update spell system
        this.spellManager.update(deltaTime);
        
        // Choose animation based on movement
        if (this.velocityX !== 0 || this.velocityY !== 0) {
            this.currentAnimation = 'run';
        } else {
            this.currentAnimation = 'idle';
        }
        
        // Update animation from current state
        const anim = this.animations[this.currentAnimation];
        if (anim && anim.loaded) {
            this.sprite = anim.sprite;
            this.frameCount = anim.frameCount;
            this.spriteLoaded = true;
            if (this.sprite.complete) {
                this.frameWidth = this.sprite.width / this.frameCount;
                this.frameHeight = this.sprite.height;
            }
        }
        
        // Call parent update for animation
        super.update(deltaTime);
    }
    
    render(ctx, cameraX, cameraY) {
        // Apply flashing effect during invincibility
        if (this.invincible) {
            // Flash every 100ms
            const flashCycle = Math.floor(this.invincibilityTimer * 10) % 2;
            if (flashCycle === 1) {
                ctx.globalAlpha = 0.4; // Semi-transparent when flashing
            }
        }
        
        // Render player sprite
        super.render(ctx, cameraX, cameraY);
        
        // Reset alpha
        ctx.globalAlpha = 1.0;
        
        // Render spell effects
        this.spellManager.render(ctx, cameraX, cameraY);
    }
}
