import json
import os
from datetime import datetime

os.makedirs('backend/demo_cache', exist_ok=True)

# Helper to generate polygon
def make_poly(lng, lat, offsetx=0.001, offsety=0.001):
    return [
        [lng, lat],
        [lng + offsetx, lat],
        [lng + offsetx, lat + offsety],
        [lng, lat + offsety],
        [lng, lat]
    ]

# Turkey response
turkey_stats = {
    "buildingsDamaged": 347,
    "roadsBlocked": 4,
    "floodedAreaKm2": 0.0,
    "totalAreaAnalyzedKm2": 24.6,
    "confidenceScore": 0.81,
    "severeCases": 89,
    "moderateCases": 158,
    "minorCases": 100
}

turkey_features = []
turkey_locations = []
base_lat, base_lng = 37.57, 36.93

for i in range(10):
    lng = base_lng + (i * 0.005)
    lat = base_lat + ((i % 3) * 0.005)
    poly = make_poly(lng, lat)
    
    props = {
        "id": f"dmg-structural-{i:03d}",
        "damageType": "structural_damage",
        "severity": 5 if i < 3 else (3 if i < 7 else 1),
        "confidence": round(0.7 + (i * 0.02), 3),
        "areaKm2": 0.0024,
        "affectedBuildings": 12,
        "sectorName": f"Sector-{chr(65 + (i % 4))}{i % 3}"
    }
    
    turkey_features.append({
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [poly]
        },
        "properties": props
    })
    
    turkey_locations.append({
        "id": props["id"],
        "sectorName": props["sectorName"],
        "damageType": props["damageType"],
        "severity": props["severity"],
        "coords": {"lat": lat + 0.0005, "lng": lng + 0.0005},
        "estimatedAffected": 36,
        "confidence": props["confidence"],
        "areaKm2": props["areaKm2"],
        "priority": "critical" if props["severity"] >= 5 else "high"
    })

turkey_alerts = [
    {
        "id": "alert-t1",
        "type": "structural",
        "message": f"Critical: 347 buildings detected with structural damage across fault line.",
        "severity": "high",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    },
    {
        "id": "alert-t2",
        "type": "infrastructure",
        "message": "Warning: 4 major road blockages identified hindering logistics.",
        "severity": "medium",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    },
    {
        "id": "alert-t3",
        "type": "assessment",
        "message": "Analysis complete. Found 347 distinct damage zones.",
        "severity": "info",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
]

turkey_report = """Based on the DisasterScout AI satellite assessment of the Kahramanmaraş region, extensive seismic destruction is evident across the 24.6 km² area analyzed. The imagery reveals catastrophic impact with 347 buildings suffering moderate to severe structural damage, resulting in 89 critical cases requiring immediate attention. Confidence in this automated assessment stands at 81%.

We recommend prioritizing immediate heavy urban search and rescue (USAR) deployment to the 89 critical zones, focusing heavily on Sector-A1 and adjacent high-density residential blocks. With 4 major arterial roads confirmed blocked by debris, medical and rescue convoys must rely on rotary-wing air support or alternate unpaved access routes to transport the estimated 1,000+ affected individuals. 

In the immediate 6 hours, coordination teams must establish temporary triage centers outside the structural collapse zones. Traffic management teams are required to clear the confirmed road blockages to establish ground supply lines. Secondary satellite passes should be scheduled to assess the structural integrity of the 158 moderately damaged structures before allowing civilian re-entry."""

turkey_response = {
    "job_id": "demo-turk",
    "status": "complete",
    "event": {
        "name": "Turkey Earthquake",
        "location": "Kahramanmaras",
        "analyzedAt": datetime.utcnow().isoformat() + "Z",
        "satelliteSource": "Demo Imagery",
        "processingTimeSeconds": 1.25
    },
    "stats": turkey_stats,
    "geojson": {"type": "FeatureCollection", "features": turkey_features},
    "locations": turkey_locations,
    "alerts": turkey_alerts,
    "report": turkey_report
}

# Wayanad Response
wayanad_stats = {
    "buildingsDamaged": 189,
    "roadsBlocked": 7,
    "floodedAreaKm2": 8.3,
    "totalAreaAnalyzedKm2": 15.2,
    "confidenceScore": 0.76,
    "severeCases": 45,
    "moderateCases": 89,
    "minorCases": 55
}

wayanad_features = []
wayanad_locations = []
w_lat, w_lng = 11.60, 76.08

for i in range(10):
    lng = w_lng + (i * 0.005)
    lat = w_lat + ((i % 3) * 0.005)
    poly = make_poly(lng, lat)
    
    props = {
        "id": f"dmg-flood-{i:03d}",
        "damageType": "flood" if i % 2 == 0 else "structural_damage",
        "severity": 5 if i < 3 else (3 if i < 7 else 1),
        "confidence": round(0.7 + (i * 0.02), 3),
        "areaKm2": 0.08,
        "affectedBuildings": 5,
        "sectorName": f"Zone-{chr(88 + (i % 3))}{i % 2}"
    }
    
    wayanad_features.append({
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [poly]
        },
        "properties": props
    })
    
    wayanad_locations.append({
        "id": props["id"],
        "sectorName": props["sectorName"],
        "damageType": props["damageType"],
        "severity": props["severity"],
        "coords": {"lat": lat + 0.0005, "lng": lng + 0.0005},
        "estimatedAffected": 15,
        "confidence": props["confidence"],
        "areaKm2": props["areaKm2"],
        "priority": "critical" if props["severity"] >= 5 else "high"
    })

