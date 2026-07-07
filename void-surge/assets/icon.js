/* ============================================
   VOID SURGE - Icon Generator (PNG from Canvas)
   Run with: node assets/icon.js
   ============================================ */

// This generates a simple icon using pure JS
// For now, we create a data URL icon generator

function generateIconSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a1a"/>
            <stop offset="100%" style="stop-color:#000000"/>
        </linearGradient>
        <linearGradient id="glow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00ffff"/>
            <stop offset="100%" style="stop-color:#0088ff"/>
        </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="256" height="256" fill="url(#bg)"/>
    <!-- Stars -->
    <circle cx="30" cy="40" r="1.5" fill="rgba(255,255,255,0.5)"/>
    <circle cx="200" cy="60" r="1" fill="rgba(255,255,255,0.3)"/>
    <circle cx="50" cy="200" r="1" fill="rgba(255,255,255,0.4)"/>
    <circle cx="220" cy="180" r="1.5" fill="rgba(255,255,255,0.3)"/>
    <circle cx="150" cy="30" r="1" fill="rgba(255,255,255,0.5)"/>
    <!-- Outer glow -->
    <circle cx="128" cy="128" r="80" fill="none" stroke="rgba(0,255,255,0.1)" stroke-width="2"/>
    <circle cx="128" cy="128" r="60" fill="none" stroke="rgba(0,255,255,0.2)" stroke-width="1.5"/>
    <!-- Ship -->
    <polygon points="128,50 85,180 128,150 171,180" stroke="url(#glow)" stroke-width="3" fill="rgba(0,255,255,0.15)"/>
    <!-- Center diamond -->
    <polygon points="128,95 145,128 128,161 111,128" fill="#00ffff" opacity="0.8"/>
    <!-- Shooting lines -->
    <line x1="128" y1="95" x2="128" y2="40" stroke="#00ffff" stroke-width="2" opacity="0.6"/>
    <line x1="145" y1="128" x2="200" y2="128" stroke="#00ffff" stroke-width="1.5" opacity="0.3"/>
    <!-- Text -->
    <text x="128" y="230" text-anchor="middle" fill="#00ffff" font-family="monospace" font-size="18" font-weight="bold" opacity="0.8">VOID SURGE</text>
</svg>`;
}

console.log('VOID SURGE Icon Generator');
console.log('========================');
console.log('');
console.log('To generate icons:');
console.log('1. Save the SVG above as assets/icon.svg');
console.log('2. Use an online converter (https://convertio.co/svg-ico/) to create:');
console.log('   - assets/icon.ico (for Windows installer)');
console.log('   - assets/icon.png 256x256 (for Electron)');
console.log('');
console.log('Or install npm package "svg-to-ico" and run:');
console.log('   npx svg-to-ico assets/icon.svg assets/icon.ico');
console.log('');
console.log('=== SVG Content (save as icon.svg) ===');
console.log(generateIconSVG());