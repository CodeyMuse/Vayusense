# VayuSense — Urban Air Intelligence Command Centre

Real-time AI-powered air quality intelligence dashboard fusing CAAQMS sensor data, weather forecasts, and geospatial source mapping for Indian city administrators.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/vayusense run dev` — run the frontend (port 25782)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `ANTHROPIC_API_KEY` — Anthropic API key for AI features
- Optional env: `OPENWEATHER_KEY`, `WAQI_TOKEN` — real weather/AQI data (falls back to mock)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, react-router-dom, Recharts, React-Leaflet, Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (provisioned but not used — all data is in-memory mock)
- AI: Anthropic Claude claude-sonnet-4-6 (health advisories, enforcement notices, AI copilot)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validation schemas
- `artifacts/api-server/src/data/cities.ts` — all 6 city mock data (Delhi, Mumbai, Kolkata, Bengaluru, Chennai, Pune)
- `artifacts/api-server/src/routes/cities.ts` — GET /cities and GET /cities/:cityId
- `artifacts/api-server/src/routes/ai.ts` — POST /ai/advisory, /ai/notice, /ai/chat (Claude proxy)
- `artifacts/vayusense/src/pages/` — Landing, CityDashboard, Compare, About
- `artifacts/vayusense/src/components/tabs/` — 6 city dashboard tabs

## Architecture decisions

- All city AQI data is in-memory mock (no DB needed) — WAQI/OpenWeather integrations are optional env vars
- Claude API calls are proxied through the Express backend to avoid key exposure in browser
- Fallback responses for all Claude endpoints so UI never breaks without API key
- react-router-dom (not wouter) used for BrowserRouter — required for city URL params (/city/:cityId)
- Leaflet maps with CartoDB dark tile layer, Leaflet icon fix applied in CityMap component

## Product

- **Landing page**: Live AQI ticker, 6 city cards with sparklines, dismissible demo banner
- **City Dashboard**: 6-tab command centre with Overview, Forecast, Source Attribution, Enforcement Intel, Citizen Advisory, AI Copilot
- **Compare page**: Multi-city AQI trend comparison (individual/overlay view)
- **About page**: Methodology and regulatory context

## Gotchas

- After any OpenAPI spec change, always run `pnpm --filter @workspace/api-spec run codegen`
- Leaflet CSS must be imported in the component using maps; default icon fix must run before rendering
- Claude model `claude-sonnet-4-6` is used (not claude-3-5-sonnet which is not available via direct API key)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
