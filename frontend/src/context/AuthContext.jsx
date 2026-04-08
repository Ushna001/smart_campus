import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since we are mocking OAuth for local dev (No Client Secret), 
        // we'll simulate reading a session from localStorage.
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (role) => {
        const mockProfile = {
            id: role === 'ADMIN' ? 1 : 2,
            name: role === 'ADMIN' ? 'System Admin' : 'John Doe',
            email: role === 'ADMIN' ? 'admin@smartcampus.edu' : 'john.doe@student.edu',
            role: role
        };
        setUser(mockProfile);
        localStorage.setItem('mockUser', JSON.stringify(mockProfile));
        localStorage.setItem('token', 'MOCKED_JWT_TOKEN'); // Would be real JWT
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mockUser');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
