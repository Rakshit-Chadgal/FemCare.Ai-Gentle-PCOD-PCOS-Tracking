# FemCare Motion Specification

Calm, supportive, and elegant motion design — slow fades, soft rises, and gentle success celebrations.

## 1. Motion Philosophy

FemCare's motion language embodies warmth, support, and quiet confidence. Every animation should feel like a gentle breath — guiding attention without startling, confirming without celebrating loudly, and flowing without rushing. The motion system is a quiet companion, not a performer.

Core principles:
- **Gentle**: All motion is slow, soft, and smooth
- **Supportive**: Animation confirms actions and guides attention, never distracts
- **Calm**: No flashing, bouncing, strobing, or aggressive damping
- **Breathing**: Intervals between animations feel unhurried and spacious
- **Purposeful**: Every motion serves a functional goal (attention, confirmation, navigation, delight)

## 2. Motion Categories

### 2.1 Navigation transitions

| Transition | Trigger | Duration | Easing | Pattern |
|---|---|---|---|---|
| Forward slide | Next screen | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Content fades in as card slides right |
| Backward slide | Previous screen | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Content fades in as card slides left |
| Card enter | New card appears | 280ms | `ease-out both` | Fade + gentle rise (translateY 12px → 0) |
| Card exit | Card removed | 200ms | `ease-in` | Fade + gentle sink (translateY 0 → -8px) |
| Dialog open | Modal/sheet appears | 300ms | `ease-out` | Blur-to-clear reveal (backdrop: blur 0→14px, content: fade + scale 0.97→1) |
| Dialog close | Modal/sheet dismisses | 200ms | `ease-in` | Reverse of open |

### 2.2 Content entrance

| Pattern | Description | Duration | Easing | Usage |
|---|---|---|---|---|
| Fade rise | opacity 0→1, translateY 8px→0 | 280ms | `ease-out both` | Cards, list items, form rows |
| Fade only | opacity 0→1 | 300ms | `ease-out` | Text paragraphs, descriptions |
| Staggered rise | fade rise with sequential delay | 280ms each | `ease-out both` | Multiple cards, grid items, onboarding steps |
| Blur reveal | backdrop-filter blur 10px→0 + fade | 500ms | `ease-out` | Glass surfaces appearing from behind |
| Scale in | scale 0.95→1 + fade | 250ms | `ease-out both` | Small components, icons, badges |

### 2.3 Microinteractions

| Element | Pattern | Duration | Easing |
|---|---|---|---|
| Button press | scale 1→0.97, release 0.97→1 | 100ms / 150ms | `ease-out` |
| Button hover | brightness +1%, subtle shadow increase | 200ms | `ease-out` |
| Toggle switch | track width + dot position | 200ms | `ease-out` |
| Tab selection | indicator slide + color change | 250ms | `ease-out` |
| Chip select | scale 1→1.05→1 | 150ms | `ease-out` |
| Skeleton shimmer | gradient translateX -100%→200% | 1200ms | `linear infinite` |
| Input focus | border color + subtle glow | 200ms | `ease-out` |
| Slider thumb press | scale 1→1.15 | 100ms | `ease-out` |

### 2.4 Success and completion animations

| Animation | Description | Duration | Easing | Usage |
|---|---|---|---|---|
| Checkmark draw | stroke-dashoffset 30→0 | 400ms | `ease-out` | First log completion, onboarding done |
| Companion bounce | translateY -8px + rotate -4°→0 | 600ms | `ease-out` | Onboarding complete, first log |
| Petal drift | opacity 1→0, translate outward + rotate | 1800ms | `ease-out forwards` | Celebration moments |
| Phase bloom | scale 0.5→1.18→1 + opacity 0.3→1 | 350ms | `ease-out` | Cycle phase changes |
| Card celebration | subtle glow pulse + soft shadow expansion | 2000ms | `ease-in-out infinite` | First log, onboarding complete |
| Confetti-free burst | 3 soft pastel circles expand + fade | 1200ms | `ease-out forwards` | Achievement moments (optional, restrained) |

## 3. Easing Curves

