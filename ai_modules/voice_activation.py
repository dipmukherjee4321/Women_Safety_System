import speech_recognition as sr
import requests
import json
import time

def listen_for_hotword():
    """
    Listens for emergency trigger words from the microphone.
    Requires: pip install SpeechRecognition pyaudio
    """
    recognizer = sr.Recognizer()
    mic = sr.Microphone()
    
    triggers = ["help", "help me", "save me", "emergency", "bachao"]

    print("Voice Activation Module Active. Listening for SOS trigger words...")
    
    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        
        while True:
            print("Listening...")
            try:
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)
                text = recognizer.recognize_google(audio).lower()
                print(f"Heard: {text}")
                
                # Check if trigger word is in spoken sentence
                if any(t in text for t in triggers):
                    print("🚨 SOS VOICE TRIGGER DETECTED 🚨")
                    # Here we would trigger the backend API
                    """
                    try:
                        requests.post('http://localhost:8000/sos/trigger', json={
                            "uid": "voice_active_user",
                            "location": {"latitude": 0.0, "longitude": 0.0}
                        })
                    except Exception as e:
                        print(e)
                    """
                    time.sleep(5)  # Prevent multiple triggers
            except sr.WaitTimeoutError:
                pass
            except sr.UnknownValueError:
                pass
            except sr.RequestError as e:
                print(f"Could not request results; {e}")

if __name__ == "__main__":
    listen_for_hotword()
