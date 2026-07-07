/* ============================================
   VOID SURGE - Main Entry Point
   ============================================ */

(function() {
    'use strict';
    
    /**
     * Initialize the game
     */
    function init() {
        // Initialize engine first
        Engine.init('game-container');
        
        // Initialize systems
        Input.init();
        Camera.init();
        Audio.init();
        
        // Initialize game systems
        Combat.init();
        Spawner.init();
        UpgradeSystem.init();
        UI.init();
        
        // Register systems with engine
        Engine.registerSystem(Camera);
        Engine.registerSystem(Input);
        Engine.registerSystem(Combat);
        Engine.registerSystem(Spawner);
        Engine.registerSystem(UpgradeSystem);
        Engine.registerSystem(UI);
        Engine.registerSystem(Particles);
        
        // Register cleanup system
        Engine.registerSystem({
            update() {
                // Cleanup dead entities
                Engine.entities = Engine.entities.filter(e => e.active);
                // Cleanup dead projectiles
                Engine.projectiles = Engine.projectiles.filter(p => p.active);
            }
        });
        
        // Show FPS in dev
        Engine.showFps = true;
        
        // Add update for player
        Engine.registerSystem({
            update(dt) {
                // Update player
                for (const entity of Engine.entities) {
                    if (entity instanceof Player) {
                        entity.update(dt);
                    }
                }
                
                // Update enemies
                for (const enemy of Engine.entities) {
                    if (enemy instanceof Enemy) {
                        enemy.update(dt);
                    }
                }
                
                // Update projectiles
                for (const proj of Engine.projectiles) {
                    proj.update(dt);
                }
            }
        });
        
        // Add render system
        Engine.registerSystem({
            init() {},
            update() {} // No update, render is in engine
        });
        
        // Start the game loop
        Engine.start();
        
        console.log('VOID SURGE initialized successfully');
        console.log(`Canvas: ${Engine.width}x${Engine.height}`);
        console.log(`FPS target: 60`);
    }
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();