/* ============================================
   VOID SURGE - Upgrade Definitions
   ============================================ */

const UpgradeData = {
    // Weapon upgrades
    rapidFire: {
        id: 'rapidFire',
        name: 'Rapid Fire',
        description: 'Shoot 25% faster',
        type: 'weapon',
        rarity: 'common',
        maxLevel: 3,
        icon: '⚡',
        apply(player, level) {
            player.fireRate *= (1 - 0.25 * level);
        }
    },
    
    spreadShot: {
        id: 'spreadShot',
        name: 'Spread Shot',
        description: 'Shoot 2 extra projectiles',
        type: 'weapon',
        rarity: 'common',
        maxLevel: 2,
        icon: '✦',
        apply(player, level) {
            player.projectileCount = 1 + level * 2;
        }
    },
    
    piercingRounds: {
        id: 'piercingRounds',
        name: 'Piercing Rounds',
        description: 'Projectiles pierce enemies',
        type: 'weapon',
        rarity: 'rare',
        maxLevel: 1,
        icon: '⤉',
        apply(player) {
            player.piercing = true;
        }
    },
    
    // Stat upgrades
    speedBoost: {
        id: 'speedBoost',
        name: 'Speed Boost',
        description: 'Move 20% faster',
        type: 'stat',
        rarity: 'common',
        maxLevel: 3,
        icon: '💨',
        apply(player, level) {
            player.speed = player.baseSpeed * (1 + 0.2 * level);
        }
    },
    
    maxHP: {
        id: 'maxHP',
        name: 'Vitality',
        description: '+25 max HP',
        type: 'stat',
        rarity: 'common',
        maxLevel: 5,
        icon: '❤',
        apply(player, level) {
            player.maxHp = player.baseMaxHp + 25 * level;
            player.hp = Math.min(player.hp + 25 * level, player.maxHp);
        }
    },
    
    regen: {
        id: 'regen',
        name: 'Regeneration',
        description: 'Regen 1 HP/sec per level',
        type: 'stat',
        rarity: 'rare',
        maxLevel: 3,
        icon: '✦',
        apply(player, level) {
            player.regen = level;
        }
    },
    
    // Defensive
    shield: {
        id: 'shield',
        name: 'Energy Shield',
        description: 'Temporary shield on hit',
        type: 'defensive',
        rarity: 'rare',
        maxLevel: 3,
        icon: '🛡',
        apply(player, level) {
            player.shieldAmount = 10 * level;
        }
    },
    
    dashMastery: {
        id: 'dashMastery',
        name: 'Dash Mastery',
        description: 'Dash cooldown -30%',
        type: 'defensive',
        rarity: 'uncommon',
        maxLevel: 3,
        icon: '💫',
        apply(player, level) {
            player.dashCooldown *= (1 - 0.3 * level);
        }
    },
    
    // Special
    magnet: {
        id: 'magnet',
        name: 'Magnet',
        description: '+50% pickup range',
        type: 'special',
        rarity: 'common',
        maxLevel: 2,
        icon: '🧲',
        apply(player, level) {
            player.pickupRange = 100 * (1 + 0.5 * level);
        }
    },
    
    xpBoost: {
        id: 'xpBoost',
        name: 'XP Boost',
        description: '+30% XP gain',
        type: 'special',
        rarity: 'uncommon',
        maxLevel: 3,
        icon: '⭐',
        apply(player, level) {
            player.xpMultiplier = 1 + 0.3 * level;
        }
    },
    
    // Offensive
    damageUp: {
        id: 'damageUp',
        name: 'Damage Up',
        description: '+20% damage',
        type: 'weapon',
        rarity: 'common',
        maxLevel: 5,
        icon: '🔥',
        apply(player, level) {
            player.damage = player.baseDamage * (1 + 0.2 * level);
        }
    },
    
    critChance: {
        id: 'critChance',
        name: 'Critical Strike',
        description: '+10% crit chance',
        type: 'weapon',
        rarity: 'uncommon',
        maxLevel: 5,
        icon: '🎯',
        apply(player, level) {
            player.critChance = 0.1 * level;
            player.critMultiplier = 2 + 0.3 * level;
        }
    },
    
    // All upgrades list
    all: [
        'rapidFire', 'spreadShot', 'piercingRounds',
        'speedBoost', 'maxHP', 'regen',
        'shield', 'dashMastery',
        'magnet', 'xpBoost',
        'damageUp', 'critChance'
    ],
    
    /**
     * Get upgrade config by ID
     */
    get(id) {
        return this[id] || null;
    },
    
    /**
     * Get random upgrade options (3 choices)
     */
    getRandomChoices(count = 3, player = null) {
        const available = this.all.filter(id => {
            const upgrade = this.get(id);
            if (!player || !player.upgrades) return true;
            const currentLevel = player.upgrades[id] || 0;
            return currentLevel < upgrade.maxLevel;
        });
        
        // Shuffle and pick
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count).map(id => this.get(id));
    }
};