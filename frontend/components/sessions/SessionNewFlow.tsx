"use client";

import { useState } from "react";
import { uploadDocumentText, uploadDocumentFile } from "@/lib/api/documents";
import { startSession } from "@/lib/api/sessions";
import { useRouter } from "next/navigation";

type Step = "upload" | "configure" | "start";

export default function SessionNewFlow() {
    const router = useRouter();

    const [step, setStep] = useState<Step>("upload");
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [previewText, setPreviewText] = useState<string>("");
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [chunkSize, setChunkSize] = useState(200);
    const [timeSeconds, setTimeSeconds] = useState(30);
    const [difficulty, setDifficulty] = useState<"light" | "moderate" | "intense">("moderate");

    const [title, setTitle] = useState("");
    const [uploadMode, setUploadMode] = useState<"paste" | "file">("paste");
    const [file, setFile] = useState<File | null>(null);

    function toApiDifficulty(d: "light" | "moderate" | "intense"): "LIGHT" | "MODERATE" | "INTENSE" {
        return d.toUpperCase() as "LIGHT" | "MODERATE" | "INTENSE";
    }

    const steps: Step[] = ["upload", "configure", "start"];
    const stepLabels: Record<Step, string> = {
        upload: "Upload",
        configure: "Configure",
        start: "Start",
    };

    async function handleUpload() {
        setError(null);
        setBusy(true);
        try {
            let result: { documentId: string };

            if (uploadMode === "file") {
                if (!file) {
                    setError("Please select a file.");
                    setBusy(false);
                    return;
                }
                result = await uploadDocumentFile(file);
                setPreviewText(`File uploaded: ${file.name}`);
            } else {
                const cleaned = text.trim();
                if (!cleaned) {
                    setError("Please enter some text.");
                    setBusy(false);
                    return;
                }
                result = await uploadDocumentText(cleaned);
                setPreviewText(cleaned);
            }

            setDocumentId(result.documentId);
            setStep("configure");
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    }

    async function handleStart() {
        setError(null);
        if (!documentId) return;
        setBusy(true);
        try {
            const req = { documentId, chunkSize, difficulty: toApiDifficulty(difficulty) };
            const { sessionId } = await startSession(req);
            router.push(`/sessions/${sessionId}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">

            {/* Step tabs */}
            <div className="flex gap-0 rounded-md overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {steps.map((s, i) => (
                    <button
                        key={s}
                        onClick={() => {
                            if (s === "configure" && !documentId) return;
                            if (s === "start" && !documentId) return;
                            setStep(s);
                        }}
                        className="flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-colors"
                        style={{
                            backgroundColor: step === s ? 'var(--accent)' : 'var(--bg-secondary)',
                            color: step === s ? '#fff' : 'var(--text-secondary)',
                            borderRight: i < steps.length - 1 ? '1px solid var(--border)' : 'none',
                            cursor: (s === "configure" || s === "start") && !documentId ? 'not-allowed' : 'pointer',
                            opacity: (s === "configure" || s === "start") && !documentId ? 0.5 : 1,
                        }}
                    >
                        {stepLabels[s]}
                    </button>
                ))}
            </div>

            {/* Step 1: Upload */}
            {step === "upload" && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Upload your material
                    </h2>

                    {/* Toggle paste/file */}
                    <div className="flex gap-0 rounded-md overflow-hidden w-fit" style={{ border: '1px solid var(--border)' }}>
                        {(["paste", "file"] as const).map((m, i) => (
                            <button
                                key={m}
                                onClick={() => setUploadMode(m)}
                                className="px-6 py-2 text-sm font-semibold tracking-wide uppercase transition-colors"
                                style={{
                                    backgroundColor: uploadMode === m ? 'var(--accent)' : 'var(--bg-secondary)',
                                    color: uploadMode === m ? '#fff' : 'var(--text-secondary)',
                                    borderRight: i === 0 ? '1px solid var(--border)' : 'none',
                                }}
                            >
                                {m === "paste" ? "Paste Text" : "Upload File"}
                            </button>
                        ))}
                    </div>

                    {/* Title field */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-md text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                        }}
                    />

                    {/* Paste mode */}
                    {uploadMode === "paste" && (
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Paste your text here..."
                            rows={10}
                            className="w-full px-4 py-3 rounded-md text-sm outline-none resize-none font-mono"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                            }}
                        />
                    )}

                    {/* File mode */}
                    {uploadMode === "file" && (
                        <div
                            className="w-full px-4 py-10 rounded-md text-sm text-center cursor-pointer"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '2px dashed var(--border)',
                                color: 'var(--text-secondary)',
                            }}
                            onClick={() => document.getElementById("file-input")?.click()}
                        >
                            {file ? file.name : "Click to select a .pdf, .txt, or .docx file"}
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf,.txt,.docx"
                                className="hidden"
                                onChange={e => setFile(e.target.files?.[0] ?? null)}
                            />
                        </div>
                    )}

                    {error && <p className="text-sm" style={{ color: 'var(--text-incorrect)' }}>{error}</p>}

                    <button
                        onClick={handleUpload}
                        disabled={busy}
                        className="px-8 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80 self-end"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                        {busy ? "Uploading..." : "Upload"}
                    </button>
                </div>
            )}

            {/* Step 2: Configure */}
            {step === "configure" && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Configure your session
                    </h2>

                    {/* Text preview */}
                    <div
                        className="p-4 rounded-md text-sm font-mono max-h-40 overflow-y-auto"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        {previewText.slice(0, 300)}{previewText.length > 300 ? "..." : ""}
                    </div>

                    {/* Need to Implement Chunk size based on difficulty */}

                    {/* Difficulty */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            Difficulty
                        </label>
                        <div className="flex gap-3">
                            {(["light", "moderate", "intense"] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className="px-6 py-2 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                                    style={{
                                        backgroundColor: difficulty === d ? 'var(--accent)' : 'var(--bg-secondary)',
                                        color: difficulty === d ? '#fff' : 'var(--text-secondary)',
                                        border: '1px solid var(--border)',
                                    }}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setStep("start")}
                        className="px-8 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80 self-end"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Step 3: Start */}
            {step === "start" && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Ready to start
                    </h2>

                    <div
                        className="p-6 rounded-md flex flex-col gap-3"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div className="flex justify-between text-sm">
                            <span style={{ color: 'var(--text-secondary)' }}>Difficulty</span>
                            <span style={{ color: 'var(--text-primary)' }} className="font-semibold uppercase">{difficulty}</span>
                        </div>
                    </div>

                    {error && <p className="text-sm" style={{ color: 'var(--text-incorrect)' }}>{error}</p>}

                    <button
                        onClick={handleStart}
                        disabled={busy}
                        className="px-8 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                        {busy ? "Starting..." : "Start Session"}
                    </button>
                </div>
            )}
        </div>
    );
}