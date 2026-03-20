import sys
import os

sys.path.append(os.path.dirname(__file__))

from services.claude_service import generate_situation_report

def test():
    # Sample stats dict
    stats = {
        "buildingsDamaged": 420,
        "roadsBlocked": 12,
        "floodedAreaKm2": 0.0,
        "totalAreaAnalyzedKm2": 50.0,
        "confidenceScore": 0.88,
        "severeCases": 150,
        "moderateCases": 200,
        "minorCases": 70
    }
    
    event_name = "Test Earthquake"
    location = "Test City"
    
    print("Testing Claude API integration...")
    report = generate_situation_report(stats, event_name, location)
    
    print("\n--- GENERATED REPORT ---")
    print(report)
    print("------------------------\n")
    
    if "Claude API error" in report or "Satellite analysis of" in report:
        print("FALLBACK USED")
    else:
        # If it didn't use fallback, it used the API (or API key was missing but we caught it)
        print("CLAUDE TEST PASSED")

if __name__ == "__main__":
    test()
