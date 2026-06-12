---
description: UI/UX design intelligence for web and mobile apps. Contains 50+ styles, 161 color palettes, 57 font pairings, and 99 UX guidelines.
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 161 color palettes, 57 font pairings, 161 product types with reasoning rules, 99 UX guidelines, and 25 chart types across 10 technology stacks.

## When to Apply

Use this Skill for tasks involving **UI structure, visual design, interactions, or user experience quality control**.

- **Must Use**: Designing new screens, creating/refactoring components (buttons, modals, forms, charts), establishing color/typography, checking accessibility, or implementing navigation/animations.
- **Skip**: Pure backend logic, API/database design, DevOps, or non-visual automation.

## Rule Categories by Priority

| Priority | Category          | Domain  | Key Checks (Must Have)                                   | Anti-Patterns (Avoid)                                   |
| -------- | ----------------- | ------- | -------------------------------------------------------- | ------------------------------------------------------- |
| 1        | Accessibility     | `ux`    | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels      | Removing focus rings, Icon-only buttons without labels  |
| 2        | Touch/Interaction | `ux`    | Min size 44×44px, 8px+ spacing, Loading feedback         | Reliance on hover only, Instant state changes (0ms)     |
| 3        | Performance       | `ux`    | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1)       | Layout thrashing, Cumulative Layout Shift               |
| 4        | Style Selection   | `style` | Match product type, Consistency, SVG icons               | Mixing flat & skeuomorphic randomly, Emoji as icons     |
| 5        | Layout/Responsive | `ux`    | Mobile-first breakpoints, Viewport meta, No horiz-scroll | Horizontal scroll, Fixed container widths, Disable zoom |
| 6        | Typography/Color  | `color` | Base 16px, Line-height 1.5, Semantic color tokens        | Text < 12px body, Gray-on-gray, Raw hex in components   |
| 7        | Animation         | `ux`    | Duration 150–300ms, Motion conveys meaning               | Decorative-only motion, Animating width/height          |
| 8        | Forms/Feedback    | `ux`    | Visible labels, Error near field, Progressive disclosure | Placeholder-only label, Errors only at top of form      |
| 9        | Navigation        | `ux`    | Predictable back, Bottom nav <=5, Deep linking           | Overloaded nav, Broken back behavior, No deep links     |
| 10       | Charts/Data       | `chart` | Legends, Tooltips, Accessible colors                     | Relying on color alone to convey meaning                |

## Premium Design & Aesthetics System

To create a state-of-the-art visual experience (WOW factor), follow these premium design tokens:

