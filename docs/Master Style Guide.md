# FemCare Master Style Guide

Cozy glassmorphism design system for a warm, private, premium, and emotionally safe mobile experience.

## 1. Design Philosophy

FemCare's visual language prioritizes emotional safety over clinical precision. The interface should feel like a calm, intimate space — not a medical dashboard. Every surface, color, and motion choice reinforces warmth, softness, and control.

Core adjectives: cozy, translucent, warm, quiet, nurturing, modern.

Anti-patterns: sharp edges, high-contrast separators, dense data walls, aggressive animations, clinical white, cold neutrals.

## 2. Color System

### 2.1 Base palette

| Token | Value | Usage |
|---|---|---|
| `--background` | `340 30% 99.6%` (light) / `271 14% 16%` (dark) | App background |
| `--foreground` | `275 15% 18%` (light) / `340 25% 95%` (dark) | Primary text |
| `--muted` | `340 20% 96%` (light) / `271 10% 23%` (dark) | Secondary surfaces |
| `--muted-foreground` | `275 8% 46%` (light) / `340 12% 68%` (dark) | Secondary text |

### 2.2 Accent palette

| Token | Value | Usage |
|---|---|---|
| `--primary` | `338 72% 66%` | Primary actions, emphasis |
| `--primary-foreground` | `340 50% 98%` | Text on primary |
| `--accent` | `256 52% 82%` | Secondary accents, highlights |
| `--accent-foreground` | `256 40% 30%` | Text on accent |
| `--secondary` | `340 25% 95%` (light) / `271 10% 23%` (dark) | Card backgrounds, soft fills |
| `--secondary-foreground` | `338 50% 30%` (light) / `340 20% 90%` (dark) | Text on secondary |

### 2.3 Pink/blush family

| Token | Value | Usage |
|---|---|---|
| `--blush` | `338 72% 90%` | Soft tint surfaces |
| `--blob-blush` | `#FFE4E9` | Ambient gradient blob |
| `--awareness-low` | `152 38% 62%` | Low severity indicator |
| `--awareness-moderate` | `38 72% 56%` | Moderate severity indicator |
| `--awareness-high` | `0 75% 62%` | High severity indicator |

### 2.4 Lavender family

| Token | Value | Usage |
|---|---|---|
| `--lavender` | `256 52% 90%` | Soft tint surfaces |
| `--blob-lavender` | `#E8DFF5` | Ambient gradient blob |
| `--awareness-low-soft` | `hsl(var(--awareness-low) / 0.12)` | Soft indicator backgrounds |
| `--awareness-moderate-soft` | `hsl(var(--awareness-moderate) / 0.12)` | Soft indicator backgrounds |
| `--awareness-high-soft` | `hsl(var(--awareness-high) / 0.12)` | Soft indicator backgrounds |

### 2.5 Neutral warmth

| Token | Value | Usage |
|---|---|---|
| `--blob-cream` | `#FFF8F3` | Ambient gradient blob |
| `--border` | `340 15% 93%` (light) / `271 10% 26%` (dark) | Border lines |
| `--card` | `0 0% 100%` (light) / `271 12% 20%` (dark) | Card backgrounds (fallback) |
| `--destructive` | `0 72% 58%` | Error, destructive actions |
| `--destructive-foreground` | `0 0% 98%` | Text on destructive |

### 2.6 Gradients

Primary gradient direction: top-left to bottom-right.

| Gradient Name | Colors | Usage |
|---|---|---|
| `blush-to-lavender` | `#FFE4E9` → `#E8DFF5` | Welcome hero backgrounds |
| `peach-to-blush` | `#FFF0E8` → `#FFE4E9` | Card tint overlays |
| `cream-to-lavender` | `#FFF8F3` → `#E8DFF5` | Dashboard card backgrounds |
| `rose-to-mauve` | `#F5B8C8` → `#C8A2D5` | Accent highlights, mascot |
| `warm-glow` | `#FFE8EC` → `#FFF0F3` | Subtle ambient backgrounds |

## 3. Typography

### 3.1 Font families

