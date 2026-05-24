// ============================================
// Game Class - Main game controller
// ============================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1200;
        this.canvas.height = 700;
        
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.background = null;
        
        this.score = 0;
        this.gameTime = 0;
        this.lastEnemySpawn = 0;
        this.enemySpawnInterval = 1000; // Spawn enemy every 1 second
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.isPaused = false;
        this.upgradeMenuVisible = false;
        this.upgradeOptions = null;
        this.debugMode = false;
        this.debugSpellMenuVisible = false;
        this.debugSpellMenuScroll = 0;
        this.fontImg = new Image();
        this.fontImg.src = 'Sprites/fonts.png';
        
        // Sound system
        this.soundManager = new SoundManager();
        
        // Damage numbers
        this.damageNumbers = new DamageNumberManager(this);
        
        // Game statistics
        this.stats = {
            enemiesKilled: 0,
            damageDealt: 0,
            startTime: 0,
            endTime: 0
        };
    }

    init() {
        // Initialize game objects
        this.background = new Background('Sprites/background.jpg');
        this.player = new Player(100, 100, this);
        
        // Spawn initial enemies
        for (let i = 0; i < 3; i++) {
            this.spawnEnemy();
        }

        console.log('Game initialized!');
        this.setupUpgradeKeys();
        this.setupDebugKeys();
        
        // Reset stats
        this.stats.startTime = Date.now();
        this.stats.enemiesKilled = 0;
        this.stats.damageDealt = 0;
    }

    start() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop(this.lastFrameTime);
        console.log('Game started!');
    }

    gameLoop(timestamp) {
        const deltaTime = (timestamp - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = timestamp;

        if (this.isRunning && !this.isPaused) {
            this.update(deltaTime);
        }
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        this.gameTime += deltaTime;

        // Update player
        this.player.update(deltaTime);

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime);

            if (!enemy.isAlive()) {
                this.score += enemy.getScoreValue();
                this.player.gainXP(enemy.getScoreValue());
                this.stats.enemiesKilled++;
                this.soundManager.playAttack(); // Play attack sound on kill
                this.enemies.splice(i, 1);
            }

        }
        
        // Update damage numbers
        this.damageNumbers.update(deltaTime);


        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime);

            if (!projectile.isActive()) {
                this.projectiles.splice(i, 1);
            }
        }

        // Spawn enemies
        if (this.gameTime - this.lastEnemySpawn > this.enemySpawnInterval / 1000) {
            this.spawnEnemy();
            this.lastEnemySpawn = this.gameTime;
        }

        // Check collisions
        this.checkCollisions();
    }

    render() {
        // Calculate camera position (centered on player)
        const cameraX = this.player.x - this.canvas.width / 2 + this.player.width / 2;
        const cameraY = this.player.y - this.canvas.height / 2 + this.player.height / 2;

        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render background
        this.background.render(this.ctx, cameraX, cameraY, this.canvas.width, this.canvas.height);

        // Render all entities
        this.player.render(this.ctx, cameraX, cameraY);

        for (const enemy of this.enemies) {
            enemy.render(this.ctx, cameraX, cameraY);
        }

        for (const projectile of this.projectiles) {
            projectile.render(this.ctx, cameraX, cameraY);
        }
        
        // Render damage numbers (always on top)
        this.damageNumbers.render(this.ctx, cameraX, cameraY);

        // Render debug hitboxes
        if (this.debugMode) {
            this.renderDebugHitboxes(cameraX, cameraY);
        }

        // Render UI
        this.renderUI();
    }
    renderCustomText(text, x, y, fontSize = 32) {
    const letterWidth = 32;
    const letterHeight = 32;
    const scale = fontSize / 32;
    
    let currentX = x;
    
    for (let char of text.toUpperCase()) {
        const charCode = char.charCodeAt(0);
        let frameIndex = -1;
        
        // Map characters to spritesheet positions
        if (charCode >= 65 && charCode <= 90) { // A-Z
            frameIndex = charCode - 65; // 0-25
        } else if (charCode >= 48 && charCode <= 57) { // 0-9
            frameIndex = charCode - 48 + 26; // 26-35
        } else if (charCode === 32) { // Space
            currentX += letterWidth * scale;
            continue;
        } else if (charCode === 47) { // Slash /
            frameIndex = 36; // Position 36 (37th character, 0-indexed)
        }
        
        if (frameIndex >= 0 && this.fontImg.complete) {
            const sourceX = frameIndex * letterWidth;
            const sourceY = 0;
            
            this.ctx.drawImage(
                this.fontImg,
                sourceX, sourceY, letterWidth, letterHeight,
                currentX, y, letterWidth * scale, letterHeight * scale
            );
        }
        
        currentX += letterWidth * scale;
    }
}
    renderUI() {
    this.renderCustomText(`Score: ${this.score}`, 20, 55 - 50, 24);
    this.renderCustomText(`Level: ${this.player.level}`, 20, 85 - 50, 24);
    this.renderCustomText(`XP: ${this.player.xp}/${this.player.xpToNextLevel}`, 20, 115 - 50, 24);
    this.renderCustomText(`HP: ${Math.floor(this.player.health)}/${this.player.maxHealth}`, 20, 145 - 50, 24);
    
    if (this.upgradeMenuVisible) {
        this.renderUpgradeMenu();
    }
    
    if (this.debugSpellMenuVisible) {
        this.renderDebugSpellMenu();
    }
}
    
    renderDebugSpellMenu() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'cyan';
        this.ctx.font = '32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DEBUG SPELL MENU', this.canvas.width / 2, 50);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Type spell ID in console: game.player.spellManager.addSpell("spellId")', this.canvas.width / 2, 80);
        this.ctx.fillText('Press ESC to close', this.canvas.width / 2, 105);
        
        // List all available spells
        this.ctx.textAlign = 'left';
        this.ctx.font = '14px monospace';
        let y = 140;
        let col = 0;
        const colWidth = 300;
        const leftMargin = 50;
        
        for (const spellId of Object.keys(SPELL_DATA)) {
            const spellData = SPELL_DATA[spellId];
            const hasSpell = this.player.spellManager.discoveredSpells.has(spellId);
            
            this.ctx.fillStyle = hasSpell ? '#00ff00' : '#ffffff';
            const x = leftMargin + col * colWidth;
            this.ctx.fillText(`${spellId}`, x, y);
            this.ctx.fillStyle = '#888888';
            this.ctx.fillText(`${spellData.name}`, x + 10, y + 15);
            
            y += 40;
            if (y > 620) {
                y = 140;
                col++;
            }
        }
        
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'yellow';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Examples: magicSpell, fireSpin, garlic, electricShield, hammerSmash', this.canvas.width / 2, 670);
        
        this.ctx.textAlign = 'left';
        
        // Setup ESC key listener
        if (!this.debugSpellMenuEscListener) {
            this.debugSpellMenuEscListener = (e) => {
                if (e.key === 'Escape' && this.debugSpellMenuVisible) {
                    this.hideDebugSpellMenu();
                }
            };
            window.addEventListener('keydown', this.debugSpellMenuEscListener);
        }
    }

    showUpgradeMenu() {
        this.isPaused = true;
        this.upgradeMenuVisible = true;
        // Generate options ONCE when menu opens
        this.upgradeOptions = this.player.spellManager.getUpgradeOptions(3);
    }

    hideUpgradeMenu() {
        this.isPaused = false;
        this.upgradeMenuVisible = false;
        // Clear options when menu closes
        this.upgradeOptions = null;
    }

    renderUpgradeMenu() {
        if (!this.upgradeOptions) return; // Safety check
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'gold';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL UP!', this.canvas.width / 2, 100);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px Arial';
        this.ctx.fillText(`Level ${this.player.level}`, this.canvas.width / 2, 150);
        
        // Use stored upgrade options (no regeneration!)
        this.ctx.font = '24px Arial';
        this.upgradeOptions.forEach((option, index) => {
            const y = 250 + index * 100;
            
            // Color coding: green=new spell, orange=upgrade, cyan=stat
            let color = '#00ff00';
            if (option.type === 'upgrade') color = '#ffaa00';
            if (option.type === 'stat') color = '#00ffff';
            
            this.ctx.fillStyle = color;
            this.ctx.fillText(`${index + 1}. ${option.display}`, this.canvas.width / 2, y);
            
            // Show description
            this.ctx.fillStyle = '#cccccc';
            this.ctx.font = '18px Arial';
            const desc = option.description || (option.spell ? option.spell.description : (option.spellData ? option.spellData.description : ''));
            this.ctx.fillText(desc || '', this.canvas.width / 2, y + 25);
            this.ctx.font = '24px Arial';
        });
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press 1, 2, or 3 to choose', this.canvas.width / 2, 580);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press 1-5 for Ultimates | Space for Dash', this.canvas.width / 2, 620);
        
        this.ctx.textAlign = 'left';
    }

    setupUpgradeKeys() {
        window.addEventListener('keydown', (e) => {
            if (!this.upgradeMenuVisible) return;
            
            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= 3) {
                const optionIndex = keyNum - 1;
                if (this.upgradeOptions && this.upgradeOptions[optionIndex]) {
                    this.player.spellManager.applyUpgrade(this.upgradeOptions[optionIndex]);
                    this.hideUpgradeMenu();
                }
            }
        });
    }

    setupDebugKeys() {
        window.addEventListener('keydown', (e) => {
            // Toggle debug mode with U key
            if (e.key.toLowerCase() === 'u') {
                this.debugMode = !this.debugMode;
                console.log(`Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
            }
            
            // Instant level up with L key
            if (e.key.toLowerCase() === 'l') {
                const xpNeeded = this.player.xpToNextLevel - this.player.xp;
                this.player.gainXP(xpNeeded);
                console.log('Instant level up!');
            }
            
            // Toggle infinite HP with I key (debug)
            if (e.key.toLowerCase() === 'i' && this.debugMode) {
                this.player.infiniteHP = !this.player.infiniteHP;
                if (this.player.infiniteHP) {
                    this.player.health = this.player.maxHealth;
                }
                console.log(`Infinite HP: ${this.player.infiniteHP ? 'ON' : 'OFF'}`);
            }
            
            // Scale ENEMY HP 2x with H key (debug)
            if (e.key.toLowerCase() === 'h' && this.debugMode) {
                // Double all existing enemies' HP
                for (const enemy of this.enemies) {
                    const oldMax = enemy.maxHealth;
                    enemy.maxHealth = Math.floor(enemy.maxHealth * 2);
                    const healthPercent = enemy.health / oldMax;
                    enemy.health = Math.floor(enemy.maxHealth * healthPercent);
                }
                console.log(`All enemy HP doubled! (${this.enemies.length} enemies affected)`);
            }
            
            // Instant death with K key (debug)
            if (e.key.toLowerCase() === 'k' && this.debugMode) {
                this.player.health = 0;
                this.player.alive = false;
                console.log('Instant death triggered!');
                // Force game over check
                if (!this.player.isAlive()) {
                    this.gameOver();
                }
            }
            
            // Open spell menu with P key (debug)
            if (e.key.toLowerCase() === 'p' && this.debugMode) {
                this.showDebugSpellMenu();
            }
            
            // Ultimate abilities (1-5 keys)
            if (!this.upgradeMenuVisible && !this.debugSpellMenuVisible) {
                if (e.key >= '1' && e.key <= '5') {
                    const ultimateIndex = parseInt(e.key) - 1;
                    this.player.activateUltimate(ultimateIndex);
                }
            }
        });
    }
    
    showDebugSpellMenu() {
        this.isPaused = true;
        this.debugSpellMenuVisible = true;
        this.debugSpellMenuScroll = 0;
    }
    
    hideDebugSpellMenu() {
        this.isPaused = false;
        this.debugSpellMenuVisible = false;
    }

    renderDebugHitboxes(cameraX, cameraY) {
        this.ctx.strokeStyle = 'lime';
        this.ctx.lineWidth = 2;
        
        // Player hitbox
        const playerBounds = this.player.getBounds();
        this.ctx.strokeRect(
            playerBounds.x - cameraX,
            playerBounds.y - cameraY,
            playerBounds.width,
            playerBounds.height
        );
        
        // Enemy hitboxes
        this.ctx.strokeStyle = 'red';
        for (const enemy of this.enemies) {
            const bounds = enemy.getBounds();
            this.ctx.strokeRect(
                bounds.x - cameraX,
                bounds.y - cameraY,
                bounds.width,
                bounds.height
            );
        }
        
        // Projectile hitboxes
        this.ctx.strokeStyle = 'yellow';
        for (const projectile of this.projectiles) {
            const bounds = projectile.getBounds();
            this.ctx.strokeRect(
                bounds.x - cameraX,
                bounds.y - cameraY,
                bounds.width,
                bounds.height
            );
        }
        
        // Spell hitboxes
        this.ctx.strokeStyle = 'cyan';
        this.ctx.lineWidth = 2;
        for (const spell of this.player.spellManager.getAllSpells()) {
            const bounds = spell.getBounds();
            if (bounds.width > 0 && bounds.height > 0) {
                this.ctx.strokeRect(
                    bounds.x - cameraX,
                    bounds.y - cameraY,
                    bounds.width,
                    bounds.height
                );
            }
            
            // Draw spell projectile hitboxes (effects)
            if (spell.effects) {
                for (const effect of spell.effects) {
                    if (effect.getBounds) {
                        const effectBounds = effect.getBounds();
                        this.ctx.strokeStyle = 'magenta';
                        this.ctx.strokeRect(
                            effectBounds.x - cameraX,
                            effectBounds.y - cameraY,
                            effectBounds.width,
                            effectBounds.height
                        );
                    }
                }
            }
            
            // Draw orbital hitboxes
            if (spell.orbitals) {
                for (const orbital of spell.orbitals) {
                    if (orbital.getBounds) {
                        const orbitalBounds = orbital.getBounds();
                        this.ctx.strokeStyle = 'orange';
                        this.ctx.strokeRect(
                            orbitalBounds.x - cameraX,
                            orbitalBounds.y - cameraY,
                            orbitalBounds.width,
                            orbitalBounds.height
                        );
                    }
                }
            }
            
            // Draw static AOE zone hitboxes
            if (spell.zones) {
                for (const zone of spell.zones) {
                    this.ctx.strokeStyle = 'purple';
                    // Draw zone rectangle
                    this.ctx.strokeRect(
                        zone.x - cameraX,
                        zone.y - cameraY,
                        zone.width,
                        zone.height
                    );
                    // Draw zone radius circle
                    const zoneCenterX = zone.x + zone.width / 2 - cameraX;
                    const zoneCenterY = zone.y + zone.height / 2 - cameraY;
                    this.ctx.beginPath();
                    this.ctx.arc(zoneCenterX, zoneCenterY, zone.radius, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
        }
        
        // Debug text
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('DEBUG MODE (U: toggle, L: level up, I: infinite HP, P: spell menu)', 20, 160);
        this.ctx.fillText('H: 2x ENEMY HP, K: instant death', 20, 180);
        
        if (this.player.infiniteHP) {
            this.ctx.fillStyle = 'lime';
            this.ctx.fillText('INFINITE HP: ON', 20, 200);
        }
        
        // Enemy scaling info
        this.ctx.fillStyle = 'yellow';
        this.ctx.font = '16px Arial';
        const timeMultiplier = 1 + Math.floor(this.gameTime / 30) * 0.2;
        const baseEnemyHP = Math.floor(100 * timeMultiplier);
        const enemyDamage = 10 + Math.floor(this.gameTime / 60) * 5;
        const nextScaleTime = Math.ceil(this.gameTime / 30) * 30 - this.gameTime;
        
        this.ctx.fillText('=== ENEMY SCALING ===', 20, 220);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`Game Time: ${Math.floor(this.gameTime)}s`, 20, 240);
        this.ctx.fillText(`Enemy Base HP: ${baseEnemyHP} (x${timeMultiplier.toFixed(1)})`, 20, 260);
        this.ctx.fillText(`Enemy Damage: ${enemyDamage}`, 20, 280);
        this.ctx.fillText(`Next Scale: ${Math.ceil(nextScaleTime)}s`, 20, 300);
        
        // Spell list
        this.ctx.fillStyle = 'cyan';
        this.ctx.fillText('=== ACTIVE SPELLS ===', 20, 330);
        const spells = this.player.spellManager.getAllSpells();
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`Total: ${spells.length}`, 20, 350);
        let y = 370;
        for (const spell of spells) {
            this.ctx.fillText(`- ${spell.name} Lv${spell.level}`, 30, y);
            y += 20;
        }
    }

    spawnEnemy() {
        const pos = this.getRandomSpawnPosition();
        const enemy = new Enemy(pos.x, pos.y, this.player);
        this.enemies.push(enemy);
    }

    getRandomSpawnPosition() {
        // Spawn outside visible area
        const spawnDistance = 800;
        const angle = Math.random() * Math.PI * 2;
        
        return {
            x: this.player.x + Math.cos(angle) * spawnDistance,
            y: this.player.y + Math.sin(angle) * spawnDistance
        };
    }

    checkCollisions() {
        // Check projectile-enemy collisions
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const pBounds = projectile.getBounds();

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const eBounds = enemy.getBounds();

                if (this.checkRectCollision(pBounds, eBounds)) {
                    const damage = projectile.getDamage();
                    enemy.takeDamage(damage);
                    this.stats.damageDealt += damage;
                    projectile.deactivate();
                    break;
                }
            }
        }

        // Check player-enemy collisions
        const playerBounds = this.player.getBounds();
        for (const enemy of this.enemies) {
            const eBounds = enemy.getBounds();
            if (this.checkRectCollision(playerBounds, eBounds)) {
                this.player.takeDamage(enemy.getDamage() * 0.016); // Damage per frame
            }
        }

        // Check if player is dead
        if (!this.player.isAlive()) {
            this.gameOver();
        }
    }

    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    removeProjectile(projectile) {
        const index = this.projectiles.indexOf(projectile);
        if (index > -1) {
            this.projectiles.splice(index, 1);
        }
    }

    gameOver() {
        this.isRunning = false;
        this.stats.endTime = Date.now();
        this.soundManager.playDeath();
        
        // Render death screen
        this.renderDeathScreen();
    }
    
    renderDeathScreen() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Calculate stats
        const survivalTime = Math.floor((this.stats.endTime - this.stats.startTime) / 1000);
        const minutes = Math.floor(survivalTime / 60);
        const seconds = survivalTime % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Dark overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Title
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = 'bold 72px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', centerX, centerY - 150);
        
        // Stats box
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        this.ctx.fillRect(centerX - 250, centerY - 80, 500, 220);
        
        // Stats
        this.ctx.fillStyle = 'white';
        this.ctx.font = '28px Arial';
        this.ctx.fillText('== STATISTICS ==', centerX, centerY - 40);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillText(`⏱ Survival Time: ${timeStr}`, centerX, centerY);
        
        this.ctx.fillStyle = '#ff9900';
        this.ctx.fillText(`💀 Enemies Killed: ${this.stats.enemiesKilled}`, centerX, centerY + 35);
        
        this.ctx.fillStyle = '#ff3333';
        this.ctx.fillText(`⚔ Total Damage: ${Math.floor(this.stats.damageDealt)}`, centerX, centerY + 70);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText(`⭐ Final Level: ${this.player.level}`, centerX, centerY + 105);
        
        // Restart instructions
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press R to Restart', centerX, centerY + 170);
        
        this.ctx.textAlign = 'left';
        
        // Setup restart listener
        if (!this.restartListener) {
            this.restartListener = (e) => {
                if (e.key.toLowerCase() === 'r' && !this.isRunning) {
                    location.reload();
                }
            };
            window.addEventListener('keydown', this.restartListener);
        }
    }
}
