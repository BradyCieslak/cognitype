import type { Metadata } from "next";
import { Michroma } from "next/font/google";
import NavBar from "@/components/layout/NavBar";
import "./globals.css";

export const michroma = Michroma({
  subsets: ["latin"],
  variable: "--font-michroma",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cognitype",
  description: "Comprehension Booster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
        <NavBar />
        <main className="max-w-4xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
