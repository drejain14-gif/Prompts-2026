# SweatJoy — Product Architecture

## System Overview

```mermaid
graph TB
    subgraph Client
        WEB[Next.js 15 Web App]
        MOB[Future React Native App]
    end

    subgraph Edge
        CDN[Vercel CDN]
        EF[Supabase Edge Functions]
    end

    subgraph Backend
        SA[Supabase Auth]
        DB[(PostgreSQL)]
        ST[Supabase Storage]
    end

    subgraph AI
        OAI[OpenAI GPT-4o-mini]
        GEM[Gemini Flash]
    end

    subgraph Analytics
        PH[PostHog]
        MP[Mixpanel]
    end

    subgraph Notifications
        FB[Firebase Push]
        EMAIL[Resend Email]
        WA[WhatsApp API]
    end

    WEB --> CDN
    MOB --> CDN
    CDN --> SA
    CDN --> DB
    WEB --> EF
    EF --> OAI
    EF --> GEM
    WEB --> PH
    EF --> FB
    EF --> EMAIL
```

## Information Architecture

```
SweatJoy
├── Welcome (/)
├── Auth
│   ├── Login (/login)
│   └── Sign Up (/signup)
├── Onboarding (/onboarding)
│   ├── Profile Setup
│   ├── Wellness Assessment
│   └── Wellness Plan
└── App (authenticated)
    ├── Dashboard (/dashboard)
    ├── Mood (/mood)
    ├── Journal (/journal)
    ├── Triggers (/triggers)
    ├── Habits (/habits)
    ├── Coach (/coach)
    ├── Balance (/balance)
    ├── Analytics (/analytics)
    └── Settings (/settings)
```

## User Flow — Daily Check-In

```mermaid
flowchart LR
    A[Open App] --> B{Checked in today?}
    B -->|No| C[Mood Check-In]
    B -->|Yes| D[Dashboard]
    C --> E[Select Emotion]
    E --> F[Rate Dimensions]
    F --> G[Save]
    G --> H[Calculate Burnout]
    H --> I{High Risk?}
    I -->|Yes| J[Show Alert + Coach]
    I -->|No| K[Award XP]
    K --> D
```

## Database ERD

```mermaid
erDiagram
    profiles ||--o{ mood_entries : has
    profiles ||--o{ triggers : logs
    profiles ||--o{ journals : writes
    profiles ||--o{ habit_logs : tracks
    profiles ||--o{ wellness_scores : assessed
    profiles ||--o{ burnout_scores : calculated
    profiles ||--o{ recommendations : receives
    profiles ||--o{ achievements : earns
    profiles ||--o{ notifications : gets
    profiles ||--o{ study_balance_logs : logs
    profiles ||--o{ parent_student_links : linked
    profiles ||--o{ counsellor_reports : reviewed

    profiles {
        uuid id PK
        text full_name
        exam_type exam_type
        date target_exam_date
        user_role role
        numeric wellness_score
    }

    mood_entries {
        uuid id PK
        uuid user_id FK
        int mood_score
        emotion_type emotion
        date entry_date
    }

    burnout_scores {
        uuid id PK
        uuid user_id FK
        numeric score
        burnout_risk risk_level
        jsonb factors
    }
```

## Deployment Architecture

```mermaid
graph LR
    DEV[Developer] --> GH[GitHub]
    GH --> VER[Vercel CI/CD]
    VER --> PROD[Production]
    VER --> PREV[Preview Deploys]
    PROD --> SUP[Supabase Cloud]
    PROD --> OAI[OpenAI API]
```

## Security Architecture

- **Authentication:** Supabase Auth with JWT, Google/Apple OAuth
- **Authorization:** Row Level Security (RLS) on all user tables
- **API:** Zod validation on all endpoints
- **Audit:** audit_logs table for admin actions
- **Data:** Encryption at rest (Supabase), TLS in transit

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS, Shadcn UI |
| Backend | Supabase, PostgreSQL, Edge Functions |
| AI | OpenAI, Gemini |
| Analytics | PostHog, Mixpanel |
| Notifications | Firebase, Email, WhatsApp |
| Hosting | Vercel |
