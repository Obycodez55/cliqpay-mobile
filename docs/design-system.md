# Cliqpay Mobile — Design System

**Status: foundations decided (§1), motion decided (§2).** Component inventory, copy voice, and screen inventory are still placeholders — filled in as each phase actually needs them, per `phase-playbook.md`.

Sections will fill in during the design phase, informed by reference apps (Cash App, Revolut, Wise, Kuda, Opay, PalmPay, Moniepoint, Apple Wallet/Pay — see [design-research.md](design-research.md)) and the `apple-design` + `emil-design-eng` skills for motion/interaction principles (§2).

## 1. Foundations

### Color

Brand color is a violet ramp, chosen to stay distinct from Kuda/PalmPay's pink-leaning purples (more blue-shifted) and from every other reference app's green/blue territory (see [design-research.md](design-research.md)):

| Token | Hex | Primary use |
| --- | --- | --- |
| `violet-50` | `#F1EFFB` | Light theme's main canvas background (not pure white — warmer) |
| `violet-100` | `#E7E0F2` | Light theme secondary surfaces (chips, secondary buttons) |
| `violet-300` | `#C6B3E3` | Muted/disabled states |
| `violet-500` | `#926ECB` | Accent pop — dark-theme gradient/CTA endpoint, avatars in both themes |
| `violet-700` | `#3F3061` | Primary brand color — light-theme CTAs, gradient hero start |
| `violet-800` | `#2A1F34` | Gradient hero end (light theme), dark-theme elevated surfaces |
| `violet-900` | `#191128` | Dark theme's main canvas background |

**Gradient hero treatment**: reserved for hero elements only (wallet balance card, primary avatars/icons) — not the whole canvas. Direction and stops differ per theme, since each needs contrast against a different base:
- Light theme: `violet-700 → violet-800` (135deg) — dark gradient pops against the light `violet-50` canvas.
- Dark theme: `violet-500 → violet-700` (135deg) — lighter gradient pops against the near-black `violet-900` canvas.

Everything outside hero elements stays flat — white/`violet-50` surfaces in light, `violet-900`/`violet-800` surfaces in dark. Don't extend the gradient treatment to buttons, chips, or backgrounds generally; it's a hero-only accent, per `apple-design`'s restraint principle (§2) as much as a color rule.

**Secondary accent — terracotta**: `#C1552E` (light tint `#FBEEE8`), used sparingly for highlight moments (e.g. "money received" badges) — mirrors the reference app's own restrained orange-on-purple accent use. Not a second primary color; violet leads everywhere structural (buttons, navigation, brand moments).

