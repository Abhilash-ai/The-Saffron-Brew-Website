# ☕ The Saffron Brew — Cozy Cafe PWA

[![Live Demo](https://img.shields.io/badge/Demo-Live-orange?style=for-the-badge)](https://dist-nine-jade-51.vercel.app)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com)

Welcome to **The Saffron Brew** — a premium, highly interactive single-page cafe web application. Inspired by childhood nostalgia, warm conversations, Japanese neighborhood cafes, and modern luxury design. 

The website behaves like a standard immersive parallax experience on desktop and shifts into an installable **mobile-native Progressive Web App (PWA)** on mobile devices.

🔗 **Live URL:** [https://dist-nine-jade-51.vercel.app](https://dist-nine-jade-51.vercel.app)

---

## ✨ Features & Micro-Interactions

*   **Interactive Mascot ("Saffy"):** Built using inline SVG paths (no static image files). Saffy blinks, breathes, waves, and gives dynamic speeches/recipes with Web Audio "blip" sounds when clicked.
*   **Customization Order Drawer:** Click "Add to Cart" on items to open an option selection grid. Choose sizes, milk types, sweeteners, and add-ons. Fits standard coffee kiosk user experiences.
*   **3D Loyalty Card (Brew Card):** A credit-card mockup that tilts dynamically on cursor movement. Order coffees to see ink stamps drop with a rotating stamp animation and Web Audio thud sounds. Reaching 6 stamps unlocks a free coffee!
*   **Seating Wizard Reservation:** A 3-step booking wizard where guests can click specific tables on an interactive birds-eye SVG floor map of the cafe.
*   **Synthesized Audio Feedback:** Sounds are programmatically generated using the browser's Web Audio API (saving network bandwidth, no audio assets to download).
*   **Scroll-Driven Animations:** GSAP & ScrollTrigger drive parallax background movement, slide-in story grids, and floating particle fields.
*   **PWA Installable:** Supports offline assets caching and custom manifests, allowing users to "Add to Home Screen" on iOS/Android.

---

## 🛠️ Tech Stack

*   **Bundler:** Vite 5 (Optimized for Node 20.14+ compatibility)
*   **Core:** Semantic HTML5, Vanilla CSS3 (Custom Design System Variables), Vanilla ES Modules JavaScript
*   **Animations:** GSAP + ScrollTrigger
*   **Sound:** Web Audio API (Frequency oscillator synthesis)
*   **Hosting:** Vercel

---

## 💻 Local Installation & Setup

To clone, compile, and run this project locally:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Abhilash-ai/The-Saffron-Brew-Website.git
    cd The-Saffron-Brew-Website
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start Local Development Server:**
    ```bash
    npm run dev
    ```
    *Vite will start the server (usually at `http://localhost:5173/` or `5174/` if 5173 is locked).*

4.  **Build Production Bundle:**
    ```bash
    npm run build
    ```
    *This generates an optimized `dist` folder ready for static hosting.*
