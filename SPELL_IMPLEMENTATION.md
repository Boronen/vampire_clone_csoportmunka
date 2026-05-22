# Complete Spell System Implementation

## Spell Categories & Rendering Order

### Rendering Priority (Bottom to Top - Z-Index)
1. **Background Layer** - Background image
2. **Area Aura Effects** (Always active around player)
3. **Static AOE Zones** (Placed on enemies, linger)
4. **Orbital Effects** (Rotate around player)
5. **Projectiles** (Flying towards enemies)
6. **Enemies**
7. **Player**
8. **Shields** (When active)
9. **Sky Fall Effects** (Falling from above)
10. **DOT Visual Indicators** (On affected enemies)
11. **⭐ HIT EFFECTS (ALWAYS ON TOP)** - Visual feedback on damage

---

## 1. 🎯 Projectile Spells (True Projectiles)
Fire towards nearest enemy, travel in straight line or homing.

| ID | Name | Sprite | Behavior |
|----|------|--------|----------|
| `magicSpell` | Arcane Missiles | 1_magicspell | Homing magic projectiles |
| `magic8` | Magic Bolts | 2_magic8 | Fast piercing bolts |
| `bluefire` | Blue Flames | 3_bluefire | Blue fire projectiles |
| `flameLash` | Flame Lash | 6_flamelash | Whip-like flames |
| `brightFire` | Brilliant Flames | 9_brightfire | Intense fire |
| `fireSpell` | Fire Bolts | 11_fire | Standard fire |
| `sunburn` | Solar Beam | 16_sunburn | Burning solar energy |
| `felSpell` | Fel Corruption | 17_felspell | Dark corrupting magic |
| `chainLightning` | Chain Lightning | chain-light | Bounces between enemies |
| `iceSpike` | Ice Spike | ice-spike | Piercing ice shards |
| `randomLightning` | Random Lightning | random-lightning | Strikes random enemies |

---

## 2. 🌀 Static AOE Spells (Place on Enemy Location)
Spawn at enemy position, remain as damage zone until animation completes.

| ID | Name | Sprite | Duration | Behavior |
|----|------|--------|----------|----------|
| `nebula` | Nebula Field | 12_nebula | Animation length | Cosmic void zone |
| `phantom` | Phantom Zone | 14_phantom | Animation length | Ghostly damage area |
| `midnight` | Midnight Curse | 18_midnight | Animation length | Dark shadow zone |
| `magicBubbles` | Magic Bubble Field | 20_magicbubbles | Animation length | Bubble damage area |
| `blackHole` | Black Hole | black-hole-remain-5sec | 5 seconds | Gravity well |
| `darkMatter` | Dark Matter Zone | dark-matter | 10 seconds | Heavy DOT zone |

**New Class Required:** `StaticAOESpell extends Spell`

---

## 3. ☄️ Sky Fall Spells (Fall from Above)
Meteors and fire that fall from sky onto enemy location.

| ID | Name | Sprite | Behavior |
|----|------|--------|----------|
| `magickaHit` | Magicka Meteor | 5_magickahit | Meteor falls on enemy |
| `fireFromSky` | Fire from Sky | 11_fire | Fire falls down |
| `brightFireSky` | Bright Fire Sky | 9_brightfire | Intense fire from above |
| `meteor` | Meteor Strike | meteor | Large meteor |
| `meteorJam` | Meteor Barrage | meteor-jam | Multiple meteors |

**New Class Required:** `SkyFallSpell extends Spell`

---

## 4. 💥 Hit Effects (Always Render On Top)
Passive visual enhancements that trigger on damage. **Highest Z-Index!**

| ID | Name | Sprite | Trigger |
|----|------|--------|---------|
| `magicSpellHit` | Magic Hit | 1_magicspell | On any spell hit |
| `castingHit` | Casting Hit | 4_casting | On cast |
| `flameLashHit` | Flame Lash Hit | 6_flamelash | On fire damage |
| `weaponHitEffect` | Weapon Hit | 10_weaponhit | On physical hit |
| `critHit` | Critical Hit | crit-hit | On critical |
| `pumpkinHit` | Pumpkin Hit | pumpkin-hit | On pumpkin damage |
| `ultimateHit` | Ultimate Hit | ultimate-hit | On ultimate |
| `smashHitEffect` | Smash Hit | smash-hit | On smash |
| `basicHit` | Basic Hit | basic-hit | Default hit |

**Rendering:** These render LAST in the render loop for maximum visibility.

---

## 5. 🔄 DOT Effects (Damage Over Time)
Apply debuff that ticks damage every second.

| ID | Name | Sprite | Duration | Effect |
|----|------|--------|----------|--------|
| `magic8DOT` | Magic 8 DOT | 2_magic8 | 8 seconds | Magic damage over time |
| `freezingDOT` | Frost DOT | 19_freezing | 5 seconds | Ice damage + slow |
| `iceVFX` | Ice Effect | IceVFX | 4 seconds | Ice DOT |

---

## 6. 🌀 Orbital Spells (Rotate Around Player)
Objects that orbit the player, damaging enemies on contact.

