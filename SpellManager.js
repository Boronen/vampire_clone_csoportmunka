// ============================================
// SpellManager Class - Manages player's spell collection
// ============================================
class SpellManager {
    constructor(player) {
        this.player = player;
        this.game = player.game;
        this.activeSpells = []; // Spells the player currently has
        this.ultimateSpell = null; // Currently equipped ultimate
        this.dashSpell = null; // Dash ability
        
        // Track which spells have been seen for upgrade options
        this.discoveredSpells = new Set();
    }
    
    addSpell(spellId) {
        // Check if player already has this spell
        const existing = this.activeSpells.find(s => s.id === spellId);
        if (existing) {
            // Upgrade instead
            return this.upgradeSpell(spellId);
        }
        
        // Get spell data
        const spellData = SPELL_DATA[spellId];
        if (!spellData) {
            console.error(`Spell ${spellId} not found in SPELL_DATA`);
            return false;
        }
        
        // Create spell instance based on type
        let spell;
        switch (spellData.spellClass) {
            case 'projectile':
                spell = new ProjectileSpell(spellData, this.player);
                break;
            case 'aoe':
                spell = new AOESpell(spellData, this.player);
                break;
            case 'staticaoe':
                spell = new StaticAOESpell(spellData, this.player);
                break;
            case 'skyfall':
                spell = new SkyFallSpell(spellData, this.player);
                break;
            case 'orbital':
                spell = new OrbitalSpell(spellData, this.player);
                break;
            case 'shield':
                spell = new ShieldSpell(spellData, this.player);
                break;
            case 'melee':
                spell = new MeleeSpell(spellData, this.player);
                break;
            default:
                spell = new Spell(spellData, this.player);
        }
        
        // Add to appropriate collection
        if (spellData.type === 'ultimate') {
            this.ultimateSpell = spell;
        } else if (spellData.type === 'active' && spellData.id.includes('dash')) {
            this.dashSpell = spell;
        } else {
            this.activeSpells.push(spell);
        }
        
        this.discoveredSpells.add(spellId);
        console.log(`Added spell: ${spell.name} (Level ${spell.level})`);
        
        return true;
    }
    
    upgradeSpell(spellId) {
        // Find spell
        let spell = this.activeSpells.find(s => s.id === spellId);
        if (!spell && this.ultimateSpell && this.ultimateSpell.id === spellId) {
            spell = this.ultimateSpell;
        }
        if (!spell && this.dashSpell && this.dashSpell.id === spellId) {
            spell = this.dashSpell;
        }
        
        if (!spell) {
            console.error(`Spell ${spellId} not found in active spells`);
            return false;
        }
        
        const success = spell.upgrade();
        if (success) {
            console.log(`Upgraded ${spell.name} to Level ${spell.level}`);
            
            // Check for spell combinations after upgrade
            if (spell.level === 3) {
                this.checkCombinations(spell);
            }
        }
        
        return success;
    }
    
    checkCombinations(spell) {
        // Check if this spell can combine with others
        if (!spell.combinesWith || spell.combinesWith.length === 0) return;
        
        for (const otherSpellId of spell.combinesWith) {
            const otherSpell = this.activeSpells.find(s => s.id === otherSpellId);
            
            if (otherSpell && otherSpell.level === 3) {
                // Both spells at max level - can combine!
                console.log(`🌟 Spell Combination Available: ${spell.name} + ${otherSpell.name}!`);
                
                // Show combination notification (implement in Game.js)
                if (this.game.showCombinationNotification) {
                    this.game.showCombinationNotification(spell, otherSpell);
                }
            }
        }
    }
    
    combineSpells(spellId1, spellId2) {
        const spell1 = this.activeSpells.find(s => s.id === spellId1);
        const spell2 = this.activeSpells.find(s => s.id === spellId2);
        
        if (!spell1 || !spell2) return false;
        if (spell1.level !== 3 || spell2.level !== 3) return false;
        
        // Get combined spell ID
        const combinedId = spell1.combinedResult || spell2.combinedResult;
        if (!combinedId) return false;
        
        // Remove the two original spells
        this.activeSpells = this.activeSpells.filter(s => s.id !== spellId1 && s.id !== spellId2);
        
        // Add the combined spell
        this.addSpell(combinedId);
        
        console.log(`✨ Combined ${spell1.name} + ${spell2.name} into ${combinedId}!`);
        return true;
    }
    
    update(deltaTime) {
        const currentTime = Date.now();
        
        // Update all passive spells
        for (const spell of this.activeSpells) {
            spell.update(deltaTime);
            
            // Auto-cast ONLY passive spells (not ultimates or active abilities)
            if (spell.type === 'passive' && spell.canCast(currentTime)) {
                spell.cast(currentTime);
            }
        }
        
        // Update ultimate (but don't auto-cast - only cast on key press)
        if (this.ultimateSpell) {
            this.ultimateSpell.update(deltaTime);
        }
        
        // Update dash (don't auto-cast)
        if (this.dashSpell) {
            this.dashSpell.update(deltaTime);
        }
    }
    
