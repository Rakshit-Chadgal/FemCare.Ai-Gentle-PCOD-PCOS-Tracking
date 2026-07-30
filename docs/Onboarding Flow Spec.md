# FemCare Onboarding Flow Specification

Cozy, trust-first onboarding with one question per screen, visible skip options, and gentle motion cues.

## 1. Flow Overview

The onboarding flow consists of 7 screens, each presenting a single focused question or action. The total experience should complete in 4–6 minutes.

| Step | Screen | Type | Skippable |
|---|---|---|---|
| 1 | Welcome | Trust & warmth | No |
| 2 | Signup | Account creation | Yes (skip → guest) |
| 3 | Cycle Basics | Personalization | Yes |
| 4 | Privacy Consent | Legal trust | Yes (defaults to essential only) |
| 5 | Permission Primer | Notification prep | Yes |
| 6 | First Log | Immediate value | No (required to complete) |
| 7 | Completion | Celebration & transition | No |

### 1.1 Navigation model

- Horizontal swipe between screens (snap-center, `scroll-snap-type: x mandatory`)
- Progress dots at bottom (4 active dots for 7 screens with grouped indicators)
- Skip button visible on all screens except step 7
- Back navigation via swipe left or header back button on steps 3–6

### 1.2 Progress indicator

- 7 small dots at the bottom center
- Active dot: `w-6 bg-primary`, inactive: `w-2 bg-muted-foreground/30`
- All dots transition smoothly on change (200ms width, 300ms color)

## 2. Screen-by-Screen Specification

### 2.1 Screen 1 — Welcome

**Purpose**: Build trust and emotional comfort immediately.

**Layout**:
- Full-screen glass card (`rounded-3xl`, `p-8`, `max-w-sm`) centered vertically
- Hero illustration or CompanionMascot above the card (`mood={4}`, phase=`follicular`, size={120})
- Branded headline: "Welcome to FemCare"
- Warm subtitle explaining the app's purpose in one sentence
- Primary CTA: "Get Started" with ArrowRight icon
- Soft ambient glow background (blush-to-lavender gradient blobs)

**Content**:
```
[CompanionMascot — mood 4, follicular phase]

Welcome to FemCare

A calm, private space to track your symptoms,
notice patterns, and feel more prepared for
doctor visits.

[ Get Started → ]
```

**Interactions**:
- "Get Started" button: `rounded-[22px]`, `h-12`, `w-full`, `font-medium`
- Tap triggers slide transition (fade + gentle rise, 300ms)
- No skip button on this screen

**Motion**:
- Card enters: opacity 0→1, translateY 16px→0, 400ms `ease-out`
- Mascot gently bounces (`companion-bounce`, 600ms) after card is visible
- Background blobs are static but may have subtle scale pulse

