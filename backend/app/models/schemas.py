from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserProfile(BaseModel):
    uid: str
    name: str
    email: str
    phone: Optional[str] = None

class Contact(BaseModel):
    name: str
    phone: str
    relation: Optional[str] = None

class Location(BaseModel):
    latitude: float
    longitude: float

class SOSRequest(BaseModel):
    uid: str
    location: Location
    timestamp: Optional[str] = None
