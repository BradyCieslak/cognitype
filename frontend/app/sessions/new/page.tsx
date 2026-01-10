// app/sessions/new/page.tsx
import SessionNewFlow from "@/components/sessions/SessionNewFlow";

export default function NewSessionPage() {
    return (
        <main style={{ maxWidth: 920, margin: "0 auto", padding: "24px 16px" }}>

            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                New Session
            </h1>

            <SessionNewFlow />

        </main>
    );
}
