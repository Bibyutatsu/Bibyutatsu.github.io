# Bibhash Mitra - Portfolio Website

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?logo=github)](https://bibyutatsu.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

A modern, responsive portfolio website for **Bibhash Mitra**, Senior Data Scientist & AI/ML Expert. Built with a focus on **glassmorphism**, **dark/light theming**, and **smooth interactions**.

🔗 **Live Site**: [bibyutatsu.github.io](https://bibyutatsu.github.io)

---

## ✨ Features

### Visual Design
- **🌙 Dark Mode / ☀️ Light Mode** - Toggle between "Deep Space" dark theme and a clean light theme. Preference saved to LocalStorage.
- **🪟 Glassmorphism** - Frosted glass cards with `backdrop-filter` blur effects throughout the site.
- **🌌 Dynamic Gradient Backgrounds** - Radial gradients that flow seamlessly across all sections.
- **✨ Particle Animation** - Interactive canvas-based particle network in the hero section (white particles in dark mode, blue in light mode).
- **🎨 Modern Typography** - Google Fonts: Outfit (headings), Inter (body), Fira Code (code/tags).

### User Experience
- **📂 Collapsible Timelines** - Experience and Internship sections can be expanded/collapsed individually or all at once.
- **📊 Skills Radar Chart** - Interactive Chart.js radar visualization of core competencies.
- **🔄 Scroll Reveal Animations** - Elements fade in smoothly as you scroll using IntersectionObserver.
- **📱 Fully Responsive** - Mobile-first design with adaptive layouts for all screen sizes.
- **🔗 Quick Navigation** - Sticky header with smooth-scroll anchor links.

### Technical
- **⚡ No jQuery** - Pure Vanilla JavaScript (ES6+) for maximum performance.
- **🎨 Sass/SCSS** - Modular stylesheets with CSS Variables for theming.
- **📦 Gulp Build System** - Automated Sass compilation and JS minification.
- **🔍 SEO Optimized** - Open Graph and Twitter Card meta tags for social sharing.

---

## 🗂️ Project Structure

```
.
├── css/
│   └── styles.css          # Compiled CSS
├── files/
│   ├── DESIGN_SYSTEM_GUIDE.md  # Comprehensive design system documentation
│   └── ResumeAssets.xlsx   # Data source for certifications/publications
├── images/
│   ├── Logo/               # Company logos
│   └── img_profile.jpg     # Profile photo
├── js/
│   ├── scripts.js          # Main JavaScript (unminified)
│   ├── scripts.min.js      # Minified for production
│   └── data.js             # Auto-generated data from Excel
├── libs/                   # Third-party libraries (Font Awesome, Chart.js)
├── scss/
│   └── styles.scss         # Source SCSS
├── index.html              # Main page
├── gulpfile.js             # Build configuration
└── package.json            # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Bibyutatsu/Bibyutatsu.github.io.git
cd Bibyutatsu.github.io

# Install dependencies
npm install

# Start development (watches for SCSS/JS changes)
npm run watch
# OR
npx gulp watch
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run watch` | Watch for changes and auto-compile |
| `npx gulp styles` | Compile SCSS to CSS |
| `npx gulp scripts` | Minify JavaScript |
| `npx gulp` | Run all build tasks |

---

## 🎨 Design System

A comprehensive design system guide is available at [`files/DESIGN_SYSTEM_GUIDE.md`](files/DESIGN_SYSTEM_GUIDE.md).

### Key Design Tokens

#### Colors
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| Base Color | `#0D3580` (Deep Blue) | `#60a5fa` (Sky Blue) |
| Accent Color | `#D2292D` (Red) | `#f87171` (Coral) |
| Background | `#ffffff` | `#0f172a` |

#### Glassmorphism
```css
/* Dark Mode */
.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Light Mode */
html[data-theme='light'] .glass-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(13, 53, 128, 0.15);
}
```

---

## 📝 Content Sections

| Section | Description |
|---------|-------------|
| **Hero** | Profile photo, name, tagline, and CTA buttons in a glass container |
| **About** | Bio with animated stats counters |
| **Experience** | Collapsible timeline with company logos and project details |
| **Internships** | Similar timeline for internship history |
| **Education** | Academic credentials |
| **Papers & Patents** | Publication cards with external links |
| **Certifications** | Grid of certification badges |
| **Skills** | Radar chart + categorized skill grid |
| **Contact** | Glassmorphic connect card with social links |

---

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `scss/styles.scss`:

```scss
:root {
    --base-color: #0D3580;      // Your primary color
    --accent-color: #D2292D;    // Your accent color
    // ... other tokens
}
```

### Modifying the Theme Toggle
The toggle logic is in `js/scripts.js`. It saves preference to `localStorage` and updates the `data-theme` attribute on `<html>`.

### Adding New Sections
1. Add HTML in `index.html`
2. Add a navigation link in `<header>`
3. Style in `scss/styles.scss`
4. Add `.reveal` class for scroll animation

---

## 📄 License

This project is based on [DevPortfolio](https://github.com/RyanFitzgerald/devportfolio-template) by Ryan Fitzgerald and is licensed under the [MIT License](LICENSE.md).

---

## 🙏 Credits

- **Original Template**: [Ryan Fitzgerald](https://github.com/RyanFitzgerald/devportfolio-template)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Inter, Outfit, Fira Code)
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/)

---

*Last Updated: January 2026*
