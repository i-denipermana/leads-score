# Lead Scoring & Prioritization Demo

This project is my submission for the Caprae Capital **Full Stack Developer AI-Readiness Challenge**.

It enhances the reference lead generation tool by adding an **Intelligent Lead Scoring** layer.

---

## 🌟 Feature Overview

- **Lead Scoring (0–100)**  
  Each lead is automatically scored based on:
  - Employee count fit  
  - Revenue band fit  
  - ICP matches (industry, country/state)  
  - Contact completeness (email, phone, LinkedIn)  
  - Growth signals (Growjo rank, hiring flag)

- **Priority Labels**  
  - Hot (≥ 70)  
  - Warm (40–69)  
  - Cold (< 40)

- **API Enhancements**  
  - `GET /api/leads?sort=score_desc&min_score=70&prefs={...}`  
  - Adds `score` and `priority` fields to each lead

- **Frontend UX**  
  - Sort by score  
  - “Top leads only (≥70)” toggle  
  - Editable ICP preferences (industries, countries, revenue range)  
  - Hot/Warm/Cold badge with tooltip explaining factors

---

## ⚙️ Tech Stack

- **Backend:** Python 3.10+, Flask  
- **Frontend:** React + Vite + TypeScript  
- **Testing:** Pytest  
- **Dataset:** `data/sample_leads_500.json` (synthetic sample, 500 companies)

---

## 🚀 Run Locally

### Backend
```bash
# from repo root
python -m venv .venv
source .venv/bin/activate   # or .\.venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
# start Flask
python -m backend.app

API is available at: http://127.0.0.1:5000/api/leads
```

### Frontend
```bash
cd frontend
npm install
npm run dev

Open http://localhost:5173 in your browser.
```

### Test
```bash
pytest -q
```
