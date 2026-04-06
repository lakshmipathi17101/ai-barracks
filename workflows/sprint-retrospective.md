# Workflow: Sprint Retrospective

Use this workflow at the end of each project phase (after PM closes the delivery) to
capture what happened, improve the process, and update COMPANY.md with lessons learned.

---

## Overview

```
Phase closes (PM delivers to Human)
              │
              ▼
    Sprint Retrospective Agent ──── Reviews all phase artifacts
              │
              ▼
    sprint-retro writes retro doc ── Delivery metrics, Start/Stop/Continue
              │
              ▼
    COMPANY.md updated ──────────── ≤3 lessons added to relevant sections
              │
              ▼
    Project Manager ─────────────── Confirms retro complete, archives artifacts
              │
              ▼
           Human ─────────────────── Reviews retro (optional) — accepts or notes concerns
```

---

## When to Run

Run this workflow:
- After every project phase is closed (feature complete, deployment confirmed, human accepted)
- After a hotfix deployment (lighter retro focused on the incident)
- At the end of a sprint, even if the phase is still in progress

Do NOT run this workflow:
- Mid-phase while work is still ongoing
- Before the DevOps deployment report is complete
- Without access to the phase artifacts (PM's brief, bug reports, QA notes, deployment report)

---

## Step-by-Step

### Step 1 — Project Manager: Trigger the Retrospective

After confirming delivery is accepted by the human:

1. Collect file paths for all phase artifacts:
   - PM Task Brief
   - Architect System Design
   - Developer Handoff Notes (Backend + Frontend)
   - Code Review Notes (`review-notes.md`)
   - Security Audit Report (`security-report.md`)
   - QA Sign-Off / Bug Reports
   - DevOps Deployment Report
2. Name the phase: `[Project Name] — [Phase Description]` (e.g., "Barracks MVP — Auth Feature")
3. Hand artifacts to the Sprint Retrospective Agent

**Handoff to:** Sprint Retrospective Agent

---

### Step 2 — Sprint Retrospective Agent: Review & Write

The Sprint Retrospective Agent:

1. Reads all phase artifacts
2. Computes delivery metrics:
   - QA rejection cycles (how many times did QA reject and return to developer?)
   - Bugs filed in QA (total, by severity)
   - Security findings (Critical/High count)
   - Code review blocking issues
   - Blockers encountered and their duration
   - Stages with rework (which stages had to redo work?)
3. Produces a `retro-[phase-slug]-[date].md` in `projects/[name]/` with:
   - Delivery metrics table
   - What Went Well (Continue)
   - What Didn't Work (Stop)
   - What to Try Next (Start)
   - Specific, role-assigned action items
   - Lessons for COMPANY.md (maximum 3, highest-impact)
4. Applies ≤3 lessons directly to COMPANY.md in the most relevant section

**Gate:** No vague action items — every item must be specific, role-assigned, and describe a process change.

**Handoff to:** Project Manager

---

### Step 3 — Project Manager: Archive & Track Actions

The PM:

1. Reviews the retro document for completeness
2. Archives phase artifacts in `projects/[name]/archive/phase-[N]/`
3. Logs action items in the project tracker (or in `projects/[name]/action-items.md`)
4. Confirms COMPANY.md was updated (or notes why no update was needed)
5. Notifies the human that the retro is complete and available for review

---

### Step 4 — Human: Review (Optional)

The human may:
- Review the retro document and COMPANY.md changes
- Accept the retro as-is
- Request additional investigation of a specific finding
- Override or modify a COMPANY.md change

If the human has no feedback, the retro is considered closed.

---

## Hotfix Retrospective (Lightweight)

For hotfixes, run a lighter version with only:
- Incident timeline (when detected, when fixed, when deployed)
- Root cause (confirmed, not speculated)
- Regression test added (confirm)
- Post-hotfix review status (Code Review + Security Audit — completed or scheduled)
- One action item: what process change would have caught this earlier?

No COMPANY.md update is required for individual hotfixes unless the root cause reveals
a systemic gap in the standard workflow.

---

## Artifacts Produced

| Artifact | Location | Owner |
|---|---|---|
| `retro-[phase]-[date].md` | `projects/[name]/` | Sprint Retrospective Agent |
| COMPANY.md updates | `COMPANY.md` §[section] | Sprint Retrospective Agent |
| Action items log | `projects/[name]/action-items.md` | Project Manager |
| Archived phase artifacts | `projects/[name]/archive/phase-[N]/` | Project Manager |

---

## Escalation Paths

| Situation | Action |
|---|---|
| Phase artifacts are missing | PM locates them before triggering retro; do not retro from memory |
| Retro reveals a systemic process flaw | Escalate to Human for process decision before adding to COMPANY.md |
| Action item requires tool/infrastructure change | PM adds to next sprint backlog; Human approves scope |
| Human disagrees with a COMPANY.md lesson | Human overrides; PM reverts the specific change |
