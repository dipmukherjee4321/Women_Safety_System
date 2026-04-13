from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Contact
from app.services.firebase_service import get_db

router = APIRouter()

@router.post("/{uid}/add")
def add_contact(uid: str, contact: Contact):
    db = get_db()
    if not db:
        return {"status": "mocked", "message": "Contact added (mock DB)"}
        
    try:
        db.collection('users').document(uid).collection('contacts').add(contact.model_dump())
        return {"status": "success", "message": "Contact added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{uid}/list")
def list_contacts(uid: str):
    db = get_db()
    if not db:
        # Return mock data
        return [
            {"name": "Mom", "phone": "+1234567890", "relation": "Family"},
            {"name": "Emergency Services", "phone": "911", "relation": "Police"}
        ]
        
    try:
        contacts_ref = db.collection('users').document(uid).collection('contacts').stream()
        contacts = [doc.to_dict() for doc in contacts_ref]
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
