# Reasoning

## Interpreting the brief

The brief is deliberately outcome-oriented rather than prescriptive. I treated “see today's habits and tick them off” as the primary workflow and kept management/history one navigation step away. The assumptions made for this implementation are:

1. A completion is a local `YYYY-MM-DD` string attached to one habit. Toggling a date is set-like: adding an existing date does nothing and removing an absent date does nothing.
2. The browser's local calendar is authoritative. Dates are created and parsed with local `Date` constructors, never `toISOString()`, so a completion does not move across midnight because of UTC conversion.
3. A custom schedule must contain at least one weekday. The form rejects an empty selection, and the storage boundary drops malformed custom habits.
4. Archive is reversible hiding, while delete is destructive and requires confirmation.
5. The challenge starts when the first data set is created. The demo seed intentionally resets that start to today so its sample progress is predictable.

## Streak model

`calculateStreaks` in `src/src/lib/streak.ts` is the single pure function responsible for both current and best streaks. It first generates the habit's scheduled dates between creation and the requested `asOf` date. Unscheduled dates are absent from that sequence, so weekends cannot break a weekday habit.

Best streak scans every scheduled date and resets on an uncompleted scheduled date. Current streak scans backward from the most recent scheduled date. An incomplete scheduled “today” is temporarily skipped because the day is not over; a completed today counts immediately. A habit created today has no broken streak because there are no earlier scheduled days to miss.

The counters are deliberately not stored. Storing `currentStreak` or `bestStreak` would create a second mutable source of truth that can drift after edits, backfills, timezone changes, or imported data. Recomputing from the completion log is cheap at this scale and makes history authoritative. Completion dates are deduplicated on toggle and normalized when localStorage is loaded.

## Archive versus delete

Archive answers “hide this for now” without destroying evidence. Archived habits are excluded from Today and the default active list but remain searchable under the archived/all filters; their completions and streak calculations remain intact. Delete is separate and explicit because it removes both the habit definition and its history.

## Scope choices

The core logging and streak model came first. I added the high-value niceties that fit the same model: a 30-day heatmap, past-day backfill, completion rate, seed data, and responsive empty states. I deliberately left out accounts, synchronization, notifications, drag-and-drop ordering, habit grouping, analytics charts, and a configurable challenge start-date screen. Those features need product decisions and a backend or additional persistence contracts; adding them during a timed assignment would dilute confidence in the logging path.

## Testing approach

Vitest covers local date arithmetic and the pure schedule-aware streak engine, including daily, weekday, custom, skipped-rest-day, current-day, broken, best, and archived-history cases. The production build also runs TypeScript project references before Vite bundles the app, catching invalid component and repository contracts.

## What I would build next

The next iteration would add repository-level schema validation and migrations, an export/import action, a small settings view for the challenge start date and timezone policy, accessibility review with automated interaction tests, and a browser-level test covering create, toggle, archive, search, and backfill. For a multi-device product, I would replace the localStorage adapter without changing the UI/domain contract and resolve concurrent completion writes server-side.