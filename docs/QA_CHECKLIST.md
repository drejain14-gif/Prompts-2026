# SweatJoy — QA Checklist & Test Cases

## Pre-Release QA Checklist

### Functionality
- [ ] All 10 modules accessible and functional
- [ ] Onboarding completes in < 3 minutes
- [ ] Mood check-in saves and updates dashboard
- [ ] Journal entries persist and search works
- [ ] Triggers log and frequency chart updates
- [ ] Habits toggle and streak calculates
- [ ] AI coach responds to messages
- [ ] Burnout score calculates correctly
- [ ] Balance score updates with sliders

### Authentication
- [ ] Login/signup forms validate input
- [ ] OAuth buttons present (integration pending)
- [ ] Protected routes redirect unauthenticated users
- [ ] Session persists across page refresh

### Responsive Design
- [ ] Mobile (375px) layout correct
- [ ] Tablet (768px) layout correct
- [ ] Desktop (1280px+) layout correct
- [ ] Sidebar collapses to hamburger on mobile

### Accessibility
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces form labels and values
- [ ] Focus indicators visible
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] aria-labels on icon-only buttons

### Performance
- [ ] Lighthouse Performance score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] No layout shift on chart render
- [ ] Images optimized (next/image where applicable)

### Security
- [ ] API endpoints validate input with Zod
- [ ] No secrets in client-side code
- [ ] RLS policies tested on all tables
- [ ] XSS prevention in journal content display

---

## Test Cases

### TC-001: Mood Check-In Happy Path
1. Navigate to /mood
2. Set mood score to 8
3. Select "Happy" emotion
4. Set all dimensions to 7+
5. Click "Save Check-In"
**Expected:** Toast success, dashboard updates with today's mood

### TC-002: Duplicate Daily Entry
1. Complete mood check-in for today
2. Complete another check-in for today
**Expected:** Previous entry replaced, not duplicated

### TC-003: Burnout Low Risk
1. Submit mood data: avg mood 8, anxiety 3, sleep 8
2. Navigate to /analytics
**Expected:** Burnout risk shows "LOW", score < 35%

### TC-004: Burnout Critical Risk
1. POST /api/burnout with moodTrend [3,2,2,1], anxietyTrend [8,9,9,10], studyHours 14
**Expected:** riskLevel = "critical", score >= 75

### TC-005: Journal Draft Save
1. Write partial journal entry
2. Click "Save Draft"
**Expected:** Entry saved with is_draft=true, visible in history

### TC-006: Coach Fallback Mode
1. Ensure OPENAI_API_KEY is not set
2. Send message "I'm feeling anxious"
**Expected:** Fallback breathing exercise response within 1s

### TC-007: Habit Streak
1. Complete all 6 habits for today
**Expected:** Progress ring shows 100%

### TC-008: Exam Mode Detection
1. Set target exam date to 15 days from now
2. View dashboard
**Expected:** Badge shows "Final Sprint (0–30 days)"

### TC-009: API Validation Error
1. POST /api/mood with mood_score: 15
**Expected:** 400 status, validation error details

### TC-010: Mobile Navigation
1. Open app on 375px viewport
2. Tap hamburger menu
3. Navigate to Journal
**Expected:** Sidebar opens, navigates, closes on selection
