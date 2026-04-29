# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep this file short — add to it only when something is non-obvious or has bitten us before.

## Project

Personal portfolio site. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. Deployed to Fly.io from a Dockerfile. The `/game` route embeds a browser build of the private `maximenewman/GoblinsKeep` repo, fetched and built in CI.

## Working rules

**Never commit on my behalf.** Make changes, stage nothing, draft a commit message, and stop. I run `git commit` myself.

**Incremental, single-purpose commits.** Prefer many tight commits over one large one. After each logical unit of change, draft a message and pause — don't keep stacking edits across unrelated areas before checking in.

**Commit message format.** Type-prefixed, plain English, imperative mood. First line ≤ 72 chars. Body (optional) explains the *why*, not the what — the diff already shows what.

```
<type>: <imperative summary>

<optional body — why, not what>
```

`<type>` ∈ `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`.

Examples:
- `feat: embed GoblinsKeep browser build at /game`
- `fix: guard /game iframe when build is missing on forks`
- `chore: gitignore generated game bundle`

Avoid: past tense (`added X`), vague summaries (`updates`), bundling unrelated changes.

## Stack notes

- Scripts: `npm run dev` / `build` / `start` / `lint` / `type-check`. CI runs lint + type-check + build (`.github/workflows/git-ci.yml`).
- ESLint flat config (`eslint.config.mjs`) with `eslint-config-next`.
- Tailwind v4 via `@tailwindcss/postcss` — no `tailwind.config.js`; theme lives in `app/globals.css`.
- Routes are App Router pages under `app/<route>/page.tsx`. Per-section data lives in `app/<route>/data/`, components in `app/<route>/components/`. Shared chrome (nav/footer/bio/theme) is in `app/components/`.

## Deploy (Fly.io)

- `fly-deploy.yml` is the deploy pipeline. It checks out the portfolio + `GoblinsKeep@game/browser`, runs `pnpm build` in `GoblinsKeep/web`, copies `dist/` → `public/goblinskeep/`, then `flyctl deploy --remote-only`.
- The Dockerfile bakes `public/` into the runner image, so the game ships with the site.
- `fly.toml` is gitignored (app name/region are personal); `fly.toml.example` is the template, with `YOUR_APP_NAME` / `YOUR_APP_REGION` substituted in CI from secrets.
- Required GitHub secrets: `FLY_API_TOKEN`, `FLY_APP_NAME`, `FLY_APP_REGION`, `GAME_REPO_TOKEN`.
- `public/goblinskeep/` is gitignored — never commit the generated bundle. To trigger a redeploy after a game-only change, use **Run workflow** (workflow_dispatch) or send a `repository_dispatch` of type `game-updated` from the GoblinsKeep repo.

## Things to leave alone unless asked

- `fly.toml.example` placeholders (`YOUR_APP_NAME`, `YOUR_APP_REGION`) — they're substituted in CI, not defaults.
- The path filters on `fly-deploy.yml` and `git-ci.yml` — they're tuned to skip irrelevant pushes (docs, etc.).
- `Documentation/` and `.cursor/` — local-only, gitignored on purpose.
