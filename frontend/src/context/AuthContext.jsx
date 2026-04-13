import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock auth persistence
        const storedUid = localStorage.getItem('safeguard_uid');
        if (storedUid) {
            setUser({ uid: storedUid });
        }
        setLoading(false);
    }, []);

    const login = (uid) => {
        localStorage.setItem('safeguard_uid', uid);
        setUser({ uid });
    };

    const logout = () => {
        localStorage.removeItem('safeguard_uid');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
