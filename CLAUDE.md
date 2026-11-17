# CLAUDE.md

@AGENTS.md

## Claude-specific notes

- Design work in this repo uses the **impeccable** skill. Product context is in `PRODUCT.md`, the visual system in `DESIGN.md`, and the direction contract (white premium, user-pinned) in `.impeccable/surfaces/app-pages-index-vue.md`. Read them before touching UI.
- After UI edits, run `~/.claude/skills/impeccable/scripts/impeccable detect --json app/pages app/components app/assets/css/main.css` once and fix what it reports.
- Verify visually at 1440 and 390 wide. Captures go in `.impeccable/review/`.
- Keep the user's language: the client and the user write in Spanish; code, comments and commit messages stay in English.
- Do not commit `.env`. Do not put the Vestta key, SMTP credentials or the user's email in code, docs or requests to third parties.
