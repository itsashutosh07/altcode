# AltCode — Unified Product Requirements Document

**Version:** 1.0  
**Product:** AltCode — Quiz + Flashcards for technical interview prep  
**Platforms:** Web, desktop-first (responsive tablet/mobile)  
**Themes:** Two persistent modes — **Dark: Terminal / Dystopian** and **Light: Earthy Minimal Brutalist**

---

## 1. Executive summary

AltCode is a single product with **one information architecture** and **one set of user flows**. Visual expression splits into two themes that share the same screens, components, and interactions:

| Theme | Essence | Handpicked from |
|-------|---------|-----------------|
| **Dark** | IDE-native, high contrast, “live” void background, monospace discipline | Terminal (structure, copy, grids), Arcade (timer bar, combo/XP feedback, elevation on focus), minimal doc patterns for readability of long text, glass font: Space Grotesk |
| **Light** | Airy, handcrafted, earthy neutrals, neo-brutalist geometry (angled cuts, hard edges), doc clarity | Clean Documentation (IA, typography rhythm, Result Disection), Terminal (keyboard affordances expressed as subtle labels), Arcade (progress as calm meters, not neon), font: Space Grotesk |

**North star:** *Time to first review* under 30 seconds from landing; *zero ambiguous next steps* on Dashboard; *same routes and shortcuts* in both themes.

---

## 2. Goals & non-goals

### 2.1 Goals

- Unify **Flashcards (spaced repetition)** and **Quizzes (timed assessment)** under one nav model.
- Ship **two visual themes** with **token-swapped** components (no duplicate feature sets per theme).
- **Keyboard-first:** `Space` flip, `1–4` grade, `/` or `Cmd+K` search, arrow keys where specified.
- **Cohesive flows:** Dashboard → study OR configure quiz → execute → results → optional remediation deck.

### 2.2 Non-goals (v1)

- Native mobile apps, offline-first sync spec, user-generated public decks marketplace, video lessons, live coding execution in-browser.

### 2.3 Release approach (engineering)

Delivery is staged so **flows and UX** are validated before final visual polish:

1. **v0.1 prototype** — End-to-end **routes and major flows** (auth, dashboard, topics, flashcards, quiz, results) with **static data** and **wireframe-level UI** (single neutral styling is acceptable). Goal: validate buttons, navigation, and interaction model.
2. **PRD refresh** — After UX is agreed, **update this document** (version bump, changelog note, resolved open decisions, finalized tokens/themes in section 5). The refreshed PRD becomes the single spec for visual work.
3. **v1.0 frontend** — **Full dual-theme** implementation and polish per the **updated** PRD, still **frontend-only** and **static-file** data until a backend phase is scoped.

---

## 3. Personas

- **Primary:** Software engineers preparing for interviews; values focus, code in context, and measurable progress.
- **Secondary:** Bootcamp grads and career switchers who need structure and gentle progression cues.

---

## 4. Information architecture & navigation

### 4.1 Global shell (all authenticated screens)

- **Left rail (desktop):** Logo, Dashboard, Topics, Analytics, Settings. Active state theme-specific.
- **Top utility:** Theme toggle (Dark ↔ Light), global search trigger, optional streak/level chip (see §6.3).
- **Content:** Max-width reading column on doc-heavy pages; full-bleed allowed on Flashcard and Active Quiz.

### 4.2 Route map (single source of truth)

| Route | Screen name |
|-------|-------------|
| `/` or `/dashboard` | Dashboard |
| `/topics` | Topic Directory |
| `/topics/:topicId` | Deck / module overview (TOC) |
| `/review` | Flashcard Focus (query: `deckId`, optional `session=daily`) |
| `/quiz/new` | Quiz Setup |
| `/quiz/:sessionId` | Active Quiz |
| `/quiz/:sessionId/results` | Result Disection |
| `/analytics` | Analytics Matrix |

Deep links from Dashboard cards must resolve to these routes without extra “mode” confusion.

### 4.3 Access control (v1)

- **Flashcard flow** (`/review`, any query: daily session, `deckId`, remediation, etc.) and **quiz flow** (`/quiz/new`, `/quiz/:sessionId`, `/quiz/:sessionId/results`) are **authenticated only**. Unauthenticated users must be redirected to login before any study or quiz UI renders.
- **Dashboard, Topics, Deck TOC, Analytics, Settings** (and global search while in the app) are also **authenticated only**.
- **Public routes:** marketing landing `/` (when logged out), `/login`, and OTP step `/login/verify` (or equivalent combined login flow).
- **Landing** must not link directly into `/review` or `/quiz/*` without passing auth; CTAs route to login or dashboard as appropriate.
- **Optional UX:** preserve intended URL (e.g. `returnUrl`) so after OTP the user lands on the flashcard or quiz route they requested.

