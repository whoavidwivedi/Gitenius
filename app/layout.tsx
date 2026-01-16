import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'Gitenius',
    description: 'AI-Powered GitHub Profiler',
    openGraph: {
        title: 'Gitenius',
        description: 'AI-Powered GitHub Profiler',
        images: ['/og.png'],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gitenius',
        description: 'AI-Powered GitHub Profiler',
        images: ['/og.png'],
    },
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
