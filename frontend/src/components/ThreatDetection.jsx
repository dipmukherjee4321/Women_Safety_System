import React, { useEffect, useRef, useState } from 'react';
import { detectThreat, triggerSOS } from '../services/api';

export default function ThreatDetection({ uid, location }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let stream = null;
        let interval = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                interval = setInterval(async () => {
                    if (videoRef.current && canvasRef.current) {
                        const context = canvasRef.current.getContext('2d');
                        context.drawImage(videoRef.current, 0, 0, 320, 240);
                        const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.5);
                        
                        const res = await detectThreat(uid, base64Image);
                        if (res && res.threat_level === 'high') {
                            console.log('AI Threat SOS Triggered!');
                            triggerSOS(uid, location?.lat || 0, location?.lng || 0);
                        }
                    }
                }, 3000); // Frame per 3 seconds
            } catch (err) {
                console.error("Camera permissions denied or unavailable:", err);
            }
        };

        startCamera();

        return () => {
            if (interval) clearInterval(interval);
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [uid, location]);

    return (
        <div style={{ display: 'none' }}>
            <video ref={videoRef} autoPlay playsInline width="320" height="240" />
            <canvas ref={canvasRef} width="320" height="240" />
        </div>
    );
}
