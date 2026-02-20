'use client';

import { useMemo } from 'react';
import { AssessmentResponse, CategoryCode, CATEGORY_NAMES, CATEGORY_CODES } from '@/types';

interface Props {
    responses: AssessmentResponse[];
}

/**
 * ScoreSummary — Structured clinical score calculation and domain display (Navy Theme)
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
        <section className="bg-white border border-[#D1D5DB] p-6 mb-8 shadow-sm">
            <h3 className="text-[12px] font-bold text-[#1E3A8A] uppercase tracking-[0.2em] pb-3 border-b-2 border-[#1E3A8A] mb-8">
                Assessment Outcome Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6">
                {CATEGORY_CODES.map((cat) => (
                    <div key={cat} className="flex justify-between items-end py-2 border-b border-[#F3F4F6] group">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-tighter mb-0.5">
                                {cat}
                            </span>
                            <span className="text-[11px] font-bold text-black uppercase tracking-tight leading-none group-hover:text-[#1E3A8A] transition-colors">
                                {CATEGORY_NAMES[cat]}
                            </span>
                        </div>
                        <span className="text-lg font-bold text-[#1E3A8A] tabular-nums leading-none">
                            {Number(categoryTotals[cat]).toFixed(1).replace(/\.0$/, '')}
                        </span>
                    </div>
                ))}

                {/* Grand Total */}
                <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row justify-between items-center px-8 py-6 bg-[#1E3A8A] mt-6 shadow-xl">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-white border border-white/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
                            Accumulated Assessment Capital:
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[32px] font-extrabold text-white leading-none tabular-nums">
                            {Number(grandTotal).toFixed(1).replace(/\.0$/, '')}
                        </span>
                        <span className="text-[10px] font-bold text-white/60 uppercase">Points</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 italic">
                <svg className="w-4 h-4 text-[#1E3A8A] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-[10px] text-[#1E3A8A] leading-relaxed">
                    Calculated via clinical weightage accumulation. No developmental age coefficients or quotients have been applied per institutional directive.
                </p>
            </div>
        </section>
    );
}
