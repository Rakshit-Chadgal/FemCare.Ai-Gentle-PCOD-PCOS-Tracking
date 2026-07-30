# FemCare Feature Cards Specification

A set of frosted glass feature cards highlight cycle insights, symptom patterns, fertility awareness, reminders, and data export.

## 1. Purpose

Feature cards provide discoverability for advanced functions and help users understand the full range of FemCare's capabilities. Each card should be scannable, with a small icon, clear title, one-line benefit, and a subtle action cue.

## 2. Layout

### 2.1 Grid arrangement
- Primary surface: inside a card container or on a dedicated "Explore" / "Discover" page
- Layout: vertical stack with consistent spacing (`space-y-4` or `space-y-3`)
- Alternative: horizontal carousel scroll for home dashboard discovery row

### 2.2 Individual card layout

```
┌─────────────────────────────────────┐
│  🔍  [ Cycle Insights     → ]    │
│  Understand your patterns       │
│                                   │
└─────────────────────────────────────┘
```

- Container: `glass-card`, `rounded-2xl`, `p-4`, `rounded-2xl`
- Full width within parent, centered
- Internal layout: `flex items-center gap-4`
  - Icon container: `w-10 h-10 rounded-xl flex items-center justify-center` with a pastel background
  - Content: left-aligned, flex-1
    - Title: `text-sm font-semibold text-foreground`
    - Benefit line: `text-xs text-muted-foreground leading-relaxed`
  - Action cue: `ArrowRight` icon, `size={16}`, `text-muted-foreground`
- Tap state: subtle press scale (0.97) + background brightening
- Hover state (web): subtle lift with `shadow-soft`

## 3. Feature Card Data

### 3.1 Cycle Insights

| Field | Value |
|---|---|
| Icon | `BarChart3` or `PieChart` |
| Icon container bg | `bg-blush/40` (`hsl(var(--blush) / 0.4)`) |
| Icon color | `text-accent-foreground` |
| Title | "Cycle Insights" |
| Benefit | "Understand your patterns over time" |
| CTA | ArrowRight chevron |
| Navigation | `/insights` |

### 3.2 Symptom Patterns

| Field | Value |
|---|---|
| Icon | `Activity` or `HeartPulse` |
| Icon container bg | `bg-lavender/40` (`hsl(var(--lavender) / 0.4)`) |
| Icon color | `text-accent-foreground` |
| Title | "Symptom Patterns" |
| Benefit | "Track and spot recurring symptoms" |
| CTA | ArrowRight chevron |
| Navigation | `/log` (symptom tracking view) |

### 3.3 Fertility Awareness

| Field | Value |
|---|---|
| Icon | `Seedling` or `Sprout` |
| Icon container bg | `bg-blush/40` (`hsl(var(--blush) / 0.4)`) |
| Icon color | `text-accent-foreground` |
| Title | "Fertility Awareness" |
| Benefit | "Learn your fertile window with predictions" |
| CTA | ArrowRight chevron |
| Navigation | `/insights` (fertility tab) |
| Optional badge | "Coming soon" or "beta" — `text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full` |

### 3.4 Reminders

| Field | Value |
|---|---|
| Icon | `Bell` |
| Icon container bg | `bg-lavender/40` (`hsl(var(--lavender) / 0.4)`) |
| Icon color | `text-accent-foreground` |
| Title | "Reminders" |
| Benefit | "Gentle nudges to stay on track" |
| CTA | ArrowRight chevron |
| Navigation | `/settings` (reminders section) |

### 3.5 Data Export

| Field | Value |
|---|---|
| Icon | `Download` or `FileDown` |
| Icon container bg | `bg-blush/40` (`hsl(var(--blush) / 0.4)`) |
| Icon color | `text-accent-foreground` |
| Title | "Data Export" |
| Benefit | "Keep a copy of your health data" |
| CTA | ArrowRight chevron |
| Navigation | `/settings` (privacy section) |

### 3.6 Additional features (for future expansion)

| Feature | Title | Benefit |
|---|---|---|
| Mood Tracker | "Mood Trends" | "See how mood connects to your cycle" |
| Wellness | "Wellness Tips" | "Personalized suggestions for your phase" |
| Community | "Support Community" | "Join a safe, moderated space to share" |
| Doctor Prep | "Doctor Prep" | "Generate a summary for your appointment" |

## 4. Visual Variants

### 4.1 Standard card
- Glass card with slight pastel tint per feature
- Icon, title, benefit, and chevron as described above
- `gap-4` between icon and content

