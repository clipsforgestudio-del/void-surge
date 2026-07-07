/* ============================================
   VOID SURGE - Input Manager
   ============================================ */

const Input = {
    // Keyboard state
    keys: {},
    keysJustPressed: {},
    keysJustReleased: {},
    
    // Mouse state
    mouse: {
        x: 0,
        y: 0,
        worldX: 0,
        worldY: 0,
        buttons: [false, false, false],
        justPressed: [false, false, false],
        justReleased: [false, false, false]
    },
    
    // Previous state for edge detection
    prevKeys: {},
    prevMouse: [false, false, false],
    
    /**
     * Initialize input handlers
     */
    init() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keysJustPressed[e.code] = true;
            }
            this.keys[e.code] = true;
            e.preventDefault();
        });
        
        window.addEventListener('keyup', (e) => {
            this.keysJustReleased[e.code] = true;
            this.keys[e.code] = false;
            e.preventDefault();
        });
        
        // Mouse
        const canvas = Engine.canvas;
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = Engine.width / rect.width;
            const scaleY = Engine.height / rect.height;
            
            this.mouse.x = (e.clientX - rect.left) * scaleX;
            this.mouse.y = (e.clientY - rect.top) * scaleY;
            
            // World coordinates (with camera)
            if (Camera) {
                this.mouse.worldX = this.mouse.x + Camera.x - Engine.width / 2;
                this.mouse.worldY = this.mouse.y + Camera.y - Engine.height / 2;
            } else {
                this.mouse.worldX = this.mouse.x;
                this.mouse.worldY = this.mouse.y;
            }
        });
        
        canvas.addEventListener('mousedown', (e) => {
            if (!this.mouse.buttons[e.button]) {
                this.mouse.justPressed[e.button] = true;
            }
            this.mouse.buttons[e.button] = true;
        });
        
        canvas.addEventListener('mouseup', (e) => {
            this.mouse.justReleased[e.button] = true;
            this.mouse.buttons[e.button] = false;
        });
        
        // Prevent context menu
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        return this;
    },
    
    /**
     * Update input state (call once per frame)
     */
    update() {
        // Clear one-shot flags
        this.keysJustPressed = {};
        this.keysJustReleased = {};
        this.mouse.justPressed = [false, false, false];
        this.mouse.justReleased = [false, false, false];
    },
    
    /**
     * Check if a key is currently held down
     */
    isDown(code) {
        return this.keys[code] === true;
    },
    
    /**
     * Check if a key was just pressed this frame
     */
    justPressed(code) {
        return this.keysJustPressed[code] === true;
    },
    
    /**
     * Check if a key was just released this frame
     */
    justReleased(code) {
        return this.keysJustReleased[code] === true;
    },
    
    /**
     * Check if mouse button is held
     */
    isMouseDown(button = 0) {
        return this.mouse.buttons[button];
    },
    
    /**
     * Check if mouse button was just pressed
     */
    isMouseJustPressed(button = 0) {
        return this.mouse.justPressed[button];
    },
    
    /**
     * Get mouse position in screen coordinates
     */
    getMouseScreen() {
        return { x: this.mouse.x, y: this.mouse.y };
    },
    
    /**
     * Get mouse position in world coordinates
     */
    getMouseWorld() {
        return { x: this.mouse.worldX, y: this.mouse.worldY };
    }
};