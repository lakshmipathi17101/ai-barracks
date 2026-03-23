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
| Backend Developer | `skills/backend-dev/SKILL.md` | `agents/backend-dev.md` |
| Frontend Developer | `skills/frontend-dev/SKILL.md` | `agents/frontend-dev.md` |
| QA Engineer | `skills/qa-engineer/SKILL.md` | `agents/qa-engineer.md` |
| DevOps Engineer | `skills/devops/SKILL.md` | `agents/devops.md` |

---

## Standard Workflow

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

## Workflows

Pre-defined end-to-end procedures for common scenarios:

| Workflow | Description |
|---|---|
| `workflows/new-feature.md` | Building a new feature from requirement to deployment |
| `workflows/bug-fix.md` | Handling a reported bug |
| `workflows/new-project.md` | Starting a brand-new project from scratch |
| `workflows/code-review.md` | Reviewing and merging code |
| `workflows/parallel-projects.md` | Running multiple projects simultaneously |

---

## Repository Structure

```
ai-company/
├── README.md                        # This file
├── CLAUDE.md                        # Framework reference (start here)
├── COMPANY.md                       # Company rules, workflow, and conventions
├── skills/
│   ├── project-manager/SKILL.md    # Claude Code skill for the PM
│   ├── senior-architect/SKILL.md   # Claude Code skill for the Architect
│   ├── backend-dev/SKILL.md        # Claude Code skill for Backend Dev
│   ├── frontend-dev/SKILL.md       # Claude Code skill for Frontend Dev
│   ├── qa-engineer/SKILL.md        # Claude Code skill for QA
│   └── devops/SKILL.md             # Claude Code skill for DevOps
├── agents/
│   ├── project-manager.md          # Claude API system prompt
│   ├── senior-architect.md
│   ├── backend-dev.md
│   ├── frontend-dev.md
│   ├── qa-engineer.md
│   └── devops.md
├── workflows/
│   ├── new-feature.md
│   ├── bug-fix.md
│   ├── new-project.md
│   ├── code-review.md
│   └── parallel-projects.md        # Running multiple projects simultaneously
├── scripts/
│   ├── run_project.py              # Start / resume a project pipeline (supports parallel)
│   └── status.py                   # Cross-project status dashboard
└── projects/                        # Client/product work lives here
    └── [project-name]/
        ├── status.md               # Pipeline state for this project
        ├── task-brief.md
        ├── design.md
        ├── implementation.md
        └── qa/
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
