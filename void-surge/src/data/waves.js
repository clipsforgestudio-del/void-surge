/* ============================================
   VOID SURGE - Wave Definitions
   ============================================ */

const WaveData = {
    /**
     * Get wave configuration based on wave number
     */
    getWaveConfig(wave) {
        const baseEnemies = 5 + wave * 3;
        const spawnInterval = Math.max(0.3, 1.5 - wave * 0.08);
        const enemyHpMultiplier = 1 + (wave - 1) * 0.15;
        const enemySpeedMultiplier = 1 + (wave - 1) * 0.05;
        const enemyDamageMultiplier = 1 + (wave - 1) * 0.1;
        
        return {
            wave,
            totalEnemies: Math.floor(baseEnemies),
            spawnDelay: 1.0,
            spawnInterval: spawnInterval,
            enemyHpMultiplier,
            enemySpeedMultiplier,
            enemyDamageMultiplier,
            // Boss every 5 waves
            isBossWave: wave % 5 === 0,
            bossConfig: wave % 5 === 0 ? this.getBossConfig(wave) : null
        };
    },
    
    /**
     * Get boss configuration
     */
    getBossConfig(wave) {
        const bossLevel = Math.floor(wave / 5);
        return {
            name: `Void ${['Sentinel', 'Guardian', 'Titan', 'Behemoth', 'Colossus', 'Leviathan'][Math.min(bossLevel - 1, 5)] || 'Entity'}`,
            hp: 20 + bossLevel * 30,
            speed: 40 + bossLevel * 5,
            size: 40 + bossLevel * 8,
            damage: 20 + bossLevel * 10,
            color: '255, 0, 255',
            scoreValue: 100 + bossLevel * 50,
            dropChance: 1.0,
            // Boss attacks
            attacks: [
                { type: 'spiral', interval: 2.0, projectileCount: 8 },
                { type: 'beam', interval: 3.0, warning: 0.5 }
            ]
        };
    },
    
    /**
     * Get difficulty scaling for current wave
     */
    getDifficulty(wave) {
        return {
            enemyCountMultiplier: 1 + (wave - 1) * 0.2,
            dropRateMultiplier: Math.max(0.5, 1 - (wave - 1) * 0.02),
            xpMultiplier: 1 + (wave - 1) * 0.1
        };
    }
};