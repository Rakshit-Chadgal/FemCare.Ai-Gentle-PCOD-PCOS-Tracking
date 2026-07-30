# FemCare Component System Specification

Reusable design system with glassmorphism cards, pill buttons, soft inputs, and consistent spacing for all surfaces.

## 1. Design Token Foundation

All components inherit from CSS custom properties defined in `src/index.css`. No hardcoded color values — every visual property derives from a token.

### 1.1 Color tokens

| Token | CSS Variable |
|---|---|
| Surface | `--background`, `--card`, `--secondary` |
| Text | `--foreground`, `--muted-foreground`, `--primary-foreground` |
| Accent | `--primary`, `--accent` |
| Border | `--border`, `--input` |
| Tints | `--blush`, `--lavender` |
| Awareness | `--awareness-low`, `--awareness-moderate`, `--awareness-high` |

### 1.2 Radius tokens

| Token | Value |
|---|---|
| `--radius` | `1rem` (16px) — base |
| `rounded-sm` | 8px |
| `rounded-2xl` | 20px |
| `rounded-3xl` | 24px |
| `rounded-full` | 9999px |

### 1.3 Spacing tokens

| Token | Value |
|---|---|
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 12px |
| `space-lg` | 16px |
| `space-xl` | 24px |
| `space-2xl` | 32px |
| `space-3xl` | 48px |

### 1.4 Shadow tokens

| Token | Value |
|---|---|
| `shadow-soft` | `0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)` |
| `shadow-warm` | `0 8px 24px rgba(232,150,170,0.1)` |
| `shadow-glow` | `0 0 20px rgba(232,150,170,0.15)` |
| `shadow-deep` | `0 2px 4px rgba(0,0,0,0.02), 0 8px 24px rgba(232,150,170,0.1), 0 1px 3px rgba(0,0,0,0.04)` |

## 2. Core Components

### 2.1 Glass Card (`.glass-card`)

**Purpose**: Primary content container — onboarding, dashboard, forms, settings.

**Specification**:
```css
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(18px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow: 0 2px 4px rgba(0,0,0,0.02), 0 8px 24px rgba(232,150,170,0.1), 0 1px 3px rgba(0,0,0,0.04);
border-radius: var(--radius); /* or rounded-3xl for onboarding */
padding: 2rem; /* p-8 */
```

**Dark mode**:
```css
background: rgba(255, 255, 255, 0.07);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(232,150,170,0.08), 0 1px 3px rgba(0,0,0,0.2);
```

**Usage variations**:
- `glass-card` — base card
- `glass-card rounded-3xl` — onboarding hero cards
- `glass-card p-6` — compact cards for dashboard
- `glass-card stagger-cards` — staggered card entry animation

**Readability rules**:
- Text contrast must meet WCAG AA on translucent surfaces
- Avoid stacking more than 2 glass layers without a solid spacer
- Use `--card` (opaque fallback) for high-contrast sections

### 2.2 Pill Button (`.glass-pill`)

**Purpose**: Interactive chips, filter labels, toggle-style options.

**Specification**:
```css
border: 1px solid rgba(255, 255, 255, 0.3);
backdrop-filter: blur(8px);
border-radius: 9999px;
padding: 0.5rem 1rem; /* px-4 py-2 */
font-size: 0.875rem; /* text-sm */
```

**States**:
- Default: transparent background, soft border
- Active: `background: rgba(255,255,255,0.15)`, highlight border
- Hover: brightness +5%, border brightens
- Disabled: opacity 0.4, no hover effect

**Sizes**:
- `sm`: `px-3 py-1 text-xs`
- `md`: `px-4 py-2 text-sm` (default)
- `lg`: `px-5 py-2.5 text-base`

**Usage**:
- Filter chips
- Period status selectors (No/Light/Medium/Heavy)
- Segmented controls
- Toggle-style option cards

### 2.3 Primary Button (CTA)

**Purpose**: Main call-to-action on all screens.

