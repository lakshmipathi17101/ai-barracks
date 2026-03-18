# Workflow: Code Review

Use this workflow when a developer's implementation needs to be reviewed
before it is merged into the main branch.

---

## Overview

```
Developer (submits PR) → Architect (technical review) → QA (if needed) → Developer (addresses) → Merge
```

Code review is the quality gate between implementation and merge. It is separate
from QA testing — code review checks that the code is correct, maintainable, and
aligned with the architecture. QA checks that the feature works correctly for the user.

---

## Who Reviews What

| Reviewer | Reviews |
|---|---|
| Senior Architect | All PRs touching architecture, interfaces, security, data models, or new patterns |
| Backend Developer | Backend-only PRs that don't touch interfaces (peer review) |
| Frontend Developer | Frontend-only PRs that don't touch interfaces (peer review) |
| QA Engineer | Reviewed when test coverage is being assessed or when a fix for a specific bug is being validated |

The Architect has final authority on all technical decisions in review.

---

## Step-by-Step

### Step 1 — Developer: Prepare the Pull Request

Before requesting review, the developer confirms:

- [ ] The PR implements the Architect's spec and does not deviate without documented justification
- [ ] All tests pass locally
- [ ] No secrets, credentials, or hardcoded values committed
- [ ] `.env.example` updated if new environment variables were added
- [ ] PR description is complete (see below)

**PR Description Template:**

```markdown
## What This PR Does
[1–3 sentence summary of the change]

## Related Task
[Link to or name of the Task Brief this implements]

## Interface Changes
[Yes / No — if yes, describe and confirm Architect approved]

## Test Coverage
[What was tested, how to run tests]

## Reviewer Notes
[Anything specific you want the reviewer to focus on or be aware of]

## Checklist
- [ ] Implements the Architect's design exactly (or documents approved deviation)
- [ ] Tests pass
- [ ] No secrets committed
- [ ] Self-reviewed: I've read my own diff and it looks right
```

**Handoff to:** Senior Architect (or peer developer for small non-architectural PRs)

---

### Step 2 — Senior Architect: Technical Review

The Architect reviews the PR against:

1. **Contract fidelity** — does the implementation match the interface contracts exactly?
2. **Correctness** — does the logic handle all specified cases including errors?
3. **Security** — are inputs validated, sensitive data handled correctly, trust boundaries respected?
4. **Readability** — can a future agent or developer understand this code?
5. **Test coverage** — are the tests meaningful and covering the right cases?
6. **Scope discipline** — does this PR do only what it was supposed to do?

The Architect produces one of three outcomes:

#### Approved ✅
```
[APPROVED]

This PR is approved for merge. [Optional: brief note on what looks good]
```

#### Approved with Minor Comments ✅⚠️
```
[APPROVED WITH COMMENTS]

This PR is approved for merge. The following minor items should be addressed
before or shortly after merge at the developer's discretion:

- [Minor item 1]
- [Minor item 2]
```

#### Changes Requested ❌
```
[CHANGES REQUESTED]

This PR cannot be merged until the following are addressed:

### Required Changes
1. [Specific issue with location in code and explanation]
2. [Specific issue with location in code and explanation]

### Questions
- [Specific question about an implementation choice]

Please update the PR and re-request review.
```

---

### Step 3 — Developer: Address Review Comments

If changes were requested:

1. Read every comment before making any changes
2. Address all required changes
3. For each change, leave a reply on the comment explaining what was done
4. Do not mark comments as resolved until the Architect confirms they are satisfied
5. Re-request review when all required changes are addressed

If a developer disagrees with a review comment:
- Reply with a clear technical argument
- Do not merge over a required change
- If unresolved, escalate to PM — the Architect has final say

**Handoff back to:** Senior Architect for re-review

---

### Step 4 — Merge

Once the Architect (or peer reviewer for non-architectural PRs) gives approval:

1. Squash merge (default) or merge commit — follow the project's defined convention
2. Delete the feature branch after merge
3. Confirm CI/CD pipeline passes on main after merge
4. Notify PM that the code is merged and ready for the next stage (QA or deployment)

---

## Review Standards

### What Always Requires Architect Review
- Any change to an API endpoint signature or response schema
- Any change to a database schema or data model
- Any change to authentication, authorization, or session handling
- Any new external dependency (library, service)
- Any new design pattern being introduced to the codebase
- Any change to CI/CD pipeline or deployment configuration

### What Can Be Peer-Reviewed (No Architect Required)
- Bug fixes that do not change any interface or data model
- Frontend-only styling or layout changes within the existing component structure
- Test additions or improvements
- Documentation or comment updates
- Refactors that do not change external behavior and are within a single layer

### Review Turnaround Expectation
- Architect reviews should be completed within the same working session they are requested
- If the Architect cannot review within the session, it files a blocker with the PM

---

## Escalation Paths

| Situation | Action |
|---|---|
| Developer disagrees with required change | Reply with technical argument; if unresolved, PM arbitrates (Architect has final say) |
| PR is too large to review effectively | Architect requests it be split into smaller PRs |
| Reviewed code introduces a regression | File a bug; do not merge until resolved |
| CI fails after merge | Developer who merged owns the fix; treat as Critical severity |
