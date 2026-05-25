// ***********************************************
// Custom Cypress Commands
// ***********************************************

/**
 * Custom command to force player level up
 */
Cypress.Commands.add('levelUpPlayer', () => {
  cy.window().then((win) => {
    win.game.player.gainXP(win.game.player.xpToNextLevel)
  })
})

/**
 * Custom command to add spell to player
 */
Cypress.Commands.add('addSpell', (spellId) => {
  cy.window().then((win) => {
    win.game.player.spellManager.addSpell(spellId)
  })
})

/**
 * Custom command to toggle debug mode
 */
Cypress.Commands.add('toggleDebug', () => {
  cy.get('body').type('u')
})

/**
 * Custom command to check if game is running
 */
Cypress.Commands.add('gameIsRunning', () => {
  cy.window().its('game.isRunning').should('be.true')
})

/**
 * Custom command to wait for enemies to spawn
 */
Cypress.Commands.add('waitForEnemies', (minCount = 1) => {
  cy.window().then((win) => {
    cy.wrap(null).should(() => {
      expect(win.game.enemies.length).to.be.at.least(minCount)
    })
  })
})
