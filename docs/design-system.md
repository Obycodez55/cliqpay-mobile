# Cliqpay Mobile — Design System

**Status: not yet defined.** This repo is scaffolding only — no visual design or motion language has been decided. This file is the placeholder structure for when that work happens; do not treat any section below as settled until it has real values and a rationale.

Sections will fill in during the design phase, informed by reference apps (Cash App, Revolut, Wise, Kuda, Opay, PalmPay, Moniepoint, Apple Wallet/Pay) and Apple's motion/HIG principles — see the `apple-design` skill for the motion vocabulary this will likely draw from.

## 1. Foundations

- **Color** — palette, light/dark theming strategy, semantic tokens (success/error/warning, balance-positive/negative, etc.)
- **Typography** — type scale, font choice, weight usage
- **Spacing** — spacing scale, layout grid
- **Iconography** — icon set/style, sizing rules

## 2. Motion

- Timing/easing primitives (spring configs, not raw durations — see Reanimated usage conventions in [conventions.md](conventions.md))
- Which interactions get motion and which stay static (restraint rules)
- Gesture-driven patterns (sheets, swipe actions, pull-to-refresh)

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
