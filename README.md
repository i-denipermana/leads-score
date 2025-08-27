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



## 🌍 Live Demo

- **Frontend UI:** [http://143.198.127.24:5173](http://143.198.127.24:5173)  
- **Backend API:** [http://143.198.127.24:5000/api/leads](http://143.198.127.24:5000/api/leads)

Example query:
```bash
curl "http://143.198.127.24:5000/api/leads?sort=score_desc&min_score=70" | jq
```

---

## ⚙️ Tech Stack

- **Backend:** Python 3.10+, Flask  
- **Frontend:** React + Vite + TypeScript  
- **Testing:** Pytest  
- **Dataset:** `data/sample_leads.json` (synthetic sample, 500 companies)

---

## 🚀 Run Locally

## 🐳 Run with Docker (Recommended)

### Requirements
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Build & Start
From the repo root:
```bash
docker-compose build
docker-compose up
```
## Run without Docker (optional)

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
```

Open [http://198.127.24](http://198.127.24) in your browser.

### Jupyter Notebook Demo 
Open [https://colab.research.google.com/drive/1OgYRVG5voT_2PdzPjdj4P9wliyWh04s1?usp=sharing](https://colab.research.google.com/drive/1OgYRVG5voT_2PdzPjdj4P9wliyWh04s1?usp=sharing)

### Test
```bash
pytest -q
```
