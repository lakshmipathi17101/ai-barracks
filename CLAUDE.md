# AIBarracks — Framework Reference

AIBarracks is a multi-agent software company where every team member is a
Claude agent. This document is the primary reference for working with the
framework, including the new **multi-project parallel execution** capability.

---

## Framework Architecture

```
ai-company/
├── CLAUDE.md                        # This file — framework reference
├── README.md                        # High-level overview
├── COMPANY.md                       # Company operating manual (roles, DoDs, governance)
├── agents/                          # Claude API system prompts (one per role)
├── skills/                          # Claude Code skills (one per role)
├── workflows/                       # End-to-end workflow definitions
├── scripts/                         # Orchestration scripts
│   ├── run_project.py               # Start / resume a project pipeline
│   └── status.py                    # Cross-project status dashboard
└── projects/                        # All project work lives here
    └── [project-name]/
        ├── status.md                # Pipeline state for this project
        ├── task-brief.md            # PM output
        ├── design.md                # Architect output
        ├── qa/                      # QA outputs
        │   ├── test-plan.md
        │   └── sign-off.md
        └── [app code or infra docs]
```

---

## Agent Pipeline

The standard pipeline is sequential within a project, but multiple projects
run this pipeline concurrently and independently:

```
PM → Architect → Backend Dev ┐
                 Frontend Dev ┘ → QA → DevOps → (done)
```

Each agent reads the previous stage's output file(s) and writes its own
output file before the next stage begins. Status is tracked per-project
in `projects/[name]/status.md`.

---

## Multi-Project Parallel Execution

### How It Works

Each project is fully isolated in its own `projects/[name]/` folder.
The `scripts/run_project.py` runner uses Python `asyncio` to drive the
agent chain. Multiple project runners can execute concurrently — one
`asyncio` task per project, each making independent API calls to Claude.

```
run_project.py
  ├── Project: smartscan     (asyncio Task A)  PM→Arch→Dev→QA→DevOps
  ├── Project: renterschoice (asyncio Task B)  PM→Arch→Dev→QA→DevOps
  └── Project: react-todo    (asyncio Task C)  PM→Arch→Dev→QA→DevOps
         ↕ all run concurrently, writing to isolated project folders ↕
```

Projects do not share state and cannot interfere with each other.

### Starting Projects

**Single project:**
```bash
python scripts/run_project.py \
  --project smartscan \
  --requirement "A barcode scanner web app for warehouse inventory management"
```

**Multiple projects in parallel:**
```bash
python scripts/run_project.py \
  --parallel scripts/projects.json
```

Where `scripts/projects.json` is:
```json
[
  {
    "project": "smartscan",
    "requirement": "A barcode scanner web app for warehouse inventory management"
  },
  {
    "project": "renterschoice",
    "requirement": "A rental property comparison tool for tenants"
  }
]
```

**Resume a paused/failed project (re-run from current stage):**
```bash
python scripts/run_project.py --project smartscan --resume
```

### Checking Status

```bash
python scripts/status.py
```

Outputs a dashboard of all projects and their current pipeline stage:

```
PROJECT          STAGE       STATUS     LAST UPDATED
───────────────────────────────────────────────────
smartscan        qa          running    2026-03-23 14:30
renterschoice    architect   running    2026-03-23 14:28
react-todo       done        ✓ done     2026-03-18 09:00
```

---

## Pipeline Stages

Each project tracks its position through these stages:

| Stage | Agent | Output File |
|---|---|---|
| `pm` | Project Manager | `projects/[name]/task-brief.md` |
| `architect` | Senior Architect | `projects/[name]/design.md` |
| `dev` | Backend + Frontend Devs | `projects/[name]/implementation.md` |
| `qa` | QA Engineer | `projects/[name]/qa/test-plan.md`, `qa/sign-off.md` |
| `devops` | DevOps Engineer | `projects/[name]/qa/deployment-report.md` |
| `done` | — | All outputs present, delivery confirmed |
| `blocked` | — | See `projects/[name]/status.md` for blocker note |

Status is persisted in `projects/[name]/status.md` so a pipeline can be
inspected, paused, or resumed at any stage.

---

## Human Touch-Points

The human (you) is still the CEO and Product Owner. With parallel projects
running, your touch-points are:

| When | Action |
|---|---|
| **Before starting** | Provide requirement to `run_project.py` (or PM skill) |
| **After PM stage** | Review `task-brief.md` and confirm scope |
| **After Architect stage** | Review `design.md` and approve before dev begins |
| **After QA stage** | Review `qa/sign-off.md` and give go-ahead to ship |
| **After DevOps stage** | Accept delivery or request changes |
| **Any blocker** | Read `status.md` for the blocker note, make decision |

With multiple projects running, check `python scripts/status.py` to see
which projects need your attention.

---

## Using the Skills (Claude Code)

Each agent role has a Claude Code skill in `skills/`. To invoke an agent
manually inside Claude Code, use the skill name. These are best for:
- Ad-hoc single-agent tasks
- Reviewing or adjusting a specific stage
- Running a workflow step-by-step interactively

For fully automated end-to-end runs, prefer the `scripts/run_project.py`
pipeline which chains all agents automatically.

---

## Using the Agent Prompts (Claude API)

Each file in `agents/` is a standalone Claude API system prompt. Import
it as the `system` parameter when calling `anthropic.messages.create`.
The pipeline runner (`scripts/run_project.py`) uses these prompts to
drive each stage automatically.

To invoke any single agent manually:
```python
import anthropic

client = anthropic.Anthropic()
with open("agents/senior-architect.md") as f:
    system_prompt = f.read()
with open("projects/myproject/task-brief.md") as f:
    task_brief = f.read()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=8192,
    system=system_prompt,
    messages=[{"role": "user", "content": task_brief}]
)
print(response.content[0].text)
```

---

## Environment Setup

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

The scripts require Python 3.11+ and the `anthropic` package. No other
dependencies are needed — all file I/O uses the standard library.

---

## Key Conventions

- Every project lives in `projects/[project-name]/` — names are lowercase
  with hyphens (e.g. `smart-scan`, `renters-choice`)
- Agent outputs are **never deleted** — superseded versions are renamed
  with a `-deprecated` suffix
- Blockers use the `[BLOCKER]` prefix; questions to the human use
  `[DECISION NEEDED]`; completed deliverables use `[READY FOR REVIEW]`
- The `status.md` in each project folder is the single source of truth for
  where that project is in the pipeline

---

*Last updated: 2026-03-23*
