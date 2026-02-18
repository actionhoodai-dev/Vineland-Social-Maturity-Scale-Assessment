'use client';

import { formatDateOnly } from '@/utils/dateFormatter';

/**
 * Header — Institution title, assessment name, and current date
 */
export default function Header() {
    const today = formatDateOnly(new Date());

    return (
        <header className="bg-white border border-[#D1D5DB] px-8 pt-6 pb-4 mb-4">
            {/* Institution */}
            <div className="text-center mb-4">
                <h1 className="text-base font-semibold text-[#1E3A8A] tracking-wide">
                    OCCUPATIONAL THERAPY FOUNDATION
                </h1>
                <p className="text-xs text-[#374151] leading-relaxed">36/7, AGILMEDU STREET – 4</p>
                <p className="text-xs text-[#374151] leading-relaxed">SAIT COLONY, ERODE – 638001</p>
            </div>

            {/* Assessment Title */}
            <div className="text-center mb-3 pt-3 border-t border-[#D1D5DB]">
                <h2 className="text-[15px] font-semibold text-[#111827] tracking-wide">
                    VINELAND SOCIAL MATURITY SCALE
                </h2>
                <p className="text-xs text-[#374151]">(Assessment Form)</p>
            </div>

            {/* Date */}
            <div className="text-right text-xs text-[#374151]">
                Assessment Date: <span className="font-medium text-[#111827]">{today}</span>
            </div>
        </header>
    );
}
