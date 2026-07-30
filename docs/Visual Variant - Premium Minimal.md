# FemCare Visual Variant: Premium Minimal

Refined, minimal glassmorphism with restrained pastel accents, clean typography, highly structured spacing, subtle blur, and elegant card hierarchy — professional and trustworthy without losing warmth.

## 1. Design Philosophy

Premium Minimal distills the FemCare design to its essentials — every element earns its place. The interface should feel like a carefully edited magazine: structured, breathable, and quietly luxurious. Warmth is maintained through a single warm accent color and soft shadows, but visual noise is eliminated. The result is a design that feels premium, modern, and trustworthy — the visual equivalent of a well-designed app like Bear or Notion, but with the warmth of FemCare's personality.

Core adjectives: refined, minimal, structured, trustworthy, modern, elegant.

## 2. Color Adjustments

### 2.1 Restrained palette

| Token | Standard Value | Premium Minimal Value | Rationale |
|---|---|---|---|
| `--background` | `340 30% 99.6%` | `0 15% 99%` | Neutral warm white — no pink undertone |
| `--foreground` | `275 15% 18%` | `240 12% 14%` | Cooler, deeper charcoal for contrast |
| `--card` | `0 0% 100%` | `0 10% 99.5%` | Barely tinted white |
| `--muted` | `340 20% 96%` | `240 10% 97%` | Near-white neutral |
| `--muted-foreground` | `275 8% 46%` | `240 10% 42%` | Cooler, more neutral gray |
| `--border` | `340 15% 93%` | `240 10% 92%` | Neutral, soft border |
| `--primary` | `338 72% 66%` | `340 55% 55%` | Muted rose — restrained, not vivid |
| `--primary-foreground` | `340 50% 98%` | `0 10% 97%` | Very soft warm white |
| `--accent` | `256 52% 82%` | `230 35% 78%` | Muted periwinkle, less saturated |
| `--accent-foreground` | `256 40% 30%` | `240 20% 28%` | Muted dark accent |
| `--secondary` | `340 25% 95%` | `240 8% 96%` | Neutral tinted surface |
| `--secondary-foreground` | `338 50% 30%` | `240 15% 28%` | Muted dark text |

### 2.2 Accent restraint

Premium Minimal uses only **two** accent colors at any time:

1. **Muted rose** (`--primary`): Used for primary CTAs, key highlights, and interactive emphasis only. Never for ambient backgrounds or large surface tints.
2. **Muted periwinkle** (`--accent`): Used for secondary accents — icon backgrounds, subtle indicators, and progress indicators only.

No additional pastels (blush, lavender) are used as standalone surface colors. Instead, `--secondary` provides the muted surface tone.

### 2.3 Gradient restraint

Premium Minimal eliminates the multi-blob gradient background. Instead:

- Background: flat `--background` with a single very subtle gradient overlay (`linear-gradient(180deg, transparent 0%, rgba(232,220,245,0.03) 100%)`)
- No ambient blobs on dashboard and most screens
- Blobs only on onboarding welcome screen (very subtle: `opacity-30`, `blur-[60px]`)
- Gradient cards use a single-direction subtle tint (`rgba(245,235,245,0.3)`) rather than multi-color gradients

## 3. Typography Adjustments

### 3.1 Font hierarchy refinement

| Element | Standard | Premium Minimal |
|---|---|---|
| Display font | `Fraunces` | `Fraunces` (same, but weight 400 instead of 500 — lighter) |
| Heading font | `Inter` (via `--font-heading`) | `Inter` (same) |
| Body font | `Inter` (via `--font-body`) | `Inter` (same) |
| Heading weight | 600 | 500 |
| Body weight | 400 | 400 |
| Line-height body | 1.6 | 1.65 (slightly more airy) |

### 3.2 Size scale refinement

| Token | Standard | Premium Minimal |
|---|---|---|
| `display-xl` | 36px | 32px |
| `display-lg` | 28px | 24px |
| `heading-xl` | 24px | 20px |
| `heading-lg` | 20px | 18px |
| `heading-md` | 18px | 16px |
| `body-lg` | 16px | 15px |
| `body-md` | 14px | 13px |

Slightly smaller sizes and weights create a more restrained, editorial feel.

## 4. Spacing and Structure

### 4.1 Highly structured spacing

