# Workflow: Dependency Update

Use this workflow to check for outdated packages, resolve security vulnerabilities, apply
safe updates, and create a pull request. Run this on a regular schedule (weekly or per-sprint)
or whenever a security alert is received.

---

## Overview

```
Trigger (schedule / security alert / human request)
              │
              ▼
   Dependency Updater ──── Audit packages, apply safe updates, produce report
              │
              ▼
   dependency-update-report.md created ──── Full before/after table
              │
              ▼
   PR created on remote ──── Patch + minor updates applied, major deferred
              │
              ▼
   Project Manager ──────── Routes major-version decisions to Human
              │
              ▼
        Human ─────────────── Reviews PR + approves/rejects major updates
              │
              ▼
   Developer (if needed) ─── Applies major updates after human approval
```

---

## When to Run

- **Weekly** (recommended): Catch minor updates and security patches before they accumulate
- **On security alert**: CVE notification for a direct dependency — run immediately
- **Before a major release**: Ensure dependencies are current before shipping
- **After a long dormancy**: Project that hasn't been updated in months

---

## Step-by-Step

### Step 1 — Trigger

The workflow can be triggered by:
- A human request ("check for outdated packages")
- A scheduled job (weekly CI task)
- A security alert from GitHub Dependabot, Snyk, or similar tool

The PM or human specifies the **update scope**:
- `Security-only` — patch CVEs only
- `Patch+Minor` (default) — all patch and minor updates
- `Full` — include major updates (requires explicit human decision for each)

---

### Step 2 — Dependency Updater: Audit and Update

The Dependency Updater:

1. Runs the security audit (`npm audit --json` / `pip-audit` / `cargo audit` / equivalent)
2. Runs the outdated packages check (`npm outdated` / `pip list --outdated` / equivalent)
3. Applies updates according to the scope:
   - **Security CVEs:** Apply immediately, all severity levels
   - **Patch updates:** Apply automatically
   - **Minor updates:** Apply; note any with significant behavioral changes
   - **Major updates:** Do NOT apply — document and defer to human decision
4. Updates lock files
5. Runs the test suite post-update
6. Produces `dependency-update-report.md`
7. Creates a PR with the report summary as description

**Gate:** Tests must pass post-update. If tests fail, the PR is created but marked
"DO NOT MERGE — tests failing" and the failures are documented in the report.

**Handoff to:** Project Manager

---

### Step 3 — Project Manager: Route Major Update Decisions

The PM reviews the report and:

1. Confirms the PR is created and the report is complete
2. For any **major updates listed as deferred**, presents them to the human for a decision:
   - Package name and version jump
   - Summary of breaking changes
   - Risk assessment (is this a direct dependency used heavily in the code?)
   - Recommended action: upgrade now / upgrade in next sprint / hold indefinitely

**Handoff to:** Human (for major update decisions) OR Developer (if major updates are approved)

---

### Step 4 — Human: Review and Decision

The human:

1. Reviews the PR (patch/minor updates)
2. Reviews major update proposals from the PM
3. Decides on each major update:
   - **Approve for this sprint:** Developer applies and tests
   - **Defer to next sprint:** PM logs in backlog
   - **Hold indefinitely:** PM notes the reason (e.g., breaking API the team relies on)
4. Merges or approves the PR

---

### Step 5 — Developer (if major updates approved)

If the human approves one or more major updates:

1. Developer applies the major version update(s) in a separate branch or adds to the existing PR
2. Reviews the library's migration guide / CHANGELOG for breaking changes
3. Updates any code that uses changed APIs
4. Runs the full test suite
5. Notes any manual testing areas in the PR description
6. Re-submits to QA if the changes affect user-facing behavior

---

## Scheduling Recommendation

For ongoing projects, configure a weekly CI job:

```yaml
# .github/workflows/dependency-check.yml
name: Weekly Dependency Update
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 09:00 UTC
  workflow_dispatch:       # Allow manual trigger

jobs:
  dependency-update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run npm audit
        run: npm audit --json > audit-results.json || true
      - name: Run npm outdated
        run: npm outdated --json > outdated-results.json || true
      # Dependency Updater agent reads these outputs and creates the PR
```

---

## Artifacts Produced

| Artifact | Location | Owner |
|---|---|---|
| `dependency-update-report.md` | Project root or `docs/` | Dependency Updater |
| Updated manifest files | `package.json` / `pyproject.toml` / etc. | Dependency Updater |
| Updated lock files | `package-lock.json` / `poetry.lock` / etc. | Dependency Updater |
| Pull Request | Remote repository | Dependency Updater |

---

## Update Policy Summary

| Update Type | Rule | Who decides |
|---|---|---|
| Security patch (any CVE) | Always apply | Dependency Updater (automatic) |
| Patch version (x.y.Z) | Always apply | Dependency Updater (automatic) |
| Minor version (x.Y.z) | Apply with test verification | Dependency Updater (automatic) |
| Major version (X.y.z) | Defer; human decision required | Human |
| Pinned / exact version | Never update | Developer (explicit instruction only) |

---

## Escalation Paths

| Situation | Action |
|---|---|
| Critical CVE with no available fix | PM escalates to Human immediately; may require workaround or code change |
| Tests fail after patch/minor update | PR marked DO NOT MERGE; Developer investigates root cause |
| Major update has been deferred >3 sprints | PM flags to Human for forced decision |
| Conflicting peer dependencies block update | Developer resolves manually; documents the conflict |
| Lock file cannot be updated cleanly | Developer resolves conflict; Dependency Updater documents the issue |
