/* ============================================
   VOID SURGE - Enemy Definitions
   ============================================ */

const EnemyData = {
    /**
     * Drone - Basic triangle, moves toward player
     * Color: cyan (0, 255, 255)
     */
    drone: {
        name: 'Drone',
        type: 'drone',
        hp: 1,
        speed: 80,
        size: 14,
        color: '0, 255, 255',
        damage: 10,
        scoreValue: 10,
        dropChance: 0.15,
        behavior: 'chase',
    },

    /**
     * Shielder - Hexagon, rotates around player, shoots
     * Color: green (0, 255, 100)
     */
    shielder: {
        name: 'Shielder',
        type: 'shielder',
        hp: 3,
        speed: 50,
        size: 18,
        color: '0, 255, 100',
        damage: 15,
        scoreValue: 25,
        dropChance: 0.25,
        behavior: 'orbit',
        orbitRadius: 150,
        shootInterval: 2.0,
    },

    /**
     * Spike - Star, fast and aggressive
     * Color: red (255, 50, 50)
     */
    spike: {
        name: 'Spike',
        type: 'spike',
        hp: 2,
        speed: 130,
        size: 12,
        color: '255, 50, 50',
        damage: 20,
        scoreValue: 20,
        dropChance: 0.2,
        behavior: 'rush',
        rushSpeed: 300,
        rushDuration: 0.4,
        rushCooldown: 2.0,
    },

    /**
     * Bulwark - Large hexagon, slow, high HP
     * Color: purple (180, 50, 255)
     */
    bulwark: {
        name: 'Bulwark',
        type: 'bulwark',
        hp: 8,
        speed: 35,
        size: 28,
        color: '180, 50, 255',
        damage: 25,
        scoreValue: 40,
        dropChance: 0.4,
        behavior: 'chase',
    },

    /**
     * Sniper - Diamond, stays at range, shoots lasers
     * Color: orange (255, 150, 0)
     */
    sniper: {
        name: 'Sniper',
        type: 'sniper',
        hp: 2,
        speed: 60,
        size: 16,
        color: '255, 150, 0',
        damage: 30,
        scoreValue: 30,
        dropChance: 0.3,
        behavior: 'snipe',
        preferredDistance: 250,
        shootInterval: 1.5,
    },

    /**
     * Swarm - Tiny triangle, moves in groups
     * Color: yellow (255, 255, 0)
     */
    swarm: {
        name: 'Swarm',
        type: 'swarm',
        hp: 1,
        speed: 100,
        size: 8,
        color: '255, 255, 0',
        damage: 8,
        scoreValue: 5,
        dropChance: 0.08,
        behavior: 'chase',
    },

    /**
     * Get enemy config by type
     */
    get(type) {
        return this[type] || this.drone;
    },

    /**
     * Get a random enemy type (weighted by difficulty)
     */
    random(wave) {
        const pool = ['drone', 'swarm', 'spike'];
        
        if (wave >= 3) pool.push('shielder');
        if (wave >= 5) pool.push('sniper');
        if (wave >= 8) pool.push('bulwark');
        
        // Weight swarm higher in later waves
        const weights = pool.map(type => {
            switch (type) {
                case 'swarm': return Math.min(3, 1 + wave * 0.2);
                case 'drone': return 3;
                case 'spike': return 2;
                case 'shielder': return 1.5;
                case 'sniper': return 1.5;
                case 'bulwark': return 1;
                default: return 1;
            }
        });
        
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let roll = Math.random() * totalWeight;
        
        for (let i = 0; i < pool.length; i++) {
            roll -= weights[i];
            if (roll <= 0) return this.get(pool[i]);
        }
        
        return this.get('drone');
    }
};