# FemCare Home Dashboard Specification

A cozy, airy dashboard with stacked glass cards, clear visual hierarchy, and a prominent primary CTA.

## 1. Purpose

Show the user immediate value after onboarding. The dashboard should feel useful at a glance — displaying cycle phase, symptom trends, reminders, and a clear path to log today's data. It should be calm and organized, never cluttered.

## 2. Layout (Single-Screen, Stack Vertical)

```
┌─────────────────────────────────────┐
│                                     │
│  ☰  FemCare              ⚙️ 🔔   │  ← Top nav (glass-nav)
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Cycle Phase Card            │ ← Primary, top position
│  │  🌸 Follicular              │   │
│  │  Day 6 of 28               │   │
│  │  "Your follicular phase...│   │
│  │  [ View Details → ]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Symptom Trend Card          │ ← Supporting card
│  │  Last 7 days:              │   │
│  │  ● ● ○ ○ ● ● ○            │   │
│  │  [ View Trends → ]        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Reminder Card               │ ← Supporting card
│  │  🔔 Daily check-in at 8PM │   │
│  │  Next: Today at 8:00 PM    │   │
│  │  [ Edit → ] [ Log Now → ] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💚 Log Today's Symptoms    │ ← Primary CTA, prominent
│  │  [ Start logging → ]      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Feature Cards (discovery)  │ ← Optional horizontal scroll
│  │  Insights  |  Fertility   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ═══════════════════════════       │
│  🏠    📅    💚    📊    ⚙️      │  ← Bottom nav
│  Home  Cal   Log  Insights  More │
│                                     │
└─────────────────────────────────────┘
```

## 3. Card Specifications

### 3.1 Cycle Phase Card

**Purpose**: Show the user's current cycle phase and day at a glance.

**Visual details**:
- Glass card: `glass-card`, `rounded-3xl`, `p-6`
- Border accent: left border `4px solid hsl(var(--primary))` or soft blush tint
- Header row: `flex items-center gap-3 mb-3`
  - Phase emoji/icon (🌸 for follicular, 🔥 for ovulation, 🌙 for luteal, 🩸 for menstrual)
  - Phase name: `text-lg font-display font-semibold text-foreground`
  - Day badge: `text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full`
- Body:
  - Cycle day: `text-sm text-muted-foreground` — "Day 6 of 28"
  - Phase description: `text-xs text-foreground/70 leading-relaxed` — short, one-line description
- CTA: `text-sm text-primary font-medium` with ArrowRight

**Interactive**: Tapping opens cycle detail view or expands inline

**Motion**: Card enters with `card-rise` animation, stagger index 0

### 3.2 Symptom Trend Card

**Purpose**: Show a compact visualization of recent symptom patterns.

**Visual details**:
- Glass card: same glass card styling
- Header: `flex items-center gap-3 mb-3`
  - Chart icon: `Activity` or `TrendingUp`
  - Title: `text-lg font-display font-semibold text-foreground`
  - Badge: `text-xs` showing trend direction (e.g., "Improving" in green, "Watch" in amber)
- Body:
  - Mini chart: a simple 7-day dot chart or sparkline using inline SVG or CSS
  - Dots: `w-2 h-2 rounded-full`, colored by severity (green/yellow/red)
  - Day labels: `text-xs text-muted-foreground flex justify-between`
  - Alternative: use the existing `TrendCharts` component if available
- CTA: `text-sm text-primary font-medium` with ArrowRight

**Motion**: Stagger index 1, `card-rise` with 50ms delay

### 3.3 Reminder Card

**Purpose**: Show the user's next scheduled reminder or daily check-in time.

**Visual details**:
- Glass card: same glass card styling
- Header: `flex items-center gap-3 mb-3`
  - Bell icon: `Bell`, `size={20}`, `text-accent`
  - Title: `text-lg font-display font-semibold text-foreground`
- Body:
  - Next reminder time: `text-sm text-foreground font-medium`
  - Frequency: `text-xs text-muted-foreground` — "Daily at 8:00 PM"
- Actions row: `flex gap-3 mt-4`
  - "Edit": ghost button, `text-sm text-primary`
  - "Log Now": filled secondary button, `text-sm rounded-full px-4 py-2`

**Motion**: Stagger index 2, `card-rise` with 100ms delay

### 3.4 Primary CTA Card (Log Banner)

**Purpose**: The single most prominent action on the dashboard — logging today's data.

**Visual details**:
- Card: `glass-card`, `rounded-3xl`, `p-6`, with a subtle gradient background
  - Background: `linear-gradient(135deg, rgba(255,228,233,0.3), rgba(232,223,245,0.3))` — blush-to-lavender tint
- Content:
  - Icon: Heart, `size={24}`, `text-primary`
  - Headline: "Log today's symptoms" — `text-lg font-display font-semibold text-foreground`
  - Subtext: "Quick and easy — just a few taps" — `text-sm text-muted-foreground`
  - CTA button: `w-full rounded-[22px] h-12 text-base font-medium` — primary filled
- Shadow: `shadow-warm` or `shadow-glow` for gentle emphasis

