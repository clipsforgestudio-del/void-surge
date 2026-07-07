/* ============================================
   VOID SURGE - Enemy Spawner / Wave Manager
   ============================================ */

const Spawner = {
    player: null,
    currentWave: 0,
    enemiesSpawned: 0,
    totalEnemies: 0,
    spawnTimer: 0,
    spawnInterval: 0,
    waveDelay: false,
    waveDelayTimer: 0,
    waveComplete: false,
    enemiesRemaining: 0,
    
    /**
     * Initialize spawner
     */
    init() {
        this.player = null;
        this.currentWave = 0;
        this.enemiesSpawned = 0;
        this.totalEnemies = 0;
        this.spawnTimer = 0;
        this.waveDelay = false;
        this.waveComplete = false;
    },
    
    /**
     * Set player reference
     */
    setPlayer(player) {
        this.player = player;
    },
    
    /**
     * Start a new wave
     */
    startWave() {
        this.currentWave++;
        const config = WaveData.getWaveConfig(this.currentWave);
        
        this.totalEnemies = config.totalEnemies;
        this.enemiesSpawned = 0;
        this.spawnTimer = 0;
        this.spawnInterval = config.spawnInterval;
        this.waveDelay = true;
        this.waveDelayTimer = config.spawnDelay;
        this.waveComplete = false;
        
        // Boss wave
        if (config.isBossWave && config.bossConfig) {
            this.bossConfig = config.bossConfig;
        } else {
            this.bossConfig = null;
        }
        
        // Wave multipliers
        this.waveMultipliers = {
            hpMultiplier: config.enemyHpMultiplier,
            speedMultiplier: config.enemySpeedMultiplier,
            damageMultiplier: config.enemyDamageMultiplier
        };
        
        // Show wave text
        UI.showWaveText(this.currentWave);
    },
    
    /**
     * Update spawner
     */
    update(dt) {
        if (!this.player || !this.player.active) return;
        
        // Wave delay
        if (this.waveDelay) {
            this.waveDelayTimer -= dt;
            if (this.waveDelayTimer <= 0) {
                this.waveDelay = false;
                Audio.playWaveStart();
            }
            return;
        }
        
        // Spawn enemies
        if (this.enemiesSpawned < this.totalEnemies) {
            this.spawnTimer -= dt;
            if (this.spawnTimer <= 0) {
                this.spawnTimer = this.spawnInterval;
                this.spawnEnemy();
            }
        }
        
        // Boss spawn (spawned after regular enemies)
        if (this.bossConfig && this.enemiesSpawned >= this.totalEnemies) {
            this.spawnBoss(this.bossConfig);
            this.bossConfig = null;
        }
        
        // Check wave complete
        const aliveEnemies = Engine.entities.filter(e => e.active).length;
        if (this.enemiesSpawned >= this.totalEnemies && !this.bossConfig && aliveEnemies === 0) {
            if (!this.waveComplete) {
                this.waveComplete = true;
                this.onWaveComplete();
            }
        }
    },
    
    /**
     * Spawn a single enemy
     */
    spawnEnemy() {
        if (!this.player) return;
        
        const config = EnemyData.random(this.currentWave);
        
        // Spawn position (on screen edge, at distance from player)
        const angle = Math.random() * Math.PI * 2;
        const dist = 300 + Math.random() * 100;
        const x = this.player.x + Math.cos(angle) * dist;
        const y = this.player.y + Math.sin(angle) * dist;
        
        const enemy = new Enemy(config, x, y, this.player, this.waveMultipliers);
        Engine.entities.push(enemy);
        this.enemiesSpawned++;
    },
    
    /**
     * Spawn a boss
     */
    spawnBoss(config) {
        if (!this.player) return;
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 200;
        const x = this.player.x + Math.cos(angle) * dist;
        const y = this.player.y + Math.sin(angle) * dist;
        
        const boss = new Enemy(
            {
                ...config,
                type: 'bulwark',
                behavior: 'chase'
            },
            x, y, this.player,
            { hpMultiplier: 1, speedMultiplier: 1, damageMultiplier: 1 }
        );
        
        Engine.entities.push(boss);
        
        // Boss warning
        UI.showWaveText(`⚠ ${config.name} ⚠`);
        Camera.shake(10, 0.5);
        
        // Boss entrance particles
        Particles.emit({
            x: x, y: y,
            life: 0.5,
            speed: 100,
            size: 10,
            color: '255, 0, 255',
            count: 15,
            fadeOut: true,
            shrink: true,
            spread: true
        });
    },
    
    /**
     * On wave complete
     */
    onWaveComplete() {
        // Award wave completion bonus
        if (this.player) {
            const bonus = this.currentWave * 10;
            this.player.addXP(bonus);
            this.player.score += bonus;
            
            UI.addScorePopup(this.player.x, this.player.y - 30, bonus, '255, 255, 0');
        }
        
        Camera.shake(5, 0.3);
        
        // Next wave soon
        setTimeout(() => {
            if (this.player && this.player.active) {
                this.startWave();
            }
        }, 2000);
    }
};