// ============================================
// Main Entry Point - Initialize game when page loads
// ============================================
window.addEventListener('load', () => {
    window.game = new Game();
    window.game.init();
    window.game.start();
});
