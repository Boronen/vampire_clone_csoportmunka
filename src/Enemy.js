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
     */
    constructor(x, y, player) {
        // Scale HP based on game time (every 30 seconds, +20% HP)
        const game = player.game;
        const timeMultiplier = 1 + Math.floor(game.gameTime / 30) * 0.2;
        const scaledHP = Math.floor(100 * timeMultiplier);
        
        super(x, y, 200, 200, scaledHP, 30, 'assets/Sprites/enemies/frogger_move.png', 14);
        this.player = player;
        this.game = game;
        this.damage = 10 + Math.floor(game.gameTime / 60) * 5; // +5 damage every minute
        this.scoreValue = 10;
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