**Specification**:
```css
background: hsl(var(--primary));
color: hsl(var(--primary-foreground));
border-radius: 22px; /* rounded-[22px] */
height: 48px; /* h-12 */
padding: 0 1.5rem;
font-weight: 500;
font-size: 1rem; /* text-base */
width: 100%; /* w-full in onboarding */
box-shadow: 0 0 20px rgba(232,150,170,0.15); /* soft glow */
transition: filter 200ms ease, transform 100ms ease;
```

**States**:
- Default: primary background, glow shadow
- Hover: brightness +5%
- Active/press: scale 0.97 for 100ms
- Disabled: opacity 0.5, no glow, cursor not-allowed
- Focus-visible: outline with `--ring` (`338 72% 66%`), 2px offset

**Icon pattern**: Primary CTA can include a trailing icon (`ArrowRight`, `Check`) with `ml-2` margin.

### 2.4 Secondary/Outline Button

**Purpose**: Skip, cancel, secondary actions.

**Specification**:
```css
background: transparent;
color: hsl(var(--muted-foreground));
border: 1px solid hsl(var(--border));
border-radius: 22px;
height: 48px;
padding: 0 1.5rem;
```

### 2.5 Glass Tertiary (Text-only Button)

**Purpose**: Links, "Learn more", "View full privacy policy".

**Specification**:
```css
background: transparent;
color: hsl(var(--primary));
font-size: 0.875rem;
padding: 0;
```

### 2.6 Soft Input

**Purpose**: Form fields for name, email, date, search, etc.

**Specification**:
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(8px);
border: 1px solid hsl(var(--border));
border-radius: 16px; /* rounded-xl */
padding: 0.75rem 1rem;
font-size: 1rem;
color: hsl(var(--foreground));
transition: border-color 200ms ease, box-shadow 200ms ease;
width: 100%;
```

**States**:
- Default: soft background, subtle border
- Focus: border-color to `--primary`, box-shadow `0 0 0 3px hsl(var(--primary) / 0.1)`
- Error: border-color to `--destructive`, shake animation on change
- Disabled: opacity 0.5, cursor not-allowed
- Placeholder: `color: hsl(var(--muted-foreground) / 0.5)`

**Label**: Above the input, `text-xs text-muted-foreground`, with optional icon.

**Variants**:
- Standard input: full width, `rounded-xl`
- Date picker: native `<input type="date">`, same styling
- Search input: with search icon prefix, `rounded-full` pill shape

### 2.7 Segmented Control

**Purpose**: Short-choice selection (e.g., cycle length, period status).

**Specification**:
```css
display: flex;
border-radius: 9999px;
overflow: hidden;
border: 1px solid hsl(var(--border));
background: rgba(255, 255, 255, 0.3);
```

**Item**:
```css
flex: 1;
padding: 0.5rem 1rem;
text-align: center;
font-size: 0.875rem;
border-radius: 9999px;
transition: background-color 200ms ease, color 200ms ease;
```

**States**:
- Active: `background: hsl(var(--primary) / 0.15)`, `color: hsl(var(--primary))`
- Inactive: transparent, `color: hsl(var(--muted-foreground))`
- Focus-visible: outline with `--ring`

**Sizes**:
- `sm`: `text-xs`, `px-2 py-1`
- `md`: `text-sm`, `px-4 py-2`
- `lg`: `text-base`, `px-5 py-2.5`

### 2.8 Toggle Switch (`.switch`)

**Purpose**: Boolean consent toggles, preference switches.

**Specification**:
```css
position: relative;
display: inline-flex;
width: 44px;
height: 24px;
border-radius: 9999px;
background: hsl(var(--muted));
border: 1px solid hsl(var(--border));
cursor: pointer;
transition: background-color 200ms ease, box-shadow 200ms ease;
```

**Thumb**:
```css
position: absolute;
top: 2px;
left: 2px;
width: 20px;
height: 20px;
border-radius: 50%;
background: white;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

**States**:
- Checked: `background: hsl(var(--primary))`, thumb translates to right
- Unchecked: `background: hsl(var(--muted))`, thumb at left
- Focus-visible: outline with `--ring`, 2px offset
- Disabled: opacity 0.4

