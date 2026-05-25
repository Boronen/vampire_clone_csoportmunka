# Cypress E2E Tests - Vampire Survivors Clone

## 📋 Áttekintés

Ez a mappa tartalmazza a Cypress end-to-end (E2E) teszteket a Vampire Survivors Clone játékhoz.

## 🚀 Telepítés és futtatás

### 1. Dependencies telepítése

```bash
npm install
```

### 2. Local server indítása

**Egy külön terminálban:**

```bash
# Python
python -m http.server 8080

# VAGY Node.js
npm run serve
```

### 3. Cypress futtatása

**Interaktív mód (GUI):**
```bash
npm run cypress:open
```

**Headless mód (CI/CD):**
```bash
npm run cypress:run
```

## 📁 Struktúra

```
cypress/
├── e2e/                    # Test fájlok
│   └── game.cy.js         # Fő játék tesztek
├── support/               # Support fájlok
│   ├── e2e.js            # Support file loader
│   └── commands.js       # Custom Cypress commands
└── README.md             # Ez a fájl
```

## 🧪 Test Coverage

### Jelenleg tesztelt területek:

1. **Game Initialization** ✅
   - Canvas betöltés
   - Game object inicializálás
   - Player létrehozás
   - Running state

2. **Player Mechanics** ✅
   - Kezdő pozíció
   - Health rendszer
   - XP és level rendszer
   - SpellManager

3. **Enemy System** ✅
   - Initial spawn
   - Enemy properties
   - Enemy spawn over time

4. **Input Handling** ✅
   - Keyboard input
   - Movement keys

5. **Game State** ✅
   - Game time tracking
   - Score tracking
   - Background
   - Manager objects

6. **Level Up System** ✅
   - Upgrade menu
   - Upgrade options
   - Pause on level up

7. **Debug Mode** ✅
   - Debug toggle
   - Debug functions

8. **Spell System** ✅
   - SPELL_DATA availability
   - Add spells
   - Spell management

9. **Performance** ✅
   - Entity count limits
   - Memory management

10. **UI Elements** ✅
    - Controls display
    - Canvas visibility

## 🎯 Custom Commands

### Egyedi Cypress parancsok:

```javascript
// Force player level up
cy.levelUpPlayer()

// Add spell to player
cy.addSpell('magicSpell')

// Toggle debug mode
cy.toggleDebug()

// Check if game is running
cy.gameIsRunning()

// Wait for enemies to spawn
cy.waitForEnemies(3)  // Wait for at least 3 enemies
```

### Használat példa:

```javascript
it('should add spell and level up', () => {
  cy.addSpell('fireSpin')
  cy.levelUpPlayer()
  cy.window().its('game.upgradeMenuVisible').should('be.true')
})
```

## ✍️ Új teszt írása

### Template:

```javascript
describe('Test Category', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should do something', () => {
    cy.window().then((win) => {
      // Test implementation
      expect(win.game.player).to.exist
    })
  })
})
```

### Best Practices:

1. **Descriptive names:** Használj beszédes teszt neveket
2. **beforeEach:** Minden teszt előtt látogasd meg az oldalt
3. **Wait appropriately:** Használj `cy.wait()` amikor szükséges
4. **Clean state:** Minden teszt clean state-ből induljon
5. **Assertions:** Használj meaningful assertions

## 🐛 Debugging

### Cypress Debug Tools:

```javascript
// Pause execution
cy.pause()

// Debug command
cy.debug()

// Log to console
cy.log('Debug message')

// Take screenshot
cy.screenshot('test-screenshot')
```

### Browser DevTools:

Cypress GUI módban nyisd meg a DevTools-t és használd a `debugger` statement-et:

```javascript
it('debug test', () => {
  cy.window().then((win) => {
    debugger;  // Execution will pause here
    expect(win.game).to.exist
  })
})
```

## 📊 Test Reports

### Run tesztek után:

- **Screenshots:** `cypress/screenshots/`
- **Videos:** `cypress/videos/` (ha engedélyezve)

## 🔧 Konfiguráció

A Cypress konfiguráció a `cypress.config.js` fájlban található a projekt root-jában.

### Főbb beállítások:

```javascript
{
  baseUrl: 'http://localhost:8080',
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true
}
```

## 📝 Tesztek bővítése

### További tesztelendő területek:

- [ ] Collision detection részletesen
- [ ] Spell cast animációk
- [ ] Game over flow
- [ ] Sound system
- [ ] Different spell types
- [ ] Enemy AI pathfinding
- [ ] Performance under load
- [ ] Browser compatibility

## 🤝 Kontribúció

### Teszt írási guideline:

1. Fork a projektet
2. Új test file vagy teszt hozzáadása
3. Futtasd a teszteket: `npm run cypress:run`
4. Commit és push
5. Pull request

## 📚 Hasznos linkek

- **Cypress Docs:** https://docs.cypress.io/
- **Best Practices:** https://docs.cypress.io/guides/references/best-practices
- **Examples:** https://example.cypress.io/

---

**Verzió:** 1.0.0  
**Utolsó frissítés:** 2026.05.26  
**Készítette:** Kevin, Tomi
