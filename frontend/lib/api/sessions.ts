
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const VERSION = "v1"

export type StartSessionRequest = {
    documentId: string;
    chunkSize?: number;
    timeSeconds?: number;
    difficulty: "LIGHT" | "MODERATE" | "INTENSE";
};

export type SessionResponse = {
    sessionId: number;
    documentId: number;
    documentTitle: string;
    currentChunkIndex: number;
    typedChars: number;
    elapsedMs: number;
    accuracy: number;
    completed: boolean;
    createdAt: string;
    completedAt: string | null;
};

export async function startSession(req: StartSessionRequest): Promise<{ sessionId: string }> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        credentials: 'include',
    });

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(`Start session failed (${res.status}): ${msg}`);
    }

    return res.json();
}

export async function seekChunk(sessionId: string, chunkIndex: number): Promise<{ id: number; text: string }> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/sessions/${sessionId}/seek`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chunkIndex }),
        credentials: 'include',
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Seek failed (${res.status}): ${msg}`);
    }

    return res.json();
}

export async function getUserSessions(): Promise<SessionResponse[]> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/sessions`, {
        method: "GET",
        credentials: 'include',
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Failed to fetch sessions (${res.status}): ${msg}`);
    }

    return res.json();
}