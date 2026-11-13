import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .api import router as api_router

app = FastAPI(
    title="Astronaut Health Monitor API",
    description="Offline-First Mission Health Dashboard API with Transparent Review Flags",
    version="1.0.0"
)

# Configure CORS for local development and offline sync clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "system": "Astronaut Health Monitor API",
        "environment": "demonstration",
        "disclaimer": "SIMULATED DATA ONLY - Educational Prototype - Not a Medical Device"
    }

# Mount static frontend build if directory exists
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.isdir(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Serve index.html for client-side routing
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)

