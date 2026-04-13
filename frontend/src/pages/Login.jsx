import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export default function Login() {
    const [uid, setUid] = useState('user_123'); // Default mock uid
    const { login } = useContext(AuthContext);

    const handleLogin = (e) => {
        e.preventDefault();
        if (uid.trim()) {
            login(uid);
            window.location.href = '/dashboard';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col items-center mb-8">
                    <Shield size={48} className="text-brand-purple mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">SafeGuard Login</h1>
                    <p className="text-sm text-slate-500 mt-2">Enter your User ID to connect your profile</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">User ID</label>
                        <input 
                            required
                            type="text" 
                            value={uid}
                            onChange={(e) => setUid(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold transition shadow-lg shadow-purple-500/30">
                        Continue to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
