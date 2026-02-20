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
                    <h1 className="text-[20px] md:text-[24px] font-extrabold tracking-tight text-[#1E3A8A] uppercase">
                        Occupational Therapy Foundation
                    </h1>
                    <div className="mt-2 text-[11px] md:text-[12px] font-bold tracking-wide uppercase text-[#1E3A8A] opacity-80">
                        <p>36/7, AGILMEDU STREET – 4 | SAIT COLONY</p>
                        <p>ERODE – 638001 | TAMIL NADU, INDIA</p>
                        <p className="mt-1 border-t border-[#1E3A8A]/20 pt-1">
                            PH: +91 94437 12345 | EMAIL: info@otfoundation.in
                        </p>
                    </div>
                </div>

                {/* Document Information */}
                <div className="text-center md:text-right flex flex-col items-center md:items-end">
                    <span className="text-[10px] font-bold bg-[#1E3A8A] text-white px-4 py-1.5 tracking-[0.2em] uppercase mb-2">
                        Clinical Performance Report
                    </span>
                    <h2 className="text-[15px] md:text-[18px] font-black tracking-widest uppercase text-black">
                        Vineland Social Maturity Scale
                    </h2>
                    <div className="mt-3 py-1 px-3 bg-blue-50 border border-blue-100">
                        <p className="text-[9px] font-black text-[#1E3A8A] uppercase tracking-widest">
                            {currentTime}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