---

## 5. Design systems (two themes, one component API)

Components are **the same structure**; tokens differ. Below: handpicked influences and mandatory tokens.

### 5.1 Dark — “Terminal / Dystopian”

**Concept:** True black base, subtle **animated grain or slow-moving grid/scanline** (“live” background — not distracting, pause/respect `prefers-reduced-motion`).

| Token role | Value / note |
|------------|----------------|
| Background | `#050505` + live layer (opacity ≤ 6%) |
| Surface | `#111111` |
| Border | `#333333`, 1px |
| Text | `#E0E0E0` |
| Muted | `#6B7280` |
| Primary / success actions | `#00FF41` (Terminal) |
| Urgent / error | `#FF007A` (Terminal accent) |
| Secondary accent (gamified borrow) | Cyan `#00F0FF` for **timer bar** and **combo** only — sparingly |
| Typography | `JetBrains Mono` UI; code blocks same family |
| Radius | `0px` (sharp terminal) |
| Motion | 200ms glitch on critical CTA optional; 3D card flip 300ms |

**Handpicked:** Terminal deck grid + execute CTA + contribution matrix; Arcade **shrinking time bar**, **combo meter** on flashcards; Doc **clear hierarchy** for question copy (headings still monospace in dark).

### 5.2 Light — “Earthy Minimal Brutalist”

**Concept:** Off-white/cream fields, **terracotta or clay** primary, **sage or deep moss** success, **charcoal** text; **angled section dividers** (e.g. 4–6° clip-path on hero cards), **flat** surfaces with **hard shadows** optional as thin offset blocks (no soft blur stacks).

| Token role | Value / note |
|------------|----------------|
| Background | `#F7F4EF` (warm paper) |
| Surface | `#FFFFFF` or `#FAFAFA` |
| Border | `#E8E4DC` |
| Text | `#1C1917` |
| Muted | `#78716C` |
| Primary CTA | `#C45C3E` (earthy) or keep `#0070F3` if brand prefers tech-blue — **choose one in implementation; PRD assumes terracotta** |
| Success | `#3F6F50` |
| Error | `#B91C1C` |
| Typography | `Geist` / `Geist Mono` (Clean Docs); display headings may use slight **negative tracking** |
| Radius | `4px` default; **brutalist chips** may be `0` with thick border |
| Motion | Flip 300ms; **no** neon glow; hover = border/offset shift |

**Handpicked:** Clean **Topic Directory**, **Result Disection**, **quiz sidebar navigator**; Terminal behaviors as **muted keyboard hints**; brutalist **angled panels** on Dashboard hero and Quiz Setup summary card only (avoid angle overload).

### 5.3 Shared interaction rules (both themes)

- Flashcard: flip on **Space** or tap; grade **1–4** after flip.
- Quiz: one **primary submit** per question; timer always visible during Active Quiz.
- Search: **`/`** or **`Cmd+K`** focuses global search; results group by Topics / Decks.
- Reduced motion: disable glitch, matrix rain, background drift; keep instant state changes.

---

## 6. Unified feature: progression (handpicked gamification)

To avoid a third “mode,” progression is **always on** but **expression differs**:

| Element | Dark expression | Light expression |
|---------|-----------------|------------------|
| XP / level | Visible in header; neon cyan micro-bar | Calm linear meter; label “Level 12 — Architect” |
| Daily goal | “Daily grind: 12/50” terminal line | Same numbers in Daily Goal panel |
| Combo (flashcards) | Flame + count top-left | Subtle “Streak this session: 8” text |
| Badges | Unlock toast terminal-style | Small inline pill on Dashboard |

**Rule:** No separate “arcade lobby” skin — Arcade mechanics **inject into** Dashboard, Flashcard Focus, and Result Disection copy only.

---

## 7. Screen specifications (complete inventory)

Each screen lists: **Purpose**, **Layout**, **Key elements**, **States**, **Theme notes**, **Entry/exit**.

---

### SCREEN A — Dashboard

**Purpose:** Single command center: due work, daily goal, module entry, quick stats.

**Layout (desktop):**

- **Left:** Global nav (fixed).
- **Center:** Primary column — (1) **Hero / Daily objective** with primary CTA, (2) **Deck grid** or list (cards due, mastery), (3) **Recent topics** with progress bars.
- **Right:** **Activity heatmap** (Terminal: 52-week neon; Light: 30-day doc style) + optional **mini leaderboard** placeholder (v1: “Coming soon” or static mock).

**Key elements:**

- Primary CTA: **Start daily review** (routes to `/review?session=daily`).
- Secondary: **Browse topics** → `/topics`.
- Tertiary: **Start quiz** → `/quiz/new`.
- Per-deck: due count, `[Study]` / `[EXECUTE]` label per theme, deck settings overflow.

