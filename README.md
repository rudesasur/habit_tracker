# Streakly

A local-first habit tracker for Ananya's 75-day challenge. It is intentionally small, fast, and dependency-light: React state drives the UI, while a tiny localStorage repository is the only persistence boundary.

## Features

- Today-first view with only habits scheduled for the local calendar date.
- One-tap, idempotent completion toggles with instant persistence.
- Daily, weekday, and custom weekday schedules.
- Current and best streaks derived from completion history, including weekend-aware streaks.
- Create, edit, archive, unarchive, and confirmed permanent delete.
- Search by name, filter by active/archived/all, and filter by schedule type.
- Per-habit 30-day heatmap with clickable backfill for scheduled past days.
- Completion rate, target/unit metadata, emoji and color choices.
- Empty states, demo data seed, and a 75-day progress indicator.
- Responsive layout that remains usable on narrow screens.

## Setup and commands

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Run the unit tests:

```bash
npm run test
```

Create a production build:

```bash
npm run build
```

## Codespaces debugging

When Vite starts, forward port `5173` from the Ports panel and open the forwarded URL. Vite's terminal output also provides the local URL. The application stores data under `streakly-habit-tracker-v1` in browser localStorage. To reset a stuck or unwanted data set, open DevTools, run `localStorage.clear()`, and refresh. The “Load demo habits” button is a quick way to repopulate an empty screen.

## Project layout

```text
src/
	App.tsx
	main.tsx
	index.css
	components/Modal.tsx
	lib/dateUtils.ts
	lib/streak.ts
	lib/storage.ts
	lib/types.ts
```

## Known limitations

- Data is local to one browser profile; there is no sync, account, export, or backend.
- The challenge start date is initialized once and has no settings screen to change it.
- Completion rate is calculated over the habit's creation date or the most recent 30 calendar days, whichever is later.
- Completion records are stored in the `streakly-habit-tracker-v1` localStorage entry as `YYYY-MM-DD` strings grouped by habit; streak counters are always derived.
- If localStorage contains malformed data, the repository drops invalid habit records and loads an empty safe state. This is useful when debugging old browser data.
- The design uses a remote Google Fonts import when internet access is available; the app still works with the browser fallback if it is blocked.