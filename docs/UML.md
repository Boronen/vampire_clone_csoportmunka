# UML Diagramok - Vampire Survivors Clone

## 📐 Osztály diagram (Class Diagram)

### Teljes osztály hierarchia áttekintés

```
┌─────────────────────────────────────────────────────────────────┐
│                          Game                                    │
│  - canvas, ctx, player, enemies[], projectiles[]                │
│  - background, soundManager, damageNumbers                       │
│  + init(), start(), gameLoop(), update(), render()              │
│  + spawnEnemy(), checkCollisions(), gameOver()                  │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │ has                │ has                │ has
           ▼                    ▼                    ▼
    ┌──────────┐        ┌──────────┐        ┌──────────────┐
    │  Player  │        │  Enemy   │        │  Background  │
    └──────────┘        └──────────┘        └──────────────┘
           │
           │ has
           ▼
    ┌──────────────┐
    │ SpellManager │
    └──────────────┘
           │
           │ manages
           ▼
    ┌──────────────┐
    │    Spell     │◄─────────────────┐
    └──────────────┘                  │ extends
           △                          │
           │                          │
           └──────────┬───────────────┴──────────────┬──────────────┐
                      │                              │              │
              ┌───────────────┐            ┌─────────────────┐     │
              │ProjectileSpell│            │  OrbitalSpell   │     │
              └───────────────┘            └─────────────────┘     │
                                                                    │
              ┌────────────────────────────────────────────────────┤
              │                                                     │
      ┌───────────┐  ┌───────────────┐  ┌─────────────┐  ┌────────────┐
      │ AOESpell  │  │StaticAOESpell │  │ SkyFallSpell│  │ ShieldSpell│
      └───────────┘  └───────────────┘  └─────────────┘  └────────────┘
              │
              │
      ┌───────────┐
      │MeleeSpell │
      └───────────┘
```

---

## 🔷 Entity Hierarchia

```
┌─────────────────────────────────────────────┐
│              Entity (Base Class)             │
│──────────────────────────────────────────────│
│ - x, y, width, height                        │
│ - health, maxHealth, alive                   │
│ - sprite, frameX, frameY, frameCount        │
│ - animationSpeed, lastFrameUpdate           │
│──────────────────────────────────────────────│
│ + update(deltaTime)                          │
│ + render(ctx, cameraX, cameraY)             │
│ + takeDamage(amount)                         │
│ + isAlive()                                  │
│ + getBounds()                                │
│ + getX(), getY(), getWidth(), getHeight()   │
└─────────────────────────────────────────────┘
                    △
                    │ extends
        ┌───────────┴───────────┐
        │                       │
┌───────────────┐       ┌──────────────┐
│    Player     │       │    Enemy     │
│───────────────│       │──────────────│
│ - speed       │       │ - target     │
│ - xp, level   │       │ - speed      │
│ - spellMgr    │       │ - damage     │
│ - keys        │       │ - scoreValue │
│───────────────│       │──────────────│
│ + move()      │       │ + moveTowards│
│ + gainXP()    │       │   Player()   │
│ + levelUp()   │       │ + getDamage()│
│ + shoot()     │       │ + getScore() │
└───────────────┘       └──────────────┘
```

---

## 🎯 Spell System Részletes UML

### SpellManager kapcsolatok

```
┌──────────────────────────────────────────────┐
│           SpellManager                        │
│───────────────────────────────────────────────│
│ - player: Player                              │
│ - game: Game                                  │
│ - activeSpells: Map<string, Spell>           │
│ - discoveredSpells: Set<string>              │
│ - spellCombinations: Map                     │
│───────────────────────────────────────────────│
│ + addSpell(spellId): void                    │
│ + upgradeSpell(spellId): void                │
│ + checkCombinations(spell): void             │
│ + combineSpells(id1, id2): void              │
│ + getUpgradeOptions(count): Array            │
│ + applyUpgrade(option): void                 │
│ + castUltimate(): void                       │
│ + castDash(): void                           │
│ + update(deltaTime): void                    │
│ + render(ctx, camX, camY): void              │
│ + getAllSpells(): Array<Spell>               │
│ + getActiveShields(): Array<ShieldSpell>     │
└──────────────────────────────────────────────┘
                    │
                    │ manages
                    ▼
┌──────────────────────────────────────────────┐
│              Spell (Abstract)                 │
│───────────────────────────────────────────────│
│ # id, name, description                       │
│ # player, game                                │
│ # level, maxLevel                             │
│ # damage, cooldown, castTime                 │
│ # spritePath, sprite                         │
│───────────────────────────────────────────────│
│ + canCast(time): boolean                     │
│ + cast(time): void                           │
│ # onCast(): void [abstract]                  │
│ + upgrade(): void                            │
│ + update(deltaTime): void                    │
│ + render(ctx, camX, camY): void              │
│ + getBounds(): Object                        │
│ + getStats(): Object                         │
└──────────────────────────────────────────────┘
```

