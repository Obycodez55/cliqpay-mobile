# Cliqpay Mobile — Design System

**Status: not yet defined.** This repo is scaffolding only — no visual design or motion language has been decided. This file is the placeholder structure for when that work happens; do not treat any section below as settled until it has real values and a rationale.

Sections will fill in during the design phase, informed by reference apps (Cash App, Revolut, Wise, Kuda, Opay, PalmPay, Moniepoint, Apple Wallet/Pay — see [design-research.md](design-research.md)) and the `apple-design` + `emil-design-eng` skills for motion/interaction principles (§2).

## 1. Foundations

- **Color** — palette, light/dark theming strategy, semantic tokens (success/error/warning, balance-positive/negative, etc.)
- **Typography** — type scale, font choice, weight usage
- **Spacing** — spacing scale, layout grid
- **Iconography** — icon set/style, sizing rules

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
