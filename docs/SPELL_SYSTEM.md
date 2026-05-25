# 🔮 Vampire Survivors Clone - Spell System Documentation

## Overview
A comprehensive spell system with **~50 unique spells** featuring 5 different spell types, upgrade mechanics, and powerful spell combinations.

---

## 🎮 Controls

| Action | Key |
|--------|-----|
| **Move** | WASD or Arrow Keys |
| **Auto-Attack** | Automatic (targets nearest enemy) |
| **Ultimate Ability** | E |
| **Dash** | Space Bar |
| **Debug Mode** | U (toggle hitboxes) |
| **Instant Level Up** | L (debug) |

---

## 📚 Spell Types

### 1. **Projectile Spells** (17 spells)
Fire projectiles that travel toward enemies
- **Features**: Homing, piercing, chaining, slow effects
- **Examples**: Arcane Missiles, Blue Flames, Chain Lightning, Ice Spike

### 2. **Orbital Spells** (2+ spells)
Orbs that rotate around the player, damaging on contact
- **Features**: Continuous damage, adjustable orbit radius/speed
- **Examples**: Fire Spin, Fire Orbital

### 3. **AOE Spells** (8 spells)
Area-of-effect damage zones
- **Features**: Stationary or following, damage over time
- **Examples**: Protection Circle, Garlic, Black Hole, Vortex

### 4. **Shield Spells** (3 spells)
Defensive barriers that absorb damage
- **Features**: Regeneration, damage reflection
- **Examples**: Electric Shield, Lightning Shield, Pumpkin Shield

### 5. **Melee Spells** (5 spells)
Close-range attacks with knockback
- **Features**: Arc-based damage, knockback force
- **Examples**: Hammer Smash, Pumpkin Smash, Weapon Strike

---

## ⚡ Special Abilities

### Ultimates (2 available)
Powerful button-activated abilities with long cooldowns

| Spell | Description | Cooldown |
|-------|-------------|----------|
| **Power Chords** | Massive sound wave hits all on-screen enemies | 10s |
| **Pumpkin Devastation** | Quick burst of explosive pumpkin power | 8s |

### Active Ability (1 available)
| Spell | Description | Cooldown |
|-------|-------------|----------|
| **Shadow Dash** | Quick invulnerable dash through enemies | 3s |

---

## 🔄 Upgrade System

### How Upgrades Work
1. **Level up** by gaining XP from defeated enemies
2. Choose from **3 random options**:
   - ✅ **New Spell** (Green) - Learn a brand new spell
   - ⬆️ **Upgrade Spell** (Orange) - Enhance an existing spell to Level 2 or 3

### Upgrade Progression
- **Level 1** → **Level 2**: +20% to all stats
- **Level 2** → **Level 3**: +20% to all stats (40% total)
- **Max Level**: 3 per spell

### Visual Upgrades
Some spells have special **upgrade sprites** that activate at higher levels:
- Pumpkin Shield → Enhanced visual effect
- Pumpkin Smash → Upgraded animation

---

## 🌟 Spell Combinations

When **two specific spells** reach **Level 3**, they can **combine** into a more powerful evolved spell!

### Available Combinations

| Spell 1 | Spell 2 | Combined Result |
|---------|---------|-----------------|
| Arcane Missiles | Blue Flames | **Arcane Flame** |
| Fire Bolts | Frost Shards | **Thermal Shock** |
| Chain Lightning | Electric/Lightning Shield | **Storm Barrier** |
| Pumpkin Shield | Pumpkin Smash | **Pumpkin Mastery** |
| Meteor Strike | Hammer Smash | **Meteor Slam** |

### Combination Benefits
- **Higher damage** than individual spells
- **Enhanced effects** (piercing, homing, etc.)
- **New visual effects**
- **Unique mechanics**

---

## 📖 Complete Spell List

### Projectile Spells
1. **Arcane Missiles** - Homing magic projectiles
2. **Magic Bolts** - Fast piercing magic bolts
3. **Blue Flames** - Intense blue fire projectiles
4. **Flame Lash** - Whip-like flames
5. **Brilliant Flames** - Intense fire projectiles
6. **Fire Bolts** - Standard fire projectiles
7. **Nebula Blast** - Cosmic void energy
8. **Phantom Strike** - Ghostly piercing projectiles
9. **Solar Beam** - Burning solar energy
10. **Fel Corruption** - Dark magic with slow effect
11. **Midnight Curse** - Dark shadow projectiles
12. **Frost Shards** - Ice projectiles that slow enemies
13. **Magic Bubbles** - Floating bubble attacks
14. **Chain Lightning** - Lightning that chains between enemies
15. **Ice Spike** - Piercing ice shards with slow
16. **Meteor Strike** - Meteors fall from the sky
17. **Random Lightning** - Lightning strikes random enemies

### Orbital Spells
1. **Fire Spin** - Spinning fire orbs around player
2. **Fire Orbital** - Orbiting flames

### AOE Spells
1. **Protection Circle** - Protective aura around player
2. **Garlic** - Close-range damage field
3. **Vortex** - Swirling energy vortex
4. **Whirlpool Fire** - Spinning fire vortex
5. **Shock Wave** - Expanding wave of energy
6. **Black Hole** - Gravity well that damages over time
7. **Pumpkin Explosion** - Explosive pumpkin AOE
8. **Soul Explosion** - Burst of soul energy

