// ============================================
// DamageNumber Class - Floating damage numbers
// ============================================

/**
 * @class DamageNumber
 * @classdesc Lebegő sebzésszám osztály, amely vizuálisan megjeleníti a sebzést.
 */
class DamageNumber {
    /**
     * Létrehoz egy új DamageNumber példányt.
     * @param {number} x - A kezdő X koordináta.
     * @param {number} y - A kezdő Y koordináta.
     * @param {number} damage - A megjelenítendő sebzés mennyisége.
     * @param {boolean} [isCrit=false] - Kritikus sebzés-e.
     */
    constructor(x, y, damage, isCrit = false) {
        this.x = x;
        this.y = y;
        this.damage = Math.floor(damage);
        this.isCrit = isCrit;
        this.life = 1.0; // seconds
        this.elapsed = 0;
        this.velocityY = -50; // Float upwards
        this.alpha = 1.0;
    }
    
    /**
     * Frissíti a sebzésszám állapotát (mozgatás, halványítás).
     * @param {number} deltaTime - Az előző képkocka óta eltelt idő másodpercben.
     * @returns {boolean} True, ha a sebzésszám még életben van.
     */
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Fade out
        this.alpha = 1.0 - (this.elapsed / this.life);
        
        return this.elapsed < this.life;
    }
    
    /**
     * Megjeleníti a sebzésszámot a canvason.
     * @param {CanvasRenderingContext2D} ctx - A canvas 2D kontextusa.
     * @param {number} cameraX - A kamera X pozíciója.
     * @param {number} cameraY - A kamera Y pozíciója.
     * @param {HTMLImageElement} fontImg - A betűtípus sprite kép.
     */
    render(ctx, cameraX, cameraY, fontImg) {
        if (!fontImg || !fontImg.complete) return;
        
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        const text = this.damage.toString();
        const fontSize = this.isCrit ? 28 : 20;
        const letterWidth = 32;
        const letterHeight = 32;
        const scale = fontSize / 32;
        
        // Center the text
        const totalWidth = text.length * letterWidth * scale;
        let currentX = screenX - totalWidth / 2;
        
        // Add outline for visibility
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        
        for (let char of text) {
            const charCode = char.charCodeAt(0);
            let frameIndex = -1;
            
            if (charCode >= 48 && charCode <= 57) { // 0-9
                frameIndex = charCode - 48 + 26; // Numbers are at position 26-35
            }
            
            if (frameIndex >= 0) {
                const sourceX = frameIndex * letterWidth;
                const sourceY = 0;
                
                // Draw with color tint for crits
                if (this.isCrit) {
                    ctx.filter = 'hue-rotate(60deg) saturate(2)'; // Yellow tint
                }
                
                ctx.drawImage(
                    fontImg,
                    sourceX, sourceY, letterWidth, letterHeight,
                    currentX, screenY, letterWidth * scale, letterHeight * scale
                );
                
                ctx.filter = 'none';
            }
            
            currentX += letterWidth * scale;
        }
        
        ctx.restore();
    }
}

// ============================================
// DamageNumberManager - Manages all damage numbers
// ============================================

/**
 * @class DamageNumberManager
 * @classdesc Kezeli az összes sebzésszámot a játékban.
 */
class DamageNumberManager {
    /**
     * Létrehoz egy új DamageNumberManager példányt.
     * @param {Game} game - A fő játék objektum referenciája.
     */
    constructor(game) {
        this.game = game;
        /** @type {Array<DamageNumber>} */
        this.numbers = [];
    }
    
    /**
     * Hozzáad egy új sebzésszámot.
     * @param {number} x - Az X koordináta.
     * @param {number} y - Az Y koordináta.
     * @param {number} damage - A sebzés mennyisége.
     * @param {boolean} [isCrit=false] - Kritikus sebzés-e.
     */
    addDamage(x, y, damage, isCrit = false) {
        this.numbers.push(new DamageNumber(x, y, damage, isCrit));
    }
    
    /**
     * Frissíti az összes sebzésszámot.
     * @param {number} deltaTime - Az előző képkocka óta eltelt idő másodpercben.
     */
    update(deltaTime) {
        for (let i = this.numbers.length - 1; i >= 0; i--) {
            if (!this.numbers[i].update(deltaTime)) {
                this.numbers.splice(i, 1);
            }
        }
    }
    
    /**
     * Megjeleníti az összes sebzésszámot.
     * @param {CanvasRenderingContext2D} ctx - A canvas 2D kontextusa.
     * @param {number} cameraX - A kamera X pozíciója.
     * @param {number} cameraY - A kamera Y pozíciója.
     */
    render(ctx, cameraX, cameraY) {
        for (const number of this.numbers) {
            number.render(ctx, cameraX, cameraY, this.game.fontImg);
        }
    }
}