**States:** Empty (no decks), loading (theme-specific skeleton), error inline.

**Theme:** Dark = three-pane grid, monospace, execute buttons outlined green; Light = 70/30 split, angled hero panel, flat cards.

**Flow anchors:** This is **home** after onboarding; returning from review/quiz lands here with toast/summary when applicable.

---

### SCREEN B — Topic Directory

**Purpose:** Hierarchical discovery of all content (Clean Docs IA + Terminal search discipline).

**Layout:**

- **Desktop:** Sidebar categories (250px) + main module list.
- **Tablet:** Horizontal category ribbon.
- **Mobile:** Sticky search, stacked cards.

**Key elements:**

- Search (Cmd+K), category tree, **module cards** (title, card count, quiz count, CTA **Study** / **Quiz**).

**States:** Empty search, loading, error with retry.

**Theme:** Light leads visual reference; Dark uses same structure with terminal surfaces and `[OPEN]` style links.

**Exit:** Click module → **Screen C**; Study → `/review?deckId=`; Quiz → `/quiz/new?topicId=`.

---

### SCREEN C — Deck / module overview (TOC)

**Purpose:** Table of contents for one topic (merges Terminal “Deck Overview” + doc “module page”).

**Layout:** Single column with optional sub-nav tabs: **Outline | Flashcards | Quizzes**.

**Key elements:**

- Section list (anchor links), estimated time, due badge, **Start review**, **Start quiz**.

**States:** Empty module, locked content (future).

**Flow:** Clear parent → child: Topics → this screen → study or quiz.

---

### SCREEN D — Flashcard Focus

**Purpose:** Distraction-free spaced repetition.

**Layout:** Centered card; top **progress bar** + **session counter**; bottom **grading row** after flip.

**Key elements:**

- Card front/back (markdown + syntax-highlighted code).
- **Combo meter** (Arcade handpick) — top-left.
- Hints: “Space — flip · 1–4 — grade” (theme-styled).
- Grading: Again / Hard / Good / Easy (color-coded per theme tokens).

**States:** Loading (Terminal: block cursor / placeholder lines; Light: subtle spinner), empty session (“caught up” + XP summary), error toast, completion modal → Dashboard.

**Theme:** Dark = 800px-wide terminal card, green code rail; Light = max ~680px, generous whitespace, dark code block on `#111827`.

**Flow:** Dashboard or Deck overview → here → on complete → Dashboard or optional “Review missed as deck” if launched from Result Disection pipeline.

---

### SCREEN E — Quiz Setup

**Purpose:** Configure timed assessment (Arcade lobby logic without separate visual mode).

**Layout:** Split: **left** form, **right** live summary (“Estimated difficulty”, question count, time).

**Key elements:**

- Topic multi-select (pills), time slider (5–60 min), question count or density, **Start** CTA.
- Validation: disable Start if pool empty.

**States:** Loading stats skeleton, error “Insufficient questions.”

**Theme:** Dark = split panes, cyan accent on slider thumb; Light = brutalist angled summary card, earthy pills.

**Exit:** Start → create `sessionId` → **Screen F**.

---

### SCREEN F — Active Quiz

**Purpose:** Timed MCQ (and optional future code input) under pressure.

**Layout:**

- **Top:** Full-width **time bar** (Arcade shrinking bar) + numeric countdown.
- **Main:** Prompt + code terminal window (Dark) or embedded code card (Light).
- **Right (desktop):** Question navigator grid (Clean Docs); **tablet/mobile:** bottom dot/stepper.

**Key elements:**

- Options A–D (Terminal prompt style in dark; bordered radios in light).
- Submit / Next behavior defined: either auto-advance on select + confirm, or explicit Next — **pick one in build; PRD recommends explicit Next for fewer misclicks.**

**States:** Loading boot sequence optional in dark only; warning if skip; submit loading.

**Theme:** Dark = 50/50 split, mock window chrome; Light = sticky timer badge, calm borders.

**Exit:** Finish → **Screen G**.

---

### SCREEN G — Result Disection

**Purpose:** Score, concept breakdown, remediation (Clean Docs — mandatory for cohesive quiz story).

**Layout:** Summary banner → tag breakdown → accordions per missed item.

**Key elements:**

- Score %, time used, XP earned.
- **Concept tags** with hit rate.
- **Expandable explanations** + “**Generate deck from misses**” → `/review?deckId=wrong-:sessionId`.

**States:** Loading calculate, error state.

**Theme:** Light = Geist hierarchy; Dark = matrix-styled stat cards with green top border.

**Exit:** Dashboard, retry quiz, or launch remediation review.

---

