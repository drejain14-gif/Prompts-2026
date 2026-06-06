# SweatJoy — Student Mental Wellness Tracker

A production-ready mental wellness platform for students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, SSC, and Board Exams.

## Features

- **Daily Mood Tracker** — 30-second check-ins with emotion selector and trend charts
- **Emotional Journal** — Prompt-driven reflections with search and drafts
- **Stress Trigger Analysis** — Identify and analyze stress patterns
- **AI Wellness Coach** — SweatJoy Coach powered by OpenAI with intelligent fallback
- **Burnout Detection** — Weighted algorithm with low/medium/high/critical risk levels
- **Habit Tracker** — Streaks, progress rings, and gamification (XP + badges)
- **Study-Life Balance** — Track study, break, and sleep hours
- **Exam Mode** — Adaptive support based on days until exam
- **Analytics Dashboard** — Mood trends, burnout factors, wellness scores

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS |
| UI | Shadcn-style components, Recharts, Lucide icons |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| AI | OpenAI GPT-4o-mini (with rule-based fallback) |
| Validation | Zod schemas on all API routes |

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the welcome page, or go directly to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the demo dashboard.

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Authenticated app pages
│   ├── api/             # REST API routes
│   ├── onboarding/      # 3-step onboarding flow
│   ├── login/           # Auth pages
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Design system components
│   ├── layout/          # Sidebar, header
│   ├── mood/            # Mood check-in
│   ├── journal/         # Journal editor
│   └── dashboard/       # Charts and widgets
├── lib/
│   ├── algorithms/      # Burnout & wellness scoring
│   ├── supabase/        # Supabase clients
│   ├── validations/     # Zod schemas
│   └── types/           # TypeScript types
docs/                    # PRD, BRD, FRD, Architecture, QA
supabase/migrations/     # PostgreSQL schema
```

## Database Setup

Apply the migration to your Supabase project:

```bash
# Using Supabase CLI
supabase db push
```

Or run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.

## API Documentation

OpenAPI spec available at `docs/openapi.yaml`. Key endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/mood` | Mood entries |
| GET/POST | `/api/journals` | Journal CRUD |
| GET/POST | `/api/triggers` | Stress triggers |
| GET/POST | `/api/habits` | Habit logs |
| POST | `/api/coach` | AI wellness coach |
| GET/POST | `/api/burnout` | Burnout scoring |
| POST | `/api/wellness` | Wellness/balance scores |

## Documentation

| Document | Path |
|----------|------|
| Product Requirements | `docs/PRD.md` |
| Business Requirements | `docs/BRD.md` |
| Functional Requirements | `docs/FRD.md` |
| Architecture & ERD | `docs/ARCHITECTURE.md` |
| User Stories | `docs/USER_STORIES.md` |
| Sprint Roadmap | `docs/SPRINT_ROADMAP.md` |
| QA Checklist | `docs/QA_CHECKLIST.md` |
| OpenAPI Spec | `docs/openapi.yaml` |

## Demo Mode

The app includes a localStorage-based demo store so you can explore all features without Supabase configured. Connect Supabase credentials in `.env.local` for production data persistence.

## Deployment

Deploy to Vercel:

```bash
npm run build
# Connect repo to Vercel, set env vars from .env.example
```

## License

Private — All rights reserved.

# Prompts-2026
