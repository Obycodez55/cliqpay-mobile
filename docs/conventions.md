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

- The NestJS backend (`cliqpay` repo, sibling directory at `../cliqpay` — see `CLAUDE.md`) is the only source of truth. This app never talks to Postgres, Kora, or any provider directly.
- The backend already serves a live OpenAPI spec (raw JSON at `/doc`, browsable at `/reference`, when its dev server is running) with every controller tagged/documented. Generate a typed client from that spec rather than hand-writing request/response types that can drift — the tooling choice (e.g. `openapi-typescript`) is still open, but the source of truth for the shape is the running spec, not a summary of it.
- Auth tokens stored via `expo-secure-store`, never `AsyncStorage` — this is a wallet app.

## Motion

- `react-native-reanimated` + `react-native-gesture-handler` (already in the scaffold) for all non-trivial animation. Spring-based, not timing-based, as the default — see `docs/design-system.md` §2 once motion primitives are defined, and the `apple-design` skill for the underlying philosophy.

## Naming

- Files: kebab-case (matches the Expo scaffold's existing convention — `themed-text.tsx`, `use-color-scheme.ts`).
- Components: PascalCase exports from kebab-case files.

## Running E2E tests

- [Maestro](https://maestro.mobile.dev/) — YAML flow scripts, runs against the Simulator, no native build config needed. See `docs/roadmap.md` (Phase 0) for why it was picked over Detox.
- Flows live in `.maestro/` at the repo root, one `.yaml` file per flow.
- To run a flow locally: start the dev server (`npx expo start`), then `maestro test .maestro/<flow>.yaml`.
- The project has no native `ios`/`android` folders or bundle identifiers configured yet, so flows target the app through Expo Go rather than `launchApp` with a custom `appId`: `appId: host.exp.Exponent`, then `openLink` to the dev server's `exp://` URL. Switch to a real `appId` once the app has a dev client / native build.
- Convention (per `docs/phase-playbook.md` step 3): every vertical-slice issue from Phase 1 onward ships its own `.maestro/<flow-name>.yaml` alongside the feature's screens/logic, not as separate follow-up work — the flow is part of what "done" means for that issue. `.maestro/smoke-app-launches.yaml` is the one throwaway exception, added in Phase 0 to prove the toolchain works before any real screens exist.
