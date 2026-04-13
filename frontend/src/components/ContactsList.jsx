import React, { useEffect, useState } from 'react';
import { Phone, User, Plus } from 'lucide-react';
import { fetchContacts, addContact } from '../services/api';

export default function ContactsList({ uid }) {
    const [contacts, setContacts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', relation: 'Emergency' });
    const [loading, setLoading] = useState(false);

    const loadContacts = async () => {
        if (!uid) return;
        const c = await fetchContacts(uid);
        setContacts(c || []);
    };

    useEffect(() => {
        loadContacts();
    }, [uid]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addContact(uid, formData.name, formData.phone, formData.relation);
            setFormData({ name: '', phone: '', relation: 'Emergency' });
            setShowForm(false);
            await loadContacts(); // Refresh list
        } catch (err) {
            alert('Failed to add contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800 dark:text-slate-100">
                <User className="mr-2 text-brand-purple" /> Emergency Contacts
            </h2>
            
            <div className="space-y-4">
                {contacts.length === 0 && <p className="text-sm text-slate-500">No contacts found.</p>}
                {contacts.map((contact, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{contact.name}</p>
                            <p className="text-xs text-slate-500">{contact.relation}</p>
                        </div>
                        <div className="flex space-x-2">
                            <a href={`tel:${contact.phone}`} className="p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 transition">
                                <Phone size={18} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {showForm ? (
                <form onSubmit={handleAdd} className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="space-y-3">
                        <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full text-sm p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        <input required type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full text-sm p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        <select value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} className="w-full text-sm p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                            <option value="Family">Family</option>
                            <option value="Friend">Friend</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                        <div className="flex space-x-2 pt-2">
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white text-sm font-bold rounded shadow bg-purple-600 hover:bg-purple-700">{loading ? 'Saving...' : 'Save'}</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-sm font-bold rounded shadow">Cancel</button>
                        </div>
                    </div>
                </form>
            ) : (
                <button onClick={() => setShowForm(true)} className="w-full mt-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-500 transition font-medium flex items-center justify-center">
                    <Plus size={18} className="mr-1" /> Add Contact
                </button>
            )}
        </div>
    )
}
