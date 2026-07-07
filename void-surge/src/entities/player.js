/* ============================================
   VOID SURGE - Player Entity
   ============================================ */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseSpeed = 250;
        this.speed = this.baseSpeed;
        this.baseMaxHp = 100;
        this.maxHp = this.baseMaxHp;
        this.hp = this.maxHp;
        this.baseDamage = 20;
        this.damage = this.baseDamage;
        this.fireRate = 0.15; // seconds between shots
        this.fireTimer = 0;
        this.projectileCount = 1;
        this.piercing = false;
        this.critChance = 0;
        this.critMultiplier = 2;
        
        // Dash
        this.dashCooldown = 1.5;
        this.dashTimer = 0;
        this.isDashing = false;
        this.dashDuration = 0.15;
        this.dashTimer2 = 0;
        this.dashSpeed = 600;
        this.dashDir = { x: 0, y: 0 };
        
        // Defense
        this.regen = 0;
        this.shieldAmount = 0;
        this.currentShield = 0;
        
        // Progression
        this.level = 1;
        this.xp = 0;
        this.xpToNext = 20;
        this.xpMultiplier = 1;
        this.score = 0;
        this.pickupRange = 100;
        
        // Upgrades
        this.upgrades = {};
        
        // Visual
        this.size = 16;
        this.color = '0, 200, 255';
        this.hitFlashTimer = 0;
        this.invulnerableTimer = 0;
        this.invulnerableDuration = 0.5;
        
        // Trail
        this.trail = [];
        this.maxTrail = 15;
        
        // Active
        this.active = true;
    }
    
    /**
     * Update player
     */
    update(dt) {
        if (!this.active) return;
        
        // Movement
        this.handleInput(dt);
        
        // Shooting
        this.handleShooting(dt);
        
        // Dash
        this.handleDash(dt);
        
        // Regen
        if (this.regen > 0 && this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + this.regen * dt);
        }
        
        // Timers
        this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
        this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
        
        // Trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }
        
        // Camera follow
        Camera.setTarget(this.x, this.y);
        
        // Collect pickups
        this.collectPickups();
    }
    
    /**
     * Handle movement input
     */
    handleInput(dt) {
        if (this.isDashing) return;
        
        let mx = 0, my = 0;
        
        if (Input.isDown('KeyW') || Input.isDown('ArrowUp')) my -= 1;
        if (Input.isDown('KeyS') || Input.isDown('ArrowDown')) my += 1;
        if (Input.isDown('KeyA') || Input.isDown('ArrowLeft')) mx -= 1;
        if (Input.isDown('KeyD') || Input.isDown('ArrowRight')) mx += 1;
        
        // Normalize diagonal movement
        if (mx !== 0 && my !== 0) {
            mx *= 0.707;
            my *= 0.707;
        }
        
        this.x += mx * this.speed * dt;
        this.y += my * this.speed * dt;
        
        // Dash input
        if (Input.justPressed('Space') && this.dashTimer <= 0) {
            this.startDash(mx, my);
        }
    }
    
    /**
     * Start dash
     */
    startDash(mx, my) {
        this.isDashing = true;
        this.dashTimer = this.dashCooldown;
        this.dashTimer2 = this.dashDuration;
        this.invulnerableTimer = this.dashDuration + 0.1;
        
        // Use movement direction or facing direction
        if (Math.abs(mx) > 0.1 || Math.abs(my) > 0.1) {
            this.dashDir = { x: mx, y: my };
        } else {
            const mouse = Input.getMouseWorld();
            const dir = Vec2.normalize(Vec2.sub(mouse, this));
            this.dashDir = dir;
        }
        
        Audio.playDash();
        
        // Dash particles burst
        Particles.emit({
            x: this.x,
            y: this.y,
            life: 0.3,
            speed: 100,
            size: 4,
            color: '0, 255, 255',
            count: 8,
            fadeOut: true,
            shrink: true,
            spread: true
        });
    }
    
    /**
     * Handle dash update
     */
    handleDash(dt) {
        this.dashTimer = Math.max(0, this.dashTimer - dt);
        
        if (this.isDashing) {
            this.dashTimer2 -= dt;
            this.x += this.dashDir.x * this.dashSpeed * dt;
            this.y += this.dashDir.y * this.dashSpeed * dt;
            
            // Trail during dash
            Particles.emit({
                x: this.x + (Math.random() - 0.5) * 10,
                y: this.y + (Math.random() - 0.5) * 10,
                life: 0.2,
                speed: 20,
                size: 3,
                color: '0, 255, 255',
                count: 1,
                fadeOut: true
            });
            
            if (this.dashTimer2 <= 0) {
                this.isDashing = false;
                
                // End dash burst
                Particles.emit({
                    x: this.x,
                    y: this.y,
                    life: 0.2,
                    speed: 80,
                    size: 3,
                    color: '0, 255, 255',
                    count: 5,
                    fadeOut: true,
                    shrink: true,
                    spread: true
                });
            }
        }
    }
    
    /**
     * Handle shooting
     */
    handleShooting(dt) {
        this.fireTimer -= dt;
        if (this.fireTimer <= 0 && Input.isMouseDown(0)) {
            this.fireTimer = this.fireRate;
            this.shoot();
        }
    }
    
    /**
     * Shoot projectiles
     */
    shoot() {
        const mouse = Input.getMouseWorld();
        const baseAngle = Vec2.angleBetween(this, mouse);
        
        Audio.playShoot();
        
        // Muzzle flash particles
        Particles.emit({
            x: this.x + Math.cos(baseAngle) * 20,
            y: this.y + Math.sin(baseAngle) * 20,
            life: 0.1,
            speed: 30,
            size: 4,
            color: '0, 200, 255',
            count: 3,
            fadeOut: true,
            spread: true
        });
        
        // Spread for multiple projectiles
        const spreadAngle = 0.08;
        const startAngle = baseAngle - spreadAngle * (this.projectileCount - 1) / 2;
        
        for (let i = 0; i < this.projectileCount; i++) {
            const angle = startAngle + spreadAngle * i;
            const isCrit = Math.random() < this.critChance;
            const dmg = this.damage * (isCrit ? this.critMultiplier : 1);
            
            const proj = new Projectile(
                this.x + Math.cos(angle) * 20,
                this.y + Math.sin(angle) * 20,
                angle,
                500 + Math.random() * 50,
                dmg,
                isCrit ? '255, 255, 0' : '0, 200, 255',
                false
            );
            proj.piercing = this.piercing;
            Engine.projectiles.push(proj);
        }
    }
    
    /**
     * Collect nearby pickups
     */
    collectPickups() {
        for (const pickup of Engine.pickups) {
            if (!pickup.active) continue;
            
            const dist = Vec2.distance(this, pickup);
            if (dist < this.pickupRange + pickup.size) {
                // Magnet effect
                if (dist > 20) {
                    const dir = Vec2.normalize(Vec2.sub(this, pickup));
                    pickup.x += dir.x * 200 * 0.016;
                    pickup.y += dir.y * 200 * 0.016;
                } else {
                    // Collect
                    pickup.active = false;
                    this.addXP(pickup.value);
                    Audio.playPickup();
                    
                    Particles.emit({
                        x: pickup.x,
                        y: pickup.y,
                        life: 0.2,
                        speed: 50,
                        size: 3,
                        color: '255, 255, 0',
                        count: 4,
                        fadeOut: true,
                        spread: true
                    });
                }
            }
        }
    }
    
    /**
     * Add experience points
     */
    addXP(amount) {
        const actual = Math.floor(amount * this.xpMultiplier);
        this.xp += actual;
        this.score += actual;
        
        // Level up check
        if (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;
            this.level++;
            this.xpToNext = Math.floor(this.xpToNext * 1.5);
            this.onLevelUp();
        }
    }
    
    /**
     * On level up
     */
    onLevelUp() {
        Audio.playLevelUp();
        Camera.shake(8, 0.3);
        
        Particles.emit({
            x: this.x,
            y: this.y,
            life: 0.8,
            speed: 150,
            size: 5,
            color: '255, 255, 0',
            count: 20,
            fadeOut: true,
            shrink: true,
            spread: true
        });
        
        // Show upgrade choices
        UI.showUpgradeChoices();
        
        // Pause briefly for impact
        Engine.isPaused = true;
        setTimeout(() => { Engine.isPaused = false; }, 150);
    }
    
    /**
     * Take damage
     */
    takeDamage(amount) {
        if (this.invulnerableTimer > 0) return false;
        
        // Shield absorbs first
        if (this.currentShield > 0) {
            const absorbed = Math.min(this.currentShield, amount);
            this.currentShield -= absorbed;
            amount -= absorbed;
        }
        
        if (amount > 0) {
            this.hp -= amount;
            this.hitFlashTimer = 0.15;
            this.invulnerableTimer = this.invulnerableDuration;
            
            Audio.playDamage();
            Camera.shake(5, 0.2);
            
            // Damage particles
            Particles.emit({
                x: this.x,
                y: this.y,
                life: 0.3,
                speed: 80,
                size: 5,
                color: '255, 50, 50',
                count: 6,
                fadeOut: true,
                spread: true
            });
            
            if (this.hp <= 0) {
                this.die();
                return true;
            }
        }
        return false;
    }
    
    /**
     * Player death
     */
    die() {
        this.active = false;
        
        // Big explosion
        Particles.emit({
            x: this.x,
            y: this.y,
            life: 1.0,
            speed: 200,
            size: 8,
            color: '0, 200, 255',
            count: 30,
            fadeOut: true,
            shrink: true,
            spread: true
        });
        
        Camera.shake(15, 0.5);
        Audio.playExplosion();
        
        // Game over
        setTimeout(() => UI.showGameOver(), 500);
    }
    
    /**
     * Render player
     */
    render(ctx) {
        if (!this.active) return;
        
        const cam = Camera;
        const sx = this.x - cam.x + Engine.width / 2;
        const sy = this.y - cam.y + Engine.height / 2;
        
        // Invulnerability blink
        if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 20) % 2 === 0) {
            return;
        }
        
        const renderColor = this.hitFlashTimer > 0 ? '255, 255, 255' : this.color;
        const alpha = 1;
        
        // Trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const trailAlpha = (i / this.trail.length) * 0.3;
            const trailSize = (i / this.trail.length) * this.size * 0.6;
            const tx = t.x - cam.x + Engine.width / 2;
            const ty = t.y - cam.y + Engine.height / 2;
            
            ctx.beginPath();
            ctx.arc(tx, ty, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 200, 255, ${trailAlpha})`;
            ctx.fill();
        }
        ctx.restore();
        
        // Outer glow
        Draw.glowCircle(ctx, sx, sy, this.size * 1.5, renderColor, 25, 0.3);
        
        // Ship body (diamond shape)
        ctx.save();
        ctx.translate(sx, sy);
        
        const mouse = Input.getMouseWorld();
        const angle = Vec2.angleBetween(this, mouse);
        ctx.rotate(angle + Math.PI / 2);
        
        // Glow
        ctx.shadowColor = `rgba(${renderColor}, ${alpha * 0.8})`;
        ctx.shadowBlur = 20;
        
        // Ship shape
        ctx.strokeStyle = `rgba(${renderColor}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(-this.size * 0.7, this.size * 0.5);
        ctx.lineTo(0, this.size * 0.3);
        ctx.lineTo(this.size * 0.7, this.size * 0.5);
        ctx.closePath();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${renderColor}, ${alpha * 0.15})`;
        ctx.fill();
        
        ctx.restore();
        
        // Shield visual
        if (this.currentShield > 0) {
            Draw.glowCircle(ctx, sx, sy, this.size + 8, '0, 100, 255', 8, 0.2);
        }
        
        // Health bar above player
        if (this.hp < this.maxHp) {
            const barW = 30;
            const barH = 3;
            Draw.healthBar(ctx, sx - barW / 2, sy - this.size - 12, barW, barH, this.hp, this.maxHp);
        }
    }
    
    /**
     * Reset player state
     */
    reset() {
        this.x = 0;
        this.y = 0;
        this.hp = this.baseMaxHp;
        this.maxHp = this.baseMaxHp;
        this.speed = this.baseSpeed;
        this.damage = this.baseDamage;
        this.fireRate = 0.15;
        this.projectileCount = 1;
        this.piercing = false;
        this.critChance = 0;
        this.critMultiplier = 2;
        this.dashCooldown = 1.5;
        this.dashTimer = 0;
        this.isDashing = false;
        this.regen = 0;
        this.shieldAmount = 0;
        this.currentShield = 0;
        this.level = 1;
        this.xp = 0;
        this.xpToNext = 20;
        this.xpMultiplier = 1;
        this.score = 0;
        this.upgrades = {};
        this.trail = [];
        this.active = true;
        this.invulnerableTimer = 0.5; // Brief invulnerability on reset
        this.hitFlashTimer = 0;
        this.fireTimer = 0;
    }
}