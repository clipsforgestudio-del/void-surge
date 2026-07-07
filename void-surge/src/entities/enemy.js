/* ============================================
   VOID SURGE - Enemy Entity
   ============================================ */

class Enemy {
    constructor(config, x, y, player, waveMultipliers = {}) {
        this.config = config;
        this.type = config.type;
        this.x = x;
        this.y = y;
        this.active = true;
        
        // Stats with wave scaling
        this.maxHp = config.hp * (waveMultipliers.hpMultiplier || 1);
        this.hp = this.maxHp;
        this.speed = config.speed * (waveMultipliers.speedMultiplier || 1);
        this.size = config.size;
        this.baseSize = config.size;
        this.color = config.color;
        this.damage = config.damage * (waveMultipliers.damageMultiplier || 1);
        this.scoreValue = config.scoreValue;
        this.dropChance = config.dropChance;
        
        // Behavior state
        this.behavior = config.behavior;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 2;
        
        // Orbit behavior
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitRadius = config.orbitRadius || 150;
        this.orbitSpeed = 1.5 + Math.random() * 0.5;
        
        // Rush behavior
        this.rushTimer = 0;
        this.rushCooldownTimer = 0;
        this.isRushing = false;
        this.rushSpeed = config.rushSpeed || 300;
        this.rushDuration = config.rushDuration || 0.4;
        this.rushCooldown = config.rushCooldown || 2.0;
        
        // Shoot behavior
        this.shootTimer = Math.random() * (config.shootInterval || 2);
        this.shootInterval = config.shootInterval || 2;
        
        // Sniper behavior
        this.preferredDistance = config.preferredDistance || 250;
        
        // Flash on hit
        this.hitFlashTimer = 0;
        this.hitFlashDuration = 0.1;
        
        // Reference to player for AI
        this.player = player;
    }
    
    /**
     * Update enemy
     */
    update(dt) {
        if (!this.active || !this.player) return;
        
        this.rotation += this.rotSpeed * dt;
        this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
        
        switch (this.behavior) {
            case 'chase':
                this.behaviorChase(dt);
                break;
            case 'orbit':
                this.behaviorOrbit(dt);
                break;
            case 'rush':
                this.behaviorRush(dt);
                break;
            case 'snipe':
                this.behaviorSnipe(dt);
                break;
        }
        
        // Check if off screen (too far from player)
        const dist = Vec2.distance(this, this.player);
        if (dist > 500) {
            this.active = false;
        }
    }
    
    /**
     * Chase behavior - move toward player
     */
    behaviorChase(dt) {
        const dir = Vec2.normalize(Vec2.sub(this.player, this));
        this.x += dir.x * this.speed * dt;
        this.y += dir.y * this.speed * dt;
        this.rotation += dt * 2;
    }
    
    /**
     * Orbit behavior - circle around player at distance
     */
    behaviorOrbit(dt) {
        this.orbitAngle += this.orbitSpeed * dt;
        const targetX = this.player.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        const targetY = this.player.y + Math.sin(this.orbitAngle) * this.orbitRadius;
        
        const dir = Vec2.normalize(Vec2.sub({ x: targetX, y: targetY }, this));
        this.x += dir.x * this.speed * dt;
        this.y += dir.y * this.speed * dt;
        
        // Shoot at player
        this.shootTimer -= dt;
        if (this.shootTimer <= 0) {
            this.shootTimer = this.shootInterval;
            this.shootAtPlayer();
        }
    }
    
    /**
     * Rush behavior - pause then dash toward player
     */
    behaviorRush(dt) {
        if (this.isRushing) {
            this.rushTimer -= dt;
            const dir = Vec2.normalize(Vec2.sub(this.player, this));
            this.x += dir.x * this.rushSpeed * dt;
            this.y += dir.y * this.rushSpeed * dt;
            
            if (this.rushTimer <= 0) {
                this.isRushing = false;
                this.rushCooldownTimer = this.rushCooldown;
            }
        } else {
            this.rushCooldownTimer -= dt;
            const dir = Vec2.normalize(Vec2.sub(this.player, this));
            this.x += dir.x * this.speed * 0.5 * dt;
            this.y += dir.y * this.speed * 0.5 * dt;
            
            if (this.rushCooldownTimer <= 0) {
                this.isRushing = true;
                this.rushTimer = this.rushDuration;
            }
        }
    }
    
