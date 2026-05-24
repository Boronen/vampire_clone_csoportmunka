// ============================================
// DamageNumber Class - Floating damage numbers
// ============================================
class DamageNumber {
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
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Fade out
        this.alpha = 1.0 - (this.elapsed / this.life);
        
        return this.elapsed < this.life;
    }
    
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
class DamageNumberManager {
    constructor(game) {
        this.game = game;
        this.numbers = [];
    }
    
    addDamage(x, y, damage, isCrit = false) {
        this.numbers.push(new DamageNumber(x, y, damage, isCrit));
    }
    
    update(deltaTime) {
        for (let i = this.numbers.length - 1; i >= 0; i--) {
            if (!this.numbers[i].update(deltaTime)) {
                this.numbers.splice(i, 1);
            }
        }
    }
    
    render(ctx, cameraX, cameraY) {
        for (const number of this.numbers) {
            number.render(ctx, cameraX, cameraY, this.game.fontImg);
        }
    }
}
