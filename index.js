// ============================================
// Main Entry Point - Initialize game
// ============================================

// Helper function to load scripts dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load all game scripts in the correct order
async function loadGameScripts() {
    try {
        // Load core dependencies first
        await loadScript('Background.js');
        await loadScript('Entity.js');
        await loadScript('Projectile.js');
        
        // Load spell system
        await loadScript('Spell.js');
        await loadScript('SpellTypes/ProjectileSpell.js');
        await loadScript('SpellTypes/OrbitalSpell.js');
        await loadScript('SpellTypes/AOESpell.js');
        await loadScript('SpellTypes/StaticAOESpell.js');
        await loadScript('SpellTypes/SkyFallSpell.js');
        await loadScript('SpellTypes/ShieldSpell.js');
        await loadScript('SpellTypes/MeleeSpell.js');
        await loadScript('SpellData.js');
        await loadScript('SpellManager.js');
        
        // Load managers
        await loadScript('SoundManager.js');
        await loadScript('DamageNumber.js');
        
        // Load game classes
        await loadScript('Player.js');
        await loadScript('Enemy.js');
        await loadScript('Game.js');
        
        console.log('All game scripts loaded successfully!');
        return true;
    } catch (error) {
        console.error('Error loading game scripts:', error);
        return false;
    }
}

// Initialize game after all scripts are loaded
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
