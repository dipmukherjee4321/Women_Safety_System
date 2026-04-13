import cv2
import numpy as np
import time

def threat_detection_stream():
    """
    OpenCV based motion/abnormal behavior detection.
    This can connect to laptop webcam and detect sudden fast movements 
    which might indicate an attack or struggle.
    """
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Cannot open webcam")
        return

    ret, frame1 = cap.read()
    ret, frame2 = cap.read()
    
    # We use a simple frame differencing to detect high-speed motion
    motion_history = []
    
    print("Threat Detection Module Active...")

    while cap.isOpened():
        diff = cv2.absdiff(frame1, frame2)
        gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
        dilated = cv2.dilate(thresh, None, iterations=3)
        contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        motion_amount = 0
        for contour in contours:
            (x, y, w, h) = cv2.boundingRect(contour)
            # Filter small movements
            if cv2.contourArea(contour) < 2000:
                continue
            motion_amount += cv2.contourArea(contour)
            cv2.rectangle(frame1, (x, y), (x+w, y+h), (0, 0, 255), 2)
            
        motion_history.append(motion_amount)
        if len(motion_history) > 10:
            motion_history.pop(0)
            
        # If sustained high motion over frames (mock threshold)
        avg_motion = sum(motion_history)/len(motion_history)
        if avg_motion > 50000:
            cv2.putText(frame1, "THREAT DETECTED: ABNORMAL MOTION", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
            # In a real app, this triggers SOS API
            print("ALERT: Threat detected. Trigger SOS endpoint here.")
            # Trigger logic: requests.post('http://localhost:8000/sos/trigger', json={...})
        
        cv2.imshow("Video Stream", frame1)
        frame1 = frame2
        ret, frame2 = cap.read()
        
        if cv2.waitKey(40) == 27: # Esc key
            break

    cv2.destroyAllWindows()
    cap.release()

if __name__ == "__main__":
    threat_detection_stream()
