import Link from "next/link";

export default function NavBar() {
    return (
        <nav
            className="w-full px-8 py-4 flex items-center justify-between border-b"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
            {/* Left: Logo */}
            <Link
                href="/"
                className="text-lg font-bold tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}
            >
                Cognitype
            </Link>

            {/* Center: Nav links */}
            <div className="flex gap-4 sm:gap-12 lg:gap-16 text-lg" style={{ color: 'var(--text-secondary)' }}>
                <Link href="/sessions" className="hover:text-(--accent) hover:[text-shadow:0_0_2px_currentColor]">Sessions</Link>
                <Link href="/explore" className="hover:text-(--accent) hover:[text-shadow:0_0_2px_currentColor]">Explore</Link>
                <Link href="/friends" className="hover:text-(--accent) hover:[text-shadow:0_0_2px_currentColor]">Friends</Link>
                <Link href="/badges" className="hover:text-(--accent) hover:[text-shadow:0_0_2px_currentColor]">Badges</Link>
            </div>

            {/* Right: Settings + Profile */}
            <div className="flex items-center gap-8">
                <Link
                    href="/settings"
                    className="text-xl hover:opacity-70"
                    title="Settings"
                >
                    ⚙️
                </Link>
                <button
                    className="text-xl hover:opacity-70"
                    title="Account"
                >
                    👤
                </button>
            </div>
        </nav>
    );
}