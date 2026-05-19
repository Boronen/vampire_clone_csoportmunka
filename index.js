// ============================================
// Main Entry Point - Initialize game when page loads
// ============================================
window.addEventListener('load', () => {
    const game = new Game();
    game.init();
    game.start();
});
