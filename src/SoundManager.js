// ============================================
// SoundManager Class - Handles all game audio
// ============================================

/**
 * @class SoundManager
 * @classdesc Hangkezelő osztály, amely betölti és lejátssza a játék összes hangeffektjét.
 */
class SoundManager {
    /**
     * Létrehoz egy új SoundManager példányt és betölti a hangokat.
     */
    constructor() {
        /** @type {Object<string, HTMLAudioElement>} */
        this.sounds = {};
        /** @type {boolean} */
        this.enabled = true;
        /** @type {number} */
        this.volume = 0.3; // Default volume
        /** @type {number} */
        this.lastSpellSound = 0;
        /** @type {number} */
        this.spellSoundCooldown = 0.1; // Only play spell sounds every 100ms
        
        this.loadSounds();
    }
    
    /**
     * Betölti az összes játék hangeffektet.
     * @private
     */
    loadSounds() {
        // Character sounds
        this.sounds.attack = new Audio('assets/sound effects/tribe_h.wav');
        this.sounds.damage1 = new Audio('assets/sound effects/tribe_b.wav');
        this.sounds.damage2 = new Audio('assets/sound effects/tribe_f.wav');
        this.sounds.death = new Audio('assets/sound effects/tribe_h.wav');
        
        // Spell sounds mapped to spell IDs (based on effect sounds.txt)
        this.sounds.magicSpell = new Audio('assets/sound effects/Magic Shield.wav'); // 1 magicspell
        this.sounds.projectile2 = new Audio('assets/sound effects/Magic Smite.wav'); // projectile 2
        this.sounds.blueFire = new Audio('assets/sound effects/25_Wind_01.wav'); // 3 bluefire
        this.sounds.casting = new Audio('assets/sound effects/zap2a.ogg'); // 4 casting
        this.sounds.magickaHit = new Audio('assets/sound effects/warp2.ogg'); // 5 magickahit
        this.sounds.fireSpin = new Audio('assets/sound effects/091.wav'); // 7 firespin
        this.sounds.protectionCircle = new Audio('assets/sound effects/261.wav'); // 8 protectioncircle
        this.sounds.fire = new Audio('assets/sound effects/04_Fire_explosion_04_medium.wav'); // 11 fire
        this.sounds.nebula = new Audio('assets/sound effects/112.wav'); // 12 nebula
        this.sounds.vortex = new Audio('assets/sound effects/246.wav'); // 13 vortex
        this.sounds.phantom = new Audio('assets/sound effects/130.wav'); // 14 phantom
        this.sounds.sunburn = new Audio('assets/sound effects/018.wav'); // 16 sunburn
        this.sounds.felspell = new Audio('assets/sound effects/258.wav'); // 17 felspell
        this.sounds.midnight = new Audio('assets/sound effects/219.wav'); // 18 midnight
        this.sounds.freezing = new Audio('assets/sound effects/shimmer_1.flac'); // 19 freezing
        this.sounds.magicBubbles = new Audio('assets/sound effects/twink.ogg'); // 20 magicbubbles
        this.sounds.ice = new Audio('assets/sound effects/13_Ice_explosion_01.wav'); // IceVFX 1 Repeatable
        this.sounds.thunderHit = new Audio('assets/sound effects/168.wav'); // thunder hit
        this.sounds.thunderProjectile = new Audio('assets/sound effects/233.wav'); // thunder projectile
        this.sounds.valamire = new Audio('assets/sound effects/133.wav'); // valamire
        
        // Set volumes
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }
    
    /**
     * Lejátssza a támadás hangot.
     */
    playAttack() {
        if (!this.enabled) return;
        this.play('attack');
    }
    
    /**
     * Lejátssza a sebzés hangot (véletlenszerűen választ két közül).
     */
    playDamage() {
        if (!this.enabled) return;
        // Randomly choose between two damage sounds
        const sound = Math.random() < 0.5 ? 'damage1' : 'damage2';
        this.play(sound);
    }
    
    /**
     * Lejátssza a halál hangot.
     */
    playDeath() {
        if (!this.enabled) return;
        this.play('death');
    }
    
    /**
     * Lejátssza az adott varázslat hangját.
     * @param {string} spellId - A varázslat azonosítója.
     */
    playSpellSound(spellId) {
        if (!this.enabled) return;
        
        // Throttle spell sounds to avoid audio spam
        const now = Date.now() / 1000;
        if (now - this.lastSpellSound < this.spellSoundCooldown) return;
        this.lastSpellSound = now;
        
        // Direct spell ID to sound mapping
        if (this.sounds[spellId]) {
            this.play(spellId);
        } else {
            // Fallback to magic sound
            this.play('magicSpell');
        }
    }
    
    /**
     * Lejátssza a megadott hangot.
     * @param {string} soundName - A hang neve.
     * @private
     */
    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            // Clone the sound to allow overlapping plays
            const clone = sound.cloneNode();
            clone.volume = this.volume;
            clone.play().catch(e => console.warn('Sound play failed:', e));
        }
    }
    
    /**
     * Beállítja a hangerőt.
     * @param {number} volume - A hangerő 0 és 1 között.
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }
    
    /**
     * Ki/bekapcsolja a hangokat.
     * @returns {boolean} Az új állapot (be van-e kapcsolva).
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}