### Spell típusok részletesen

```
┌─────────────────────────────────────┐
│       ProjectileSpell               │
│─────────────────────────────────────│
│ - projectileCount                   │
│ - effects: Array<SpellProjectile>  │
│─────────────────────────────────────│
│ + onCast(): void                    │
│ - findNearestEnemy(): Enemy         │
│ + render(ctx, camX, camY): void     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        OrbitalSpell                 │
│─────────────────────────────────────│
│ - orbitals: Array                   │
│ - orbitalCount, orbitalSpeed        │
│ - orbitalRadius, angleOffset        │
│─────────────────────────────────────│
│ + initializeOrbitals(): void        │
│ + onCast(): void                    │
│ - getOrbitalPosition(orb): Object   │
│ + update(deltaTime): void           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          AOESpell                   │
│─────────────────────────────────────│
│ - aoeRadius, aoeRange               │
│ - explosionAnimation                │
│ - damageDealt: Set                  │
│─────────────────────────────────────│
│ + onCast(): void                    │
│ - damageNearbyEnemies(): void       │
│ + update(deltaTime): void           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      StaticAOESpell                 │
│─────────────────────────────────────│
│ - zones: Array<Zone>                │
│ - zoneDuration, zoneRadius          │
│ - maxZones                          │
│─────────────────────────────────────│
│ + onCast(): void                    │
│ + update(deltaTime): void           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       SkyFallSpell                  │
│─────────────────────────────────────│
│ - meteors: Array                    │
│ - meteorCount, meteorRadius         │
│─────────────────────────────────────│
│ + onCast(): void                    │
│ - getRandomPosition(): Object       │
│ + update(deltaTime): void           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       ShieldSpell                   │
│─────────────────────────────────────│
│ - shieldHealth, maxShieldHealth     │
│ - shieldActive, shieldRadius        │
│─────────────────────────────────────│
│ + onCast(): void                    │
│ + absorbDamage(damage): number      │
│ + isShieldActive(): boolean         │
│ + update(deltaTime): void           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        MeleeSpell                   │
│─────────────────────────────────────│
│ - meleeRange, swingAngle            │
│ - swingDuration, hitEnemies: Set   │
│─────────────────────────────────────│
│ + onCast(): void                    │
│ - hitEnemiesInRange(): void         │
│ - findNearestEnemy(): Enemy         │
└─────────────────────────────────────┘
```

---

## 🔊 Manager Classes

```
┌─────────────────────────────────────┐
│        SoundManager                 │
│─────────────────────────────────────│
│ - sounds: Map<string, Audio>        │
│ - enabled: boolean                  │
│ - volume: number                    │
│─────────────────────────────────────│
│ + loadSounds(): void                │
│ + playAttack(): void                │
│ + playDamage(): void                │
│ + playDeath(): void                 │
│ + playSpellSound(id): void          │
│ + play(name): void                  │
│ + setVolume(vol): void              │
│ + toggle(): void                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      DamageNumberManager            │
│─────────────────────────────────────│
│ - game: Game                        │
│ - numbers: Array<DamageNumber>     │
│─────────────────────────────────────│
│ + addDamage(x, y, dmg, crit): void │
│ + update(deltaTime): void           │
│ + render(ctx, camX, camY): void     │
└─────────────────────────────────────┘
        │
        │ manages
        ▼
┌─────────────────────────────────────┐
│         DamageNumber                │
│─────────────────────────────────────│
│ - x, y, damage, isCrit              │
│ - lifetime, opacity                 │
│ - velocityY                         │
│─────────────────────────────────────│
│ + update(deltaTime): void           │
│ + render(ctx, camX, camY, font): v  │
└─────────────────────────────────────┘
```

---

## 🎲 További osztályok

```
┌─────────────────────────────────────┐
│          Projectile                 │
│─────────────────────────────────────│
│ - x, y, width, height               │
│ - velocityX, velocityY              │
│ - damage, lifetime                  │
│ - sprite, active                    │
│─────────────────────────────────────│
│ + update(deltaTime): void           │
│ + render(ctx, camX, camY): void     │
│ + isActive(): boolean               │
│ + deactivate(): void                │
│ + getBounds(): Object               │
│ + getDamage(): number               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Background                  │
│─────────────────────────────────────│
│ - image: Image                      │
│ - loaded: boolean                   │
│─────────────────────────────────────│
│ + render(ctx, camX, camY, w, h): v  │
│ + isLoaded(): boolean               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        SpellProjectile              │
│─────────────────────────────────────│
│ - x, y, vx, vy                      │
│ - damage, lifetime                  │
│ - sprite, frameIndex                │
│ - target: Enemy                     │
│─────────────────────────────────────│
│ + update(deltaTime): void           │
│ + render(ctx, camX, camY): void     │
│ + isFinished(): boolean             │
│ + getBounds(): Object               │
└─────────────────────────────────────┘
```

---

## 🔗 Sequence Diagram - Game Loop

