# Cliqpay Mobile — Roadmap

Mobile phases mirror the `cliqpay` backend's phases in order — a mobile phase doesn't start until its backend counterpart is actually live, same "build incrementally" rule the backend holds itself to. See the backend's `docs/architecture.md` §6 for the full backend phase list (through Phase 11); only Phases 1-3 are built there so far, so only those are scoped below.

Process for running each phase: [phase-playbook.md](phase-playbook.md).

## Phase 0 — Design foundations

**Status: complete.** Shipped as GitHub issues #1-#6 (theme provider/tokens, input components, display components, overlay components, Maestro setup, demo screen). See `docs/design-system.md` §3 for the built component inventory. Phase 1 is next.

**Goal:** A settled visual/motion language and a small set of verified core components, before any real screen gets built on top of them. No backend dependency.

- Resolve the open forks from [design-research.md](design-research.md): light-first vs. dark-navy-primary theme, type scale, color tokens (including semantic tokens: success/error/warning, balance-positive/negative), spacing scale, motion primitives (spring configs, not raw durations)
- Core component set, built and visually verified in the Simulator against light + dark: Button (variants/states), Text input, Amount input (numeric keypad entry), Transaction row, Status badge, Avatar, Bottom sheet, Empty state, Toast/inline error
- Copy voice guide — tone and terminology decisions from `design-system.md` §4, applied to at least the core components' own microcopy (button labels, error strings, empty-state text)
- **E2E testing setup — [Maestro](https://maestro.mobile.dev/)**, chosen over Detox for this team's size: YAML flow scripts, runs against the Simulator, no native build config needed, easiest to keep in sync with Expo as screens change. Set up the toolchain and one throwaway smoke-test flow (e.g. "app launches, renders the Phase 0 demo screen") — real per-flow `.yaml` scripts get added per phase from Phase 1 onward, one per vertical-slice issue, alongside that issue's implementation rather than bolted on afterward
- Exit criteria: `docs/design-system.md` fully filled in (no more "not yet defined" placeholders), core components demoed in a throwaway screen in the Simulator, Maestro installed and running its smoke-test flow in CI or locally

## Phase 1 — Auth & identity

**Maps to:** backend Phase 1 (Foundation)

**Goal:** A user can register, verify, log in, and see their wallet. No money moves yet.

Screens/flows:
- Onboarding (value prop, not account-specific)
- Register (confirm the exact request/response shape against the backend's live spec — `/doc` or `/reference` on the running `cliqpay` dev server — before designing the form, not against this doc's guess)
- Email verification (code entry)
- Login
- MFA challenge (email mandatory per backend; TOTP if enrolled)
- Password reset
- Logout
- Home / wallet balance (read-only — balance display only, no funding/send actions yet since Phases 2-3 aren't built)
- Profile (view own identity summary)

Depends on backend: `auth` module (register/login/logout/refresh, email verification, MFA challenge/verify), `users` module (profile, wallet auto-creation, balance endpoint).

## Phase 2 — Wallet funding

**Maps to:** backend Phase 2 (Wallet Funding)

**Goal:** A user can fund their wallet via Kora and see it reflected.

Screens/flows:
- Add money (amount entry → Kora checkout handoff, likely a WebView or in-app browser flow — check the backend's `payments` module / `KoraAdapter` source at `../cliqpay` for what the initialization endpoint actually returns before deciding the handoff shape)
- Funding pending/result states (success, failed, still-processing — Kora funding is webhook-driven, so the client needs an honest "we're waiting to hear back" state, not just optimistic success)
- Transaction history (paginated list, funding transactions only at this point)
- Transaction detail (single funding transaction)

Depends on backend: `payments` module (Kora payment initialization), transaction history endpoint.

## Phase 3 — P2P transfers

**Maps to:** backend Phase 3 (P2P Transfers)

**Goal:** A user can send money, request money, and manage their transaction PIN.

Screens/flows:
- Transaction PIN setup (first-time, gates money-moving actions)
- Transaction PIN entry (re-auth moment before any send)
- Transaction PIN change/reset (behind step-up MFA per backend)
- Recipient lookup (by username or email — confirm before committing, per backend's ADR-0009 design)
- Send money (recipient → amount → confirm → PIN → result) — this is the flow our reference-app research (avatar/recent-contacts → big-numeral amount + keypad → single CTA) applies most directly to
- Request money — create (amount + optional note), list (sent/received, with status: pending/paid/declined/cancelled/expired), cancel, decline
- Transaction history — sent/received correctly distinguished (extends Phase 2's history screen rather than a separate one)
- In-app notifications — list, unread count, mark-read (backend's fourth notification channel, per ADR-0013)

Depends on backend: `transfers` module (send, money requests), transaction PIN endpoints, recipient lookup, `notifications` module's in-app channel.

## Not yet scoped

Phases 4 (Withdrawal) through 11 (Fraud Hardening) aren't scoped on mobile because they aren't live on the backend yet. When a backend phase ships, its mobile counterpart gets designed the same way — read the backend's `architecture.md` §6 entry for that phase, then run this repo's `phase-playbook.md` against it.
