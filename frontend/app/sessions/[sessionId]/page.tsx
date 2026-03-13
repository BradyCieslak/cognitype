"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { getNextChunk } from "@/lib/api/sessions";

type ChunkStage = "typing" | "questions";

export default function SessionPage() {
    const { sessionId } = useParams<{ sessionId: string }>();

    const [chunkText, setChunkText] = useState<string | null>(null);
    const [stage, setStage] = useState<ChunkStage>("typing");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentInput, setCurrentInput] = useState("");
    const [completedWords, setCompletedWords] = useState<string[]>([]);

    const startTimeRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    function loadNextChunk() {
        setLoading(true);
        setStage("typing");
        setCurrentWordIndex(0);
        setCurrentInput("");
        setCompletedWords([]);
        startTimeRef.current = null;

        getNextChunk(sessionId)
            .then(chunk => {
                setChunkText(chunk.text);
                const tokens = chunk.text
                    .split(/( |\n)/)
                    .filter(t => t !== " " && t.length > 0)
                    .map(t => t === "\n" ? "↵" : t);
                setWords(tokens);
                setLoading(false);
            })
            .catch(e => {
                setError(e instanceof Error ? e.message : String(e));
                setLoading(false);
            });
    }

    useEffect(() => {
        loadNextChunk();
    }, [sessionId]);

    useEffect(() => {
        if (!loading && stage === "typing") {
            containerRef.current?.focus();
        }
    }, [loading, stage]);

    useEffect(() => {
    if (stage !== "questions") return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            loadNextChunk();
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}, [stage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (stage !== "typing" || !words.length) return;

        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
        }

        const key = e.key;

        if (key === " ") {
            e.preventDefault();

            if (words[currentWordIndex] === "↵") return;

            const next = currentWordIndex + 1;
            setCompletedWords(prev => [...prev, currentInput]);
            setCurrentInput("");

            if (next >= words.length) {
                setStage("questions");
            } else {
                setCurrentWordIndex(next);
            }

        } else if (key === "Enter") {
            if (words[currentWordIndex] === "↵") {
                const next = currentWordIndex + 1;
                setCompletedWords(prev => [...prev, "↵"]);
                setCurrentInput("");
                if (next >= words.length) {
                    setStage("questions");
                } else {
                    setCurrentWordIndex(next);
                }
            }
        }else if (key === "Backspace") {
            if (currentInput.length > 0) {
                setCurrentInput(prev => prev.slice(0, -1));
            } else if (currentWordIndex > 0) {
                const prevIndex = currentWordIndex - 1;
                const prevTyped = completedWords[prevIndex];
                setCurrentWordIndex(prevIndex);
                setCurrentInput(prevTyped);
                setCompletedWords(prev => prev.slice(0, -1));
            }

        } else if (key.length === 1) {
            setCurrentInput(prev => prev + key);
        }

    }, [stage, words, currentWordIndex, currentInput, completedWords]);

function renderWord(word: string, typedWord: string, isActive: boolean, index: number) {
    const chars = word.split("").map((char, i) => {
        let color = "var(--text-secondary)";

        if (i < typedWord.length) {
            color = typedWord[i] === char ? "var(--text-correct)" : "var(--text-incorrect)";
        }

        const isCursorBefore = isActive && i === typedWord.length;
        const isCursorAfter = isActive && typedWord.length >= word.length && i === word.length - 1;

        return (
            <span
                key={i}
                style={{
                    color,
                    borderLeft: isCursorBefore ? "2px solid var(--accent)" : "none",
                    borderRight: isCursorAfter ? "2px solid var(--accent)" : "none",
                    transition: "color 0.05s",
                }}
            >
                {char}
            </span>
        );
    });

    const extras = typedWord.slice(word.length).split("").map((char, i) => (
        <span key={`extra-${i}`} style={{ color: "var(--text-incorrect" }}>
            {char}
        </span>
    ));

    return (
        <span key={index} className="inline-block mr-3">
            {chars}
            {extras}
        </span>
    );
}

    function renderChunk() {
        return words.map((word, i) => {
            const isCompleted = i < currentWordIndex;
            const isActive = i === currentWordIndex;
            const typedWord = isCompleted
                ? completedWords[i]
                : isActive
                ? currentInput
                : "";
            return renderWord(word, typedWord, isActive, i);
        });
    }

    const totalChars = chunkText?.length ?? 1;
    const typedChars = completedWords.join(" ").length + currentInput.length;
    const progress = Math.min((typedChars / totalChars) * 100, 100);

    if (loading) return (
        <div style={{ color: 'var(--text-secondary)' }} className="py-10 text-center">
            Loading chunk...
        </div>
    );

    if (error) return (
        <div style={{ color: 'var(--text-incorrect)' }} className="py-10 text-center">
            Error: {error}
        </div>
    );

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto min-h-[calc(80vh-64px)] justify-center">

            {stage === "typing" && (
                <>
                    <div
                        ref={containerRef}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        className="text-xl leading-relaxed font-mono p-6 outline-none cursor-text"
                    >
                        {renderChunk()}
                    </div>
                </>
            )}

            {stage === "questions" && (
                <div
                    className="p-6 rounded-md flex flex-col items-center gap-6"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border)'
                    }}
                >
                    <h2
                        className="text-xl font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Chunk Complete
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Comprehension questions will appear here.
                    </p>
                    <button
                        onClick={loadNextChunk}
                        className="px-8 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                        Next Chunk
                    </button>
                </div>
            )}

        </div>
    );
}