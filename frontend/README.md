# AltCode frontend — v1.0

Production-shaped **web app** (React + Vite + TypeScript + Tailwind) implementing [PRD.md](../PRD.md) **v1.0 frontend scope**: dual themes (terminal dark / earthy light), full IA, quiz + flashcards + analytics, **static JSON** data via repositories (no backend API yet).

## Run

```bash
cd frontend
npm install
npm run dev
```

## Features (v1)

- **Themes:** System / dark / light (`altcode_theme_preference` + resolved `data-theme`).
- **Auth:** Demo login + OTP; `returnUrl` preserved through `/login?returnUrl=…`.
- **Screens:** Dashboard (3-pane + progression), topics + category rail, module tabs, flashcard hub & session (combo, progress, completion XP), quiz setup (5–60 min) & active (navigator + timer states), result dissection (time, XP, remediation deck), analytics matrix, settings.
- **A11y:** `:focus-visible` rings; reduced-motion trims body transition; live grid animation respects `prefers-reduced-motion` (see `index.css`).

## Demo auth (development only)

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `7.ashutoshj@gmail.com` |
| Password | `altcode@123`           |
| OTP      | `888888`                |

## Requirements

- Node 18+ (Node 20+ recommended).
