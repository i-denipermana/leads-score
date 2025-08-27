from __future__ import annotations
from flask import Blueprint, request, jsonify
import json, pathlib, sys
from backend.scoring_config import load_weights
from backend.scoring import score_and_label_leads

bp = Blueprint("leads", __name__)
DATA_PATH = pathlib.Path(__file__).resolve().parent / "data" / "sample_leads.json"
def normalize_prefs(prefs: dict) -> dict:
    """Convert frontend JSON prefs into proper Python types."""
    industries = [s for s in prefs.get("industries", []) if s]
    countries = [s for s in prefs.get("countries", []) if s]

    def to_number(val):
        if val in (None, "", "null", "undefined"):
            return None
        try:
            return int(val)
        except Exception:
            return None

    return {
        "industries": industries,
        "countries": countries,
        "rev_min": to_number(prefs.get("rev_min")),
        "rev_max": to_number(prefs.get("rev_max")),
    }

def _parse_json_qs(param_value: str | None):
    if not param_value:
        return None
    try:
        return json.loads(param_value)
    except Exception:
        return None

# TEMP demo data so you can run instantly. Replace with your real data source later.
def fetch_leads_somehow():
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)
    
@bp.get("/api/leads")
def get_leads():
    # 1) Pull leads (replace with your real source later)
    leads = fetch_leads_somehow()

    # 2) Optional ICP prefs in querystring: ?prefs={"industries":["Manufacturing"],...}
    prefs = _parse_json_qs(request.args.get("prefs")) or {}
    prefs = normalize_prefs(prefs)
    print(f"[DEBUG] prefs={prefs}", file=sys.stderr)
    weights = load_weights()  # env/file/defaults from scoring_config.py

    # 3) Attach score & priority
    scored = score_and_label_leads(leads, weights=weights, prefs=prefs)

    # 4) Optional min score filter: ?min_score=70
    try:
        min_score = int(request.args.get("min_score", "0"))
    except ValueError:
        min_score = 0
    if min_score > 0:
        scored = [x for x in scored if (x.get("score") or 0) >= min_score]

    # 5) Optional sort: ?sort=score_desc
    if request.args.get("sort") == "score_desc":
        scored.sort(key=lambda x: x.get("score", 0), reverse=True)

    return jsonify(scored)
