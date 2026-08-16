# Cliqpay Mobile — Conventions

Decisions about *how* we build, not *what* we build. Update this in place as real patterns get established — treat anything not listed here as undecided, not "obviously whatever's common in RN."

## Project structure

- `src/app/` — expo-router routes only. Screens stay thin: compose from `src/features/`, no business logic inline.
- `src/features/<domain>/` — one folder per product domain (e.g. `wallet/`, `transfers/`, `requests/`, `auth/`). Each holds its own screens' logic, hooks, and API calls. A feature folder is the unit of ownership — if it's specific to one domain, it lives there, not in `src/components/` or `src/lib/`.
- `src/components/` — shared, domain-agnostic UI primitives only (Button, Input, etc.). If a component only makes sense in one feature, it belongs in that feature folder instead.
- `src/lib/` — cross-cutting infrastructure: API client, secure storage wrapper, query client setup. Not a dumping ground for anything that doesn't fit elsewhere — if it's growing past a handful of files, it's probably hiding a feature.
- `src/constants/` — design tokens (colors, spacing, motion), per `docs/design-system.md` §1.

## State management

- **Server state:** TanStack Query. All API reads/writes go through query/mutation hooks in the relevant feature folder — no ad-hoc `useEffect` + `fetch`.
- **Local/UI state:** Zustand, used sparingly — only for state that's genuinely global (auth session, active theme). Screen-local state stays as `useState`/`useReducer` in the component.

## API layer

- The NestJS backend (`cliqpay` repo, sibling directory at `../cliqpay` — see `CLAUDE.md`) is the only source of truth. This app never talks to Postgres, Kora, or any provider directly.
- The backend already serves a live OpenAPI spec (raw JSON at `/doc`, browsable at `/reference`, when its dev server is running) with every controller tagged/documented. Generate a typed client from that spec rather than hand-writing request/response types that can drift — the tooling choice (e.g. `openapi-typescript`) is still open, but the source of truth for the shape is the running spec, not a summary of it.
- Auth tokens stored via `expo-secure-store`, never `AsyncStorage` — this is a wallet app.

## Motion

- `react-native-reanimated` + `react-native-gesture-handler` (already in the scaffold) for all non-trivial animation. Spring-based, not timing-based, as the default — see `docs/design-system.md` §2 for the concrete defaults, and the `apple-design` skill for the underlying philosophy.

## Naming

- Files: kebab-case (matches the Expo scaffold's existing convention — `themed-text.tsx`, `use-color-scheme.ts`).
- Components: PascalCase exports from kebab-case files.

## Local dev environment

State of this specific machine as of Phase 0 — check here before reinstalling anything:

- **iOS**: Xcode + a real Simulator runtime (iOS 26.4) are installed. Any booted Simulator works; the Simulator tool's `attach` action finds it.
- **Android**: no Android Studio (its first-run setup needs an interactive GUI wizard nothing here can drive) — instead, just the pieces that give a working `adb`/`emulator`, installed via Homebrew:
  - JDK: `brew install openjdk` (non-cask formula, no `sudo` — the cask `temurin` needs `sudo` and will fail non-interactively) at `/opt/homebrew/opt/openjdk`
  - Android SDK command-line tools: `brew install --cask android-commandlinetools` at `/opt/homebrew/share/android-commandlinetools` (`ANDROID_HOME`)
  - `platform-tools`, `emulator`, `platforms;android-35`, and `system-images;android-35;google_apis;arm64-v8a` installed via that SDK's `sdkmanager` — the system image is a ~1.7GB download that `sdkmanager`'s own downloader stalls on unreliably; a direct `curl -L -C -` (resumable) to `dl.google.com/android/repository/sys-img/google_apis/arm64-v8a-35_r09.zip`, unzipped into place, worked when `sdkmanager` didn't
  - An AVD named `Cliqpay_Pixel` (Pixel 7, the above system image) already exists — `emulator -avd Cliqpay_Pixel` boots it, no need to `avdmanager create` again
  - `JAVA_HOME`/`ANDROID_HOME` and their `bin` dirs are exported in `~/.zshrc` — a fresh shell should already have `java`/`adb`/`emulator`/`sdkmanager`/`avdmanager` on `PATH`
- **Maestro**: installed via its own official installer (`get.maestro.mobile.dev`) to `~/.maestro/bin`, which self-added to `~/.zshrc`/`~/.bash_profile`. Needs `java` on `PATH` to run (see above).
- Both platforms' Expo Go client get fetched and installed automatically by `npx expo start --ios` / `--android` — no manual APK/build wrangling needed, but the client only supports the project's exact SDK version (57), so a public/cached Expo Go APK downloaded another way may not match.

## Running E2E tests

- [Maestro](https://maestro.mobile.dev/) — YAML flow scripts, runs against the Simulator, no native build config needed. See `docs/roadmap.md` (Phase 0) for why it was picked over Detox.
- Flows live in `.maestro/` at the repo root, one `.yaml` file per flow.
- To run a flow locally: start the dev server (`npx expo start`), then `maestro test .maestro/<flow>.yaml`.
- The project has no native `ios`/`android` folders or bundle identifiers configured yet, so flows target the app through Expo Go rather than `launchApp` with a custom `appId`: `appId: host.exp.Exponent`, then `openLink` to the dev server's `exp://` URL. Switch to a real `appId` once the app has a dev client / native build.
- Convention (per `docs/phase-playbook.md` step 3): every vertical-slice issue from Phase 1 onward ships its own `.maestro/<flow-name>.yaml` alongside the feature's screens/logic, not as separate follow-up work — the flow is part of what "done" means for that issue. `.maestro/smoke-app-launches.yaml` is the one throwaway exception, added in Phase 0 to prove the toolchain works before any real screens exist.