### SCREEN H — Analytics Matrix

**Purpose:** Retention and workload planning (Terminal screen + doc clarity).

**Layout:** Top **KPI row** (retention %, cards due today, streak); middle **forecast bars** (14 days); bottom **heatmap** (52w dark / 30d light).

**Key elements:**

- Tooltips on hover for bars/cells.
- Link “Schedule review” → Dashboard CTA deep link.

**States:** Empty flatline, loading (dark: subtle matrix rain **only if motion allowed**), error “DATALINK_SEVERED” / human-readable in light.

---

### SCREEN I — Settings (minimal v1)

**Purpose:** Theme preference (system / dark / light), keyboard shortcut legend, account stub.

**Layout:** Simple form list.

---

### SCREEN J — Marketing / Auth shell (optional v1)

**Purpose:** Landing + sign-in. Single column; theme from system default until user sets preference.

*If v1 is app-only behind auth, this can be a single placeholder route.*

---

## 8. End-to-end user flows (canonical)

### 8.1 First visit → first review

1. Land **Dashboard** → see **Due today** and **Daily goal**.
2. Primary CTA **Start daily review** → **Flashcard Focus** (`/review?session=daily`).
3. Flip → grade → repeat.
4. Completion summary (XP, streak) → **Dashboard**.

### 8.2 Topic-targeted study

1. **Topic Directory** → pick category → **Deck overview** → **Start review** → **Flashcard Focus** (`deckId`).

### 8.3 Full quiz loop

1. **Dashboard** or **Deck overview** → **Quiz Setup**.
2. Configure topics + time → **Active Quiz**.
3. Submit final question → **Result Disection**.
4. Optional **Generate deck from misses** → **Flashcard Focus** (remediation).

### 8.4 Plan the week

1. **Dashboard** → secondary link **Analytics** → **Analytics Matrix** → back.

### 8.5 Global search

1. **`/`** or **Cmd+K** from any screen → overlay → select topic/deck → navigate to **Deck overview** or start review (secondary action).

---

## 9. Component handpick matrix (traceability)

| Component / behavior | Primary source | Secondary borrow |
|----------------------|----------------|------------------|
| Global nav + routes | Clean Docs | Terminal labeling in dark |
| Deck grid + due counts | Terminal | Arcade hover lift (dark only, subtle) |
| Daily goal + XP header | Arcade | Terminal copy style in dark |
| Flashcard flip + 1–4 | All (unified) | Arcade combo |
| Code in cards | Terminal + Clean | — |
| Quiz timer bar | Arcade | Terminal color stress (dark) |
| Quiz options A–D | Terminal | Clean radio layout (light) |
| Question navigator | Clean Docs | — |
| Result Disection | Clean Docs | Dark stat styling |
| Heatmap + forecast | Terminal | Clean simplification (light) |
| Search Cmd+K | Clean Docs | `/` also (Terminal) |
| Background “live” | New (dark spec) | — |
| Angled brutalist panels | New (light spec) | — |

---

## 10. Content & data (high level)

- **Deck:** title, topic, cards[], SM-2 or similar metadata (due date, interval).
- **Card:** front/back markdown, optional tags, code language hints.
- **Quiz session:** id, topic filters, duration, question set, answers[], score.
- **User:** preferences (theme), streak, XP, level, daily goal target.

*Algorithm details can live in a separate engineering spec.*

---

## 11. Accessibility & performance

- WCAG AA contrast in **light** theme; dark theme verifies neon on black for large text only where needed.
- Keyboard focus visible in both themes.
- `prefers-reduced-motion` honored globally.
- Code blocks scroll horizontally; never break layout on small viewports.

---

## 12. Success metrics

- Activation: % users completing first **10 cards** in week 1.
- Habit: **D7** return with ≥1 review session.
- Quiz: % sessions reaching **Result Disection** (completion rate).
- Theme: % users toggling theme (inform palette tuning).

---

## 13. Build order (recommended)

1. **Design tokens + App shell** (nav, theme toggle, layout grid).
2. **Flashcard Focus** (core interaction + keyboard).
3. **Dashboard** (CTAs wired to mock data).
4. **Topic Directory + Deck overview** (IA glue).
5. **Quiz Setup → Active Quiz → Result Disection** (full assessment loop).
6. **Analytics Matrix**.
7. Polish: live background (dark), angled panels (light), motion preferences.

---

## 14. Open decisions (product to lock before UI freeze)

1. Light theme **primary** color: earthy terracotta vs brand blue `#0070F3`.
2. Quiz navigation: **auto-advance** vs **explicit Next**.
3. Leaderboard: v1 real, mock, or hidden.
4. Auth provider and whether **Screen J** ships in v1.

---

*End of PRD — AltCode unified dual-theme specification.*
