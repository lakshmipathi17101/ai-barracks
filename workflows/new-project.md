# Workflow: New Project

Use this workflow when starting a brand-new product or codebase from scratch —
not adding to an existing system.

---

## Overview

```
Human (vision) → PM (scoping) → Architect (foundation design) → PM (first feature brief)
→ [Data/DB + UX/Designer] → Backend + Frontend → Code Reviewer → Security Auditor
→ QA → DevOps → Tech Writer → Sprint Retro → Human
```

Starting a new project has an additional Architect phase before any development begins:
the **Foundation Design**. This establishes the skeleton every subsequent feature
will be built on top of. Getting this right before writing any feature code saves
significant rework.

---

## Step-by-Step

### Step 1 — Human: Project Vision

Provide the PM with:

- What the product is and who it's for
- The core problem it solves
- The first thing it needs to do (MVP scope)
- Any hard constraints (budget, timeline, required technology, must-not-use technology)
- Success criteria: how will you know this first version is done?

Do not worry about technical detail at this stage. The Architect will handle that.

---

### Step 2 — Project Manager: Vision → MVP Scope

The PM works with the human (one clarifying question at a time) to define:

- **Product Summary:** one paragraph description of what this is
- **MVP Scope:** the minimum feature set that constitutes a working first version
- **Out of scope:** explicit list of things that are NOT in the MVP
- **Success criteria:** what does "done" look like for the MVP?
- **Priority order:** if the MVP must be cut further, what gets cut first?

The PM produces a **Project Brief** and seeks human approval before proceeding.

**Gate:** Human approves the Project Brief (scope, success criteria, and out-of-scope list).

**Handoff to:** Senior Architect

---

### Step 3 — Senior Architect: Foundation Design

This is the most critical design phase of any project. The Architect produces
a **Foundation Design Document** covering:

#### Repository & Project Structure
- Monorepo vs. separate repos
- Directory structure
- Shared code / package strategy

#### Technology Stack (with rationale)
- Backend language and framework
- Frontend framework
- Database(s) and ORM
- Auth strategy
- Third-party services required

#### Core Data Model
- All primary entities and their relationships
- Which fields are required at launch vs. deferred

#### API Architecture
- REST vs. GraphQL vs. other
- Base URL structure and versioning strategy
- Auth flow (how tokens are obtained, verified, refreshed)

#### Infrastructure Baseline
- Where the app runs (cloud provider, service type)
- Local development setup (Docker Compose, etc.)
- CI/CD pipeline design
- Environment strategy (local / staging / production)

#### Security Foundations
- Auth and authorization model
- Secrets management
- Data classification (what is sensitive)

#### Development Conventions
- Code style and linting config
- Testing strategy and coverage targets
- Git branching and PR convention
- Commit message format

The Architect also produces the **initial skeleton repositories** (directory structures,
config files, boilerplate) as a scaffold for developers to build on.

**Gate:** Human reviews and approves the Foundation Design before any development begins.
This is the most important approval in the project — changing the foundation later is expensive.

**Handoff to:** Project Manager (who then writes the first feature task briefs)
AND DevOps (who provisions the infrastructure and CI/CD pipeline)

---

### Step 4 — DevOps: Infrastructure Provisioning

In parallel with the first feature development, DevOps:

1. Provisions the development and staging environments
2. Sets up the CI/CD pipeline (build, test, deploy on push)
3. Establishes secrets management
4. Produces an **Infrastructure Setup Report** confirming environments are live

DevOps delivers the infrastructure before QA needs to test anything.

---

### Step 5 — Project Manager: First Feature Brief(s)

With the Foundation Design approved, the PM breaks the MVP into its first
set of features and produces individual **Task Briefs** for each — following
the standard new-feature workflow for each one.

Features are prioritized so the first feature is the one that validates the
core user journey end-to-end (even if rough).

---

### Step 6 onwards — Standard New Feature Workflow

Each feature follows the full `workflows/new-feature.md` workflow:

```
PM Task Brief → Architect (feature design, within the foundation)
→ Data/DB Agent (schema changes) + UX/Designer (UI specs)
→ Developers → Code Reviewer → Security Auditor → QA → DevOps → Tech Writer → Sprint Retro → Human
```

The Architect's role in feature phases is lighter — the foundation is set.
The Architect primarily defines feature-specific interface contracts and
reviews any deviations from the foundation.

The Code Reviewer and Security Auditor run on every feature — they are never skipped
in the new-project workflow.

---

## Project Folder Structure

Each new project gets its own folder under `projects/`:

```
projects/[project-name]/
├── project-brief.md          # PM's approved project brief
├── foundation-design.md      # Architect's foundation design document
├── infra/                    # DevOps infrastructure documentation
│   └── setup-report.md
├── design/                   # UX/Designer design package
│   ├── tokens.css
│   ├── wireframes.md
│   └── components/
├── store-metadata/           # App Store Agent output (mobile projects)
├── locales/                  # Localization Agent output (multi-locale projects)
├── features/                 # One subfolder per feature
│   └── [feature-name]/
│       ├── task-brief.md
│       ├── design.md
│       ├── schema/           # Data/DB Agent migrations and seed scripts
│       ├── implementation-backend.md
│       ├── implementation-frontend.md
│       ├── review-notes.md   # Code Reviewer output
│       ├── security-report.md # Security Auditor output
│       └── qa/
│           ├── test-plan.md
│           └── sign-off.md
├── retros/                   # Sprint Retrospective Agent outputs
│   └── retro-[phase]-[date].md
└── releases/                 # Deployment reports per release
    └── [version]/
        └── deployment-report.md
```

---

## Escalation Paths

| Situation | Action |
|---|---|
| MVP scope keeps growing | PM escalates to Human for explicit scope decision |
| Foundation design reveals the MVP is technically infeasible | Architect escalates to PM → Human immediately |
| Infrastructure unavailable for first feature | DevOps files blocker; PM adjusts schedule |
| Human changes core requirements after foundation approved | PM scopes the impact; Architect assesses foundation changes needed; Human approves revised foundation before development continues |
