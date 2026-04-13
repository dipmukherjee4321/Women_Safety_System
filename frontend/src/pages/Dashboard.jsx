import React, { useState, useEffect, useContext } from 'react';
import SOSButton from '../components/SOSButton';
import MapDashboard from '../components/MapDashboard';
import ContactsList from '../components/ContactsList';
import VoiceActivation from '../components/VoiceActivation';
import ThreatDetection from '../components/ThreatDetection';
import { AuthContext } from '../context/AuthContext';
import { Shield, Mic, Camera, User } from 'lucide-react';
import { updateLocation, fetchLocationHistory, fetchSOSHistory } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [location, setLocation] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    
    const [locHistory, setLocHistory] = useState([]);
    const [sosHistory, setSosHistory] = useState([]);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error(err),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    // API Pollings
    useEffect(() => {
        if (location && user?.uid) {
            updateLocation(user.uid, location.lat, location.lng);
        }
        
        const loadHistory = async () => {
            if (!user?.uid) return;
            const locs = await fetchLocationHistory(user.uid);
            const sos = await fetchSOSHistory(user.uid);
            setLocHistory(locs);
            setSosHistory(sos);
        };

        loadHistory(); // initial
        const interval = setInterval(loadHistory, 5000); // real-time map polling 5s
        
        return () => clearInterval(interval);
    }, [location, user?.uid]);

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            {/* Contextual AI Modules */}
            {user?.uid && <VoiceActivation uid={user.uid} location={location} />}
            {user?.uid && <ThreatDetection uid={user.uid} location={location} />}

            {/* Header */}
            <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-brand-purple dark:text-purple-400">
                        <Shield size={28} />
                        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">SafeGuard AI</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setDarkMode(!darkMode)} className="text-sm p-2 bg-slate-100 dark:bg-slate-800 rounded-full dark:text-slate-300">
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <Link to="/profile" className="flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition">
                            <span className="text-sm font-medium dark:text-white">Profile</span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white"><User size={16} /></div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column - SOS & Modules */}
                <div className="md:col-span-5 flex flex-col space-y-8">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-red-100 dark:from-red-900/20 to-transparent"></div>
                        <h2 className="text-xl font-bold mb-8 z-10">Emergency Action</h2>
                        <SOSButton uid={user?.uid} location={location} />
                    </div>

                    {/* AI Modules Status */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                         <h3 className="text-lg font-bold mb-4 flex items-center dark:text-white"><Shield className="mr-2 text-brand-purple"/> AI Systems Status</h3>
                         <div className="space-y-3">
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                 <div className="flex items-center space-x-3">
                                     <Mic className="text-blue-500" size={20} />
                                     <span className="font-medium text-sm dark:text-slate-200">Voice Activation</span>
                                 </div>
                                 <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold animate-pulse">Running</span>
                             </div>
                             <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                 <div className="flex items-center space-x-3">
                                     <Camera className="text-purple-500" size={20} />
                                     <span className="font-medium text-sm dark:text-slate-200">Threat Detection</span>
                                 </div>
                                 <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold animate-pulse">Tracking</span>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Right Column - Map & Contacts */}
                <div className="md:col-span-7 flex flex-col space-y-6">
                    <MapDashboard location={location} locationHistory={locHistory} sosHistory={sosHistory} />
                    <ContactsList uid={user?.uid} />
                </div>
            </main>
        </div>
    )
}
