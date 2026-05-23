import Link from "next/link";
import { SessionResponse } from "@/lib/api/sessions";

type Props = {
    session: SessionResponse;
};

export default function SessionCard({ session }: Props) {
    const date = new Date(session.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <Link href={`/sessions/${session.sessionId}`}>
            <div
                className="w-full p-6 rounded-md flex items-center justify-between transition-opacity hover:opacity-80"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                }}
            >
                <div className="flex flex-col gap-1">
                    <p
                        className="font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {session.documentTitle ?? "Untitled Document"}
                    </p>
                    <p
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {date}
                    </p>
                </div>

                <div
                    className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                        backgroundColor: session.completed ? 'var(--bg)' : 'var(--accent)',
                        color: session.completed ? 'var(--text-secondary)' : '#fff',
                        border: session.completed ? '1px solid var(--border)' : 'none',
                    }}
                >
                    {session.completed ? "Completed" : "In Progress"}
                </div>
            </div>
        </Link>
    );
}