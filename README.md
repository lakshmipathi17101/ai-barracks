# AI Company

An AI-powered software company where every team member is a Claude agent.
You provide the requirements. The agents handle the rest.

---

## What This Is

This repository defines a complete software development team as a set of
Claude Code skills and Claude API agent system prompts. Each agent owns a
specific role in the delivery pipeline and hands off to the next agent
using a standard protocol.

You — the human — are the CEO and Product Owner. You set direction, approve
designs, and accept (or reject) deliveries. Everything in between is handled
by the agents.

---

## Team

| Role | Skill | Agent Prompt |
|---|---|---|
| Project Manager | `skills/project-manager/SKILL.md` | `agents/project-manager.md` |
| Senior Architect | `skills/senior-architect/SKILL.md` | `agents/senior-architect.md` |
| UX/Designer | `skills/ux-designer/SKILL.md` | `agents/ux-designer.md` |
| Data/DB Agent | `skills/data-db/SKILL.md` | `agents/data-db.md` |
| Backend Developer | `skills/backend-dev/SKILL.md` | `agents/backend-dev.md` |
| Frontend Developer | `skills/frontend-dev/SKILL.md` | `agents/frontend-dev.md` |
| Code Reviewer | `skills/code-reviewer/SKILL.md` | `agents/code-reviewer.md` |
| Security Auditor | `skills/security-auditor/SKILL.md` | `agents/security-auditor.md` |
| QA Engineer | `skills/qa-engineer/SKILL.md` | `agents/qa-engineer.md` |
| DevOps Engineer | `skills/devops/SKILL.md` | `agents/devops.md` |
| Tech Writer | `skills/tech-writer/SKILL.md` | `agents/tech-writer.md` |
| Sprint Retrospective Agent | `skills/sprint-retrospective/SKILL.md` | `agents/sprint-retrospective.md` |
| App Store Agent *(mobile)* | `skills/app-store/SKILL.md` | `agents/app-store.md` |
| Localization Agent *(multi-locale)* | `skills/localization/SKILL.md` | `agents/localization.md` |
| Dependency Updater | `skills/dependency-updater/SKILL.md` | `agents/dependency-updater.md` |

---

## Extended Team — Specialist Skills (from gstack)

