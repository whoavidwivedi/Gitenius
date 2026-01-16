import React, { useState } from 'react';

interface DownloadButtonProps {
    username: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ username }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (isGenerating) return;
        setIsGenerating(true);

        // Store original body classes to restore later
        const originalBodyClasses = document.body.className;

        try {
            // 1. Load library dynamically
            const html2pdf = (await import('html2pdf.js')).default;

            // 2. Prepare the document
            document.body.classList.add('printing');

            // 3. Wait for React/Browser to paint the new layout
            // We need a slight delay to ensure the .print-only div is fully rendered and styled
            await new Promise(resolve => setTimeout(resolve, 800));

            // 4. Capture the element
            const element = document.body;

            // 5. PDF Options
            const opt = {
                margin: 0,
                filename: `${username}_gitenius_report.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2, // High resolution
                    useCORS: true,
                    logging: false,
                    windowWidth: 1920, // Desktop width for replica
                    scrollY: 0,
                    x: 0,
                    y: 0
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'landscape' as const
                },
                pagebreak: { mode: 'avoid-all' }
            };

            // 6. Generate and Save
            await html2pdf().set(opt).from(element).save();

        } catch (error) {
            console.error('PDF Generation Failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            // 7. Cleanup
            document.body.className = originalBodyClasses;
            // Force a small delay before re-enabling button to prevent spam
            setTimeout(() => setIsGenerating(false), 500);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`
                w-full py-3 border 
                ${isGenerating
                    ? 'border-primary/50 bg-primary/20 text-white cursor-wait'
                    : 'border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary hover:text-white'
                } 
                text-[10px] font-bold tracking-widest uppercase transition-all duration-300
            `}
        >
            {isGenerating ? 'GENERATING REPORT...' : 'DOWNLOAD PDF REPORT'}
        </button>
    );
};
