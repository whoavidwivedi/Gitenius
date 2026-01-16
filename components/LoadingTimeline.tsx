
import React from 'react';

interface LoadingTimelineProps {
    currentStep: number; // 0: Idle, 1: Fetching Github, 2: Analyzing, 3: Done
}

export const LoadingTimeline: React.FC<LoadingTimelineProps> = ({ currentStep }) => {
    if (currentStep === 0 || currentStep > 2) return null;

    const steps = [
        { id: 1, label: 'SYNCING REPOSITORIES' },
        { id: 2, label: 'COMPUTING INTELLIGENCE' },
    ];

    return (
        <div className="w-full max-w-lg mt-12 flex flex-col gap-4">
            {/* Bars Container */}
            <div className="flex w-full gap-3">
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <div
                            key={step.id}
                            className="h-2 flex-1 relative overflow-hidden bg-zinc-900 rounded-sm border border-zinc-800"
                        >
                            {/* Base Fill */}
                            <div
                                className={`
                                    absolute top-0 left-0 h-full w-full transition-all duration-500
                                    ${isCompleted ? 'bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]' : ''}
                                    ${isActive ? 'bg-primary/20' : ''}
                                `}
                            />

                            {/* Active Scanning Effect */}
                            {isActive && (
                                <div
                                    className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"
                                    style={{ animation: 'scan 1.5s infinite linear' }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Labels & Status Container */}
            <div className="flex w-full justify-between items-start">
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col gap-1 flex-1 ${step.id === 2 ? 'items-end text-right' : 'items-start text-left'}`}
                        >
                            <div className={`
                                text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300
                                ${isActive || isCompleted ? 'text-primary' : 'text-zinc-600'}
                            `}>
                                {step.label}
                            </div>

                            {/* Tech Indicator */}
                            <div className={`
                                text-[9px] font-mono tracking-widest uppercase
                                ${isActive ? 'text-primary animate-pulse' : 'text-zinc-700'}
                                ${isCompleted ? 'text-primary opacity-50' : ''}
                            `}>
                                {isActive ? '>>> PROCESSING' : isCompleted ? 'COMPLETE' : 'WAITING'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
