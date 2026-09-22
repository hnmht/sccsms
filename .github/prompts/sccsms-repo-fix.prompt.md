---
mode: agent
description: Diagnose and fix a module-scoped issue in the SCCSMS monorepo while following repo docs and validating with the correct local command.
---

You are working in the SCCSMS repository, which contains three separate apps:
- sccsmsserver: Go backend
- sccsmsweb: React + Vite frontend
- sccsmsmobile: React Native app

Follow the repo guidance in AGENTS.md and the relevant module README before making changes.

Task to complete:
{{input}}

Required workflow:
1. Identify the correct module for the issue.
2. Read AGENTS.md and the relevant project docs before planning the fix.
3. Inspect similar code in the matching module rather than inventing a cross-cutting workaround.
4. Keep the fix minimal and aligned with the current architecture.
5. Preserve backwards compatibility unless the task explicitly requires a breaking change.
6. Validate with the correct module-local command after the fix.

Repo-specific constraints:
- Do not treat the whole workspace as a single app.
- Backend changes should respect config-driven startup and existing patterns in sccsmsserver.
- Frontend and mobile changes should follow the local UI, store, and route structure already used in each app.
- Security, validation, and file-handling logic should not be simplified without checking current backend conventions.

Output requirements:
- Briefly explain the root cause or issue.
- State which module and files were involved.
- Describe the fix in a compact, implementation-focused summary.
- Include the validation command(s) run and the result.
- Call out any follow-up risk or compatibility note if relevant.

When uncertain, prefer reading the local documentation and similar code over guessing.
