from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routes import candidates

# Create all tables on startup
Base.metadata.create_all(bind=engine)

from backend.database import SessionLocal, Candidate

def auto_seed_if_empty():
    db = SessionLocal()
    count = db.query(Candidate).count()
    db.close()

    if count == 0:
        print("Database is empty. Auto-seeding...")
        import threading
        from seed_remote_internal import run_seed
        thread = threading.Thread(target=run_seed)
        thread.start()
    else:
        print(f"Database already has {count} candidates. Skipping seed.")

auto_seed_if_empty()

app = FastAPI(
    title="TalentDNA AI",
    description="Hidden talent discovery engine",
    version="1.0.0"
)

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://talentdna-ai.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
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

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Render sets the PORT environment variable.
    port = int(os.environ.get("PORT", 8000))
    # In production (e.g. on Render) we bind to 0.0.0.0, locally we bind to 127.0.0.1.
    host = "0.0.0.0" if os.environ.get("PORT") else "127.0.0.1"
    
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)