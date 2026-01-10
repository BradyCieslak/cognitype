"use client";

import { useState } from "react";
import { uploadDocumentText } from "@/lib/api/documents";
import { startSession } from "@/lib/api/sessions"

export default function SessionNewFlow() {

    const [documentId, setDocumentId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [chunkText, setChunkText] = useState<string | null>(null);

    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false); 
    const [error, setError] = useState<string | null>(null);

    const [mode, setMode] = useState<"length" | "time">("length");
    const [chunkSize, setChunkSize] = useState(200);
    const [difficulty, setDifficulty] = useState<"easy" | "moderate" | "hard">("moderate");

    function toApiMode(mode: "time" | "length"): "TIME" | "LENGTH" {
        return mode === "time" ? "TIME" : "LENGTH";
    }

    function toApiDifficulty(
        difficulty: "easy" | "moderate" | "hard"
    ): "EASY" | "MODERATE" | "HARD" {
        return difficulty.toUpperCase() as "EASY" | "MODERATE" | "HARD";
    }


    async function handleUploadText() {
        setError(null);

        const cleaned = text.trim();
        if(!cleaned) {
            setError("Please enter text to upload.");
            return;
        }
        setBusy(true);
        try {
            const { documentId } = await uploadDocumentText(cleaned);
            setDocumentId(documentId);

            setSessionId(null);
            setChunkText(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    }

    async function handleStartSession() {
        setError(null);
        if (!documentId) return;

        setBusy(true);
        try {
            const req = 
            mode === "length"
            ? {documentId,
                mode: toApiMode(mode),
                chunkSize,
                difficulty: toApiDifficulty(difficulty)
            }
            : {documentId,
                mode: toApiMode(mode),
                timeSeconds: 30,
                difficulty: toApiDifficulty(difficulty)
            };

            const { sessionId } = await startSession(req);
            setSessionId(sessionId);
            setChunkText(null);
        } catch (e) {
            setError(e instanceof Error ? e.message: String(e));
        } finally {
            setBusy(false);
        }
    }

    return (
        <section style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 12}}>
                <div>documentId: {documentId ?? "(none)"}</div>
                <div>sessionId: {sessionId ?? "(none)"}</div>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste text here..."
                style={{ width: "100%", minHeight: 120, marginBottom: 8 }}
            />

            <div style={{ display: "flex", gap: 8, marginBottom: 12}}>
                <button onClick={handleUploadText} disabled={busy}>
                    {busy ? "Uploading..." : "Upload text"}
                </button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <label>
                    mode{" "}
                    <select value={mode} onChange={(e) => setMode(e.target.value as "length" | "time")}>
                        <option value="length">length</option>
                        <option value="time">time</option>
                    </select>
                </label>

                <label>
                    chunkSize{" "}
                    <input
                        type="number"
                        value={chunkSize}
                        onChange={(e) => setChunkSize(Number(e.target.value))}
                        disabled={mode !== "length"}
                        style={{ width: 90 }}
                    />
                </label>

                <label>
                    difficulty{" "}
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as "easy" | "moderate" | "hard")}
                    >
                        <option value="easy">easy</option>
                        <option value="moderate">moderate</option>
                        <option value="hard">hard</option>
                    </select>
                </label>

                <button onClick={handleStartSession} disabled={busy || !documentId}>
                    Start Session
                </button>
            </div>

            {error ? <div style={{ marginBottom: 12}}>Error: {error}</div> : null}

            <pre style={{ whiteSpace: "pre-wrap" }}>{chunkText ?? "No chunk yet."}</pre>
        </section>
    );
}