    /**
     * Snipe behavior - keep distance and shoot
     */
    behaviorSnipe(dt) {
        const dir = Vec2.normalize(Vec2.sub(this.player, this));
        const dist = Vec2.distance(this, this.player);
        
        if (dist < this.preferredDistance * 0.8) {
            this.x -= dir.x * this.speed * dt;
            this.y -= dir.y * this.speed * dt;
        } else if (dist > this.preferredDistance * 1.2) {
            this.x += dir.x * this.speed * dt;
            this.y += dir.y * this.speed * dt;
        } else {
            this.x += -dir.y * this.speed * 0.5 * dt;
            this.y += dir.x * this.speed * 0.5 * dt;
        }
        
        this.shootTimer -= dt;
        if (this.shootTimer <= 0) {
            this.shootTimer = this.shootInterval;
            this.shootAtPlayer();
        }
    }
    
    /**
     * Shoot a projectile at the player
     */
    shootAtPlayer() {
        const angle = Vec2.angleBetween(this, this.player);
        const proj = new Projectile(
            this.x, this.y,
            angle,
            250,
            this.damage,
            this.color,
            true
        );
        Engine.projectiles.push(proj);
    }
    
    /**
     * Take damage
     */
    takeDamage(amount, knockbackDir = null, knockbackForce = 0) {
        this.hp -= amount;
        this.hitFlashTimer = this.hitFlashDuration;
        
        if (knockbackDir) {
            this.x += knockbackDir.x * knockbackForce;
            this.y += knockbackDir.y * knockbackForce;
        }
        
        if (this.hp <= 0) {
            this.die();
            return true;
        }
        return false;
    }
    
    /**
     * Enemy death
     */
    die() {
        this.active = false;
        
        // Explosion particles
        Particles.emit({
            x: this.x,
            y: this.y,
            life: 0.5,
            speed: this.size * 5,
            size: this.size * 0.5,
            color: this.color,
            count: Math.floor(this.size * 1.5),
            fadeOut: true,
            shrink: true,
            spread: true
        });
        
        // Score popup
        UI.addScorePopup(this.x, this.y, this.scoreValue, this.color);
        
        // Screen shake on big enemies
        if (this.size > 20) {
            Camera.shake(this.size * 0.3, 0.2);
        }
        
        // Sound
        if (this.size > 20) {
            Audio.playExplosion();
        } else {
            Audio.playDeath();
        }
        
        // Drop XP pickup
        if (Math.random() < this.dropChance) {
            this.spawnPickup();
        }
    }
    
    /**
     * Spawn an XP pickup
     */
    spawnPickup() {
        const pickup = {
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            size: 5 + this.size * 0.1,
            color: '255, 255, 0',
            active: true,
            lifetime: 8,
            age: 0,
            type: 'xp',
            value: Math.floor(this.scoreValue * 0.5) + 1
        };
        Engine.pickups.push(pickup);
    }
    
    /**
     * Render enemy
     */
    render(ctx) {
        if (!this.active) return;
        
        const cam = Camera;
        const sx = this.x - cam.x + Engine.width / 2;
        const sy = this.y - cam.y + Engine.height / 2;
        
        const renderColor = this.hitFlashTimer > 0 ? '255, 255, 255' : this.color;
        const alpha = this.hitFlashTimer > 0 ? 0.9 : 1;
        
        switch (this.type) {
            case 'drone':
            case 'swarm':
                Draw.neonTriangle(ctx, sx, sy, this.size, renderColor, this.rotation, alpha);
                break;
            case 'spike':
                Draw.star(ctx, sx, sy, this.size, this.size * 0.4, 5, renderColor, this.rotation, alpha);
                break;
            case 'shielder':
                Draw.hexagon(ctx, sx, sy, this.size, renderColor, this.rotation, alpha);
                break;
            case 'bulwark':
                Draw.hexagon(ctx, sx, sy, this.size, renderColor, this.rotation, alpha);
                break;
            case 'sniper':
                Draw.neonDiamond(ctx, sx, sy, this.size, renderColor, alpha);
                break;
            default:
                Draw.neonTriangle(ctx, sx, sy, this.size, renderColor, this.rotation, alpha);
        }
        
        // Health bar for enemies with > 1 HP
        if (this.maxHp > 1 && this.hp < this.maxHp) {
            const barW = this.size * 2;
            const barH = 3;
            const barX = sx - barW / 2;
            const barY = sy - this.size - 8;
            Draw.healthBar(ctx, barX, barY, barW, barH, this.hp, this.maxHp, this.color);
        }
    }
}