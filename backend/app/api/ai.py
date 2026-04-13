from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
import base64

router = APIRouter()

class ThreatRequest(BaseModel):
    uid: str
    image_base64: str

# In-memory storage for simple motion detection (last frame per user)
user_frames = {}

@router.post("/threat-detect")
def detect_threat(req: ThreatRequest):
    try:
        # Decode base64 
        encoded_data = req.image_base64.split(',')[1] if ',' in req.image_base64 else req.image_base64
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"status": "error", "message": "Invalid image"}

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)

        threat_level = "low"
        motion_amount = 0

        if req.uid in user_frames:
            last_blur = user_frames[req.uid]
            
            # Compute difference
            diff = cv2.absdiff(last_blur, blur)
            _, thresh = cv2.threshold(diff, 20, 255, cv2.THRESH_BINARY)
            dilated = cv2.dilate(thresh, None, iterations=3)
            contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                if cv2.contourArea(contour) > 2000:
                    motion_amount += cv2.contourArea(contour)
            
            if motion_amount > 50000:
                threat_level = "high"
        
        # Save current frame for next comparison
        user_frames[req.uid] = blur

        return {"status": "success", "threat_level": threat_level, "motion_score": motion_amount}

    except Exception as e:
        print(f"Threat detection error: {e}")
        return {"status": "error", "message": str(e)}
