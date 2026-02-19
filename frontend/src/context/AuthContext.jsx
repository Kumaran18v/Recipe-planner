import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        if (token) {
            try {
                // Verify token implies getting user
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        // User will be loaded by useEffect
    };

    const register = async (userData) => {
        await apiRegister(userData);
        // Optionally auto-login
        await login(userData.email, userData.password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser: loadUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
