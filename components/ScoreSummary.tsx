'use client';

import { useMemo } from 'react';
import { AssessmentResponse, CategoryCode, CATEGORY_NAMES, CATEGORY_CODES } from '@/types';

interface Props {
    responses: AssessmentResponse[];
}

/**
 * ScoreSummary — Structured clinical score calculation and domain display
 */
export default function ScoreSummary({ responses }: Props) {
    const { categoryTotals, grandTotal } = useMemo(() => {
        const totals: Record<CategoryCode, number> = {
            SHG: 0, SHE: 0, SHD: 0, SD: 0, OCC: 0, COM: 0, LOC: 0, SOC: 0,
        };
        let grand = 0;

        responses.forEach((r) => {
            if (r.response === 'YES') {
                totals[r.category] += r.weightage;
                grand += r.weightage;
            }
        });

        return { categoryTotals: totals, grandTotal: grand };
    }, [responses]);

    return (
        <section className="bg-white border border-[#D1D5DB] p-6 mb-6">
            <h3 className="text-[12px] font-bold text-black uppercase tracking-[0.2em] pb-3 border-b border-[#D1D5DB] mb-6">
                Clinical Assessment Score Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                {CATEGORY_CODES.map((cat) => (
                    <div key={cat} className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
                        <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                            {cat} ({CATEGORY_NAMES[cat]}):
                        </span>
                        <span className="text-sm font-bold text-black">
                            {Number(categoryTotals[cat]).toFixed(1).replace(/\.0$/, '')}
                        </span>
                    </div>
                ))}

                {/* Grand Total */}
                <div className="sm:col-span-2 lg:col-span-4 flex justify-between items-center px-6 py-4 bg-black mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                        Grand Total Assessment Score Accumulation:
                    </span>
                    <span className="text-[20px] font-bold text-white">
                        {Number(grandTotal).toFixed(1).replace(/\.0$/, '')}
                    </span>
                </div>
            </div>

            <p className="mt-4 text-[10px] text-[#6B7280] italic">
                NOTE: Score is calculated by accumulating weightage of skills marked as 'YES'. No psychological age adjustments applied.
            </p>
        </section>
    );
}
