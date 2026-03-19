from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AnalyzeRequest(BaseModel):
    pre_image_url: str
    post_image_url: str
    event_name: str

@router.post("/analyze")
def analyze(request: AnalyzeRequest):
    return {
        "job_id": "stub-123",
        "status": "queued",
        "message": "Model pipeline coming in Phase 1"
    }

@router.get("/status/{job_id}")
def get_status(job_id: str):
    return {
        "job_id": job_id,
        "status": "queued",
        "progress": 0
    }
