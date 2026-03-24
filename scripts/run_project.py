#!/usr/bin/env python3
"""
AIBarracks — Multi-Project Pipeline Runner
==========================================

Runs the full agent chain (PM → Architect → Dev → QA → DevOps) for one or
more projects concurrently. Each project is isolated in its own folder under
projects/. Status is tracked per-project in projects/<name>/status.md.

Usage
-----
Single project:
    python scripts/run_project.py \\
        --project smartscan \\
        --requirement "A barcode scanner web app for warehouse inventory"

Multiple projects in parallel:
    python scripts/run_project.py --parallel scripts/projects.json

Resume a paused or failed pipeline from its current stage:
    python scripts/run_project.py --project smartscan --resume

Dry-run (print what would happen, make no API calls):
    python scripts/run_project.py --project smartscan --requirement "..." --dry-run

Requirements
------------
    pip install anthropic
    export ANTHROPIC_API_KEY=sk-ant-...
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import anthropic

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).parent.parent
AGENTS_DIR = REPO_ROOT / "agents"
PROJECTS_DIR = REPO_ROOT / "projects"

MODEL = "claude-opus-4-6"
MAX_TOKENS = 8192

# Pipeline stages in order. Each entry defines:
#   id          – machine-readable stage name (stored in status.md)
#   agent_file  – which agents/ prompt to use
#   label       – human-readable name
#   input_files – project-relative paths to feed as context (in order)
#   output_file – project-relative path where this stage writes its output
PIPELINE: list[dict[str, Any]] = [
    {
        "id": "pm",
        "agent_file": "project-manager.md",
        "label": "Project Manager",
        "input_files": [],          # receives the raw requirement directly
        "output_file": "task-brief.md",
    },
    {
        "id": "architect",
        "agent_file": "senior-architect.md",
        "label": "Senior Architect",
        "input_files": ["task-brief.md"],
        "output_file": "design.md",
    },
    {
        "id": "dev",
        "agent_file": "frontend-dev.md",   # default: frontend-only
        "label": "Frontend Developer",
        "input_files": ["task-brief.md", "design.md"],
        "output_file": "implementation.md",
    },
    {
        "id": "qa",
        "agent_file": "qa-engineer.md",
        "label": "QA Engineer",
        "input_files": ["task-brief.md", "design.md", "implementation.md"],
        "output_file": "qa/test-plan.md",
        "extra_outputs": ["qa/sign-off.md"],
    },
    {
        "id": "devops",
        "agent_file": "devops.md",
        "label": "DevOps Engineer",
        "input_files": ["task-brief.md", "qa/test-plan.md", "qa/sign-off.md"],
        "output_file": "qa/deployment-report.md",
    },
]

STAGE_IDS = [s["id"] for s in PIPELINE]
DONE_STAGE = "done"
BLOCKED_STAGE = "blocked"

# ---------------------------------------------------------------------------
# Status file helpers
# ---------------------------------------------------------------------------

STATUS_TEMPLATE = """\
# Project Status: {project}

project: {project}
stage: {stage}
started: {started}
last_updated: {last_updated}

## Stage History

