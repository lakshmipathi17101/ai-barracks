# Workflow: New Feature

Use this workflow when you have a new capability to add to an existing product or codebase.

---

## Overview

```
Human → PM → Architect → Backend Dev + Frontend Dev → QA → DevOps → Human
```

---

## Step-by-Step

### Step 1 — Human: Submit the Feature Request

Write a plain-language description of what you want built. No technical detail required.
Hand this to the Project Manager.

Minimum to include:
- What the feature does from the user's perspective
- Who the user is (if not already established)
- Any hard constraints (timeline, must-use tech, must-not-break existing behavior)
- Priority (High / Medium / Low)

---

### Step 2 — Project Manager: Intake & Task Brief

The PM reads the request, asks at most one clarifying question if needed,
then produces a **Task Brief** containing:

- Requirement restatement (confirmed with human)
- Acceptance criteria (testable, specific)
- Task breakdown (with owners, dependencies, inputs, outputs)
- Risks and open questions

**Gate:** Human reviews and approves the Task Brief before work proceeds.
If human requests changes, PM revises and re-submits.

**Handoff to:** Senior Architect

---

### Step 3 — Senior Architect: System Design

The Architect reads the Task Brief, asks at most one clarifying question if needed,
then produces a **System Design Document** containing:

- Component diagram
- Interface contracts (API schemas, data models, component props)
- Technology choices with rationale
- Security and scalability notes
- Developer assignments (who builds what)
- Out-of-scope items

**Gate:** Human reviews and approves the System Design before development begins.
If human requests changes, Architect revises and re-submits.

**Handoff to:** Backend Developer AND Frontend Developer (in parallel)

---

### Step 4 — Backend & Frontend Developers: Implementation

Both developers work in parallel against the Architect's spec.
Each produces an **Implementation Package** containing:

- What was built
- File structure
- How to run locally
- Tests and coverage
- Known caveats for QA

Developers hand off to QA independently when their piece is ready.
QA does not begin testing until both packages are available
(or the PM explicitly authorizes partial testing).

**Handoff to:** QA Engineer

---

### Step 5 — QA Engineer: Testing

QA produces a **Test Plan** before testing begins, then executes all test cases.

For each failing test:
- File a **Bug Report** assigned to the correct developer
- Notify PM that QA is blocked on this bug
- After fix is delivered, re-test the affected area fully

QA does not sign off until all acceptance criteria pass.

**Gate:** QA Sign-Off is required before DevOps deploys.

**Handoff to:** DevOps Engineer (with sign-off) OR back to Developer (with bug report)

---

### Step 6 — DevOps Engineer: Deployment

DevOps reads the QA sign-off, then:

1. Defines the rollback plan
2. Deploys to staging (if available), verifies, then promotes to production
3. Runs post-deployment smoke tests
4. Produces a **Deployment Report**

**Gate:** Human go-ahead is required before production deployment.
DevOps may deploy to staging autonomously.

**Handoff to:** Project Manager

---

### Step 7 — Project Manager: Delivery Confirmation

PM reviews the Deployment Report, confirms all acceptance criteria were met,
and delivers a **Delivery Summary** to the human:

- What was built and deployed
- Where to access it
- Any known caveats
- Any deferred items

**Gate:** Human accepts the delivery or requests changes.
If changes requested, PM scopes the delta and the loop restarts from Step 2.

---

## Escalation Paths

| Situation | Action |
|---|---|
| PM cannot clarify requirement | Escalate to Human for decision |
| Architect finds requirement technically infeasible | Escalate to PM → Human |
| Developer blocked on spec ambiguity | Ask Architect one question; if Architect blocked, escalate to PM |
| QA cannot reproduce a bug | Return to developer for investigation |
| Deployment fails | Execute rollback; file blocker with PM; investigate root cause before re-deploying |
| Human rejects delivery | PM scopes the delta; loop restarts |