| ID | Name | Sprite | Count | Speed |
|----|------|--------|-------|-------|
| `fireSpin` | Fire Spin | 7_firespin | 2 | 3 |
| `fireOrbital` | Fire Orbital | fire-orbital | 3 | 4 |
| `effectAnima` | Anima Souls | Effect_Anima | 4 | 3.5 |
| `effectWheel` | Spinning Wheel | Effect_Wheel | 2 | 5 |
| `effectWorm` | Circling Worm | Effect_Worm | 1 | 2.5 |

---

## 7. 🛡️ Shield Spells (Active Defense)
Visible only when active, absorb damage.

| ID | Name | Sprite | Shield HP | Reflect |
|----|------|--------|-----------|---------|
| `protectionCircle` | Protection Circle | 8_protectioncircle | 200 | No |
| `electricShield` | Electric Shield | Effect_ElectricShield | 150 | 60% |
| `lightningShield` | Lightning Shield | lightning-shield | 120 | 50% |
| `pumpkinShield` | Pumpkin Shield | pumpkin-shield | 100 | No |

---

## 8. 🔴 Area Aura Spells (Constant Damage Field)
Always active around player, constant damage to nearby enemies.

| ID | Name | Sprite | Radius | Behavior |
|----|------|--------|--------|----------|
| `garlic` | Garlic | garlic | 110 | Close-range aura |
| `vortex` | Vortex | 13_vortex | 150 | Swirling energy |
| `effectTheVortex` | The Vortex | Effect_TheVortex | 180 | Massive vortex |
| `effectTentacles` | Tentacles | Effect_Tentacles | 140 | Grabbing tentacles |
| `waveEffect` | Shock Wave | wave-effect | 180 | Expanding wave |
| `whirlpoolFire` | Whirlpool Fire | whirlpool-fire | 140 | Spinning fire |

---

## 9. ⚡ Ultimate Abilities (Keyboard 1-5)
Powerful abilities activated with number keys.

| Key | ID | Name | Sprite | Effect |
|-----|----|------|--------|--------|
| 1 | `powerChords` | Power Chords | Effect_PowerChords | Screen-wide sound wave |
| 2 | `pumpkinUltimate` | Pumpkin Devastation | pumpkin-sprite-sheet-ultimate | Explosive burst |
| 3 | `kabooms` | Kabooms | Effect_Kabooms | Multiple explosions |
| 4 | `hyperspeed` | Hyperspeed | Effect_Hyperspeed | Speed boost + invulnerability |
| 5 | `impactUltimate` | Impact | Effect_Impact | Massive slam |

---

## 10. 💨 Special Abilities

### Dash Ability (Space)
| ID | Name | Sprite | Effect |
|----|------|--------|--------|
| `darkDash` | Shadow Dash | dark-effect-dash | Invulnerable dash |

### Life Steal
| ID | Name | Sprite | Effect |
|----|------|--------|--------|
| `vampire` | Vampire Powers | vampire | Life steal on hit |
| `vampireExplosion` | Vampire Explosion | vampire-explosion | AOE life steal |

### Melee Attacks
| ID | Name | Sprite | Range | Knockback |
|----|------|--------|-------|----------|
| `hammerSmash` | Hammer Smash | hammer-smash | 120 | 250 |
| `lightningSmash` | Lightning Smash | lightning-smash | 110 | 200 |
| `pumpkinSmash` | Pumpkin Smash | pumpkin-smash | 100 | 180 |
| `smashHit` | Smash Hit | smash-hit | 95 | 150 |
| `weaponHit` | Weapon Strike | 10_weaponhit | 90 | 120 |

### Explosions
| ID | Name | Sprite | Radius |
|----|------|--------|--------|
| `pumpkinExplosion` | Pumpkin Explosion | pumpkin-explosion | 150 |
| `soulExplosion` | Soul Explosion | soul-explosion | 145 |

---

## Stat Upgrades (Fallback when no spells available)

When all spells are acquired/maxed:

1. **More Projectiles** - +1 projectile per shot
2. **Movement Speed** - +10% movement speed
3. **Max Health** - +20 max HP (heal to full)
4. **Damage Boost** - +10 damage to all attacks

---

## Rendering System Implementation

```javascript
// In Game.js render method
render() {
    // 1. Background
    this.background.render(...);
    
    // 2. Area Auras (garlic, vortex)
    this.renderAreaAuras(...);
    
    // 3. Static AOE zones (nebula, phantom)
    this.renderStaticAOE(...);
    
    // 4. Orbitals (firespin, wheel)
    this.renderOrbitals(...);
    
    // 5. Projectiles
    this.renderProjectiles(...);
    
    // 6. Enemies
    this.renderEnemies(...);
    
    // 7. Player
    this.player.render(...);
    
    // 8. Shields (when active)
    this.renderShields(...);
    
    // 9. Sky Fall effects
    this.renderSkyFalls(...);
    
    // 10. DOT indicators
    this.renderDOTs(...);
    
    // 11. HIT EFFECTS (ALWAYS ON TOP!)
    this.renderHitEffects(...);
    
    // 12. UI
    this.renderUI();
}
```

---

## Total Spell Count: 55+

- Projectiles: 11
- Static AOE: 6
- Sky Fall: 5
- Hit Effects: 9
- DOT Effects: 3
- Orbitals: 5
- Shields: 4
- Area Auras: 6
- Ultimates: 5
- Special: 10+

**Grand Total: ~64 unique spell effects!**
