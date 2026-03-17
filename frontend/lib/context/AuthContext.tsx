"use client";

import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type User = {
    userId: number;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/v1/api/auth/profile`, {
            credentials: 'include',
        })
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    async function logout() {
        await fetch(`${BASE_URL}/v1/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}