| Role | Font | Fallback | Weight range |
|---|---|---|---|
| Display | `Fraunces` | `Georgia, serif` | 400, 500, 600 |
| Heading | `Inter` | `-apple-system, BlinkMacSystemFont, ui-sans-serif, sans-serif` | 400, 500, 600, 700 |
| Body | `Inter` | `-apple-system, BlinkMacSystemFont, ui-sans-serif, sans-serif` | 400, 500 |
| Mono | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` | `monospace` | — |

### 3.2 Type scale

| Token | Size | Line-height | Weight | Tracking |
|---|---|---|---|---|
| `display-xl` | 36px / 2.25rem | 1.2 | 500 | — |
| `display-lg` | 28px / 1.75rem | 1.25 | 600 | — |
| `heading-xl` | 24px / 1.5rem | 1.3 | 600 | -0.01em |
| `heading-lg` | 20px / 1.25rem | 1.35 | 600 | — |
| `heading-md` | 18px / 1.25rem | 1.4 | 500 | — |
| `body-lg` | 16px / 1rem | 1.6 | 400 | — |
| `body-md` | 14px / 0.875rem | 1.6 | 400 | — |
| `body-sm` | 12px / 0.75rem | 1.5 | 400 | — |
| `caption` | 11px / 0.6875rem | 1.4 | 500 | 0.02em |
| `overline` | 10px / 0.625rem | 1.4 | 600 | 0.08em uppercase |

### 3.3 Typography principles

- Spacious line-height for calm reading (minimum 1.5 for body)
- Clear hierarchy: display → heading → body → caption
- Warm but not childish — Fraunces for display adds personality without playfulness
- Body text uses deep charcoal or plum, never pure black

## 4. Shape Language

### 4.1 Radius tokens

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | Small chips, badges |
| `radius-md` | 16px | Cards, inputs |
| `radius-lg` | 20px | Onboarding cards, dialogs |
| `radius-xl` | 24px | Primary glass cards |
| `radius-2xl` | 32px | Hero cards, welcome screens |
| `radius-full` | 9999px | Pills, buttons, avatars |

### 4.2 Shape guidelines

- All containers use large radii (minimum 16px, preferred 24px)
- Buttons use pill shape (`rounded-full` or `rounded-2xl`)
- Chips and tags use full-round (`radius-full`)
- Inputs use `rounded-xl` (16px)
- No sharp corners except in data tables and settings lists where 8px is acceptable
- Icons within cards should sit inside rounded containers

## 5. Glassmorphism System

### 5.1 Glass surface specifications

| Class | Background | Blur | Border | Shadow |
|---|---|---|---|---|
| `.glass` | `rgba(255,255,255,0.6)` | 14px | `1px solid rgba(255,255,255,0.6)` | `0 1px 3px rgba(0,0,0,0.03), 0 8px 24px rgba(232,150,170,0.12)` |
| `.glass-card` | `rgba(255,255,255,0.55)` | 18px | `1px solid rgba(255,255,255,0.5)` | `0 2px 4px rgba(0,0,0,0.02), 0 8px 24px rgba(232,150,170,0.1), 0 1px 3px rgba(0,0,0,0.04)` |
| `.glass-nav` | `rgba(255,255,255,0.72)` | 14px saturate(160%) | `1px solid rgba(255,255,255,0.5)` | `0 -1px 3px rgba(0,0,0,0.03), 0 -4px 20px rgba(232,150,170,0.1)` |
| `.glass-pill` | — | 8px | `1px solid rgba(255,255,255,0.3)` | — |

Dark mode overrides:

| Class | Background | Border | Shadow |
|---|---|---|---|
| `.dark .glass` | `rgba(255,255,255,0.08)` | `1px solid rgba(255,255,255,0.1)` | `0 1px 3px rgba(0,0,0,0.2), 0 8px 24px rgba(232,150,170,0.15)` |
| `.dark .glass-card` | `rgba(255,255,255,0.07)` | `1px solid rgba(255,255,255,0.08)` | `0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(232,150,170,0.08), 0 1px 3px rgba(0,0,0,0.2)` |
| `.dark .glass-nav` | `rgba(255,255,255,0.1)` | `1px solid rgba(255,255,255,0.08)` | `0 -1px 3px rgba(0,0,0,0.2), 0 -4px 20px rgba(232,150,170,0.12)` |

### 5.2 Blur and translucency rules

- Backdrop blur is always `14px` minimum for card surfaces
- Saturation boost (`saturate(160%)`) on navigation glass only
- Card surfaces should never exceed `opacity: 0.55` background for readability
- Never stack more than two translucent layers without a solid spacer
- Always ensure text contrast meets WCAG AA on translucent backgrounds

### 5.3 Surface hierarchy

- **Primary card** (`.glass-card`): Main content containers — onboarding screens, dashboard cards, log forms
- **Secondary card** (`.glass`): Supporting surfaces — tooltips, popovers, inline panels
- **Navigation bar** (`.glass-nav`): Bottom nav and top app bar
- **Pill surface** (`.glass-pill`): Interactive chips, toggle labels, filter pills

## 6. Shadow and Glow System

### 6.1 Shadow tokens

| Token | Value | Usage |
|---|---|---|
| `shadow-soft` | `0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)` | Default card lift |
| `shadow-warm` | `0 8px 24px rgba(232,150,170,0.1)` | Pink ambient glow |
| `shadow-glow` | `0 0 20px rgba(232,150,170,0.15)` | Subtle bloom on emphasis elements |
| `shadow-deep` | `0 2px 4px rgba(0,0,0,0.02), 0 8px 24px rgba(232,150,170,0.1), 0 1px 3px rgba(0,0,0,0.04)` | Primary glass card |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Minimal elevation |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.06)` | Medium elevation |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.1)` | High elevation |

### 6.2 Glow guidelines

- Use pink/rose tinted glows (`rgba(232,150,170, ...)`) — never blue or white glows
- Glow should feel like ambient warmth, not neon
- Apply glow to: primary CTAs on focus, completed states, mascot glow rings, ambient blobs
- Never combine glow with hard shadows on the same element
- Glow intensity should decrease on darker backgrounds

## 7. Iconography

### 7.1 Icon style

- **Style**: Outlined, 1.5px stroke weight, rounded line caps and joins
- **Size scale**: 16px (sm), 20px (md), 24px (lg), 28px (xl), 32px (icon-lg)
- **Color**: `--muted-foreground` for inactive, `--foreground` for active, `--primary` for emphasis
- **Grid**: 24×24px viewBox with 2px internal padding

### 7.2 Icon categories

| Category | Examples | Usage |
|---|---|---|
| Health | Heart, pulse, body, thermometer, sleep | Symptom and cycle tracking |
| Navigation | Home, calendar, chart, settings | Bottom nav and top nav |
| Social/Trust | Shield, lock, eye, privacy | Privacy and consent screens |
| Emotional | Sun, moon, smile, calm, flower | Mood, affirmation, wellness |
| Action | Plus, edit, trash, share, download | Interactive controls |
| Status | Check, alert, info, calendar | Feedback and status indicators |

### 7.3 Expression rules

- Use warm-toned icons on accent surfaces
- Never use flat solid icons on glass surfaces — always outline style
- Icons inside glass cards should have a subtle drop shadow for legibility
- Mascot/illustration icons (CompanionMascot) use phase-based gradient fills

## 8. Motion and Animation

### 8.1 Transition tokens

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `fast` | 150ms | `ease-out` | Microfeedback, toggles |
| `normal` | 250ms | `ease-out` | Screen transitions, card taps |
| `slow` | 400ms | `ease-out` | Onboarding slides, card reveals |
| `gentle` | 600ms | `ease-in-out` | Ambient animations, companion bobs |
| `entrance` | 280ms | `ease-out both` | Card rise, fade-in |
| `exit` | 200ms | `ease-in` | Card dismissal |

### 8.2 Easing curves

| Name | Curve | Usage |
|---|---|---|
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entry animations, primary transitions |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Ambient loops, gentle pulses |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Knob toggles, playful micro-interactions |
| `soft` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard material-style motion |

### 8.3 Animation library

| Animation | Duration | Keyframes | Usage |
|---|---|---|---|
| `card-rise` | 280ms | opacity 0→1, translateY 12px→0 | Staggered card entry |
| `companion-bounce` | 600ms | translateY + rotate oscillation | Mascot celebration |
| `companion-bob` | 1800ms | translateY -6px | Idle mascot warmth |
| `petal-drift` | 1800ms | opacity + translate + rotate | Completion celebrations |
| `checkmark-draw` | 400ms | stroke-dashoffset 30→0 | First log completion |
| `phase-bloom` | 350ms | scale + opacity | Cycle phase indicator |
| `companion-bounce` | 600ms ease-out | translateY -8px + rotate | Onboarding complete |

### 8.4 Motion principles

- All transitions follow the `fast → normal → slow` hierarchy; never abrupt
- Use `prefers-reduced-motion: reduce` to disable all non-essential motion
- Stagger card entries by 50ms increments
- Screen slides in onboarding use horizontal snap with `snap-center`
- Microfeedback on taps: subtle scale (0.97) + opacity shift
- Completion celebrations use soft blooms, not particle bursts
- Never use strobing, flashing, or aggressive damping

### 8.5 Onboarding motion pattern

- Slide transitions: horizontal slide, 300ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- Each slide fades in its content: `opacity 0→1, translateY 8px→0` over 400ms with 50ms delay
- Progress dots: width transition 200ms, color transition 300ms
- Skip button: `opacity 0.5→1` on hover

## 9. Spacing and Layout

### 9.1 Spacing scale

| Token | Value |
|---|---|
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 12px |
| `space-lg` | 16px |
| `space-xl` | 24px |
| `space-2xl` | 32px |
| `space-3xl` | 48px |
| `space-4xl` | 64px |

### 9.2 Layout tokens

| Token | Value | Usage |
|---|---|---|
| `max-w Onboarding` | `max-w-sm` (384px) | Onboarding card width |
| `card-padding` | `p-8` (2rem) | Inner card padding |
| `section-gap` | `space-y-6` (1.5rem) | Vertical section spacing |
| `safe-bottom` | `pb-8` (2rem) | Bottom nav clearance |

### 9.3 Touch targets

- Minimum tap target: 44×44px
- Primary buttons: `h-12` (48px), full-width preferred
- Secondary buttons: same height, inline with gap-3
- Card content should align to 16px grid

## 10. Component Patterns

### 10.1 Glass card

```
<glass-card>
  → rounded-3xl, p-8, w-full max-w-sm
  → glass-card class for translucency
  → single purpose per card
  → one primary action per card
  → supporting content above fold
