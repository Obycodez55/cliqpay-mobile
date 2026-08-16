# ADR-0001: Record architecture decisions as ADRs

**Status:** accepted
**Date:** 2026-08-16

## Context

This repo is starting from scaffolding only — no design system, no screens, no data layer decisions made yet. As those get decided (state management choice, navigation structure, API client shape, design token system), we need a record of *why*, not just what's currently in place. `docs/design-system.md` and `docs/conventions.md` are living references for current-state decisions; they'll get edited in place as understanding changes and won't preserve the reasoning behind superseded choices.

## Decision

Use the same lightweight ADR format as the `cliqpay` backend repo (adapted from Michael Nygard's) for any non-trivial decision going forward — architecture, design-system direction changes, or reversals. Use [template.md](template.md) as the starting point, numbered sequentially.

## Alternatives considered

- **No ADRs, just edit the living docs** — rejected for the same reason as the backend: in-place edits lose the record of what was tried and rejected.
- **Share one ADR sequence across both repos** — rejected; the two projects have independent decision histories and this repo may outlive or diverge from the backend's numbering.

## Consequences

Every future non-trivial decision in this repo gets a short paper trail. Adds a small amount of process, consistent with how the backend repo already works.
