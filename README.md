# josephi.dev-portfolio (client)

Frontend for Joseph Infante's personal portfolio, built with React + TypeScript + Vite.

It includes real-time widgets for:
- Steam presence
- Current music and recently played tracks
- GitHub activity
- About Me section with dynamic status

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui

## Requirements

- Bun (recommended) or Node.js + npm
- A running backend API accessible by the client

## Environment Variables

This project uses one public frontend variable:

```env
API=http://localhost:3001
```

Steps:
1. Copy `.env.example` to `.env`.
2. Set `API` to your backend base URL.

Example:

```bash
cp .env.example .env
```

## Installation

With Bun:

```bash
bun install
```

With npm:

```bash
npm install
```

## Development

With Bun:

```bash
bun run dev
```

With npm:

```bash
npm run dev
```

## Production Build

With Bun:

```bash
bun run build
```

With npm:

```bash
npm run build
```

## Local Preview

With Bun:

```bash
bun run preview
```

With npm:

```bash
npm run preview
```

## Available Scripts

- `dev`: starts the development server
- `build`: runs TypeScript build and Vite production build
- `preview`: serves the production build locally
- `lint`: runs ESLint

## Main Structure

```txt
src/
  components/
    widgets/
  hooks/
  assets/
```

## Notes

- The `API` variable is exposed to the client through Vite config (`envPrefix`).
- If `API` is missing, requests will resolve to invalid relative routes.
