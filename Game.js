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
        this.debugMode = false; // Debug hitbox visualization
        this.fontImg = new Image();
        this.fontImg.src = 'Sprites/fonts.png';
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
    }

    start() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop(this.lastFrameTime);
        console.log('Game started!');
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = (timestamp - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = timestamp;

        if (!this.isPaused) {
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
                this.enemies.splice(i, 1);
            }
        }

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
}

    showUpgradeMenu() {
        this.isPaused = true;
        this.upgradeMenuVisible = true;
    }

    hideUpgradeMenu() {
        this.isPaused = false;
        this.upgradeMenuVisible = false;
    }

    renderUpgradeMenu() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'gold';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL UP!', this.canvas.width / 2, 150);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px Arial';
        this.ctx.fillText(`Level ${this.player.level}`, this.canvas.width / 2, 200);
        
        const upgrades = [
            { type: 'health', text: 'Increase Max HP +20', y: 300 },
            { type: 'projectiles', text: 'More Projectiles +1', y: 380 },
            { type: 'damage', text: 'Increase Damage +10', y: 460 }
        ];
        
        this.ctx.font = '28px Arial';
        upgrades.forEach((upgrade, index) => {
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(`${index + 1}. ${upgrade.text}`, this.canvas.width / 2, upgrade.y);
        });
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press 1, 2, or 3 to choose', this.canvas.width / 2, 550);
        
        this.ctx.textAlign = 'left';
    }

    setupUpgradeKeys() {
        window.addEventListener('keydown', (e) => {
            if (!this.upgradeMenuVisible) return;
            
            if (e.key === '1') {
                this.player.applyUpgrade('health');
                this.hideUpgradeMenu();
            } else if (e.key === '2') {
                this.player.applyUpgrade('projectiles');
                this.hideUpgradeMenu();
            } else if (e.key === '3') {
                this.player.applyUpgrade('damage');
                this.hideUpgradeMenu();
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
        });
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
        
        // Debug text
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('DEBUG MODE (U to toggle, L to level up)', 20, 160);
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
                    enemy.takeDamage(projectile.getDamage());
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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '32px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Refresh to play again', this.canvas.width / 2, this.canvas.height / 2 + 100);
    }
}
