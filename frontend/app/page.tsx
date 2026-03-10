import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center text-center gap-10 py-20">

            {/* Philosophy section */}
            <div className="max-w-2xl flex flex-col gap-4">
                <h1
                    className="text-4xl font-bold tracking-widest uppercase"
                    style={{ color: 'var(--accent)' }}
                >
                    Cognitype
                </h1>
                <p
                    className="text-lg leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    Most people read without really absorbing anything. Cognitype fixes that
                    by making you type what you read, slowing you down enough to actually
                    engage with the material. Stop droning and start learning like never before.
                </p>
            </div>

            {/* Divider */}
            <div
                className="w-full max-w-2xl h-px"
                style={{ backgroundColor: 'var(--border)' }}
            />

            {/* Get Started section */}
            <div className="flex flex-col items-center gap-6">
                <h2
                    className="text-2xl font-semibold tracking-wide"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Get Started
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/sessions/new"
                        className="px-8 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                        Upload Material
                    </Link>
                    <Link
                        href="/explore"
                        className="px-8 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-80"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    >
                        Browse Content
                    </Link>
                </div>
            </div>

        </div>
    );
}