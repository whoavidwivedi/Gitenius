import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-4xl font-bold tracking-tighter text-primary mb-4">404 - Not Found</h2>
            <p className="text-muted-foreground mb-8">Could not find the requested resource</p>
            <Link
                href="/"
                className="px-6 py-3 bg-zinc-900 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
