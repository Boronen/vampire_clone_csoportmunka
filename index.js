// ============================================
// Main Entry Point - Initialize game
// ============================================

/**
 * @file index.js - A játék belépési pontja
 * @description Ez a fájl felelős a játék összes szkriptjének betöltéséért és a játék inicializálásáért.
 * A szkriptek sorrendben töltődnek be a függőségek kezeléséhez.
 */

/**
 * Dinamikusan betölt egy JavaScript fájlt.
 * @param {string} src - A betöltendő script fájl elérési útja.
 * @returns {Promise<void>} Promise, amely akkor teljesül, ha a script betöltődött.
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Betölti az összes játék szkriptet a megfelelő sorrendben.
 * A sorrend fontos a függőségek miatt (pl. Entity betöltése Player előtt).
 * @async
 * @returns {Promise<boolean>} True, ha minden szkript sikeresen betöltődött.
 */
async function loadGameScripts() {
    try {
        // Load core dependencies first
        await loadScript('src/Background.js');
        await loadScript('src/Entity.js');
        await loadScript('src/Projectile.js');
        
        // Load spell system
        await loadScript('src/Spell.js');
        await loadScript('src/ProjectileSpell.js');
        await loadScript('src/OrbitalSpell.js');
        await loadScript('src/AOESpell.js');
        await loadScript('src/StaticAOESpell.js');
        await loadScript('src/SkyFallSpell.js');
        await loadScript('src/ShieldSpell.js');
        await loadScript('src/MeleeSpell.js');
        await loadScript('src/SpellData.js');
        await loadScript('src/SpellManager.js');
        
        // Load managers
        await loadScript('src/SoundManager.js');
        await loadScript('src/DamageNumber.js');
        
        // Load game classes
        await loadScript('src/Player.js');
        await loadScript('src/Enemy.js');
        await loadScript('src/Game.js');
        
        console.log('All game scripts loaded successfully!');
        return true;
    } catch (error) {
        console.error('Error loading game scripts:', error);
        return false;
    }
}

/**
 * Inicializálja és elindítja a játékot az összes szkript betöltése után.
 * Létrehozza a globális game objektumot, inicializálja és elindítja azt.
 */
loadGameScripts().then((success) => {
    if (success) {
        // ES6 modules are deferred by default, so DOM is already loaded
        window.game = new Game();
        window.game.init();
        window.game.start();
    } else {
        console.error('Failed to initialize game due to script loading errors');
    }
});
