# FemCare Permission Primer Specification

A friendly, benefit-focused screen explaining notification reminders with Allow and Later options.

## 1. Purpose

Prepare the user for notification permission request by explaining the value in warm, benefit-focused language. The screen should make the permission feel optional, safe, and useful — not intrusive.

## 2. Layout

```
┌─────────────────────────────────────┐
│                                     │
│        [Ambient lavender blob    ] │
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [ CompanionMascot ]   │      │
│    │   mood=4, phase=ovul. │      │
│    │                         │      │
│    │   Stay in the loop      │      │
│    │                         │      │
│    │   We'll send gentle     │      │
│    │   reminders for:        │      │
│    │                         │      │
│    │   • Daily check-ins     │      │
│    │   • Cycle predictions   │      │
│    │   • Symptom trends      │      │
│    │                         │      │
│    │   You're always in      │      │
│    │   control — you can     │      │
│    │   change this later in  │      │
│    │   settings.             │      │
│    │                         │      │
│    │   ┌─────────────────┐   │      │
│    │   │ Enable Reminders│   │      │
│    │   │  🔔 Allow        │   │      │
│    │   └─────────────────┘   │      │
│    │                         │      │
│    │   Not Now →             │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

## 3. Visual Details

### 3.1 Background
- Base: `--background` (warm cream)
- Ambient blob: lavender tinted (`--blob-lavender: #E8DFF5`), positioned top-center, `opacity-50`, `blur-[80px]`
- Alternative: warm glow (`--blob-cream: #FFF8F3`) positioned bottom for additional warmth

### 3.2 Glass card
- Class: `glass-card`
- Border radius: `rounded-3xl` (24px)
- Padding: `p-8` (2rem)
- Width: `max-w-sm` (384px), `w-full`
- Text alignment: `text-center`
- Subtle glow: `shadow-glow` (`0 0 20px rgba(232,150,170,0.15)`) applied to the CTA button only

### 3.3 Mascot
- Component: `CompanionMascot`
- Props: `mood={4}`, `phase="ovulation"`, `size={110}`
- Animation: `companion-bob` (1800ms `ease-in-out infinite`, gentle up-and-down)
- Placement: centered above the headline

### 3.4 Headline
- Content: "Stay in the loop"
- Style: `text-xl font-display font-semibold text-foreground mb-4`
- Font: Fraunces, weight 500

### 3.5 Benefit list
- Three bullet points explaining what reminders provide
- Icon before each: small lucide-react icons (Clock, Calendar, ChartLine)
- Style: `text-sm text-foreground text-left` (left-aligned within the centered card)
- Spacing: `space-y-3`
- Each item: `flex items-start gap-3`
- Bullet style: small `w-2 h-2 rounded-full bg-primary mt-1.5` dot

### 3.6 Control statement
- Content: "You're always in control — you can change this later in settings."
- Style: `text-xs text-muted-foreground leading-relaxed mt-4`
- Emphasizes user control and low commitment

### 3.7 Primary CTA — "Enable Reminders"
- Label: "Enable Reminders" followed by a small reminder bell icon
- Icon: `Bell`, `size={18}`, `mr-2` (inside label) or positioned inside the button
- Class: `w-full rounded-[22px] h-12 text-base font-medium`
- Style: primary filled (`bg-primary`, `text-primary-foreground`)
- Shadow: `shadow-glow` for subtle emphasis
- Hover: subtle brightness increase
- Press: scale 0.97

### 3.8 Secondary action — "Not Now"
- Style: link/ghost, `text-sm text-muted-foreground hover:text-foreground`
- No border, no background fill
- Margin top: `mt-3`, centered below CTA
- Tapping navigates to next onboarding screen

### 3.9 Estimated effort badge (optional)
- Small text below the control statement
- Content: "Takes 5 seconds to set up" or similar
- Style: `text-xs text-muted-foreground/70`

## 4. Interactions

