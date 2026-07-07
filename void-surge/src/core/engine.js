/* ============================================
   VOID SURGE - Main Game Engine
   ============================================ */

const Engine = {
    // Canvas
    canvas: null,
    ctx: null,
    
    // Dimensions
    width: 0,
    height: 0,
    virtualWidth: 1280,
    virtualHeight: 720,
    scale: 1,
    
    // Timing
    lastTime: 0,
    deltaTime: 0,
    fps: 0,
    fpsCounter: 0,
    fpsTimer: 0,
    fixedDT: 1 / 60, // 60 updates per second
    accumulator: 0,
    
    // State
    isRunning: false,
    isPaused: false,
    gameState: 'menu', // menu, playing, gameover
    
    // Object pools
    entities: [],
    particles: [],
    projectiles: [],
    pickups: [],
    
    // Systems
    systems: [],
    
    /**
     * Initialize the engine
     */
    init(containerId = 'gameContainer') {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Setup canvas smoothing
        this.ctx.imageSmoothingEnabled = false;
        
        return this;
    },
    
    /**
     * Handle window resize
     */
    resize() {
        const container = this.canvas.parentElement;
        const w = container.clientWidth;
        const h = container.clientHeight;
        
        // Maintain aspect ratio
        const aspect = this.virtualWidth / this.virtualHeight;
        let renderW, renderH;
        
        if (w / h > aspect) {
            renderH = h;
            renderW = h * aspect;
        } else {
            renderW = w;
            renderH = w / aspect;
        }
        
        this.canvas.style.width = `${renderW}px`;
        this.canvas.style.height = `${renderH}px`;
        this.canvas.width = this.virtualWidth;
        this.canvas.height = this.virtualHeight;
        
        this.width = this.virtualWidth;
        this.height = this.virtualHeight;
        this.scale = renderW / this.virtualWidth;
    },
    
    /**
     * Start the game loop
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    },
    
    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent spiral of death
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        
        // FPS counter
        this.fpsCounter++;
        this.fpsTimer += this.deltaTime;
        if (this.fpsTimer >= 1) {
            this.fps = this.fpsCounter;
            this.fpsCounter = 0;
            this.fpsTimer = 0;
        }
        
        // Fixed timestep accumulator
        this.accumulator += this.deltaTime;
        
        // Update
        if (!this.isPaused) {
            while (this.accumulator >= this.fixedDT) {
                this.fixedUpdate(this.fixedDT);
                this.accumulator -= this.fixedDT;
            }
            
            // Render with interpolation
            this.render();
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    },
    
    /**
     * Fixed update - game logic
     */
    fixedUpdate(dt) {
        switch (this.gameState) {
            case 'playing':
                this.updatePlaying(dt);
                break;
        }
    },
    
    /**
     * Update game logic
     */
    updatePlaying(dt) {
        // Update all systems
        for (const system of this.systems) {
            if (system.update) {
                system.update(dt);
            }
        }
    },
    
    /**
     * Render the game
     */
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.drawBackground(ctx);
        
        // Render in layers
        switch (this.gameState) {
            case 'playing':
                this.renderPlaying(ctx);
                break;
            case 'menu':
                // Menu is rendered by HTML overlays
                break;
            case 'gameover':
                this.renderPlaying(ctx);
                break;
        }
        
        // FPS display (dev only)
        if (this.showFps) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.font = '12px monospace';
            ctx.fillText(`FPS: ${this.fps}`, 10, 20);
            ctx.fillText(`Entities: ${this.entities.length}`, 10, 35);
            ctx.restore();
        }
    },
    
    /**
     * Draw background with subtle stars
     */
    drawBackground(ctx) {
        // Deep space gradient
        const gradient = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width * 0.7
        );
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Star field (static, generated once)
        if (!this.stars) {
            this.stars = [];
            for (let i = 0; i < 150; i++) {
                this.stars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.5 + 0.1,
                    speed: Math.random() * 0.02 + 0.005
                });
            }
        }
        
        // Draw stars with parallax
        const time = Date.now() * 0.001;
        for (const star of this.stars) {
            const parallaxY = (time * star.speed * 60) % this.height;
            ctx.beginPath();
            ctx.arc(star.x, (star.y + parallaxY) % this.height, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        }
    },
    
    /**
     * Render playing state
     */
    renderPlaying(ctx) {
        // Sort entities by y for depth
        const sortedEntities = [...this.entities].sort((a, b) => a.y - b.y);
        
        // Draw camera offset
        ctx.save();
        if (Camera) {
            ctx.translate(-Camera.x + this.width / 2, -Camera.y + this.height / 2);
        }
        
        // Draw grid background
        this.drawGrid(ctx);
        
        // Draw pickups
        for (const p of this.pickups) {
            if (!p.active || p.blink) continue;
            const px = p.x - Camera.x + this.width / 2;
            const py = p.y - Camera.y + this.height / 2;
            const alpha = Math.max(0, Math.min(1, p.life / 3));
            Draw.neonDiamond(ctx, px, py, p.size, p.color, alpha * 0.8);
            Draw.glowCircle(ctx, px, py, p.size * 2, '255, 255, 0', 6, 0.15 * alpha);
        }
        
        // Draw entities
        for (const e of sortedEntities) {
            if (e.active) e.render(ctx);
        }
        
        // Draw projectiles
        for (const p of this.projectiles) {
            if (p.active) p.render(ctx);
        }
        
        // Draw particles on top
        Particles.render(ctx);
        
        ctx.restore();
        
        // Draw HUD (screen space)
        // HUD is handled by UI system
    },
    
    /**
     * Draw subtle grid
     */
    drawGrid(ctx) {
        const gridSize = 80;
        const viewX = Camera ? Camera.x - this.width / 2 : 0;
        const viewY = Camera ? Camera.y - this.height / 2 : 0;
        const viewW = this.width;
        const viewH = this.height;
        
        const startX = Math.floor(viewX / gridSize) * gridSize;
        const startY = Math.floor(viewY / gridSize) * gridSize;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        
        for (let x = startX; x < viewX + viewW + gridSize; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, viewY);
            ctx.lineTo(x, viewY + viewH);
            ctx.stroke();
        }
        
        for (let y = startY; y < viewY + viewH + gridSize; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(viewX, y);
            ctx.lineTo(viewX + viewW, y);
            ctx.stroke();
        }
    },
    
    /**
     * Register a system
     */
    registerSystem(system) {
        this.systems.push(system);
        if (system.init) system.init();
    },
    
    /**
     * Reset all entities and systems
     */
    reset() {
        this.entities = [];
        this.particles = [];
        this.projectiles = [];
        this.pickups = [];
        this.accumulator = 0;
    }
};