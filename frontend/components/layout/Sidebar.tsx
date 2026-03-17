"use client";

import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, loading, logout } = useAuth();
    const pathname = usePathname();

    async function handleLogout() {
        await logout();
        onClose();
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <div
                className="fixed top-0 right-0 h-full w-80 z-50 flex flex-col p-8 gap-6"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderLeft: '1px solid var(--border)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.2s ease',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2
                        className="text-lg font-semibold tracking-wide"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Account
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-xl hover:opacity-70"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
                ) : user ? (
                    <div className="flex flex-col gap-4">
                        <p
                            className="text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Signed in as
                        </p>
                        <p
                            className="font-semibold"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {user.email}
                        </p>
                        <button
                            onClick={handleLogout}
                            className="mt-4 px-6 py-2 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                            style={{
                                backgroundColor: 'var(--bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)'
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Sign in to track your sessions, earn badges, and compete with friends.
                        </p>
                        <Link
                            href={`/auth?redirect=${pathname}`}
                            onClick={onClose}
                            className="px-6 py-3 rounded-md text-sm font-semibold tracking-wide uppercase text-center transition-opacity hover:opacity-80"
                            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                        >
                            Sign In / Register
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}