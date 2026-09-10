# Visualizer Calculator

Interactive calculator built with React, TypeScript, and Vite featuring real-time particle visualizations, multiple themes, and scientific computing capabilities.

## Features

- **Standard & Scientific modes** — switch between basic arithmetic and advanced functions (sin, cos, tan, sqrt, log, ln, abs)
- **Graphing mode** — plot mathematical functions (e.g., `sin(x)`, `x^2 + 1`) with pan & zoom support
- **Particle visualizer** — animated particles triggered on each button press, with theme-dependent colors and glow effects
- **4 visual themes** — Cyberpunk Neon, Glass Dream, Retro CRT, Aurora Light
- **Sound effects** — synthesized audio feedback for clicks, operators, and success/error states
- **Calculation history** — slide-out drawer with timestamped records, click-to-reuse
- **Keyboard support** — full keyboard input for numbers, operators, and navigation
- **Accessibility** — ARIA labels on all interactive elements for screen reader compatibility
- **Persistent preferences** — theme, mute state, and layout mode saved to localStorage

## Project Structure

```
src/
├── App.tsx                 # Main app orchestrator (state, keyboard, layout)
├── main.tsx                # Entry point
├── components/
│   ├── Buttons.tsx         # Calculator button grid with aria-labels
│   ├── HistoryDrawer.tsx   # Slide-out history panel
│   └── Visualizer.tsx      # Canvas-based particle & graph renderer
├── utils/
│   ├── mathParser.ts       # Tokenizer, recursive-descent parser, AST evaluator
│   └── audioSynth.ts       # Web Audio API sound synthesis
└── css/
    ├── index.css            # Global styles and theme definitions
    └── App.css              # Component layout styles
```

## Tech Stack

- **React 18** with TypeScript
- **Vite 8** for dev server and bundling
- **Bootstrap 5** (utility classes only)
- **Web Audio API** for synthesized sound effects
- **Canvas API** for real-time visualizations

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
