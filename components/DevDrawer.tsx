
import React from 'react';

interface DevDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DevDrawer: React.FC<DevDrawerProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="bg-zinc-950 border-t border-zinc-800 w-full max-w-lg mx-auto p-8 pointer-events-auto animate-in slide-in-from-bottom duration-300 rounded-t-[10px] mb-0 shadow-2xl relative">
                {/* Handle */}
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mb-8" />

                <div className="flex flex-col items-center text-center gap-6">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white">
                        Typical developer things ha?
                    </h3>

                    <button
                        onClick={onClose}
                        className="w-full bg-white text-black font-semibold h-10 rounded-md hover:bg-zinc-200 transition-colors mt-4"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
