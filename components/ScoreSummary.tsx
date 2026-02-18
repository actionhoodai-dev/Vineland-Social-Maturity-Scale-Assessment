'use client';

import { AssessmentResponse, CategoryCode, CATEGORY_CODES, CATEGORY_NAMES } from '@/types';
import { useMemo } from 'react';

interface Props {
    responses: AssessmentResponse[];
}

/**
 * ScoreSummary — Live category totals and grand total
 */
export default function ScoreSummary({ responses }: Props) {
    const { categoryTotals, grandTotal } = useMemo(() => {
        const totals: Record<CategoryCode, number> = {
            SHG: 0, SHE: 0, SHD: 0, SD: 0, OCC: 0, COM: 0, LOC: 0, SOC: 0,
        };
        let grand = 0;

        responses.forEach((r) => {
            if (r.achieved) {
                totals[r.category] += r.score;
                grand += r.score;
            }
        });

        return { categoryTotals: totals, grandTotal: grand };
    }, [responses]);

    return (
        <section className="bg-white border border-[#D1D5DB] p-4 md:p-5 mb-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wide pb-2 border-b-2 border-[#1E3A8A] mb-4">
                Score Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {CATEGORY_CODES.map((cat) => (
                    <div
                        key={cat}
                        className="flex justify-between items-center px-3 py-2 border border-[#D1D5DB] bg-white sm:bg-[#F9FAFB]"
                    >
                        <span className="text-[11px] font-bold text-[#374151] uppercase tracking-wider">
                            {cat}:
                        </span>
                        <span className="text-sm font-bold text-[#1E3A8A]">
                            {Number(categoryTotals[cat]).toFixed(1).replace(/\.0$/, '')}
                        </span>
                    </div>
                ))}

                {/* Grand Total */}
                <div className="sm:col-span-2 lg:col-span-4 flex justify-between items-center px-4 py-3 bg-[#1E3A8A] mt-2">
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-white">Grand Total Assessment Score:</span>
                    <span className="text-lg font-bold text-white">
                        {Number(grandTotal).toFixed(1).replace(/\.0$/, '')}
                    </span>
                </div>
            </div>
        </section>
    );
}
