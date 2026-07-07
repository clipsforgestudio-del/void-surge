# VOID SURGE - Analyse & Concept

## Analyse du Marché

### Succès indépendants récents analysés :
- **Vampire Survivors** → $200M+, solo dev, boucle infinie, viral TikTok
- **Balatro** → 1M+ ventes mois 1, poker roguelike, satisfaction extrême
- **Brotato** → Solo dev, builds fous, rejouabilité massive
- **Hades** → Narration + roguelike parfait
- **Slay the Spire** → Deckbuilding, profondeur stratégique
- **Dave the Diver** → Mix genres, surprises constantes

### Tendances 2026 :
- Roguelikes/roguelites dominent
- Survivors-like saturé → besoin de différenciation
- Jeux "satisfying" explosent sur TikTok
- Build-crafting et synergies profondes
- Collection et déblocages permanents

### Pourquoi les jeux percent sur TikTok/YouTube :
- Moments "satisfying" visuels (5-15 sec)
- Big numbers / écrans qui explosent
- Builds fous et inattendus
- "One more run" dopamine loop
- High skill ceiling visible

---

## Concept #1 : VOID SURGE ⭐ GAGNANT

### Pitch :
Action-roguelike dans le vide cosmique. Survivez aux vagues d'entités géométriques néon. Chaque run construit un build unique avec des synergies explosives.

### Gameplay :
- **Visée active** (souris) → pas d'auto-aim, skill-based
- **Build crafting** → 100+ upgrades, synergies qui transforment visuellement
- **Momentum** → combo multiplier qui augmente récompenses ET difficulté
- **Screen clear** → ultimate qui charge et explose (TikTok gold)
- **Risk/Reward** → coffre gamble tous les 5 waves

### Style visuel :
- Pixel art néon sur fond noir profond
- Personnages : silhouettes lumineuses avec trails
- Ennemis : formes géométriques néon
- Particules, screen shake, time slow, color flash
- TRÈS rapide à produire (formes simples + glow)

### Note :
| Critère | Note |
|---------|------|
| Gameplay | 9/10 |
| Originalité | 8/10 |
| Fun | 10/10 |
| Viralité | 10/10 |
| Temps dév. | 9/10 |
| Potentiel Steam | 9/10 |
| Potentiel TikTok | 10/10 |
| Potentiel YouTube | 10/10 |
| Potentiel Twitch | 9/10 |
| Facilité contenu | 9/10 |
| Complexité tech | 8/10 |
| Rentabilité | 9/10 |
| **MOYENNE** | **9.25/10** |

---

## Concept #2 : Spell Forge

Deckbuilding + craft de sorts. Trop similaire à Balatro/Slay the Spire. Moins viral.

## Concept #3 : Neon Drift

Racing arcade néon. Viral mais scope trop large pour solo dev.

---

## Architecture Technique

### Stack : HTML5 Canvas + JavaScript vanilla
- Zéro dépendance
- 120 FPS natif
- Steam via Electron
- Steam Deck compatible
- Pas de build step

### Structure :
```
void-surge/
├── index.html          # Entry point
├── css/
│   └── style.css       # Styles + UI
├── src/
│   ├── main.js         # Game loop, init
│   ├── core/
│   │   ├── engine.js   # Canvas, timing, FPS
│   │   ├── input.js    # Keyboard + mouse
│   │   ├── camera.js   # Screen shake, follow
│   │   └── audio.js    # Web Audio API
│   ├── entities/
│   │   ├── player.js   # Player class
│   │   ├── enemy.js    # Enemy base + types
│   │   └── projectile.js
│   ├── systems/
│   │   ├── spawner.js  # Wave management
│   │   ├── combat.js   # Damage, knockback
│   │   ├── upgrade.js  # Upgrade/level system
│   │   ├── particles.js # Particle system
│   │   └── ui.js       # HUD, menus
│   ├── data/
│   │   ├── enemies.js  # Enemy definitions
│   │   ├── upgrades.js # Upgrade pool
│   │   └── waves.js    # Wave configurations
│   └── utils/
│       ├── math.js     # Vector math, random
│       └── draw.js     # Drawing helpers
└── assets/             # Empty for now (generated at runtime)