### 2.9 Feature Tile

**Purpose**: Compact discoverable feature cards for onboarding and dashboard.

**Specification**:
```css
display: flex;
align-items: center;
gap: 1rem;
padding: 1rem;
border-radius: 1rem; /* rounded-xl */
background: rgba(255, 255, 255, 0.5);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.3);
cursor: pointer;
transition: transform 150ms ease, box-shadow 200ms ease, background-color 200ms ease;
```

**Icon container**:
```css
width: 40px; height: 40px;
border-radius: 0.75rem; /* rounded-lg */
display: flex; align-items: center; justify-content: center;
background: hsl(var(--blush) / 0.4);
```

**Content**:
- Title: `text-sm font-semibold text-foreground`
- Benefit: `text-xs text-muted-foreground leading-relaxed`
- Chevron: `size={16}`, `text-muted-foreground`

**States**:
- Hover: `background: rgba(255,255,255,0.7)`, box-shadow increase
- Press: scale 0.98 for 100ms

### 2.10 Skeleton Loader

**Purpose**: Loading placeholder while data fetches.

**Specification**:
```css
background: hsl(var(--muted) / 0.3);
border-radius: inherit;
```

**Shimmer overlay** (CSS only):
```css
background-image: linear-gradient(90deg, transparent, hsl(var(--muted) / 0.5), transparent);
background-size: 200% 100%;
animation: skeleton-shimmer 1500ms linear infinite;
```

## 3. Spacing and Layout Consistency

### 3.1 Card internal spacing
- Padding: `p-8` (2rem) for primary cards, `p-6` for compact, `p-4` for minimal
- Internal gap: `space-y-4` (1rem) between sections
- Inner padding: children within card use `space-y-3` for dense layouts

### 3.2 Horizontal alignment
- All content cards center-aligned when single-purpose (onboarding)
- Left-aligned when multi-row (forms, settings, lists)
- Flex containers use `gap-3` or `gap-4` consistently

### 3.3 Vertical rhythm
- Headlines: `mb-3` (0.75rem)
- Body text: `mb-4` (1rem) for paragraphs
- Actions: `space-y-3` (0.75rem) between stacked buttons, `flex gap-3` for inline
- Cards: `space-y-6` (1.5rem) between card sections

### 3.4 Edge cases
- Full-width glass card on mobile: `w-full` with `px-5` horizontal padding
- Max-width container: `max-w-sm` (384px) for onboarding, `max-w-md` (448px) for settings
- Bottom nav clearance: `safe-area-inset-bottom` or `pb-20`

## 4. Component Composition Patterns

### 4.1 Onboarding screen template
```
<glass-card rounded-3xl p-8 max-w-sm>
  [icon-container]
  <h2> Headline </h2>
  <p> Description </p>
  [input or action]
  <div flex gap-3>
    <secondary-button> Skip </secondary-button>
    <primary-button> Continue → </primary-button>
  </div>
</glass-card>
```

### 4.2 Dashboard card template
```
<glass-card rounded-3xl p-6>
  <div flex items-center gap-3 mb-3>
    <Icon /> <h3> Title </h3>
  </div>
  <p> Content </p>
  <div flex justify-between items-center mt-4>
    <text> Detail </text>
    <link> Action → </link>
  </div>
</glass-card>
```

### 4.3 Form row template
```
<div flex flex-col>
  <label> Field label </label>
  <input />
  <p> Validation message (optional) </p>
</div>
```

## 5. Component Inventory

