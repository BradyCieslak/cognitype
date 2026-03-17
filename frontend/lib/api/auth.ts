const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const VERSION = "v1";

export type UserInfo = {
    userId: number;
    email: string;
};

export async function register(email: string, password: string): Promise<UserInfo> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Register failed (${res.status}): ${msg}`);
    }

    return res.json();
}

export async function login(email: string, password: string): Promise<UserInfo> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Login failed (${res.status}): ${msg}`);
    }

    return res.json();
}