**Motion**: Pinned to bottom or appears last with `card-rise` animation, stagger index 3
- Subtle continuous glow pulse (if appropriate): `box-shadow` animation between two glow states, 3000ms

## 4. Navigation

### 4.1 Top App Bar
- Class: `glass-nav`, `sticky top-0 z-10`, `px-4 py-3`
- Left: hamburger or back icon (if nested)
- Center: "FemCare" brand text, `font-display`, `font-semibold`
- Right: Settings gear icon + Notification bell icon

### 4.2 Bottom Navigation
- Class: `glass-nav`, `fixed bottom-0 left-0 right-0`, `px-4 py-2`, `safe-area-pb`
- Items: Home, Calendar, Log, Insights, More
- Each item: icon + label, `flex flex-col items-center gap-0.5`, `text-xs`
- Active item: `text-primary` color, `font-medium`
- Inactive: `text-muted-foreground`
- Height: `h-16` (64px) with safe area padding

## 5. Visual Hierarchy

The visual hierarchy should make the order of importance clear:

1. **Cycle Phase Card** — top of screen, most informative first
2. **Symptom Trend Card** — follows cycle, shows pattern history
3. **Reminder Card** — functional, time-sensitive
4. **Primary CTA** — prominent at the bottom, the main action
5. **Feature Cards** — discovery, lower priority, optional horizontal scroll

Each card has:
- Consistent internal padding: `p-6`
- Consistent border radius: `rounded-3xl`
- Consistent gap between header and body: `mb-3`
- Consistent heading hierarchy (display → body → caption)

## 6. Color and Glass Treatment

- All cards use `.glass-card` for translucent frosted surface
- Slight tint variations per card:
  - Cycle Phase Card: subtle blush tint (`bg-blush/30` or `hsl(var(--blush) / 0.1)`)
  - Symptom Trend Card: no tint, neutral
  - Reminder Card: subtle lavender tint (`hsl(var(--lavender) / 0.1)`)
  - Primary CTA Card: blush-to-lavender gradient tint
- Borders: `1px solid rgba(255,255,255,0.5)` (from glass-card)
- Shadows: warm pink ambient (`hsl(var(--blush) / 0.1)`) on all cards

## 7. Motion

| Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|
| Cards on load | stagger card-rise | 280ms each | ease-out both | 50ms per card |
| Cycle Phase Card | card-rise | 280ms | ease-out both | 0ms |
| Symptom Trend Card | card-rise | 280ms | ease-out both | 50ms |
| Reminder Card | card-rise | 280ms | ease-out both | 100ms |
| Primary CTA | card-rise | 280ms | ease-out both | 150ms |
| Feature Cards | card-rise | 280ms | ease-out both | 200ms |
| Bottom nav | fade in | 250ms | ease-out | 300ms |
| Top nav | fade in | 250ms | ease-out | 100ms |

### 7.1 Interactive card states
- **Tap on card**: scale 0.98 for 100ms (press effect)
- **CTA button hover**: subtle brightness increase
- **CTA button press**: scale down to 0.97
- **Bottom nav**: active indicator slides (CSS transition on color/transform)
- **Scroll**: cards fade in as they enter viewport (IntersectionObserver-based)

## 8. Empty States

### 8.1 No cycle data yet
- Card shows: "No cycle data yet. Start by logging your first entry."
- CTA: "Log now →"
- Style: muted text, same card shape

### 8.2 No reminders set
- Card shows: "Reminders help you stay consistent. Tap to set one up."
- CTA: "Set reminder →"

### 8.3 No symptoms logged
- Trend card shows: "Start logging symptoms to see patterns here."
- CTA: "Log symptoms →"

## 9. Accessibility

- Card headings use proper heading hierarchy (h2 per card, h3 inside cards)
- Navigation landmarks: `<nav>` element for bottom nav
- Bottom nav items have `aria-label` with position ("Home, 1 of 5")
- Active navigation item has `aria-current="page"`
- Cards have sufficient contrast: `--foreground` on glass background meets AA
- Touch targets: minimum 44px on all interactive elements including bottom nav items
- `prefers-reduced-motion`: cards fade in without slide, animations disabled
- Skeleton loaders shown while data is loading

## 10. Responsive

- Mobile-first layout: single column, full-width cards
- Cards use `max-w-sm` centered or full-width depending on screen size
- Bottom nav: fixed, full-width, safe area padding
- Top nav: fixed, full-width, `glass-nav`
- On tablets: cards max-width centered with side margins
- On landscape: cards adjust width but maintain vertical stack

## 11. Consistency with Codebase

This spec aligns with:
- `src/components/BottomNav.jsx` — existing bottom navigation component
- `src/components/InsightCard.jsx` — card with glass treatment pattern
- `src/components/CompanionMascot.jsx` — phase-based emoji mapping for cycle card
- `src/index.css` `.glass-card`, `.glass-nav`, `.glass-pill` classes
- CSS variables: `--blush`, `--lavender`, `--primary`, `--accent`, `--secondary`
- Existing `Page` patterns: `Home.jsx`, `Log.jsx`, `Insights.jsx`
- `Ui-Ux PRD.md` §9.7 (Home dashboard): "stacked glass cards with one primary action"
- `index.css` `stagger-cards` animation class (lines 256–264)