</glass-card>
```

### 10.2 Button

| Variant | Style | Usage |
|---|---|---|
| Primary CTA | Full-width, rounded-[22px], h-12, font-medium | Main actions |
| Secondary ghost | Outline, rounded-[22px], h-12 | Skip, later, cancel |
| Tertiary | Text-only, no border | Inline links |
| Icon-only | Circle, 44×44px, centered | Toggle, close, menu |

### 10.3 Input

- Rounded-xl (16px)
- Full width within cards
- Label above input at `text-xs text-muted-foreground`
- Placeholder text at `text-sm text-muted-foreground/50`
- Date picker uses native `<input type="date">` with rounded styling
- Segmented controls and sliders for cycle length input

### 10.4 Card components

| Component | Purpose |
|---|---|
| Standard glass card | General content containers |
| Insight card | Trend data, health insights |
| Feature card | Discoverable advanced functions |
| Reminder card | Notification/scheduled reminders |
| Cycle status card | Current phase, day, status |
| Symptom log card | Logging entry surface |

### 10.5 Feedback components

- **Toast**: Soft pink background, slide-in from top, auto-dismiss after 3000ms
- **Checkmark**: Draw animation on completion, 400ms stroke-dashoffset
- **Companion mascot**: Mood-based expression (5 levels), phase-based color mapping
- **Petal celebration**: Soft drift animation for completion moments
- **Phase bloom**: Scale+opacity pulse for cycle phase changes

## 11. Accessibility

- Maintain readable contrast on translucent surfaces (minimum AA)
- Support dynamic text sizes (use `rem` units throughout)
- Touch targets minimum 44×44px
- Never rely on color alone to communicate status — always pair with icon or label
- Provide `prefers-reduced-motion` alternatives (see 8.4)
- Ensure glass surfaces have sufficient border contrast against their background
- Use semantic HTML where possible; add `aria-label` to icon-only buttons

## 12. Dark Mode

Dark mode uses the same glassmorphism system with adjusted values:

- Background shifts to deep warm purple (`271 14% 16%`)
- Glass backgrounds use `rgba(255,255,255,0.07–0.08)` for translucency
- Borders use `rgba(255,255,255,0.08–0.1)` for subtle definition
- Shadows become more diffused and darker in intensity
- Ambient blobs shift to darker complementary tones (`#4A2A38`, `#3A3550`, `#2E2832`)
- All color tokens defined in the `:root.dark` selector in `src/index.css`

## 13. Design Tokens Summary

All tokens are defined in `src/index.css` as CSS custom properties.

### 13.1 Color tokens

- `--background`, `--foreground`
- `--card`, `--card-foreground`, `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--radius`
- `--blush`, `--lavender`
- `--blob-blush`, `--blob-lavender`, `--blob-cream`
- `--awareness-low`, `--awareness-moderate`, `--awareness-high`
- `--sidebar-*` tokens

### 13.2 Font tokens

- `--font-heading`, `--font-body`, `--font-display`, `--font-mono`

### 13.3 Spacing tokens

Derived from Tailwind spacing scale (4px base unit).

### 13.4 Shadow tokens

- `shadow-soft`, `shadow-warm`, `shadow-glow`, `shadow-deep` (utility classes, not all CSS custom property tokens)

---

*Last updated: 2026-07-30. This guide maps directly to the existing `src/index.css` CSS custom properties and component implementations.*