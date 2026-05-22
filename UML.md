# Vampire Survivors Clone - UML Class Diagram

## Class Overview

This document describes the Object-Oriented architecture for a Vampire Survivors-like game using 6 classes

ez a játék egy shooter game ami egy fikcionális világban játszódik.
nincs semmi története jelenleg, csak felülnézetból kell irányítani a player karaktert.

---

## 1. Game Class

```
┌─────────────────────────────────────────────────────────┐
│                         Game                            │
├─────────────────────────────────────────────────────────┤
│ - canvas: HTMLCanvasElement                             │
│ - ctx: CanvasRenderingContext2D                         │
│ - player: Player                                        │
│ - enemies: Enemy[]                                      │
│ - projectiles: Projectile[]                             │
│ - background: Background                                │
│ - score: number                                         │
│ - gameTime: number                                      │
│ - lastEnemySpawn: number                                │
│ - enemySpawnInterval: number                            │
│ - isRunning: boolean                                    │
│ - lastFrameTime: number                                 │
├─────────────────────────────────────────────────────────┤
│ + constructor()                                         │
│ + init(): void                                          │
│ + start(): void                                         │
│ + update(deltaTime: number): void                       │
│ + render(): void                                        │
│ + gameLoop(timestamp: number): void                     │
│ + spawnEnemy(): void                                    │
│ + checkCollisions(): void                               │
│ + addProjectile(projectile: Projectile): void           │
│ + removeEnemy(enemy: Enemy): void                       │
│ + removeProjectile(projectile: Projectile): void        │
│ + getRandomSpawnPosition(): {x: number, y: number}      │
└─────────────────────────────────────────────────────────┘
```

**Responsibilities:**
- Main game loop management
- Coordinate all game objects
- Handle enemy spawning
- Collision detection between projectiles and enemies
- Score tracking

---

## 2. Entity Class (Abstract Base Class)

```
┌─────────────────────────────────────────────────────────┐
│                        Entity                           │
├─────────────────────────────────────────────────────────┤
│ # x: number                                             │
│ # y: number                                             │
│ # width: number                                         │
│ # height: number                                        │
│ # speed: number                                         │
│ # health: number                                        │
│ # maxHealth: number                                     │
│ # sprite: HTMLImageElement                              │
│ # spriteLoaded: boolean                                 │
├─────────────────────────────────────────────────────────┤
│ + constructor(x: number, y: number, width: number,      │
│              height: number, speed: number,             │
│              health: number, spritePath: string)        │
│ + update(deltaTime: number): void                       │
│ + render(ctx: CanvasRenderingContext2D,                 │
│          cameraX: number, cameraY: number): void        │
│ + takeDamage(amount: number): void                      │
│ + isAlive(): boolean                                    │
│ + getX(): number                                        │
│ + getY(): number                                        │
│ + getWidth(): number                                    │
│ + getHeight(): number                                   │
│ + getBounds(): {x: number, y: number,                   │
│                 width: number, height: number}          │
└─────────────────────────────────────────────────────────┘
```

**Responsibilities:**
- Base class for all game entities (Player, Enemy)
- Common properties and methods
- Health management
- Sprite rendering

---

## 3. Player Class (extends Entity)

```
┌─────────────────────────────────────────────────────────┐
│                    Player extends Entity                │
├─────────────────────────────────────────────────────────┤
│ - keys: {[key: string]: boolean}                        │
│ - weapons: string[]                                     │
│ - lastShootTime: number                                 │
│ - shootInterval: number                                 │
│ - game: Game                                            │
│ - velocityX: number                                     │
│ - velocityY: number                                     │
├─────────────────────────────────────────────────────────┤
│ + constructor(x: number, y: number, game: Game)         │
│ + update(deltaTime: number): void                       │
│ + handleInput(): void                                   │
│ + move(deltaTime: number): void                         │
│ + shoot(currentTime: number): void                      │
│ + addWeapon(weaponType: string): void                   │
│ - setupInputListeners(): void                           │
│ - findNearestEnemy(): Enemy | null                      │
└─────────────────────────────────────────────────────────┘
```

**Responsibilities:**
- Player movement (WASD/Arrow keys)
- Auto-shooting mechanics
- Weapon management
- Input handling

---

## 4. Enemy Class (extends Entity)

```
┌─────────────────────────────────────────────────────────┐
│                    Enemy extends Entity                 │
├─────────────────────────────────────────────────────────┤
│ - player: Player                                        │
│ - damage: number                                        │
│ - scoreValue: number                                    │
│ - velocityX: number                                     │
│ - velocityY: number                                     │
├─────────────────────────────────────────────────────────┤
│ + constructor(x: number, y: number, player: Player)     │
│ + update(deltaTime: number): void                       │
│ + moveTowardsPlayer(deltaTime: number): void            │
│ + getScoreValue(): number                               │
│ + getDamage(): number                                   │
└─────────────────────────────────────────────────────────┘
```