    render(ctx, cameraX, cameraY) {
        // Render all active spells
        for (const spell of this.activeSpells) {
            spell.render(ctx, cameraX, cameraY);
        }
        
        if (this.ultimateSpell) {
            this.ultimateSpell.render(ctx, cameraX, cameraY);
        }
        
        if (this.dashSpell) {
            this.dashSpell.render(ctx, cameraX, cameraY);
        }
    }
    
    castUltimate() {
        if (!this.ultimateSpell) return false;
        
        const currentTime = Date.now();
        if (this.ultimateSpell.canCast(currentTime)) {
            this.ultimateSpell.cast(currentTime);
            console.log(`Cast ultimate: ${this.ultimateSpell.name}`);
            return true;
        }
        return false;
    }
    
    castDash() {
        if (!this.dashSpell) return false;
        
        const currentTime = Date.now();
        if (this.dashSpell.canCast(currentTime)) {
            this.dashSpell.cast(currentTime);
            return true;
        }
        return false;
    }
    
    getUpgradeOptions(count = 3) {
        const options = [];
        const allSpellIds = Object.keys(SPELL_DATA);
        
        // Get spells that can be upgraded
        for (const spell of this.activeSpells) {
            if (spell.level < spell.maxLevel) {
                options.push({
                    type: 'upgrade',
                    spellId: spell.id,
                    spell: spell,
                    display: `${spell.name} → Level ${spell.level + 1}`
                });
            }
        }
        
        // Add ultimate upgrade option if available
        if (this.ultimateSpell && this.ultimateSpell.level < this.ultimateSpell.maxLevel) {
            options.push({
                type: 'upgrade',
                spellId: this.ultimateSpell.id,
                spell: this.ultimateSpell,
                display: `${this.ultimateSpell.name} → Level ${this.ultimateSpell.level + 1}`
            });
        }
        
        // Add new spell options
        for (const spellId of allSpellIds) {
            if (!this.discoveredSpells.has(spellId)) {
                const spellData = SPELL_DATA[spellId];
                options.push({
                    type: 'new',
                    spellId: spellId,
                    spellData: spellData,
                    display: `NEW: ${spellData.name}`
                });
            }
        }
        
        // If no spell options available, add stat upgrades
        if (options.length === 0) {
            options.push(
                {
                    type: 'stat',
                    stat: 'projectiles',
                    display: 'More Projectiles',
                    description: '+1 projectile per shot'
                },
                {
                    type: 'stat',
                    stat: 'speed',
                    display: 'Movement Speed',
                    description: '+10% movement speed'
                },
                {
                    type: 'stat',
                    stat: 'maxHp',
                    display: 'Max Health',
                    description: '+20 max HP (heal to full)'
                },
                {
                    type: 'stat',
                    stat: 'damage',
                    display: 'Damage Boost',
                    description: '+10 damage to all attacks'
                }
            );
        }
        
        // Randomly select options
        const shuffled = options.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    
    applyUpgrade(option) {
        if (option.type === 'upgrade') {
            return this.upgradeSpell(option.spellId);
        } else if (option.type === 'new') {
            return this.addSpell(option.spellId);
        } else if (option.type === 'stat') {
            return this.applyStatUpgrade(option.stat);
        }
        return false;
    }
    
    applyStatUpgrade(stat) {
        switch(stat) {
            case 'projectiles':
                this.player.projectileCount++;
                console.log(`Projectile count increased to ${this.player.projectileCount}`);
                return true;
            case 'speed':
                this.player.speed *= 1.1;
                console.log(`Movement speed increased to ${this.player.speed.toFixed(1)}`);
                return true;
            case 'maxHp':
                this.player.maxHealth += 20;
                this.player.health = this.player.maxHealth; // Full heal
                console.log(`Max HP increased to ${this.player.maxHealth}`);
                return true;
            case 'damage':
                this.player.projectileDamage += 10;
                console.log(`Damage increased to ${this.player.projectileDamage}`);
                return true;
            default:
                return false;
        }
    }
    
    getSpellCount() {
        return this.activeSpells.length + (this.ultimateSpell ? 1 : 0) + (this.dashSpell ? 1 : 0);
    }
    
    hasSpell(spellId) {
        return this.discoveredSpells.has(spellId);
    }
    
    getActiveShields() {
        return this.activeSpells.filter(s => s instanceof ShieldSpell && s.isShieldActive());
    }
    
    getAllSpells() {
        const spells = [...this.activeSpells];
        if (this.ultimateSpell) spells.push(this.ultimateSpell);
        if (this.dashSpell) spells.push(this.dashSpell);
        return spells;
    }
}
