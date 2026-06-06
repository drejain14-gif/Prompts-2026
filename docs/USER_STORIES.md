# SweatJoy — User Stories & Acceptance Criteria

## Epic 1: Onboarding

### US-001: Student Sign Up
**As a** student, **I want to** create an account quickly **so that** I can start tracking my wellness.

**Acceptance Criteria:**
- [ ] Sign up with email/password works
- [ ] Google OAuth redirects correctly
- [ ] Apple OAuth redirects correctly
- [ ] Form validates email format and password strength (8+ chars)

### US-002: Profile Setup
**As a** student, **I want to** enter my exam details **so that** the app personalizes my experience.

**Acceptance Criteria:**
- [ ] All required fields validated
- [ ] Exam type dropdown includes all 8 exam types
- [ ] Target date must be in the future
- [ ] Study hours slider ranges 1–16

### US-003: Wellness Assessment
**As a** student, **I want to** complete an initial assessment **so that** I receive a baseline wellness score.

**Acceptance Criteria:**
- [ ] 5 dimensions rated 1–10
- [ ] Wellness score calculated and displayed
- [ ] Personalized plan generated based on score

---

## Epic 2: Mood Tracking

### US-004: Daily Check-In
**As a** student, **I want to** log my mood in under 30 seconds **so that** I can track patterns without disruption.

**Acceptance Criteria:**
- [ ] Mood score 1–10 with slider
- [ ] 7 emotions selectable with visual feedback
- [ ] Sleep, energy, anxiety, confidence captured
- [ ] One entry per day enforced
- [ ] Skip option available
- [ ] +10 XP awarded on save

### US-005: Mood Trends
**As a** student, **I want to** see my mood trends **so that** I understand my emotional patterns.

**Acceptance Criteria:**
- [ ] Line chart shows 7/14/30 day views
- [ ] Heatmap shows 4-week mood grid
- [ ] Empty state shown when no data

---

## Epic 3: AI Coach

### US-006: Chat with Coach
**As a** student, **I want to** talk to SweatJoy Coach **so that** I get immediate emotional support.

**Acceptance Criteria:**
- [ ] Chat UI with message bubbles
- [ ] Quick action buttons for common needs
- [ ] Response within 3 seconds (fallback mode)
- [ ] OpenAI integration when API key configured
- [ ] Coach never provides medical diagnoses

---

## Epic 4: Burnout Detection

### US-007: Burnout Risk Alert
**As a** student, **I want to** know my burnout risk **so that** I can take action before crashing.

**Acceptance Criteria:**
- [ ] Score calculated from 7 weighted factors
- [ ] Risk level displayed: low/medium/high/critical
- [ ] Factor breakdown visible in analytics
- [ ] Recommendations shown for each risk level
- [ ] Critical risk triggers notification workflow

---

## Epic 5: Gamification

### US-008: Earn Badges
**As a** student, **I want to** earn badges and XP **so that** wellness tracking feels rewarding.

**Acceptance Criteria:**
- [ ] XP awarded: mood (+10), journal (+15), habit (+5)
- [ ] 7-day streak badge auto-awarded
- [ ] Badges displayed on dashboard
- [ ] No duplicate badge awards

---

## Epic 6: Accessibility

### US-009: Screen Reader Support
**As a** visually impaired student, **I want to** use screen readers **so that** I can access all features.

**Acceptance Criteria:**
- [ ] All interactive elements have aria-labels
- [ ] Mood sliders have aria-valuenow
- [ ] Navigation has aria-current for active page
- [ ] Color contrast meets WCAG AA (4.5:1)
