# Workflow: Parallel Projects

Use this workflow when you need to run two or more projects through the agent
pipeline simultaneously — for example, building SmartScan and RentersChoice
at the same time rather than waiting for one to finish before starting the other.

---

## Overview

```
Human (multiple requirements)
    │
    ├── Project A: smartscan     → PM → Arch → Dev → QA → DevOps ──┐
    ├── Project B: renterschoice → PM → Arch → Dev → QA → DevOps ──┤
    └── Project C: ...           → PM → Arch → Dev → QA → DevOps ──┘
                                                                      │
                                                              Human reviews all
                                                              deliveries
```

Each project runs the standard pipeline in its own isolated folder.
Projects do not share agents, state, or output files. The only shared
resource is the Claude API.

---

## Key Principles

### Isolation
Every project lives entirely within `projects/[project-name]/`. Two
projects running in parallel will never read or write each other's files.

### Statelessness between stages
Each agent stage reads its inputs from disk (files written by the previous
stage) and writes its output to disk. This means:
- Stages can be re-run independently if they fail
- A pipeline can be paused and resumed at any stage
- Adding a new project to a running batch does not affect existing projects

### Human review is per-project
Even when projects run in parallel, the human reviews each project's
deliverables independently. Use `python scripts/status.py` to see which
projects need your attention.

---

## Step-by-Step

### Step 1 — Human: Provide Requirements

For each project, prepare a plain-language requirement. No technical detail
is needed at this stage.

**Option A — JSON file (recommended for multiple projects):**

Create a file (e.g. `scripts/projects.json`):

```json
[
  {
    "project": "smartscan",
    "requirement": "A barcode scanner web app for warehouse inventory management. Staff scan barcodes to log stock movements. All data stored locally in the browser."
  },
  {
    "project": "renterschoice",
    "requirement": "A rental property comparison tool for tenants. Users enter details of properties they're considering and the tool highlights the best value option."
  }
]
```

**Option B — Individual CLI calls (run in separate terminals):**

```bash
# Terminal 1
python scripts/run_project.py \
    --project smartscan \
    --requirement "A barcode scanner web app for warehouse inventory management."

# Terminal 2 (simultaneously)
python scripts/run_project.py \
    --project renterschoice \
    --requirement "A rental property comparison tool for tenants."
```

---

### Step 2 — Launch the Pipelines

**Parallel (JSON file):**
```bash
python scripts/run_project.py --parallel scripts/projects.json
```

Both pipelines start immediately and run concurrently. Each project prints
its own log lines prefixed with `[project-name]`.

---

### Step 3 — Monitor Progress

Check the dashboard at any time:

```bash
python scripts/status.py
```

Example output:
```
PROJECT          STAGE       LAST UPDATED
──────────────────────────────────────────────────
smartscan        ● QA        2026-03-23 14:35 UTC
renterschoice    ● Arch      2026-03-23 14:33 UTC
react-todo       ✓ Done      2026-03-18 09:00 UTC
```

For detail on a specific project:
```bash
python scripts/status.py --project smartscan
```

---

### Step 4 — Human Review Gates

The automated pipeline pauses automatically after each stage only when a
**`[DECISION NEEDED]`** or **`[BLOCKER]`** tag appears in an agent's output.
In those cases, the project's stage will be set to `blocked` and the
pipeline will not advance until the human resolves it and re-runs with
`--resume`.

For normal, non-blocked runs, the pipeline runs end-to-end and each
deliverable is waiting in the project folder when you're ready to review.

**Review checklist per project:**

After pipeline completes:
- [ ] Read `projects/[name]/task-brief.md` — does the PM correctly capture your requirement?
- [ ] Read `projects/[name]/design.md` — is the architecture sensible?
- [ ] Read `projects/[name]/implementation.md` — any concerns about the implementation approach?
- [ ] Read `projects/[name]/qa/test-plan.md` and `qa/sign-off.md` — does QA confirm all criteria pass?
- [ ] Read `projects/[name]/qa/deployment-report.md` — confirm deployment steps are correct
- [ ] Accept delivery or request changes (see §5 of COMPANY.md)

---

### Step 5 — Handling Blockers

If any stage produces a `[BLOCKER]`, the project's `status.md` will show
`stage: blocked`. To investigate:

```bash
python scripts/status.py --project smartscan
```

The detail view will print the blocker note directly. Once you have made
the required decision, update the relevant input file (or re-run with a
clarified requirement) and resume:

```bash
python scripts/run_project.py --project smartscan --resume
```

Resuming skips all completed stages and picks up from the blocked one.

---

### Step 6 — Requesting Changes

If you reject a delivery, the PM re-enters the loop. Scope the change
request as a new requirement and re-run the pipeline from the `pm` stage:

```bash
python scripts/run_project.py \
    --project smartscan \
    --requirement "Same as before, but also support QR codes in addition to barcodes."
```

This overwrites the existing pipeline outputs. Archive the previous run
first if you need to keep the audit trail:

```bash
cp -r projects/smartscan projects/smartscan-v1-deprecated
```

---

## Project Folder Layout

Each project folder follows this layout after a complete pipeline run:

```
projects/[project-name]/
├── status.md              ← Pipeline state (stage, timestamps, history)
├── task-brief.md          ← PM output
├── design.md              ← Architect output
├── implementation.md      ← Developer output
└── qa/
    ├── test-plan.md       ← QA test plan
    ├── sign-off.md        ← QA sign-off
    └── deployment-report.md ← DevOps report
```

App code (if produced) lives under `projects/[project-name]/app/`.

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's a Problem | Correct Approach |
|---|---|---|
| Running the same project name twice concurrently | Both writes go to the same files — output gets corrupted | Use different project names or wait for the first to finish |
| Skipping the review gates and immediately shipping | QA sign-off and human go-ahead exist for good reason | Always review `qa/sign-off.md` before treating a delivery as final |
| Editing output files between stages | The next stage reads what's on disk — manual edits get picked up | That's fine and intentional if you want to guide the next agent |
| Running pipelines without an API key set | Will fail at the first API call | `export ANTHROPIC_API_KEY=sk-ant-...` first |

---

## Tips for Running Many Projects

- Name projects with short, lowercase, hyphenated names: `smart-scan`, `renters-choice`
- Use `--dry-run` to verify your JSON file before spending API credits:
  ```bash
  python scripts/run_project.py --parallel scripts/projects.json --dry-run
  ```
- Each Claude API call is independent; if one project fails, others continue
- The `--json` flag on the status script is useful for piping into `jq` or other tools:
  ```bash
  python scripts/status.py --json | jq '[.[] | select(.stage != "done")]'
  ```
