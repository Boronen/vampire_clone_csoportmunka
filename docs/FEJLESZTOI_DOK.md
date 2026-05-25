# Fejlesztői Dokumentáció - Vampire Survivors Clone

## 📚 Tartalomjegyzék

1. [Architektúra áttekintés](#architektúra-áttekintés)
2. [Core Classes API](#core-classes-api)
3. [Spell System API](#spell-system-api)
4. [Manager Classes API](#manager-classes-api)
5. [Fejlesztési környezet](#fejlesztési-környezet)
6. [Code Standards](#code-standards)
7. [Debugging](#debugging)
8. [Performance Optimization](#performance-optimization)

---

## 🏗️ Architektúra áttekintés

### Design Patterns

#### 1. **Entity Component System (részleges)**
Az `Entity` alaposztály közös funkcionalitást biztosít:
- `Player` és `Enemy` egyaránt `Entity`-ből származik
- Közös metódusok: `update()`, `render()`, `takeDamage()`, `getBounds()`

#### 2. **Manager Pattern**
Központi manager osztályok specifikus funkcionalitásokra:
- `SpellManager` - varázslatok kezelése
- `SoundManager` - hangeffektek
- `DamageNumberManager` - sérülés számok

#### 3. **Strategy Pattern (Spell Types)**
Különböző spell viselkedések külön osztályokban:
- Minden spell típus implementálja az `onCast()` metódust
- Közös interfész a `Spell` alaposztályból

#### 4. **Object Pool (implicit)**
Projectile-ok és effektek újrafelhasználása:
- Deactivált objektumok törlése helyett újrahasznosítás
- Performance javítás sok objektum esetén

---

## 🎮 Core Classes API

### Game Class

**Felelősség:** Fő játék vezérlő, game loop menedzselés

```javascript
class Game {
    constructor()
    
    // Játék inicializálás
    init(): void
    
    // Játék indítás
    start(): void
    
    // Fő játék hurok
    gameLoop(timestamp: number): void
    
    // Frame update logika
    update(deltaTime: number): void
    
    // Renderelés
    render(): void
    
    // UI renderelés
    renderUI(): void
    
    // Egyedi font renderelés
    renderCustomText(text: string, x: number, y: number, fontSize: number): void
    
    // Ellenség spawn
    spawnEnemy(): void
    
    // Random spawn pozíció
    getRandomSpawnPosition(): {x: number, y: number}
    
    // Ütközés ellenőrzés
    checkCollisions(): void
    
    // Rectangle collision check
    checkRectCollision(rect1: Object, rect2: Object): boolean
    
    // Játék vége
    gameOver(): void
    
    // Halál képernyő renderelés
    renderDeathScreen(): void
    
    // Upgrade menü megjelenítés
    showUpgradeMenu(): void
    hideUpgradeMenu(): void
    renderUpgradeMenu(): void
    
    // Debug funkciók
    renderDebugHitboxes(cameraX: number, cameraY: number): void
    showDebugSpellMenu(): void
    hideDebugSpellMenu(): void
}
```

**Használat példa:**
```javascript
const game = new Game();
game.init();
game.start();
```

---

### Entity Class (Abstract Base)

**Felelősség:** Alaposztály player és enemy számára

```javascript
class Entity {
    constructor(x: number, y: number, width: number, height: number)
    
    // Properties
    x: number
    y: number
    width: number
    height: number
    health: number
    maxHealth: number
    alive: boolean
    
    // Sprite properties
    sprite: Image
    frameX: number
    frameY: number
    frameCount: number
    animationSpeed: number
    
    // Core methods
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
    takeDamage(amount: number): void
    isAlive(): boolean
    
    // Getters
    getX(): number
    getY(): number
    getWidth(): number
    getHeight(): number
    getBounds(): {x: number, y: number, width: number, height: number}
}
```

---

### Player Class

**Felelősség:** Játékos karakter, input kezelés, mozgás, XP rendszer

```javascript
class Player extends Entity {
    constructor(x: number, y: number, game: Game)
    
    // Properties
    speed: number
    xp: number
    level: number
    xpToNextLevel: number
    spellManager: SpellManager
    keys: Object  // Input state
    
    // Methods
    setupInputListeners(): void
    handleInput(): void
    move(deltaTime: number): void
    
    // Combat
    shoot(currentTime: number): void
    findNearestEnemy(): Enemy | null
    
    // Progression
    gainXP(amount: number): void
    levelUp(): void
    
    // Ultimate abilities
    activateUltimate(index: number): void
    
    // Override
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
}
```

**Használat példa:**
```javascript
const player = new Player(100, 100, game);
player.gainXP(50);
player.levelUp();
```

---

### Enemy Class

**Felelősség:** Ellenség AI, követés, skálázás

```javascript
class Enemy extends Entity {
    constructor(x: number, y: number, target: Player, gameTime: number = 0)
    
    // Properties
    target: Player
    speed: number
    damage: number
    scoreValue: number
    
    // Methods
    moveTowardsPlayer(deltaTime: number): void
    getScoreValue(): number
    getDamage(): number
    
    // Override
    update(deltaTime: number): void
}
```

**Enemy Scaling Formula:**
```javascript
// HP scaling
const timeMultiplier = 1 + Math.floor(gameTime / 30) * 0.2;
const actualHP = baseHP * timeMultiplier;

// Damage scaling
const damageIncrease = Math.floor(gameTime / 60) * 5;
const actualDamage = baseDamage + damageIncrease;
```

---

## 🔮 Spell System API

### Spell Class (Abstract Base)

**Felelősség:** Varázslat alaposztály

```javascript
class Spell {
    constructor(player: Player, game: Game, spellData: Object)
    
    // Properties
    id: string
    name: string
    description: string
    level: number
    maxLevel: number
    damage: number
    cooldown: number
    castTime: number
    lastCastTime: number
    spritePath: string
    sprite: Image
    
    // Core methods
    canCast(currentTime: number): boolean
    cast(currentTime: number): void
    onCast(): void  // Abstract - override in subclasses
    upgrade(): void
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
    
    // Utility
    getBounds(): Object
    getStats(): Object
}
```

---

### ProjectileSpell Class

**Felelősség:** Lövedék alapú varázslatok

```javascript
class ProjectileSpell extends Spell {
    constructor(player: Player, game: Game, spellData: Object)
    
    // Properties
    projectileCount: number
    effects: Array<SpellProjectile>
    projectileSpeed: number
    projectileLifetime: number
    
    // Methods
    onCast(): void
    findNearestEnemy(): Enemy | null
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
}
```

**SpellProjectile Object:**
```javascript
class SpellProjectile {
    x: number
    y: number
    vx: number  // velocity X
    vy: number  // velocity Y
    damage: number
    lifetime: number
    sprite: Image
    frameIndex: number
    width: number
    height: number
    target: Enemy | null
    
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
    isFinished(): boolean
    getBounds(): Object
}
```

---

### OrbitalSpell Class

**Felelősség:** Keringő objektumok

```javascript
class OrbitalSpell extends Spell {
    constructor(player: Player, game: Game, spellData: Object)
    
    // Properties
    orbitals: Array<Orbital>
    orbitalCount: number
    orbitalSpeed: number
    orbitalRadius: number
    angleOffset: number
    
    // Methods
    initializeOrbitals(): void
    onCast(): void
    getOrbitalPosition(orbital: Orbital): {x: number, y: number}
    update(deltaTime: number): void
    upgrade(): void
}
```

**Orbital Object:**
```javascript
{
    angle: number,
    sprite: Image,
    frameIndex: number,
    width: number,
    height: number,
    damage: number,
    hitEnemies: Set<Enemy>
}
```

---

### AOESpell Class

**Felelősség:** Területi robbanások

```javascript
class AOESpell extends Spell {
    constructor(player: Player, game: Game, spellData: Object)
    
    // Properties
    aoeRadius: number
    aoeRange: number
    explosionAnimation: Object
    damageDealt: Set<Enemy>
    
    // Methods
    onCast(): void
    damageNearbyEnemies(): void
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
}
```

---

### StaticAOESpell Class

**Felelősség:** Helyben maradó sérülés zónák

```javascript
class StaticAOESpell extends Spell {
    constructor(player: Player, game: Game, spellData: Object)
    
    // Properties
    zones: Array<Zone>
    zoneDuration: number
    zoneRadius: number
    maxZones: number
    
    // Methods
    onCast(): void
    update(deltaTime: number): void
}
```

**Zone Object:**
```javascript
{
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    lifetime: number,
    damageTimer: number,
    hitEnemies: Set<Enemy>,
    sprite: Image,
    frameIndex: number
}
```

---

### ShieldSpell Class

**Felelősség:** Védő pajzsok

```javascript
class ShieldSpell extends Spell {
    constructor(player: Player, game: Game, spellData: Object)
    
    // Properties
    shieldHealth: number
    maxShieldHealth: number
    shieldActive: boolean
    shieldRadius: number
    
    // Methods
    onCast(): void
    absorbDamage(damage: number): number  // Returns absorbed amount
    isShieldActive(): boolean
    update(deltaTime: number): void
}
```

---

### MeleeSpell Class

**Felelősség:** Közelharc támadások

```javascript
class MeleeSpell extends Spell {
    constructor(player: Player, game: Game, spellData: Object)
    
    // Properties
    meleeRange: number
    swingAngle: number
    swingDuration: number
    hitEnemies: Set<Enemy>
    
    // Methods
    onCast(): void
    hitEnemiesInRange(): void
    findNearestEnemy(): Enemy | null
}
```

---

## 🎛️ Manager Classes API

### SpellManager Class

**Felelősség:** Összes varázslat menedzselése

```javascript
class SpellManager {
    constructor(player: Player, game: Game)
    
    // Properties
    player: Player
    game: Game
    activeSpells: Map<string, Spell>
    discoveredSpells: Set<string>
    spellCombinations: Map<string, Object>
    
    // Spell management
    addSpell(spellId: string): void
    upgradeSpell(spellId: string): void
    hasSpell(spellId: string): boolean
    getSpellCount(): number
    getAllSpells(): Array<Spell>
    
    // Combinations
    checkCombinations(spell: Spell): void
    combineSpells(spellId1: string, spellId2: string): void
    
    // Upgrade system
    getUpgradeOptions(count: number = 3): Array<Object>
    applyUpgrade(option: Object): void
    applyStatUpgrade(stat: string): void
    
    // Special abilities
    castUltimate(): void
    castDash(): void
    
    // Utility
    getActiveShields(): Array<ShieldSpell>
    
    // Core
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
}
```

**Upgrade Option Object:**
```javascript
{
    type: 'new' | 'upgrade' | 'stat',
    display: string,
    description: string,
    spellId?: string,
    spell?: Spell,
    spellData?: Object,
    stat?: string
}
```

---

### SoundManager Class

**Felelősség:** Hangeffektek kezelése

```javascript
class SoundManager {
    constructor()
    
    // Properties
    sounds: Map<string, HTMLAudioElement>
    enabled: boolean
    volume: number
    
    // Methods
    loadSounds(): void
    playAttack(): void
    playDamage(): void
    playDeath(): void
    playSpellSound(spellId: string): void
    play(soundName: string): void
    setVolume(volume: number): void
    toggle(): void
}
```

**Sound mapping:**
```javascript
{
    'attack': 'sound effects/zap2a.ogg',
    'damage': 'sound effects/018.wav',
    'death': 'sound effects/tribe_f.wav',
    'magicSpell': 'sound effects/twink.ogg',
    'fireSpin': 'sound effects/04_Fire_explosion_04_medium.wav',
    // ... more
}
```

---

### DamageNumberManager Class

**Felelősség:** Lebegő sérülés számok

```javascript
class DamageNumberManager {
    constructor(game: Game)
    
    // Properties
    game: Game
    numbers: Array<DamageNumber>
    
    // Methods
    addDamage(x: number, y: number, damage: number, isCrit: boolean = false): void
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void
}
```

**DamageNumber Object:**
```javascript
class DamageNumber {
    x: number
    y: number
    damage: number
    isCrit: boolean
    lifetime: number
    maxLifetime: number
    opacity: number
    velocityY: number
    
    update(deltaTime: number): void
    render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, fontImg: Image): void
}
```

---

## 💾 SpellData Configuration

### SpellData.js Structure

```javascript
const SPELL_DATA = {
    'spellId': {
        name: 'Display Name',
        description: 'Spell description',
        type: 'projectile' | 'orbital' | 'aoe' | 'staticaoe' | 'skyfall' | 'shield' | 'melee',
        spritePath: 'Sprites/sprite-name.png',
        soundId: 'soundName',
        
        // Base stats
        damage: number,
        cooldown: number,  // milliseconds
        
        // Type-specific properties
        projectileCount?: number,
        projectileSpeed?: number,
        projectileLifetime?: number,
        
        orbitalCount?: number,
        orbitalRadius?: number,
        orbitalSpeed?: number,
        
        aoeRadius?: number,
        aoeRange?: number,
        
        // Upgrade scaling
        upgrades: {
            damage: number,  // per level
            cooldown: number  // reduction per level
        }
    }
}
```

**Példa spell:**
```javascript
'magicSpell': {
    name: 'Magic Spell',
    description: 'Basic magical projectile',
    type: 'projectile',
    spritePath: 'Sprites/1_magicspell_spritesheet-73.png',
    soundId: 'magicSpell',
    damage: 15,
    cooldown: 1000,
    projectileCount: 1,
    projectileSpeed: 300,
    projectileLifetime: 3,
    frameCount: 73,
    frameWidth: 128,
    frameHeight: 128,
    upgrades: {
        damage: 5,
        cooldown: -100,
        projectileCount: 1  // every 3 levels
    }
}
```

---

## 🛠️ Fejlesztési környezet

### Szükséges eszközök

1. **Visual Studio Code** (ajánlott)
   - Extensions: ESLint, Prettier, Live Server

2. **Git**
   - Verziókezelés
   - GitHub repository

3. **Node.js** (opcionális)
   - npm package manager
   - Cypress futtatásához

4. **Browser DevTools**
   - Chrome DevTools
   - Performance profiling

### Projekt setup

```bash
# Repository klónozás
git clone https://github.com/Boronen/vampire_clone_csoportmunka.git
cd vampire_clone_csoportmunka

# Local server indítás (Python)
python -m http.server 8000

# VAGY Node.js http-server
npx http-server

# Böngésző megnyitás
# http://localhost:8000
```

---

## 📏 Code Standards

### Naming Conventions

```javascript
// Classes: PascalCase
class SpellManager {}

// Variables: camelCase
const playerHealth = 100;
const enemyCount = 5;

// Constants: UPPER_SNAKE_CASE
const MAX_HEALTH = 100;
const SPAWN_INTERVAL = 1000;

// Private properties: # prefix
class Player {
    #privateProperty = 0;
}

// Methods: camelCase
function calculateDamage() {}
```

### Code Structure

```javascript
// File structure
// 1. Imports
// 2. Constants
// 3. Class definition
// 4. Constructor
// 5. Public methods
// 6. Private methods
// 7. Utility methods

class Example {
    // Constructor
    constructor() {
        this.property = 0;
    }
    
    // Public methods
    publicMethod() {
        // Implementation
    }
    
    // Private methods
    #privateMethod() {
        // Implementation
    }
}
```

### Comments

```javascript
/**
 * JSDoc style comments for classes
 * @param {number} damage - The amount of damage
 * @returns {boolean} True if successful
 */
function takeDamage(damage) {
    // Inline comments for complex logic
    if (damage > 0) {
        this.health -= damage;
        return true;
    }
    return false;
}
```

---

## 🐛 Debugging

### Debug Mode

**Aktiválás:** `U` billentyű

**Funkciók:**
- Hitbox megjelenítés (zöld, piros, sárga, cyan)
- Statisztikák kijelzése
- Enemy scaling info
- Active spells lista
- FPS counter (implicit a requestAnimationFrame-ben)

### Debug Commands

```javascript
// Console-ban futtatható parancsok

// Spell hozzáadás
game.player.spellManager.addSpell('magicSpell');

// Spell upgrade
game.player.spellManager.upgradeSpell('fireSpin');

// Azonnali level up
game.player.gainXP(game.player.xpToNextLevel - game.player.xp);

// Végtelen HP
game.player.infiniteHP = true;

// Enemy HP dupázás
game.enemies.forEach(e => e.maxHealth *= 2);

// Game pause
game.isPaused = true;
```

### Common Issues

**1. Sprite nem jelenik meg**
```javascript
// Ellenőrizd a sprite betöltését
console.log(spell.sprite.complete);  // Should be true

// Ellenőrizd a path-ot
console.log(spell.spritePath);  // Correct path?
```

**2. Collision nem működik**
```javascript
// Debug hitboxokat jelenítsd meg
game.debugMode = true;

// Ellenőrizd a bounds-ot
console.log(player.getBounds());
console.log(enemy.getBounds());
```

**3. Performance issues**
```javascript
// Ellenőrizd az entity count-ot
console.log('Enemies:', game.enemies.length);
console.log('Projectiles:', game.projectiles.length);
console.log('Spells:', game.player.spellManager.getAllSpells().length);

// Chrome DevTools Performance tab használata
```

---

## ⚡ Performance Optimization

### Best Practices

#### 1. **Object Pooling**
```javascript
// ROSSZ - új objektum minden frame-ben
for (let i = 0; i < 10; i++) {
    const projectile = new Projectile();
    projectiles.push(projectile);
}

// JÓ - újrafelhasználás
projectiles = projectiles.filter(p => p.isActive());
// Deactivated projectiles removed, not recreated
```

#### 2. **Collision Optimization**
```javascript
// ROSSZ - minden entitás minden entitással
for (const entity1 of entities) {
    for (const entity2 of entities) {
        checkCollision(entity1, entity2);
    }
}

// JÓ - spatial partitioning vagy early exit
for (const projectile of projectiles) {
    for (const enemy of enemies) {
        if (checkCollision(projectile, enemy)) {
            projectile.deactivate();
            break;  // Early exit
        }
    }
}
```

#### 3. **Sprite Caching**
```javascript
// Sprites cache-elve vannak
const sprite = new Image();
sprite.src = 'path/to/sprite.png';
this.sprite = sprite;  // Reference, not reload

// NE töltsd újra minden frame-ben!
```

#### 4. **DeltaTime használata**
```javascript
// Frame-rate independent movement
update(deltaTime) {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
}
```

### Performance Targets

- **60 FPS:** Target frame rate
- **<16ms:** Frame time target (1000ms / 60fps)
- **<200:** Max simultaneous entities
- **<50MB:** Memory usage target

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

```markdown
- [ ] Player movement (WASD, Arrows)
- [ ] Player shooting
- [ ] Enemy spawning
- [ ] Enemy AI (following)
- [ ] Collisions (player-enemy, projectile-enemy)
- [ ] Health system
- [ ] XP and level up
- [ ] Upgrade menu
- [ ] All spell types functional
- [ ] Sound effects
- [ ] Game over screen
- [ ] Debug mode
```

### Cypress Tests (Tervezett)

```javascript
// cypress/e2e/game.cy.js
describe('Vampire Survivors Game', () => {
    it('should load game', () => {
        cy.visit('/');
        cy.get('#gameCanvas').should('exist');
    });
    
    it('should spawn player', () => {
        cy.window().then((win) => {
            expect(win.game.player).to.exist;
        });
    });
    
    // More tests...
});
```

---

## 📚 AI Tools for Documentation

### Recommended Tools

1. **JSDoc Generator**
   ```bash
   npm install -g jsdoc
   jsdoc -c jsdoc.json
   ```

2. **TypeDoc** (TypeScript conversion)
   ```bash
   npm install -g typedoc
   typedoc --out docs src/
   ```

3. **Documentation.js**
   ```bash
   npm install -g documentation
   documentation build *.js -f html -o docs
   ```

4. **AI Assistants**
   - **GitHub Copilot** - Code completion
   - **ChatGPT/Claude** - Documentation writing
   - **Tabnine** - AI code completion

---

## 🔗 Hasznos linkek

- **MDN Canvas API:** https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **JavaScript Game Dev:** https://eloquentjavascript.net/
- **Cypress Docs:** https://docs.cypress.io/
- **Draw.io:** https://app.diagrams.net/

---

**Verzió:** 1.0.0  
**Utolsó frissítés:** 2026.05.26  
**Készítette:** Kevin  
**Státusz:** ✅ Complete
