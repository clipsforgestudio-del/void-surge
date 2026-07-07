/* ============================================
   VOID SURGE - Math Utilities
   ============================================ */

const Vec2 = {
    /**
     * Create a 2D vector
     */
    create(x = 0, y = 0) {
        return { x, y };
    },

    /**
     * Add two vectors
     */
    add(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    },

    /**
     * Subtract b from a
     */
    sub(a, b) {
        return { x: a.x - b.x, y: a.y - b.y };
    },

    /**
     * Scale vector by scalar
     */
    scale(v, s) {
        return { x: v.x * s, y: v.y * s };
    },

    /**
     * Get vector magnitude
     */
    magnitude(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    },

    /**
     * Normalize vector to unit length
     */
    normalize(v) {
        const mag = this.magnitude(v);
        if (mag === 0) return { x: 0, y: 0 };
        return { x: v.x / mag, y: v.y / mag };
    },

    /**
     * Distance between two points
     */
    distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Lerp between two values
     */
    lerp(a, b, t) {
        return a + (b - a) * Math.min(1, Math.max(0, t));
    },

    /**
     * Random float between min and max
     */
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Convert angle to direction vector
     */
    angleToVec(angle) {
        return { x: Math.cos(angle), y: Math.sin(angle) };
    },

    /**
     * Get angle from point a to point b
     */
    angleBetween(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    },

    /**
     * Random point on circle edge
     */
    randomOnCircle(radius) {
        const angle = Math.random() * Math.PI * 2;
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }
};

/**
 * Simple seeded random (for consistent testing)
 */
class SeededRandom {
    constructor(seed = Date.now()) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    range(min, max) {
        return this.next() * (max - min) + min;
    }
}

/**
 * Easing functions
 */
const Easing = {
    easeOutQuad(t) { return t * (2 - t); },
    easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    easeOutCubic(t) { return (--t) * t * t + 1; },
    easeOutElastic(t) {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    }
};