```
Player          Game          SpellManager      Enemy          Projectile
  │              │                  │              │                │
  │  update()    │                  │              │                │
  │◄─────────────│                  │              │                │
  │              │                  │              │                │
  │ handleInput()│                  │              │                │
  │──────────────┤                  │              │                │
  │              │                  │              │                │
  │ move()       │                  │              │                │
  │──────────────┤                  │              │                │
  │              │                  │              │                │
  │              │  update()        │              │                │
  │              │─────────────────►│              │                │
  │              │                  │              │                │
  │              │    cast spells   │              │                │
  │              │                  │──────┐       │                │
  │              │                  │      │       │                │
  │              │                  │◄─────┘       │                │
  │              │                  │              │                │
  │              │  update()        │              │                │
  │              │─────────────────────────────────►│                │
  │              │                  │              │                │
  │              │                  │   update()   │                │
  │              │──────────────────────────────────────────────────►│
  │              │                  │              │                │
  │              │  checkCollisions()              │                │
  │              │──────────────────────────────────┬───────────────►│
  │              │                  │              │                │
  │              │     takeDamage() │              │                │
  │              │─────────────────────────────────►│                │
  │              │                  │              │                │
  │  render()    │                  │              │                │
  │◄─────────────│                  │              │                │
```

---

## 🎨 Collision Detection Diagram

```
           Game.checkCollisions()
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  Player-Enemy  Projectile  Spell-Enemy
   Collision    -Enemy      Collision
                Collision
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
            Enemy.takeDamage()
                    │
                    ▼
         DamageNumberManager
              .addDamage()
```

---

## 📊 State Diagram - Player States

```
                ┌──────────┐
                │  IDLE    │
                └──────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ MOVING  │  │ATTACKING│  │ DASHING │
   └─────────┘  └─────────┘  └─────────┘
         │           │           │
         └───────────┼───────────┘
                     │
                     ▼
              ┌───────────┐
              │   DEAD    │
              └───────────┘
```

---

## 🎯 Use Case Diagram

```
                    ┌──────────────────┐
                    │   Játékos        │
                    └──────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   (Mozgás)           (Támadás)          (Szintlépés)
        │                   │                   │
        │                   │                   └──►(Varázslat választás)
        │                   │
        │                   └──────────────────►(Ellenség elpusztítása)
        │                                              │
        │                                              ▼
        │                                        (XP szerzés)
        │                                              │
        └──────────────────────────────────────────────┘
```

---

## 📐 Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Game Application                      │
│                                                          │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Game Engine  │  │  UI System   │  │Asset Loader │ │
│  │  (Game.js)    │  │ (HTML/CSS)   │  │  (Images)   │ │
│  └───────────────┘  └──────────────┘  └─────────────┘ │
│         │                   │                 │         │
│  ┌──────┴───────────────────┴─────────────────┴──────┐ │
│  │            Core Game Components                    │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐ │ │
│  │  │Player  │ │ Enemy  │ │ Spell  │ │ Managers   │ │ │
│  │  │System  │ │ System │ │ System │ │ (Sound,etc)│ │ │
│  │  └────────┘ └────────┘ └────────┘ └────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              External Dependencies                  │ │
│  │  - HTML5 Canvas API                                │ │
│  │  - Web Audio API                                   │ │
│  │  - ES6 Modules                                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
    User Input
        │
        ▼
┌──────────────┐
│  Game.js     │
└──────────────┘
        │
        ├─────► Player.js ────► SpellManager.js ────► Spell.js
        │                                                  │
        ├─────► Enemy.js                                  │
        │          │                                      │
        │          ▼                                      ▼
        └─────► Collision Detection ◄────────── SpellProjectile
                    │
                    ├─────► DamageNumberManager
                    │
                    └─────► SoundManager
                                │
                                ▼
                          Audio Output
```

---

## 📝 Megjegyzések

### Osztály kapcsolatok típusai:
- **Extends (△):** Öröklődés (pl. Player extends Entity)
- **Has (─►):** Tulajdon (pl. Game has Player)
- **Uses (··►):** Használat (pl. Player uses SpellManager)
- **Creates (--►):** Létrehozás (pl. SpellManager creates Spell)

### Kulcsfontosságú design döntések:
1. **Entity alaposztály:** Player és Enemy közös funkcionalitása
2. **Spell hierarchia:** Különböző varázslat típusok specializált viselkedése
3. **Manager pattern:** SpellManager, SoundManager, DamageNumberManager
4. **Composition over inheritance:** Game osztály tartalmazza a komponenseket

### UML szerkesztése:
Ezek az ábrák egyszerűsített ASCII verzióban vannak. A teljes grafikus UML diagram készítéséhez használd:
- **Draw.io:** https://app.diagrams.net/
- **Lucidchart:** https://www.lucidchart.com/
- **PlantUML:** http://www.plantuml.com/

---

**Utolsó frissítés:** 2026.05.26
