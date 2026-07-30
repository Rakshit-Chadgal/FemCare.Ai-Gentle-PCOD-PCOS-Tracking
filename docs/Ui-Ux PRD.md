FemCare UI/UX PRD
Cozy Glassmorphism Design System for Onboarding, Cards, and Motion
1. Product Overview
FemCare is a women’s health companion app for cycle tracking, symptom logging, and personalized health insights. This PRD defines the UI/UX direction for a cozy glassmorphism interface that feels emotionally safe, premium, and calm while supporting sensitive health data onboarding and daily engagement.

2. Problem Statement
Current health onboarding flows often feel either too clinical or too dense, leading to drop-off before users experience value. FemCare needs an interface that reduces friction while building trust through soft visuals, clear consent, and a fast path to the first meaningful log.

3. Product Goals
Create a cozy, high-trust visual identity for FemCare.

Design a low-friction onboarding flow that completes in 5–6 minutes.

Present data through clear, elegant cards instead of dense dashboards.

Use motion and microinteractions to make the experience feel gentle and alive.

Ensure the UI supports explicit consent and user control for sensitive health data.

4. Success Metrics
Onboarding completion rate: 65–75%.

Signup-to-consent completion: at least 75%.

Consent-to-first-log completion: at least 85%.

First-log-to-day-7 return rate: at least 40%.

Average onboarding duration: 5–6 minutes.

5. Target Users
Primary user
A menstruating user who wants a private, easy, and non-judgmental way to track cycles, symptoms, and mood.

Secondary user
A user seeking fertility awareness, pattern recognition, or health trend history who values trust and clarity.

User needs
Fast setup.

Clear privacy explanation.

Emotional comfort.

Useful insights quickly.

Minimal cognitive load.

6. UX Principles
6.1 Cozy glassmorphism
Use translucent frosted cards with soft blur.

Prefer warm pastel gradients: blush, lavender, cream, rose, peach.

Keep corners highly rounded.

Use soft shadows and subtle ambient glow.

Avoid harsh separators and high-contrast visual noise.

6.2 Trust-first health UX
Lead with privacy reassurance.

Ask only what is needed now.

Explain why each permission is needed before requesting it.

Make optional steps skippable.

End with a meaningful first action, not a blank home screen.

6.3 Calm motion
Use slow, smooth transitions.

Avoid flashy or playful motion.

Use motion to guide attention, confirm actions, and reward completion.

Celebrate first logs and onboarding completion gently.

7. Information Architecture
Core areas
Onboarding.

Consent and privacy.

Home dashboard.

Cycle tracking.

Symptom logging.

Insights.

Reminders.

Settings and privacy controls.

Navigation model
Bottom navigation for core daily tasks.

Feature cards for discoverability.

Primary CTA always visible on home for logging.

8. Functional Requirements
8.1 Onboarding
The onboarding flow must:

Ask one question at a time.

Include visible skip options for non-essential steps.

Begin with trust messaging and a warm welcome.

Collect only essential cycle data on day 1.

Use permission priming before system prompts.

End with the first product action, such as a mood or symptom log.

8.2 Consent and privacy
The app must:

Present a short-form privacy summary.

Explain how health data is used.

Use explicit opt-in for sensitive data.

Include access to full privacy policy.

Support data export and account deletion in settings.

8.3 Cards and dashboards
The app must:

Use cards as the primary content pattern.

Keep each card focused on one purpose.

Present cycle phase, symptom trends, reminders, and insights through cards.

Support feature cards for advanced functions and discovery.

Ensure cards remain legible against translucent surfaces.

8.4 Motion and interactions
The app must:

Animate screen transitions softly.

Provide microfeedback on taps, toggles, and state changes.

Support subtle card hover/press states.

Show a gentle success animation for first log and onboarding completion.

9. Screen-by-Screen Requirements
9.1 Welcome screen
Goal: Build trust and emotional comfort immediately.
Required content: brand message, privacy reassurance, CTA to begin.
Design: hero illustration or mascot, glass card CTA, soft glow background.

9.2 Signup screen
Goal: Fast account creation.
Required content: email, Apple, Google login, optional nickname.
Design: minimal fields, no clutter, high contrast CTA.

9.3 Cycle basics
Goal: Capture essential personalization.
Questions: last period date, cycle length, health intent.
Design: one question per screen, large tap targets, simple inputs.

9.4 Consent screen
Goal: Explicit trust and legal clarity.
Required content: short privacy explanation, toggle-based optional consent, agree CTA.
Design: clear hierarchy, calm tone, no legal wall.

9.5 Permission primer
Goal: Prepare users for notification permissions.
Required content: why reminders matter, what frequency to expect, skip option.
Design: warm explanation card, one CTA, one secondary later action.

9.6 First log
Goal: Achieve immediate product value.
Required content: mood and period/spotting today.
Design: small, low-pressure form with celebratory completion state.

9.7 Home dashboard
Goal: Show value instantly after onboarding.
Required content: cycle phase, next check-in, symptom trend, log CTA.
Design: stacked glass cards with one primary action and supporting feature cards.

10. Visual Design Requirements
Color system
Background: warm cream, muted peach, soft lavender.

Surfaces: translucent white with tinted overlays.

Accent colors: rose, lilac, coral, mauve.

Text: deep charcoal or plum for readability.

Typography
Soft, modern sans-serif.

Clear hierarchy.

Friendly but not childish.

Spacious line-height for calm reading.

Shape language
Large radius cards.

Soft pill buttons.

Rounded chips and toggles.

No sharp corners except maybe in data tables/settings.

11. Component Requirements
Card components
Standard glass card.

Insight card.

Feature card.

Reminder card.

Cycle status card.

Symptom log card.

Inputs
Date picker.

Segmented controls.

Sliders for cycle length.

Toggle switches.

Single-choice cards.

Actions
Primary CTA.

Secondary ghost CTA.

Skip / Later actions.

Save and resume for longer flows.

12. Motion Requirements
Transition patterns
Fade in + gentle rise.

Soft blur-to-clear reveal for cards.

Smooth slide between onboarding steps.

Slight scale on primary buttons.

Special moments
First log complete.

Onboarding complete.

Reminder acknowledged.

Insight generated.

Motion constraints
No abrupt bounce.

No strobing.

No aggressive particle systems.

Keep all motion calm and supportive.

13. Accessibility Requirements
Maintain readable contrast on translucent surfaces.

Support dynamic text sizes.

Ensure touch targets are large enough for mobile.

Avoid relying on color alone to communicate status.

Provide reduced-motion-friendly alternatives.

14. Analytics Requirements
Track:

Screen-by-screen onboarding drop-off.

Time per screen.

Permission primer opt-in rate.

First log completion.

Skip behavior.

Day-7 return.

Use the metrics to identify where friction is too high.

15. MVP Scope
In scope
Cozy glassmorphism design system.

Onboarding flow.

Consent and privacy screens.

First log.

Home dashboard.

Core cards.

Motion guidelines.

Out of scope for MVP
Advanced social features.

Deep AI diagnosis.

Complex partner syncing.

Detailed body mapping.

Long-term personalization beyond essentials.

16. Risks
Too much glass effect could reduce readability.

Too many onboarding questions could increase drop-off.

Motion could feel distracting if overused.

Privacy copy could become too legal and lose warmth.

Feature cards could become clutter if they aren’t tightly prioritized.

17. Open Questions
Should the mascot appear on every onboarding screen or only key moments?

Should the home dashboard prioritize cycle phase or symptom trend first?

What level of optional consent should be required before first log?

Should feature cards be personalized by cycle stage or kept static initially?