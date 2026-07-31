#!/usr/bin/env python3
"""Hoi P'loy (Pty) Ltd - Xero export adapters for the Cin7-Xero master recon.

This Xero org is multi-currency, so two of its exports come out in layouts the
recon engine cannot read directly. Run this script on the raw exports BEFORE
Gate 0; it writes standard-layout copies into the inputs folder and you then
DELETE the raw originals from that folder. No values are invented - every
number is taken or derived arithmetically from the export itself.

1) Account Transactions (multi-currency layout)
   - Columns arrive as "Debit (ZAR)/Credit (ZAR)/Net (ZAR)" and "Invoice Number",
     and the export includes the debtors control (507) and VAT control (565)
     rows the standard export omits.
   - Adapter: keep every document row, rename Invoice Number -> Number, write
     Net = Credit(ZAR) - Debit(ZAR), drop only the 507/565 control rows, add an
     empty Tax column (sniffer signature only, never computed).
   - Verified July 2026: signed ex-VAT revenue R1,076,352.58 ties to the raw
     export's own revenue net; CN totals tie to Cin7's export to the cent.

2) Trial Balance (Year to date layout)
   - This org's TB exports with "Debit/Credit - Year to date" columns plus
     signed month-end comparison columns; the engine needs the month's
     movement as "31 Jul 2026 Debit/Credit" style pairs.
   - Pull the TB as at PERIOD END with comparison periods so the PRIOR
     month-end column is present (e.g. as at 31 Jul with a 30 Jun column).
   - Adapter: movement = (YTD Debit - YTD Credit) - prior-month signed column,
     per account; split into Debit/Credit by sign; account cell written as
     "Name (code)". Works for P&L accounts (same FY, starts 1 March) and
     balance sheet accounts (balance difference) alike.
   - Verified July 2026: all 218 movements net to 0.00 and revenue lines tie
     line-by-line to the Xero P&L month export (e.g. Light Bulbs 109,132.42).

Usage:
    python3 adapt_xero_exports.py <raw_account_transactions.xlsx> <raw_trial_balance.xlsx> <inputs_folder>
"""
import sys
import pandas as pd
from openpyxl import Workbook

AR_CONTROL, VAT_CONTROL = "507", "565"


def adapt_account_transactions(src, inputs):
    raw = pd.read_excel(src, header=None)
    banner = raw.iloc[0:3, 0].tolist()
    df = raw.iloc[5:].copy()
    df.columns = [str(c).strip() for c in raw.iloc[4]]
    df = df[df["Source"].notna() & (df["Source"].astype(str).str.strip() != "")]
    for c in ["Debit (ZAR)", "Credit (ZAR)"]:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0.0)
    df = df[~df["Account Code"].astype(str).str.strip().isin([AR_CONTROL, VAT_CONTROL])]
    wb = Workbook(); ws = wb.active; ws.title = "Account Transactions"
    for b in banner: ws.append([b])
    ws.append([])
    ws.append(["Date", "Source", "Description", "Number", "Reference",
               "Debit", "Credit", "Net", "Tax", "Account Code", "Account Type"])
    for _, r in df.iterrows():
        ws.append([r["Date"], r["Source"], r["Description"], r["Invoice Number"],
                   r["Reference"], r["Debit (ZAR)"], r["Credit (ZAR)"],
                   round(r["Credit (ZAR)"] - r["Debit (ZAR)"], 2), "",
                   r["Account Code"], r["Account Type"]])
    out = f"{inputs}/Hoi_Ploy_Account_Transactions_adapted.xlsx"
    wb.save(out)
    return out


def adapt_trial_balance(src, inputs):
    raw = pd.read_excel(src, header=None)
    period_banner = str(raw.iloc[2, 0]).strip()          # e.g. "As at 31 July 2026"
    hdr = [str(c).strip() for c in raw.iloc[4]]
    df = raw.iloc[5:].copy()
    df.columns = [h if h != "nan" else f"c{i}" for i, h in enumerate(hdr)]
    df = df[df["Account Code"].notna() & (df["Account Code"].astype(str).str.strip() != "")]
    # first dated comparison column after the YTD pair = prior month-end
    prior_col = next(h for h in hdr if h not in ("nan",) and h[:1].isdigit())
    for c in ["Debit - Year to date", "Credit - Year to date", prior_col]:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0.0)
    mv = ((df["Debit - Year to date"] - df["Credit - Year to date"]) - df[prior_col]).round(2)
    assert abs(mv.sum()) < 0.01, f"derived movements do not net to zero: {mv.sum()}"
    label = period_banner.replace("As at ", "")
    wb = Workbook(); ws = wb.active; ws.title = "Trial Balance"
    ws.append(["Trial Balance"]); ws.append(["Hoi P'loy (Pty) Ltd"])
    ws.append([period_banner]); ws.append([])
    ws.append(["Account", f"{label} Debit", f"{label} Credit"])
    for (_, r), m in zip(df.iterrows(), mv):
        name = f"{str(r['Account']).strip()} ({str(r['Account Code']).strip()})"
        ws.append([name, m if m > 0 else None, -m if m < 0 else None])
    out = f"{inputs}/Hoi_Ploy_Xero_TB_adapted_movement.xlsx"
    wb.save(out)
    return out


if __name__ == "__main__":
    at, tb, inputs = sys.argv[1], sys.argv[2], sys.argv[3]
    print("wrote:", adapt_account_transactions(at, inputs))
    print("wrote:", adapt_trial_balance(tb, inputs))
    print("Now delete the two raw originals from the inputs folder and run Gate 0.")
