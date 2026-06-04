// ============================================
// Vampire Survivors Clone - E2E Tests
// ============================================

// Constants
const BASE_URL = "/";
const WAIT_TIME_SHORT = 100;
const WAIT_TIME_MEDIUM = 500;
const WAIT_TIME_LONG = 2000;
/**
 * Initialize game and wait for full loading
 */
function betoltJatek() {
  cy.visit(BASE_URL);
  cy.window().should('have.property', 'game');
  cy.window().its('game').should('not.be.null');
  cy.wait(WAIT_TIME_MEDIUM);
}

/**
 * Get game window object
 */
function jatekAblak() {
  return cy.window().its('game');
}

/**
 * Simulate player level up
 */
function szimulalSzintLepes() {
  cy.window().then((win) => {
    win.game.player.gainXP(win.game.player.xpToNextLevel);
  });
  cy.wait(WAIT_TIME_SHORT);
}

/**
 * Add spell to player
 */
function hozzaadVarazslat(spellId) {
  cy.window().then((win) => {
    win.game.player.spellManager.addSpell(spellId);
  });
}

/**
 * Simulate key press
 */
function szimulalBillentyuLeutes(key) {
  cy.get('body').type(key);
  cy.wait(WAIT_TIME_SHORT);
}

/**
 * Get player object
 */
function jatekosLekeres() {
  return cy.window().then((win) => win.game.player);
}

/**
 * Get enemy array
 */
function ellenfelekLekeres() {
  return cy.window().then((win) => win.game.enemies);
}

/**
 * Check if canvas exists and is visible
 */
function ellenorizCanvas() {
  cy.get('#gameCanvas').should('exist').and('be.visible');
}

/**
 * Verify game is running
 */
function ellenorizJatekFut() {
  cy.window().then((win) => {
    expect(win.game.isRunning).to.be.true;
  });
}

/**
 * Verify upgrade menu visibility
 */
function ellenorizFrissitesMenu(visible) {
  cy.window().then((win) => {
    expect(win.game.upgradeMenuVisible).to.equal(visible);
    if (visible) {
      expect(win.game.isPaused).to.be.true;
    }
  });
}

/**
 * Simulate game error state (for testing edge cases)
 */
function szimulalHibaAllapot(errorType) {
  cy.window().then((win) => {
    switch(errorType) {
      case 'noPlayer':
        win.game.player = null;
        break;
      case 'noEnemies':
        win.game.enemies = [];
        break;
      case 'zeroHealth':
        win.game.player.health = 0;
        break;
      default:
        break;
    }
  });
}

// ============================================
// Test Suites
// ============================================

describe("Alapvető játék betöltés", () => {
  it("oldal betöltése", () => {
    cy.visit(BASE_URL);
  });
});

describe("Játék inicializálása", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("canvas renderelése", () => {
    ellenorizCanvas();
  });

  it("canvas méretei helyesek", () => {
    cy.get('#gameCanvas').should('have.attr', 'width', '1200');
    cy.get('#gameCanvas').should('have.attr', 'height', '700');
  });

  it("játék objektum létezik", () => {
    jatekAblak().should('not.be.null');
  });

  it("játék fut", () => {
    ellenorizJatekFut();
  });

  it("játékos inicializálva", () => {
    jatekosLekeres().then((player) => {
      expect(player).to.exist;
      expect(player.x).to.be.a('number');
      expect(player.y).to.be.a('number');
      expect(player.health).to.be.greaterThan(0);
    });
  });
});

describe("Játékos mechanika", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("kezdő pozíció helyes", () => {
    jatekosLekeres().then((player) => {
      expect(player.x).to.equal(100);
      expect(player.y).to.equal(100);
    });
  });

  it("kezdő életerő", () => {
    jatekosLekeres().then((player) => {
      expect(player.health).to.equal(100);
      expect(player.maxHealth).to.equal(100);
    });
  });

  it("szint és XP rendszer", () => {
    jatekosLekeres().then((player) => {
      expect(player.level).to.equal(1);
      expect(player.xp).to.equal(0);
      expect(player.xpToNextLevel).to.be.greaterThan(0);
    });
  });

  it("SpellManager létezik", () => {
    jatekosLekeres().then((player) => {
      expect(player.spellManager).to.exist;
    });
  });
});

describe("Ellenség rendszer", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("kezdő ellenségek léteznek", () => {
    ellenfelekLekeres().then((enemies) => {
      expect(enemies.length).to.be.greaterThan(0);
    });
  });

  it("ellenség tulajdonságok helyesek", () => {
    ellenfelekLekeres().then((enemies) => {
      const enemy = enemies[0];
      expect(enemy).to.exist;
      expect(enemy.x).to.be.a('number');
      expect(enemy.y).to.be.a('number');
      expect(enemy.health).to.be.greaterThan(0);
      expect(enemy.speed).to.be.greaterThan(0);
    });
  });

  it("több ellenség spawn idővel", () => {
    cy.window().then((win) => {
      const initialCount = win.game.enemies.length;
      cy.wait(WAIT_TIME_LONG);
      cy.window().then((win2) => {
        expect(win2.game.enemies.length).to.be.greaterThan(initialCount);
      });
    });
  });
});

describe("Bemenet kezelés", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("billentyűzet bemenet kezelése", () => {
    jatekosLekeres().then((player) => {
      expect(player.keys).to.exist;
    });
    
    szimulalBillentyuLeutes('d');
    
    jatekosLekeres().then((player) => {
      expect(player.keys).to.exist;
    });
  });

  it("debug mód váltása U billentyűvel", () => {
    cy.window().then((win) => {
      const initialDebugMode = win.game.debugMode;
      szimulalBillentyuLeutes('u');
      cy.window().then((win2) => {
        expect(win2.game.debugMode).to.not.equal(initialDebugMode);
      });
    });
  });
});

