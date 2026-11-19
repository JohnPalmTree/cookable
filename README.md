# Cookable: Digital Fridge & Cookbook

A recipe and pantry manager: track what's in your fridge, see what you can
cook, and generate a shopping list for the rest.

Built with Next.js 16, TypeScript, Tailwind CSS v4 and Supabase.

## Local setup

Requires Node 20.9 or newer (`.nvmrc` pins 24).

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Project URL and
   publishable key from Supabase → Project Settings → API.
3. `npm run dev`, then open http://localhost:3000

Before opening a pull request, run `npm run check`
(lint, types, formatting and a production build).

## Scripts

| Command             | What it does                   |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start the dev server           |
| `npm run check`     | Everything CI checks, in order |
| `npm run lint`      | ESLint                         |
| `npm run typecheck` | TypeScript, no output files    |
| `npm run format`    | Format all files with Prettier |

## Project structure

- `src/app/` routes only
- `src/components/ui/` reusable pieces (Toast, Skeleton)
- `src/components/layout/` app shell (Nav)
- `src/components/<area>/` inventory, recipes and shopping components
- `src/lib/domain/` pure logic with no database or browser code
- `src/lib/` Supabase clients and data access (reorganized in Sprint 3)

## Troubleshooting (Windows)

- Stale build cache: stop the server, then
  `Remove-Item -Recurse -Force .next`
- Every file shows as changed after switching machines: with a clean
  `git status`, run `git rm -r -q --cached .` then `git reset --hard`
