import firebase_admin
from firebase_admin import credentials, firestore
import os

# 🔥 Path to your Firebase key
FIREBASE_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_config/serviceAccountKey.json")

def init_firebase():
    if not firebase_admin._apps:
        try:
            if os.path.exists(FIREBASE_PATH):
                cred = credentials.Certificate(FIREBASE_PATH)
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialized successfully")
            else:
                print(f"ℹ️ serviceAccountKey.json not found at '{FIREBASE_PATH}'. Running in mock database mode.")
        except Exception as e:
            print(f"🔥 Firebase Initialization Error: {e}")

def get_db():
    if not firebase_admin._apps:
        init_firebase()
    if not firebase_admin._apps:
        return None
    try:
        return firestore.client()
    except Exception as e:
        print(f"🔥 Firestore Client Error: {e}")
        return None