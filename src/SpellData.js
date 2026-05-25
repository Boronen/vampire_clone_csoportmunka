// ============================================
// Spell Data Configuration
// All spell definitions for the game
// ============================================

const SPELL_DATA = {
    // ========================================
    // ULTIMATE SPELLS (Button activated)
    // ========================================
    powerChords: {
        id: 'powerChords',
        name: 'Power Chords',
        description: 'Massive sound wave hits all on-screen enemies',
        type: 'ultimate',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/Effect_PowerChords_1_517x353-ultimate-92.png',
        frameCount: 92,
        width: 400,
        height: 400,
        damage: 200,
        cooldown: 15000,
        aoeRadius: 800,
        damageInterval: 100,
        duration: 2000,
        followPlayer: true
    },
    
    pumpkinUltimate: {
        id: 'pumpkinUltimate',
        name: 'Pumpkin Devastation',
        description: 'Quick burst of explosive pumpkin power',
        type: 'ultimate',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/pumpkin-sprite-sheet-ultimate-6.png',
        frameCount: 6,
        width: 150,
        height: 150,
        damage: 150,
        cooldown: 8000,
        aoeRadius: 300,
        damageInterval: 50,
        duration: 1000
    },
    
    // ========================================
    // ACTIVE ABILITY (Dash)
    // ========================================
    darkDash: {
        id: 'darkDash',
        name: 'Shadow Dash',
        description: 'Quick invulnerable dash through enemies',
        type: 'active',
        spellClass: 'melee',
        sprite: 'assets/Sprites/dark-effect-dash-12.png',
        frameCount: 12,
        width: 80,
        height: 80,
        damage: 30,
        cooldown: 3000,
        meleeRange: 150,
        attackArc: Math.PI * 2,
        knockbackForce: 100
    },
    
    // ========================================
    // PROJECTILE SPELLS
    // ========================================
    magicSpell: {
        id: 'magicSpell',
        name: 'Arcane Missiles',
        description: 'Homing magic projectiles',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/1_magicspell_spritesheet-73.png',
        frameCount: 73,
        width: 48,
        height: 48,
        damage: 25,
        cooldown: 1500,
        range: 500,
        speed: 350,
        projectileCount: 1,
        homing: true,
        combinesWith: ['bluefire'],
        combinedResult: 'arcaneFlame'
    },
    
    magic8: {
        id: 'magic8',
        name: 'Magic Bolts',
        description: 'Fast piercing magic bolts',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/2_magic8_spritesheet-61.png',
        frameCount: 61,
        width: 50,
        height: 50,
        damage: 30,
        cooldown: 1800,
        range: 450,
        speed: 400,
        projectileCount: 1,
        piercing: true
    },
    
    bluefire: {
        id: 'bluefire',
        name: 'Blue Flames',
        description: 'Intense blue fire projectiles',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/3_bluefire_spritesheet-61.png',
        frameCount: 61,
        width: 52,
        height: 52,
        damage: 35,
        cooldown: 1600,
        range: 400,
        speed: 320,
        projectileCount: 1,
        combinesWith: ['magicSpell'],
        combinedResult: 'arcaneFlame'
    },
    
    flameLash: {
        id: 'flameLash',
        name: 'Flame Lash',
        description: 'Whip-like flames',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/6_flamelash_spritesheet-39.png',
        frameCount: 39,
        width: 60,
        height: 60,
        damage: 28,
        cooldown: 1400,
        range: 350,
        speed: 380,
        projectileCount: 1
    },
    
    brightFire: {
        id: 'brightFire',
        name: 'Brilliant Flames',
        description: 'Intense fire projectiles',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/9_brightfire_spritesheet-61.png',
        frameCount: 61,
        width: 48,
        height: 48,
        damage: 32,
        cooldown: 1700,
        range: 420,
        speed: 340,
        projectileCount: 1
    },
    
    fireSpell: {
        id: 'fireSpell',
        name: 'Fire Bolts',
        description: 'Standard fire projectiles',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/11_fire_spritesheet-61.png',
        frameCount: 61,
        width: 46,
        height: 46,
        damage: 26,
        cooldown: 1500,
        range: 400,
        speed: 330,
        projectileCount: 1,
        combinesWith: ['freezing'],
        combinedResult: 'thermalShock'
    },
    
    nebula: {
        id: 'nebula',
        name: 'Nebula Blast',
        description: 'Cosmic void energy',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/12_nebula_spritesheet-61.png',
        frameCount: 61,
        width: 54,
        height: 54,
        damage: 38,
        cooldown: 2000,
        range: 480,
        speed: 310,
        projectileCount: 1
    },
    
    phantom: {
        id: 'phantom',
        name: 'Phantom Strike',
        description: 'Ghostly projectiles',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/14_phantom_spritesheet-61.png',
        frameCount: 61,
        width: 50,
        height: 50,
        damage: 30,
        cooldown: 1650,
        range: 450,
        speed: 360,
        projectileCount: 1,
        piercing: true
    },
    
    sunburn: {
        id: 'sunburn',
        name: 'Solar Beam',
        description: 'Burning solar energy',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/16_sunburn_spritesheet-61.png',
        frameCount: 61,
        width: 56,
        height: 56,
        damage: 42,
        cooldown: 2200,
        range: 520,
        speed: 340,
        projectileCount: 1
    },
    
    felSpell: {
        id: 'felSpell',
        name: 'Fel Corruption',
        description: 'Dark corrupting magic',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/17_felspell_spritesheet-91.png',
        frameCount: 91,
        width: 58,
        height: 58,
        damage: 40,
        cooldown: 1900,
        range: 470,
        speed: 320,
        projectileCount: 1,
        slow: 0.3
    },
    
    midnight: {
        id: 'midnight',
        name: 'Midnight Curse',
        description: 'Dark shadow projectiles',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/18_midnight_spritesheet-61.png',
        frameCount: 61,
        width: 52,
        height: 52,
        damage: 34,
        cooldown: 1750,
        range: 440,
        speed: 330,
        projectileCount: 1
    },
    
    freezing: {
        id: 'freezing',
        name: 'Frost Shards',
        description: 'Ice projectiles that slow enemies',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/19_freezing_spritesheet-86.png',
        frameCount: 86,
        width: 50,
        height: 50,
        damage: 28,
        cooldown: 1600,
        range: 420,
        speed: 340,
        projectileCount: 1,
        slow: 0.5,
        combinesWith: ['fireSpell'],
        combinedResult: 'thermalShock'
    },
    
    magicBubbles: {
        id: 'magicBubbles',
        name: 'Magic Bubbles',
        description: 'Floating bubble attacks',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/20_magicbubbles_spritesheet-61.png',
        frameCount: 61,
        width: 44,
        height: 44,
        damage: 22,
        cooldown: 1300,
        range: 380,
        speed: 280,
        projectileCount: 2
    },
    
    chainLightning: {
        id: 'chainLightning',
        name: 'Chain Lightning',
        description: 'Lightning that chains between enemies',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/chain-light-4.png',
        frameCount: 4,
        width: 40,
        height: 40,
        damage: 30,
        cooldown: 2000,
        range: 400,
        speed: 500,
        projectileCount: 1,
        chainCount: 3,
        combinesWith: ['lightningShield'],
        combinedResult: 'stormBarrier'
    },
    
    iceSpike: {
        id: 'iceSpike',
        name: 'Ice Spike',
        description: 'Piercing ice shards',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/ice-spike-11.png',
        frameCount: 11,
        width: 42,
        height: 42,
        damage: 35,
        cooldown: 1700,
        range: 450,
        speed: 400,
        projectileCount: 1,
        piercing: true,
        slow: 0.3
    },
    
    meteor: {
        id: 'meteor',
        name: 'Meteor Strike',
        description: 'Meteors fall from the sky',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/meteor-12.png',
        frameCount: 12,
        width: 60,
        height: 60,
        damage: 50,
        cooldown: 2500,
        range: 500,
        speed: 250,
        projectileCount: 1,
        combinesWith: ['hammerSmash'],
        combinedResult: 'meteorSlam'
    },
    
    randomLightning: {
        id: 'randomLightning',
        name: 'Random Lightning',
        description: 'Lightning strikes random enemies',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/random-lightning-9.png',
        frameCount: 9,
        width: 45,
        height: 45,
        damage: 38,
        cooldown: 1800,
        range: 600,
        speed: 600,
        projectileCount: 1
    },
    
    // ========================================
    // ORBITAL SPELLS
    // ========================================
    fireSpin: {
        id: 'fireSpin',
        name: 'Fire Spin',
        description: 'Spinning fire orbs around player',
        type: 'passive',
        spellClass: 'orbital',
        sprite: 'assets/Sprites/7_firespin_spritesheet-61.png',
        frameCount: 61,
        width: 50,
        height: 50,
        damage: 25,
        cooldown: 0,
        orbitRadius: 120,
        orbitSpeed: 3,
        projectileCount: 2,
        damageInterval: 200
    },
    
    fireOrbital: {
        id: 'fireOrbital',
        name: 'Fire Orbital',
        description: 'Orbiting flames',
        type: 'passive',
        spellClass: 'orbital',
        sprite: 'assets/Sprites/fire-orbital-9.png',
        frameCount: 9,
        width: 48,
        height: 48,
        damage: 22,
        cooldown: 0,
        orbitRadius: 100,
        orbitSpeed: 4,
        projectileCount: 3,
        damageInterval: 180
    },
    
    // ========================================
    // AOE SPELLS
    // ========================================
    protectionCircle: {
        id: 'protectionCircle',
        name: 'Protection Circle',
        description: 'Protective aura around player',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/8_protectioncircle_spritesheet-61.png',
        frameCount: 61,
        width: 80,
        height: 80,
        damage: 15,
        cooldown: 0,
        aoeRadius: 130,
        damageInterval: 400,
        duration: 999999,
        followPlayer: true
    },
    
    garlic: {
        id: 'garlic',
        name: 'Garlic',
        description: 'Close-range damage field',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/garlic-31.png',
        frameCount: 31,
        width: 70,
        height: 70,
        damage: 20,
        cooldown: 0,
        aoeRadius: 110,
        damageInterval: 300,
        duration: 999999,
        followPlayer: true
    },
    
    vortex: {
        id: 'vortex',
        name: 'Vortex',
        description: 'Swirling energy vortex',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/13_vortex_spritesheet-61.png',
        frameCount: 61,
        width: 100,
        height: 100,
        damage: 28,
        cooldown: 3000,
        aoeRadius: 150,
        damageInterval: 300,
        duration: 4000,
        followPlayer: false
    },
    
    whirlpoolFire: {
        id: 'whirlpoolFire',
        name: 'Whirlpool Fire',
        description: 'Spinning fire vortex',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/whirlpool-fire-12.png',
        frameCount: 12,
        width: 90,
        height: 90,
        damage: 32,
        cooldown: 2800,
        aoeRadius: 140,
        damageInterval: 250,
        duration: 3500,
        followPlayer: false
    },
    
    waveEffect: {
        id: 'waveEffect',
        name: 'Shock Wave',
        description: 'Expanding wave of energy',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/wave-effect-11.png',
        frameCount: 11,
        width: 120,
        height: 120,
        damage: 40,
        cooldown: 3500,
        aoeRadius: 180,
        damageInterval: 200,
        duration: 2000,
        followPlayer: false
    },
    
    blackHole: {
        id: 'blackHole',
        name: 'Black Hole',
        description: 'Gravity well that damages over time',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/black-hole-remain-5sec-5.png',
        frameCount: 5,
        width: 110,
        height: 110,
        damage: 35,
        cooldown: 8000,
        aoeRadius: 160,
        damageInterval: 400,
        duration: 5000,
        followPlayer: false
    },
    
    pumpkinExplosion: {
        id: 'pumpkinExplosion',
        name: 'Pumpkin Explosion',
        description: 'Explosive pumpkin AOE',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/pumpkin-explosion-27.png',
        frameCount: 27,
        width: 100,
        height: 100,
        damage: 45,
        cooldown: 3000,
        aoeRadius: 150,
        damageInterval: 150,
        duration: 1500,
        followPlayer: false
    },
    
    soulExplosion: {
        id: 'soulExplosion',
        name: 'Soul Explosion',
        description: 'Burst of soul energy',
        type: 'passive',
        spellClass: 'aoe',
        sprite: 'assets/Sprites/soul-explosion-9.png',
        frameCount: 9,
        width: 95,
        height: 95,
        damage: 42,
        cooldown: 3200,
        aoeRadius: 145,
        damageInterval: 180,
        duration: 1800,
        followPlayer: false
    },
    
    // ========================================
    // SHIELD SPELLS
    // ========================================
    electricShield: {
        id: 'electricShield',
        name: 'Electric Shield',
        description: 'Energy shield with damage reflection',
        type: 'passive',
        spellClass: 'shield',
        sprite: 'assets/Sprites/Effect_ElectricShield_1_265x265-63.png',
        frameCount: 63,
        width: 100,
        height: 100,
        damage: 20,
        cooldown: 5000,
        shieldHealth: 150,
        regenRate: 15,
        reflectDamage: true,
        reflectPercent: 0.6,
        combinesWith: ['chainLightning'],
        combinedResult: 'stormBarrier'
    },
    
    lightningShield: {
        id: 'lightningShield',
        name: 'Lightning Shield',
        description: 'Electric barrier',
        type: 'passive',
        spellClass: 'shield',
        sprite: 'assets/Sprites/lightning-shield-4.png',
        frameCount: 4,
        width: 90,
        height: 90,
        damage: 18,
        cooldown: 6000,
        shieldHealth: 120,
        regenRate: 12,
        reflectDamage: true,
        reflectPercent: 0.5,
        combinesWith: ['chainLightning'],
        combinedResult: 'stormBarrier'
    },
    
    pumpkinShield: {
        id: 'pumpkinShield',
        name: 'Pumpkin Shield',
        description: 'Protective pumpkin barrier',
        type: 'passive',
        spellClass: 'shield',
        sprite: 'assets/Sprites/pumpkin-shield-5.png',
        upgradeSprite: 'assets/Sprites/pumpkin-shield-upgrade-5.png',
        frameCount: 5,
        width: 85,
        height: 85,
        damage: 15,
        cooldown: 7000,
        shieldHealth: 100,
        regenRate: 10,
        reflectDamage: false,
        combinesWith: ['pumpkinSmash'],
        combinedResult: 'pumpkinMastery'
    },
    
    // ========================================
    // MELEE SPELLS
    // ========================================
    hammerSmash: {
        id: 'hammerSmash',
        name: 'Hammer Smash',
        description: 'Powerful ground pound',
        type: 'passive',
        spellClass: 'melee',
        sprite: 'assets/Sprites/hammer-smash-14.png',
        frameCount: 14,
        width: 100,
        height: 100,
        damage: 50,
        cooldown: 2500,
        meleeRange: 120,
        attackArc: Math.PI,
        knockbackForce: 250,
        combinesWith: ['meteor'],
        combinedResult: 'meteorSlam'
    },
    
    lightningSmash: {
        id: 'lightningSmash',
        name: 'Lightning Smash',
        description: 'Thunder strike attack',
        type: 'passive',
        spellClass: 'melee',
        sprite: 'assets/Sprites/lightning-smash-5.png',
        frameCount: 5,
        width: 95,
        height: 95,
        damage: 45,
        cooldown: 2200,
        meleeRange: 110,
        attackArc: Math.PI * 0.8,
        knockbackForce: 200
    },
    
    pumpkinSmash: {
        id: 'pumpkinSmash',
        name: 'Pumpkin Smash',
        description: 'Smashing pumpkin attack',
        type: 'passive',
        spellClass: 'melee',
        sprite: 'assets/Sprites/pumpkin-smash-8.png',
        upgradeSprite: 'assets/Sprites/pumpkin-smash-upgrade-9.png',
        frameCount: 8,
        width: 90,
        height: 90,
        damage: 40,
        cooldown: 2000,
        meleeRange: 100,
        attackArc: Math.PI * 0.75,
        knockbackForce: 180,
        combinesWith: ['pumpkinShield'],
        combinedResult: 'pumpkinMastery'
    },
    
    smashHit: {
        id: 'smashHit',
        name: 'Smash Hit',
        description: 'Quick smash attack',
        type: 'passive',
        spellClass: 'melee',
        sprite: 'assets/Sprites/smash-hit-8.png',
        frameCount: 8,
        width: 85,
        height: 85,
        damage: 35,
        cooldown: 1800,
        meleeRange: 95,
        attackArc: Math.PI * 0.7,
        knockbackForce: 150
    },
    
    weaponHit: {
        id: 'weaponHit',
        name: 'Weapon Strike',
        description: 'Fast weapon attacks',
        type: 'passive',
        spellClass: 'melee',
        sprite: 'assets/Sprites/10_weaponhit_spritesheet-29.png',
        frameCount: 29,
        width: 80,
        height: 80,
        damage: 30,
        cooldown: 1500,
        meleeRange: 90,
        attackArc: Math.PI * 0.6,
        knockbackForce: 120
    },
    
    // ========================================
    // COMBINED/EVOLVED SPELLS
    // ========================================
    arcaneFlame: {
        id: 'arcaneFlame',
        name: 'Arcane Flame',
        description: 'Fusion of magic and fire',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/9_brightfire_spritesheet-61.png',
        frameCount: 61,
        width: 70,
        height: 70,
        damage: 80,
        cooldown: 1200,
        range: 550,
        speed: 400,
        projectileCount: 2,
        homing: true,
        piercing: true
    },
    
    thermalShock: {
        id: 'thermalShock',
        name: 'Thermal Shock',
        description: 'Alternating fire and ice',
        type: 'passive',
        spellClass: 'projectile',
        sprite: 'assets/Sprites/19_freezing_spritesheet-86.png',
        frameCount: 86,
        width: 65,
        height: 65,
        damage: 75,
        cooldown: 1100,
        range: 520,
        speed: 380,
        projectileCount: 2,
        slow: 0.6
    },
    
    stormBarrier: {
        id: 'stormBarrier',
        name: 'Storm Barrier',
        description: 'Lightning orbits with electric shield',
        type: 'passive',
        spellClass: 'orbital',
        sprite: 'assets/Sprites/lightning-shield-4.png',
        frameCount: 4,
        width: 60,
        height: 60,
        damage: 50,
        cooldown: 0,
        orbitRadius: 140,
        orbitSpeed: 5,
        projectileCount: 4,
        damageInterval: 150,
        chainCount: 2
    },
    
    pumpkinMastery: {
        id: 'pumpkinMastery',
        name: 'Pumpkin Mastery',
        description: 'Ultimate pumpkin power',
        type: 'passive',
        spellClass: 'melee',
        sprite: 'assets/Sprites/pumpkin-smash-upgrade-9.png',
        frameCount: 9,
        width: 120,
        height: 120,
        damage: 100,
        cooldown: 1500,
        meleeRange: 150,
        attackArc: Math.PI * 1.5,
        knockbackForce: 350
    },
    
    meteorSlam: {
        id: 'meteorSlam',
        name: 'Meteor Slam',
        description: 'Meteors on every melee hit',
        type: 'passive',
        spellClass: 'melee',
        sprite: 'assets/Sprites/hammer-smash-14.png',
        frameCount: 14,
        width: 130,
        height: 130,
        damage: 90,
        cooldown: 1800,
        meleeRange: 140,
        attackArc: Math.PI * 1.2,
        knockbackForce: 300
    }
};

// Expose SPELL_DATA to window for testing
if (typeof window !== 'undefined') {
    window.SPELL_DATA = SPELL_DATA;
}
