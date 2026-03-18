# Workflow: Bug Fix

Use this workflow when a defect has been reported in an existing feature,
either by the human, a user, or through monitoring.

---

## Overview

```
Human (bug report) → PM → [Architect if design fix needed] → Developer → QA → DevOps → Human
```

Bug fixes are intentionally leaner than new features. The goal is to fix the specific
defect with minimum scope change. The Architect is only involved if the fix requires
a design or interface change.

---

## Step-by-Step

### Step 1 — Human: Submit the Bug Report

Provide the PM with:

- What happened (actual behavior)
- What was expected to happen
- Steps to reproduce (if known)
- Severity: Critical (system broken) / High (key feature broken) / Medium / Low
- Environment: Production / Staging / Local

The PM will not begin triage until severity is stated.

---

### Step 2 — Project Manager: Triage & Assignment

The PM reads the report and:

1. Confirms the bug is reproducible or requests more information (one question)
2. Determines which developer owns the affected code (Backend / Frontend)
3. Determines whether a design or interface change is needed (if yes, involves Architect)
4. Produces a **Bug Fix Brief** containing:
   - Bug description (restated in PM's words)
   - Reproduction steps (confirmed)
   - Acceptance criterion for the fix ("bug is fixed when…")
   - Owner (Backend Dev, Frontend Dev, or both)
   - Architect involvement: Yes / No

**Gate:** Human confirms the fix acceptance criterion before development begins
(especially for high severity bugs where the fix scope matters).

**Handoff to:** Senior Architect (if design change needed) OR Developer directly

---

### Step 3 — Senior Architect (if required): Design Decision

Only invoked when the bug fix requires:
- A change to an interface contract
- A structural change to the data model
- A change to the authentication or security posture

The Architect produces a focused **Design Amendment** documenting:
- What changes in the design
- Updated interface contracts (if any)
- Risk of the change to existing functionality

**Handoff to:** Developer

---

### Step 4 — Developer: Bug Fix Implementation

The assigned developer:

1. Reproduces the bug locally before writing any code
2. Writes a **regression test** that fails due to the bug (before fixing it)
3. Implements the fix
4. Confirms the regression test now passes
5. Runs the full test suite to check for regressions introduced by the fix
6. Produces a **Bug Fix Implementation Note** containing:
   - Root cause of the bug
   - What was changed and why
   - The regression test added
   - Any related areas that should be re-tested by QA

**Handoff to:** QA Engineer

---

### Step 5 — QA Engineer: Fix Verification

QA:

1. Reproduces the original bug from the PM's reproduction steps (confirms it was real)
2. Verifies the fix resolves the bug
3. Runs regression tests on all areas touched by the fix
4. For Critical/High bugs: runs a targeted smoke test of the broader feature area
5. Produces a **Fix Verification Report** or re-opens the bug if the fix is incomplete

If the bug is not fixed or a regression was introduced:
- File a new/updated Bug Report
- Return to the developer with full details

**Gate:** QA sign-off required before deployment.

**Handoff to:** DevOps Engineer (with sign-off)

---

### Step 6 — DevOps Engineer: Patch Deployment

For Critical/High severity bugs, deployment is treated as an expedited release:

1. Define rollback plan
2. Deploy fix to staging, verify, promote to production
3. Run post-deployment health checks
4. Produce **Deployment Report**

**Gate:** Human go-ahead for production deployment (PM may authorize staging autonomously).

**Handoff to:** Project Manager

---

### Step 7 — Project Manager: Closure

PM confirms the fix is live, verifies the original acceptance criterion is met,
and delivers a **Bug Fix Closure Summary** to the human:

- Bug description and root cause
- Fix deployed at (timestamp and version)
- Regression test added (prevents recurrence)
- Any follow-up items (e.g., similar bugs to investigate proactively)

---

## Severity Response Times (Guidelines)

| Severity | Target Response |
|---|---|
| Critical | Fix begins immediately; deployment ASAP after QA |
| High | Fix in current cycle; deploy within same day |
| Medium | Fix in next sprint or next release |
| Low | Deferred; PM batches with other small fixes |

---

## Escalation Paths

| Situation | Action |
|---|---|
| Root cause is unclear | Developer escalates to Architect for investigation support |
| Fix requires broader refactor | PM escalates to Human to approve scope expansion |
| Regression introduced by fix | File new bug; do not ship the fix until regression resolved |
| Critical bug in production | PM notifies Human immediately; does not wait for task brief |
