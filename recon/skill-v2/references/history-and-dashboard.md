# History, findings and the dashboard

## The three files in a customer folder

- `recon_config.json` - per-customer calibration (tolerances, `tb_expected_extra`,
  `cn_prefixes`). Created on the first run, edited rarely.
- `recon_history.json` - every run ever performed. `build_dashboard.py` merges each new run in;
  a re-run of the SAME period (same `period_from` + `cadence`) replaces that entry only, so
  re-running is always safe and prior periods are never recomputed. Weekly, monthly and custom
  runs can coexist - each is its own entry on the slider, sorted by period start.
- `dashboard.html` - regenerated every run from the full history. Self-contained (all data
  embedded), works offline, safe to email.

## Run JSON shape (what the engine writes)

```json
{
  "schema": 1, "client": "...", "cadence": "monthly|weekly|custom",
  "period_label": "May 2026", "period_from": "2026-05-01", "period_to": "2026-05-31",
  "generated_at": "...", "overall_health": 61.5,
  "status_counts": {"action": 2, "watch": 4, "clear": 5, "info": 2, "not_run": 0},
  "reports_loaded": {"sale_overview": "file.xlsx", "...": "..."},
  "checks": [{"key": "tb", "title": "...", "status": "action", "system": "Both systems",
              "exceptions": 3, "value": 327287.37, "headline": "...",
              "columns": ["..."], "rows": [{"...": "..."}], "detail": {},
              "resolution": "..."}],
  "findings": []
}
```

`checks[].rows` is capped at 200 rows per check for dashboard size; the Excel audit pack and
the source exports carry the full population.

## The findings register (the human layer)

After reviewing, append findings to the run JSON before building the dashboard:

```json
{"severity": "action|watch", "finding": "what is wrong, factually",
 "action": "the fix, imperative", "owner": "initials", "due": "YYYY-MM-DD",
 "carried_over": false, "system": "Cin7|Xero|Both systems"}
```

Carry-over rule: before writing findings, read the PREVIOUS run's findings from the history.
Any prior finding whose underlying exception still appears this period is restated with
`"carried_over": true` (orange edge on the dashboard). Resolved findings are simply not
restated - the prior period's entry remains in history as the record that it happened.

## What the dashboard shows per selected period

Overall-health gauge; action/watch/clear tiles with deltas vs the prior run; required-report
coverage (x/14); the health-and-exceptions trend across all runs (click a point to jump); the
13 checks worst-first, each with its system chip, exception count, rand value, delta chip,
expandable exception table and resolution note; the findings register. The **period slider**
(and prev/next, and the trend points, and the tick labels) all step through history. Printing
expands all check detail automatically.

## Regenerating or repairing

- Dashboard looks stale: re-run `build_dashboard.py` with `--no-merge` to re-render from
  history as-is.
- A period was run with wrong exports: fix the inputs, re-run the engine for that period, and
  merge - the period is replaced in place.
- Never hand-edit computed numbers in the history; config and findings are the only human
  inputs.
