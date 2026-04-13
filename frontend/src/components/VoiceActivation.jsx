import React, { useEffect, useState } from 'react';
import { triggerSOS } from '../services/api';

export default function VoiceActivation({ uid, location }) {
    const [listening, setListening] = useState(false);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setListening(true);
        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript.toLowerCase();
            
            if (transcript.includes('help') || transcript.includes('save me') || transcript.includes('emergency')) {
                console.log('Voice SOS Triggered!', transcript);
                triggerSOS(uid, location?.lat || 0, location?.lng || 0);
            }
        };
        recognition.onerror = (e) => console.log('Speech error', e);
        recognition.onend = () => {
            setListening(false);
            // Auto restart
            try { recognition.start(); } catch(e){}
        };

        try { recognition.start(); } catch(e){}
        
        return () => { recognition.stop(); };
    }, [uid, location]);

    return null; // Headless
}
