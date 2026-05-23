"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { getUserSessions, SessionResponse } from "@/lib/api/sessions";
import SessionCard from "@/components/sessions/SessionCard";
import Link from "next/link";

export default function SessionsPage() {
    const { user, loading: authLoading } = useAuth();
    const [sessions, setSessions] = useState<SessionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        getUserSessions()
            .then(data => {
                setSessions(data);
                setLoading(false);
            })
            .catch(e => {
                setError(e instanceof Error ? e.message : String(e));
                setLoading(false);
            });
    }, [user, authLoading]);

    if (loading) return (
        <div style={{ color: 'var(--text-secondary)' }} className="py-10 text-center">
            Loading sessions...
        </div>
    );

    if (!user) return (
        <div className="flex flex-col items-center gap-6 py-20">
            <p style={{ color: 'var(--text-secondary)' }}>
                Sign in to view your session history.
            </p>
            <Link
                href="/auth?redirect=/sessions"
                className="px-8 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
                Sign In
            </Link>
        </div>
    );

    if (error) return (
        <div style={{ color: 'var(--text-incorrect)' }} className="py-10 text-center">
            Error: {error}
        </div>
    );

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto py-10">
            <div className="flex items-center justify-between">
                <h1
                    className="text-2xl font-bold tracking-wide"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Your Sessions
                </h1>
                <Link
                    href="/sessions/new"
                    className="px-6 py-2 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                >
                    New Session
                </Link>
            </div>

            {sessions.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>
                    No sessions yet. Start one to get going.
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {sessions.map(session => (
                        <SessionCard key={session.sessionId} session={session} />
                    ))}
                </div>
            )}
        </div>
    );
}