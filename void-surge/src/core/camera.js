/* ============================================
   VOID SURGE - Camera System
   ============================================ */

const Camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    
    // Shake
    shakeIntensity: 0,
    shakeDuration: 0,
    shakeTimer: 0,
    shakeOffsetX: 0,
    shakeOffsetY: 0,
    
    // Zoom
    zoom: 1,
    targetZoom: 1,
    
    // Smoothing
    smoothSpeed: 8,
    
    /**
     * Initialize camera
     */
    init() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.zoom = 1;
        this.targetZoom = 1;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeTimer = 0;
    },
    
    /**
     * Update camera
     */
    update(dt) {
        // Smooth follow
        this.x += (this.targetX - this.x) * this.smoothSpeed * dt;
        this.y += (this.targetY - this.y) * this.smoothSpeed * dt;
        
        // Zoom smoothing
        this.zoom += (this.targetZoom - this.zoom) * this.smoothSpeed * dt;
        
        // Shake
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            const intensity = this.shakeIntensity * (this.shakeTimer / this.shakeDuration);
            this.shakeOffsetX = (Math.random() * 2 - 1) * intensity;
            this.shakeOffsetY = (Math.random() * 2 - 1) * intensity;
        } else {
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
        }
    },
    
    /**
     * Set camera target position
     */
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    },
    
    /**
     * Trigger screen shake
     */
    shake(intensity = 5, duration = 0.3) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTimer = duration;
    },
    
    /**
     * Get camera position with shake offset
     */
    getPosition() {
        return {
            x: this.x + this.shakeOffsetX,
            y: this.y + this.shakeOffsetY
        };
    },
    
    /**
     * Reset camera
     */
    reset() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.zoom = 1;
        this.targetZoom = 1;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeTimer = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }
};