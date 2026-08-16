# Phase implementation playbook

Adapted from the `cliqpay` backend's own playbook — same shape, adjusted for a client app instead of a server. This is a workflow doc, not a design doc — for what's being built each phase, see [roadmap.md](roadmap.md); for decisions already made, see `docs/adr/`.

## 1. Design the phase before writing issues

For each phase, work out the actual screens, flows, states (loading/empty/error), and copy before anything becomes an issue. Stress-test edge cases the same way the backend playbook stress-tests numbers: what does this screen look like with zero transactions, with a name too long for the layout, when the request times out, when the user backgrounds the app mid-flow?

**Take note of:** a screen "existing in the design doc" isn't the same as its states being decided. `docs/design-system.md` documents the target visual language, not every screen's specific copy/state handling — that gets decided here, per phase, same distinction the backend draws between `architecture.md` and per-phase number-pinning.

## 2. Break the design into vertical-slice issues

One issue per full flow (e.g. "register end-to-end," "send money end-to-end"), not per layer (not "all screens" then "all API hookups"). A vertical slice is independently reviewable and shippable — a horizontal layer isn't.

**Take note of:** confirm the breakdown with the user before publishing issues, same as the backend. Cheap to adjust before any issue is implemented, expensive after.

## 3. Implement one issue at a time, in a separate session

Use `spawn_task` per issue. Each vertical-slice issue ships its own Maestro flow (`.maestro/<flow-name>.yaml`) alongside the screen/logic code, not as separate follow-up work — the flow is part of what "done" means for that issue, the same way the backend treats a phase's concurrency tests as gating rather than follow-up. Once a task reports back, review the actual diff — not just its summary — before merging. Never commit without the user's explicit go-ahead on that diff, every time (see `CLAUDE.md`). Close the GitHub issue only after the user has approved the review, with a short comment on what shipped.

## 4. Watch for smells mid-phase — don't push through them

Same process as the backend: name the smell precisely, think through real alternatives (not just the first fix), write an ADR if it's a real architectural decision, fold the fix into whichever in-flight work it touches rather than a disconnected cleanup pass.

## 5. Verify against the real backend — Maestro + Simulator

Mobile's equivalent of `/e2e-test-local`: once a phase's issues are merged, run every phase's Maestro flows together against the running `cliqpay` backend (not a mock) in the Simulator, plus a manual pass for anything a scripted flow can't easily assert (visual polish, motion feel, real-device-shaped edge cases). Use the `Claude_Code_iOS_Simulator` tooling for the manual half — attach the panel, drive the flow, screenshot the result.

**Take note of:**
- Prefer the backend's `fake` provider adapters for this pass unless real Kora sandbox credentials are already wired up — don't block verification on third-party sandbox setup. Disclose any skip explicitly.
- Check both the golden path and realistic edge cases (poor network simulation, backgrounding mid-request, a stale token) — not just "did the happy path render." Encode as many of these as practical as actual Maestro assertions, not just something checked by eye once and forgotten.
- Maestro flows are the regression safety net for every *previous* phase too — always run the full accumulated flow suite, not just the current phase's new flows, so Phase 3 work can't silently break Phase 1's login flow.

## 6. Fix real findings, ranked by severity

Same as the backend: correctness and broken-flow findings first, hands-on, verified again in the simulator after the fix — not just re-read.

## 7. Housekeeping pass before calling the phase done

- **Comment noise** — same bar as the backend: most methods should have zero comments; delete any that just restate the code or point at an issue number instead of stating the *why* inline.
- **Documentation drift** — check that real decisions made mid-phase (a state-management pattern, a folder convention, a component API shape) actually landed in `docs/conventions.md` or an ADR, not just in a merged PR.
- **Design-system drift** — check that any token/component adjustments made while building real screens (a spacing value that didn't feel right, a motion timing that got tuned) made it back into `docs/design-system.md`. The design system is supposed to be the source of truth going forward, not the screens that happened to get built first.

## Summary checklist

1. Design the phase's screens/flows/states/copy → confirm with the user.
2. Break into vertical-slice issues → confirm the breakdown before publishing.
3. Per issue: `spawn_task` (ships its own Maestro flow with the code) → review the actual diff → merge only with explicit go-ahead → close the issue → next issue.
4. Mid-phase smell? Stop, think through alternatives, ADR if real, fold into in-flight work.
5. Verify: run the full accumulated Maestro suite against the real backend, plus a manual Simulator pass for anything scripted assertions can't catch — golden path + edge cases.
6. Fix real findings, most severe first, re-verify via Maestro + simulator.
7. Housekeeping: comment noise, documentation drift, design-system drift.
