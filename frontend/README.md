# AltCode frontend — v0.2 prototype

Static **dual-theme** prototype (Terminal / Dystopian dark + Earthy Brutalist light) with the same routes and flows as v0.1. Layout and components use PRD tokens (`src/index.css`, `tailwind.config.js`). Some actions remain stubbed; data is still JSON via repositories.

## Run

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Demo auth (development only)

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `7.ashutoshj@gmail.com` |
| Password | `altcode@123`         |
| OTP      | `888888`              |

## Structure

- `src/data/static/` — JSON content (replace with CMS/API later via repositories).
- `src/data/repositories/` — static repository implementations.
- `src/pages/` — route screens.
- `src/app/` — auth, layout, theme, search context.

## Requirements

- Node 18+ (Node 20+ recommended for latest tooling).
