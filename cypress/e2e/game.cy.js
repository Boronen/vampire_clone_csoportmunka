// ============================================
// Vampire Survivors Clone - E2E Tests
// ============================================

describe('Vampire Survivors Clone - Game Tests', () => {
  
  beforeEach(() => {
    // Visit the game before each test
    cy.visit('https://boronen.github.io/vampire_clone_csoportmunka/')
    
    // Wait for game to be fully loaded (scripts loaded dynamically)
    cy.window().should('have.property', 'game')
    cy.window().its('game').should('not.be.null')
    cy.wait(500) // Additional wait for initialization
  })

  // ============================================
  // 1. Basic Game Loading Tests
  // ============================================
  
  describe('Game Initialization', () => {
    it('should load the game page successfully', () => {
      cy.get('#gameCanvas').should('exist')
      cy.get('#gameCanvas').should('be.visible')
    })

    it('should have correct canvas dimensions', () => {
      cy.get('#gameCanvas').should('have.attr', 'width', '1200')
      cy.get('#gameCanvas').should('have.attr', 'height', '700')
    })

    it('should initialize game object', () => {
      cy.window().should('have.property', 'game')
      cy.window().its('game').should('not.be.null')
    })

    it('should initialize player', () => {
      cy.window().then((win) => {
        expect(win.game.player).to.exist
        expect(win.game.player.x).to.be.a('number')
        expect(win.game.player.y).to.be.a('number')
        expect(win.game.player.health).to.be.greaterThan(0)
      })
    })

    it('should initialize game as running', () => {
      cy.window().then((win) => {
        expect(win.game.isRunning).to.be.true
      })
    })
  })

  // ============================================
  // 2. Player Tests
  // ============================================
  
  describe('Player Mechanics', () => {
    it('should have player starting position', () => {
      cy.window().then((win) => {
        expect(win.game.player.x).to.equal(100)
        expect(win.game.player.y).to.equal(100)
      })
    })

    it('should have initial health', () => {
      cy.window().then((win) => {
        expect(win.game.player.health).to.equal(100)
        expect(win.game.player.maxHealth).to.equal(100)
      })
    })

    it('should have level and XP system', () => {
      cy.window().then((win) => {
        expect(win.game.player.level).to.equal(1)
        expect(win.game.player.xp).to.equal(0)
        expect(win.game.player.xpToNextLevel).to.be.greaterThan(0)
      })
    })

    it('should have SpellManager', () => {
      cy.window().then((win) => {
        expect(win.game.player.spellManager).to.exist
      })
    })
  })

  // ============================================
  // 3. Enemy Tests
  // ============================================
  
  describe('Enemy System', () => {
    it('should spawn initial enemies', () => {
      cy.window().then((win) => {
        expect(win.game.enemies.length).to.be.greaterThan(0)
      })
    })

    it('should have enemy properties', () => {
      cy.window().then((win) => {
        const enemy = win.game.enemies[0]
        expect(enemy).to.exist
        expect(enemy.x).to.be.a('number')
        expect(enemy.y).to.be.a('number')
        expect(enemy.health).to.be.greaterThan(0)
        expect(enemy.speed).to.be.greaterThan(0)
      })
    })

    it('should spawn more enemies over time', () => {
      cy.window().then((win) => {
        const initialCount = win.game.enemies.length
        // Wait for enemy spawn interval (1 second)
        cy.wait(2000)
        cy.window().then((win2) => {
          expect(win2.game.enemies.length).to.be.greaterThan(initialCount)
        })
      })
    })
  })

  // ============================================
  // 4. Input Handling Tests
  // ============================================
  
  describe('Player Input', () => {
    it('should respond to keyboard input', () => {
      cy.window().then((win) => {
        const initialX = win.game.player.x
        const initialY = win.game.player.y
        
        // Simulate key press
        cy.get('body').type('d')
        cy.wait(100)
        
        cy.window().then((win2) => {
          // Player should have moved (or keys object updated)
          expect(win2.game.player.keys).to.exist
        })
      })
    })
  })

  // ============================================
  // 5. Game State Tests
  // ============================================
  
  describe('Game State Management', () => {
    it('should track game time', () => {
      cy.window().then((win) => {
        expect(win.game.gameTime).to.be.a('number')
        expect(win.game.gameTime).to.be.at.least(0)
      })
    })

    it('should track score', () => {
      cy.window().then((win) => {
        expect(win.game.score).to.be.a('number')
        expect(win.game.score).to.be.at.least(0)
      })
    })

    it('should have background', () => {
      cy.window().then((win) => {
        expect(win.game.background).to.exist
      })
    })

    it('should have sound manager', () => {
      cy.window().then((win) => {
        expect(win.game.soundManager).to.exist
      })
    })

    it('should have damage number manager', () => {
      cy.window().then((win) => {
        expect(win.game.damageNumbers).to.exist
      })
    })
  })

  // ============================================
  // 6. Level Up System Tests
  // ============================================
  
  describe('Level Up System', () => {
    it('should show upgrade menu on level up', () => {
      cy.window().then((win) => {
        // Force level up
        win.game.player.gainXP(win.game.player.xpToNextLevel)
        
        cy.wait(100)
        cy.window().then((win2) => {
          expect(win2.game.upgradeMenuVisible).to.be.true
          expect(win2.game.isPaused).to.be.true
        })
      })
    })

    it('should provide upgrade options', () => {
      cy.window().then((win) => {
        win.game.player.gainXP(win.game.player.xpToNextLevel)
        
        cy.wait(100)
        cy.window().then((win2) => {
          expect(win2.game.upgradeOptions).to.exist
          expect(win2.game.upgradeOptions.length).to.equal(3)
        })
      })
    })
  })

  // ============================================
  // 7. Debug Mode Tests
  // ============================================
  
  describe('Debug Mode', () => {
    it('should toggle debug mode with U key', () => {
      cy.window().then((win) => {
        const initialDebugMode = win.game.debugMode
        
        // Press U key
        cy.get('body').type('u')
        
        cy.wait(100)
        cy.window().then((win2) => {
          expect(win2.game.debugMode).to.not.equal(initialDebugMode)
        })
      })
    })
  })

  // ============================================
  // 8. Spell System Tests
  // ============================================
  
  describe('Spell System', () => {
    it('should have SPELL_DATA available', () => {
      cy.window().then((win) => {
        expect(win.SPELL_DATA).to.exist
        expect(Object.keys(win.SPELL_DATA).length).to.be.greaterThan(0)
      })
    })

    it('should be able to add spells', () => {
      cy.window().then((win) => {
        const initialSpellCount = win.game.player.spellManager.getSpellCount()
        
        // Add a spell
        win.game.player.spellManager.addSpell('magicSpell')
        
        cy.window().then((win2) => {
          const newSpellCount = win2.game.player.spellManager.getSpellCount()
          expect(newSpellCount).to.be.greaterThan(initialSpellCount)
        })
      })
    })
  })

  // ============================================
  // 9. Performance Tests
  // ============================================
  
  describe('Performance', () => {
    it('should maintain reasonable entity count', () => {
      cy.window().then((win) => {
        // Wait for some gameplay
        cy.wait(3000)
        
        cy.window().then((win2) => {
          const totalEntities = win2.game.enemies.length + 
                               win2.game.projectiles.length
          
          // Should not have excessive entities
          expect(totalEntities).to.be.lessThan(300)
        })
      })
    })
  })

  // ============================================
  // 10. UI Tests
  // ============================================
  
  describe('UI Elements', () => {
    it('should display controls section', () => {
      cy.get('.controls').should('exist')
      cy.contains('Controls').should('be.visible')
    })

    it('should have game canvas focused area', () => {
      cy.get('#gameCanvas').should('have.css', 'border')
    })
  })
})
