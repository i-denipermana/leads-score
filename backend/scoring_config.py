# backend/scoring_config.py
from __future__ import annotations
from dataclasses import dataclass, field, asdict
from typing import List, Optional, Dict, Any
import json, os, pathlib

# ---- Default weights & thresholds (0–100 scoring) ----
DEFAULT_WEIGHTS: Dict[str, Any] = {
    # Fit bands
    "employee_min": 10,
    "employee_max": 200,
    "rev_min": 1_000_000,       # USD
    "rev_max": 50_000_000,      # USD

    # Signal weights (sum ~= 100)
    "w_employee_fit": 25,
    "w_revenue_fit": 20,
    "w_industry_match": 15,
    "w_location_match": 10,
    "w_contact_completeness": 20,
    "w_growth_signal": 10,

    # Priority thresholds
    "hot_threshold": 70,
    "warm_threshold": 40,
}

# ---- Optional user ICP preferences passed from UI/API ----
@dataclass
class ICPPrefs:
    industries: List[str] = field(default_factory=list)  # e.g. ["Manufacturing","Logistics"]
    countries:  List[str] = field(default_factory=list)  # e.g. ["US","CA"]
    states:     List[str] = field(default_factory=list)  # e.g. ["CA","TX"]
    rev_min:    Optional[int] = None                     # override default revenue band if set
    rev_max:    Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

def _merge(a: Dict[str, Any], b: Dict[str, Any]) -> Dict[str, Any]:
    c = a.copy()
    c.update(b or {})
    return c

def load_weights(path: Optional[str] = None) -> Dict[str, Any]:
    """
    Load scoring weights from (in order of precedence):
      1) env var: LEAD_SCORING_WEIGHTS_JSON
      2) explicit file path
      3) config/lead_scoring.json (if exists)
      4) DEFAULT_WEIGHTS (fallback)
    """
    # 1) env
    raw = os.getenv("LEAD_SCORING_WEIGHTS_JSON")
    if raw:
        try:
            return _merge(DEFAULT_WEIGHTS, json.loads(raw))
        except Exception:
            # if invalid JSON, fall through to other sources
            pass

    # 2) explicit path
    if path:
        p = pathlib.Path(path)
        if p.exists():
            with p.open("r", encoding="utf-8") as f:
                return _merge(DEFAULT_WEIGHTS, json.load(f))

    # 3) default config file
    default_path = pathlib.Path("config/lead_scoring.json")
    if default_path.exists():
        with default_path.open("r", encoding="utf-8") as f:
            return _merge(DEFAULT_WEIGHTS, json.load(f))

    # 4) fallback
    return DEFAULT_WEIGHTS.copy()

def priority_label(score: int, weights: Dict[str, Any]) -> str:
    """Translate a score into Hot/Warm/Cold based on thresholds."""
    hot = int(weights.get("hot_threshold", 70))
    warm = int(weights.get("warm_threshold", 40))
    if score >= hot:
        return "Hot"
    if score >= warm:
        return "Warm"
    return "Cold"
