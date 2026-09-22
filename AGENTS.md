# AGENTS.md

This repository is a multi-project system for construction-site operations and worker safety workflows. Keep changes scoped to the correct module and prefer the project-local docs before inventing new patterns.

## Repository map

- [README.md](README.md) — project overview, installation, demo environment, and architecture overview.
- [document/architectureAndDirectory.md](document/architectureAndDirectory.md) — module boundaries and repo layout.
- [sccsmsserver/README.md](sccsmsserver/README.md) — backend notes.
- [sccsmsweb/README.md](sccsmsweb/README.md) — web app notes.
- [sccsmsmobile/README.md](sccsmsmobile/README.md) — mobile app notes.

## How this repo is organized

This workspace contains three main applications:

- `sccsmsserver` — Go monolithic backend using Gin, PostgreSQL, Redis, S3-compatible object storage, and config-driven startup.
- `sccsmsweb` — React + Vite + MUI front-end.
- `sccsmsmobile` — React Native app for iOS/Android with offline-first behavior.

The backend is the system of record; web and mobile clients communicate with it via API routes and shared data conventions. Keep service contracts and data models consistent across the stack when changing request/response formats.

## Typical commands

Run commands from the relevant module directory, not the repo root:

- Server:
  - `cd sccsmsserver && go run .`
  - `cd sccsmsserver && go test ./...`
- Web:
  - `cd sccsmsweb && npm install`
  - `cd sccsmsweb && npm run dev`
  - `cd sccsmsweb && npm run build`
  - `cd sccsmsweb && npm run lint`
- Mobile:
  - `cd sccsmsmobile && npm install`
  - `cd sccsmsmobile && npm test`
  - `cd sccsmsmobile && npm run start`
  - `cd sccsmsmobile && npm run android`

## Working conventions

- Match the existing architecture: change logic in the relevant module rather than adding cross-cutting workarounds at the root.
- Prefer reading the local README and the architecture document before creating new files, APIs, or data flows.
- The backend is initialized in `sccsmsserver/main.go` with config loading, logger setup, database initialization, cache initialization, object storage setup, and route registration; keep startup ordering intact when editing startup behavior.
- Web and mobile code is feature-oriented and UI-heavy; use the project’s existing Redux/store and route structure instead of introducing a new app-wide pattern.
- Do not assume a single shared frontend framework across modules; the web app and mobile app have separate stacks and dependency sets.
- When changing APIs, preserve compatibility unless the change is intentionally breaking and the related client code is also updated.

## Project-specific pitfalls

- This repo uses multiple independent package managers and runtimes. Do not treat the whole workspace as a single app.
- The mobile app depends on native tooling and patch-package; avoid making broad dependency upgrades without checking the current React Native setup.
- Backend configuration is environment-driven; new settings should align with the existing configuration pattern in the `setting` package rather than hard-coded values.
- Security and file handling are important in this system; do not simplify validation or storage logic without checking the existing backend patterns.

## Before coding

1. Identify the correct module for the work.
2. Read the relevant project docs and similar code in that module.
3. Keep the fix minimal and aligned with current architecture.
4. Validate with the module-local command that matches the changed area.

## Useful references

- [README.md](README.md)
- [document/architectureAndDirectory.md](document/architectureAndDirectory.md)
- [sccsmsserver/README.md](sccsmsserver/README.md)
- [sccsmsweb/README.md](sccsmsweb/README.md)
- [sccsmsmobile/README.md](sccsmsmobile/README.md)
