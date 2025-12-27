import type { Metadata } from "next";
import { Michroma } from "next/font/google";
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
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
