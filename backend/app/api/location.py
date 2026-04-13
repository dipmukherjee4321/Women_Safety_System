from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from app.services.firebase_service import get_db

router = APIRouter()

class LocationUpdate(BaseModel):
    uid: str
    latitude: float
    longitude: float

@router.post("/update")
def update_location(req: LocationUpdate):
    db = get_db()
    timestamp = datetime.now(timezone.utc).isoformat()
    if not db:
        return {"status": "mocked", "message": f"Location updated for {req.uid}"}
        
    try:
        # Store trail of locations
        db.collection('users').document(req.uid).collection('location_history').add({
            "latitude": req.latitude,
            "longitude": req.longitude,
            "timestamp": timestamp
        })
        
        # Update current live location on the profile
        db.collection('users').document(req.uid).update({
            "current_location": {
                "latitude": req.latitude,
                "longitude": req.longitude,
                "updated_at": timestamp
            }
        })
        return {"status": "success", "timestamp": timestamp}
    except Exception as e:
        print(f"Location update error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{uid}")
def get_location_history(uid: str, limit: int = 50):
    """
    Returns the last N location points for a user.
    Each entry: { latitude, longitude, timestamp }
    """
    db = get_db()
    if not db:
        # Return mock data so the frontend map works even without Firebase
        return [
            {"latitude": 20.5937, "longitude": 78.9629, "timestamp": datetime.now(timezone.utc).isoformat()},
        ]
        
    try:
        history_ref = (
            db.collection('users')
              .document(uid)
              .collection('location_history')
              .order_by("timestamp", direction="DESCENDING")
              .limit(min(limit, 100))
              .stream()
        )
        docs = [doc.to_dict() for doc in history_ref]
        # Normalise field names so frontend always gets lat/lng numbers
        result = []
        for d in docs:
            try:
                result.append({
                    "latitude":  float(d.get("latitude",  d.get("lat", 0))),
                    "longitude": float(d.get("longitude", d.get("lng", 0))),
                    "timestamp": d.get("timestamp", ""),
                })
            except (TypeError, ValueError):
                continue
        return result
    except Exception as e:
        print(f"Error fetching location history: {e}")
        # Graceful fallback – never crash the frontend
        return []

@router.get("/current/{uid}")
def get_current_location(uid: str):
    """Returns the most recent location for a user."""
    db = get_db()
    if not db:
        return {"latitude": 20.5937, "longitude": 78.9629}
    try:
        user_doc = db.collection('users').document(uid).get()
        if user_doc.exists:
            data = user_doc.to_dict() or {}
            loc  = data.get("current_location", {})
            return {
                "latitude":  loc.get("latitude",  0),
                "longitude": loc.get("longitude", 0),
                "updated_at": loc.get("updated_at", ""),
            }
        return {"latitude": 0, "longitude": 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
