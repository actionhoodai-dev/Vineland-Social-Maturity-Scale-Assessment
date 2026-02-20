'use client';

import { useEffect, useState } from 'react';

/**
 * Header — Enterprise Clinical Institutional Header (Navy Theme)
 */
export default function Header() {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
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
        <header className="bg-white border border-[#D1D5DB] px-6 md:px-10 py-6 md:py-8 mb-6 md:mb-8 text-black shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Institution Details */}
                <div className="text-center md:text-left">
                    <h1 className="text-[18px] md:text-[22px] font-bold tracking-[0.05em] text-[#1E3A8A] border-b-4 border-[#1E3A8A] pb-1 inline-block uppercase">
                        Occupational Therapy Foundation
                    </h1>
                    <div className="mt-3 text-[10px] md:text-[11px] font-bold tracking-wider leading-relaxed uppercase opacity-70 text-[#1E3A8A]">
                        <p>36/7, AGILMEDU STREET – 4 | SAIT COLONY</p>
                        <p>ERODE – 638001 | TAMIL NADU, INDIA</p>
                    </div>
                </div>

                {/* Document Information */}
                <div className="text-center md:text-right flex flex-col items-center md:items-end">
                    <span className="text-[9px] font-bold bg-[#1E3A8A] text-white px-3 py-1 tracking-[0.2em] uppercase mb-2">
                        Authorized Assessment Unit
                    </span>
                    <h2 className="text-[14px] md:text-[16px] font-bold tracking-widest uppercase text-black">
                        Vineland Social Maturity Scale
                    </h2>
                    <p className="text-[9px] md:text-[10px] mt-2 font-bold opacity-60 uppercase tracking-widest text-[#1E3A8A]">
                        Reference: {currentTime}
                    </p>
                </div>
            </div>
        </header>
    );
}
