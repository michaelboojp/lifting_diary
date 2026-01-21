# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application (App Router) with TypeScript and Tailwind CSS v4, bootstrapped with `create-next-app`. The project is configured as "lifting_diary_cource" and appears to be a lifting diary/workout tracking application.

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono (via next/font)
- **Linting**: ESLint 9 with Next.js config

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### File Structure

- **app/**: App Router directory containing pages and layouts
  - `layout.tsx`: Root layout with font configuration and metadata
  - `page.tsx`: Home page component
  - `globals.css`: Global styles with Tailwind imports and CSS variables
- **public/**: Static assets (images, etc.)
- **next.config.ts**: Next.js configuration (currently minimal)
- **tsconfig.json**: TypeScript configuration with `@/*` path alias pointing to root

### TypeScript Configuration

- Path alias `@/*` maps to root directory (e.g., `@/app/components`)
- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (automatic runtime)

### Styling Approach

- Uses Tailwind CSS v4 (latest) with inline theme configuration
- CSS variables for theming (`--background`, `--foreground`)
- Dark mode support via `prefers-color-scheme`
- Custom theme tokens: `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`
- Tailwind is imported directly in `globals.css` using `@import "tailwindcss"`

### Fonts

- Geist Sans: Primary sans-serif font (variable: `--font-geist-sans`)
- Geist Mono: Monospace font (variable: `--font-geist-mono`)
- Both loaded via `next/font/google` with latin subset

## Key Configuration Details

- **ESLint**: Uses Next.js core-web-vitals and TypeScript configs, ignores `.next/`, `out/`, `build/`, and `next-env.d.ts`
- **PostCSS**: Configured to use `@tailwindcss/postcss` plugin
- **Module Resolution**: Uses "bundler" strategy (modern Next.js default)
