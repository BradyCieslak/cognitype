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

    const numLines = 3;
    const fontSize = 24;

    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [lineHeight, setLineHeight] = useState<number>(fontSize * 1.5);
    const prevWordTopRef = useRef<number>(0);
    const [currentLine, setCurrentLine] = useState(0);

    const fadeZone = lineHeight;
    const containerHeight = lineHeight > 0 ? lineHeight * (numLines + 1) : fontSize * (numLines + 1);
    const fadePercent = Math.round((fadeZone / containerHeight) * 100);
    const translateY = -(currentLine * lineHeight) + fadeZone;

    const [measured, setMeasured] = useState(false);

    useEffect(() => {
        loadNextChunk();
    }, [sessionId]);

    useEffect(() => {
        if (!loading && stage === "typing" && measured) {
            containerRef.current?.focus();
        }
    }, [loading, stage, measured]);

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

    useEffect(() => {
        if (!words.length || loading) return;
        const tops = wordRefs.current.filter(r => r !== null).slice(0, 20).map(r => r!.offsetTop);
        const uniqueTops = [...new Set(tops)].sort((a, b) => a - b);
        if (uniqueTops.length > 1) {
            setLineHeight(uniqueTops[1] - uniqueTops[0]);
        }
    }, [words, loading]);

    useEffect(() => {
        if (!loading && words.length > 0) {
            setMeasured(true);
        }
    }, [lineHeight]);

    function loadNextChunk() {
        setLoading(true);
        setStage("typing");
        startTimeRef.current = null;
        prevWordTopRef.current = 0;
        wordRefs.current = [];
        setLineHeight(0);
        setMeasured(false)

        getNextChunk(sessionId)
            .then(chunk => {
                setChunkText(chunk.text);
                const tokens = chunk.text
                    .split(/( |\n)/)
                    .filter(t => t !== " " && t.length > 0)
                    .map(t => t === "\n" ? "↵" : t)
                    .filter((t, i, arr) => !(t === "↵" && arr[i - 1] === "↵"));
                setWords(tokens);
                setCompletedWords([]);
                setCurrentWordIndex(0);
                setCurrentLine(0);
                setCurrentInput("");
                setLoading(false);
            })
            .catch(e => {
                setError(e instanceof Error ? e.message : String(e));
                setLoading(false);
            });
}

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (stage !== "typing" || !words.length) return;
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
        }

        const key = e.key;

        if (key === " ") {
            e.preventDefault();
            if (words[currentWordIndex] === "↵") return;
            if (currentInput.length === 0) return;

            const next = currentWordIndex + 1;
            setCompletedWords(prev => [...prev, currentInput]);
            setCurrentInput("");

            if (next >= words.length) {
                setStage("questions");
            } else {
                setCurrentWordIndex(next);
                const prevTop = wordRefs.current[currentWordIndex]?.offsetTop ?? 0;
                const nextTop = wordRefs.current[next]?.offsetTop ?? 0;
                if (nextTop > prevTop && words[next] !== "↵") {
                    setCurrentLine(prev => prev + 1);
                }
                prevWordTopRef.current = nextTop;
            }
        } else if (key === "Enter") {
            if (words[currentWordIndex] === "↵" || words[currentWordIndex + 1] === "↵") {
                if (currentInput.length === 0) return;
                const next = currentWordIndex + 2;
                setCompletedWords(prev => [...prev, currentInput, "↵"]);
                setCurrentInput("");
                setCurrentLine(prev => prev + 1);

                if (next >= words.length) {
                    setStage("questions");
                } else {
                    setCurrentWordIndex(next);
                }
            }
        } else if (key === "Tab") {
            e.preventDefault();
            setCurrentWordIndex(0);
            setCurrentInput("");
            setCompletedWords([]);
            setCurrentLine(0);
            startTimeRef.current = null;
            prevWordTopRef.current = 0;
        } else if (key === "Backspace") {
            if (currentInput.length > 0) {
                setCurrentInput(prev => prev.slice(0, -1));
            } else if (currentWordIndex > 0) {
                const prevIndex = currentWordIndex - 1;
                const prevTyped = completedWords[prevIndex];
                
                const currentTop = wordRefs.current[currentWordIndex]?.offsetTop ?? 0;
                const prevTop = wordRefs.current[prevIndex]?.offsetTop ?? 0;
                if (prevTop < currentTop) {
                    setCurrentLine(prev => Math.max(0, prev - 1));
                }

                setCurrentWordIndex(prevIndex);
                setCurrentInput(prevTyped);
                setCompletedWords(prev => prev.slice(0, -1));
            }
        } else if (key.length === 1) {
                setCurrentInput(prev => prev + key);
        }

    }, [stage, words, currentWordIndex, currentInput, completedWords]);

    function renderWord(word: string, typedWord: string, isActive: boolean, index: number) {
        if (word === "↵") {
            return (
                <span
                    key={index}
                    ref={el => { wordRefs.current[index] = el; }}
                >
                    <span style={{
                        color: index < currentWordIndex ? 'var(--text-correct)' : 'var(--text-secondary)',
                        borderLeft: isActive ? '2px solid var(--accent)' : 'none'
                    }}>
                        ↵
                    </span>
                    <br />
                </span>
            );
        }

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
            <span
                key={index}
                ref={el => { wordRefs.current[index] = el; }}
                className={`inline-block ${words[index + 1] === "↵" ? "mr-0" : "mr-3"}`}
            >
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
                ? (completedWords[i] ?? "")
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
                <div
                    style={{
                        height: `${containerHeight}px`,
                        width: '100%',
                        visibility: measured ? 'visible' : 'hidden',
                        overflow: 'hidden',
                        cursor: 'text',
                        position: 'relative',
                        maskImage: `linear-gradient(to bottom, transparent 0%, black ${fadePercent}%, black 85%, transparent 100%)`,
                        WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${fadePercent}%, black 85%, transparent 100%)`,
                    }}
                    onClick={() => containerRef.current?.focus()}
                >

                    <div
                        ref={containerRef}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        className="leading-relaxed font-mono outline-none"
                        style={{
                            transform: `translateY(${translateY}px)`,
                            transition: 'transform 0.15s ease',
                            fontSize: `${fontSize}px`,
                        }}
                    >
                        {renderChunk()}
                    </div>
                </div>
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