**Responsibilities:**
- AI behavior (chase player)
- Move towards player
- Damage dealing
- Score value on death

---

## 5. Projectile Class

```
┌─────────────────────────────────────────────────────────┐
│                       Projectile                        │
├─────────────────────────────────────────────────────────┤
│ - x: number                                             │
│ - y: number                                             │
│ - width: number                                         │
│ - height: number                                        │
│ - velocityX: number                                     │
│ - velocityY: number                                     │
│ - damage: number                                        │
│ - speed: number                                         │
│ - type: string                                          │
│ - sprite: HTMLImageElement                              │
│ - spriteLoaded: boolean                                 │
│ - active: boolean                                       │
│ - maxDistance: number                                   │
│ - traveledDistance: number                              │
├─────────────────────────────────────────────────────────┤
│ + constructor(x: number, y: number, targetX: number,    │
│              targetY: number, type: string)             │
│ + update(deltaTime: number): void                       │
│ + render(ctx: CanvasRenderingContext2D,                 │
│          cameraX: number, cameraY: number): void        │
│ + isActive(): boolean                                   │
│ + deactivate(): void                                    │
│ + getDamage(): number                                   │
│ + getBounds(): {x: number, y: number,                   │
│                 width: number, height: number}          │
│ - loadSprite(type: string): void                        │
└─────────────────────────────────────────────────────────┘
```

**Responsibilities:**
- Projectile movement
- Different weapon types (thunder, magic)
- Collision boundaries
- Auto-deactivate after distance

---

## 6. Background Class

```
┌─────────────────────────────────────────────────────────┐
│                       Background                        │
├─────────────────────────────────────────────────────────┤
│ - image: HTMLImageElement                               │
│ - imageLoaded: boolean                                  │
│ - width: number                                         │
│ - height: number                                        │
├─────────────────────────────────────────────────────────┤
│ + constructor(imagePath: string)                        │
│ + render(ctx: CanvasRenderingContext2D,                 │
│          cameraX: number, cameraY: number,              │
│          canvasWidth: number, canvasHeight: number):    │
│          void                                           │
│ + isLoaded(): boolean                                   │
└─────────────────────────────────────────────────────────┘
```

**Responsibilities:**
- Infinite scrolling background
- Tiled rendering based on camera position
- Background image loading

---

## Class Relationships

```
                    ┌─────────────┐
                    │    Game     │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┬─────────────┐
           │               │               │             │
           ▼               ▼               ▼             ▼
    ┌────────────┐  ┌────────────┐ ┌──────────────┐ ┌────────────┐
    │   Player   │  │  Enemy[]   │ │ Projectile[] │ │ Background │
    └────────────┘  └────────────┘ └──────────────┘ └────────────┘
           │               │
           └───────┬───────┘
                   │
                   ▼
            ┌────────────┐
            │   Entity   │
            │  (abstract)│
            └────────────┘
```

### Relationship Types:

- **Inheritance (IS-A):**
  - Player **extends** Entity
  - Enemy **extends** Entity

- **Composition (HAS-A):**
  - Game **has one** Player
  - Game **has many** Enemies
  - Game **has many** Projectiles
  - Game **has one** Background

- **Association:**
  - Player **creates** Projectiles
  - Enemy **follows** Player
  - Projectile **targets** Enemy

---

## Game Flow

```
1. Game.init()
   └─> Creates Player, Background, initializes arrays

2. Game.start()
   └─> Starts game loop (requestAnimationFrame)

3. Game.gameLoop(timestamp)
   ├─> Calculate deltaTime
   ├─> Game.update(deltaTime)
   │   ├─> Player.update()
   │   │   ├─> handleInput()
   │   │   ├─> move()
   │   │   └─> shoot() → creates Projectiles
   │   ├─> Enemy.update() for each enemy
   │   │   └─> moveTowardsPlayer()
   │   ├─> Projectile.update() for each projectile
   │   ├─> spawnEnemy() (time-based)
   │   └─> checkCollisions()
   ├─> Game.render()
   │   ├─> Background.render()
   │   ├─> Player.render()
   │   ├─> Enemy.render() for each
   │   └─> Projectile.render() for each
   └─> requestAnimationFrame(gameLoop)
```

---

## Design Patterns Used

1. **Inheritance**: Entity as base class for Player and Enemy
2. **Composition**: Game class contains all game objects
3. **Encapsulation**: Private/protected members with public interfaces
4. **Polymorphism**: Entity.update() overridden in subclasses
5. **Single Responsibility**: Each class has one main purpose

---

## Sprite Mapping

| Class | Sprite Files Used |
|-------|------------------|
| Player | `Idle.png`, `Run.png`, `Attack1.png`, `Take hit.png` |
| Enemy | `Death.png` (reused as enemy sprite) |
| Projectile (Thunder) | `Thunder Projectile 1/Thunder projectile1 wo blur.png` |
| Projectile (Magic) | `Projectile 2/Projectile 2 wo blur.png` |
| Background | `background.jpg` (tiled infinitely) |

---
