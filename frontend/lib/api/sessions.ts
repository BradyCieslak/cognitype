
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const VERSION = "v1"

export type StartSessionRequest = {
    documentId: string;
    mode: "LENGTH" | "TIME";
    chunkSize?: number;
    timeSeconds?: number;
    difficulty: "EASY" | "MODERATE" | "HARD";
};

export async function startSession(req: StartSessionRequest): Promise<{ sessionId: string }> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    });

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(`Start session failed (${res.status}): ${msg}`);
    }

    return res.json();
}

export async function getNextChunk(sessionId: string) : Promise<{ chunkIndex: number; text: string }> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/sessions/${sessionId}/next-chunk`, {
        method: "GET",
    });

    if(!res.ok) {
        const msg = await res.text();
        throw new Error(`Get next chunk failed (${res.status}): ${msg}`)
    }

    return res.json();
}