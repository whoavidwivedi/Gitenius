'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Heart, ArrowLeft } from 'lucide-react';

import { DevDrawer } from '../../components/DevDrawer';

export default function SponsorPage() {
    const [copied, setCopied] = useState(false);
    const [showDevDrawer, setShowDevDrawer] = useState(false);
    const upiId = 'whoavidwivedi@oksbi';

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Right-click override
    React.useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setShowDevDrawer(true);
        };

        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-slate-200">
            <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">

                {/* Navigation */}
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Return to Dashboard
                </Link>

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-8 h-8 text-primary animate-pulse" fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white">
                        Support the Project
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
                        If Gitenius has helped you visualize your journey, consider supporting independent development.
                    </p>
                </div>

                {/* UPI Card */}
                <div className="bg-zinc-900 border border-border p-8 rounded-lg space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded">UPI</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                            Virtual Payment Address (VPA)
                        </label>
                        <div className="flex items-center gap-3 bg-black border border-zinc-800 p-4 rounded group-hover:border-primary/50 transition-colors">
                            <code className="flex-grow font-mono text-lg text-primary truncate">
                                {upiId}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-white"
                                title="Copy UPI ID"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                            Scan with GPay, PhonePe, Paytm, or any UPI app.
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="text-center pt-8 border-t border-zinc-900">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        Secure • Direct • Developer First
                    </p>
                </div>

            </div>

            <DevDrawer isOpen={showDevDrawer} onClose={() => setShowDevDrawer(false)} />
        </div>
    );
}