wayanad_alerts = [
    {
        "id": "alert-w1",
        "type": "flood",
        "message": f"Critical: 8.3 km² of flooded area and landslides detected.",
        "severity": "high",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    },
    {
        "id": "alert-w2",
        "type": "infrastructure",
        "message": "Warning: 7 road blockages identified cutting off valley access.",
        "severity": "medium",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    },
    {
        "id": "alert-w3",
        "type": "assessment",
        "message": "Analysis complete. Found 189 damaged structures.",
        "severity": "info",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
]

wayanad_report = """DisasterScout's satellite analysis of the Wayanad region indicates severe landslide and flooding impacts across the 15.2 km² surveyed area. We have identified 8.3 km² of land completely inundated or buried in mudflows, leading to 189 structures sustaining damage. There are 45 critical severity cases isolated in the valley floors. The overall assessment reliability is graded at 76%.

Immediate rescue operations must prioritize aerial deployment, as 7 major road access points have been entirely blocked by mud and debris. Water-bound rescue craft (Zodiacs) and helicopters are urgently required for the 45 critical zones. Given the high concentration of structural damage mixed with flooding, we estimate several hundred residents are currently stranded without dry access routes.

Over the next 6 hours, coordination units should mobilize heavy earth-moving equipment to the perimeter while sending swift-water rescue teams into the Zone-X1 and Zone-Y0 coordinates where flooding is most severe. Medical teams should be pre-positioned at elevated staging areas to receive airlifted evacuees."""

wayanad_response = {
    "job_id": "demo-wayanad",
    "status": "complete",
    "event": {
        "name": "Wayanad Landslides",
        "location": "Kerala, India",
        "analyzedAt": datetime.utcnow().isoformat() + "Z",
        "satelliteSource": "Demo Imagery",
        "processingTimeSeconds": 1.45
    },
    "stats": wayanad_stats,
    "geojson": {"type": "FeatureCollection", "features": wayanad_features},
    "locations": wayanad_locations,
    "alerts": wayanad_alerts,
    "report": wayanad_report
}

with open('backend/demo_cache/turkey_response.json', 'w') as f:
    json.dump(turkey_response, f, indent=2)

with open('backend/demo_cache/wayanad_response.json', 'w') as f:
    json.dump(wayanad_response, f, indent=2)

print("Demo cache files created.")
