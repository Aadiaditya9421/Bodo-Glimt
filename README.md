# Veridex — AI Authentication

> **Team Bodo-Glimt · Hackathon 2026**  
> Detect AI-generated images and text in under 3 seconds using Groq LLaMA 3.3 70B.

---

## Project Structure

```
veridex/
│
├── index.html              ← Entry point (open this in browser)
│
├── css/
│   ├── tokens.css          ← Design tokens, reset, keyframes
│   ├── layout.css          ← Nav, sections, footer
│   ├── home.css            ← Hero, feature grid, how-it-works steps
│   ├── authenticator.css   ← Analyzer page: panels, inputs, tabs, API banner
│   ├── results.css         ← Score cards, ring gauges, highlights, table
│   └── responsive.css      ← All breakpoints (960px, 700px, 400px)
│
├── js/
│   ├── main.js             ← Entry point: bootstraps all modules
│   ├── groq.js             ← Groq API client + key management
│   ├── ui.js               ← Shared UI helpers (page nav, rings, badges)
│   ├── imageAnalyzer.js    ← Image input + analysis logic
│   └── textAnalyzer.js     ← Text scoring, Groq integration, highlights
│
└── pages/
    ├── home.html           ← Home page HTML partial (reference)
    └── authenticator.html  ← Authenticator page HTML partial (reference)
```

> **Note:** `pages/*.html` are reference partials. The actual app is self-contained in `index.html`.  
> In a production setup (Vite, webpack, or server-side), you'd use these partials with includes.

---

## Getting Started

### Option A — Open directly in browser
```bash
open veridex/index.html
```
Works out of the box. ES Modules (`type="module"`) are fully supported in all modern browsers when opened via `file://` on Chrome/Edge, or served via HTTP.

> If you see CORS errors opening via `file://`, use Option B.

### Option B — Serve locally
```bash
# Python
cd veridex
python3 -m http.server 8080

# Node (npx)
cd veridex
npx serve .
```
Then open `http://localhost:8080`.

---

## Groq API Key

1. Visit [console.groq.com](https://console.groq.com) — free account, no credit card
2. Create an API key (starts with `gsk_`)
3. Paste it into the **Groq API Key** banner on the Analyzer page
4. Click **Save Key** — it stores in `sessionStorage` (browser only, never sent anywhere)

Without a key, both analyzers run in **Demo Mode** with simulated results.

---

## Architecture

| File | Responsibility |
|------|---------------|
| `groq.js` | API client, key management, system prompts |
| `ui.js` | Page navigation, ring animations, verdict badges |
| `imageAnalyzer.js` | File/URL/paste input, image analysis orchestration |
| `textAnalyzer.js` | Local pattern scoring, Groq call, sentence highlights |
| `main.js` | DOMContentLoaded bootstrap, exposes functions to `window` |

### CSS Layer Order
`tokens` → `layout` → `home` → `authenticator` → `results` → `responsive`

Each layer only styles what it owns; responsive overrides go last.

---

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (ES Modules, no build step)
- **AI Engine:** Groq API · LLaMA 3.3 70B Versatile
- **Fonts:** Syne (display) · Outfit (body) · DM Mono (code)
- **Deployment:** Any static host — Vercel, Netlify, GitHub Pages

---

## Detection Methodology

### Text
Local pattern scoring (25 AI signals, 23 human signals) + optional Groq sentence-level classification. Signals include hedging language, stylometric patterns, vocabulary diversity heuristics.

### Image
Groq vision reasoning + heuristic attribute scoring across: Pixel Entropy, Compression Artifacts, EXIF Integrity, AI-Gen Signature, Edge Coherence.

---

© 2026 Veridex · Team Bodo-Glimt
