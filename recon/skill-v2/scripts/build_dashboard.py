#!/usr/bin/env python3
"""Merge a recon run into the client's history and render the dashboard.

Usage:
    python3 build_dashboard.py <run.json> --history <client>/recon_history.json \
        --out <client>/dashboard.html

- recon_history.json accumulates every run (weekly or monthly). Re-running the
  same period REPLACES that period's entry (idempotent re-runs), everything
  else is preserved, so the dashboard's period slider can step through every
  previously reconciled period.
- The dashboard is one self-contained HTML file: all history embedded, no
  external data dependencies, safe to email or drop in the client folder.
"""

import argparse
import json
from datetime import datetime
from pathlib import Path

TEMPLATE = Path(__file__).parent.parent / "assets" / "dashboard_template.html"


def merge_history(history_path, run):
    if history_path.exists():
        hist = json.loads(history_path.read_text())
    else:
        hist = {"schema": 1, "client": run["client"], "runs": []}
    hist["client"] = run["client"]
    key = (run.get("period_from"), run.get("cadence"))
    hist["runs"] = [r for r in hist["runs"]
                    if (r.get("period_from"), r.get("cadence")) != key]
    hist["runs"].append(run)
    hist["runs"].sort(key=lambda r: (r.get("period_from") or "", r.get("generated_at") or ""))
    hist["updated_at"] = datetime.now().isoformat(timespec="seconds")
    return hist


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("run_json")
    ap.add_argument("--history", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--no-merge", action="store_true",
                    help="Render from history as-is without merging the run "
                         "(run_json still selects the client)")
    args = ap.parse_args()

    run = json.loads(Path(args.run_json).read_text())
    history_path = Path(args.history)
    if args.no_merge and history_path.exists():
        hist = json.loads(history_path.read_text())
    else:
        hist = merge_history(history_path, run)
        history_path.parent.mkdir(parents=True, exist_ok=True)
        history_path.write_text(json.dumps(hist, indent=1, default=str))

    html = TEMPLATE.read_text()
    payload = json.dumps(hist, default=str)
    html = html.replace("/*__HISTORY_JSON__*/null", payload)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print(f"History: {history_path} ({len(hist['runs'])} run(s))")
    print(f"Dashboard: {out}")


if __name__ == "__main__":
    main()
