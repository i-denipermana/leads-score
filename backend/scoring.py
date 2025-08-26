# backend/scoring.py
from __future__ import annotations
from typing import Dict, Any, Iterable, List
import json
from math import isfinite

from .scoring_config import load_weights, ICPPrefs, priority_label

def _clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))

def _to_number(v) -> float:
    """
    Best-effort numeric parser. Accepts int/float, or strings like "12,345", "$1.2M".
    Returns 0.0 on failure.
    """
    if v is None:
        return 0.0
    if isinstance(v, (int, float)):
        return float(v) if isfinite(float(v)) else 0.0
    s = str(v).strip().upper()
    # Handle suffixes
    mult = 1.0
    if s.endswith("K"):
        mult, s = 1e3, s[:-1]
    elif s.endswith("M"):
        mult, s = 1e6, s[:-1]
    elif s.endswith("B"):
        mult, s = 1e9, s[:-1]
    # Remove currency/commas
    s = s.replace("$", "").replace(",", "").strip()
    try:
        return float(s) * mult
    except Exception:
        return 0.0

def score_lead(
    lead: Dict[str, Any],
    weights: Dict[str, Any],
    prefs: Dict[str, Any] | ICPPrefs | None = None,
) -> int:
    """
    Heuristic 0–100 scoring using:
      - employee fit, revenue fit
      - ICP match (industry/geo)
      - contact completeness (email/phone/linkedin)
      - growth signal (growjo_rank <= 10k OR hiring==True)
    Robust to missing fields.
    """
    # Normalize prefs
    if isinstance(prefs, ICPPrefs):
        P = prefs.to_dict()
    else:
        P = (prefs or {})

    W = dict(weights or {})

    s = 0.0

    # 1) Employee band fit
    emp = _to_number(lead.get("employee_count") or lead.get("employees"))
    if emp > 0:
        a, b = _to_number(W.get("employee_min", 10)), _to_number(W.get("employee_max", 200))
        if a <= emp <= b:
            fit = 1.0
        elif emp < a:
            fit = _clamp01(emp / a)  # closer to min = better
        else:
            fit = _clamp01(b / emp)  # beyond max = taper
        s += fit * _to_number(W.get("w_employee_fit", 25))

    # 2) Revenue band fit (allow prefs override)
    rev = _to_number(lead.get("revenue_usd") or lead.get("revenue"))
    rmin = _to_number(P.get("rev_min", W.get("rev_min", 1_000_000)))
    rmax = _to_number(P.get("rev_max", W.get("rev_max", 50_000_000)))
    if rev > 0 and rmin > 0 and rmax > 0 and rmax >= rmin:
        if rmin <= rev <= rmax:
            fit = 1.0
        elif rev < rmin:
            fit = _clamp01(rev / rmin)
        else:
            fit = _clamp01(rmax / rev)
        s += fit * _to_number(W.get("w_revenue_fit", 20))

    # 3) ICP matches
    industries = set(map(str, P.get("industries", [])))
    if industries and str(lead.get("industry", "")).strip() in industries:
        s += _to_number(W.get("w_industry_match", 15))

    countries = set(map(str, P.get("countries", [])))
    states = set(map(str, P.get("states", [])))
    lead_country = str(lead.get("country", "")).strip()
    lead_state = str(lead.get("state", "")).strip()
    if (countries and lead_country in countries) or (states and lead_state in states):
        s += _to_number(W.get("w_location_match", 10))

    # 4) Contact completeness
    completeness = 0
    for k in ("email", "phone", "linkedin"):
        if lead.get(k):
            completeness += 1
    s += (completeness / 3.0) * _to_number(W.get("w_contact_completeness", 20))

    # 5) Growth signal
    growjo = _to_number(lead.get("growjo_rank"))
    hiring = bool(lead.get("hiring"))
    if (growjo and growjo <= 10000) or hiring:
        s += _to_number(W.get("w_growth_signal", 10))

    # Cap & round
    return int(round(min(s, 100.0)))

def score_and_label_leads(
    leads: Iterable[Dict[str, Any]],
    weights: Dict[str, Any] | None = None,
    prefs: Dict[str, Any] | ICPPrefs | None = None,
) -> List[Dict[str, Any]]:
    W = weights or load_weights()
    result: List[Dict[str, Any]] = []
    for ld in leads:
        sc = score_lead(ld, W, prefs=prefs)
        lbl = priority_label(sc, W)
        # do not mutate original ref if caller expects immutability
        out = dict(ld)
        out["score"] = sc
        out["priority"] = lbl
        result.append(out)
    return result
