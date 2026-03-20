import os
from dotenv import load_dotenv

load_dotenv()

def generate_situation_report(stats: dict, event_name: str, 
                               location: str) -> str:
    """
    Calls Groq API to generate a natural language situation report.
    Returns the report as a string.
    Falls back to a template report if API call fails.
    """
    from pipeline.postprocess import generate_report_prompt
    
    prompt = generate_report_prompt(stats, event_name, location)
    
    try:
        from groq import Groq
        client = Groq(
            api_key=os.getenv('GROQ_API_KEY')
        )
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile", # powerful model for text gen
            max_tokens=1024,
        )
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        print(f"Groq API error: {e}")
        # Fallback template if API fails
        return generate_fallback_report(stats, event_name, location)

def generate_fallback_report(stats: dict, event_name: str, 
                              location: str) -> str:
    """
    Template-based report used when LLM API is unavailable.
    Ensures demo always works even without API key.
    """
    return f"""Satellite analysis of {event_name} in {location} 
    reveals significant damage across the affected zone. 
    DisasterScout has identified {stats['buildingsDamaged']} 
    damaged structures across {stats['totalAreaAnalyzedKm2']} 
    square kilometers, with {stats['severeCases']} cases requiring 
    immediate emergency response. Overall assessment confidence 
    is {stats['confidenceScore']*100:.0f}%.

    Immediate deployment of heavy rescue teams is recommended to 
    the {stats['severeCases']} critical damage zones identified in 
    the analysis. An estimated {stats['buildingsDamaged'] * 3} 
    individuals may require evacuation or assistance. 
    {stats['roadsBlocked']} road blockages have been identified — 
    coordinate with traffic management for alternative routing 
    before deploying ground teams.

    In the next 6 hours, coordination teams should establish 
    forward operating bases at the perimeter of the {stats['totalAreaAnalyzedKm2']} 
    km² affected zone, prioritize the {stats['severeCases']} 
    critical sectors for immediate search and rescue, and begin 
    systematic assessment of the {stats['moderateCases']} moderate 
    damage zones. Request aerial support for the 
    {stats['floodedAreaKm2']} km² flooded area if applicable."""
