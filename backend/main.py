import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, sos, location, contacts, ai
from app.services.firebase_service import init_firebase

# Initialize Firebase Admins
init_firebase()

app = FastAPI(
    title="AI-Powered Women Safety System API",
    description="Backend API for emergency tracking and SOS triggers",
    version="1.0.0"
)

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for demo purposes, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(contacts.router, prefix="/contacts", tags=["Emergency Contacts"])
app.include_router(sos.router, prefix="/sos", tags=["SOS Emergency"])
app.include_router(location.router, prefix="/location", tags=["Location Tracking"])
app.include_router(ai.router, prefix="/ai", tags=["AI Threat Detection"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Women Safety System API is running"}

if __name__ == "__main__":
    import uvicorn
    # Make sure to run with: uvicorn main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
