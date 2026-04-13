# Maxime's Portfolio (Next.js)

A portfolio site built with **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. It is structured so you can swap in your own content: experiences, projects, passions, resume, and assets under `public/`.

## Quick start

### Prerequisites

- Node.js 20+
- npm

### Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server (run after `build`) |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check |

## Customizing for your own site

1. **Content** — Edit data and copy under:
   - `app/experiences/data/`
   - `app/projects/data/`
   - `app/passions/data/`
   - Shared UI: `app/components/` (bio, nav, footer, etc.)
2. **Resume and media** — Replace files in `public/resume/`, `public/projects/`, and `public/portfolio/` as needed.
3. **Metadata** — Update `app/layout.tsx` (title, description) and any social links in components.

The repo is a starting point; there is no CMS—everything is in the codebase.

## Docker

The included `Dockerfile` builds a production image using Next.js [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) (`output: "standalone"` in `next.config.ts`).

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## Deploying on Fly.io (optional)

1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) and sign in: `fly auth login`.
2. Copy the example config and set your app name:

   ```bash
   cp fly.toml.example fly.toml
   ```

   Edit `fly.toml`: set `app` to your Fly app name and `primary_region` to your preferred [Fly.io region](https://fly.io/docs/reference/regions/) (create the app with `fly apps create <name>` or `fly launch` if you prefer the wizard).

3. Deploy:

   ```bash
   fly deploy
   ```

`fly.toml` is listed in `.gitignore` so your app name and local tweaks stay out of git. Only `fly.toml.example` is meant to be committed as a template.

### GitHub Actions → Fly.io

The workflow `.github/workflows/fly-deploy.yml` deploys on pushes to `main` when relevant paths change. To use it in your fork:

1. Create a Fly API token: [Fly tokens](https://fly.io/docs/reference/personal-access-tokens/).
2. In the repo **Settings → Secrets and variables → Actions**, add:
   - `FLY_API_TOKEN` — your token  
   - `FLY_APP_NAME` — same string as `app` in your local `fly.toml` (the workflow generates `fly.toml` from `fly.toml.example` during deploy)
   - `FLY_APP_REGION` — your preferred [Fly.io region](https://fly.io/docs/reference/regions/) (e.g. `yyz`, `iad`, `lhr`)

## Project structure

```
portfolio/
├── app/
│   ├── components/          # Shared UI (navbar, footer, bio)
│   ├── experiences/         # Work & leadership
│   │   ├── components/
│   │   └── data/
│   ├── projects/            # Projects + media gallery
│   │   ├── components/
│   │   └── data/
│   ├── passions/            # Interests + image/video modals
│   │   ├── components/
│   │   └── data/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── not-found.tsx
├── public/
│   ├── portfolio/           # Passion media
│   ├── projects/            # Project screenshots
│   ├── resume/              # Resume PDF
│   └── logo.png
├── Dockerfile
├── fly.toml.example         # Template for Fly.io (copy to fly.toml)
└── next.config.ts
```

## Attribution

If you use this template for your own site, please give credit by linking back to this repo in your site's footer or README. It's not required by the license, but it's appreciated!

## Technologies

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
