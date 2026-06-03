# IronLog — PWA Gym Tracker

Your personal hypertrophy training app. Works offline, installs on iPhone like a native app.

---

## How to deploy (free, takes ~5 minutes)

### Option A — Netlify Drop (easiest, no account needed)
1. Go to **netlify.com/drop**
2. Drag the entire `gymapp` folder onto the page
3. Netlify gives you a free URL like `https://amazing-name-123.netlify.app`
4. Done!

### Option B — GitHub Pages (free, permanent)
1. Create a free account at **github.com**
2. Create a new repository called `ironlog`
3. Upload all files from this folder
4. Go to Settings → Pages → set source to `main` branch
5. Your app lives at `https://yourusername.github.io/ironlog`

---

## How to install on iPhone (Add to Home Screen)

1. Open the URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (box with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**
5. IronLog now appears on your home screen like a real app

---

## Files
- `index.html` — main app
- `style.css` — all styles
- `app.js` — all logic
- `sw.js` — service worker (enables offline use)
- `manifest.json` — PWA config (name, icon, theme)
- `icons/` — app icons

---

## Features
- 4-day Upper/Lower hypertrophy split
- Duration selector (45min / 1hr / 1h15 / 1h30) — auto-adjusts exercises shown
- Per-set tick-off with rest timers
- Body weight log with progress chart
- Workout history log
- Nutrition targets + daily meal checklist
- Works offline after first load
- All data saved to your device
