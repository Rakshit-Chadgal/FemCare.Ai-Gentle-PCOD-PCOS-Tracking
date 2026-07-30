# FemCare Consent Screen Specification

A transparent, calming privacy consent screen with toggle controls, a trust-first tone, and clear confirmation.

## 1. Purpose

Present the privacy consent in a way that feels like a warm conversation, not a legal wall. The user should understand exactly what data is collected and why, feel in control, and provide explicit opt-in before proceeding.

## 2. Layout

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [ Shield check icon ] │      │
│    │                         │      │
│    │   Your privacy matters  │      │
│    │                         │      │
│    │   A short, warm         │      │
│    │   summary of how data   │      │
│    │   is used.              │      │
│    │                         │      │
│    │   ── Data we collect ── │      │
│    │                         │      │
│    │   ◉ Cycle & symptom     │      │
│    │     data                │      │
│    │     Needed to give you  │      │
│    │     insights and        │      │
│    │     reminders           │      │
│    │                         │      │
│    │   ◯ Notification        │      │
│    │     preferences         │      │
│    │     Lets us send gentle │      │
│    │     reminders           │      │
│    │                         │      │
│    │   ◯ Anonymous usage     │      │
│    │     data                │      │
│    │     Helps us improve    │      │
│    │     the experience      │      │
│    │                         │      │
│    │   🔒 All data is stored │      │
│    │     on your device and  │      │
│    │     can be exported or  │      │
│    │     deleted anytime.    │      │
│    │                         │      │
│    │   ┌─────────────────┐   │      │
│    │   │ I agree &       → │   │      │
│    │   │   continue       │   │      │
│    │   └─────────────────┘   │      │
│    │                         │      │
│    │   View full privacy     │      │
│    │   policy                │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

## 3. Visual Details

### 3.1 Background
- Base: `--background` (warm cream)
- Gradient: `blush-to-lavender` direction (top-left to bottom-right)
- Ambient blobs: same pattern as Welcome screen but slightly softer opacity

### 3.2 Glass card
- Class: `glass-card`
- Border radius: `rounded-3xl` (24px)
- Padding: `p-8` (2rem)
- Width: `max-w-sm` (384px), `w-full`
- Text alignment: `text-left` (content is list-based for readability)

### 3.3 Icon
- Icon: Shield check (lucide-react `ShieldCheck`)
- Container: `inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/30`
- Color: `--accent-foreground`
- Margin bottom: `mb-6`

### 3.4 Headline
- Content: "Your privacy matters"
- Style: `text-xl font-display font-semibold text-foreground mb-3`
- Font: Fraunces, weight 500

### 3.5 Summary paragraph
- Content: "FemCare keeps your health data encrypted and never shares it without your permission. Here's what we collect and why:"
- Style: `text-sm text-muted-foreground leading-relaxed mb-4`
- Line-height: `leading-relaxed` (1.625)

### 3.6 Data items

Each data item is a row with a toggle control and descriptive text:

**Essential item** (always on, no toggle):
- Label: "Cycle & symptom data"
- Description: "Needed to give you insights and reminders"
- Visual: `bg-blush` soft highlight (hsl(var(--blush) / 0.15))
- Toggle state: permanently on, locked
- Icon: checkmark or lock icon

**Optional items** (toggle on/off, default off):
- Label + description pair
- Toggle: existing `Switch` component
- Toggle default: `checked={false}`
- Style: `glass-pill` border around the row for subtle definition

Data items layout:
- Each item: `flex items-start gap-3` with toggle on the right
- Row style: `rounded-2xl bg-secondary/50 p-4` for essential; `p-3` for optional
- Toggle: `Switch` component from `@/components/ui/switch`

### 3.7 Trust badge
- Content: "🔒 All data is stored on your device and can be exported or deleted anytime."
- Style: `rounded-2xl bg-secondary/50 p-4 mb-6 text-left`
- Text: `text-xs text-foreground/70 leading-relaxed`
- Icon: lock emoji or Shield icon

### 3.8 Primary CTA
- Label: "I agree & continue"
- State: enabled when essential consent is acknowledged (always true on this screen)
- Class: `w-full rounded-[22px] h-12 text-base`
- Style: primary filled (`bg-primary`, `text-primary-foreground`)
- Disabled state: if essential consent somehow unchecked (defensive)

### 3.9 Privacy policy link
- Content: "View full privacy policy"
- Style: `text-sm text-primary underline cursor-pointer`
- Action: opens Privacy page (`/privacy`) in-app sheet or link
- Margin top: `mt-4`, centered

## 4. Interactions

| Interaction | Trigger | Result |
|---|---|---|
| Toggle optional consent | Tap toggle | `Switch` toggles on/off, value stored in state |
| Tap "I agree & continue" | Button click | Navigate to Permission Primer screen |
| Tap "View full privacy policy" | Link click | Open `/privacy` page |
| Screen mount | — | Essential consent auto-acknowledged (no toggle needed) |

## 5. State Management

```
consentState = {
  essential: true,        // locked, always satisfied
  notifications: false,   // default off
  analytics: false,       // default off
}
```

- "I agree & continue" button is enabled when `essential === true` (always true)
- Optional consents remain in their toggle states; they do not gate progression
- State persists to `localStorage` while navigating in onboarding

## 6. Motion

| Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|
| Card | `card-rise` | 280ms | `ease-out both` | 0ms |
| Icon | fade in + scale 0.8→1 | 300ms | `ease-out` | 50ms |
| Headline | fade in + translateY 6px→0 | 280ms | `ease-out` | 100ms |
| Summary text | fade in | 300ms | `ease-out` | 150ms |
| Data items | stagger in (card-rise) | 280ms each | `ease-out both` | 200ms + 50ms/item |
| Trust badge | fade in | 300ms | `ease-out` | 400ms |
| CTA | fade in + scale 0.98→1 | 300ms | `ease-out` | 500ms |
| Privacy link | fade in | 200ms | `ease-out` | 600ms |

## 7. Design Tokens Reference

| Token | CSS Variable | Usage |
|---|---|---|
| Essential highlight | `hsl(var(--blush) / 0.15)` | Background on essential data row |
| Secondary fill | `bg-secondary/50` | Trust badge container |
| Primary text | `text-foreground` | Headlines, body |
| Muted text | `text-muted-foreground` | Descriptions |
| Primary accent | `text-primary` | Privacy policy link |
| Toggle container | `Switch` component | Consent toggles |

## 8. Responsive

- Same mobile-first constraints as other onboarding screens
- `max-w-sm` card centers on all viewports
- Toggle rows stack vertically with consistent spacing
- Touch targets for toggles minimum 44×44px

## 9. Accessibility

- Each toggle has an associated `<label>` with `htmlFor`
- Toggle state communicated to screen readers via `role="switch"` and `aria-checked`
- "I agree & continue" button announces disabled state when applicable
- Privacy policy link has descriptive `aria-label`
- `prefers-reduced-motion` disables all animations except opacity

## 10. Consistency with Codebase

This spec aligns with:
- Existing `Switch` component in `src/components/ui/switch.jsx`
- Existing `Privacy.jsx` page (`/privacy` route)
- CSS variables: `--blush`, `--accent`, `--secondary`, `--foreground`, `--muted-foreground`
- Existing `glass-card` class and `rounded-3xl` radius pattern
- `src/index.css` animation keyframes (`card-rise`)
- The consent data model described in the `Ui-Ux PRD.md` (§9.4 Consent screen)
- The existing `Onboarding.jsx` checkbox pattern (lines 214–223) for the disclaimer