| Component | File | Usage |
|---|---|---|
| `Card` | `@/components/ui/card.jsx` | Base card with header, content, footer |
| `Button` | `@/components/ui/button.jsx` | Primary, secondary, ghost, icon variants |
| `Input` | `@/components/ui/input.jsx` | Text, email, date, search fields |
| `Label` | `@/components/ui/label.jsx` | Form field labels |
| `Switch` | `@/components/ui/switch.jsx` | Toggle controls |
| `Checkbox` | `@/components/ui/checkbox.jsx` | Boolean selections, disclaimers |
| `Slider` | `@/components/ui/slider.jsx` | Range inputs (cycle length) |
| `Select` | `@/components/ui/select.jsx` | Dropdown selections |
| `RadioGroup` | `@/components/ui/radio-group.jsx` | Single-choice selections |
| `SegmentedControl` | Custom | Inline pill-style toggle groups |
| `Badge` | `@/components/ui/badge.jsx` | Status indicators, counts |
| `Skeleton` | `@/components/ui/skeleton.jsx` | Loading placeholders |
| `Toast` | `@/components/ui/toast.jsx` | Inline feedback |
| `Dialog` | `@/components/ui/dialog.jsx` | Modal containers |
| `Sheet` | `@/components/ui/sheet.jsx` | Bottom sheets (privacy policy) |

## 6. Cross-Surface Readability Rules

When text, icons, or controls sit on glassmorphism surfaces:

1. **Text**: Always use `--foreground` (`275 15% 18%` light / `340 25% 95%` dark) for body text. Never use `--muted-foreground` for primary label text on glass.

2. **Icons on glass**: Use `--muted-foreground` for inactive icons, `--foreground` for active, `--primary` for emphasis icons. Never use pure white icons on frosted surfaces.

3. **Interactive elements**: Buttons and inputs on glass surfaces should have an underlying semi-opaque backing (`bg-background/80` or `bg-secondary/50`) to ensure tap target contrast.

4. **Borders on glass**: Use `1px solid rgba(255,255,255,0.3)` minimum on glass surfaces. Dark mode uses `rgba(255,255,255,0.08)` minimum.

5. **Shadows**: Every glass element on screen should have at least `shadow-soft` or `shadow-warm` to separate it from the background layer.

6. **Focus-visible**: `outline: 2px solid hsl(var(--ring))` with `outline-offset: 2px`. Never rely on the browser default focus ring.

## 7. Responsive Component Behavior

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Glass card | `max-w-sm`, full-width with `px-5` | `max-w-md`, centered | `max-w-lg`, centered |
| Buttons | Full-width (`w-full`) | Inline-flex with gap | Inline-flex with gap |
| Inputs | Full-width | `max-w-xs` | `max-w-sm` |
| Feature tiles | Single column | 2 columns | 3 columns |
| Segmented controls | Scroll horizontally if >4 items, or wrap | Always horizontal | Always horizontal |

## 8. Accessibility Standards

- All interactive components meet WCAG 2.1 AA touch target size (44×44px minimum)
- Focus management: focus moves to first interactive element after card mount/dialog open
- ARIA: `role="switch"` for toggles, `role="radiogroup"` for segmented controls, `aria-checked` for toggle states
- Keyboard: all components support Tab/Enter/Space navigation
- Reduced motion: all animations disabled under `prefers-reduced-motion`
- Screen reader: meaningful text labels on all icon-only buttons, hidden labels for decorative icons

## 9. Consistency with Codebase

This specification maps directly to:
- **CSS**: `src/index.css` — all class names (`.glass-card`, `.glass-pill`, `.glass-nav`, `.glass`), shadow definitions, animation keyframes, and CSS custom properties
- **Color tokens**: `:root` and `:root.dark` selectors in `index.css`
- **Typography tokens**: `--font-display`, `--font-body` in `index.css`
- **Existing components**: `src/components/ui/card.jsx`, `button.jsx`, `input.jsx`, `switch.jsx`, `slider.jsx`, etc.
- **Animations**: `index.css` lines 225–290 contain all keyframe definitions and animation utility classes
- **PRD**: `docs/Ui-Ux PRD.md` §11 component requirements list
- **Existing components**: `CompanionMascot.jsx`, `PetalCelebration.jsx`, `ThemeToggle.jsx` demonstrate the design system patterns

---

*Last updated: 2026-07-30. This spec extends the component patterns already implemented in `src/components/ui/` and `src/index.css`. It serves as the authoritative reference for all reusable UI components.*