/* ============================================
   VOID SURGE - Combat System
   ============================================ */

const Combat = {
    player: null,
    
    /**
     * Initialize combat system
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
     * Update combat logic
     */
    update(dt) {
        if (!this.player || !this.player.active) return;
        
        // Check projectile-enemy collisions
        this.checkProjectileCollisions();
        
        // Check enemy-player collisions
        this.checkEnemyCollisions();
        
        // Update pickups
        this.updatePickups(dt);
    },
    
    /**
     * Check collisions between projectiles and enemies
     */
    checkProjectileCollisions() {
        for (const proj of Engine.projectiles) {
            if (!proj.active || proj.isEnemy) continue;
            
            for (const enemy of Engine.entities) {
                if (!enemy.active) continue;
                
                // Skip if already hit this enemy (piercing)
                if (proj.piercing && proj.hitEnemies.has(enemy)) continue;
                
                const dist = Vec2.distance(proj, enemy);
                if (dist < proj.size + enemy.size) {
                    // Hit!
                    const knockDir = Vec2.normalize(Vec2.sub(enemy, proj));
                    const killed = enemy.takeDamage(proj.damage, knockDir, 5);
                    
                    proj.onHit(enemy);
                    
                    // Hit particles
                    Particles.emit({
                        x: proj.x,
                        y: proj.y,
                        life: 0.2,
                        speed: 40,
                        size: 3,
                        color: enemy.color,
                        count: 3,
                        fadeOut: true,
                        spread: true
                    });
                    
                    if (!proj.active) break;
                }
            }
        }
    },
    
    /**
     * Check collisions between enemies and player
     */
    checkEnemyCollisions() {
        for (const enemy of Engine.entities) {
            if (!enemy.active) continue;
            
            const dist = Vec2.distance(this.player, enemy);
            if (dist < this.player.size + enemy.size) {
                // Player takes damage
                this.player.takeDamage(enemy.damage);
                
                // Knockback enemy
                const knockDir = Vec2.normalize(Vec2.sub(enemy, this.player));
                enemy.x += knockDir.x * 30;
                enemy.y += knockDir.y * 30;
                
                // Contact particles
                Particles.emit({
                    x: (this.player.x + enemy.x) / 2,
                    y: (this.player.y + enemy.y) / 2,
                    life: 0.2,
                    speed: 60,
                    size: 4,
                    color: '255, 50, 50',
                    count: 5,
                    fadeOut: true,
                    spread: true
                });
            }
        }
    },
    
    /**
     * Update pickups (movement, lifetime)
     */
    updatePickups(dt) {
        for (const pickup of Engine.pickups) {
            if (!pickup.active) continue;
            
            // Movement
            pickup.x += pickup.vx * dt;
            pickup.y += pickup.vy * dt;
            pickup.vx *= 0.95;
            pickup.vy *= 0.95;
            
            // Lifetime
            pickup.age += dt;
            if (pickup.age > pickup.lifetime) {
                pickup.active = false;
            }
            
            // Blink when about to expire
            if (pickup.lifetime - pickup.age < 2) {
                pickup.blink = Math.floor((pickup.lifetime - pickup.age) * 10) % 2 === 0;
            } else {
                pickup.blink = false;
            }
        }
        
        // Cleanup
        Engine.pickups = Engine.pickups.filter(p => p.active);
    }
};