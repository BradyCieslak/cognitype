const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const VERSION = "v1";

export async function uploadDocumentText(text: string): Promise<{ documentId: string }> {
    const res = await fetch(`${BASE_URL}/${VERSION}/api/documents`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    // throws error if backend doesn't return usable response
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Upload failed (${res.status}): ${msg}`);
    }

    return res.json();
}