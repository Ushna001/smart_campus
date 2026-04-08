import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

// NOTE: Replace this with your actual Google Client ID from console.cloud.google.com
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (token) => {
        try {
            // Send token to backend to verify and get/create user profile
            const response = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            localStorage.setItem('mockUser', JSON.stringify(response.data));
            localStorage.setItem('token', token);
        } catch (error) {
            console.error("Auth verification failed:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('mockUser');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setLoading(false);
        } else {
            setLoading(false);
        }

        // Initialize Google Sign-In
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse
            });
        }
    }, []);

    const handleGoogleResponse = (response) => {
        const idToken = response.credential;
        setLoading(true);
        fetchUserProfile(idToken);
    };

    const login = (role) => {
        // Fallback/Legacy mock logic if Google is not configured or for quick testing
        const mockProfile = {
            id: role === 'ADMIN' ? 1 : 2,
            name: role === 'ADMIN' ? 'System Admin' : 'John Doe',
            email: role === 'ADMIN' ? 'admin@smartcampus.edu' : 'john.doe@student.edu',
            role: role
        };
        setUser(mockProfile);
        localStorage.setItem('mockUser', JSON.stringify(mockProfile));
        localStorage.setItem('token', 'MOCKED_JWT_TOKEN');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mockUser');
        localStorage.removeItem('token');
        if (window.google) {
            window.google.accounts.id.disableAutoSelect();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, handleGoogleResponse, GOOGLE_CLIENT_ID }}>
            {children}
        </AuthContext.Provider>
    );
};
