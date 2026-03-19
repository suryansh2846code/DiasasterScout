def mask_to_geojson(mask, transform, crs):
    """
    TODO Phase 1: Convert predicted numpy mask to vector GeoJSON format.
    """
    raise NotImplementedError("TODO Phase 1: Convert mask to geojson")

def calculate_statistics(mask, pixel_size_m=10.0):
    """
    TODO Phase 1: Calculate damage statistics from the mask.
    Returns:
        dict: with keys flooded_area_km2, buildings_damaged, roads_blocked_count
    """
    raise NotImplementedError("TODO Phase 1: calculate statistics from mask")

def generate_report_prompt(stats: dict):
    """
    TODO Phase 1: Generate a string prompt summarizing the stats, to send to Claude API.
    Returns:
        str: Prompt text
    """
    raise NotImplementedError("TODO Phase 1: generate report prompt")
