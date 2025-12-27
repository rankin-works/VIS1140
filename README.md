# VIS1140 Design Processes I

An interactive presentation application for teaching design fundamentals, built with React and Vite.

## Features

- **17 Interactive Slides** covering design processes, tools, and workflows
- **Interactive Demos** including:
  - Vector vs Raster comparison with zoom
  - Live SVG code editor with syntax highlighting
  - Bezier curve demonstrations
- **Keyboard Navigation** using arrow keys
- **Responsive Design** for desktop and mobile
- **Animated Background** with floating gradient orbs

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.jsx              # Main app with navigation
├── main.jsx             # Entry point
├── assets/              # Images and SVG icons
├── components/
│   ├── demos/           # Interactive demo components
│   └── slides/          # Individual slide components
├── data/
│   └── slides.js        # Slide configuration
└── styles/
    ├── global.css       # Global styles and animations
    └── theme.js         # Colors, gradients, design tokens
```

## Slides

1. Title
2. Welcome / Instructor Introduction
3. The Design Process
4. Adobe Creative Cloud Tools
5. Vector vs Raster Comparison
6. Interactive Demo
7. SVG Code Editor
8. Math Behind Vector Graphics
9. Vector Graphics Characteristics
10. Raster Image Characteristics
11. File Formats
12. Workflow
13. Class Requirements
14. Submitting Assignments
15. Critique Guidelines
16. Course Policy
17. Questions

## Adding New Slides

1. Create a new component in `src/components/slides/`
2. Export it from `src/components/slides/index.jsx`
3. Add the slide type mapping in `slideComponents`
4. Add the slide to `src/data/slides.js`

## Tech Stack

- **React 18** - UI framework
- **Vite 6** - Build tool
- **Rive** - Animations (optional)

## Navigation

- **Arrow Keys** - Navigate between slides
- **Mouse** - Click navigation buttons (appear on hover at bottom)