### Shield Spells
1. **Electric Shield** - Energy shield with damage reflection
2. **Lightning Shield** - Electric barrier
3. **Pumpkin Shield** - Protective pumpkin barrier

### Melee Spells
1. **Hammer Smash** - Powerful ground pound
2. **Lightning Smash** - Thunder strike attack
3. **Pumpkin Smash** - Smashing pumpkin attack
4. **Smash Hit** - Quick smash attack
5. **Weapon Strike** - Fast weapon attacks

### Evolved/Combined Spells
1. **Arcane Flame** - Fusion of magic and fire
2. **Thermal Shock** - Alternating fire and ice
3. **Storm Barrier** - Lightning orbits with electric shield
4. **Pumpkin Mastery** - Ultimate pumpkin power
5. **Meteor Slam** - Meteors on every melee hit

---

## 🎨 Visual System

### Sprite Integration
- All spells use **converted 1-row sprite sheets**
- **Frame-based animation** with customizable FPS
- **Sprite fallbacks** with colored shapes if sprites fail to load
- **Dynamic sizing** based on spell level

### Effects Rendering
- Spells render **on top of player**
- Multiple spell effects can stack
- Transparent overlays for visual clarity
- Camera-relative positioning

---

## 🏗️ Technical Architecture

### Core Classes
```
Spell (Base Class)
├── ProjectileSpell
├── AOESpell
├── OrbitalSpell
├── ShieldSpell
└── MeleeSpell

SpellManager
└── Manages all player spells

SpellData.js
└── Configuration for all 50+ spells
```

### Key Features
- **Modular design**: Easy to add new spells
- **Data-driven**: All spell properties in `SpellData.js`
- **No artificial limits**: Collect as many spells as you want!
- **Equal rarity**: All spells have equal chance to appear
- **Smart targeting**: Auto-targets nearest enemies
- **Collision detection**: Integrated with game physics

---

## 🚀 Getting Started

1. **Open** `index.html` in a browser
2. **Level up** by defeating enemies (Press L for instant level up)
3. **Choose spells** from the upgrade menu (1, 2, or 3 keys)
4. **Upgrade existing spells** to Level 3
5. **Combine spells** when both reach Level 3
6. **Press E** to use your ultimate ability
7. **Press Space** to dash through enemies

---

## 🐛 Debug Features

- **Press U**: Toggle hitbox visualization
- **Press L**: Instant level up (gain XP to level up immediately)
- **Console logs**: Track spell additions, upgrades, and combinations

---

## 📝 Adding New Spells

To add a new spell, edit `SpellData.js`:

```javascript
newSpell: {
    id: 'newSpell',
    name: 'My New Spell',
    description: 'Does amazing things',
    type: 'passive', // or 'ultimate', 'active'
    spellClass: 'projectile', // or 'aoe', 'orbital', 'shield', 'melee'
    sprite: 'Sprites/new-spell-12.png',
    frameCount: 12,
    width: 50,
    height: 50,
    damage: 30,
    cooldown: 1500,
    // Add type-specific properties here
    // For combinations:
    combinesWith: ['otherspell'],
    combinedResult: 'combinedSpell'
}
```

---

## 🎯 Game Balance

### Passive Spells
- Auto-cast on cooldown
- No player input required
- Scale with upgrades

### Cooldowns
- **Fast**: 1-2 seconds (basic attacks)
- **Medium**: 2-4 seconds (special abilities)
- **Slow**: 5-8 seconds (shields)
- **Ultimate**: 8-10 seconds (ultimates)

### Damage Scaling
- Base damage defined per spell
- +20% per upgrade level
- Combined spells have 2-3x base damage

---

## 🏆 Tips & Strategies

1. **Balance your build**: Mix projectile, AOE, and defensive spells
2. **Prioritize upgrades**: Level 3 spells are much more powerful
3. **Plan combinations**: Work toward specific spell pairs
4. **Use positioning**: Orbital and AOE spells benefit from good positioning
5. **Ultimate timing**: Save ultimates for dangerous situations
6. **Dash defensively**: Use dash to escape crowds

---

## 📄 Files Structure

```
vampire_clone_csoportmunka/
├── Spell.js                    # Base spell class
├── SpellTypes/
│   ├── ProjectileSpell.js     # Projectile spell logic
│   ├── AOESpell.js            # AOE spell logic
│   ├── OrbitalSpell.js        # Orbital spell logic
│   ├── ShieldSpell.js         # Shield spell logic
│   └── MeleeSpell.js          # Melee spell logic
├── SpellData.js               # All spell configurations
├── SpellManager.js            # Spell collection manager
├── Player.js                  # Player with spell integration
├── Game.js                    # Game with spell menu
└── index.html                 # HTML with all scripts loaded
```

---

## ✨ Future Enhancements (Optional)

- More spell combinations
- Spell synergies (bonus effects when used together)
- Spell-specific stats (crit chance, lifesteal, etc.)
- Prestige system for completed spell builds
- Spell achievements
- Custom spell loadouts

---

**Enjoy the spell system!** 🎮✨
