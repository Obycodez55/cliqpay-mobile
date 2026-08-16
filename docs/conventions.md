# Cliqpay Mobile — Conventions

Decisions about *how* we build, not *what* we build. Update this in place as real patterns get established — treat anything not listed here as undecided, not "obviously whatever's common in RN."

## Project structure

- `src/app/` — expo-router routes only. Screens stay thin: compose from `src/features/`, no business logic inline.
- `src/features/<domain>/` — one folder per product domain (e.g. `wallet/`, `transfers/`, `requests/`, `auth/`). Each holds its own screens' logic, hooks, and API calls. A feature folder is the unit of ownership — if it's specific to one domain, it lives there, not in `src/components/` or `src/lib/`.
- `src/components/` — shared, domain-agnostic UI primitives only (Button, Input, etc.). If a component only makes sense in one feature, it belongs in that feature folder instead.
- `src/lib/` — cross-cutting infrastructure: API client, secure storage wrapper, query client setup. Not a dumping ground for anything that doesn't fit elsewhere — if it's growing past a handful of files, it's probably hiding a feature.
- `src/constants/` — design tokens (colors, spacing, motion) once `docs/design-system.md` defines them.

## State management

- **Server state:** TanStack Query. All API reads/writes go through query/mutation hooks in the relevant feature folder — no ad-hoc `useEffect` + `fetch`.
- **Local/UI state:** Zustand, used sparingly — only for state that's genuinely global (auth session, active theme). Screen-local state stays as `useState`/`useReducer` in the component.

## API layer

- The NestJS backend (`cliqpay` repo) is the only source of truth. This app never talks to Postgres, Kora, or any provider directly.
- Typed client generated from the backend's OpenAPI spec where possible, rather than hand-written request/response types that can drift.
- Auth tokens stored via `expo-secure-store`, never `AsyncStorage` — this is a wallet app.

## Motion

- `react-native-reanimated` + `react-native-gesture-handler` (already in the scaffold) for all non-trivial animation. Spring-based, not timing-based, as the default — see `docs/design-system.md` §2 once motion primitives are defined, and the `apple-design` skill for the underlying philosophy.

## Naming

- Files: kebab-case (matches the Expo scaffold's existing convention — `themed-text.tsx`, `use-color-scheme.ts`).
- Components: PascalCase exports from kebab-case files.
