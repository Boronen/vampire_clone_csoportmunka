// ============================================
// Enemy Data Configuration
// ============================================
/**
 * HOW TO ADD NEW ENEMIES:
 * 
 * 1. Find your sprite file and note:
 *    - File path (e.g., 'assets/Sprites/enemies/your_enemy.png')
 *    - Frame count (how many animation frames in sprite sheet)
 *    - Frame size (width x height of each frame)
 * 
 * 2. Copy an existing enemy definition below
 * 
 * 3. Customize these properties:
 *    - id: Unique identifier (e.g., 'zombie', 'skeleton')
 *    - name: Display name
 *    - sprite: Path to your sprite file
 *    - frameCount: Number of frames in animation
 *    - width/height: Size in pixels (scales the enemy)
 *    - baseSpeed: Movement speed (higher = faster)
 *    - baseHealth: Starting HP (scales with game time)
 *    - baseDamage: Contact damage
 *    - scoreValue: XP given when killed
 *    - spawnWeight: How common (5=common, 1=rare, 0.5=very rare)
 *    - minGameTime: When it first appears in seconds (0=start, 60=1min, 120=2min)
 * 
 * Example:
 *   newEnemy: {
 *       id: 'newEnemy',
 *       name: 'New Enemy',
 *       sprite: 'assets/Sprites/enemies/new_enemy.png',
 *       frameCount: 8,
 *       width: 100,
 *       height: 100,
 *       baseSpeed: 25,
 *       baseHealth: 150,
 *       baseDamage: 12,
 *       scoreValue: 15,
 *       spawnWeight: 3,
 *       minGameTime: 45
 *   },
 */
const ENEMY_TYPES = {
    frogger: {
        id: 'frogger',
        name: 'Frogger',
        sprite: 'assets/Sprites/enemies/frogger_move.png',
        frameCount: 14,
        width: 200,
        height: 200,
        baseSpeed: 30,
        baseHealth: 100,
        baseDamage: 10,
        scoreValue: 10,
        spawnWeight: 5,
        minGameTime: 0
    },
    golem: {
        id: 'golem',
        name: 'Golem',
        sprite: 'assets/Sprites/enemies/golem_move.png',
        frameCount: 12,
        width: 100,
        height: 100,
        baseSpeed: 20,
        baseHealth: 200,
        baseDamage: 15,
        scoreValue: 20,
        spawnWeight: 3,
        minGameTime: 30
    },
    husk: {
        id: 'husk',
        name: 'Husk',
        sprite: 'assets/Sprites/enemies/husk_move.png',
        frameCount: 2,
        width: 150,
        height: 150,
        baseSpeed: 40,
        baseHealth: 60,
        baseDamage: 8,
        scoreValue: 8,
        spawnWeight: 4,
        minGameTime: 10
    },
    froggerElite: {
        id: 'froggerElite',
        name: 'Elite Frogger',
        sprite: 'assets/Sprites/enemies/frogger_move.png',
        frameCount: 14,
        width: 240,
        height: 240,
        baseSpeed: 35,
        baseHealth: 250,
        baseDamage: 20,
        scoreValue: 30,
        spawnWeight: 1,
        minGameTime: 60
    },
    golemBoss: {
        id: 'golemBoss',
        name: 'Golem Guardian',
        sprite: 'assets/Sprites/enemies/golem_move.png',
        frameCount: 12,
        width: 400,
        height: 400,
        baseSpeed: 15,
        baseHealth: 500,
        baseDamage: 30,
        scoreValue: 100,
        spawnWeight: 4,
        minGameTime: 18
    }
};

/**
 * Get random enemy type based on game time and spawn weights
 * @param {number} gameTime - Current game time in seconds
 * @returns {Object} Enemy type data
 */
function getRandomEnemyType(gameTime) {
    const available = Object.values(ENEMY_TYPES).filter(e => e.minGameTime <= gameTime);
    if (available.length === 0) return ENEMY_TYPES.frogger;
    
    const totalWeight = available.reduce((sum, e) => sum + e.spawnWeight, 0);
    let random = Math.random() * totalWeight;
    
    for (const enemy of available) {
        random -= enemy.spawnWeight;
        if (random <= 0) return enemy;
    }
    return available[0];
}

// ============================================
// Enemy Class - Enemies that chase the player
// ============================================

/**
 * @class Enemy
 * @extends Entity
 * @classdesc Ellenfél osztály, amely üldözi a játékost. Az ellenségek sebzése és életpontja 
 * az idő múlásával növekszik (scaling).
 */
class Enemy extends Entity {
    /**
     * Létrehoz egy új Enemy példányt.
     * Az életpont és sebzés az eltelt játékidő alapján skálázódik.
     * @param {number} x - Az ellenfél kezdő X koordinátája.
     * @param {number} y - Az ellenfél kezdő Y koordinátája.
     * @param {Player} player - A játékos referencia, akit üldözni fog.
     * @param {Object} [enemyType=null] - Enemy type data from ENEMY_TYPES
     */
    constructor(x, y, player, enemyType = null) {
        const game = player.game;
        
        // Use random enemy type if not specified
        if (!enemyType) {
            enemyType = getRandomEnemyType(game.gameTime);
        }
        
        // Scale HP based on game time (every 30 seconds, +20% HP)
        const timeMultiplier = 1 + Math.floor(game.gameTime / 30) * 0.2;
        const scaledHP = Math.floor(enemyType.baseHealth * timeMultiplier);
        
        super(
            x, y,
            enemyType.width,
            enemyType.height,
            enemyType.baseSpeed,
            scaledHP,
            enemyType.sprite,
            enemyType.frameCount
        );
        
        this.player = player;
        this.game = game;
        this.enemyType = enemyType;
        this.damage = enemyType.baseDamage + Math.floor(game.gameTime / 60) * 5;
        this.scoreValue = enemyType.scoreValue;
        this.velocityX = 0;
        this.velocityY = 0;
        this.baseMaxHealth = scaledHP;
    }

    /**
     * Mozgatja az ellenséget a játékos irányába.
     * @param {number} deltaTime - Az előző képkocka óta eltelt idő másodpercben.
     */
    moveTowardsPlayer(deltaTime) {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.velocityX = (dx / distance);
            this.velocityY = (dy / distance);

            this.x += this.velocityX * this.speed * deltaTime;
            this.y += this.velocityY * this.speed * deltaTime;
            
            // Update facing direction based on horizontal movement towards player
            if (dx < 0) {
                this.facingLeft = true;
            } else if (dx > 0) {
                this.facingLeft = false;
            }
        }
    }

    /**
     * Visszaadja az ellenfél pontértékét (XP).
     * @returns {number} A pontérték.
     */
    getScoreValue() {
        return this.scoreValue;
    }

    /**
     * Visszaadja az ellenfél sebzését.
     * @returns {number} A sebzés mennyisége.
     */
    getDamage() {
        return this.damage;
    }

    /**
     * Frissíti az ellenfél állapotát.
     * @param {number} deltaTime - Az előző képkocka óta eltelt idő másodpercben.
     */
    update(deltaTime) {
        this.moveTowardsPlayer(deltaTime);
        super.update(deltaTime); // Update animation
    }
}
