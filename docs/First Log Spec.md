# FemCare First Log Specification

A small, calm, non-intimidating form for mood and period status, followed by a warm celebration state.

## 1. Purpose

Achieve immediate product value by giving the user a low-pressure first action. The form should feel quick, optional, and rewarding — not like a medical intake form.

## 2. Layout — Pre-Log State

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [ Heart icon ]        │      │
│    │                         │      │
│    │   How are you feeling   │      │
│    │   right now?            │      │
│    │                         │      │
│    │   😊 😐 😔 😴 🌸       │      │
│    │                         │      │
│    │   Any period or         │      │
│    │   spotting today?       │      │
│    │                         │      │
│    │   [ No ] [ Light ] [ Med]│  │
│    │                         │      │
│    │   [ 💚 Log this moment ]│      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

## 3. Visual Details — Pre-Log

### 3.1 Glass card
- Class: `glass-card`
- Border radius: `rounded-3xl` (24px)
- Padding: `p-8` (2rem)
- Width: `max-w-sm` (384px), `w-full`
- Text alignment: `text-center`

### 3.2 Icon
- Icon: Heart (lucide-react), `size={24}`
- Container: `inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-6`
- Color: `text-primary`

### 3.3 Headline
- Content: "How are you feeling right now?"
- Style: `text-xl font-display font-semibold text-foreground mb-4`
- Font: Fraunces, weight 500

### 3.4 Mood selector
- Five mood options in a horizontal row
- Emoji/mood circles: `w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl`
- Active state: `ring-2 ring-primary ring-offset-2 ring-offset-background`
- Tap target: minimum 44×44px (mood circle + padding)
- Spacing: `justify-center gap-3`
- Moods (left to right):
  1. 😊 Happy — `mood={4}`
  2. 😐 Neutral — `mood={3}`
  3. 😔 Low — `mood={2}`
  4. 😴 Tired — `mood={2}`
  5. 🌸 Special day (spotting/period start) — `mood={3}`
- Single select only
- Label below each mood: `text-xs text-muted-foreground` (e.g., "Happy", "Neutral", etc.)
- Labels appear below the circle on mobile, hidden on small screens if needed

### 3.5 Divider
- Thin horizontal line or soft gap: `border-t border-border/50 my-5`
- Label above period section: "Any period or spotting today?" — `text-xs text-muted-foreground`

### 3.6 Period/spotting selector
- Four segmented pill buttons in a row: `No`, `Light`, `Medium`, `Heavy`
- Style: `glass-pill`, `rounded-full`, `px-3 py-1.5`, `text-xs`, `text-center`
- Active state: `bg-primary/15 text-primary border border-primary/30`
- Inactive state: `bg-transparent text-muted-foreground border border-border/30`
- Single select (No is default, meaning no period)
- Layout: `flex justify-center gap-2`

### 3.7 Primary CTA — "Log this moment"
- Label: "Log this moment" with optional heart emoji `💚`
- Icon: optional heart icon `size={18}`
- Class: `w-full rounded-[22px] h-12 text-base font-medium`
- Style: primary filled (`bg-primary`, `text-primary-foreground`)
- State: enabled only after mood is selected (not period)
- Disabled state: `opacity-50 cursor-not-allowed`
- Hover: subtle brightness increase
- Press: scale 0.97

## 4. Layout — Post-Log Celebration State

