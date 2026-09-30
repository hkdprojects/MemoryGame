# 🃏 Memory Game

A clean, responsive, and feature-rich web-based Memory Card Game built with vanilla JavaScript, HTML5, and CSS3. Features a unique skeuomorphic/hand-drawn visual style, custom animations, realistic sound effects, and persistent local stats tracking.

![Memory Game Preview](https://via.placeholder.com/800x400?text=Memory+Game+Preview) <!-- Replace with an actual screenshot of your game -->

---

## ✨ Features

- **🎮 Core Gameplay Mechanics**
  - Interactive 3D card-flip animations with state-locking to prevent rapid-click exploits.
  - **Single-Card Unflip:** Click an opened card again before picking a second one to safely unflip it without losing a move.
  - **Dynamic Point System:** Earn points for successful matches (+15), lose points for mismatches (-5), and take hints (-5).
  - **Smart Hint System:** Briefly highlights unmatched matching pairs to guide stuck players.

- **📊 Persistence & Local Progression**
  - **High Score Tracking:** Automatically calculates and saves your personal best score to `localStorage`.
  - **Lowest Moves Tracking:** Records the fewest moves taken to complete the game.
  - **Minimalist Tooltip UI:** Hover over the trophy icon to instantly view stat labels without cluttering the main screen.

- **🎵 Audio & Visual Polish**
  - Separate toggles for background music and tactile touch/button audio effects.
  - Custom win and game-over sound triggers with non-looping logic.
  - Victory celebration with interactive confetti canvas particle effects.

- **📱 Fully Responsive UI**
  - Designed with an intuitive, minimalist skeuomorphic interface that looks great on both mobile and desktop screens.
  - Accessible modal dialogs for pausing, game settings, and end-of-game summaries.

---

## 🛠️ Built With

- **HTML5** — Semantic elements & SVG graphics
- **CSS3** — Custom properties, flexbox/grid layout, 3D CSS transforms, and pseudo-element tooltips
- **JavaScript (ES6+)** — Modular DOM manipulation, state management, and `localStorage` API
- **[Canvas Confetti](https://github.com/catdad/canvas-confetti)** — Lightweight victory particle animation

---

## 🚀 Getting Started

### Prerequisites
All you need is a modern web browser (Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge).

### Installation & Local Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/your-username/memory-game.git](https://github.com/your-username/memory-game.git)