| Token | Standard | Premium Minimal |
|---|---|---|
| `radius` | `1rem` (16px) | `0.75rem` (12px) |
| `rounded-2xl` | 20px | 16px |
| `rounded-3xl` | 24px | 18px |
| `rounded-full` | 9999px | 9999px (unchanged) |

Smaller radii reinforce minimalism — less softening, more structure.

### 4.2 Card padding

| Context | Standard | Premium Minimal |
|---|---|---|
| Onboarding screen | `p-8` (2rem) | `p-6` (1.5rem) |
| Dashboard card | `p-6` (1.5rem) | `p-5` (1.25rem) |
| Feature tile | `p-4` (1rem) | `p-3` (0.75rem) |

Tighter padding within cards creates a more compact, structured layout. The whitespace between cards increases to compensate and maintain breathing room.

### 4.3 Spacing scale

| Token | Standard | Premium Minimal |
|---|---|---|
| `space-xs` | 4px | 3px |
| `space-sm` | 8px | 6px |
| `space-md` | 12px | 8px |
| `space-lg` | 16px | 12px |
| `space-xl` | 24px | 16px |
| `space-2xl` | 32px | 20px |
| `space-3xl` | 48px | 32px |

### 4.4 Structural rhythm

Premium Minimal enforces a strict 4px baseline grid for all vertical spacing. Cards align to grid lines. Gaps between elements are multiples of 4 (3px, 6px, 8px, 12px, 16px, 20px, 24px, 32px). This creates the "highly structured spacing" that defines the variant.

## 5. Glassmorphism Adjustments

### 5.1 Subtle blur

| Class | Standard Blur | Premium Minimal Blur | Rationale |
|---|---|---|---|
| `.glass` | 14px | 10px | Less blur = more structure |
| `.glass-card` | 18px | 12px | Sharper frosted surface |
| `.glass-nav` | 14px | 8px | Nearly transparent nav, structural |
| `.glass-pill` | 8px | 6px | Minimal pill blur |

Blur is significantly reduced for a cleaner, more controlled glass effect that doesn't compete with content.

### 5.2 Thinner frosted glass

| Class | Standard Background | Premium Minimal Background | Standard Border | Premium Minimal Border |
|---|---|---|---|---|
| `.glass` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.45)` | `1px solid rgba(255,255,255,0.6)` | `1px solid rgba(255,255,255,0.35)` |
| `.glass-card` | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.4)` | `1px solid rgba(255,255,255,0.5)` | `1px solid rgba(255,255,255,0.3)` |

 thinner glass = more transparency = more content visible through the surface = more minimal feel.

### 5.3 Shadow reduction

Premium Minimal reduces shadow intensity across all surfaces:

| Shadow | Standard | Premium Minimal |
|---|---|---|
| `shadow-soft` | `0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)` | `0 1px 2px rgba(0,0,0,0.01), 0 2px 8px rgba(0,0,0,0.03)` |
| `shadow-warm` | `0 8px 24px rgba(232,150,170,0.1)` | `0 4px 16px rgba(340,55%,66%,0.06)` |
| `shadow-glow` | `0 0 20px rgba(232,150,170,0.15)` | `0 0 12px rgba(340,55%,66%,0.08)` |
| `shadow-deep` | (combined) | All values halved |

## 6. Card Hierarchy

Premium Minimal defines a clear, structured card hierarchy that guides the eye through information density:

### 6.1 Level 1 — Primary Card
- Usage: Dashboard main content, onboarding screens, primary forms
- Border: `1px solid rgba(255,255,255,0.3)` (subtle border)
- Background: `rgba(255,255,255,0.4)` glass
- Padding: `p-5`
- Shadow: `shadow-soft` (no warm glow)
- Bottom border: thin `2px solid hsl(var(--primary) / 0.3)` accent line

### 6.2 Level 2 — Secondary Card
- Usage: Supporting content, compact data rows, feature tiles
- Border: `1px solid rgba(255,255,255,0.2)`
- Background: `rgba(255,255,255,0.35)` glass
- Padding: `p-4`
- Shadow: none (reliant on elevation spacing only)

### 6.3 Level 3 — Tertiary Card / Tile
- Usage: Feature discovery, compact info chips
- Border: `1px solid rgba(255,255,255,0.15)`
- Background: `rgba(255,255,255,0.3)` glass
- Padding: `p-3`
- Shadow: none

