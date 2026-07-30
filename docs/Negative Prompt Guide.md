# FemCare Negative Prompt Guide

Design constraints to avoid — harsh neon, clinical aesthetics, aggressive motion, and other anti-patterns.

## 1. Color Anti-Patterns

### 1.1 Harsh neon colors
- Avoid saturated pure blues (`#0000FF`), greens (`#00FF00`), reds (`#FF0000`)
- Avoid high-saturation yellow (`#FFFF00`), cyan (`#00FFFF`)
- Avoid neon gradients (e.g., hot pink → electric blue)
- Avoid color values with saturation above 85% and lightness above 60% combined
- Never use neon pink (`#FF1493`) or toxic green (`#39FF14`) anywhere in the interface

### 1.2 Cold, clinical palette
- Avoid pure white backgrounds (`#FFFFFF` on large surfaces)
- Avoid sterile blue-white light (`#E8F0FE` or similar)
- Avoid hospital-grade teal or mint as primary accents
- Avoid grayscale-only UIs that feel medical and impersonal
- Avoid single-color dominance (e.g., entirely blue or entirely green interfaces)
- Never cool blues (`#6699CC`, `#4A90D9`) as primary actions — use warm rose instead

### 1.3 Dark theme extremes
- Avoid very dark backgrounds (`#0A0A0A` or darker) that feel cold and clinical
- Avoid high-contrast dark mode with pure white text on pure black (`#000000` / `#FFFFFF`)
- Avoid desaturated dark palettes (gray-only dark mode) — always use warm undertones
- Never use dark backgrounds without warm ambient elements (blobs, glows, tints)

## 2. Shadow and Elevation Anti-Patterns

### 2.1 Heavy shadows
- Avoid hard-edged shadows (`0 4px 8px rgba(0,0,0,0.5)`)
- Avoid large offset shadows that create depth separation (`0 20px 40px rgba(0,0,0,0.2)`)
- Avoid colored shadows that don't match the palette (`0 4px 12px rgba(0,0,255,0.3)`)
- Avoid multiple stacked sharp shadows on the same element
- Never use `box-shadow` with both large blur and large spread simultaneously

### 2.2 Shadow-free surfaces
- Avoid flat designs with zero shadows or depth cues — even minimal glass needs at least `shadow-soft`
- Avoid dropping all shadows to `0 0 0 transparent` as a "clean" choice

## 3. Layout and Clutter Anti-Patterns

### 3.1 Cluttered layouts
- Avoid more than 3 visual tiers in a single view without clear grouping
- Avoid dense text blocks with no breathing room (minimum 16px padding around text groups)
- Avoid more than 2 cards in a single row on mobile (causes cramped feel)
- Avoid walls of text — break content into card-based sections
- Never stack more than 4 information-dense rows without a visual separator or card boundary
- Avoid using `width: 100%` on text-heavy cards without `max-width` constraints

### 3.2 Dense legal walls
- Avoid presenting full privacy policies or terms of service on a single screen without collapsible sections
- Avoid legal disclaimer text at small sizes (`<12px`) with no visual hierarchy
- Never use dense paragraph blocks as the primary content on any screen

## 4. Aesthetic Anti-Patterns

### 4.1 Clinical hospital aesthetics
- Avoid white/blue color schemes reminiscent of medical environments
- Avoid stethoscope-related iconography or medical cross symbols as primary branding
- Avoid sterile typography (e.g., `Helvetica Neue` in a clinical layout)
- Never use body outlines, anatomical diagrams, or clinical illustrations as primary decorative elements
- Avoid measurement units and data-dense tables as entry points

### 4.2 Dense legal text
- Avoid presenting legal copy without warm visual treatment (glass card, soft background)
- Never use all-caps for legal disclaimers — use sentence case in a calm font
- Avoid legal jargon without explanation in user-facing UI

## 5. Motion Anti-Patterns

### 5.1 Aggressive motion
- Never use durations shorter than 100ms for visible animations (feels jarring)
- Never use `ease-in` for entry animations (feels like a drop)
- Never use `ease-in-out` for quick micro-interactions (feels sluggish)
- Avoid animation durations over 1800ms for any single element (feels laggy)
- Never use `animation-iteration-count: infinite` without a clear purpose and short duration
- Avoid `translateX` or `translateY` moves over 50px in a single transition (feels distant)

