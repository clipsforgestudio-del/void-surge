/* ============================================
   VOID SURGE - UI System
   ============================================ */

const UI = {
    // HUD elements
    scoreText: null,
    waveText: null,
    hpText: null,
    levelText: null,
    xpBar: null,
    
    // Popups
    scorePopups: [],
    waveAnnouncement: null,
    waveAnnouncementTimer: 0,
    
    // Upgrade UI
    showingUpgrades: false,
    currentUpgradeChoices: null,
    upgradeContainer: null,
    
    // Screen effects
    screenFlash: 0,
    screenFlashColor: '255, 255, 255',
    
    // Game over
    gameOverData: null,
    
    /**
     * Initialize UI
     */
    init() {
        this.scorePopups = [];
        this.showingUpgrades = false;
        this.currentUpgradeChoices = null;
        this.screenFlash = 0;
        
        // Create HUD elements
        this.createHUD();
        
        // Create upgrade panel
        this.createUpgradePanel();
        
        // Setup menu buttons
        this.setupMenuButtons();
    },
    
    /**
     * Create HUD elements
     */
    createHUD() {
        const overlay = document.getElementById('ui-overlay');
        overlay.innerHTML = `
            <div id="hud-top">
                <div id="hud-left">
                    <div id="hud-score">SCORE: 0</div>
                    <div id="hud-wave">WAVE: 1</div>
                </div>
                <div id="hud-right">
                    <div id="hud-level">LVL 1</div>
                    <div id="hud-xp-container">
                        <div id="hud-xp-bar"></div>
                    </div>
                </div>
            </div>
            <div id="hud-bottom">
                <div id="hud-hp-container">
                    <div id="hud-hp-bar"></div>
                    <div id="hud-hp-text">100/100</div>
                </div>
                <div id="hud-dash">
                    <div id="hud-dash-bar"></div>
                    <span>DASH</span>
                </div>
            </div>
            <div id="hud-center">
                <div id="wave-announcement" class="hidden"></div>
            </div>
        `;
        
        // Add HUD styles
        const style = document.createElement('style');
        style.textContent = `
            #hud-top {
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                display: flex;
                justify-content: space-between;
                pointer-events: none;
            }
            #hud-left, #hud-right {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            #hud-right {
                align-items: flex-end;
            }
            #hud-score {
                color: #0ff;
                font-size: 18px;
                text-shadow: 0 0 10px rgba(0,255,255,0.5);
                letter-spacing: 2px;
            }
            #hud-wave {
                color: #888;
                font-size: 14px;
            }
            #hud-level {
                color: #ff0;
                font-size: 16px;
                text-shadow: 0 0 10px rgba(255,255,0,0.5);
            }
            #hud-xp-container {
                width: 120px;
                height: 6px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 3px;
                overflow: hidden;
            }
            #hud-xp-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #ff0, #ff8);
                transition: width 0.3s;
            }
            #hud-bottom {
                position: absolute;
                bottom: 20px;
                left: 20px;
                right: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                pointer-events: none;
            }
            #hud-hp-container {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            #hud-hp-bar {
                width: 200px;
                height: 8px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 4px;
                overflow: hidden;
            }
            #hud-hp-bar::after {
                content: '';
                display: block;
                height: 100%;
                width: 100%;
                background: linear-gradient(90deg, #0f0, #0ff);
                transition: width 0.3s;
            }
            #hud-hp-text {
                color: #fff;
                font-size: 14px;
                min-width: 60px;
            }
            #hud-dash {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #0ff;
                font-size: 12px;
            }
            #hud-dash-bar {
                width: 60px;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(0,255,255,0.3);
                border-radius: 2px;
                overflow: hidden;
            }
            #hud-dash-bar::after {
                content: '';
                display: block;
                height: 100%;
                width: 100%;
                background: #0ff;
                transition: width 0.3s;
            }
            #hud-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            }
            #wave-announcement {
                font-size: 48px;
                color: #0ff;
                text-shadow: 0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4);
                letter-spacing: 8px;
                animation: wavePulse 1s ease-out;
                white-space: nowrap;
            }
            @keyframes wavePulse {
                0% { transform: scale(2); opacity: 0; }
                50% { transform: scale(1); opacity: 1; }
                100% { transform: scale(0.8); opacity: 0; }
            }
            #upgrade-panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                border: 2px solid #0ff;
                padding: 30px;
                min-width: 400px;
                pointer-events: auto;
                z-index: 20;
                box-shadow: 0 0 30px rgba(0,255,255,0.3);
            }
            #upgrade-panel h2 {
                color: #0ff;
                text-align: center;
                margin-bottom: 20px;
                font-size: 24px;
                letter-spacing: 4px;
                text-shadow: 0 0 10px rgba(0,255,255,0.5);
            }
            .upgrade-choice {
                background: rgba(0,255,255,0.05);
                border: 1px solid rgba(0,255,255,0.3);
                padding: 15px;
                margin: 8px 0;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .upgrade-choice:hover {
                background: rgba(0,255,255,0.15);
                border-color: #0ff;
                box-shadow: 0 0 15px rgba(0,255,255,0.3);
            }
            .upgrade-choice .icon {
                font-size: 28px;
                width: 40px;
                text-align: center;
            }
            .upgrade-choice .info {
                flex: 1;
            }
            .upgrade-choice .name {
                color: #0ff;
                font-size: 16px;
                font-weight: bold;
            }
            .upgrade-choice .desc {
                color: #888;
                font-size: 12px;
                margin-top: 4px;
            }
            .upgrade-choice .rarity {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .rarity-common { color: #888; }
            .rarity-uncommon { color: #0f0; }
            .rarity-rare { color: #f0f; }
            .upgrade-choice .key-hint {
                color: #444;
                font-size: 12px;
                border: 1px solid #444;
                padding: 2px 8px;
                border-radius: 3px;
            }
            .score-popup {
                position: absolute;
                pointer-events: none;
                font-size: 16px;
                font-weight: bold;
                text-shadow: 0 0 5px currentColor;
                animation: scoreFloat 1s ease-out forwards;
            }
            @keyframes scoreFloat {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
            .screen-flash {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                pointer-events: none;
                animation: flashFade 0.3s ease-out forwards;
            }
            @keyframes flashFade {
                0% { opacity: 0.3; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * Create upgrade panel
     */
    createUpgradePanel() {
        const panel = document.createElement('div');
        panel.id = 'upgrade-panel';
        panel.className = 'hidden';
        panel.innerHTML = '<h2>LEVEL UP</h2><div id="upgrade-choices"></div>';
        document.getElementById('ui-overlay').appendChild(panel);
        this.upgradeContainer = panel;
    },
    
    /**
     * Setup menu buttons
     */
    setupMenuButtons() {
        document.getElementById('btn-play').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('btn-how-to-play').addEventListener('click', () => {
            const info = document.getElementById('controls-info');
            info.classList.toggle('hidden');
        });
        
        document.getElementById('btn-retry').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('btn-menu').addEventListener('click', () => {
            this.showMenu();
        });
    },
    
    /**
     * Start the game
     */
    startGame() {
        document.getElementById('menu-overlay').classList.add('hidden');
        document.getElementById('game-over-overlay').classList.add('hidden');
        
        Engine.reset();
        Engine.gameState = 'playing';
        
        // Create player
        const player = new Player(0, 0);
        Engine.entities.push(player);
        
        // Setup systems
        Combat.setPlayer(player);
        Spawner.setPlayer(player);
        UpgradeSystem.setPlayer(player);
        
        // Start first wave
        Spawner.startWave();
        
        // Start music
        Audio.startMusic();
    },
    
    /**
     * Show game over screen
     */
    showGameOver() {
        Engine.gameState = 'gameover';
        Audio.stopMusic();
        
        const overlay = document.getElementById('game-over-overlay');
        document.getElementById('final-score-text').textContent = `Score: ${Spawner.player ? Spawner.player.score : 0}`;
        document.getElementById('final-wave-text').textContent = `Wave: ${Spawner.currentWave}`;
        overlay.classList.remove('hidden');
    },
    
    /**
     * Show menu
     */
    showMenu() {
        Engine.gameState = 'menu';
        Engine.reset();
        Audio.stopMusic();
        
        document.getElementById('game-over-overlay').classList.add('hidden');
        document.getElementById('menu-overlay').classList.remove('hidden');
    },
    
    /**
     * Show wave announcement
     */
    showWaveText(wave) {
        const el = document.getElementById('wave-announcement');
        const text = typeof wave === 'number' ? `WAVE ${wave}` : wave;
        el.textContent = text;
        el.classList.remove('hidden');
        
        // Re-trigger animation
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = 'wavePulse 1.5s ease-out';
        }, 10);
        
        setTimeout(() => {
            el.classList.add('hidden');
        }, 1500);
    },
    
    /**
     * Show upgrade choices
     */
    showUpgradeChoices() {
        if (!Spawner.player) return;
        
        const choices = UpgradeData.getRandomChoices(3, Spawner.player);
        this.currentUpgradeChoices = choices;
        this.showingUpgrades = true;
        
        const container = document.getElementById('upgrade-choices');
        container.innerHTML = '';
        
        choices.forEach((upgrade, index) => {
            const el = document.createElement('div');
            el.className = 'upgrade-choice';
            el.innerHTML = `
                <div class="icon">${upgrade.icon || '✦'}</div>
                <div class="info">
                    <div class="name">${upgrade.name}</div>
                    <div class="desc">${upgrade.description}</div>
                    <div class="rarity rarity-${upgrade.rarity}">${upgrade.rarity}</div>
                </div>
                <div class="key-hint">${index + 1}</div>
            `;
            el.addEventListener('click', () => {
                UpgradeSystem.selectUpgrade(index);
            });
            container.appendChild(el);
        });
        
        this.upgradeContainer.classList.remove('hidden');
    },
    
    /**
     * Hide upgrade choices
     */
    hideUpgradeChoices() {
        this.showingUpgrades = false;
        this.currentUpgradeChoices = null;
        this.upgradeContainer.classList.add('hidden');
    },
    
    /**
     * Add a score popup
     */
    addScorePopup(x, y, value, color = '255, 255, 255') {
        this.scorePopups.push({
            x, y,
            value: `+${value}`,
            color,
            life: 1.0,
            maxLife: 1.0,
            active: true
        });
    },
    
    /**
     * Update UI
     */
    update(dt) {
        // Update HUD
        this.updateHUD();
        
        // Update score popups
        for (const popup of this.scorePopups) {
            popup.life -= dt;
            if (popup.life <= 0) popup.active = false;
        }
        this.scorePopups = this.scorePopups.filter(p => p.active);
        
        // Screen flash
        if (this.screenFlash > 0) {
            this.screenFlash -= dt;
        }
    },
    
    /**
     * Update HUD elements
     */
    updateHUD() {
        const player = Spawner.player;
        if (!player) return;
        
        const scoreEl = document.getElementById('hud-score');
        if (scoreEl) scoreEl.textContent = `SCORE: ${player.score}`;
        
        const waveEl = document.getElementById('hud-wave');
        if (waveEl) waveEl.textContent = `WAVE: ${Spawner.currentWave}`;
        
        const levelEl = document.getElementById('hud-level');
        if (levelEl) levelEl.textContent = `LVL ${player.level}`;
        
        const xpBar = document.getElementById('hud-xp-bar');
        if (xpBar) xpBar.style.width = `${(player.xp / player.xpToNext) * 100}%`;
        
        const hpBar = document.getElementById('hud-hp-bar');
        if (hpBar) {
            const hpPercent = (player.hp / player.maxHp) * 100;
            hpBar.style.setProperty('--hp-width', `${hpPercent}%`);
            hpBar.querySelector('::after') || hpBar.style.setProperty('width', `${hpPercent}%`);
            // Use inline style for HP bar
            const after = hpBar.querySelector('style') || document.createElement('style');
            after.textContent = `#hud-hp-bar::after { width: ${hpPercent}% !important; }`;
            if (!hpBar.querySelector('style')) hpBar.appendChild(after);
        }
        
        const hpText = document.getElementById('hud-hp-text');
        if (hpText) hpText.textContent = `${Math.ceil(player.hp)}/${player.maxHp}`;
        
        const dashBar = document.getElementById('hud-dash-bar');
        if (dashBar) {
            const dashPercent = player.dashTimer > 0 ? 
                ((player.dashCooldown - player.dashTimer) / player.dashCooldown) * 100 : 100;
            const after = dashBar.querySelector('style') || document.createElement('style');
            after.textContent = `#hud-dash-bar::after { width: ${dashPercent}% !important; }`;
            if (!dashBar.querySelector('style')) dashBar.appendChild(after);
        }
    },
    
    /**
     * Render UI on canvas
     */
    render(ctx) {
        // Screen flash
        if (this.screenFlash > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.screenFlash * 0.5})`;
            ctx.fillRect(0, 0, Engine.width, Engine.height);
        }
        
        // Score popups (world space)
        const cam = Camera;
        for (const popup of this.scorePopups) {
            if (!popup.active) continue;
            
            const sx = popup.x - cam.x + Engine.width / 2;
            const sy = popup.y - cam.y + Engine.height / 2;
            const alpha = popup.life / popup.maxLife;
            const offsetY = (1 - alpha) * 30;
            
            Draw.neonText(ctx, popup.value, sx, sy - offsetY, popup.color, 18, alpha);
        }
    }
};