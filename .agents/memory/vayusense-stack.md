---
name: VayuSense stack notes
description: Non-obvious decisions in the VayuSense air quality platform build
---

## react-router-dom over wouter
The app uses react-router-dom BrowserRouter (not wouter) because city dashboard requires /city/:cityId URL params and wouter was already the scaffold default. Had to install react-router-dom explicitly as a devDependency.

**Why:** Wouter was the scaffold default but react-router-dom was specified in the build brief and the design subagent used it. Both work but they are not interchangeable.

**How to apply:** Any new pages must be added to the BrowserRouter Routes in App.tsx, not to a WouterRouter.

## Leaflet in Vite
Two required steps or the map crashes:
1. Import CSS: `import 'leaflet/dist/leaflet.css'` in the map component
2. Fix default icon: delete `_getIconUrl` from L.Icon.Default.prototype and call L.Icon.Default.mergeOptions with explicit icon URLs

**Why:** Vite's asset bundling breaks Leaflet's auto-detection of its own icon paths.

## All city data is in-memory mock
No DB tables for city AQI. All data lives in `artifacts/api-server/src/data/cities.ts` as static arrays with seeded random forecast/trend data.

**Why:** Build brief specified no DB needed; WAQI/OpenWeather APIs are optional env var enhancements.

## Claude fallbacks
Every Claude route has a hardcoded fallback so the UI never breaks when ANTHROPIC_API_KEY is absent or the API fails. The model is claude-sonnet-4-6 (not claude-3 variants).
