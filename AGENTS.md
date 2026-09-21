# KTL Fork Workspace (scratch — upstream PRs only)

- This is NOT the live KTL. KTL local mode serves `C:\code\Lib\KTL` (which has its own CLAUDE.md). Edits here never affect Knack apps.
- Scratch clone of fork `ivojolo/Knack-Toolkit-Library` (origin) for preparing upstream PRs.
- Dormant since the 2026-05-12 pre-wipe snapshot, parked on `fix/search-filter-handler`. Run `git status` and confirm the branch before resuming any work.
- Do NOT run this repo's `FileServer.bat`. The real port-3000 dev server belongs to the live setup and must stay untouched.

## Engineering standard

Optimize for the best outcome, not the least effort. When making a technical decision, don't let development cost, effort, or token budget push you toward a worse solution: if the right approach is harder or longer, take it and see it through. Match complexity to the actual problem and prefer robustness and long-term maintainability, without over-engineering or adding unrequested scope.

## Deleting records or data

Never from a filter or query, never in the same run as anything else, never test data by default. Print the exact
ids, save a before-state (the items AND whatever links to them from the other side), get Ivan's approval, then delete
in a separate run and verify by an independent path. Canonical rule: `C:\code\AGENTS.md` "Deleting records or data".
Knack addendum and the enforcing tool (`safe-delete-records.js`): `C:\code\KnackApps\AGENTS.md`.
Origin: Belmont CRM incident 2026-09-17, 48 records lost to a silently ignored filter.
