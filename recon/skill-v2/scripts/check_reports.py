#!/usr/bin/env python3
"""Gate 0 for the Cin7 <-> Xero master recon: the inputs folder must be
complete before any recon work starts.

Usage:
    python3 check_reports.py <inputs folder> [--period YYYY-MM] [--weekly]

Identifies every export by content (not filename), reports which of the 14
required reports are present / missing / duplicated, and cross-checks that
the dated Cin7 exports all cover the same period. Exits non-zero when the
gate fails, printing exactly what to re-export and from where.
"""

import argparse
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import REGISTRY, REQUIRED, discover, parse_period

# Reports that carry a From/To banner and must agree on the audit period.
# (Pending PO / Outstanding Quotes are deliberately excluded: they are pulled
# for "This year" so nothing pending slips out of the window; the sync report
# and TB are pulled for the period.)
PERIOD_CHECKED = [
    "sale_invoices_cn", "sale_overview", "inv_movement_summary",
    "inv_movement_details", "xero_sync", "pl_by_product", "pending_so",
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--period", help="Expected period as YYYY-MM (monthly runs)")
    ap.add_argument("--weekly", action="store_true",
                    help="Weekly cadence: skip the same-calendar-month assertion")
    args = ap.parse_args()

    folder = Path(args.folder)
    if not folder.is_dir():
        print(f"BLOCKED: inputs folder not found: {folder}")
        sys.exit(2)

    found, unknown = discover(folder)

    print(f"Inputs folder: {folder}\n")
    print(f"{'REPORT':44} {'SOURCE':6} STATUS")
    print("-" * 68)
    missing = []
    for key in REQUIRED:
        spec = REGISTRY[key]
        if key in found:
            print(f"{spec['label']:44} {spec['source']:6} OK  ({Path(found[key]).name})")
        else:
            print(f"{spec['label']:44} {spec['source']:6} MISSING")
            missing.append(key)
    optional = [k for k in found if k not in REQUIRED]
    for key in optional:
        print(f"{REGISTRY[key]['label']:44} {REGISTRY[key]['source']:6} OK (optional)")
    for p, why in unknown:
        print(f"{p.name:44} {'?':6} IGNORED - {why}")

    # Period consistency across the dated Cin7 exports
    print()
    periods = {}
    for key in PERIOD_CHECKED:
        if key in found:
            frm, to = parse_period(found[key])
            if frm and to:
                periods[key] = (frm, to)
    period_fail = False
    if periods:
        counts = Counter(periods.values())
        (main_from, main_to), _ = counts.most_common(1)[0]
        print(f"Detected audit period: {main_from} to {main_to}")
        for key, (frm, to) in periods.items():
            if (frm, to) != (main_from, main_to):
                print(f"  PERIOD MISMATCH: {REGISTRY[key]['label']} covers {frm} to {to}")
                period_fail = True
        if args.period:
            want = args.period
            got = f"{main_from:%Y-%m}"
            if got != want:
                print(f"  PERIOD MISMATCH: expected {want}, exports cover {got}")
                period_fail = True
        if not args.weekly and main_from.month != main_to.month:
            print("  NOTE: period spans more than one calendar month "
                  "(fine for a custom range; pass --weekly to silence)")

    print()
    if missing:
        print("BLOCKED - the recon cannot start. Re-export and drop into the folder:")
        for key in missing:
            spec = REGISTRY[key]
            print(f"  - {spec['label']} (from {spec['source']}; see references/report-pull-guide.md)")
        sys.exit(1)
    if period_fail:
        print("BLOCKED - exports cover different periods. Re-export the mismatched "
              "reports for the same From/To dates.")
        sys.exit(1)
    print("GATE PASSED - all 14 required reports present and periods agree.")


if __name__ == "__main__":
    main()
