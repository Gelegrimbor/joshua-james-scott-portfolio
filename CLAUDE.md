# CLAUDE.md

Project guidance for Claude Code — read and follow every session.

## Git workflow (always follow)

Branches
- **main** — the live site only. Never commit to `main` directly; never push to it without an explicit go-ahead.
- **dev** — integration branch; everything is merged here first.
- **task branches** — all work happens on a branch off `dev`, named for the task: `fix/<slug>` or `feat/<slug>` (e.g. `fix/glide-scroll`, `feat/og-image`).

Flow
1. Branch off `dev` for the task.
2. Finish the work → merge the task branch into `dev`.
3. Joshua reviews `dev`.
4. Only after his OK → merge `dev` into `main`.

Commits & pushing
- Commit messages: short and simple — one-line summary, plus a brief description only if needed.
- Always show Joshua the commit message and wait for his OK before pushing.
- Never force-push.

History
- `v1-html` preserves the previous static-HTML portfolio (the old `main`).
