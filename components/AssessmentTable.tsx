'use client';

import { useState } from 'react';
import { AssessmentResponse, ResponseType } from '@/types';

interface Props {
    responses: AssessmentResponse[];
    onResponseChange: (index: number, response: ResponseType) => void;
}

/**
 * AssessmentTable — Mobile-responsive progressive block-based assessment
 */
export default function AssessmentTable({ responses, onResponseChange }: Props) {
    // Determine the unique age blocks in order
    const ageBlocks = Array.from(new Set(responses.map(r => r.ageBlock)));

    // State to track which blocks are visible
    const [visibleBlocksCount, setVisibleBlocksCount] = useState(1);

    const showNextBlock = () => {
        if (visibleBlocksCount < ageBlocks.length) {
            setVisibleBlocksCount(prev => prev + 1);
        }
    };

    return (
        <section className="space-y-6 mb-8">
            {ageBlocks.slice(0, visibleBlocksCount).map((blockName, blockIndex) => {
                const blockSkills = responses.filter(r => r.ageBlock === blockName);
                const isLastVisible = blockIndex === visibleBlocksCount - 1;
                const hasMore = visibleBlocksCount < ageBlocks.length;

                return (
                    <div key={blockName} className="bg-white border border-[#D1D5DB] overflow-hidden shadow-sm">
                        {/* Block Header */}
                        <div className="bg-[#1E3A8A] px-5 py-3 flex justify-between items-center">
                            <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                                Age Level: {blockName}
                            </h3>
                            <span className="text-[9px] text-white/70 font-bold uppercase">
                                {blockSkills.length} Skills
                            </span>
                        </div>

                        {/* Skills List (Mobile-First / Card Style) */}
                        <div className="divide-y divide-[#F3F4F6]">
                            {blockSkills.map((skill) => {
                                // Find the original index in the main responses array
                                const originalIndex = responses.findIndex(r => r.id === skill.id);

                                return (
                                    <div key={skill.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9FAFB] transition-colors">
                                        <div className="flex gap-3 items-start flex-1">
                                            <span className="text-[10px] font-bold text-[#1E3A8A] bg-[#EFF6FF] px-1.5 py-0.5 mt-0.5 border border-[#BFDBFE] min-w-[30px] text-center">
                                                #{skill.id}
                                            </span>
                                            <div className="flex flex-col">
                                                <p className="text-[13.5px] font-medium text-black leading-snug">
                                                    {skill.skill}
                                                </p>
                                                <div className="flex gap-3 mt-1.5">
                                                    <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-tighter">
                                                        Domain: {skill.category}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-[#1E3A8A] uppercase tracking-tighter">
                                                        Weight: {Number(skill.weightage).toFixed(1).replace(/\.0$/, '')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Simplified Respond Controls (No NT button for mobile space) */}
                                        <div className="flex gap-2 self-end sm:self-center">
                                            <ResponseButton
                                                variant="YES"
                                                active={skill.response === 'YES'}
                                                onClick={() => onResponseChange(originalIndex, skill.response === 'YES' ? 'NOT TESTED' : 'YES')}
                                            />
                                            <ResponseButton
                                                variant="NO"
                                                active={skill.response === 'NO'}
                                                onClick={() => onResponseChange(originalIndex, skill.response === 'NO' ? 'NOT TESTED' : 'NO')}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Expand Next Block Button */}
                        {isLastVisible && hasMore && (
                            <div className="p-4 bg-[#F9FAFB] border-t border-[#D1D5DB] text-center">
                                <button
                                    type="button"
                                    onClick={showNextBlock}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] text-[11px] font-bold uppercase tracking-widest hover:bg-[#1E3A8A] hover:text-white transition-all group"
                                >
                                    Proceed to Next Age Level
                                    <svg className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Desktop Legend Refresh */}
            <div className="px-6 py-4 bg-white border border-[#1E3A8A] flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-[#1E3A8A]">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#1E3A8A]"></span>
                    <span>YES: Assigned Weight</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-white border border-[#1E3A8A]"></span>
                    <span>NO: 0 Score</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="italic opacity-70">Unselected items default to 'Not Tested' in final documentation</span>
                </div>
            </div>
        </section>
    );
}

function ResponseButton({ variant, active, onClick }: { variant: 'YES' | 'NO', active: boolean, onClick: () => void }) {
    const activeStyles = variant === 'YES'
        ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md'
        : 'bg-[#B91C1C] border-[#B91C1C] text-white shadow-md';

    const inactiveStyles = 'bg-white border-[#D1D5DB] text-black hover:border-[#1E3A8A]';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`min-w-[70px] px-4 py-2 text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 ${active ? activeStyles : inactiveStyles}`}
        >
            {active && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
            {variant}
        </button>
    );
}
