import firebase_admin
from firebase_admin import credentials, firestore
import os

# 🔥 Path to your Firebase key
FIREBASE_PATH = "firebase_config/serviceAccountKey.json"

def init_firebase():
    if not firebase_admin._apps:
        try:
            if os.path.exists(FIREBASE_PATH):
                cred = credentials.Certificate(FIREBASE_PATH)
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialized successfully")
            else:
                raise FileNotFoundError(
                    "❌ serviceAccountKey.json not found in firebase_config/"
                )
        except Exception as e:
            print(f"🔥 Firebase Initialization Error: {e}")

def get_db():
    if not firebase_admin._apps:
        init_firebase()
    return firestore.client()