### 5.2 Flashy effects
- Never use strobing, flashing, or rapid color alternation
- Avoid particle systems beyond 5 particles
- Never use confetti, exploding shapes, or celebration effects that span the full viewport
- Avoid `scale(1.5)` or larger on hover — subtle is better
- Never use `opacity` blinking (0 → 1 → 0 in a loop)
- Avoid rainbow gradients, prismatic effects, or rainbow-colored UI elements

### 5.3 Playful/gamified motion
- Never use bouncy spring easing (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`) on content elements — spring is acceptable only for toggle switches
- Avoid wobble, shake, or jiggle animations outside of form error states
- Never use playful emoji transitions or cartoon-style squash-and-stretch
- Avoid progress bars with dramatic fills or percentage counters with animation

## 6. Visual Mood Anti-Patterns

### 6.1 Cold interfaces
- Avoid color schemes heavy on blues, grays, and whites
- Avoid interfaces without any warm accent color
- Never use `#B0BEC5` or similar cool gray as a primary surface
- Avoid interfaces that feel like enterprise dashboards (dense charts, gray navigation, minimal whitespace)

### 6.2 Technical/cold interfaces
- Avoid monospace fonts for body text or headings
- Never use hex grid patterns, circuit board visuals, or code-like decoration
- Avoid sharp-edged designs (all corners should be rounded, minimum 8px)
- Avoid data-table-primary layouts as the main user view
- Never use terminal-style output or developer-tool aesthetics

### 6.3 Overly gamified interfaces
- Avoid progress bars with levels, experience points, or achievement badges
- Never use streak counters with flame animations or competitive language
- Avoid leaderboards, rankings, or scoring systems
- Never use confetti, fireworks, or victory animations for routine interactions
- Avoid gamified badges, collectibles, or unlockable content systems
- Never use "points" or "streak" language in the UI copy

## 7. Motion Negative Constraints

| Constraint | Rationale |
|---|---|
| No animation shorter than 100ms | Feels jarring and unintentional |
| No strobing or flashing | Can cause discomfort, especially for photosensitive users |
| No aggressive particle effects | Distracting, not calming |
| No bounce on non-interactive elements | Feels uncontrolled and playful |
| No scale changes over 1.15x or under 0.85x | Extreme scales feel unnatural |
| No opacity below 0.3 for interactive elements | Reduces accessibility and feels hidden |
| No simultaneous competing animations (>3) | Creates visual noise and cognitive load |
| No animations without a clear trigger | Feels random and untrustworthy |
| No scroll-linked parallax on background | Can feel disorienting on mobile |
| No auto-playing video or animation loops | Wastes resources, distracting |

## 8. General Anti-Patterns

| Do Not Do | Instead Do This |
|---|---|
| Use high-contrast borders (`rgba(0,0,0,0.5)`) | Use soft, warm borders (`rgba(255,255,255,0.3)`) |
| Stack dense forms without grouping | Wrap form sections in glass cards |
| Use red for all warnings | Use awareness tokens with supporting icons |
| Make all text the same size | Use the established type scale |
| Put the primary CTA in a corner | Center it or anchor it to the bottom |
| Use thin, hard-to-read fonts on glass | Ensure sufficient opacity and contrast |
| Overload the home screen with everything | Use progressive disclosure and cards |
| Make the mascot cartoonish or overly cheerful | Keep the mascot soft, gentle, and neutral |
| Use aggressive gradients (hot pink → blue) | Use soft pastels with gentle transitions |
| Design only for light mode | Always provide dark mode with matching warmth |

## 9. Checking Compliance

Before shipping any visual or interaction design, verify it against this guide:

1. Does it use any neon or oversaturated colors? → Replace with pastel alternative
2. Would this feel cold, clinical, or sterile to a first-time user? → Add warmth (blush tint, soft shadow, rounded corners)
3. Does any animation feel fast, aggressive, or playful? → Slow it by 40%
4. Is there more than one wall of text without card separation? → Break into cards
5. Could this feel like a medical or enterprise app? → Add glassmorphism, pastels, warmth
6. Is the dark mode cold or desaturated? → Add warm ambient tints
7. Would this feel overwhelming on a small screen? → Reduce content density, increase spacing

---

*Last updated: 2026-07-30. This guide is the inverse complement to the design system — use it during design reviews to catch anti-patterns early.*