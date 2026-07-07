/* ============================================
   VOID SURGE - Drawing Utilities
   ============================================ */

const Draw = {
    /**
     * Draw a glowing circle
     */
    glowCircle(ctx, x, y, radius, color, glowSize = 20, alpha = 1) {
        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius + glowSize);
        gradient.addColorStop(0, `rgba(${color}, ${alpha * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${color}, ${alpha * 0.1})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, radius + glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
    },

    /**
     * Draw a glowing rectangle
     */
    glowRect(ctx, x, y, w, h, color, glowSize = 10, alpha = 1) {
        ctx.save();
        ctx.shadowColor = `rgba(${color}, ${alpha * 0.8})`;
        ctx.shadowBlur = glowSize;
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fillRect(x, y, w, h);
        ctx.restore();
    },

    /**
     * Draw a line with glow
     */
    glowLine(ctx, x1, y1, x2, y2, color, width = 2, glowSize = 10, alpha = 1) {
        ctx.save();
        ctx.shadowColor = `rgba(${color}, ${alpha * 0.8})`;
        ctx.shadowBlur = glowSize;
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    },

    /**
     * Draw a neon triangle (for enemies)
     */
    neonTriangle(ctx, x, y, size, color, rotation = 0, alpha = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const h = size * (Math.sqrt(3) / 2);
        
        ctx.shadowColor = `rgba(${color}, ${alpha * 0.6})`;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.6);
        ctx.lineTo(-size / 2, h * 0.4);
        ctx.lineTo(size / 2, h * 0.4);
        ctx.closePath();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.15})`;
        ctx.fill();
        
        ctx.restore();
    },

    /**
     * Draw a neon diamond (for pickups)
     */
    neonDiamond(ctx, x, y, size, color, alpha = 1) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.shadowColor = `rgba(${color}, ${alpha * 0.8})`;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size, 0);
        ctx.closePath();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.2})`;
        ctx.fill();
        
        ctx.restore();
    },

    /**
     * Draw text with neon glow
     */
    neonText(ctx, text, x, y, color, size = 20, alpha = 1, align = 'center') {
        ctx.save();
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${size}px 'Courier New', monospace`;
        
        ctx.shadowColor = `rgba(${color}, ${alpha * 0.8})`;
        ctx.shadowBlur = 15;
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fillText(text, x, y);
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.fillText(text, x, y);
        
        ctx.restore();
    },

    /**
     * Draw a health bar
     */
    healthBar(ctx, x, y, w, h, current, max, color = '0, 255, 100') {
        const ratio = Math.max(0, current / max);
        
        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x, y, w, h);
        
        // Fill
        if (ratio > 0) {
            ctx.fillStyle = `rgba(${color}, 0.8)`;
            ctx.fillRect(x, y, w * ratio, h);
        }
        
        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
    },

    /**
     * Draw a star shape
     */
    star(ctx, x, y, outerR, innerR, points, color, rotation = 0, alpha = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        ctx.shadowColor = `rgba(${color}, ${alpha * 0.6})`;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.1})`;
        ctx.fill();
        
        ctx.restore();
    },

    /**
     * Draw a hexagon
     */
    hexagon(ctx, x, y, radius, color, rotation = 0, alpha = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        ctx.shadowColor = `rgba(${color}, ${alpha * 0.6})`;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6 - Math.PI / 6;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.1})`;
        ctx.fill();
        
        ctx.restore();
    }
};