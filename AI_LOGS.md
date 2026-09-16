# AI Logs

Repository setup and verification log.
You are my senior engineering pair for a 2.5-hour timed hiring assignment. I need a complete, working habit tracker web app. Build it in one pass, give me full file contents (no "..." or placeholders), and keep the setup dead simple — I'm running it in GitHub Codespaces.

=== THE BRIEF (verbatim, this is all I was given) ===
"Ananya has started a 75-day self-improvement challenge — drink water, read, work out, no sugar. She's juggling several habits at once: some she does every day, some only on weekdays. Each morning she just wants to see today's habits and tick them off one by one. She's fiercely proud of her streaks and genuinely gutted when she breaks one, so for every habit she wants to know her current streak and her best-ever streak. Weeks in, her list has grown long — there are a couple she's quietly given up on and wants out of the way (but not gone forever), and she keeps hunting for a particular one to update it.
Build Ananya something so she keeps her streaks alive.
(Build for people like Ananya, not just her: any user, any habits. Get logging and streaks solid first, then the niceties.)"

=== REQUIREMENTS I'VE DERIVED — implement all of these ===
Core (must be rock solid):
1. CRUD habits: name, optional description, schedule type (DAILY or WEEKDAYS or CUSTOM days-of-week), optional target/unit, color or emoji icon, created date.
2. "Today" view as the landing screen: shows ONLY the habits actually scheduled for today, each with a one-tap check/uncheck toggle. Show date and a progress indicator (e.g. 3/5 done).
3. Toggling must be idempotent and instant (optimistic UI), and persist.
4. Per-habit current streak AND best-ever streak, computed over that habit's own schedule — a weekday habit must NOT break its streak over the weekend, and skipped non-scheduled days must be ignored entirely, not counted as misses. Write this as a single pure function and unit-test it.
5. Streak must be computed from the completion log, never stored as a mutable counter that can drift.
6. Archive / unarchive a habit — hidden from Today and the main list, data and history fully preserved. Deletion is separate and asks for confirmation.
7. Search habits by name + filter (active / archived / all, and by schedule type), so a long list stays navigable. Edit a habit inline from search results.

Niceties (only after the above works):
8. Per-habit history: last ~30 days as a heatmap/dot grid, plus completion rate.
9. Backfill — let the user tick a missed day from the history view (people log yesterday's water at 11pm).
10. Empty states, a seed/demo data button, and a 75-day challenge progress bar (day N of 75).
11. Keyboard-friendly, responsive, dark mode optional.

=== EDGE CASES TO HANDLE EXPLICITLY ===
- Timezone: use the user's LOCAL date, store dates as YYYY-MM-DD strings, never raw UTC timestamps. A day must not flip at the wrong hour.
- A habit created today shouldn't show a broken streak.
- Today counts toward the current streak if done, but an unticked today must not break the streak until the day ends.
- Custom schedules with zero selected days.
- Archived habits excluded from Today but their best streak is preserved.

=== TECH CONSTRAINTS ===
- Stack: React + Vite + TypeScript + Tailwind. State in React, persistence via localStorage behind a small storage/repository module so it could be swapped for an API later. No backend, no database, no auth — it must run with `npm install && npm run dev` and nothing else.
- Vitest for tests. At minimum, thorough tests for the streak engine covering every edge case above.
- Clean structure: /src/lib (types, streak logic, date utils, storage), /src/components, /src/pages or views. Small, readable components.

=== DELIVERABLES ===
Output, in order:
1. The full file tree.
2. Every file's complete contents.
3. README.md — what it is, features, setup/run/test commands, how to debug in Codespaces (port forwarding, clearing localStorage), known limitations.
4. REASONING.md — how I interpreted an intentionally vague brief; the assumptions I made and why; why streaks are derived not stored; the schedule-aware streak model; why archive vs delete; what I deliberately cut for time and what I'd build next.

Start by listing your assumptions in 5 bullets, then build. Don't ask me clarifying questions — make a sensible call and note it in REASONING.md.

---
I have finished building my habit_tracker project in this GitHub Codespace.

I now want to push the COMPLETE current project to a PUBLIC GitHub repository.

Do NOT modify, rewrite, or delete any application code unless absolutely necessary for Git setup.

First inspect the current project and verify:
1. We are in the correct habit_tracker project root.
2. All source files are present.
3. package.json exists.
4. README.md, REASONING.md, and AI_LOGS.md exist at the repository root.
5. There are no obvious files that should be committed accidentally, such as node_modules, .env files, build output, or secrets.

Then:
1. Check whether this directory is already a Git repository.
2. If Git is not initialized, initialize it with:
   git init
3. Create/update .gitignore if needed. Make sure it ignores:
   node_modules/
   dist/
   .env
   .env.*
   coverage/
4. Run:
   npm install
5. Run the available tests and build to verify the project works:
   npm run test
   npm run build
   If either command does not exist, tell me instead of inventing one.
6. Show me the Git status and the files that will be committed.
7. Stage the project:
   git add .
8. Create a clear initial commit:
   git commit -m "Build habit tracker application"
9. Check whether a remote origin already exists.
10. If an origin exists, DO NOT change it. Show me its URL.
11. If no origin exists, STOP before adding a remote and tell me the exact GitHub repository URL I need to provide.
12. After the remote is confirmed, push the current branch to GitHub.
13. If the branch is not main, rename it to main before pushing:
   git branch -M main
14. Push using:
   git push -u origin main

IMPORTANT:
- Do not force push.
- Do not delete or overwrite an existing remote repository.
- Do not expose or commit secrets.
- Do not make unrelated code changes.
- If authentication or GitHub permissions are required, stop and tell me exactly what I need to do.
- Before pushing, show me the exact commands you intend to run and wait for my confirmation if a remote repository needs to be created or changed.

At the end, give me:
- GitHub repository URL
- current branch
- latest commit
- confirmation that the push succeeded
- any warnings/errors