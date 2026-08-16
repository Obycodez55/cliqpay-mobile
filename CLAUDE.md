@AGENTS.md

# Cliqpay Mobile

React Native (Expo) client for Cliqpay, a peer-to-peer wallet platform for Africa (Nigeria first). Consumes the `cliqpay` backend's API only — never talks to a database or payment provider directly.

**Phase 0 (design foundations) is complete** — see [docs/roadmap.md](docs/roadmap.md) for the phase plan and current status. Design tokens, motion principles, and a core component set (`src/components/`: Button, TextInput, AmountInput, Avatar, StatusBadge, TransactionRow, BottomSheet, Toast, EmptyState) are decided and built — see [docs/design-system.md](docs/design-system.md), verified live in both iOS Simulator and Android Emulator, both themes. No real screens exist yet; Phase 1 (auth & identity) is next. Still design-then-build for anything new: confirm a plan with the user before writing feature code, same as before.

See [docs/conventions.md](docs/conventions.md) for project structure, state-management patterns, and the local dev environment (Simulator/Emulator/Maestro setup already done on this machine — check there before reinstalling anything).

## The backend repo

The `cliqpay` backend lives at `../cliqpay` (sibling directory, same parent as this repo) — read it directly, don't rely on this repo's own docs as a substitute for it. `roadmap.md` and `phase-playbook.md` describe the backend's phases in prose, but that prose can drift out of date; the backend's own `docs/architecture.md`, `docs/adr/`, and its actual controller/DTO source are the source of truth for what's live and what shape it's in. Before designing any screen or form against a backend endpoint, check the real thing, not this repo's summary of it.

The backend also serves live OpenAPI docs when its dev server is running: raw spec at `/doc`, a browsable UI at `/reference`. Use these to confirm exact request/response shapes, or as the source for generating a typed client (see [docs/conventions.md](docs/conventions.md)) — don't hand-write types against a guess.

## Git — hard rules

- **Never put my (Claude's) name anywhere** — not in commit authorship, not in commit messages, not in code comments, not in docs. No `Co-Authored-By: Claude`, no attribution lines.
- **Never commit without the user reviewing the diff first.** Stage and prepare changes, show what would be committed, and wait for explicit go-ahead before running `git commit`. This applies every time, not just once per session.
- Never push, force-push, or amend published commits without explicit instruction.

## Workflow

- **Present a plan before implementing anything non-trivial or structural** — new dependencies, restructuring folders, a new architectural pattern, or any screen/feature work. Lay out the approach and wait for explicit go-ahead before writing code.
- Design work (tokens, component inventory, motion, copy) is planned and agreed before it's implemented — don't jump from "reference apps we like" straight to code.
- **Load the `apple-design` and `emil-design-eng` skills before building or reviewing any animated/interactive component.** Both are written CSS/web-first — translate their principles to Reanimated/Gesture Handler rather than copying CSS syntax verbatim; see [docs/design-system.md](docs/design-system.md) §2 for the RN translation already worked out.

## General conventions

- Don't add abstractions, error handling, or config beyond what's actually needed yet — this app builds incrementally alongside the backend's phases, not ahead of them.
- Minimal comments — only where the *why* isn't obvious from the code.
