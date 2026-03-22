# AltCode frontend — v0.1 prototype

Flow and navigation prototype (static JSON data, no API). Dual themes and visual polish are planned for v1.0 after PRD refresh.

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
- `src/app/` — auth, layout, search context.

## Requirements

- Node 18+ (Node 20+ recommended for latest tooling).