Adapted from [garrytan/gstack](https://github.com/garrytan/gstack). Invoke on demand.

| Skill | What it does |
|---|---|
| `skills/office-hours/` | YC-style product brainstorming before any code is written. Startup mode (demand validation) or Builder mode (creative exploration). |
| `skills/investigate/` | Systematic root-cause debugging. Iron Law: no fixes without root cause. 4-phase: investigate → analyze → hypothesize → implement. |
| `skills/ship/` | Automated PR workflow: merge base branch, run tests, pre-landing review, push, open PR. |
| `skills/health/` | Code quality dashboard. Weighted 0–10 composite score across type safety, tests, lint, and dead code. Tracks trends over time. |
| `skills/canary/` | Post-deploy critical path monitoring with baseline comparison and rollback recommendations. |
| `skills/document-release/` | Post-ship doc sync. Updates README/CHANGELOG/ARCHITECTURE to match what actually shipped. |
| `skills/careful/` | Destructive command guardrails. Requires explicit confirmation before `rm -rf`, DROP TABLE, force-push, etc. |
| `skills/checkpoint/` | Working state save/resume. Captures decisions, open threads, and exact resume point across sessions. |

---

## Recommended Session Workflows

**Starting a new product idea:** `/office-hours` → PM → Architect → Dev → QA → Ship

**Debugging a production issue:** `/investigate` → fix → QA (regression) → `/ship` → `/canary`

**Pre-ship quality gate:** `/health` → Code Reviewer → Security Auditor → `/ship`

**After a release:** `/document-release` → `/canary`

---

## Standard Workflow

```
You (Human)
    │  Give requirement
    ▼
Project Manager
    │
    ▼
Senior Architect
    │
    ├─────────────────────────────────────┐
    ▼                                     │
Data/DB Agent  ←  schema, migrations     │
    │                                     │
    ▼                                     │
UX/Designer  ←  wireframes, tokens       │
    │                                     │
    ├─────────────────────┐               │
    ▼                     ▼               │
Backend Dev          Frontend Dev  ←──────┘
    │                     │
    └──────────┬───────────┘
               ▼
         Code Reviewer  ←  review-notes.md
               │
               ▼
       Security Auditor  ←  security-report.md
               │
               ▼
          QA Engineer
               │
               ▼
        DevOps Engineer
               │
               ▼
          Tech Writer  ←  README, API docs, CHANGELOG
               │
               ▼
    Sprint Retro Agent  ←  retro doc, COMPANY.md updates
               │
               ▼
        You (Human)
        Accept / Request changes
```

**Optional agents:** App Store Agent (mobile projects), Localization Agent (multi-locale projects)

See `COMPANY.md` for the full operating manual: escalation rules, definitions of
done, conflict resolution, and how to plug into the workflow.

---

## Workflows

Pre-defined end-to-end procedures for common scenarios:

| Workflow | File | Description |
|---|---|---|
| New Feature | `workflows/new-feature.md` | Building a new feature from requirement to deployment |
| Bug Fix | `workflows/bug-fix.md` | Handling a reported bug (standard path) |
| **Hotfix** | `workflows/hotfix.md` | **Fast 2-agent path for urgent production fixes** |
| New Project | `workflows/new-project.md` | Starting a brand-new project from scratch |
| Code Review | `workflows/code-review.md` | Reviewing and merging code (standalone) |
| Parallel Projects | `workflows/parallel-projects.md` | Running multiple projects simultaneously |
| **Sprint Retrospective** | `workflows/sprint-retrospective.md` | **Phase retro and COMPANY.md lessons** |
| **Dependency Update** | `workflows/dependency-update.md` | **Weekly/on-demand package audits and CVE patching** |

---

## Repository Structure

```
ai-company/
├── README.md                              # This file
├── CLAUDE.md                              # Framework reference (start here)
├── COMPANY.md                             # Company rules, workflow, and conventions
├── skills/
│   ├── project-manager/SKILL.md
│   ├── senior-architect/SKILL.md
│   ├── ux-designer/SKILL.md              # NEW: wireframes, design tokens, component specs
│   ├── data-db/SKILL.md                  # NEW: schema, migrations, indexes, seeds
│   ├── backend-dev/SKILL.md
│   ├── frontend-dev/SKILL.md
│   ├── code-reviewer/SKILL.md            # NEW: senior-engineer PR review
│   ├── security-auditor/SKILL.md         # NEW: security findings, security-report.md
│   ├── qa-engineer/SKILL.md
│   ├── devops/SKILL.md
│   ├── tech-writer/SKILL.md              # NEW: README, API docs, JSDoc, CHANGELOG
│   ├── sprint-retrospective/SKILL.md     # NEW: retro docs, COMPANY.md updates
│   ├── app-store/SKILL.md                # NEW: ASO, store listings, keyword strategy
│   ├── localization/SKILL.md             # NEW: i18n extraction, translation scaffolds
│   └── dependency-updater/SKILL.md       # NEW: package audits, CVE patching, PRs
├── agents/
│   ├── project-manager.md
│   ├── senior-architect.md
│   ├── ux-designer.md                    # NEW
│   ├── data-db.md                        # NEW
│   ├── backend-dev.md
│   ├── frontend-dev.md
│   ├── code-reviewer.md                  # NEW
│   ├── security-auditor.md               # NEW
│   ├── qa-engineer.md
│   ├── devops.md
│   ├── tech-writer.md                    # NEW
│   ├── sprint-retrospective.md           # NEW
│   ├── app-store.md                      # NEW
│   ├── localization.md                   # NEW
│   └── dependency-updater.md             # NEW
├── workflows/
│   ├── new-feature.md
│   ├── bug-fix.md
│   ├── hotfix.md                         # NEW: fast 2-agent path for urgent fixes
│   ├── new-project.md
│   ├── code-review.md
│   ├── parallel-projects.md              # Running multiple projects simultaneously
│   ├── sprint-retrospective.md           # NEW: phase retro workflow
│   └── dependency-update.md              # NEW: dependency audit workflow
├── scripts/
│   ├── run_project.py                    # Start / resume a project pipeline (supports parallel)
│   └── status.py                         # Cross-project status dashboard
└── projects/                             # Client/product work lives here
    └── [project-name]/
        ├── status.md                     # Pipeline state for this project
        └── ...
```

---

## Getting Started

### Interactive (Claude Code skills)

1. **Give a requirement** to the Project Manager — in plain language, no technical detail needed.
2. **Review the task brief** the PM produces and confirm it matches your intent.
3. **Review the system design** the Architect produces and confirm before development starts.
4. **Wait for QA sign-off** — when QA approves, you decide whether to ship.
5. **Accept the delivery** or request changes — the loop continues until you're satisfied.

### Automated pipeline (single project)

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...

python scripts/run_project.py \
    --project my-app \
    --requirement "A task management web app with drag-and-drop boards"

python scripts/status.py
```

### Automated pipeline (multiple projects in parallel)

```bash
# Create scripts/projects.json listing each project + requirement
python scripts/run_project.py --parallel scripts/projects.json
python scripts/status.py
```

See `CLAUDE.md` for the full framework reference and `workflows/parallel-projects.md`
for the complete parallel workflow guide.

You never need to write code, design systems, or manage tasks. Your job is to
set direction and accept or reject delivery.

---

## How to Use the Agent Prompts

Each file in `agents/` is a Claude API system prompt. To invoke an agent:

```python
import anthropic

client = anthropic.Anthropic()

with open("agents/project-manager.md") as f:
    system_prompt = f.read()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    system=system_prompt,
    messages=[
        {"role": "user", "content": "I need a user authentication system with email/password login."}
    ]
)
print(response.content[0].text)
```

---

## How to Use the Skills

Each directory in `skills/` is a Claude Code skill. Install them by pointing
Claude Code at this repository's `skills/` directory, or copy individual skill
folders into your Claude Code skills directory.

---

*Built on Claude — Anthropic's AI platform.*
