#!/usr/bin/env python3
"""
AIBarracks — Project Status Dashboard
======================================

Scans all project folders under projects/ and prints a status table showing
where each project is in the agent pipeline.

Usage
-----
    python scripts/status.py              # Table view (default)
    python scripts/status.py --json       # Machine-readable JSON
    python scripts/status.py --project X  # Detail view for one project

Pipeline stages (in order)
---------------------------
    pm → architect → dev → qa → devops → done
    (blocked = pipeline paused due to an error or API failure)
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PROJECTS_DIR = REPO_ROOT / "projects"

# Stage display order and labels
STAGES = ["pm", "architect", "dev", "qa", "devops", "done", "blocked"]

STAGE_LABEL: dict[str, str] = {
    "pm":         "PM",
    "architect":  "Architect",
    "dev":        "Dev",
    "qa":         "QA",
    "devops":     "DevOps",
    "done":       "Done",
    "blocked":    "BLOCKED",
    "":           "(not started)",
}

STAGE_ICON: dict[str, str] = {
    "pm":         "●",
    "architect":  "●",
    "dev":        "●",
    "qa":         "●",
    "devops":     "●",
    "done":       "✓",
    "blocked":    "✗",
    "":           "○",
}

# ---------------------------------------------------------------------------
# Status file parsing
# ---------------------------------------------------------------------------

def read_status(project_dir: Path) -> dict[str, str]:
    """Parse key: value pairs from a project's status.md."""
    status_file = project_dir / "status.md"
    if not status_file.exists():
        return {}
    result: dict[str, str] = {}
    for line in status_file.read_text(encoding="utf-8").splitlines():
        if ": " in line and not line.startswith("#") and not line.startswith("-"):
            key, _, value = line.partition(": ")
            result[key.strip()] = value.strip()
    return result


def scan_projects() -> list[dict[str, str]]:
    """Return a list of project status dicts, sorted by last_updated descending."""
    if not PROJECTS_DIR.exists():
        return []

    results: list[dict[str, str]] = []
    for child in sorted(PROJECTS_DIR.iterdir()):
        if not child.is_dir():
            continue
        status = read_status(child)
        results.append(
            {
                "project": child.name,
                "stage": status.get("stage", ""),
                "started": status.get("started", "—"),
                "last_updated": status.get("last_updated", "—"),
            }
        )

    # Sort: blocked first, then active (non-done), then done, alpha within each
    def sort_key(p: dict[str, str]) -> tuple[int, str]:
        stage = p["stage"]
        if stage == "blocked":
            return (0, p["project"])
        if stage == "done":
            return (2, p["project"])
        if stage == "":
            return (3, p["project"])
        return (1, p["project"])

    return sorted(results, key=sort_key)


# ---------------------------------------------------------------------------
# Output formatters
# ---------------------------------------------------------------------------

def print_table(projects: list[dict[str, str]]) -> None:
    if not projects:
        print("No projects found under projects/")
        return

    col_project = max(len(p["project"]) for p in projects)
    col_project = max(col_project, 7)
    col_stage = 10
    col_updated = 22

    header = (
        f"{'PROJECT':<{col_project}}  "
        f"{'STAGE':<{col_stage}}  "
        f"{'LAST UPDATED':<{col_updated}}"
    )
    sep = "─" * len(header)

    print(header)
    print(sep)

    for p in projects:
        stage = p["stage"]
        icon = STAGE_ICON.get(stage, "●")
        label = STAGE_LABEL.get(stage, stage)
        display = f"{icon} {label}"
        print(
            f"{p['project']:<{col_project}}  "
            f"{display:<{col_stage + 2}}  "   # +2 for the icon + space
            f"{p['last_updated']:<{col_updated}}"
        )

    print()
    active = sum(1 for p in projects if p["stage"] not in ("done", "blocked", ""))
    done = sum(1 for p in projects if p["stage"] == "done")
    blocked = sum(1 for p in projects if p["stage"] == "blocked")
    print(f"  {active} running  |  {done} done  |  {blocked} blocked")


def print_project_detail(project_name: str) -> None:
    project_dir = PROJECTS_DIR / project_name
    if not project_dir.exists():
        print(f"Project '{project_name}' not found under projects/", file=sys.stderr)
        sys.exit(1)

    status = read_status(project_dir)
    stage = status.get("stage", "")
    print(f"\nProject:      {project_name}")
    print(f"Stage:        {STAGE_ICON.get(stage, '●')} {STAGE_LABEL.get(stage, stage)}")
    print(f"Started:      {status.get('started', '—')}")
    print(f"Last updated: {status.get('last_updated', '—')}")

    print("\nOutput files:")
    output_map = [
        ("task-brief.md",          "PM"),
        ("design.md",              "Architect"),
        ("implementation.md",      "Dev"),
        ("qa/test-plan.md",        "QA — Test Plan"),
        ("qa/sign-off.md",         "QA — Sign-Off"),
        ("qa/deployment-report.md","DevOps"),
    ]
    for rel, label in output_map:
        path = project_dir / rel
        mark = "✓" if path.exists() else "○"
        print(f"  {mark}  {label:<25}  {rel}")

    # Show blocker note if blocked
    if stage == "blocked":
        print("\n[!] Pipeline is BLOCKED. Check the output file for the [BLOCKER] note.")
        for rel, _ in output_map:
            path = project_dir / rel
            if path.exists():
                text = path.read_text(encoding="utf-8")
                if "[BLOCKER]" in text:
                    idx = text.index("[BLOCKER]")
                    print("\n" + text[idx:idx + 600])
                    break


def print_json(projects: list[dict[str, str]]) -> None:
    print(json.dumps(projects, indent=2))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="AIBarracks project status dashboard",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--project", metavar="NAME", help="Show detail for a single project")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    args = parser.parse_args()

    if args.project:
        print_project_detail(args.project)
    elif args.json:
        print_json(scan_projects())
    else:
        print_table(scan_projects())


if __name__ == "__main__":
    main()
