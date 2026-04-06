# Workflow: New Feature

Use this workflow when you have a new capability to add to an existing product or codebase.

---

## Overview

```
Human → PM → Architect → [Data/DB + UX/Designer] → Backend Dev + Frontend Dev
      → Code Reviewer → Security Auditor → QA → DevOps → Tech Writer
      → Sprint Retro → Human
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

**Handoff to:** Data/DB Agent AND UX/Designer (can proceed in parallel after Architect's design)

---

### Step 4a — Data/DB Agent: Schema & Migrations

The Data/DB Agent reads the Architect's data model and produces:

- Database schema (Prisma schema, SQL migrations, or ORM equivalent)
- Sequential, named migration files
- Index definitions with rationale
- Seed data scripts (dev + test)
- Exact commands to apply migrations and seeds

**Gate:** Schema must match Architect's data model exactly before handing to Backend Developer.

**Handoff to:** Backend Developer

---

### Step 4b — UX/Designer: Design Package

The UX/Designer reads the Architect's system design and PM's task brief and produces:

- Wireframes for all screens (happy path, error, empty states)
- Design system tokens (colors, spacing, typography as CSS custom properties)
- Component specs (layout, variants, props, all interaction states)
- Responsive behavior at mobile and desktop breakpoints

**Gate:** All interactive states specified before handing to Frontend Developer.

**Handoff to:** Frontend Developer

---

### Step 5 — Backend & Frontend Developers: Implementation

Both developers work in parallel:
- Backend Developer builds against the Architect's API spec and Data/DB Agent's schema
- Frontend Developer builds against the Architect's component contracts and UX/Designer's specs

Each produces an **Implementation Package** containing:

- What was built
- File structure
- How to run locally
- Tests and coverage
- Known caveats for review

Developers hand off to Code Reviewer when both packages are ready.

**Handoff to:** Code Reviewer

---

### Step 6 — Code Reviewer: PR Review

The Code Reviewer acts as a senior engineer doing a pull request review:

1. Reviews every changed file against the Architect's interface contracts
2. Fixes critical blocking issues inline (small, unambiguous fixes)
3. Documents all findings in `review-notes.md` with exact file:line references

**Gate:** All blocking issues resolved before Security Audit.

**Handoff to:** Security Auditor (if approved) OR back to Developer (if blocking issues found)

---

### Step 7 — Security Auditor: Security Review

The Security Auditor reviews for auth vulnerabilities, input validation gaps,
exposed secrets, and insecure API patterns. Produces `security-report.md`.

**Gate:** Critical and High findings block QA — must be resolved and re-audited first.

**Handoff to:** QA Engineer (if approved) OR back to Developer (if Critical/High findings)

---

### Step 8 — QA Engineer: Testing

QA produces a **Test Plan** before testing begins, then executes all test cases.
QA incorporates security-related test cases from the Security Auditor's report.

For each failing test:
- File a **Bug Report** assigned to the correct developer
- Notify PM that QA is blocked on this bug
- After fix is delivered, re-test the affected area fully

QA does not sign off until all acceptance criteria pass.

**Gate:** QA Sign-Off is required before DevOps deploys.

**Handoff to:** DevOps Engineer (with sign-off) OR back to Developer (with bug report)

---

### Step 9 — DevOps Engineer: Deployment

DevOps reads the QA sign-off, then:

1. Defines the rollback plan
2. Deploys to staging (if available), verifies, then promotes to production
3. Runs post-deployment smoke tests
4. Produces a **Deployment Report**

**Gate:** Human go-ahead is required before production deployment.
DevOps may deploy to staging autonomously.

**Handoff to:** Tech Writer

---

### Step 10 — Tech Writer: Documentation

The Tech Writer reads the deployed codebase and produces:

- Updated README (setup, env vars, run/test commands)
- API documentation (all public endpoints with request/response schemas)
- JSDoc/TSDoc on all exported functions and classes
- CHANGELOG entry for this release

**Handoff to:** Sprint Retrospective Agent

---

### Step 11 — Sprint Retrospective Agent: Phase Retro

Reviews all phase artifacts, computes delivery metrics, produces the retro doc,
and updates COMPANY.md with ≤3 lessons learned.

**Handoff to:** Project Manager

---

### Step 12 — Project Manager: Delivery Confirmation

PM reviews the Deployment Report and retro, confirms all acceptance criteria were met,
and delivers a **Delivery Summary** to the human:

- What was built and deployed
- Where to access it
- Any known caveats
- Any deferred items
- Retro action items being tracked

**Gate:** Human accepts the delivery or requests changes.
If changes requested, PM scopes the delta and the loop restarts from Step 2.

---

## Optional Agents

| Agent | When | Insert After |
|---|---|---|
| Localization Agent | Feature adds user-facing strings and multi-locale support is required | After Dev, before QA |
| App Store Agent | Mobile feature that changes store listing metadata | After Tech Writer |

---

## Escalation Paths

| Situation | Action |
|---|---|
| PM cannot clarify requirement | Escalate to Human for decision |
| Architect finds requirement technically infeasible | Escalate to PM → Human |
| Developer blocked on spec ambiguity | Ask Architect one question; if Architect blocked, escalate to PM |
| Code Reviewer blocks build | Developer fixes; Code Reviewer re-reviews |
| Security Auditor finds Critical/High | Developer fixes; Security Auditor re-audits before QA |
| QA cannot reproduce a bug | Return to developer for investigation |
| Deployment fails | Execute rollback; file blocker with PM; investigate root cause before re-deploying |
| Human rejects delivery | PM scopes the delta; loop restarts |
