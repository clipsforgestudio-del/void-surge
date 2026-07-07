/* ============================================
   VOID SURGE - Upgrade System
   ============================================ */

const UpgradeSystem = {
    player: null,
    
    /**
     * Initialize upgrade system
     */
    init() {
        this.player = null;
    },
    
    /**
     * Set player reference
     */
    setPlayer(player) {
        this.player = player;
    },
    
    /**
     * Apply an upgrade to the player
     */
    applyUpgrade(upgradeId) {
        if (!this.player) return;
        
        const upgrade = UpgradeData.get(upgradeId);
        if (!upgrade) return;
        
        // Get current level
        const currentLevel = this.player.upgrades[upgradeId] || 0;
        const newLevel = currentLevel + 1;
        
        if (newLevel > upgrade.maxLevel) return;
        
        // Apply upgrade
        this.player.upgrades[upgradeId] = newLevel;
        upgrade.apply(this.player, newLevel);
        
        // Visual feedback
        Camera.shake(3, 0.15);
        Audio.playLevelUp();
        
        // Screen flash
        UI.screenFlash = 0.3;
        
        return true;
    },
    
    /**
     * Update upgrade system
     */
    update(dt) {
        // Handle upgrade selection via keyboard (1, 2, 3)
        if (Engine.gameState === 'playing' && UI.showingUpgrades) {
            if (Input.justPressed('Digit1') || Input.justPressed('Numpad1')) {
                this.selectUpgrade(0);
            }
            if (Input.justPressed('Digit2') || Input.justPressed('Numpad2')) {
                this.selectUpgrade(1);
            }
            if (Input.justPressed('Digit3') || Input.justPressed('Numpad3')) {
                this.selectUpgrade(2);
            }
        }
    },
    
    /**
     * Select an upgrade by index
     */
    selectUpgrade(index) {
        if (!UI.currentUpgradeChoices || index >= UI.currentUpgradeChoices.length) return;
        
        const upgrade = UI.currentUpgradeChoices[index];
        if (!upgrade || !upgrade.id) return;
        
        this.applyUpgrade(upgrade.id);
        UI.hideUpgradeChoices();
    }
};