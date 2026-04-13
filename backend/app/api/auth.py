from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_admin import auth
from app.services.firebase_service import get_db

router = APIRouter()

class VerifyTokenRequest(BaseModel):
    token: str

@router.post("/verify")
def verify_token(req: VerifyTokenRequest):
    try:
        decoded_token = auth.verify_id_token(req.token)
        uid = decoded_token['uid']
        return {"status": "success", "uid": uid}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/profile/{uid}")
def get_profile(uid: str):
    db = get_db()
    if not db:
        return {"uid": uid, "name": "Mock User", "email": "mock@example.com"} # Mock fallback
        
    doc = db.collection('users').document(uid).get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="User not found")

class ProfileUpdateRequest(BaseModel):
    name: str
    phone: str

@router.post("/profile/{uid}")
def update_profile(uid: str, req: ProfileUpdateRequest):
    db = get_db()
    if not db:
        return {"status": "mocked", "message": "Profile updated for Mock DB"}
        
    try:
        db.collection('users').document(uid).set({
            "name": req.name,
            "phone": req.phone,
        }, merge=True)
        return {"status": "success", "message": "Profile updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