The hierarchy is communicated through border density (1px → 0.5px → 0.2px), glass opacity (0.4 → 0.35 → 0.3), and padding (p-5 → p-4 → p-3). This creates a structured, graduated sense of importance without relying on color or size.

## 7. Motion Adjustments

| Motion Property | Standard | Premium Minimal |
|---|---|---|
| Card entrance | 280ms | 350ms |
| Hover transition | 200ms | 250ms |
| Success animation | ease-out | ease-in-out, 500ms |
| Companion bob | 1800ms | 2400ms |
| Companion bounce | 600ms | 700ms |
| Scroll transition | 300ms | 400ms |
| Stagger delay | 50ms | 40ms |

Premium Minimal animations are slightly slower overall (more graceful) but with shorter stagger delays (more structured rhythm). The result: smooth, unhurried content reveal with precise, almost mechanical timing between elements.

## 8. Dark Mode (Premium Minimal)

| Token | Standard Dark | Premium Minimal Dark |
|---|---|---|
| `--background` | `271 14% 16%` | `240 10% 12%` |
| `--foreground` | `340 25% 95%` | `240 10% 90%` |
| Glass background | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.04)` |
| Glass border | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.05)` |
| Shadows | Dark with warmth | Neutral with cool undertone |

Dark mode in Premium Minimal is cooler and darker — more like a premium dark mode (think Apple's dark mode) — while retaining enough warmth to not feel cold.

## 9. Iconography Adjustments

- Icon stroke weight: `1.5px` → `1.25px` (lighter, more refined)
- Icon size scale: same but `size={16}` for small (vs 16px standard), same for others
- Icon color: `--muted-foreground` for inactive (same), `--primary` for emphasis (restrained — used sparingly)
- Icon containers: remove pastel background fills; use transparent or `bg-background/30` only

## 10. Component Adjustments

### 10.1 Buttons
- Border radius: `rounded-[22px]` → `rounded-lg` (8px) for a more structured look
- CTA: maintain primary fill but reduce glow shadow intensity by 50%
- Font weight: Buttons use `font-medium` (500) instead of `font-semibold` (600)

### 10.2 Inputs
- Border radius: `rounded-xl` → `rounded-lg` (8px)
- Input background: `rgba(255,255,255,0.5)` → `rgba(255,255,255,0.4)` (thinner glass)
- Focus ring: `2px` outline with `--ring` (same color, thinner stroke)

### 10.3 Cards (UI kit)
- `card.jsx` border radius: `rounded-xl` → `rounded-lg` for more structured feel
- Card border: `1px solid hsl(var(--border))` → `1px solid hsl(var(--border) / 0.6)` for subtlety

## 11. Layout Philosophy

Premium Minimal enforces a tighter, more structured layout grid:

- Cards are aligned to a 16px baseline grid
- Horizontal padding on screens: `px-6` (1.5rem) consistent across all screens (vs `px-5` in standard)
- Maximum content width: `max-w-md` (448px) for all screens — narrower than standard `max-w-sm` for tighter, more readable columns
- Cards in a row: `gap-6` with equal-width items
- Bottom nav: fixed, `h-14` (56px), icons at 1.5× standard size

## 12. Implementation Notes

To implement Premium Minimal as a variant:

1. Create a CSS class `.premium-minimal` on `<html>` or `<body>`
2. Override `:root` color tokens with the restrained palette values
3. Reduce blur values on `.glass`, `.glass-card`, `.glass-nav`, `.glass-pill`
4. Reduce glass opacity values for thinner frosted surfaces
5. Reduce shadow intensities across all shadow tokens
6. Override border-radius tokens to smaller values
7. Adjust spacing tokens to the tighter spacing scale
8. Update animation durations to Premium Minimal values
9. Reduce icon stroke weights to 1.25px
10. Enforce `max-w-md` content width

The Premium Minimal variant removes warm pastels as surface colors, replaces them with neutral tints, and relies on subtle structural cues (border, shadow, spacing, typography weight) rather than color to create hierarchy and warmth.

---

*Last updated: 2026-07-30. This variant maintains compatibility with the existing design system and extends it with restrained, structured alternatives.*