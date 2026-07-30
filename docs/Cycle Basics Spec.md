# FemCare Cycle Basics Specification

Three onboarding screens, each presenting one question with large tap targets, soft glass cards, and a calm pastel palette.

## 1. Purpose

Capture essential personalization data in a low-pressure, focused flow. Each screen asks a single question so the user never feels overwhelmed.

## 2. Screen Flow

| Screen | Question | Input Type | Skippable |
|---|---|---|---|
| 3a | Last period date | Date picker | Yes |
| 3b | Typical cycle length | Slider or segmented choice | Yes |
| 3c | Health intent | Single-select chips | Yes |

## 3. Screen 3a — Last Period Date

### 3.1 Layout

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [ Calendar icon ]     │      │
│    │                         │      │
│    │   When was your last    │      │
│    │   period?               │      │
│    │                         │      │
│    │   ┌─────────────────┐   │      │
│    │   │ 📅  Select date │   │      │
│    │   └─────────────────┘   │      │
│    │                         │      │
│    │   [ Not sure ]          │      │
│    │                         │      │
│    │   [ Back ]    [ Continue → ]│  │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

### 3.2 Visual Details

- **Icon container**: `inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/30 mb-6`
- **Icon**: Calendar (lucide-react), `size={28}`, `text-accent-foreground`
- **Headline**: `text-xl font-display font-semibold text-foreground mb-3` — "When was your last period?"
- **Date input**: Native `<input type="date">`, `rounded-xl` border, full width within card
  - `max` attribute set to today's date (`new Date().toISOString().split('T')[0]`)
  - Placeholder: "Select date"
  - Label above: "Last period start date" (`text-xs text-muted-foreground`)
- **"Not sure" option**: A secondary link-style button (`text-sm text-muted-foreground underline`) that sets the value to empty/null and treats it as "not provided"
- **Navigation buttons**:
  - Back: `variant="outline"`, `rounded-[22px]`, `h-12`, `flex-1`
  - Continue: primary filled, `rounded-[22px]`, `h-12`, `flex-1`
  - Both in a `flex gap-3 mt-6` row

### 3.3 Validation
- Date required only if user wants to use cycle predictions; "Not sure" is a valid response
- If date is selected, Continue proceeds to 3b
- If "Not sure" is tapped, Continue proceeds with no date value

### 3.4 Motion
- Card enters with `card-rise` (280ms)
- Date input field appears with a subtle bottom border animation (200ms)
- "Not sure" link fades in after input field

## 4. Screen 3b — Cycle Length

### 4.1 Layout

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [ Slider icon ]       │      │
│    │                         │      │
│    │   How long is your      │      │
│    │   typical cycle?        │      │
│    │                         │      │
│    │       28 days           │      │
│    │                         │      │
│    │   ──────●──────────     │      │
│    │   21  24  28  32  40    │      │
│    │                         │      │
│    │   [ < 28 ] [ About 28 ] [ > 28 ] │
│    │                         │      │
│    │   [ Back ]    [ Continue → ]│    │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

### 4.2 Visual Details

- **Icon container**: same as 3a
- **Icon**: Activity or ruler icon, `size={28}`
- **Headline**: "How long is your typical cycle?"
- **Slider**: Native `<input type="range">` styled via `index.css`
  - Range: 21–40 days
  - Default: 28
  - Step: 1
  - Styled track: `h-8`, `rounded-full`, `--muted` background
  - Thumb: `w-7 h-7`, gradient primary, white border, shadow glow
  - Value display: centered, `text-lg font-display font-semibold`, above slider
  - Labels: `text-xs text-muted-foreground`, below slider, spaced evenly
- **Segmented choice alternative** (optional): Three pill buttons for `< 28`, `About 28`, `> 28`
  - Style: `glass-pill`, `rounded-full`, `px-4 py-2`, `text-sm`
  - Active state: `bg-primary/15 text-primary`
- **Navigation**: same as 3a

### 4.3 State
- Slider value stored in state (`cycleLength`)
- Segmented choice updates value to nearest (21, 28, or 35)
- Both methods set the same state

### 4.4 Motion
- Slider thumb: `transform: scale(1.0)` on hover, `scale(1.15)` on active
- Value display updates with a 150ms transition
- Segmented pills: tap microfeedback (scale 0.95 for 100ms)

## 5. Screen 3c — Health Intent

