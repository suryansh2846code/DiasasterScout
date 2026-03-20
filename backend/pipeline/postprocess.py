import numpy as np
from datetime import datetime
from scipy import ndimage
from model.architecture import DAMAGE_CLASSES

def mask_to_geojson(mask: np.ndarray, confidence_map: np.ndarray, center_lat=37.57, center_lng=36.93):
    pixel_size_deg = 0.0001
    
    features = []
    
    for class_id in [1, 2, 3]:
        class_name = DAMAGE_CLASSES.get(class_id, "unknown")
        binary_mask = (mask == class_id).astype(np.uint8)
        
        labeled_mask, num_features = ndimage.label(binary_mask)
        
        for i in range(1, num_features + 1):
            component_mask = (labeled_mask == i)
            component_pixel_count = component_mask.sum()
            
            if component_pixel_count < 25:
                continue
                
            slices = ndimage.find_objects(component_mask)[0]
            y_min, y_max = slices[0].start, slices[0].stop
            x_min, x_max = slices[1].start, slices[1].stop
            
            def pix2coord(x, y):
                lng = center_lng + (x - 256) * pixel_size_deg
                lat = center_lat - (y - 256) * pixel_size_deg
                return [lng, lat]
                
            coords = [
                pix2coord(x_min, y_min),
                pix2coord(x_max, y_min),
                pix2coord(x_max, y_max),
                pix2coord(x_min, y_max),
                pix2coord(x_min, y_min)
            ]
            
            mean_conf = float(confidence_map[component_mask].mean())
            
            if mean_conf > 0.85:
                severity = 5
            elif mean_conf > 0.75:
                severity = 4
            elif mean_conf > 0.65:
                severity = 3
            elif mean_conf > 0.55:
                severity = 2
            else:
                severity = 1
                
            area_km2 = float(component_pixel_count * 0.0001)
            affected_buildings = max(1, int(component_pixel_count // 50))
            
            x_center = (x_min + x_max) / 2
            y_center = (y_min + y_max) / 2
            col = "A" if x_center < 170 else ("B" if x_center < 340 else "C")
            row = 1 if y_center < 170 else (2 if y_center < 340 else 3)
            sector_name = f"{col}{row}"
            
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [coords]
                },
                "properties": {
                    "id": f"dmg-{class_name}-{i:03d}",
                    "damageType": class_name,
                    "severity": severity,
                    "confidence": round(mean_conf, 3),
                    "areaKm2": round(area_km2, 4),
                    "affectedBuildings": affected_buildings,
                    "sectorName": sector_name
                }
            }
            features.append(feature)
            
    return {
        "type": "FeatureCollection",
        "features": features
    }

def calculate_statistics(mask: np.ndarray, confidence_map: np.ndarray):
    pixel_area_km2 = 0.0001
    
    flood_pixels = (mask == 1).sum()
    structural_pixels = (mask == 2).sum()
    road_pixels = (mask == 3).sum()
    total_pixels = mask.size
    
    binary_mask = (mask > 0).astype(np.uint8)
    labeled_mask, num_features = ndimage.label(binary_mask)
    
    severe_count = 0
    moderate_count = 0
    minor_count = 0
    
    for i in range(1, num_features + 1):
        component_mask = (labeled_mask == i)
        if component_mask.sum() < 25:
            continue
        mean_conf = float(confidence_map[component_mask].mean())
        if mean_conf > 0.75:
            severe_count += 1
        elif mean_conf > 0.55:
            moderate_count += 1
        else:
            minor_count += 1

    return {
        "floodedAreaKm2": round(float(flood_pixels * pixel_area_km2), 2),
        "buildingsDamaged": int(structural_pixels // 30),
        "roadsBlocked": int(road_pixels // 100),
        "totalAreaAnalyzedKm2": round(float(total_pixels * pixel_area_km2), 2),
        "confidenceScore": round(float(confidence_map.mean()), 3),
        "severeCases": severe_count,
        "moderateCases": moderate_count,
        "minorCases": minor_count
    }

def generate_report_prompt(stats, event_name, location):
    return f"""You are a professional disaster response coordinator 
    generating an emergency situation report.
    
    Based on the following satellite damage assessment data from 
    DisasterScout AI analysis, write a professional 3-paragraph 
    situation report.
    
    EVENT: {event_name}
    LOCATION: {location}
    ANALYSIS TIME: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}
    
    DAMAGE STATISTICS:
    - Buildings damaged: {stats['buildingsDamaged']}
    - Roads blocked: {stats['roadsBlocked']}
    - Flooded area: {stats['floodedAreaKm2']} km²
    - Total area analyzed: {stats['totalAreaAnalyzedKm2']} km²
    - Confidence score: {stats['confidenceScore']*100:.0f}%
    - Critical cases: {stats['severeCases']}
    - Moderate cases: {stats['moderateCases']}
    - Minor cases: {stats['minorCases']}
    
    Write exactly 3 paragraphs:
    
    Paragraph 1: Summarize the overall damage extent with specific 
    numbers. Mention the most critically affected areas and what 
    the satellite imagery reveals about the scale of destruction.
    
    Paragraph 2: Give specific rescue and resource deployment 
    recommendations. Include which areas to prioritize, what 
    equipment to deploy (heavy rescue, boats, medical), and 
    estimated number of people affected.
    
    Paragraph 3: List immediate next steps for coordination teams 
    in the next 6 hours. Be specific and actionable.
    
    Use a professional emergency management tone. 
    Reference specific numbers from the statistics.
    Do not use bullet points — write in flowing paragraphs.
    Do not add headers or labels to paragraphs.
    Keep total length under 300 words."""
