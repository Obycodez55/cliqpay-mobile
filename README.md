# Cliqpay Mobile

React Native (Expo) client for Cliqpay, a peer-to-peer wallet platform for Africa (Nigeria first). Talks to the [`cliqpay`](../cliqpay) backend's API only — no direct database or payment-provider access.

**Status:** scaffolding only. No screens, design system, or data layer have been built yet — design and planning come first. See [docs/design-system.md](docs/design-system.md) and [docs/conventions.md](docs/conventions.md).

## Stack

- Expo (TypeScript template) + Expo Router (file-based navigation)
- `react-native-reanimated` + `react-native-gesture-handler` for animation
- TanStack Query (server state) + Zustand (minimal local/global UI state) — see [docs/conventions.md](docs/conventions.md)
- EAS for builds

## Getting started

```bash
npm install
npx expo start
```

## Project structure

```
src/
├── app/          expo-router routes (thin — compose from features/)
├── features/     one folder per product domain (wallet, transfers, requests, auth)
├── components/   shared, domain-agnostic UI primitives
├── lib/          API client, secure storage, query client setup
├── constants/    design tokens (colors, spacing, motion)
└── hooks/        shared hooks
docs/
├── design-system.md   visual/motion language (placeholder — not yet defined)
├── conventions.md      structure, state management, naming conventions
└── adr/                 architecture decision records
```

See [docs/conventions.md](docs/conventions.md) for the full rationale behind this layout.
