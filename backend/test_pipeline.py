import asyncio
import json
import numpy as np
import pprint
import os
from pipeline.postprocess import mask_to_geojson, calculate_statistics
from model.inference import run_full_pipeline

CHECKPOINT_PATH = os.getenv('MODEL_CHECKPOINT_PATH', './checkpoints/disasterscout_best.pth')

# Ensure directory exists
os.makedirs(os.path.dirname(CHECKPOINT_PATH), exist_ok=True)

async def test():
    print("Testing Pipeline...")
    # placeholder URLs
    pre_url = "https://images.unsplash.com/photo-1542281286-9e0a16bb7366"  # just a dummy image
    post_url = "https://images.unsplash.com/photo-1469474968028-56623f02e42e" 
    
    # We use unsplash because picsum.photos sometimes blocks bot requests, but let's just make sure
    # It will fetch whatever 512x512 the pipeline resize handles
    
    try:
        mask, confidence_map, device = await run_full_pipeline(pre_url, post_url, CHECKPOINT_PATH)
        
        print("\n=== Mask Info ===")
        print(f"Mask shape: {mask.shape}")
        print(f"Unique values: {np.unique(mask)}")
        for cls in range(4):
            print(f"Class {cls} pixels: {(mask == cls).sum()}")
            
        print("\n=== GeoJSON ===")
        geojson = mask_to_geojson(mask, confidence_map)
        print(f"Feature count: {len(geojson['features'])}")
        
        with open("test_output.geojson", "w") as f:
            json.dump(geojson, f, indent=2)
        print("Saved GeoJSON to test_output.geojson")
        
        print("\n=== Statistics ===")
        stats = calculate_statistics(mask, confidence_map)
        pprint.pprint(stats)
        
        print("\nPIPELINE TEST PASSED")
    except Exception as e:
        print(f"Pipeline Test Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