{history}
"""


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")


def read_status(project_dir: Path) -> dict[str, str]:
    status_file = project_dir / "status.md"
    if not status_file.exists():
        return {}
    text = status_file.read_text(encoding="utf-8")
    result: dict[str, str] = {}
    for line in text.splitlines():
        if ": " in line and not line.startswith("#") and not line.startswith("-"):
            key, _, value = line.partition(": ")
            result[key.strip()] = value.strip()
    return result


def write_status(
    project_dir: Path,
    stage: str,
    started: str,
    history_lines: list[str],
) -> None:
    status_file = project_dir / "status.md"
    history = "\n".join(f"- {line}" for line in history_lines) if history_lines else "- (none yet)"
    status_file.write_text(
        STATUS_TEMPLATE.format(
            project=project_dir.name,
            stage=stage,
            started=started,
            last_updated=_now(),
            history=history,
        ),
        encoding="utf-8",
    )


def append_history(history: list[str], stage_label: str, note: str = "") -> None:
    ts = _now()
    msg = f"[{ts}] {stage_label} complete"
    if note:
        msg += f" — {note}"
    history.append(msg)


# ---------------------------------------------------------------------------
# Agent invocation
# ---------------------------------------------------------------------------

def load_agent_prompt(agent_file: str) -> str:
    path = AGENTS_DIR / agent_file
    if not path.exists():
        raise FileNotFoundError(f"Agent prompt not found: {path}")
    return path.read_text(encoding="utf-8")


def build_user_message(
    stage: dict[str, Any],
    project_dir: Path,
    requirement: str,
) -> str:
    """
    Compose the user-turn message for this stage.
    For the PM stage this is the raw requirement; for later stages
    it is the concatenated content of the previous outputs.
    """
    if stage["id"] == "pm":
        return (
            "Please process the following requirement and produce a Task Brief.\n\n"
            f"REQUIREMENT\n-----------\n{requirement}"
        )

    parts: list[str] = []
    for rel_path in stage["input_files"]:
        full_path = project_dir / rel_path
        if full_path.exists():
            label = rel_path.replace("/", " / ").replace(".md", "").title()
            parts.append(f"## {label}\n\n{full_path.read_text(encoding='utf-8')}")
        else:
            parts.append(f"## {rel_path}\n\n(not yet available)")

    return "\n\n---\n\n".join(parts)


async def invoke_agent(
    client: anthropic.AsyncAnthropic,
    stage: dict[str, Any],
    project_dir: Path,
    requirement: str,
    dry_run: bool = False,
) -> str:
    """Call the Claude API for one pipeline stage and return the response text."""
    system_prompt = load_agent_prompt(stage["agent_file"])
    user_message = build_user_message(stage, project_dir, requirement)

    if dry_run:
        return f"[DRY RUN] Would invoke {stage['label']} with {len(user_message)} chars of context."

    response = await client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    return response.content[0].text  # type: ignore[union-attr]


# ---------------------------------------------------------------------------
# QA stage — split output into test-plan and sign-off
# ---------------------------------------------------------------------------

_SIGN_OFF_PATTERN = re.compile(
    r"(#+\s*(?:qa\s+)?sign[- ]off.*)",
    re.IGNORECASE | re.DOTALL,
)


def split_qa_output(text: str) -> tuple[str, str]:
    """
    Split QA output into (test_plan, sign_off).
    Looks for a section heading like '## QA Sign-Off' or '## Sign-Off'.
    If none found, the entire text becomes the test plan and sign-off is empty.
    """
    match = _SIGN_OFF_PATTERN.search(text)
    if match:
        split_idx = match.start()
        return text[:split_idx].strip(), text[split_idx:].strip()
    return text.strip(), ""


# ---------------------------------------------------------------------------
# Single-project pipeline
# ---------------------------------------------------------------------------

async def run_pipeline(
    client: anthropic.AsyncAnthropic,
    project_name: str,
    requirement: str,
    resume: bool = False,
    dry_run: bool = False,
) -> None:
    project_dir = PROJECTS_DIR / project_name
    project_dir.mkdir(parents=True, exist_ok=True)
    (project_dir / "qa").mkdir(exist_ok=True)

    # Load existing status if resuming
    existing = read_status(project_dir) if resume else {}
    started = existing.get("started", _now())
    current_stage = existing.get("stage", PIPELINE[0]["id"]) if resume else PIPELINE[0]["id"]

    # Reconstruct history from status file (rough — just carry it forward)
    history: list[str] = []

    tag = f"[{project_name}]"

    if current_stage in (DONE_STAGE, BLOCKED_STAGE):
        print(f"{tag} Already in '{current_stage}' state. Nothing to do.")
        return

    print(f"{tag} Starting pipeline (stage={current_stage}, resume={resume})")
    write_status(project_dir, current_stage, started, history)

    for stage in PIPELINE:
        if STAGE_IDS.index(stage["id"]) < STAGE_IDS.index(current_stage):
            print(f"{tag} Skipping {stage['label']} (already done)")
            continue

        print(f"{tag} → {stage['label']} ...")
        write_status(project_dir, stage["id"], started, history)

        try:
            output_text = await invoke_agent(client, stage, project_dir, requirement, dry_run)
        except Exception as exc:  # noqa: BLE001
            blocker_note = (
                f"\n\n[BLOCKER]\nWhat is blocked: {stage['label']} stage\n"
                f"Why it is blocked: API error — {exc}\n"
                "What is needed to unblock: Investigate the error and re-run with --resume\n"
                "Who should provide it: Human / DevOps\n"
            )
            (project_dir / stage["output_file"]).write_text(blocker_note, encoding="utf-8")
            write_status(project_dir, BLOCKED_STAGE, started, history + [f"BLOCKED at {stage['label']}: {exc}"])
            print(f"{tag} ✗ BLOCKED at {stage['label']}: {exc}", file=sys.stderr)
            return

        # Write primary output
        out_path = project_dir / stage["output_file"]
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(output_text, encoding="utf-8")

        # For QA: split into test-plan + sign-off
        if stage["id"] == "qa" and "extra_outputs" in stage:
            test_plan, sign_off = split_qa_output(output_text)
            out_path.write_text(test_plan, encoding="utf-8")
            sign_off_path = project_dir / "qa/sign-off.md"
            sign_off_path.write_text(sign_off, encoding="utf-8")

        append_history(history, stage["label"])
        print(f"{tag}   ✓ {stage['label']} done → {stage['output_file']}")

    write_status(project_dir, DONE_STAGE, started, history)
    print(f"{tag} Pipeline complete. All outputs in projects/{project_name}/")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

async def main_async(args: argparse.Namespace) -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key and not args.dry_run:
        print("Error: ANTHROPIC_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    client = anthropic.AsyncAnthropic(api_key=api_key or "dry-run")

    if args.parallel:
        # Load project list from JSON
        projects_file = Path(args.parallel)
        if not projects_file.exists():
            print(f"Error: --parallel file not found: {projects_file}", file=sys.stderr)
            sys.exit(1)
        projects = json.loads(projects_file.read_text(encoding="utf-8"))
        if not isinstance(projects, list):
            print("Error: --parallel JSON must be a list of {project, requirement} objects.", file=sys.stderr)
            sys.exit(1)

        tasks = [
            run_pipeline(
                client,
                p["project"],
                p["requirement"],
                resume=args.resume,
                dry_run=args.dry_run,
            )
            for p in projects
        ]
        print(f"Starting {len(tasks)} project(s) in parallel...\n")
        await asyncio.gather(*tasks)

    else:
        if not args.project:
            print("Error: --project is required unless using --parallel.", file=sys.stderr)
            sys.exit(1)
        requirement = args.requirement or ""
        if not requirement and not args.resume:
            print("Error: --requirement is required for a new project run.", file=sys.stderr)
            sys.exit(1)
        if args.resume and not requirement:
            # Load requirement from task-brief if resuming
            brief_path = PROJECTS_DIR / args.project / "task-brief.md"
            if brief_path.exists():
                requirement = brief_path.read_text(encoding="utf-8")
            else:
                print("Error: --requirement is needed; no existing task-brief.md found.", file=sys.stderr)
                sys.exit(1)

        await run_pipeline(
            client,
            args.project,
            requirement,
            resume=args.resume,
            dry_run=args.dry_run,
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="AIBarracks multi-project pipeline runner",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--project", metavar="NAME", help="Project name (lowercase, hyphenated)")
    group.add_argument("--parallel", metavar="FILE", help="JSON file listing multiple projects to run in parallel")

    parser.add_argument("--requirement", metavar="TEXT", help="Plain-language requirement for a new project")
    parser.add_argument("--resume", action="store_true", help="Resume pipeline from the current stage")
    parser.add_argument("--dry-run", action="store_true", help="Print what would happen without calling the API")

    args = parser.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
