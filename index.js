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
