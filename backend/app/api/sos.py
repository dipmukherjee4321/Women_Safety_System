from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from app.models.schemas import SOSRequest
from app.services.twilio_service import send_sms_alert
from app.services.firebase_service import get_db

router = APIRouter()

@router.post("/trigger")
def trigger_sos(req: SOSRequest):
    timestamp = req.timestamp or datetime.now(timezone.utc).isoformat()
    db = get_db()
    
    contacts = []
    if db:
        try:
            contacts_ref = db.collection('users').document(req.uid).collection('contacts').stream()
            contacts = [doc.to_dict() for doc in contacts_ref]
            
            # Log alert in Firestore
            db.collection('alerts').add({
                "uid": req.uid,
                "location": {
                    "lat": req.location.latitude,
                    "lng": req.location.longitude
                },
                "timestamp": timestamp,
                "status": "active"
            })
        except Exception as e:
            print(f"Firebase error in SOS trigger: {e}")
    else:
        # Mock contacts for testing without Firebase
        contacts = [{"name": "Emergency", "phone": "+1234567890"}]

    # Build Google Maps link
    maps_link = (
        f"https://www.google.com/maps?q={req.location.latitude},{req.location.longitude}"
    )
    message = f"🚨 URGENT SOS: Someone needs help! Location: {maps_link}"
    
    sms_results = []
    for contact in contacts:
        if "phone" in contact:
            res = send_sms_alert(contact["phone"], message)
            sms_results.append({"contact": contact.get("name", "?"), "result": res})
            
    return {
        "status": "SOS triggered",
        "location": req.location.model_dump(),
        "alerts_sent": sms_results,
        "timestamp": timestamp
    }

@router.get("/history/{uid}")
def get_sos_history(uid: str, limit: int = 20):
    """
    Returns SOS alerts for a given user.
    Each entry: { uid, location: {lat, lng}, timestamp, status }
    
    NOTE: This query requires a Firestore composite index on the 'alerts'
    collection: (uid ASC, timestamp DESC).  If the index is missing Firestore
    will return a link in the error log to create it automatically.
    """
    db = get_db()
    if not db:
        return []

    try:
        # Try with ordering first (needs composite index)
        alerts_ref = (
            db.collection('alerts')
              .where('uid', '==', uid)
              .order_by("timestamp", direction="DESCENDING")
              .limit(min(limit, 50))
              .stream()
        )
        docs = [doc.to_dict() for doc in alerts_ref]
        return _normalise_sos_docs(docs)

    except Exception as e:
        err_str = str(e)
        print(f"SOS history query error: {err_str}")

        # Firestore composite-index not yet created → fall back to unordered query
        if "index" in err_str.lower() or "failed-precondition" in err_str.lower():
            print("⚠ Firestore composite index missing for alerts. Falling back to unordered query.")
            try:
                alerts_ref = (
                    db.collection('alerts')
                      .where('uid', '==', uid)
                      .limit(min(limit, 50))
                      .stream()
                )
                docs = [doc.to_dict() for doc in alerts_ref]
                # Sort client-side as fallback
                docs.sort(key=lambda d: d.get("timestamp", ""), reverse=True)
                return _normalise_sos_docs(docs)
            except Exception as e2:
                print(f"SOS fallback query also failed: {e2}")

        return []

def _normalise_sos_docs(docs: list) -> list:
    """Ensure every SOS doc has a proper location dict with lat/lng floats."""
    result = []
    for d in docs:
        loc = d.get("location", {})
        if not isinstance(loc, dict):
            continue
        try:
            result.append({
                "uid":       d.get("uid", ""),
                "location":  {"lat": float(loc.get("lat", 0)), "lng": float(loc.get("lng", 0))},
                "timestamp": d.get("timestamp", ""),
                "status":    d.get("status", "active"),
            })
        except (TypeError, ValueError):
            continue
    return result