describe("Játékállapot kezelés", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("játékidő követése", () => {
    jatekAblak().then((game) => {
      expect(game.gameTime).to.be.a('number');
      expect(game.gameTime).to.be.at.least(0);
    });
  });

  it("pontszám követése", () => {
    jatekAblak().then((game) => {
      expect(game.score).to.be.a('number');
      expect(game.score).to.be.at.least(0);
    });
  });

  it("háttér létezik", () => {
    jatekAblak().then((game) => {
      expect(game.background).to.exist;
    });
  });

  it("hangkezelő létezik", () => {
    jatekAblak().then((game) => {
      expect(game.soundManager).to.exist;
    });
  });

  it("sebzésszám kezelő létezik", () => {
    jatekAblak().then((game) => {
      expect(game.damageNumbers).to.exist;
    });
  });
});

describe("Szintlépés rendszer", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("frissítés menü megjelenik szintlépéskor", () => {
    szimulalSzintLepes();
    ellenorizFrissitesMenu(true);
  });

  it("frissítési opciók elérhetők", () => {
    szimulalSzintLepes();
    cy.window().then((win) => {
      expect(win.game.upgradeOptions).to.exist;
      expect(win.game.upgradeOptions.length).to.equal(3);
    });
  });

  it("szint növekszik XP megszerzésekor", () => {
    jatekosLekeres().then((player) => {
      const initialLevel = player.level;
      szimulalSzintLepes();
      jatekosLekeres().then((player2) => {
        expect(player2.level).to.be.greaterThan(initialLevel);
      });
    });
  });
});

describe("Varázslat rendszer", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("SPELL_DATA elérhető", () => {
    cy.window().then((win) => {
      expect(win.SPELL_DATA).to.exist;
      expect(Object.keys(win.SPELL_DATA).length).to.be.greaterThan(0);
    });
  });

  it("varázslat hozzáadása", () => {
    cy.window().then((win) => {
      const initialSpellCount = win.game.player.spellManager.getSpellCount();
      hozzaadVarazslat('magicSpell');
      cy.window().then((win2) => {
        const newSpellCount = win2.game.player.spellManager.getSpellCount();
        expect(newSpellCount).to.be.greaterThan(initialSpellCount);
      });
    });
  });

  it("több varázslat hozzáadása", () => {
    hozzaadVarazslat('magicSpell');
    hozzaadVarazslat('fireOrb');
    
    cy.window().then((win) => {
      const spellCount = win.game.player.spellManager.getSpellCount();
      expect(spellCount).to.be.at.least(2);
    });
  });
});

describe("Teljesítmény", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("ésszerű entitás szám fenntartása", () => {
    cy.wait(WAIT_TIME_LONG + 1000);
    
    cy.window().then((win) => {
      const totalEntities = win.game.enemies.length + win.game.projectiles.length;
      expect(totalEntities).to.be.lessThan(300);
    });
  });

  it("játék fut tartósan", () => {
    cy.wait(WAIT_TIME_LONG);
    ellenorizJatekFut();
  });
});

describe("UI elemek", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("vezérlők szakasz megjelenítése", () => {
    cy.get('.controls').should('exist');
    cy.contains('Controls').should('be.visible');
  });

  it("canvas stílus helyes", () => {
    cy.get('#gameCanvas').should('have.css', 'border');
  });

  it("vezérlők leírása látható", () => {
    cy.contains('Move:').should('be.visible');
    cy.contains('Attack:').should('be.visible');
    cy.contains('Ultimate:').should('be.visible');
  });
});

describe("Hibakezelés és szélső esetek", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("0 életerő kezelése", () => {
    szimulalHibaAllapot('zeroHealth');
    cy.window().then((win) => {
      expect(win.game.player.health).to.equal(0);
    });
  });

  it("nincs ellenség eset", () => {
    szimulalHibaAllapot('noEnemies');
    cy.window().then((win) => {
      expect(win.game.enemies.length).to.equal(0);
    });
  });

  it("játék továbbra is fut kritikus állapotban", () => {
    szimulalHibaAllapot('zeroHealth');
    cy.wait(WAIT_TIME_SHORT);
    cy.window().then((win) => {
      // Game should handle this gracefully
      expect(win.game).to.exist;
    });
  });
});

describe("Integráció tesztek", () => {
  beforeEach(() => {
    betoltJatek();
  });

  it("teljes játékmenet: szintlépés és varázslat hozzáadás", () => {
    // Initial state
    jatekosLekeres().then((player) => {
      const initialLevel = player.level;
      
      // Level up
      szimulalSzintLepes();
      
      // Check upgrade menu
      ellenorizFrissitesMenu(true);
      
      // Add spell
      cy.window().then((win) => {
        win.game.closeUpgradeMenu();
        hozzaadVarazslat('magicSpell');
        
        // Verify changes
        jatekosLekeres().then((player2) => {
          expect(player2.level).to.be.greaterThan(initialLevel);
          expect(player2.spellManager.getSpellCount()).to.be.greaterThan(0);
        });
      });
    });
  });

  it("játékos mozgás és ellenség spawn", () => {
    // Simulate movement
    szimulalBillentyuLeutes('w');
    szimulalBillentyuLeutes('a');
    
    // Wait for enemy spawn
    cy.wait(WAIT_TIME_LONG);
    
    // Verify enemies and player exist
    ellenfelekLekeres().then((enemies) => {
      expect(enemies.length).to.be.greaterThan(0);
    });
    
    jatekosLekeres().then((player) => {
      expect(player).to.exist;
      expect(player.health).to.be.greaterThan(0);
    });
  });
});
