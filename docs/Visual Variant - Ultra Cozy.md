# FemCare Visual Variant: Ultra Cozy

Warmer blush and peach tones, softer shadows, more diffused lighting, thicker frosted glass, and a gentler emotional mood — like a private wellness companion on a calm evening.

## 1. Design Philosophy

Ultra Cozy amplifies the comfort and intimacy of the base FemCare design. Where the standard style is warm and supportive, Ultra Cozy is enveloping — like wrapping in a soft blanket. The interface should feel like it exists in a warm, dimly lit room with gentle ambient light. Every surface should feel slightly thicker, slightly softer, and more protective.

Core adjectives: enveloping, warm, intimate, plush, safe, evening-toned.

## 2. Color Adjustments

### 2.1 Warmer base palette

| Token | Standard Value | Ultra Cozy Value | Rationale |
|---|---|---|---|
| `--background` | `340 30% 99.6%` | `25 25% 98%` | Slightly peachier cream |
| `--foreground` | `275 15% 18%` | `25 20% 16%` | Warmer charcoal, plum undertone |
| `--card` | `0 0% 100%` | `25 20% 99%` | Barely warm white |
| `--muted` | `340 20% 96%` | `25 20% 95%` | Peach-tinted muted |
| `--muted-foreground` | `275 8% 46%` | `25 10% 40%` | Slightly warmer gray |
| `--border` | `340 15% 93%` | `25 15% 90%` | Softer, warmer border |

### 2.2 Warmer accent palette

| Token | Standard Value | Ultra Cozy Value | Rationale |
|---|---|---|---|
| `--primary` | `338 72% 66%` | `12 75% 68%` | Warmer rose, more peach |
| `--primary-foreground` | `340 50% 98%` | `25 40% 96%` | Warmer cream text |
| `--accent` | `256 52% 82%` | `30 45% 80%` | Warmer lilac, less cool |
| `--accent-foreground` | `256 40% 30%` | `28 35% 28%` | Warmer dark accent text |
| `--secondary` | `340 25% 95%` | `28 25% 93%` | Warmer secondary |
| `--blush` | `338 72% 90%` | `12 70% 88%` | Peach-blush |
| `--lavender` | `256 52% 90%` | `30 40% 88%` | Warmer lavender |

### 2.3 Ultra Cozy accent family

| Token | Value | Usage |
|---|---|---|
| `--peach` | `25 80% 92%` | Additional warm tint surface |
| `--rose` | `10 65% 85%` | Warm rose accent |
| `--terra-cotta` | `15 55% 75%` | Earthy warm accent (optional) |
| `--blob-blush` | `#FFD6E0` (standard: `#FFE4E9`) | Warmer ambient blob |
| `--blob-peach` | `#FFE8D6` | New warm blob |
| `--blob-lavender` | `#F0E6F6` (standard: `#E8DFF5`) | Warmer lavender |
| `--blob-cream` | `#FFF5EB` (standard: `#FFF8F3`) | Warmer cream |

### 2.4 Warm gradient overrides

| Gradient | Standard | Ultra Cozy |
|---|---|---|
| `blush-to-lavender` | `#FFE4E9 → #E8DFF5` | `#FFD6E0 → #F0E6F6` |
| `peach-to-blush` | `#FFF0E8 → #FFE4E9` | `#FFF5E8 → #FFD6E0` |
| `cream-to-lavender` | `#FFF8F3 → #E8DFF5` | `#FFF5EB → #F0E6F6` |
| `warm-glow` | `#FFE8EC → #FFF0F3` | `#FFF0E6 → #FFE0D6` |
| `rose-to-mauve` | `#F5B8C8 → #C8A2D5` | `#F5C0B0 → #D4A8C8` |

## 3. Typography Adjustments

No changes to font families or scale. The typography remains identical — the warmth comes from the color and surface adjustments.

## 4. Shape and Space Adjustments

### 4.1 Radius

| Token | Standard | Ultra Cozy |
|---|---|---|
| `--radius` | `1rem` (16px) | `1.125rem` (18px) |
| `rounded-2xl` | 20px | 22px |
| `rounded-3xl` | 24px | 28px |

Slightly larger radii make surfaces feel softer and more rounded — more "cushiony."

### 4.2 Card padding

| Context | Standard | Ultra Cozy |
|---|---|---|
| Onboarding screen | `p-8` | `p-10` (2.5rem) |
| Dashboard card | `p-6` | `p-7` (1.75rem) |
| Feature tile | `p-4` | `p-5` (1.25rem) |
| Input fields | `p-3` | `p-3.5` |

More generous padding increases the sense of spaciousness and comfort.

### 4.3 Spacing scale

| Token | Standard | Ultra Cozy |
|---|---|---|
| `space-xs` | 4px | 6px |
| `space-sm` | 8px | 10px |
| `space-md` | 12px | 14px |
| `space-lg` | 16px | 20px |
| `space-xl` | 24px | 28px |
| `space-2xl` | 32px | 36px |

## 5. Glassmorphism Adjustments

### 5.1 Thicker frosted glass

