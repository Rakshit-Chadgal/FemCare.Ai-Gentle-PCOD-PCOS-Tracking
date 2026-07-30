# FemCare Welcome Screen Specification

A warm, private, reassuring first impression with mascot, glass card, and clear trust messaging.

## 1. Purpose

Build immediate emotional comfort and trust. Welcome the user into a calm, private space before asking for any action or data. The screen should feel like a gentle invitation, not a wall of text or a clinical dashboard.

## 2. Layout

```
┌─────────────────────────────────────┐
│                                     │
│        [Ambient blobs]              │
│        soft blush and               │
│        lavender gradients            │
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   CompanionMascot       │      │
│    │   mood=4, follicular    │      │
│    │   phase, size=120       │      │
│    │                         │      │
│    │   Welcome to FemCare    │      │
│    │                         │      │
│    │   A calm, private space │      │
│    │   to track your         │      │
│    │   symptoms, notice      │      │
│    │   patterns, and feel    │      │
│    │   more prepared for     │      │
│    │   doctor visits.        │      │
│    │                         │      │
│    │   ┌─────────────────┐   │      │
│    │   │  Get Started  → │   │      │
│    │   └─────────────────┘   │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
│         ● ○ ○ ○ ○  ← dots         │
│                                     │
└─────────────────────────────────────┘
```

## 3. Visual Details

### 3.1 Background
- Base: `--background` (warm cream `340 30% 99.6%`)
- Ambient blobs:
  - Blush blob: top-left, `absolute`, `opacity-60`, `blur-[80px]`, `w-[60%] h-[60%]`
  - Lavender blob: top-right, `opacity-50`, `blur-[80px]`, `w-[55%] h-[55%]`
  - Cream blob: bottom-left, `opacity-40`, `blur-[80px]`, `w-[50%] h-[50%]`
- Blob colors from CSS variables: `--blob-blush` (`#FFE4E9`), `--blob-lavender` (`#E8DFF5`), `--blob-cream` (`#FFF8F3`)

### 3.2 Glass card
- Class: `glass-card`
- Border radius: `rounded-3xl` (24px)
- Padding: `p-8` (2rem)
- Width: `max-w-sm` (384px), `w-full`
- Text alignment: `text-center`

### 3.3 Mascot
- Component: `CompanionMascot`
- Props: `mood={4}`, `phase="follicular"`, `size={120}`
- Placement: centered above the headline
- Animation: `companion-bounce` (600ms `ease-out`) after card mount

### 3.4 Headline
- Content: "Welcome to FemCare"
- Style: `text-2xl font-display font-semibold text-foreground`
- Margin bottom: `mb-3`
- Font: Fraunces, weight 500

### 3.5 Trust statement
- Content: "A calm, private space to track your symptoms, notice patterns, and feel more prepared for doctor visits."
- Style: `text-sm text-muted-foreground leading-relaxed`
- Margin bottom: `mb-8`
- Line-height: `leading-relaxed` (1.625)
- Tone: warm, reassuring, private — never clinical

### 3.6 Primary CTA
- Label: "Get Started"
- Icon: `ArrowRight`, `size={18}`, `ml-1` margin
- Class: `w-full rounded-[22px] h-12 text-base`
- Style: primary filled button (`bg-primary`, `text-primary-foreground`)
- Hover state: subtle scale (1.01) with `transition`
- Press state: scale down to 0.97

## 4. Interactions

| Interaction | Trigger | Result |
|---|---|---|
| Tap "Get Started" | Button click | Navigate to next onboarding screen (slide right, 300ms) |
| First mount | Screen visible | Mascot bounces, card fades in |
| Background | — | Ambient blobs static but may slowly pulse |

## 5. Motion

| Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|
| Card | `card-rise` (opacity + translateY) | 280ms | `ease-out both` | 0ms |
| Mascot | `companion-bounce` | 600ms | `ease-out` | 300ms |
| Headline | fade in + translateY 8px→0 | 300ms | `ease-out` | 100ms |
| Trust text | fade in + translateY 8px→0 | 300ms | `ease-out` | 200ms |
| CTA | fade in + scale 0.98→1 | 300ms | `ease-out` | 300ms |

## 6. Responsive

- Mobile-first layout
- Card max-width: 384px (`max-w-sm`)
- On larger screens: center card vertically and horizontally
- Safe area insets respected for notched devices
- Touch targets: minimum 44px on all interactive elements

## 7. Accessibility

- `aria-label` on mascot: "FemCare companion"
- CTA: `aria-label="Get started with FemCare"`
- Sufficient color contrast: `--foreground` on `--background` meets AA
- Focus-visible ring: `--ring` (`338 72% 66%`)
- `prefers-reduced-motion` reduces mascot bounce and motion to fade only

## 8. Dark Mode

- Background blobs shift to darker tones (`--blob-blush: #4A2A38`, `--blob-lavender: #3A3550`, `--blob-cream: #2E2832`)
- Glass card background uses `rgba(255,255,255,0.07)` with `border: 1px solid rgba(255,255,255,0.08)`
- Shadow adjusts for dark surfaces
- Text remains at `--foreground` (`340 25% 95%`)

## 9. Consistency with Codebase

This spec aligns directly with:
- `src/pages/Onboarding.jsx` Slide 1 structure (lines 124–136)
- `src/index.css` `.glass-card` class (line 133–139)
- `src/index.css` ambient blob styles (lines 100–104)
- `src/components/CompanionMascot.jsx` mascot component
- `src/index.css` animation keyframes (`card-rise`, `companion-bounce`)
- Existing `Button` component with `rounded-[22px]` and `h-12` styling

## 10. Implementation Notes

- Use the existing `CompanionMascot` component with `mood={4}` and `phase="follicular"`
- The `glass-card` class handles translucency, blur, border, and shadow in one utility
- Ambient blobs are positioned `absolute inset-0` with `pointer-events-none`
- The "Get Started" button currently uses `ArrowRight` from lucide-react (already imported in Onboarding.jsx)
- No skip button on this screen (per spec: screen 1 is not skippable)