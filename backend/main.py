from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
import uvicorn
from contextlib import asynccontextmanager
from api.routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    gpu_available = torch.cuda.is_available()
    print(f"DisasterScout API running. GPU: {gpu_available}")
    yield
    # Shutdown event
    pass

app = FastAPI(title="DisasterScout", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "gpu": torch.cuda.is_available(),
        "model_loaded": False,
        "version": "0.1.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
