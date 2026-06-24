from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routes import candidates

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TalentDNA AI",
    description="Hidden talent discovery engine",
    version="1.0.0"
)

# Allow frontend to talk to backend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(candidates.router, prefix="/api", tags=["candidates"])


@app.get("/")
def health_check():
    return {
        "status": "running",
        "product": "TalentDNA AI",
        "version": "1.0.0"
    }