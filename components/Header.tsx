'use client';

import { useEffect, useState } from 'react';

/**
 * Header — Enterprise Clinical Institutional Header
 */
export default function Header() {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // Match the required PDF format for UI consistency
        const updateTime = () => {
            const now = new Date();
            const formatted = now.toLocaleString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            }).replace(',', ' –');
            setCurrentTime(formatted);
        };

        updateTime();
        const timer = setInterval(updateTime, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="bg-white border border-[#D1D5DB] px-10 py-8 mb-8 text-black">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Institution Details */}
                <div className="text-center md:text-left">
                    <h1 className="text-[20px] font-bold tracking-[0.1em] border-b-2 border-black pb-1 inline-block uppercase">
                        Occupational Therapy Foundation
                    </h1>
                    <div className="mt-3 text-[11px] font-medium tracking-wider leading-relaxed uppercase opacity-70">
                        <p>36/7, AGILMEDU STREET – 4</p>
                        <p>SAIT COLONY, ERODE – 638001</p>
                        <p>TAMIL NADU, INDIA</p>
                    </div>
                </div>

                {/* Document Information */}
                <div className="text-center md:text-right flex flex-col items-center md:items-end">
                    <span className="text-[10px] font-bold bg-black text-white px-3 py-1 tracking-[0.2em] uppercase mb-2">
                        Clinical Documentation
                    </span>
                    <h2 className="text-[16px] font-bold tracking-widest uppercase">
                        Vineland Social Maturity Scale
                    </h2>
                    <p className="text-[10px] mt-2 font-bold opacity-60 uppercase tracking-widest">
                        Document Reference: {currentTime}
                    </p>
                </div>
            </div>
        </header>
    );
}
