import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../services/api';
import { ChevronLeft, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchProfile(user.uid).then(data => {
                if (data) setFormData({ name: data.name || '', phone: data.phone || '' });
            });
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(user.uid, formData.name, formData.phone);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error saving profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
            <div className="max-w-2xl mx-auto mt-8">
                <Link to="/dashboard" className="flex items-center text-slate-500 hover:text-purple-600 mb-6 font-medium">
                    <ChevronLeft size={20} /> Back to Dashboard
                </Link>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center">
                        <User className="mr-3 text-brand-purple" /> User Profile
                    </h2>

                    {message && <div className={`p-4 mb-4 rounded-lg text-sm font-bold ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">My Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                <input 
                                    required
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full pl-10 p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="+1234567890"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Required for the emergency system to send SMS from your registered profile.</p>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl text-white font-bold transition shadow-lg shadow-purple-500/30">
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
