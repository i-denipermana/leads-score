# backend/tests/test_scoring.py
from backend.scoring import score_lead
from backend.scoring_config import load_weights, priority_label, ICPPrefs

def L(**k): return k  # tiny helper to build dicts

def test_hot_beats_cold_with_fit_and_contacts():
    W = load_weights()

    hot = L(
        employee_count=120, revenue_usd=5_000_000,
        industry="Manufacturing", country="US", state="CA",
        email="hi@acme.com", phone="555", linkedin="ln",
        growjo_rank=9000, hiring=True
    )
    cold = L(
        employee_count=5, revenue_usd=200_000,
        industry="Other", country="US", state="UT",
        email=None, phone=None, linkedin=None,
        growjo_rank=None, hiring=False
    )
    prefs = ICPPrefs(industries=["Manufacturing"], countries=["US"])

    sh = score_lead(hot, W, prefs=prefs)
    sc = score_lead(cold, W, prefs=prefs)

    assert sh >= 70, f"expected hot score >= 70, got {sh}"
    assert sc <= 40, f"expected cold score <= 40, got {sc}"
    assert sh > sc

def test_priority_label_thresholds_default():
    W = load_weights()
    assert priority_label(80, W) == "Hot"
    assert priority_label(70, W) == "Hot"
    assert priority_label(55, W) == "Warm"
    assert priority_label(40, W) == "Warm"
    assert priority_label(39, W) == "Cold"

def test_missing_fields_do_not_crash_and_yield_low_score():
    W = load_weights()
    incomplete = L(name="UnknownCo")  # missing most fields
    s = score_lead(incomplete, W, prefs=None)
    assert 0 <= s <= 40
