# Workflow: Hotfix

Use this workflow for **urgent bug fixes** in production that cannot wait for the standard
full-chain cycle. A hotfix is a 2-agent fast path: Developer → QA only.

---

## When to Use This Workflow

Use the hotfix workflow **only** when ALL of the following are true:

1. The bug is **Critical or High severity** (system broken or key feature down for users)
2. The fix is **small and well-understood** — no design changes, no new features, no schema changes
3. **Speed is required** — the normal full-chain workflow would cause unacceptable user impact
4. The **root cause is confirmed** — you are not guessing at a fix

If ANY of these conditions are not met, use the standard `bug-fix.md` workflow instead.

> **Warning:** The hotfix path skips Code Review, Security Audit, and Architect review.
> Use it sparingly. Hotfixes that introduce regressions or security issues cost more than
> the time saved by skipping those stages.

---

## Overview

```
Human (incident report)
         │
         ▼
   Developer ──────────────────── Implement fix (with regression test)
         │
         ▼
    QA Engineer ─────────────────── Verify fix + smoke test affected area
         │
         ▼
  DevOps Engineer ─────────────────── Deploy (expedited)
         │
         ▼
   Project Manager ─────────────────── Close incident, notify human
         │
         ▼
        Human
```

**Agents skipped vs. full chain:** UX/Designer, Senior Architect, Data/DB, Code Reviewer,
Security Auditor, Tech Writer, Localization (all skipped).

**Post-hotfix obligation:** A normal Code Review and Security Audit must be performed on
the hotfix code in the next sprint or within 48 hours — whichever comes first. Log this
as a follow-up task in the PM's tracker.

---

## Step-by-Step

### Step 1 — Human: Declare the Incident

Provide to the Project Manager:
- What is broken (observable behavior in production)
- Which users are affected and at what scale
- When it started
- Severity classification: Critical / High

The PM will not start the hotfix chain without a severity classification.

---

### Step 2 — Project Manager: Triage & Hotfix Authorization

The PM:
1. Confirms the incident meets the hotfix criteria (small fix, known root cause, no design change needed)
2. Identifies the owning Developer (Backend / Frontend / both)
3. Produces a **Hotfix Brief** (abbreviated) containing:
   - Incident description (restated)
   - Observed behavior vs. expected behavior
   - Fix acceptance criterion ("hotfix is complete when…")
   - Owner
   - Constraint: **fix scope is minimal** — no refactoring, no improvements, fix only

> If the root cause is unknown or the fix requires design changes, **stop** and use
> `bug-fix.md` instead. Do not proceed with the hotfix chain on a guess.

**Gate:** PM confirms the hotfix criteria are met before developer begins.

**Handoff to:** Developer (Backend or Frontend, as applicable)

---

### Step 3 — Developer: Implement the Fix

The developer:

1. **Reproduces the bug locally** — do not write a single line of fix until the bug is reproduced
2. **Writes a regression test that fails** due to the bug (before fixing)
3. **Implements the minimum change** to fix the bug — no collateral changes
4. **Confirms the regression test now passes**
5. **Runs the full test suite** — no new failures introduced
6. Produces a brief **Hotfix Note** containing:
   - Root cause (confirmed, not guessed)
   - Exact change made (file:line)
   - Regression test added
   - Any related areas QA must check

> **Scope discipline:** If the fix reveals a larger architectural problem, document it and
> fix only the immediate failure. Schedule the larger fix through the normal workflow.

**Handoff to:** QA Engineer

---

### Step 4 — QA Engineer: Expedited Verification

QA performs an **expedited — not abbreviated** — test:

1. Reproduces the original bug from the PM's incident description (confirms it was real)
2. Verifies the fix resolves the bug
3. Runs regression tests on the affected area
4. Runs a **smoke test of the surrounding feature** — hotfixes are high-risk for regressions
5. Produces a **Hotfix Verification Note** with pass/fail result

> QA does not skip the regression test because it is a hotfix. The expedited path means
> faster turnaround, not fewer tests.

**Gate:** QA sign-off required before deployment — even on a hotfix.

**Handoff to:** DevOps Engineer (with sign-off) OR back to Developer (if fix incomplete)

---

### Step 5 — DevOps Engineer: Expedited Deployment

DevOps:

1. Defines rollback plan (abbreviated, but must exist)
2. Deploys directly to production (staging may be skipped for Critical severity with PM approval)
3. Runs post-deployment health checks
4. Confirms the incident symptom is resolved in production
5. Produces a brief **Hotfix Deployment Note**

**Gate:** Human go-ahead for production deployment (may be pre-authorized by PM for Critical severity
if human is unavailable — PM must notify human immediately after).

**Handoff to:** Project Manager

---

### Step 6 — Project Manager: Incident Closure

PM:

1. Confirms fix is live and incident is resolved
2. Logs the **post-hotfix review obligation**: Code Review + Security Audit within 48 hours
3. Delivers a brief **Incident Closure Summary** to the human:
   - What broke and why
   - What was fixed and when
   - Regression test added
   - Post-hotfix review scheduled

---

## Post-Hotfix Review Obligation

Within 48 hours of a hotfix deployment, the following must occur through the normal workflow:

1. **Code Reviewer** reviews the hotfix code
2. **Security Auditor** reviews the hotfix code

If either finds blocking issues, those issues are treated as High-priority bugs and fixed
immediately — they do not wait for the next sprint.

Log this obligation in `projects/[name]/hotfix-log.md` with the commit reference, date, and
review-completion date.

---

## Escalation Paths

| Situation | Action |
|---|---|
| Root cause unknown | Stop; use `bug-fix.md` workflow |
| Fix requires schema change | Stop; involve Architect; use `bug-fix.md` |
| QA cannot reproduce the bug | Return to Developer for investigation; do not guess |
| Deployment fails | Execute rollback; file incident with PM; investigate before retry |
| Fix introduces regression | Revert; do not patch on top of a broken hotfix |
| Human unreachable for go-ahead | PM may authorize Critical deployments; must notify human within 1 hour |