**Design tokens**:
- Background: blush gradient (#FFE4E9 → #E8DFF5)
- Card: `.glass-card` class
- CTA: primary filled button

---

### 2.2 Screen 2 — Signup

**Purpose**: Fast account creation with minimal friction.

**Layout**:
- Glass card centered, same sizing as screen 1
- Small icon (Shield or Heart) in a soft accent circle above
- Two fields: email, password
- Optional: Apple ID and Google login buttons
- Optional: nickname field (inline, not stacked)
- Primary CTA: "Create Account"
- Secondary: "Skip and continue as guest" link

**Content**:
```
[ Shield icon in accent circle ]

Create your account

[ Email address ]
[ Password ]

  — or continue with —

[  Apple ID  ]   [  Google  ]

[ Create Account → ]

  Skip this step
```

**Fields**:
- Email: native `type="email"`, required
- Password: native `type="password"`, minimum 8 chars, required
- Apple ID: shown if platform supports it
- Google: shown with `GoogleIcon` component
- Nickname: optional, `placeholder="What should we call you?"`

**Interactions**:
- Primary CTA disabled until email + password are valid
- "Skip this step" link fades in after 2 seconds (gentle motion)
- Social buttons use `variant="outline"` with `glass-pill` style
- Tap on "Skip" navigates directly to screen 5 (cycle basics) or screen 3 (first log)

**Motion**:
- Card enters: `card-rise` animation (280ms `ease-out both`)
- Social buttons stagger in at 50ms intervals
- Field validation: gentle shake on error (50ms, `cubic-bezier(0.36, 0.07, 0.19, 0.97)`)

**Design tokens**:
- Input: `rounded-xl`, full-width
- Card: `.glass-card`
- Social buttons: `variant="outline"`, `rounded-full`, `glass-pill`

---

### 2.3 Screen 3 — Cycle Basics

**Purpose**: Capture essential personalization in a single question.

**Layout**:
- One question per screen (if expanded, use a 2-screen variant)
- Large tap targets for all interactive elements
- Simple, focused inputs only

**Screens in this step**:

**3a: Last period date**
```
[ Calendar icon ]

When was your last period?

[ 📅  Select date  ]

[ Back ]                    [ Continue → ]
```
- Date picker uses native `<input type="date">` with `rounded-xl` styling
- Max date is today
- "Not sure" is a visible secondary option

**3b: Cycle length**
```
[ Slider: 21–40 days, default 28 ]

How long is your typical cycle?

    21  28  35  40
         ●

[ < 28 days ]  [ About 28 ]  [ > 28 days ]

[ Back ]                    [ Continue → ]
```
- Slider uses styled `<input type="range">` from `index.css`
- Optional: three simple segmented choices instead of slider
- Skip button visible on right side

**3c: Health intent** (optional)
```
[ Question mark icon ]

What brings you here today?

  ◯ Track my cycle
  ◯ Log symptoms
  ◯ Understand patterns
  ◯ Prepare for a doctor visit

[ Skip ]                    [ Continue → ]
```
- Single-select using rounded checkbox-style cards
- Each option is a tappable chip with glass-pill styling
- Minimum 1 selection, but "Continue" works with zero selections (maps to general tracking)

**Motion**:
- Each sub-screen slides in horizontally (300ms, snap-center)
- Slider thumb uses the styled track from `index.css` (`input[type="range"]` overrides)
- Sub-screens share the same card container for visual continuity

**Design tokens**:
- Slider: 8px track height, `rounded-full`, thumb `28×28px` with gradient
- Cards: `.glass-card`
- Segmented controls: `rounded-full` chips with `glass-pill`

---

### 2.4 Screen 4 — Privacy Consent

**Purpose**: Explicit trust and legal clarity without a legal wall.

**Layout**:
- Glass card with clear hierarchy
- Calm, warm tone in all copy
- Toggle-based optional consent for non-essential data
- Single "Agree" CTA
- "Full privacy policy" link in footer

**Content**:
```
[ Shield check icon ]

Your privacy matters

FemCare keeps your health data encrypted
and never shares it without your permission.
Here's what we collect and why:

  ◯ Cycle & symptom data — needed to
    give you insights and reminders
    [ toggle on/off ]

  ◯ Notification preferences — lets us
    send gentle reminders
    [ toggle on/off ]

  ◯ Anonymous usage data — helps us
    improve the experience
    [ toggle on/off ]

  🔒 All data is stored on your device
    and can be exported or deleted anytime.

[ I agree & continue → ]

View full privacy policy
```

**Interactions**:
- Essential consent (cycle data) is on by default and cannot be toggled off — this is required for first log
- Optional consents (notifications, analytics) are toggles
- "Agree" button is enabled when essential consent is acknowledged (always true)
- "View full privacy policy" opens an in-app sheet or external link
- Skip behavior: essential consent is accepted by default, toggles remain off

**Motion**:
- Card enters with `card-rise` (280ms)
- Toggle switches use the existing `Switch` component with `rounded-full` styling
- Each toggle animates on change (200ms `ease-out`)

**Design tokens**:
- Essential items: highlighted with soft blush background (`bg-blush` or `hsl(var(--blush) / 0.15)`)
- Toggles: existing `Switch` component with glass-pill border
- Policy link: `text-sm text-primary underline`

---

### 2.5 Screen 5 — Permission Primer

**Purpose**: Prepare users for notification permissions with warm explanation.

**Layout**:
- Warm explanation card, single CTA and secondary "Later" action
- Gentle illustration or mascot
- Short, benefit-focused copy

**Content**:
```
[ CompanionMascot — mood 4, phase="ovulation" ]

Stay in the loop

We'll send gentle reminders for:
  • Daily check-ins
  • Cycle predictions
  • Symptom trends

You're always in control —
you can change this later in settings.

[ Enable Reminders 🔔 ]    [ Not Now → ]
```

**Interactions**:
- Primary CTA triggers the native notification permission prompt
- "Not Now" dismisses the permission step and continues to step 6
- Permission result is tracked for analytics (opt-in rate)
- If user permanently denies, show a gentle fallback message on the home dashboard

**Motion**:
- Mascot gently bobs (`companion-bob`, 1800ms infinite) while on screen
- CTA button has a subtle glow (`shadow-glow`) to draw attention
- "Not Now" appears as a ghost/link-style button below the primary CTA

**Design tokens**:
- Card: `.glass-card`
- CTA: primary filled, `rounded-[22px]`, `h-12`
- "Not Now": secondary ghost style, `text-muted-foreground`
- Background: soft lavender tint (`#E8DFF5` blob)

---

### 2.6 Screen 6 — First Log

**Purpose**: Achieve immediate product value with low-pressure logging.

**Layout**:
- Small, focused form with minimal fields
- Celebration state upon completion (not a blank home screen)
- Mood selector and period/spotting entry

**Content (Pre-log)**:
```
[ Heart icon ]

How are you feeling right now?

  😊  😐  😔  😴  🌸

Any period or spotting today?

  [ No ]  [ Light ]  [ Medium ]  [ Heavy ]

[ 💚 Log this moment → ]
```

**Content (Post-log completion)**:
```
[ Checkmark animation (400ms draw) ]

[ CompanionMascot — mood 5, phase="ovulation" ]

You've taken your first step!

Your cycle journey starts now.
Track daily to see your patterns.

[ Continue to FemCare → ]
```

**Interactions**:
- Mood selector: 5 interactive emoji/circles, single select, large tap targets (44×44px minimum)
- Period selector: segmented pill buttons, `rounded-full`, `glass-pill` style
- "Log this moment" CTA: primary filled, `rounded-[22px]`, `h-12`
- Completion state: auto-reveals after successful log with a 500ms delay
- "Continue to FemCare" CTA dismisses onboarding and navigates to home dashboard

**Motion**:
- Form fields stagger in (50ms delay between each row)
- Mood circles pop in from scale(0) to scale(1) with spring easing (350ms)
- Completion checkmark draws in (stroke-dashoffset, 400ms)
- Mascot bounces (`companion-bounce`, 600ms)
- Background blobs gently pulse (3000ms cycle, `ease-in-out infinite`)
- Petal drift animation plays softly in the background (`petal-drift`, 1800ms)

**Design tokens**:
- Mood circles: `w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl`
- Period pills: `glass-pill` with `rounded-full`, `px-4 py-2`
- Completion card: `.glass-card` with `text-center` and `p-8`

---

### 2.7 Screen 7 — Completion

**Purpose**: Friendly completion state that transitions to the product.

**Layout**:
- Celebratory card that fills the screen
- Mascot in a high-mood state
- Summary of what was set up
- Primary CTA to enter the app
- Gentle background with ambient blobs

**Content**:
```
[ 🎉 CompanionMascot — mood=5, phase="ovulation", size=110 ]

You're all set!

Here's what you can do now:
  ✓ Track your cycle
  ✓ Log symptoms and mood
  ✓ View personalized insights
  ✓ Set gentle reminders

[ Enter FemCare → ]
```

**Interactions**:
- "Enter FemCare" CTA saves onboarding state and navigates to `/`
- On successful save: `localStorage.setItem('femcare_onboarded', 'true')`
- Disclaimer checkbox is included on this screen (or merged from step 4)
- If the checkbox is not yet acknowledged, the CTA is disabled with a gentle tooltip

**Motion**:
- Card enters with `card-rise` (280ms)
- Mascot performs celebration bounce (`companion-bounce`, 600ms)
- Feature list items stagger in with `card-rise` (50ms each, 8 items max)
- CTA button has a subtle scale pulse (`scale(1.0) → scale(1.02) → scale(1.0)`) looping gently
- Background blobs: slow parallax drift on scroll

**Design tokens**:
- Feature list: `space-y-3`, each item with a `✓` checkmark in primary color
- Card: `.glass-card`, `rounded-3xl`, `p-8`
- CTA: primary filled, `rounded-[22px]`, `h-12`, full-width

## 3. Skip Behavior

| Screen | Skip Action | Destination |
|---|---|---|
| 2 (Signup) | Skip to guest | Screen 4 (Privacy) or screen 6 (First Log) |
| 3 (Cycle Basics) | Skip personalization | Screen 4 (Privacy) with defaults filled in |
| 4 (Privacy) | Skip optional consents | Screen 5 (Permission Primer) with all toggles off |
| 5 (Permission Primer) | Skip notifications | Screen 6 (First Log) with reminders off |
| 6 (First Log) | Not skippable | Must complete to finish onboarding |

- A persistent "Skip" button occupies the top-right corner on all screens except 6 and 7
- Skip button style: `text-sm font-medium text-muted-foreground hover:text-foreground transition`
- Skip always moves forward to the next non-skippable screen or to the completion state
- When skipped, defaults are applied: guest mode, default cycle length (28), all optional consents off, notifications disabled

## 4. Animation and Motion Guidelines

### 4.1 Screen transitions

- **Direction**: Horizontal slide (left to right for forward, right to left for back)
- **Duration**: 300ms
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)`
- **Snap behavior**: `snap-center`, `scroll-snap-type: x mandatory`
- **Container**: `overflow-x-auto overflow-y-hidden scrollbar-hide`

### 4.2 Card entry

- Fade in + gentle rise: `opacity 0→1, translateY 8px→0`
- Duration: 280ms, `ease-out both`
- Stagger delay: 50ms per element group

### 4.3 Microinteractions

- Button press: scale down to 0.97 for 100ms, return to 1.0 (150ms `ease-out`)
- Toggle switch: track color transitions 200ms `ease-out`
- Mood circle select: scale from 1.0 to 1.15 for 150ms, back to 1.0 (200ms)
- Checkmark draw: `stroke-dashoffset 30→0`, 400ms, 120ms delay

### 4.4 Completion celebration

- Checkmark draw animation: 400ms `ease-out`, 120ms delay
- Mascot bounce: 600ms `ease-out`
- Optional petal drift: 1800ms `ease-out forwards`, staggered across 3 petals
- CTA scale pulse: subtle 1.0→1.02→1.0 loop, 1200ms `ease-in-out infinite`

### 4.5 Reduced motion

- When `prefers-reduced-motion: reduce` is active:
  - All animations disabled except `opacity` transitions
  - `animation-duration` set to `0.01ms`
  - `transition-duration` set to `0.01ms`
  - Content still enters but with a simple fade (no slide, no scale)

## 5. Accessibility

- All tap targets minimum 44×44px
- Skip button has sufficient color contrast (`text-muted-foreground` on glass)
- Progress dots have `aria-label` indicating current step
- All interactive elements are keyboard-navigable (tabindex, focus-visible outlines)
- Focus-visible ring uses `--ring` token (`338 72% 66%`)
- Screen reader announces current step number ("Step 2 of 7: Create your account")
- Form validation errors announced via `aria-live` region
- Color is never the sole indicator of state — icons + labels used everywhere

## 6. Analytics Events

Track the following events for onboarding optimization:

| Event | Trigger | Data |
|---|---|---|
| `onboarding_screen_view` | Screen becomes visible | screen_name, step_number |
| `onboarding_field_start` | User interacts with a field | field_name, screen_name |
| `onboarding_field_complete` | Field passes validation | field_name, screen_name, duration_ms |
| `onboarding_skip_click` | User taps skip | screen_name, destination_screen |
| `onboarding_next_click` | User taps continue/next | screen_name, fields_filled_count |
| `onboarding_complete` | Onboarding fully finished | total_duration_ms, screens_skipped |
| `permission_opt_in` | User enables notifications | platform, result |
| `first_log_complete` | First symptom/mood logged | has_cycle_data, has_mood |
| `signup_method` | User signs up via method | method: `email`, `apple`, `google`, `guest` |
| `onboarding_drop_off` | User leaves before completing | last_screen, time_spent_seconds |

Use these metrics to identify friction points and reduce drop-off.

## 7. Technical Notes

### 7.1 Implementation in existing codebase

The onboarding flow is implemented in `src/pages/Onboarding.jsx` and currently has 4 screens. To match this specification, the following additions are needed:

- Expand to 7 screens (add signup, permission primer, first log as full screens)
- Add `glass-card` class consistently to all screen containers
- Add skip button with per-screen skip logic
- Add progress dot component
- Add completion celebration state with checkmark animation and petal drift
- Implement back navigation (swipe left) for screens 3–5
- Add analytics event tracking hooks

### 7.2 CSS dependencies

All visual styles rely on classes defined in `src/index.css`:
- `.glass-card` — primary card surface
- `.glass-pill` — interactive chips and toggles
- `.glass-nav` — if a top nav is added
- `.scrollbar-hide` — hide horizontal scrollbar
- `.stagger-cards` — staggered entry animation
- `@keyframes card-rise`, `companion-bounce`, `checkmark-draw`, `petal-drift` — animation keyframes

### 7.3 Components used

| Component | Source |
|---|---|
| `Button` | `@/components/ui/button` |
| `Input` | `@/components/ui/input` |
| `Label` | `@/components/ui/label` |
| `Checkbox` | `@/components/ui/checkbox` |
| `Switch` | `@/components/ui/switch` |
| `CompanionMascot` | `@/components/CompanionMascot` |
| `PetalCelebration` | `@/components/PetalCelebration` |
| `ThemeToggle` | `@/components/ThemeToggle` |

---

*Last updated: 2026-07-30. This spec maps to the existing `src/pages/Onboarding.jsx` implementation and extends it to match the 7-screen onboarding flow defined by the design prompt.*