```
┌─────────────────────────────────────┐
│                                     │
│        ✨ (checkmark) ✨           │
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [ CompanionMascot ]  │      │
│    │   mood=5, phase=ovul  │      │
│    │                         │      │
│    │   You've taken your     │      │
│    │   first step!           │      │
│    │                         │      │
│    │   Your cycle journey    │      │
│    │   starts now. Track     │      │
│    │   daily to see your     │      │
│    │   patterns.             │      │
│    │                         │      │
│    │   ┌─────────────────┐   │      │
│    │   │ Continue to     │   │      │
│    │   │ FemCare →       │   │      │
│    │   └─────────────────┘   │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

### 4.1 Checkmark animation
- SVG checkmark drawn with stroke animation
- `stroke-dasharray="30"`, `stroke-dashoffset` animates from 30 to 0
- Duration: 400ms, `ease-out`, 120ms delay
- Stroke: `text-primary`, `strokeWidth="2.5"`, `strokeLinecap="round"`
- Size: `w-12 h-12`, centered
- Path: `M 4 7 L 9 13 L 20 4` (simple checkmark)

### 4.2 Mascot
- Same `CompanionMascot` component
- Props: `mood={5}`, `phase="ovulation"`, `size={100}`
- Animation: `companion-bounce` (600ms `ease-out`)

### 4.3 Celebration headline
- Content: "You've taken your first step!"
- Style: `text-xl font-display font-semibold text-foreground mb-3`
- Font: Fraunces

### 4.4 Reinforcement text
- Content: "Your cycle journey starts now. Track daily to see your patterns."
- Style: `text-sm text-muted-foreground leading-relaxed mb-5`

### 4.5 CTA — "Continue to FemCare"
- Label: "Continue to FemCare" with ArrowRight icon
- Class: `w-full rounded-[22px] h-12 text-base font-medium`
- Style: primary filled
- Action: `completeOnboarding()` (same function as existing Onboarding.jsx)

### 4.6 Optional: Petal celebration
- Component: `PetalCelebration` (5 petals, staggered)
- Positioned absolutely behind the card
- Each petal uses `animate-petal` class (1800ms `ease-out forwards`)
- Petals are soft pink/lavender tones
- Triggered on completion state mount

## 5. Interactions

### Pre-log
| Interaction | Trigger | Result |
|---|---|---|
| Select mood | Tap mood circle | Active ring appears, mood stored in state |
| Select period option | Tap pill button | Active highlight, value stored |
| Tap "Log this moment" | Button click (requires mood) | Transition to celebration state |
| No mood selected | Tap CTA | Button remains disabled, shake animation on mood circles |

### Post-log
| Interaction | Trigger | Result |
|---|---|---|
| Tap "Continue to FemCare" | Button click | `completeOnboarding()`, navigate to home dashboard |
| Petal drift | Auto-triggered on mount | 5 petals drift outward and fade |

## 6. Motion

### Pre-log state
| Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|
| Card | card-rise | 280ms | ease-out both | 0ms |
| Icon | scale 0.8→1 + fade | 250ms | ease-out | 50ms |
| Headline | fade + translateY 6px→0 | 280ms | ease-out | 80ms |
| Mood circles | stagger scale 0→1 | 300ms | spring (0.34,1.56,0.64,1) | 150ms + 50ms/circle |
| Divider | fade in | 200ms | ease-out | 400ms |
| Period pills | fade in + slide up 4px | 250ms | ease-out | 450ms |
| CTA | fade in + scale 0.98→1 | 300ms | ease-out | 500ms |

### Celebration state
| Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|
| Checkmark stroke | stroke-dashoffset 30→0 | 400ms | ease-out | 100ms |
| Checkmark fill | scale 0→1 (optional circle behind) | 300ms | ease-out | 200ms |
| Mascot | companion-bounce | 600ms | ease-out | 300ms |
| Headline | fade in + translateY 6px→0 | 300ms | ease-out | 350ms |
| Reinforcement text | fade in | 300ms | ease-out | 400ms |
| CTA | fade in + subtle glow pulse | 300ms | ease-out | 450ms |
| Petals | petal-drift (staggered) | 1800ms | ease-out forwards | 500ms + 100ms/petal |

### 6.1 Mood selection feedback
- Selected mood circle: scale 1.0→1.15 for 150ms, return to 1.0 for 200ms
- Deselected mood: no animation (fades to inactive opacity)

### 6.2 Period pill feedback
- Tap: opacity 1→0.7→1 for 200ms
- Selected pill: border color transitions to `--primary` over 200ms

### 6.3 Celebration micro-timing
- All celebration animations cascade in sequence
- Total celebration duration: ~2200ms before CTA becomes clickable
- CTA has a gentle pulse animation after appearing (`scale(1)→scale(1.02)→scale(1)`, 1200ms, ease-in-out, infinite)

## 7. Form Validation Rules

| Field | Required? | Default | Error |
|---|---|---|---|
| Mood | Yes | null | Button shake, tooltip "Please select how you're feeling" |
| Period status | No | "No" | — |

- Period status defaults to "No" (no period/spotting), so the user only needs to log mood
- This makes the form feel low-pressure and quick
- If the user has period data to log (from onboarding step 3), the period section may be pre-filled but still editable

## 8. Design Tokens

| Token | CSS Variable | Usage |
|---|---|---|
| Mood circle bg | `bg-secondary` | Inactive mood circles |
| Active mood ring | `ring-primary` | Selected mood indicator |
| Mood circle size | `w-12 h-12` | 48px touch target |
| Mood emoji size | `text-2xl` | 32px |
| Period pill radius | `rounded-full` | Full-round pills |
| Period pill padding | `px-3 py-1.5` | Compact padding |
| CTA glow | `shadow-glow` | Celebration state emphasis |
| Checkmark stroke | `text-primary` | Primary color |

## 9. Accessibility

- Mood circles: `role="radiogroup"` with `aria-label="Mood selector"`, each circle has `role="radio"` with `aria-checked`, `aria-label="Mood: happy"` etc.
- Period pills: `role="radiogroup"` with `aria-label="Period status"`, each pill has `role="radio"` with `aria-checked`
- "Log this moment" button: `aria-disabled` when mood not selected, `aria-label="Log your first entry"
- Celebration state: `aria-live="polite"` so screen readers announce "Your first log is complete"
- `prefers-reduced-motion`: skip all animations, show checkmark immediately, skip petal drift
- Keyboard: Tab cycles through mood circles and period pills; Enter/Space selects

## 10. Responsive

- Mood circles wrap on very small screens (`flex-wrap`, `gap-2`) but stay on one row on standard phones
- Period pills can wrap to two rows on narrow screens: `flex-wrap`, `justify-center`
- Card remains `max-w-sm` on all viewports
- Touch targets remain 44px minimum in all layouts

## 11. Consistency with Codebase

This spec aligns with:
- `Onboarding.jsx` Slide 4 structure (All Set screen) — same card pattern, same checkbox/disclaimer approach, same `completeOnboarding()` flow
- `PetalCelebration` component (`src/components/PetalCelebration.jsx`) — 5 staggered petals with `animate-petal`
- `CompanionMascot` component — mood 5 for celebration, ovulation phase
- `CompanionMascot` phase colors — `ovulation` maps to `#F5B8C8 → #E8A0B8`
- `checkmark-draw` animation from `index.css` (line 273–281)
- CSS variables: `--primary`, `--primary-foreground`, `--secondary`, `--muted-foreground`, `--foreground`
- `Ui-Ux PRD.md` §9.6 (First log): "small, low-pressure form with celebratory completion state"
- `index.css`: `.theme-ready *` transition class for smooth theme changes during onboarding