**Semantic tokens** (defaults — revisit if a specific screen's states need finer distinctions):

| Token | Light | Dark | Background tint (light / dark) |
| --- | --- | --- | --- |
| `success` | `#1E8A4C` | `#5FC98A` | `#EAF7EF` / `#1F3A2A` |
| `error` | `#D64545` | `#E8776F` | `#FDEBEA` / `#3A2422` |
| `warning` | `#C88A1D` | `#E0AC4D` | `#FDF3E0` / `#3A2E1A` |
| `balance-positive` | reuses `success` | reuses `success` | — |
| `balance-negative` | reuses `error` | reuses `error` | — |

`balance-negative` is for a genuinely negative wallet balance (e.g. post-chargeback debt, Phase 5) — a routine "sent" transaction row stays neutral text, not red; red is reserved for states that actually need the user's concern.

**Text & neutrals:**

| Token | Light | Dark |
| --- | --- | --- |
| `text-primary` | `#161616` | `#F5F3F8` |
| `text-secondary` | `#8A8A8E` | `#9C93AC` |
| `border` | `#ECECEC` | `#342750` |
| `surface` (card/sheet bg) | `#FFFFFF` | `#241A33` |

### Typography

System font (SF Pro on iOS, Roboto on Android via RN's default) — no custom typeface. Scale follows `apple-design`'s size-specific tracking/leading guidance (§2 of that skill): tighter leading + negative tracking as size increases, positive tracking on small text for legibility.

| Style | Size/line-height | Weight | Tracking |
| --- | --- | --- | --- |
| Display (e.g. balance figure) | 34/40 | 700 | -0.02em |
| Title | 24/30 | 700 | -0.01em |
| Heading | 18/24 | 600 | 0 |
| Body | 16/22 | 400 | 0 |
| Caption | 13/18 | 500 | 0.01em |
| Label/micro | 11/14 | 600 | 0.02em |

Scale with the user's system text-size setting (Dynamic Type / Android font scale) — use RN's relative units, don't hardcode pixel sizes that ignore accessibility settings.

### Spacing

4px base unit, standard scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Screen edge padding defaults to `16`; card/sheet internal padding defaults to `20-24`.

### Iconography

`@expo/vector-icons` (already available in the Expo scaffold, no new dependency) as the default icon set — revisit only if a specific icon it lacks becomes a real blocker. Icon-only tab bar (per the reference-app research, §"Cross-app patterns" in `design-research.md`) rather than labeled tabs, matching Cash App/Revolut's minimal-chrome approach.

## 2. Motion

Source of truth: the `apple-design` and `emil-design-eng` skills (loaded before building any animated/interactive component — see `CLAUDE.md`). Both are written CSS/web-first; this section is the RN/Reanimated translation of their principles, not a re-statement. Specific per-component timing/spring values still get pinned during each phase's design pass (per `phase-playbook.md`), not decided wholesale here.

**Decision framework (from `emil-design-eng`) — apply before writing any animation:**

| Frequency | Decision |
| --- | --- |
| Many times/session (tab switches, list scroll) | No animation, or near-instant only |
| Occasional (modals, sheets, toasts) | Standard animation |
| Rare/first-time (onboarding, success states, celebrations) | Can add delight |

Every animation needs a real purpose (spatial consistency, state indication, feedback, preventing a jarring change) — "it looks nice" isn't sufficient justification for something seen often.

**Springs over fixed durations (from `apple-design`):** prefer Reanimated's `withSpring` to `withTiming` for anything touchable — it's interruptible (retargets mid-flight from the live value) and carries velocity through a reversal, which `withTiming` can't do. Defaults:

| Interaction | Damping | Notes |
| --- | --- | --- |
| Default UI motion (sheets opening, state transitions) | Critically damped, no overshoot | Most of the app lives here |
| Momentum-driven (drag release, flick, swipe-to-dismiss) | Slight underdamp/bounce | Only when the gesture itself carried velocity — never on a fade-in |

Keep UI animation duration-equivalent (spring settle time) under ~300ms; press feedback specifically 100-160ms.

**Direct manipulation & gestures:** anything draggable (bottom sheets, swipe-to-dismiss on a transaction row, pull-to-refresh) goes through `react-native-gesture-handler` + Reanimated's `Gesture` API for 1:1 tracking — the element must stay glued to the finger's exact offset, and on release, hand off the gesture's real velocity into the spring rather than animating to a fixed target from a standstill.

**Component defaults (from `emil-design-eng`):**
- Any `Pressable` gets `scale(0.97)`-equivalent feedback on press-down, not on release.
- Nothing enters animated from scale `0` — start from `~0.95` + opacity `0`, never fully collapsed.
- Sheets/popovers anchor their animation origin to their trigger where feasible; full-screen modals stay centered.
- Animate only `transform`/`opacity`-equivalent Reanimated shared values — avoid animating layout properties directly.

**Materials/depth (from `apple-design`):** translucent chrome (nav bars, sheets) uses `expo-blur`'s `BlurView`, not a flat semi-transparent color — content should read as scrolling under a real material. Modal tasks get a dimming scrim; non-blocking panels use translucency/offset without one.

**Reduced motion:** every custom animation must have a reduced-motion fallback (cross-fade instead of slide/spring, no overshoot) — check via Reanimated's `useReducedMotion`/`AccessibilityInfo`, not skipped as an edge case.

**Explicitly not adopted yet:** CSS-specific mechanisms from `emil-design-eng` (`clip-path`, `backdrop-filter`, `@starting-style`, WAAPI) have no direct RN equivalent. If a specific screen genuinely needs a masked-reveal or comparison-slider-style effect, evaluate `react-native-skia` for it then — not scaffolded speculatively ahead of a real need.

**Review format:** when reviewing any animation-touching diff, use `emil-design-eng`'s Before/After/Why table format rather than prose bullets.

## 3. Component inventory

Per component: states (default/pressed/disabled/loading/error), variants, and where it's used. Starting list to define once screens are scoped:

- Button
- Amount input (numeric keypad entry)
- Text input
- Transaction row / list
- Status badge (pending/success/failed)
- Avatar / identity summary
- Bottom sheet
- Empty state
- Toast / inline error

## 4. Copy voice

Tone, terminology (e.g. "send" vs "transfer" vs "pay"), how money/fees/errors get described. Fintech copy should be calm, precise, and always state exactly what happens to the user's money — no ambiguity.

## 5. Screen inventory

Filled in once the product surface is scoped (mirrors backend phases: wallet balance, P2P transfers, money requests, transaction history, etc.)
