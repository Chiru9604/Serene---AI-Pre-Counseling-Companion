# Serene — AI Pre-Counseling Companion

Serene helps clients prepare for counseling sessions with guided check-ins and journaling, while giving counselors a lightweight dashboard to review pre-session context.

**Stack**  
React + Vite + TypeScript + Tailwind on the frontend. Cloudflare Worker backend with D1 (SQLite) for data and migrations.

**Quick start**  
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run lint       # eslint
```

**Deploy**  
```bash
wrangler deploy    # push worker + assets to Cloudflare
```

**Database**  
Apply SQL migrations in `migrations/` with `wrangler d1 execute <DB> --file=...`.

**Project layout**  
- `src/react-app/` – React UI (pages, components, styles)  
- `src/worker/` – Cloudflare Worker API entry  
- `src/shared/` – shared TypeScript types  
- `migrations/` – schema up/down SQL files  

