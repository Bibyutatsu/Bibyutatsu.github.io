# Bibhash Mitra Portfolio - Design System Guide

> **Purpose**: This document provides a complete specification of the design system used in `bibyutatsu.github.io`. Use this to maintain visual consistency across all related projects (e.g., Blogs, sub-pages).

---

## Table of Contents
1. [Color Palette](#1-color-palette)
2. [Typography](#2-typography)
3. [Spacing & Layout](#3-spacing--layout)
4. [Glassmorphism](#4-glassmorphism)
5. [Buttons](#5-buttons)
6. [Gradients](#6-gradients)
7. [Shadows](#7-shadows)
8. [Animations & Transitions](#8-animations--transitions)
9. [Dark Mode / Light Mode](#9-dark-mode--light-mode)
10. [Component Patterns](#10-component-patterns)
11. [Particle Animation (Canvas)](#11-particle-animation-canvas)
12. [Responsive Breakpoints](#12-responsive-breakpoints)

---

## 1. Color Palette

### Light Mode (Default)
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--base-color` | `#0D3580` | `13, 53, 128` | Primary brand color (deep blue) |
| `--base-color-hover` | `#0a2a66` | `10, 42, 102` | Darker hover state |
| `--base-color-light` | `#1761B0` | `23, 97, 176` | Lighter accent |
| `--accent-color` | `#D2292D` | `210, 41, 45` | Red accent (CTAs, highlights) |
| `--accent-color-hover` | `#b01f22` | `176, 31, 34` | Darker red for hover |
| `--background` | `#ffffff` | `255, 255, 255` | Page background |
| `--background-alt` | `#f2f2f5` | `242, 242, 245` | Alternate sections |
| `--border` | `#dcd9d9` | `220, 217, 217` | Subtle borders |
| `--heading` | `#181818` | `24, 24, 24` | Heading text |
| `--text` | `#454545` | `69, 69, 69` | Body text |
| `--text-light` | `#74808a` | `116, 128, 138` | Secondary/muted text |

### Dark Mode (`[data-theme="dark"]`)
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--base-color` | `#60a5fa` | `96, 165, 250` | Lighter blue for dark bg |
| `--base-color-hover` | `#3b82f6` | `59, 130, 246` | Hover state |
| `--base-color-light` | `#93c5fd` | `147, 197, 253` | Soft accent |
| `--accent-color` | `#f87171` | `248, 113, 113` | Coral red |
| `--accent-color-hover` | `#ef4444` | `239, 68, 68` | Hover state |
| `--background` | `#0f172a` | `15, 23, 42` | Dark slate |
| `--background-alt` | `#1e293b` | `30, 41, 59` | Alternate sections |
| `--background-dark` | `#020617` | `2, 6, 23` | Deepest dark |
| `--border` | `#334155` | `51, 65, 85` | Subtle borders |
| `--heading` | `#f1f5f9` | `241, 245, 249` | Light headings |
| `--text` | `#cbd5e1` | `203, 213, 225` | Body text |
| `--text-light` | `#94a3b8` | `148, 163, 184` | Muted text |

### CSS Implementation
```css
:root {
    --base-color: #0D3580;
    --base-color-rgb: 13, 53, 128;
    --base-color-hover: #0a2a66;
    --base-color-light: #1761B0;
    --accent-color: #D2292D;
    --accent-color-hover: #b01f22;
    --background: #fff;
    --background-rgb: 255, 255, 255;
    --background-alt: #f2f2f5;
    --background-dark: #181818;
    --border: #dcd9d9;
    --heading: #181818;
    --text: #454545;
    --text-light: #74808a;
}

[data-theme="dark"] {
    --base-color: #60a5fa;
    --base-color-rgb: 96, 165, 250;
    --base-color-hover: #3b82f6;
    --base-color-light: #93c5fd;
    --accent-color: #f87171;
    --accent-color-hover: #ef4444;
    --background: #0f172a;
    --background-rgb: 15, 23, 42;
    --background-alt: #1e293b;
    --background-dark: #020617;
    --border: #334155;
    --heading: #f1f5f9;
    --text: #cbd5e1;
    --text-light: #94a3b8;
}
```

---

## 2. Typography

### Font Stack
| Category | Font Family | Fallback | Usage |
|----------|-------------|----------|-------|
| **Body** | `'Inter'` | `sans-serif` | All body text |
| **Headings** | `'Outfit'` | `sans-serif` | h1-h6 elements |
| **Code** | `'Fira Code'` | `monospace` | Code blocks, tech tags |

### Font Sizes
| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| `body` | `16px` | `400` | Base size |
| `h1` (Hero) | `3.5em` | `900` | Uppercase, letter-spacing: 0.05em |
| `h2` (Section) | `2em` | `300` | With underline accent |
| `h3` (Card Title) | `1.3em - 1.5em` | `500-600` | Company names, project titles |
| `h4` (Subtitle) | `1em - 1.2em` | `400` | Job titles, dates |
| `p` (Body) | `0.9em - 1em` | `400` | Line-height: 1.6 |
| Small/Muted | `0.8em - 0.9em` | `400` | `--text-light` color |

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
```

---

## 3. Spacing & Layout

### Section Padding
| Context | Padding |
|---------|---------|
| Standard Section | `50px 15px` / `75px 15px` |
| Hero Section | `15px` (with `min-height: 100vh`) |
| Mobile Adjustments | `padding: 100px 15px` (breakpoint <992px) |

### Container Max-Widths
| Element | Max-Width |
|---------|-----------|
| Hero Container | `1000px` |
| Content Sections | `1200px` |
| Narrow Content | `800px` |
| Cards Grid | `repeat(auto-fit, minmax(280px, 1fr))` |

### Gap / Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `5px` | Tight spacing |
| `sm` | `10px` | List items |
| `md` | `20px` | Card padding, gaps |
| `lg` | `30px` | Section margins |
| `xl` | `50px` | Hero container padding |
| `xxl` | `60px` | Hero gap (image ↔ content) |

---

## 4. Glassmorphism

### Core Mixin (SCSS)
```scss
@mixin glass-card {
    // Dark Mode Default
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

    // Light Mode Override
    html[data-theme='light'] & {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 2px solid rgba(13, 53, 128, 0.15); // Blue-tinted border
        box-shadow: 0 10px 40px rgba(13, 53, 128, 0.15);
    }
}
```

### CSS Equivalent
```css
/* Dark Mode Glass */
.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border-radius: 12px; /* Common radius */
}

/* Light Mode Glass */
html[data-theme='light'] .glass-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 2px solid rgba(13, 53, 128, 0.15);
    box-shadow: 0 10px 40px rgba(13, 53, 128, 0.15);
}
```

### Usage Guidelines
- Apply to: Cards, Hero Container, Timeline blocks, Skill categories
- Always use with `border-radius: 12px` or `20px` (Hero)
- Ensure parent has a visible gradient background for effect to show

---

## 5. Buttons

### Primary CTA Button (`.btn-rounded-white`)
```css
.btn-rounded-white {
    display: inline-block;
    color: #fff;
    padding: 15px 25px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 30px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(4px);
    transition: all 0.5s ease;
    text-decoration: none;
}

.btn-rounded-white:hover {
    color: #fff;
    background: linear-gradient(to right, var(--accent-color), var(--accent-color-hover));
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(210, 41, 45, 0.4);
}
```

### Glassmorphic Button (`.btn-glassy`)
```css
.btn-glassy {
    /* Inherits glass-card styles */
    padding: 8px 20px;
    color: var(--text);
    font-size: 0.9em;
    cursor: pointer;
    border-radius: 50px; /* Pill shape */
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.5s ease;
    outline: none;
}

.btn-glassy:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    color: #fff;
}

/* Light Mode */
html[data-theme='light'] .btn-glassy {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.05);
    color: var(--base-color);
}

html[data-theme='light'] .btn-glassy:hover {
    background: rgba(255, 255, 255, 0.8);
    color: var(--base-color-hover);
}
```

---

## 6. Gradients

### Background Gradients
```css
/* Dark Mode - Deep Space */
body {
    background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
    background-attachment: fixed;
}

/* Light Mode - Soft Sky */
html[data-theme='light'] body {
    background: radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%);
    background-attachment: fixed;
}
```

### Accent Gradients
```css
/* Red CTA Gradient (Hover) */
background: linear-gradient(to right, #D2292D, #b01f22);

/* Glass Gradient (Subtle) */
background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
```

---

## 7. Shadows

### Standard Shadows
```css
--shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
--shadow-large: 0 3px 6px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.15);

/* Dark Mode (deeper) */
--shadow: 0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.6);
--shadow-large: 0 3px 6px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.5);
```

### Special Shadows
```css
/* Profile Image Glow */
box-shadow: 0 0 40px rgba(210, 41, 45, 0.3), 0 0 80px rgba(13, 53, 128, 0.2);

/* Card Hover */
box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

/* Glass Card (Light Mode) */
box-shadow: 0 10px 40px rgba(13, 53, 128, 0.15);
```

---

## 8. Animations & Transitions

### Default Transition
```css
transition: all 0.5s ease;
```

### Reveal on Scroll
```css
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
}

.reveal.active {
    opacity: 1;
    transform: translateY(0);
}
```

### Profile Glow Animation
```css
@keyframes profileGlow {
    0% {
        box-shadow: 0 0 40px rgba(210, 41, 45, 0.3), 0 0 80px rgba(13, 53, 128, 0.2);
    }
    100% {
        box-shadow: 0 0 50px rgba(210, 41, 45, 0.4), 0 0 100px rgba(13, 53, 128, 0.3);
    }
}

/* Apply */
animation: profileGlow 3s ease-in-out infinite alternate;
```

### Hover Effects
```css
/* Lift Effect */
transform: translateY(-2px);
/* or */ transform: translateY(-3px);

/* Scale (Profile Image) */
transform: scale(1.03);
```

---

## 9. Dark Mode / Light Mode

### Theme Toggle Implementation
```javascript
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const icon = toggle.querySelector('i');

// Load saved preference
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
});

function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fa fa-sun-o' : 'fa fa-moon-o';
}
```

### CSS Structure
- All color tokens use CSS Variables (`var(--token)`)
- Light mode overrides use `html[data-theme='light'] &` selector
- Global gradient changes via `html[data-theme='light'] body { ... }`

---

## 10. Component Patterns

### Section Heading
```html
<h2 class="heading">Section Title</h2>
```
```css
.heading {
    position: relative;
    display: inline-block;
    font-size: 2em;
    font-weight: 300;
    margin: 0 0 30px 0;
}

.heading::after {
    position: absolute;
    content: '';
    top: 100%;
    height: 3px;
    width: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: var(--accent-color);
}
```

### Card Grid
```css
.cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    /* Apply glass-card mixin */
    border-radius: 12px;
    padding: 20px;
    transition: all 0.5s ease;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
```

### Timeline (Vertical)
- Center line: `3px` width, gradient from `--base-color` to transparent
- Timeline points: `16px` dot with `3px` white border, `--base-color` fill
- Content blocks: Glass cards with `margin-left: 70px` (collapsed view)

---

## 11. Particle Animation (Canvas)

### Configuration
```javascript
const particleCount = 60; // Adjust for performance
const particleSize = { min: 3, max: 5 }; // px
const particleOpacity = { min: 0.7, max: 1.0 };
const connectionDistance = 150; // px
const velocity = 0.5; // Speed multiplier
```

### Color Logic
```javascript
const isDark = html.getAttribute('data-theme') === 'dark';
const color = isDark ? '255, 255, 255' : '13, 53, 128'; // White (dark) / Blue (light)
```

### Drawing
```javascript
// Particles
ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

// Connections
ctx.strokeStyle = `rgba(${color}, ${1 - dist / 100})`;
ctx.lineWidth = 1;
```

---

## 12. Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| **Large** | >992px | Default layout |
| **Medium** | ≤992px | Hero stacks vertically, smaller fonts |
| **Tablet** | ≤768px | Mobile menu, hide lead-down arrow |
| **Mobile** | ≤480px | Smallest fonts, compact padding |

### Key Media Queries
```css
/* Tablet */
@media (max-width: 992px) {
    .hero-container {
        flex-direction: column;
        text-align: center;
        gap: 30px;
    }
    #lead {
        min-height: 100vh;
        padding: 100px 15px;
    }
}

/* Mobile */
@media (max-width: 768px) {
    header { position: fixed; display: none; }
    #mobile-menu-open, #mobile-menu-close { display: block; }
    #lead-down { display: none; }
}

/* Small Mobile */
@media (max-width: 480px) {
    #lead-content h1 { font-size: 1.5em; }
    #lead-content h2 { font-size: 1em; }
}
```

---

## Quick Start Checklist

1. **Include Google Fonts** (Inter, Outfit, Fira Code)
2. **Copy CSS Variables** (`:root` and `[data-theme="dark"]`)
3. **Implement Theme Toggle** (see Section 9)
4. **Apply Global Background** (radial gradients with `background-attachment: fixed`)
5. **Use `.glass-card` class** for all cards
6. **Add `.reveal` class** for scroll animations
7. **Include Particle Canvas** with theme-aware colors

---

*Last Updated: January 2026*
*Based on: bibyutatsu.github.io*
