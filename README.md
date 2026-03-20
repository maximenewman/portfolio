# Maxime's Portfolio

A personal portfolio website built with Next.js, showcasing professional experience, projects, and personal passions.

## Live Deployment

Deployed on **Fly.io** via Docker + GitHub Actions CI/CD.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run tests |

## Project Structure

```
portfolio/
├── app/
│   ├── components/          # Shared UI (navbar, footer, bio)
│   ├── experiences/         # Work & leadership experience
│   │   ├── components/
│   │   └── data/
│   ├── projects/            # Project showcase with media gallery
│   │   ├── components/
│   │   └── data/
│   ├── passions/            # Personal interests with image/video modals
│   │   ├── components/
│   │   └── data/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── not-found.tsx
├── public/
│   ├── portfolio/           # Passion media (chess, football, hiking, etc.)
│   ├── projects/            # Project screenshots
│   ├── resume/              # Resume PDF
│   └── logo.png
├── Dockerfile
├── fly.toml
└── next.config.ts
```

## Technologies

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **Icons:** Lucide React
