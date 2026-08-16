@AGENTS.md

# Cliqpay Mobile

React Native (Expo) client for Cliqpay, a peer-to-peer wallet platform for Africa (Nigeria first). Consumes the `cliqpay` backend's API only — never talks to a database or payment provider directly. This repo is currently **scaffolding only**: no screens, design system, or data-layer decisions have been implemented yet. Design and planning come before implementation — see `docs/design-system.md` (not yet filled in) and confirm a plan with the user before writing feature code.

See [docs/conventions.md](docs/conventions.md) for project structure and state-management patterns, and [docs/design-system.md](docs/design-system.md) for the (currently placeholder) visual/motion language.

## Git — hard rules

- **Never put my (Claude's) name anywhere** — not in commit authorship, not in commit messages, not in code comments, not in docs. No `Co-Authored-By: Claude`, no attribution lines.
- **Never commit without the user reviewing the diff first.** Stage and prepare changes, show what would be committed, and wait for explicit go-ahead before running `git commit`. This applies every time, not just once per session.
- Never push, force-push, or amend published commits without explicit instruction.

## Workflow

- **Present a plan before implementing anything non-trivial or structural** — new dependencies, restructuring folders, a new architectural pattern, or any screen/feature work. Lay out the approach and wait for explicit go-ahead before writing code.
- Design work (tokens, component inventory, motion, copy) is planned and agreed before it's implemented — don't jump from "reference apps we like" straight to code.

## General conventions

- Don't add abstractions, error handling, or config beyond what's actually needed yet — this app builds incrementally alongside the backend's phases, not ahead of them.
- Minimal comments — only where the *why* isn't obvious from the code.
