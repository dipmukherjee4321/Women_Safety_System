import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Fallback UID for demo / unauthenticated testing
const DEMO_UID = 'user_123';

const uid = (provided) => provided || DEMO_UID;

// ── SOS ───────────────────────────────────────────────────────────────────────

export const triggerSOS = async (userId, lat, lng) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/sos/trigger`, {
            uid: uid(userId),
            location: { latitude: lat, longitude: lng },
            timestamp: new Date().toISOString(),
        });
        return res.data;
    } catch (err) {
        console.error('SOS trigger failed:', err);
        throw err;
    }
};

export const fetchSOSHistory = async (userId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/sos/history/${uid(userId)}`);
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error('Failed to fetch SOS history:', err);
        return [];
    }
};

// ── Location ──────────────────────────────────────────────────────────────────

export const updateLocation = async (userId, lat, lng) => {
    try {
        await axios.post(`${API_BASE_URL}/location/update`, {
            uid: uid(userId),
            latitude: lat,
            longitude: lng,
        });
    } catch (err) {
        // Non-fatal – silent fail so UI is never blocked
        console.warn('Location update failed (non-fatal):', err?.message);
    }
};

export const fetchLocationHistory = async (userId, limit = 50) => {
    try {
        const res = await axios.get(
            `${API_BASE_URL}/location/history/${uid(userId)}`,
            { params: { limit } }
        );
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error('Failed to fetch location history:', err);
        return [];
    }
};

export const fetchCurrentLocation = async (userId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/location/current/${uid(userId)}`);
        return res.data;
    } catch (err) {
        console.error('Failed to fetch current location:', err);
        return null;
    }
};

// ── Contacts ──────────────────────────────────────────────────────────────────

export const fetchContacts = async (userId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/contacts/${uid(userId)}/list`);
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error('Failed to fetch contacts:', err);
        return [];
    }
};

export const addContact = async (userId, name, phone, relation = 'Emergency') => {
    try {
        const res = await axios.post(`${API_BASE_URL}/contacts/${uid(userId)}/add`, {
            name, phone, relation,
        });
        return res.data;
    } catch (err) {
        console.error('Failed to add contact:', err);
        throw err;
    }
};

// ── AI / Threat Detection ─────────────────────────────────────────────────────

export const detectThreat = async (userId, imageBase64) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/ai/threat-detect`, {
            uid: uid(userId),
            image_base64: imageBase64,
        });
        return res.data;
    } catch (err) {
        console.error('Threat detection failed:', err);
        return null;
    }
};

// ── Auth / Profile ────────────────────────────────────────────────────────────

export const fetchProfile = async (userId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/auth/profile/${uid(userId)}`);
        return res.data;
    } catch (err) {
        console.error('Fetch profile failed:', err);
        return null;
    }
};

export const updateProfile = async (userId, name, phone) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/auth/profile/${uid(userId)}`, {
            name, phone,
        });
        return res.data;
    } catch (err) {
        console.error('Update profile failed:', err);
        throw err;
    }
};
