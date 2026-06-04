'use client';

import { useMemo } from 'react';
import { AssessmentResponse, CategoryCode, CATEGORY_NAMES, CATEGORY_CODES } from '@/types';
import { VSMS_DATA } from '@/data/vsms-data';
import DomainRadarChart from './DomainRadarChart';

interface Props {
    responses: AssessmentResponse[];
}

/**
 * ScoreSummary — Domain developmental age profile display and SVG radar profiling
 */
export default function ScoreSummary({ responses }: Props) {
    // 1. Calculate max domain totals dynamically from the full VSMS data (for chart normalization)
    const maxDomainTotals = useMemo(() => {
        const totals: Record<CategoryCode, number> = {
            SHG: 0, SHE: 0, SHD: 0, SD: 0, OCC: 0, COM: 0, LOC: 0, SOC: 0,
        };
        Object.values(VSMS_DATA).forEach((group) => {
            group.items.forEach((item) => {
                // Find the maximum month value in each domain
                if (item.score > totals[item.category]) {
                    totals[item.category] = item.score;
                }
            });
        });
        return totals;
    }, []);

    // 2. Calculate domain Social Age in months as the score of the LAST 'YES' response
    const categoryTotals = useMemo(() => {
        const totals: Record<CategoryCode, number> = {
            SHG: 0, SHE: 0, SHD: 0, SD: 0, OCC: 0, COM: 0, LOC: 0, SOC: 0,
        };

        CATEGORY_CODES.forEach((cat) => {
            const domainResponses = responses.filter(r => r.category === cat);
            // Find the last item (highest ID) in this domain answered with YES
            const lastYes = [...domainResponses].reverse().find(r => r.response === 'YES');
            totals[cat] = lastYes ? lastYes.weightage : 0;
        });

        return totals;
    }, [responses]);

    return (
        <section className="bg-white border border-[#D1D5DB] p-6 mb-8 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b-2 border-[#1E3A8A] mb-8 gap-4">
                <h3 className="text-[12px] font-bold text-[#1E3A8A] uppercase tracking-[0.2em]">
                    Developmental Profile Summary & Profiler
                </h3>
                <span className="text-[9px] font-black uppercase text-[#1E3A8A] border border-[#1E3A8A] px-2.5 py-1">
                    Last-YES Domain scoring
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Domain Scores Table */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {CATEGORY_CODES.map((cat) => {
                            const saMonthsVal = categoryTotals[cat];
                            const saYearsVal = saMonthsVal / 12;
                            return (
                                <div key={cat} className="flex justify-between items-end py-2.5 border-b border-[#F3F4F6] group">
                                    <div className="flex flex-col">
                                        <span className="text-[8.5px] font-bold text-[#6B7280] uppercase tracking-wider mb-0.5">
                                            {cat}
                                        </span>
                                        <span className="text-[11px] font-bold text-black uppercase tracking-tight leading-none group-hover:text-[#1E3A8A] transition-colors">
                                            {CATEGORY_NAMES[cat]}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-[#1E3A8A] tabular-nums leading-none">
                                            {saMonthsVal.toFixed(1).replace(/\.0$/, '')}m
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-bold mt-0.5">
                                            ({saYearsVal.toFixed(2)}y)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: SVG Radar Profile Chart */}
                <div className="lg:col-span-5">
                    <DomainRadarChart domainTotals={categoryTotals} maxDomainTotals={maxDomainTotals} />
                </div>
            </div>

            <div className="mt-8 flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100">
                <svg className="w-4.5 h-4.5 text-[#1E3A8A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-[10px] text-[#1E3A8A] leading-relaxed font-medium">
                    <span>
                        <strong>Clinical Scoring Protocol:</strong> The developmental age for each domain corresponds to the developmental month value of the last item answered YES in that domain. The radar profile illustrates the child's developmental age relative to domain norm limits.
                    </span>
                </p>
            </div>
        </section>
    );
}
