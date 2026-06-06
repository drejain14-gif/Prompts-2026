# SweatJoy — Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** SweatJoy Student Mental Wellness Tracker  
**Version:** 1.0  
**Target Users:** Students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, SSC, and Board Exams  
**Platform:** Web (mobile-first), future native mobile apps

## 2. Problem Statement

Competitive exam preparation in India creates chronic stress, anxiety, sleep deprivation, and burnout among students aged 16–25. Existing study apps focus on content delivery but ignore emotional wellbeing, leading to preventable mental health crises during and after exams.

## 3. Product Goals

| Goal | Metric | Target |
|------|--------|--------|
| Daily engagement | DAU/MAU ratio | > 40% |
| Mood tracking adoption | Check-in completion | > 70% weekly |
| Burnout prevention | Early detection rate | > 85% accuracy |
| User satisfaction | NPS | > 50 |

## 4. User Personas

### Priya (17, NEET Aspirant)
- Studies 10+ hours daily
- Experiences anxiety before mock tests
- Needs quick daily check-ins and calming exercises

### Arjun (20, UPSC Aspirant)
- Long preparation cycle (1–2 years)
- Risk of burnout and isolation
- Needs habit tracking and study-life balance tools

### Mrs. Sharma (Parent)
- Wants visibility into child's wellbeing without invading privacy
- Needs alert system for high-risk periods

## 5. Feature Requirements

### P0 (MVP — Sprint 1–3)
- User onboarding with wellness assessment
- Daily mood tracker with emotion selector
- Emotional journal with prompts
- Stress trigger logging and analysis
- Habit tracker with streaks
- Burnout detection engine
- AI Wellness Coach (SweatJoy Coach)
- Analytics dashboard
- Gamification (XP, badges)

### P1 (Sprint 4–6)
- Parent portal with opt-in sharing
- Mentor/counsellor dashboard
- Exam mode adaptive support
- Push notifications (Firebase)
- Voice journal recording
- WhatsApp reminders

### P2 (Sprint 7+)
- Mood prediction ML model
- Institutional admin panel
- Content management system
- Mixpanel/PostHog advanced analytics
- Native mobile apps

## 6. Non-Functional Requirements

- **Performance:** LCP < 2.5s on 4G mobile
- **Accessibility:** WCAG 2.1 AA compliance
- **Security:** Row-level security, audit logging, GDPR-ready data export
- **Availability:** 99.9% uptime SLA
- **Scalability:** Support 100K concurrent users

## 7. Success Criteria

- Student completes onboarding in < 3 minutes
- Daily check-in takes < 30 seconds
- Burnout alerts trigger within 24h of risk threshold
- AI coach response time < 3 seconds

## 8. Out of Scope (v1)

- Telemedicine / clinical diagnosis
- Paid therapy marketplace
- Social networking between students
