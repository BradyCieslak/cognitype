"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, register } from "@/lib/api/auth";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";
    const { setUser } = useAuth();

    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function handleSubmit() {
        setError(null);

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        if (mode === "register" && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setBusy(true);
        try {
            const user = mode === "login"
                ? await login(email, password)
                : await register(email, password);

            setUser({ userId: user.userId, email: user.email });
            router.push(redirect);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div
                className="w-full max-w-md p-8 rounded-lg flex flex-col gap-6"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                }}
            >
                {/* Title */}
                <h1
                    className="text-2xl font-bold tracking-wide text-center"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {mode === "login" ? "Sign In" : "Create Account"}
                </h1>

                {/* Fields */}
                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-md text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--bg)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-md text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--bg)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                        }}
                    />
                    {mode === "register" && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-md text-sm outline-none"
                            style={{
                                backgroundColor: 'var(--bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                            }}
                        />
                    )}
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm" style={{ color: 'var(--text-incorrect)' }}>
                        {error}
                    </p>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={busy}
                    className="w-full py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                >
                    {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                </button>

                {/* Toggle */}
                <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setMode(mode === "login" ? "register" : "login");
                            setError(null);
                        }}
                        className="hover:underline"
                        style={{ color: 'var(--accent)' }}
                    >
                        {mode === "login" ? "Register" : "Sign In"}
                    </button>
                </p>
            </div>
        </div>
    );
}