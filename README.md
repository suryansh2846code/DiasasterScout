# DisasterScout 🛰️

> AI-powered satellite imagery damage assessment for disaster response.
> From satellite image to rescue-ready damage map in under 5 minutes.

![DisasterScout Dashboard](https://img.shields.io/badge/Status-Live-success)
![ML Track](https://img.shields.io/badge/Track-ML%20%2B%20AI-blue)
![Built In](https://img.shields.io/badge/Built%20In-13%20Hours-orange)

---

## The Problem

Every major disaster — Turkey 2023, Wayanad 2024, Assam floods — 
has satellite imagery captured within hours. But usable damage maps 
take 48 hours because human analysts must manually interpret every image.

In those 48 hours, survival rates for trapped individuals drop from 
**90% at 24 hours to under 30% by 72 hours**.

The bottleneck is not data. It is analysis.

---

## The Solution

DisasterScout automates the entire damage assessment pipeline:

- Submit before and after satellite image URLs
- AI model detects flood zones, structural damage, and road blockages
- Results appear as a color-coded interactive map in under 5 minutes
- Claude/Groq LLM generates a natural language situation report
- Export damage map as GeoJSON directly into QGIS, Google Earth, ArcGIS

---

## Live Demo
```
Event Name: 2023 Turkey-Syria Earthquake
Location:   Kahramanmaraş, Turkey
Pre URL:    https://picsum.photos/seed/before/512/512
Post URL:   https://picsum.photos/seed/after/512/512
```

Or simply click **Load Demo Scenario** for instant results.

---

## Features

- 🗺️ **Interactive damage map** — color-coded polygons on dark CartoDB tiles
- 🔵 **Flood detection** — pixel-level flood zone mapping
- 🔴 **Structural damage** — collapsed building identification
- 🟠 **Road blockage** — blocked route detection with GPS coordinates
- 🤖 **AI situation report** — LLM-generated emergency brief with rescue recommendations
- 📊 **Bloomberg-style dashboard** — draggable panels, donut chart, confidence gauge, timeline
- 📍 **Export** — GeoJSON, CSV, and TXT situation report downloads
- ⚡ **Demo cache** — instant pre-validated scenarios for Turkey and Wayanad

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework |
| Leaflet.js + React-Leaflet | Interactive damage map |
| React-Grid-Layout | Draggable Bloomberg-style panels |
| Recharts | Donut chart, bar chart, timeline |
| React-Circular-Progressbar | Confidence gauge |
| Axios | API integration with polling |

### Backend + ML
| Technology | Purpose |
|-----------|---------|
| FastAPI | Async Python API |
| PyTorch 2.1 | Model training and inference |
| Segmentation-models-pytorch | U-Net with ResNet-50 encoder |
| xBD Dataset | US DoD building damage annotations |
| Rasterio + Scipy | Mask to GeoJSON conversion |
| Groq LLaMA3-70b | Natural language situation reports |
| Docker + Redis + Nginx | Infrastructure |

---

## ML Model

- **Architecture:** U-Net with ResNet-50 encoder
- **Input:** 6 channels (3 RGB pre + 3 RGB post concatenated)
- **Output:** 4 damage classes per pixel
- **Dataset:** xBD — 550,000+ annotated buildings, 19,000 km², 10 countries
- **Training:** Google Colab T4 GPU, CrossEntropyLoss with class weights
- **Parameters:** ~32 million

### Damage Classes
| Class | Label | Color |
|-------|-------|-------|
| 0 | No Change | Transparent |
| 1 | Flood | 🔵 Blue |
| 2 | Structural Damage | 🔴 Red |
| 3 | Road Blockage | 🟠 Orange |

---

## Project Structure
```
DisasterScout/
├── frontend/                    # React dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx      # Leaflet map with damage polygons
│   │   │   ├── Sidebar.jsx      # Stats, alerts, situation report
│   │   │   ├── DraggableDashboard.jsx  # Bloomberg-style panels
│   │   │   ├── DamageTicker.jsx # Scrolling damage ticker
│   │   │   ├── SituationReport.jsx     # AI report with typewriter
│   │   │   ├── AnalyzePanel.jsx # Image URL input form
│   │   │   └── charts/          # Donut, bar, gauge, timeline
│   │   ├── hooks/
│   │   │   └── useAnalysis.js   # API calls + polling + fallback
│   │   └── data/
│   │       └── mockData.js      # Turkey earthquake demo data
│   └── package.json
│
├── backend/                     # FastAPI + ML pipeline
│   ├── main.py                  # FastAPI application
│   ├── model/
│   │   ├── architecture.py      # U-Net model definition
│   │   └── inference.py         # Model loading and inference
│   ├── pipeline/
│   │   ├── preprocess.py        # Image download and normalization
│   │   └── postprocess.py       # Mask to GeoJSON conversion
│   ├── api/
│   │   └── routes.py            # API endpoints
│   ├── services/
│   │   └── claude_service.py    # LLM situation report
│   ├── demo_cache/              # Pre-built demo responses
│   │   ├── turkey_response.json
│   │   └── wayanad_response.json
│   └── notebooks/
│       └── 01_train.ipynb       # Google Colab training notebook
│
└── docker-compose.yml           # All services
```

---

## Setup and Running

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Environment Variables

Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
MODEL_CHECKPOINT_PATH=./checkpoints/disasterscout_best.pth
DEVICE=cpu
REDIS_URL=redis://localhost:6379
```

Get free Groq API key at: https://console.groq.com

### Full Stack with Docker
```bash
docker compose up
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:8000`

---

## Training the Model

1. Download xBD dataset from https://xview2.org/dataset
2. Upload to Google Drive at `MyDrive/xBD/`
3. Open `notebooks/01_train.ipynb` in Google Colab
4. Connect to T4 GPU runtime
5. Run all cells
6. Download checkpoint to `backend/checkpoints/disasterscout_best.pth`

---

## API Reference

### POST /api/analyze
```json
{
  "pre_image_url": "https://...",
  "post_image_url": "https://...",
  "event_name": "2023 Turkey-Syria Earthquake",
  "location": "Kahramanmaraş, Turkey"
}
```

**Response:**
```json
{
  "status": "complete",
  "event": { "name": "...", "analyzedAt": "..." },
  "stats": {
    "buildingsDamaged": 347,
    "roadsBlocked": 4,
    "totalAreaAnalyzedKm2": 24.6,
    "confidenceScore": 0.81
  },
  "geojson": { "type": "FeatureCollection", "features": [...] },
  "locations": [...],
  "alerts": [...],
  "report": "AI-generated situation report..."
}
```

### GET /health
```json
{
  "status": "ok",
  "gpu": false,
  "model_loaded": false,
  "version": "0.1.0"
}
```

---

## Demo Scenarios

### Turkey Earthquake (Primary)
- Event: `2023 Turkey-Syria Earthquake`
- Location: `Kahramanmaraş, Turkey`
- Buildings damaged: 347
- Roads blocked: 4
- Confidence: 81%

### Wayanad Landslide (Secondary)
- Event: `2024 Wayanad Landslide`
- Location: `Wayanad, Kerala, India`
- Buildings damaged: 189
- Roads blocked: 7
- Confidence: 76%

---

## Impact

> Studies from the Nepal 2015 earthquake show survival rates 
> drop from 90% at 24 hours to under 30% by 72 hours for 
> trapped individuals. Even a 6-hour improvement in rescue 
> coordination can save hundreds of lives per disaster event.

**Target users:**
- NDRF — National Disaster Response Force India
- Red Cross — International disaster response
- UN OCHA — Humanitarian coordination
- State disaster management authorities
- Insurance companies — damage quantification

---

## Existing Solutions vs DisasterScout

| Feature | Copernicus EMS | UNOSAT | DisasterScout |
|---------|---------------|--------|---------------|
| Time to map | 24-48 hours | 24-48 hours | Under 5 min |
| Automated | No | No | Yes |
| Open source | No | No | Yes |
| API accessible | No | No | Yes |
| AI report | No | No | Yes |
| Cost | Gov only | UN only | Free |

---

## Team

Built in 13 hours at hackathon — ML + AI Track

| Role | Responsibilities |
|------|----------------|
| Teammate A — ML + Backend | U-Net model, training pipeline, FastAPI, preprocessing, postprocessing, LLM integration |
| Teammate B — Frontend | React dashboard, Leaflet map, Bloomberg UI, draggable panels, charts, UX design |

---

## License

MIT License — free to use, modify, and distribute.

---

*The satellites are already watching. The rescue teams are already 
on the ground. The only thing missing is the map that connects them.*

**That is DisasterScout.**