| Class | Standard Background | Ultra Cozy Background | Standard Blur | Ultra Cozy Blur |
|---|---|---|---|---|
| `.glass` | `rgba(255,255,255,0.6)` | `rgba(255,240,235,0.65)` | 14px | 18px |
| `.glass-card` | `rgba(255,255,255,0.55)` | `rgba(255,240,235,0.6)` | 18px | 22px |
| `.glass-nav` | `rgba(255,255,255,0.72)` | `rgba(255,240,235,0.78)` | 14px | 18px |
| `.glass-pill` | — | `rgba(255,240,235,0.5)` | 8px | 10px |

The background tint shifts toward warm peach (`rgba(255,240,235,...)`) instead of neutral white. Blur increases to thicken the frosted glass effect.

### 5.2 Softer shadows

| Shadow | Standard | Ultra Cozy |
|---|---|---|
| `shadow-soft` | `0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)` | `0 2px 6px rgba(0,0,0,0.03), 0 8px 20px rgba(0,0,0,0.04)` |
| `shadow-warm` | `0 8px 24px rgba(232,150,170,0.1)` | `0 8px 32px rgba(232,150,170,0.12)` |
| `shadow-glow` | `0 0 20px rgba(232,150,170,0.15)` | `0 0 28px rgba(232,150,170,0.18)` |
| `shadow-deep` | (combined) | More diffused, larger radius |

Shadows are larger, softer, and more diffused — as if the cards are floating in warm ambient light.

### 5.3 Diffused lighting

- Ambient blobs use larger blur radii in Ultra Cozy: `blur-[100px]` instead of `blur-[80px]`
- Blob opacity increases slightly: `opacity-55` → `opacity-65`
- Additional warm ambient blob in a warm terra-cotta (`#FFE0C8`) positioned behind center
- Gradients between blobs should feel like a gradient wash of warm light, not hard edges

### 5.4 Borders

Standard borders use `rgba(255,255,255,0.5)`. Ultra Cozy uses `rgba(255,240,235,0.6)` — slightly warmer and denser to feel more protective.

## 6. Motion Adjustments

| Motion Property | Standard | Ultra Cozy |
|---|---|---|
| Card entrance | 280ms | 350ms |
| Hover transition | 200ms | 300ms |
| Success animation | `ease-out` | `ease-in-out` with longer duration (700ms) |
| Companion bob | 1800ms | 2200ms (slower breathing) |
| Companion bounce | 600ms | 800ms (gentler, slower) |
| Scroll transitions | 300ms | 400ms |
| Stagger delay | 50ms | 60ms |

All animations in Ultra Cozy are slightly slower, giving more breathing room between micro-interactions. The motion feels like it moves through warm syrup — smooth and unhurried.

## 7. Iconography Adjustments

- Icon fill colors use warmer versions of the standard palette
- Mascot gradient colors lean more toward peach and rose
- `PHASE_COLORS` in `CompanionMascot.jsx` adjusted:
  - `menstrual`: `#E8B0C8` → `#D4A0B8`
  - `follicular`: `#C8E0D0` → `#C0D8C4`
  - `ovulation`: `#F5C0D0` → `#F5C8B8`
  - `luteal`: `#DCC0E8` → `#D4B8E0`
  - `unknown`: `#F5D0D8` → `#F0C8C0`

## 8. Dark Mode Adjustments (Ultra Cozy)

| Token | Standard Dark | Ultra Cozy Dark |
|---|---|---|
| `--background` | `271 14% 16%` | `20 12% 14%` |
| `--foreground` | `340 25% 95%` | `25 20% 92%` |
| Glass background | `rgba(255,255,255,0.07)` | `rgba(255,235,225,0.09)` |
| Glass border | `rgba(255,255,255,0.08)` | `rgba(255,235,225,0.1)` |
| Blob colors | `#4A2A38, #3A3550, #2E2832` | `#4A3028, #3A3548, #382820` |
| Blobs | Muted purple-gray | Deeper warm browns |

The dark mode in Ultra Cozy shifts from cool purple-gray to warm brown-cream tones, like a warm evening room with amber lighting.

## 9. Ambient Atmosphere

- Background gradient direction: top-left (warm peach `#FFF0E8`) to bottom-right (soft cream `#FFF8F3`)
- Additional large warm blob at the bottom (`opacity-40`, `blur-[120px]`, `#FFE8D6`) for a "warm floor" effect
- Cards feel more elevated — use `shadow-deep` consistently (standard uses `shadow-deep` only on `.glass-card`). Ultra Cozy uses `shadow-warm` on all cards.
- Slightly more contrast between foreground text and backgrounds to maintain readability despite the warmer palette

## 10. Implementation Notes

To implement Ultra Cozy as a variant:

1. Create a CSS class `.ultra-cozy` on `<html>` or `<body>`
2. Override the `:root` color tokens within `.ultra-cozy`
3. Override `.glass`, `.glass-card`, `.glass-nav`, `.glass-pill` with the Ultra Cozy values
4. Override `.shadow-*` utilities with Ultra Cozy shadow values
5. Override animation durations in `.theme-ready *` for slower motion
6. Update `--blob-blush`, `--blob-peach`, `--blob-lavender`, `--blob-cream` custom properties
7. Adjust `CompanionMascot.jsx` `PHASE_COLORS` for warmer palette

The Ultra Cozy variant maintains all the same component structure and interaction patterns as the standard design — only the sensory qualities change.

---

*Last updated: 2026-07-30. This variant maps to the existing design system and extends the color tokens and glass specifications in `src/index.css`.*