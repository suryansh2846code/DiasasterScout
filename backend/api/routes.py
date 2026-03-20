from fastapi import APIRouter
from pydantic import BaseModel
import os
import uuid
import time
from datetime import datetime
import json

from model.inference import run_full_pipeline
from pipeline.postprocess import mask_to_geojson, calculate_statistics
from services.claude_service import generate_situation_report

router = APIRouter()

CHECKPOINT_PATH = os.getenv('MODEL_CHECKPOINT_PATH', './checkpoints/disasterscout_best.pth')

DEMO_CACHE = {}
cache_dir = os.path.join(os.path.dirname(__file__), '..', 'demo_cache')
for filename in ['turkey_response.json', 'wayanad_response.json']:
    filepath = os.path.join(cache_dir, filename)
    if os.path.exists(filepath):
        key = filename.replace('_response.json', '')
        with open(filepath) as f:
            DEMO_CACHE[key] = json.load(f)

class AnalyzeRequest(BaseModel):
    pre_image_url: str
    post_image_url: str
    event_name: str
    location: str = "Unknown location"

class ReportRequest(BaseModel):
    stats: dict
    event_name: str
    location: str

def convert_geojson_to_locations_array(geojson):
    locations = []
    for feature in geojson['features']:
        props = feature['properties']
        coords = feature['geometry']['coordinates'][0] # list of [lng, lat]
        
        # calculate centroid
        lngs = [c[0] for c in coords]
        lats = [c[1] for c in coords]
        centroid_lng = sum(lngs) / len(lngs)
        centroid_lat = sum(lats) / len(lats)
        
        priority = "critical" if props['severity'] >= 5 else ("high" if props['severity'] >= 3 else "medium")
        
        loc = {
            "id": props['id'],
            "sectorName": props['sectorName'],
            "damageType": props['damageType'],
            "severity": props['severity'],
            "coords": {
                "lat": centroid_lat,
                "lng": centroid_lng
            },
            "estimatedAffected": props['affectedBuildings'] * 3,
            "confidence": props['confidence'],
            "areaKm2": props['areaKm2'],
            "priority": priority
        }
        locations.append(loc)
    return locations

def generate_alerts_from_stats(stats):
    alerts = []
    now = datetime.utcnow().isoformat() + "Z"
    
    if stats['buildingsDamaged'] > 0:
        alerts.append({
            "id": "alert-1",
            "type": "structural",
            "message": f"Critical: {stats['buildingsDamaged']} buildings detected with structural damage.",
            "severity": "high",
            "timestamp": now
        })
    elif stats.get('floodedAreaKm2', 0) > 0:
        alerts.append({
            "id": "alert-1",
            "type": "flood",
            "message": f"Critical: {stats['floodedAreaKm2']} km² of flooded area detected.",
            "severity": "high",
            "timestamp": now
        })
        
    if stats['roadsBlocked'] > 0:
        alerts.append({
            "id": "alert-2",
            "type": "infrastructure",
            "message": f"Warning: {stats['roadsBlocked']} road blockages identified.",
            "severity": "medium",
            "timestamp": now
        })
        
    total_cases = stats['severeCases'] + stats['moderateCases'] + stats['minorCases']
    alerts.append({
        "id": "alert-3",
        "type": "assessment",
        "message": f"Analysis complete. Found {total_cases} distinct damage zones.",
        "severity": "info",
        "timestamp": now
    })
    
    return alerts

@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    # Serve demo cache if keyword matches
    name_lower = request.event_name.lower()
    if 'turkey' in name_lower and 'turkey' in DEMO_CACHE:
        return DEMO_CACHE['turkey']
    if 'wayanad' in name_lower and 'wayanad' in DEMO_CACHE:
        return DEMO_CACHE['wayanad']
        
    job_id = str(uuid.uuid4())[:8]
    t0 = time.time()
    
    mask, confidence_map, device_used = await run_full_pipeline(
        request.pre_image_url, 
        request.post_image_url, 
        CHECKPOINT_PATH
    )
    
    geojson = mask_to_geojson(mask, confidence_map)
    stats = calculate_statistics(mask, confidence_map)
    
    print("Generating Claude situation report...")
    report = generate_situation_report(
        stats=stats,
        event_name=request.event_name,
        location=request.location
    )
    
    elapsed_time = round(time.time() - t0, 2)
    
    return {
        "job_id": job_id,
        "status": "complete",
        "event": {
            "name": request.event_name,
            "location": request.location,
            "analyzedAt": datetime.utcnow().isoformat() + "Z",
            "satelliteSource": "Uploaded imagery",
            "processingTimeSeconds": elapsed_time
        },
        "stats": stats,
        "geojson": geojson,
        "locations": convert_geojson_to_locations_array(geojson),
        "alerts": generate_alerts_from_stats(stats),
        "report": report
    }

@router.post("/report")
async def generate_report(request: ReportRequest):
    """
    Regenerates situation report from existing stats.
    Used by frontend refresh button.
    """
    report = generate_situation_report(
        stats=request.stats,
        event_name=request.event_name,
        location=request.location
    )
    return {"report": report, "generated_at": datetime.utcnow().isoformat()}

@router.get("/status/{job_id}")
def get_status(job_id: str):
    return {
        "job_id": job_id,
        "status": "queued",
        "progress": 0
    }
