import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { triggerSOS } from '../services/api';

export default function SOSButton({ uid, location }) {
    const [status, setStatus] = useState('idle'); // idle | triggering | active

    const handleSOS = async () => {
        if (!uid) {
            alert('Please login first to trigger SOS.');
            return;
        }

        setStatus('triggering');
        try {
            // Send SOS
            let lat = location ? location.lat : 0;
            let lng = location ? location.lng : 0;
            
            await triggerSOS(uid, lat, lng);
            setStatus('active');
            
            // Mock voice trigger activation visual
            setTimeout(() => setStatus('idle'), 10000); // reset after 10s for demo
        } catch (e) {
            console.error(e);
            setStatus('idle');
            alert('Failed to trigger SOS. Please check backend connection.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <button 
                onClick={handleSOS}
                disabled={status === 'triggering'}
                className={`relative rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-2xl transition-transform transform hover:scale-105 active:scale-95 z-10 w-48 h-48 sm:w-56 sm:h-56 
                ${status === 'active' ? 'bg-red-700' : 'bg-red-600'} `}
            >
                {status === 'active' && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 sos-ripple z-0"></div>
                )}
                <div className="flex flex-col items-center z-10">
                    <ShieldAlert size={64} className="mb-2" />
                    <span>{status === 'triggering' ? 'SENDING...' : 'S O S'}</span>
                </div>
            </button>
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase">
                {status === 'active' ? 'Emergency contacts alerted' : 'Tap to alert contacts'}
            </p>
        </div>
    );
}
