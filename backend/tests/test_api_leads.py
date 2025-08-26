# backend/tests/test_api_leads.py
import json
import types

import backend.routes as routes

def test_api_scored_sorted_and_filtered(client, monkeypatch):
    # Provide deterministic test data
    def fake_fetch():
        return [
            {
                "id": "a1", "name": "Acme Robotics", "industry": "Manufacturing",
                "country": "US", "state": "CA",
                "employee_count": 120, "revenue_usd": 5_000_000,
                "email": "hello@acme.com", "phone": "555-1234", "linkedin": "ln",
                "growjo_rank": 9000, "hiring": True
            },
            {
                "id": "b1", "name": "Tiny Co", "industry": "Other",
                "country": "US", "state": "UT",
                "employee_count": 5, "revenue_usd": 200_000,
                "email": None, "phone": None, "linkedin": None,
                "growjo_rank": None, "hiring": False
            }
        ]
    monkeypatch.setattr(routes, "fetch_leads_somehow", fake_fetch, raising=True)

    # Sorted + filtered + ICP prefs
    prefs = {"industries": ["Manufacturing"], "countries": ["US"], "rev_min": 1_000_000, "rev_max": 50_000_000}
    res = client.get(
        "/api/leads",
        query_string={"sort": "score_desc", "min_score": "70", "prefs": json.dumps(prefs)}
    )
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    # Only "Acme Robotics" should pass min_score=70 in this dataset
    assert len(data) == 1
    assert data[0]["name"] == "Acme Robotics"
    assert data[0]["score"] >= 70
    assert data[0]["priority"] == "Hot"

def test_api_basic_unfiltered(client, monkeypatch):
    def fake_fetch():
        return [
            {"id": "x", "name": "NoData Inc."},  # should score low, but present
        ]
    monkeypatch.setattr(routes, "fetch_leads_somehow", fake_fetch, raising=True)

    res = client.get("/api/leads")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 1
    assert "score" in data[0]
    assert "priority" in data[0]