### 4.2 Compact card
- Used in horizontal scroll (carousel) on home dashboard
- Slightly reduced padding: `p-3`
- Icon size reduced to `w-8 h-8`
- Title + benefit on same line where space allows

### 4.3 Highlighted card
- Used for primary/new features
- Background: subtle gradient `linear-gradient(135deg, hsl(var(--blush) / 0.2), hsl(var(--lavender) / 0.2))`
- Slightly larger shadow: `shadow-warm`
- "New" badge: `text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full`, positioned at top-right of card

## 5. Interaction Patterns

| Interaction | Trigger | Result |
|---|---|---|
| Tap feature card | Primary action | Navigate to feature page with slide transition |
| Tap and hold | Long press | Quick preview tooltip with brief description |
| Scroll through carousel | Horizontal swipe | Snap to next card, dot indicator |
| Load more | Scroll to end of list | Fetch and append additional feature cards (if any) |

## 6. Motion

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Card entry (stack) | card-rise stagger | 280ms each | ease-out both |
| Card stagger delay | 50ms per card | — | — |
| Carousel card entry | fade + translateX 10px | 300ms | ease-out |
| Chevron on hover | translateX 2px | 200ms | ease-out |
| Card press | scale 0.98 | 100ms | ease-out |
| Icon on hover | scale 1.05 | 200ms | ease-out |
| Badge pop (new) | scale 0→1 (spring) | 250ms | cubic-bezier(0.34,1.56,0.64,1) |

### 6.1 Scroll hint animation (carousel)
- If the feature cards row is scrollable, show a subtle fade gradient on the right edge
- A gentle "swipe" icon animation loops to hint that more cards are available
- Animation: `translateX(10px)→translateX(0)` over 1000ms, `ease-in-out`, infinite
- Opacity: 0.4, `prefers-reduced-motion` disables

## 7. Design Tokens

| Token | Usage |
|---|---|
| `--blush` at `0.4` opacity | Pink-tinted icon backgrounds for cycle-related features |
| `--lavender` at `0.4` opacity | Lavender-tinted icon backgrounds for tracking/reminder features |
| `--accent` at `0.4` opacity | Soft purple tint for general/info features |
| `--radius` (`1rem` / 16px) | Card border radius for feature cards |
| `--radius-2xl` (`1.5rem` / 24px) | Icon container border radius |
| ArrowRight icon | `size={16}`, `text-muted-foreground` |

## 8. Spacing

| Element | Spacing |
|---|---|
| Card internal padding | `p-4` (standard), `p-3` (compact) |
| Gap between icon and content | `gap-4` |
| Gap between cards in stack | `space-y-3` |
| Gap between cards in carousel | `gap-3` |
| Section title (if present) | `text-xs text-muted-foreground uppercase tracking-wider mb-3` |

## 9. Accessibility

- Each feature card is focusable (`tabindex="0"`) with visible focus ring
- `aria-label` on each card describes the feature and action (e.g., "Cycle Insights — Understand your patterns over time")
- Chevron icon has `aria-hidden="true"` (decorative)
- Carousel has `role="region"` and `aria-label="Featured features"`
- `prefers-reduced-motion` disables all animations including scroll hints
- Color contrast: icon text meets AA on tinted containers
- If "Coming soon" badge is used, it does not indicate unavailability — screen reader still reads as accessible feature

## 10. Responsive

- **Mobile (default)**: Single column stack, `max-w-sm` centered
- **Tablet**: 2-column grid, `gap-4`, centered with max-width constraint
- **Desktop**: 3-column grid or wider carousel
- **Smallest screens (320px)**: Cards remain full-width with `p-3` compact padding
- **Horizontal carousel**: Scrollable with `scroll-snap-type: x mandatory`, each card `shrink-0 w-[85vw]`

## 11. Consistency with Codebase

This spec aligns with:
- `src/components/InsightCard.jsx` — existing card with glass treatment
- `src/components/BottomNav.jsx` — bottom navigation pattern
- `src/index.css` `.glass-card`, `.glass-pill` classes
- CSS custom properties: `--blush`, `--lavender`, `--accent`, `--radius`
- `Ui-Ux PRD.md` §11 (Component Requirements): lists feature card as a component
- `index.css` `stagger-cards` animation for stacked card entry
- `CompanionMascot.jsx` `PHASE_COLORS` for icon tinting consistency
- `Button` component variants for optional "View All" or CTA links
- `src/pages/Settings.jsx` and `src/pages/Privacy.jsx` for navigation targets