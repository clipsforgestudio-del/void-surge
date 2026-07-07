/* ============================================
   VOID SURGE - Projectile Entity
   ============================================ */

class Projectile {
    constructor(x, y, angle, speed, damage, color = '0, 255, 255', isEnemy = false) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.color = color;
        this.isEnemy = isEnemy;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.size = isEnemy ? 4 : 3;
        this.active = true;
        this.lifetime = 2.0;
        this.age = 0;
        this.piercing = false;
        this.hitEnemies = new Set();
    }
    
    /**
     * Update projectile
     */
    update(dt) {
        if (!this.active) return;
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.age += dt;
        
        // Trail effect
        if (Math.random() < 0.3) {
            Particles.emit({
                x: this.x,
                y: this.y,
                vx: -this.vx * 0.1,
                vy: -this.vy * 0.1,
                life: 0.2,
                size: 2,
                color: this.color,
                count: 1,
                fadeOut: true
            });
        }
        
        // Lifetime check
        if (this.age > this.lifetime) {
            this.active = false;
        }
        
        // Off-screen check
        const margin = 50;
        const cam = Camera;
        if (Math.abs(this.x - cam.x) > Engine.width / 2 + margin ||
            Math.abs(this.y - cam.y) > Engine.height / 2 + margin) {
            this.active = false;
        }
    }
    
    /**
     * Render projectile
     */
    render(ctx) {
        if (!this.active) return;
        
        const cam = Camera;
        const sx = this.x - cam.x + Engine.width / 2;
        const sy = this.y - cam.y + Engine.height / 2;
        
        // Glow
        Draw.glowCircle(ctx, sx, sy, this.size * 2, this.color, 8, 0.3);
        
        // Core
        ctx.beginPath();
        ctx.arc(sx, sy, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, 0.9)`;
        ctx.fill();
        
        // Direction line
        Draw.glowLine(ctx, sx, sy, sx - this.vx * 0.05, sy - this.vy * 0.05, this.color, 1, 4, 0.5);
    }
    
    /**
     * On hit
     */
    onHit(target) {
        if (this.piercing) {
            this.hitEnemies.add(target);
            this.damage *= 0.8; // Damage falloff per pierce
            if (this.damage < 1) this.active = false;
        } else {
            this.active = false;
        }
    }
}