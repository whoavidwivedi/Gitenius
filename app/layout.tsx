import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'GitGenius',
    description: 'AI-Powered GitHub Profiler',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${mono.variable} font-sans bg-black min-h-screen text-slate-200 antialiased selection:bg-cyan-500/20 selection:text-cyan-200`}>
                {children}
            </body>
        </html>
    );
}
