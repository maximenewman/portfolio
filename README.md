# Portfolio

A personal portfolio website built with [Next.js](https://nextjs.org) 16, showcasing experiences, projects, and passions.

## 🚀 Live Deployment

The application is deployed on **Fly.io**: [Your Fly.io URL]

## 📋 Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun
- Docker (for containerized deployment)

## 🛠️ Development

### Running Locally

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The page auto-updates as you edit files in the `app/` directory.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🐳 Docker

### Building the Image

```bash
docker build -t portfolio .
```

### Running the Container

```bash
docker run -d -p 80:3000 --name portfolio portfolio
```

The app will be available at [http://localhost](http://localhost)

### Volume Mounting for Development

To mount your local code into the container for live development:

```bash
docker run -d -p 80:3000 -v $(pwd)/app:/app/app --name portfolio-dev portfolio
```

This mounts the local `app/` directory into the container's `/app/app` directory, allowing hot-reload during development.

## 📂 Project Structure

```
portfolio/
├── app/
│   ├── components/      # Reusable UI components
│   │   ├── bio.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   ├── experiences/     # Experience section
│   │   ├── components/
│   │   └── data/
│   ├── projects/        # Projects showcase
│   │   ├── components/
│   │   └── data/
│   ├── passions/        # Personal interests
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── not-found.tsx    # 404 page
├── public/              # Static assets
├── Dockerfile           # Docker configuration
└── next.config.ts       # Next.js configuration
```

## 🚢 Deployment

### Fly.io Deployment

The application is configured for deployment on Fly.io:

1. Install Fly.io CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login to Fly.io:
```bash
fly auth login
```

3. Deploy:
```bash
fly deploy
```

## 🛠️ Technologies

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **Deployment:** Fly.io
- **Containerization:** Docker

## 📄 License

Private project