- **Curated Color Palettes**: Avoid generic primary colors. Use custom HSL palettes (e.g., Indigo/Slate theme, Warm Amber/Charcoal). Light mode uses soft off-white (#FAFAFA); Dark mode uses deep midnight tones (#0F172A).
- **Typography & Pairings**: Use modern fonts like Inter, Outfit, or Playfair Display. Match heading to body personality. Use a scale: Heading-1 32px/1.2, Heading-2 24px/1.3, Body 16px/1.5, Label 14px/1.5.
- **Glassmorphism & Depth**: Combine light opacity backgrounds (`rgba(255, 255, 255, 0.7)`) with `backdrop-filter: blur(12px)` and a subtle 1px border (`rgba(255, 255, 255, 0.2)`) to create depth.
- **Micro-Animations**: Hover state animations (150ms ease), scale feedback (0.97 on press), and stagger sequences (30ms per list item).

## Quick Reference Checklist

### 1. Accessibility (CRITICAL)

- `color-contrast`: Min 4.5:1 ratio for normal text (large text 3:1).
- `focus-states`: Visible focus rings on interactive elements (2–4px).
- `alt-text`: Descriptive alt text for meaningful images.
- `aria-labels`: aria-label for icon-only buttons; accessibilityLabel in native.
- `keyboard-nav`: Tab order matches visual order; full keyboard support.
- `dynamic-type`: Support system text scaling without truncation/overlap.
- `reduced-motion`: Respect prefers-reduced-motion; reduce/disable animations.
- `escape-routes`: Provide cancel/back in modals, sheets, and multi-step flows.
- `color-not-only`: Never convey crucial information using color alone (pair with icons/labels).

### 2. Touch & Interaction (CRITICAL)

- `touch-target-size`: Min 44×44pt (iOS) / 48×48dp (Android); extend hit area.
- `touch-spacing`: Minimum 8px gap between touch targets.
- `hover-vs-tap`: Tap for primary interactions; don't rely on hover alone.
- `loading-buttons`: Disable button during async operations; show spinner.
- `press-feedback`: Visual feedback on press (ripple/highlight; opacity transition).
- `safe-area-awareness`: Keep touch targets away from notch, Dynamic Island, and edges.
- `gesture-conflicts`: Avoid nested swipe/drag interactions that trigger OS actions.

### 3. Performance (HIGH)

- `image-optimization`: Use WebP/AVIF, responsive sizes, lazy load below fold.
- `image-dimension`: Declare width/height/aspect-ratio to prevent layout shift (CLS).
- `font-loading`: Use font-display: swap/optional to avoid invisible text (FOIT).
- `lazy-loading`: Lazy load non-hero components via dynamic imports.
- `virtualize-lists`: Virtualize lists with 50+ items to maintain high scroll rates.
- `progressive-loading`: Use skeleton screens/shimmer for >1s operations.
- `debounce-throttle`: Debounce/throttle scroll, resize, and heavy search inputs.

### 4. Style Selection (HIGH)

- `style-match`: Match style to product type (minimal, glassmorphism, claymorphism).
- `no-emoji-icons`: Use SVG icons (Lucide, Heroicons), not emojis.
- `dark-mode-pairing`: Design light/dark variants together for brand consistency.
- `primary-action`: One primary CTA per screen; secondary actions visually subordinate.
- `elevation-consistent`: Use a consistent shadow/elevation scale.
- `platform-adaptive`: Respect iOS HIG vs Android Material idioms for buttons and menus.

### 5. Layout & Responsive (HIGH)

- `viewport-meta`: Ensure viewport allows zooming (never disable zoom).
- `mobile-first`: Design mobile-first, then scale up to tablet and desktop.
- `readable-font-size`: Minimum 16px body text on mobile.
- `line-length-control`: Mobile 35–60 chars per line; desktop 60–75 chars.
- `spacing-scale`: Use 4pt/8dp incremental spacing system.
- `horizontal-scroll`: Ensure all content fits viewport width without horizontal scroll.
- `z-index-management`: Maintain a structured z-index scale (0, 10, 20, 50, 100, 1000).

### 6. Typography & Color (MEDIUM)

- `line-height`: Use 1.5-1.75 for body text.
- `color-semantic`: Use semantic color tokens (primary, error, surface), not raw hex.
- `weight-hierarchy`: Bold headings (600–700), Regular body (400), Medium labels (500).
- `number-tabular`: Use tabular/monospaced figures for prices, timers, and data.
- `truncation-strategy`: Prefer wrapping over truncation; show tooltip for truncated text.
- `whitespace-balance`: Use white space intentionally to group related elements.

### 7. Animation (MEDIUM)

- `duration-timing`: 150–300ms for micro-interactions; complex transitions <=400ms.
- `transform-performance`: Animate transform/opacity only; avoid width/height/top/left.
- `easing`: ease-out for entering, ease-in for exiting; avoid linear transitions.
- `motion-meaning`: Animations express cause-effect or spatial continuity.
- `interruptible`: User input must immediately interrupt running transitions.
- `spring-physics`: Use physics-based curves (fluid dynamics) for native-like animations.
- `stagger-sequence`: Stagger list entrance sequences by 30ms per item.

### 8. Forms & Feedback (MEDIUM)

- `input-labels`: Visible label per input (not placeholder-only).
- `error-placement`: Show clear recovery message below the related field on blur.
- `disabled-states`: Use reduced opacity (0.38-0.5) + disabled attributes.
- `progressive-disclosure`: Reveal complex options progressively.
- `autofill-support`: Use autocomplete/textContentType attributes.
- `sheet-dismiss-confirm`: Confirm before dismissing a modal with unsaved changes.
- `inline-validation`: Validate fields on blur, never on every keystroke.

### 9. Navigation Patterns (HIGH)

- `bottom-nav-limit`: Max 5 items; always include both icon and text label.
- `back-behavior`: Back is predictable, preserves scroll position/state.
- `deep-linking`: All key screens reachable via unique URLs or deep links.
- `modal-vs-navigation`: Do not use modals for primary/nested navigation flows.
- `adaptive-navigation`: Sidebar on large screens; bottom/top nav on mobile.
- `gesture-nav-support`: Support system swipe-back gestures without conflicts.

### 10. Charts & Data (LOW)

- `chart-type`: Match data (trend->line, compare->bar, proportion->pie/donut).
- `color-guidance`: Don't rely on red/green alone; verify colorblind accessibility.
- `tooltip-on-interact`: Show values on hover (Web) or tap (mobile).
- `data-table`: Provide accessible tabular equivalent for screen readers.

## Rules for Professional UI

### Icons & Visuals

- **No Emojis**: Use vector icons (e.g. Lucide, Expo vector-icons) for structural UI.
- **Stable State Transitions**: Pressed/active states must not shift layout bounds.
- **Icon Sizing & Style**: Use consistent sizing tokens and one family (stroke width, outline vs filled).
- **Contrast**: Icon elements must meet 3:1 contrast against backgrounds.

### Interaction & Layout

- **Tap Feedback**: Visual ripple/opacity feedback must activate within 80-150ms.
- **Safe-Area Compliance**: Respect top/bottom safe areas (notch, home indicator).
- **8dp Grid**: Use increments of 4/8dp for all layout padding, margins, and gaps.

### Theme Contrast (Light/Dark)

- **Text Contrast**: Primary text contrast >=4.5:1, secondary >=3:1 in both modes.
- **Theme Parity**: Borders, dividers, and focus rings must be visible in both themes.
- **Modal Scrim**: Scrim opacity must be 40-60% black to isolate foreground.