| Name | Cubic-Bezier | Character | Usage |
|---|---|---|---|
| `calm-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Fast start, gentle end | Screen transitions, primary navigation |
| `soft-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard material curve | Standard transitions |
| `gentle-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Slow, breathing rhythm | Ambient loops, companion animations |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot | Toggle switches, playful micro-interactions |
| `soft-ease` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Very gentle | Text selections, subtle hover states |

## 4. Animation Keyframes (CSS)

All keyframes are defined in `src/index.css` and documented here for reference.

### 4.1 `card-rise`
```
from: opacity 0, transform translateY(12px)
to: opacity 1, transform translateY(0)
```
Duration: 280ms. Used for card entrance with stagger delays.

### 4.2 `companion-bounce`
```
0%: translateY(0) rotate(0deg)
20%: translateY(-8px) rotate(-4deg)
40%: translateY(0) rotate(3deg)
60%: translateY(-4px) rotate(-1deg)
80%: translateY(0) rotate(0deg)
```
Duration: 600ms `ease-out`. Used for mascot celebration.

### 4.3 `companion-bob`
```
0%, 100%: translateY(0)
50%: translateY(-6px)
```
Duration: 1800ms `ease-in-out infinite`. Idle warmth for mascot.

### 4.4 `petal-drift`
```
0%: opacity 0, translate(0, 0) rotate(0deg) scale(0.7)
12%: opacity 0.9
100%: opacity 0, translate(var(--drift-x), var(--drift-y)) rotate(var(--drift-rot)) scale(1)
```
Duration: 1800ms `ease-out forwards`. Staggered across petals.

### 4.5 `checkmark-draw`
```
from: stroke-dashoffset 30
to: stroke-dashoffset 0
```
Used on SVG checkmark elements. 400ms `ease-out`, 120ms delay.

### 4.6 `phase-bloom`
```
0%: opacity 0.3, scale(0.5)
50%: opacity 1, scale(1.18)
100%: opacity 1, scale(1)
```
Duration: 350ms `ease-out`. Cycle phase indicator emphasis.

### 4.7 `companion-bounce` (onboarding)
Same as 4.2 but often paired with onboarding completion.

## 5. Motion Guidelines by Context

### 5.1 Onboarding
- Screen transitions: horizontal slide, 300ms, `calm-out`
- Each slide's content enters with `card-rise` + 50ms stagger per element group
- Progress dots: width transition 200ms, color 300ms
- Skip button: opacity 0.5→1 on hover, 200ms
- Completion: checkmark draw + companion bounce + petal drift

### 5.2 Dashboard Cards
- Cards enter with staggered `card-rise` (50ms per card)
- Hover: subtle lift (`translateY(-2px)`) + shadow increase, 300ms
- Tap: scale 0.98 for 100ms (press feedback)
- Skeleton loaders: shimmer gradient, 1200ms linear infinite

### 5.3 Form Interactions
- Input focus: border color transition + soft glow, 200ms
- Error shake: translateX(-4px)→(4px)→(-2px)→(2px)→0, 400ms `ease-out`
- Validation success: checkmark draw (400ms) adjacent to field
- Option select (radio/toggle): scale 1→1.05→1, 300ms `ease-out`

### 5.4 Notifications and Toasts
- Entry: fade in + translateY(-8px)→0, 250ms `ease-out`
- Exit: fade out + translateY(-4px), 200ms `ease-in`
- Auto-dismiss: begin exit 3000ms after appearance

### 5.5 Theme Switching
- All background, border, text, and shadow transitions: 300ms ease
- Managed by `.theme-ready *` rule in `index.css`
- Prevents flash during dark/light mode toggle

### 5.6 Completion Celebrations

**First log**:
1. Checkmark draws in (400ms `ease-out`, 120ms delay)
2. Checkmark circle scales from 0 to 1 behind the stroke (200ms `ease-out`, 100ms delay)
3. Companion mascot bounces (600ms `ease-out`, 300ms delay)
4. Headline and text fade in (300ms `ease-out`, 400ms delay)
5. CTA button fades in with subtle glow pulse (300ms `ease-out`, 500ms delay)
6. 3 petals drift outward from the card center (1800ms `ease-out`, staggered at 100ms intervals each)

**Onboarding complete**:
1. Final card rises with `card-rise` (280ms)
2. Companion mascot celebration bounce (600ms)
3. Confetti-free burst: 3 soft pastel circles expand from center and fade (1200ms `ease-out forwards`, staggered)
4. CTA pulses gently (scale 1→1.02→1, 1200ms `ease-in-out infinite`)
5. All celebration elements fade out over 300ms after 3 seconds

## 6. Motion Constraints

### 6.1 Hard limits
- Maximum concurrent animations: 3 per viewport
- Maximum animation duration: 1800ms (any single animation)
- Minimum animation duration: 100ms (below this, instant is fine)
- No animation may start without a clear trigger
- No looping animation may run longer than 3 cycles without user interaction

### 6.2 Forbidden patterns
- No bounce (spring overshoot) on non-interactive elements
- No strobing or flashing (all animations must use soft, low-contrast values)
- No particle systems with more than 5 particles
- No sudden color shifts
- No aggressive damping or elastic easing on content elements
- No parallax on ambient backgrounds (subtle drift is acceptable)
- No shake on any element that is not an inline error field

### 6.3 Accessibility
- `prefers-reduced-motion: reduce` disables all non-essential animations:
  - `animation-duration` → `0.01ms` (instant)
  - `transition-duration` → `0.01ms` (instant)
  - Content enters with a simple fade (no slide, no scale)
  - Skeleton shimmer is disabled
  - Ambient loops are disabled
- Respect `prefers-reduced-motion` even if the user previously dismissed a browser prompt
- Do not re-enable animations after the user has set the preference

## 7. Performance Guidelines

- All animations use only `opacity`, `transform`, and `filter` properties
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-radius`
- GPU-promote glass layers with `transform: translateZ(0)` on `.glass` and `.glass-nav`
- Use `will-change: transform` sparingly (only on elements that animate simultaneously)
- Keep animation work on the compositor thread: avoid layout thrashing
- Ambient blob animations (if any) use `opacity` and `transform` only
- Respect battery saver mode: reduce animation complexity if `navigator.getBattery()` reports low battery (best-effort)

## 8. Motion Tokens Summary

| Token | Value |
|---|---|
| Duration fast | 150ms |
| Duration normal | 250ms |
| Duration slow | 400ms |
| Duration gentle | 600ms |
| Duration entrance | 280ms |
| Duration exit | 200ms |
| Duration celebration | 600–1800ms |
| Easing calm-out | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Easing soft-out | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Easing gentle-in-out | `cubic-bezier(0.65, 0, 0.35, 1)` |
| Easing spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Stagger increment | 50ms |
| Reduced motion | All durations → 1ms |

---

*Last updated: 2026-07-30. This spec extends the motion tokens defined in `src/index.css` and maps to the existing animation keyframes and component motion patterns.*