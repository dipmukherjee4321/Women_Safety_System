<div align="center">

# 🛡️ SafeGuard AI: AI-Powered Women Safety System

**Empowering Safety Through Artificial Intelligence and Real-Time Tracking.**

[![Frontend Build](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Backend API](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![AI Tech](https://img.shields.io/badge/AI-OpenCV%20%7C%20SpeechRec-red?style=for-the-badge&logo=opencv)](https://opencv.org/)

A production-ready platform integrating computer vision, speech recognition, and robust cloud services to provide a highly preventative and reactive safety ecosystem for women.

[Features](#-features) • [Installation](#-installation-guide) • [Architecture](#-system-architecture) • [API Reference](#-api-endpoints) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📌 Overview

**SafeGuard AI** is not just an application; it is an intelligent, reactive companion designed to ensure the safety of its users in potentially dangerous situations.

When an individual feels threatened, time and action are crucial. This system goes beyond traditional push-button panic apps by deploying continuous **Machine Learning**, **Computer Vision**, and **Speech Recognition** to intelligently monitor surroundings, predict threat hotspots, and automatically trigger life-saving alerts over Twilio SMS, push notifications, and Firebase to a circle of trusted contacts—without requiring physical interaction.

---

## ✨ Features

- **🚨 One-Click SOS Emergency System:** Instantly trigger a silent alarm that updates location APIs and pings all trusted contacts.
- **📍 Live Location Tracking:** Real-time Google Maps integration ensuring seamless and accurate geo-tracking.
- **🎙️ Voice Activation:** Hands-free emergency trigger utilizing offline/online acoustic recognition models parsing hotwords (e.g., “Help”, “Save me”).
- **📸 AI Threat Detection:** Background script examining WebRTC/camera motion inputs to instantly recognize abnormal physical struggles or sudden high-velocity metrics.
- **🛡️ Safe Route Prediction:** An intelligent algorithm mapping paths overlayed with geographic safety factors and mock crime rate metrics.
- **🔑 Seamless Firebase Auth:** Secure OAuth, JWT verification, and user management systems.
- **📲 Omni-channel Notifications:** Instantly sends out Twilio SMS coordinates to predefined emergency contacts.

---

## 🧠 System Architecture

Our core system bridges three primary domains securely via REST APIs:
1. **Frontend App (Client):** Mobile-first React dashboard running complex background listeners.
2. **FastAPI Backend (Server):** Handles SMS propagation, database interactions, and complex user-relations.
3. **AI Modules (Edge/Cloud):** Standalone scalable Python scripts dedicated to constant data-stream analysis (OpenCV framing, audio chunking).

<div align="center">
  <img src="https://via.placeholder.com/800x400/1e293b/a855f7?text=System+Architecture+Diagram+Placeholder" alt="Architecture Diagram" />
</div>

---

## 🛠️ Tech Stack

### Client-Side (Frontend)
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS V3, Lucide React (Icons)
- **Maps API:** Google Maps API (`@react-google-maps/api`)

### Server API (Backend)
- **Framework:** Python, FastAPI
- **Cloud/DB:** Firebase Admin SDK (Firestore, Auth)
- **Notifications:** Twilio SDK

### AI and Machine Learning
- **Computer Vision:** OpenCV (`cv2`)
- **Acoustics:** `SpeechRecognition` library
- **Predictions:** Pandas, NumPy (Mock ML modeling)

---

## 📂 Project Structure

```bash
📦 AI-Powered Women Safety System
├── 📂 ai_modules/             # Python-based Machine Learning models
│   ├── route_prediction.py    # Safe path optimization algorithms
│   ├── threat_detection.py    # Computer Vision logic
│   └── voice_activation.py    # Acoustic pattern recognition
│
├── 📂 backend/                # FastAPI Core Application
│   ├── 📂 app/
│   │   ├── 📂 api/            # Route controllers (SOS, Location, etc)
│   │   ├── 📂 core/           # Security configurations
│   │   └── 📂 services/       # External SDK configs (Firebase, Twilio)
│   ├── main.py                # Server entrypoint
│   └── requirements.txt       # Server dependencies
│
├── 📂 frontend/               # React User Interface
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable UI/UX modules
│   │   ├── 📂 pages/          # Main dashboard views
│   │   └── 📂 services/       # Axios wrappers connecting to FastAPI
│   └── tailwind.config.js     # CSS tokens and dark mode config
│
└── 📂 firebase_config/        # Directory for ServiceKey configuration
```

---

## ⚙️ Installation Guide

Follow these steps to deploy the application on your local machine.

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Initialize a virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# Install required dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
# Navigate to the React interface directory
cd frontend

# Install Node modules
npm install
```

---

## 🔑 Environment Variables

For the application to bridge properly with Google Maps, Firebase, and Twilio, update your configuration files.

**Backend (`backend/.env`):**
```env
PORT=8000
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
FIREBASE_CREDENTIALS_PATH=../firebase_config/serviceAccountKey.json
```

**Frontend (`frontend/.env`):**
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## ▶️ How to Run

To test all modules successfully, run the environments concurrently.

**1. Start the API Server:**
```bash
cd backend
uvicorn main:app --reload
```
*(Runs on http://localhost:8000. Open `http://localhost:8000/docs` to view the comprehensive Swagger API UI).*

**2. Start the Frontend Application:**
```bash
cd frontend
npm run dev
```

**3. Test AI Active Monitoring (Optional Local Edge Nodes):**
```bash
python ai_modules/threat_detection.py
python ai_modules/voice_activation.py
```

---

## 📸 UI / Application Screenshots

> Add visual identity blocks here to attract hackathon judges and recruiters!

<div align="center">
  <img src="https://via.placeholder.com/800x450/1e293b/ffffff?text=Add+Dashboard+Dark+Mode+Screenshot+Here" width="48%" /> 
  <img src="https://via.placeholder.com/800x450/1e293b/ffffff?text=Add+Map+Live+Tracking+Screenshot+Here" width="48%" />
</div>

---

## 🔄 API Endpoints

Our backend strictly follows RESTful principles utilizing modern FastAPI structure.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/verify` | Validates Firebase JWT Authentication Tokens |
| `POST` | `/sos/trigger` | Core route that drops live coords, SMS alerts, & Firebase logs |
| `POST` | `/location/update`| Persists live coordinate histories for specific users |
| `GET`  | `/contacts/{uid}/list`| Fetches user designated emergency responders |

---

## 🚀 Deployment

The system is optimized for continuous delivery and platform-agnostic setups.

### Deploying the Backend (Render / Railway)
1. Fork and upload to GitHub.
2. Select **FastAPI / Python Service** inside your Render/Railway dashboard.
3. Configure the Root Directory as `backend`.
4. Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Map all `.env` security keys.

### Deploying the Frontend (Vercel)
1. Connect Vercel to your GitHub repo.
2. Link the Root Directory to `frontend`.
3. Vercel's build scripts will auto-detect Vite (`npm run build`).
4. Append your Vite `.env` keys. Build & Publish!

---

## 🔒 Security Features

We take user data security incredibly seriously given the platform's nature:
* **JSON Web Tokens (JWT):** Full validation integration preventing unauthorized API hits.
* **Geospatial Shielding:** All tracked coordinates pass through encrypted HTTPS tunnels.
* **Role Based Accessibility:** Database structures block queries if requester origin UIDs do not match.

---

## 📈 Future Improvements

- [ ] Connect the web platform effectively to a native **React Native** application for pervasive mobile tracking.
- [ ] Migrate Mock AI datasets into a trained `TensorFlow.js` model running flawlessly in-browser.
- [ ] Incorporate **Wearable Device** triggers (Apple Watch / Galaxy Health).
- [ ] Onboard verified local authorities into an administrative view system.

---

## 🤝 Contributing

Contributions make the open-source community an unbelievable place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Developed By

**Name** \
Senior Full-Stack AI Engineer \
[LinkedIn](https://linkedin.com) • [GitHub](https://github.com) • [Portfolio](https://yourportfolio.com)

> *"Building technology not just for comfort, but to save lives."*