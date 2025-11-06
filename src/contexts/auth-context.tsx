"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    _id: string;
    displayName: string;
    email: string;
    photoURL?: string;
    plan: 'Free' | 'Premium';
    bio: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // Check if we have a stored user on mount
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });

    useEffect(() => {
        // Update localStorage and cookies when user changes
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            // Set token cookie for 7 days
            const token = localStorage.getItem('token');
            if (token) {
                setCookie('token', token, 7);
            }
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            deleteCookie('token');
        }
    }, [user]);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}