| Interaction | Trigger | Result |
|---|---|---|
| Tap "Enable Reminders" | Button click | Trigger native notification permission prompt |
| Permission granted | System dialog | Store `notificationsEnabled: true`, proceed to next screen |
| Permission denied | System dialog | Store `notificationsEnabled: false`, proceed to next screen |
| Tap "Not Now" | Link click | Skip permission, proceed to First Log (with notifications off) |
| Screen mount | — | Mascot begins gentle bob, CTA glow animates subtly |

## 5. Permission Result Handling

| Result | User State | Next Screen |
|---|---|---|
| `granted` | Notifications on | Proceed to First Log |
| `denied` (first time) | Notifications off | Proceed to First Log |
| `dismissed` | Notifications off | Proceed to First Log |
| `default` (user closed prompt) | Prompt shown again on home | Proceed to First Log |

- If notifications are denied, the home dashboard should show a gentle nudge in settings: "Turn on reminders in Settings → Notifications"
- The primer screen should not re-prompt the permission dialog if the user already permanently denied

## 6. Motion

| Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|
| Card | card-rise | 280ms | ease-out both | 0ms |
| Mascot | companion-bob | 1800ms | ease-in-out infinite | 300ms |
| Headline | fade in + translateY 6px→0 | 280ms | ease-out | 100ms |
| Benefit list | stagger fade in | 250ms each | ease-out | 200ms + 60ms/item |
| Control statement | fade in | 300ms | ease-out | 400ms |
| CTA | fade in + subtle scale pulse | 300ms | ease-out | 450ms |
| "Not Now" | fade in | 200ms | ease-out | 550ms |

### 6.1 CTA glow animation
- The "Enable Reminders" button has a subtle ambient glow that pulses
- Animation: `box-shadow` between `0 0 20px rgba(232,150,170,0.15)` and `0 0 30px rgba(232,150,170,0.25)`
- Duration: 3000ms, `ease-in-out infinite`
- Respects `prefers-reduced-motion` (static glow only)

## 7. Design Tokens

| Token | CSS Variable | Usage |
|---|---|---|
| Card background | `rgba(255,255,255,0.55)` | Glass card translucency |
| Glow color | `rgba(232,150,170,0.15)` | CTA shadow-glow |
| Accent fill | `hsl(var(--accent) / 0.3)` | Icon container background |
| Text primary | `hsl(var(--foreground))` | Headline, list items |
| Text muted | `hsl(var(--muted-foreground))` | Control statement, body |
| Primary bg | `hsl(var(--primary))` | CTA background |
| Primary text | `hsl(var(--primary-foreground))` | CTA text |

## 8. Accessibility

- CTA `aria-label`: "Enable notifications for daily reminders"
- "Not Now" link has `aria-label="Skip notification setup"`
- Benefit list uses `role="list"` with descriptive `aria-label`
- Mascot has `aria-hidden="true"` (decorative) or `aria-label="FemCare companion"`
- `prefers-reduced-motion`: CTA glow static, mascot bob disabled, all animations fade-only
- Focus management: CTA receives focus after card animation completes

## 9. Responsive

- Mobile-first with `max-w-sm` (384px)
- Benefit list scroll-safe on small screens (no overflow)
- CTA and secondary action remain full-width for easy thumb reach
- Safe area bottom inset respected for home indicator

## 10. Consistency with Codebase

This spec aligns with:
- `src/pages/Onboarding.jsx` Slide 2 structure (What FemCare Does section) for glass card pattern
- `CompanionMascot` component with phase and mood props
- CSS animations: `companion-bob`, `card-rise`
- `glass-card` class, `rounded-3xl`, `p-8`, `max-w-sm` from existing stylesheet
- `Button` component with `rounded-[22px]`, `h-12`, `w-full` styling
- CSS variables: `--accent`, `--primary`, `--primary-foreground`, `--blob-lavender`
- `Permission` API usage would be implemented in `src/services/` (not yet present but follows project patterns)
- The permission primer concept is outlined in the `Ui-Ux PRD.md` (§9.5 Permission primer)