### 5.1 Layout

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [ Question icon ]     │      │
│    │                         │      │
│    │   What brings you       │      │
│    │   here today?           │      │
│    │                         │      │
│    │   ┌─────────────────┐   │      │
│    │   │ ◯ Track my cycle │   │      │
│    │   └─────────────────┘   │      │
│    │   ┌─────────────────┐   │      │
│    │   │ ◯ Log symptoms   │   │      │
│    │   └─────────────────┘   │      │
│    │   ┌─────────────────┐   │      │
│    │   │ ◯ Understand     │   │      │
│    │   │   patterns       │   │      │
│    │   └─────────────────┘   │      │
│    │   ┌─────────────────┐   │      │
│    │   │ ◯ Prepare for    │   │      │
│    │   │   a doctor visit │   │      │
│    │   └─────────────────┘   │      │
│    │                         │      │
│    │   [ Skip ]    [ Continue → ]│ │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

### 5.2 Visual Details

- **Icon container**: same as previous screens
- **Icon**: Heart or activity icon, `size={28}`
- **Headline**: "What brings you here today?"
- **Options**: Tappable rounded cards (`rounded-xl`, `p-4`, `bg-secondary/50`, `border border-border/30`)
- Each option:
  - `flex items-center gap-3`
  - Circle indicator: `w-5 h-5 rounded-full border-2 border-muted-foreground/30`
  - Label: `text-sm text-foreground`
  - Selected state: `border-primary` + `bg-primary/5` + filled circle inside indicator
- **"Skip"**: Ghost link style, `text-sm text-muted-foreground`
- **Continue**: Primary button, same sizing as other screens
- Minimum selection: 0 (Continue works with no selection, defaults to general tracking)

### 5.3 State
- `selectedIntent`: string or null
- Single select only (radio behavior — selecting one deselects others)
- Continue proceeds regardless of selection (0 or more)

### 5.4 Motion
- Option cards stagger in at 50ms intervals using `stagger-cards` class
- Tap selection: scale on indicator circle (0.8→1.0, 150ms)
- Selected card gets a subtle `animate-phase-bloom` (350ms)

## 6. Shared Patterns Across All Three Screens

### 6.1 Card appearance
- All screens use `.glass-card` with `rounded-3xl` and `p-8`
- `max-w-sm`, centered on screen
- Same background ambient blobs as other onboarding screens

### 6.2 Progress indicator
- Progress dots remain visible at bottom
- Screen 3 screens are steps 3, 4, and 5 of the overall 7-step flow
- Dots reflect current position among all 7 screens

### 6.3 Navigation
- Horizontal swipe (snap) for forward/back
- Top-right "Skip" button jumps to final non-skippable screen
- Header back arrow on screen 3b and 3c only
- Continue button always visible at bottom of card

### 6.4 Input styling
- All inputs use `rounded-xl` (16px) border radius
- Date picker uses native `<input type="date">`
- Range slider uses existing `index.css` styles (line 155+)
- Toggle/chip selections use glass-pill styling

### 6.5 Typography
- Icons and headlines follow the same hierarchy as Welcome screen
- Label text: `text-xs text-muted-foreground`
- Body text: `text-sm text-muted-foreground leading-relaxed`

## 7. Motion Summary (All Three Screens)

| Element | Animation | Duration | Easing | Stagger |
|---|---|---|---|---|
| Card | card-rise | 280ms | ease-out both | 0ms |
| Icon | scale 0.8→1 + fade | 250ms | ease-out | 50ms |
| Headline | fade + translateY 6px→0 | 280ms | ease-out | 80ms |
| Input field | fade + slide up 4px | 280ms | ease-out | 120ms |
| Options (3c) | stagger card-rise | 280ms each | ease-out both | 150ms + 50ms/item |
| Navigation buttons | fade in | 250ms | ease-out | 300ms |
| Progress dots | update width + color | 200ms | ease-out | 0ms |

## 8. Accessibility

- Date input has associated `<label>` above it
- Slider has `aria-label="Cycle length in days"` and live region for value
- Segmented choice uses `role="radiogroup"` with `aria-checked` on each option
- Health intent chips use `role="radio"` with `aria-selected`
- Minimum touch target: 44×44px on all tappable elements
- Keyboard navigation: Tab cycles through all options, Enter/Space selects

## 9. Consistency with Codebase

- `Onboarding.jsx` already has date input at lines 182–189 and segmented-style skip/continue buttons
- `index.css` has range slider styles (lines 155–198)
- `glass-card`, `rounded-3xl`, `rounded-[22px]`, `h-12` classes exist and are used
- Companion mascot colors from `PHASE_COLORS` can be extended for follicular phase
- CSS custom properties (`--blush`, `--lavender`, `--secondary`, `--primary`) all available