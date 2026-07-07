/* ============================================
   VOID SURGE - Particle System
   ============================================ */

const Particles = {
    /**
     * Emit particles
     */
    emit(config) {
        const {
            x, y,
            vx = 0, vy = 0,
            life = 0.5,
            speed = 50,
            size = 4,
            color = '255, 255, 255',
            count = 5,
            fadeOut = true,
            shrink = true,
            spread = false,
            gravity = 0
        } = config;
        
        for (let i = 0; i < count; i++) {
            let particleVx = vx;
            let particleVy = vy;
            
            if (spread) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * speed;
                particleVx = Math.cos(angle) * spd;
                particleVy = Math.sin(angle) * spd;
            }
            
            Engine.particles.push({
                x: x + (Math.random() - 0.5) * 5,
                y: y + (Math.random() - 0.5) * 5,
                vx: particleVx + (Math.random() - 0.5) * speed * 0.2,
                vy: particleVy + (Math.random() - 0.5) * speed * 0.2,
                life: life * (0.7 + Math.random() * 0.3),
                maxLife: life,
                size: size * (0.5 + Math.random() * 0.5),
                maxSize: size,
                color: color,
                active: true,
                fadeOut: fadeOut,
                shrink: shrink,
                gravity: gravity,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 5
            });
        }
    },
    
    /**
     * Update all particles
     */
    update(dt) {
        for (const p of Engine.particles) {
            if (!p.active) continue;
            
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += p.gravity * dt;
            p.age += dt;
            p.life -= dt;
            p.rotation += p.rotSpeed * dt;
            
            if (p.life <= 0) {
                p.active = false;
            }
            
            // Size decay
            if (p.shrink) {
                const lifeRatio = Math.max(0, p.life / p.maxLife);
                p.size = p.maxSize * lifeRatio;
            }
        }
        
        // Cleanup
        Engine.particles = Engine.particles.filter(p => p.active);
    },
    
    /**
     * Render all particles
     */
    render(ctx) {
        const cam = Camera;
        
        for (const p of Engine.particles) {
            if (!p.active) continue;
            
            const sx = p.x - cam.x + Engine.width / 2;
            const sy = p.y - cam.y + Engine.height / 2;
            
            const alpha = p.fadeOut ? Math.max(0, p.life / p.maxLife) : 1;
            
            if (p.size < 1) continue;
            
            // Glow
            Draw.glowCircle(ctx, sx, sy, p.size, p.color, p.size * 3, alpha * 0.3);
            
            // Core
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(p.rotation);
            ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.8})`;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        }
    }
};