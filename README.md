# AI Company — AIBarracks

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

## Core Delivery Team

| Role | Skill | Agent Prompt |
|---|---|---|
| Project Manager | `skills/project-manager/SKILL.md` | `agents/project-manager.md` |
| Senior Architect | `skills/senior-architect/SKILL.md` | `agents/senior-architect.md` |
| Backend Developer | `skills/backend-dev/SKILL.md` | `agents/backend-dev.md` |
| Frontend Developer | `skills/frontend-dev/SKILL.md` | `agents/frontend-dev.md` |
| QA Engineer | `skills/qa-engineer/SKILL.md` | `agents/qa-engineer.md` |
| DevOps Engineer | `skills/devops/SKILL.md` | `agents/devops.md` |

---

## Extended Team — Specialist Skills

Imported and adapted from [gstack](https://github.com/garrytan/gstack).

### Planning & Product

| Skill | What it does |
|---|---|
| `skills/office-hours/` | YC-style product brainstorming. Runs before any code is written. Startup mode (demand validation) or Builder mode (creative exploration). |

### Debugging & Quality

| Skill | What it does |
|---|---|
| `skills/investigate/` | Systematic root-cause debugging. Iron Law: no fixes without root cause. Four phases: investigate → analyze → hypothesize → implement. |
| `skills/health/` | Code quality dashboard. Runs all configured tools (type checker, tests, linter, dead code), produces a weighted 0–10 score, tracks trends over time. |
| `skills/code-reviewer/` | Pre-landing PR review. Fix-First approach: auto-fixes mechanical issues, batches judgment calls for the human. Catches SQL safety, auth gaps, race conditions, LLM trust boundaries. |
| `skills/sprint-retrospective/` | Weekly engineering retrospective. Per-contributor breakdowns, trend tracking, systemic issue detection from recurring bug patterns. |

### Security

| Skill | What it does |
|---|---|
| `skills/security-auditor/` | Infrastructure-first security audit. Secrets archaeology, dependency supply chain, CI/CD security, OWASP Top 10, STRIDE, LLM/AI security. Daily (8/10 confidence) or comprehensive mode. |

### Ship & Deploy

| Skill | What it does |
|---|---|
| `skills/ship/` | Automated PR workflow. Merges base branch, runs tests, performs pre-landing review, commits, pushes, opens PR with accurate description. |
| `skills/canary/` | Post-deploy monitoring. Verifies critical paths against pre-deploy baseline. Recommends rollback if regressions detected. |
| `skills/document-release/` | Post-ship doc sync. Updates README, ARCHITECTURE, CONTRIBUTING, CHANGELOG to match what actually shipped. |

### Safety & State

| Skill | What it does |
|---|---|
| `skills/careful/` | Safety guardrails. Warns before `rm -rf`, DROP TABLE, force-push, and other irreversible commands. Requires explicit confirmation. |
| `skills/checkpoint/` | Working state save & resume. Captures git state, decisions made, and remaining work so you can pick up exactly where you left off. |

---

## Standard Delivery Workflow

```
You (Human)
    │  Give requirement
    ▼
Project Manager  →  Senior Architect  →  Backend Dev ─┐
                                      →  Frontend Dev ─┤
                                                        ▼
                                                  QA Engineer
                                                        │
                                                        ▼
                                               DevOps Engineer
                                                        │
                                                        ▼
                                                  You (Human)
                                                  Accept / Request changes
```

See `COMPANY.md` for the full operating manual: escalation rules, definitions of
done, conflict resolution, and how to plug into the workflow.

---

## Recommended Session Workflows

**Starting a new product idea:**
`/office-hours` → PM task brief → Architect design → develop → `/qa` → `/ship`

**Debugging a production issue:**
`/investigate` → fix → `/qa` (regression only) → `/ship` → `/canary`

**Pre-ship quality gate:**
`/health` → `/code-reviewer` → `/security-auditor --diff` → `/ship`

**Weekly team check-in:**
`/sprint-retrospective` → `/health`

**After a major release:**
`/document-release` → `/canary`

---

## Workflows

Pre-defined end-to-end procedures for common scenarios:

| Workflow | Description |
|---|---|
| `workflows/new-feature.md` | Building a new feature from requirement to deployment |
| `workflows/bug-fix.md` | Handling a reported bug |
| `workflows/new-project.md` | Starting a brand-new project from scratch |
| `workflows/code-review.md` | Reviewing and merging code |

---

## Repository Structure

```
ai-company/
├── README.md                             # This file
├── COMPANY.md                            # Company rules, workflow, and conventions
├── skills/
│   ├── project-manager/SKILL.md         # Core delivery team
│   ├── senior-architect/SKILL.md
│   ├── backend-dev/SKILL.md
│   ├── frontend-dev/SKILL.md
│   ├── qa-engineer/SKILL.md             # Enhanced: tiered testing + health score
│   ├── devops/SKILL.md
│   ├── investigate/SKILL.md             # Specialist: systematic debugging
│   ├── office-hours/SKILL.md            # Specialist: product brainstorming
│   ├── ship/SKILL.md                    # Specialist: automated PR workflow
│   ├── health/SKILL.md                  # Specialist: code quality dashboard
│   ├── code-reviewer/SKILL.md           # Specialist: pre-landing PR review
│   ├── sprint-retrospective/SKILL.md    # Specialist: weekly retro
│   ├── security-auditor/SKILL.md        # Specialist: OWASP + infra security audit
│   ├── canary/SKILL.md                  # Specialist: post-deploy monitoring
│   ├── document-release/SKILL.md        # Specialist: post-ship doc sync
│   ├── careful/SKILL.md                 # Safety: destructive command guardrails
│   └── checkpoint/SKILL.md              # Utility: working state save/resume
├── agents/
│   ├── project-manager.md               # Claude API system prompts (one per role)
│   ├── senior-architect.md
│   ├── backend-dev.md
│   ├── frontend-dev.md
│   ├── qa-engineer.md
│   ├── devops.md
│   ├── investigate.md
│   ├── office-hours.md
│   ├── ship.md
│   ├── security-auditor.md
│   ├── code-reviewer.md
│   ├── sprint-retrospective.md
│   ├── health.md
│   ├── checkpoint.md
│   ├── canary.md
│   ├── careful.md
│   └── document-release.md
├── workflows/
│   ├── new-feature.md
│   ├── bug-fix.md
│   ├── new-project.md
│   └── code-review.md
└── projects/                             # Client/product work lives here
```

---

## Getting Started

1. **Give a requirement** to the Project Manager — in plain language, no technical detail needed.
2. **Review the task brief** the PM produces and confirm it matches your intent.
3. **Review the system design** the Architect produces and confirm before development starts.
4. **Wait for QA sign-off** — when QA approves, you decide whether to ship.
5. **Accept the delivery** or request changes — the loop continues until you're satisfied.

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

## Credits

Specialist skills adapted from [gstack by Garry Tan](https://github.com/garrytan/gstack) —
a collection of AI engineering workflow skills. Patterns, workflows, and philosophy
(Boil the Lake, Search Before Building, User Sovereignty) are inspired by gstack's ETHOS.md.

---

*Built on Claude — Anthropic's AI platform.*
