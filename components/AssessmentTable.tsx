'use client';

import { AssessmentResponse } from '@/types';

interface Props {
    responses: AssessmentResponse[];
    onToggle: (index: number) => void;
    ageLevel: string;
}

/**
 * AssessmentTable — Displays skills for the selected age level with toggle switches
 */
export default function AssessmentTable({ responses, onToggle, ageLevel }: Props) {
    if (!ageLevel) {
        return (
            <section className="bg-white border border-[#D1D5DB] p-5 mb-4">
                <h3 className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wide pb-2 border-b-2 border-[#1E3A8A] mb-4">
                    Assessment Items
                </h3>
                <p className="text-[13px] text-[#374151] py-3">
                    Select an Age Level above to display assessment items.
                </p>
            </section>
        );
    }

    return (
        <section className="bg-white border border-[#D1D5DB] p-4 md:p-5 mb-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wide pb-2 border-b-2 border-[#1E3A8A] mb-4">
                Assessment Items
            </h3>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr className="bg-[#1E3A8A]">
                            <th className="text-white font-medium text-xs uppercase tracking-wide px-3 py-2.5 border border-[#1E3A8A] text-center w-10">
                                #
                            </th>
                            <th className="text-white font-medium text-xs uppercase tracking-wide px-3 py-2.5 border border-[#1E3A8A] text-left">
                                Skill
                            </th>
                            <th className="text-white font-medium text-xs uppercase tracking-wide px-3 py-2.5 border border-[#1E3A8A] text-center w-20">
                                Category
                            </th>
                            <th className="text-white font-medium text-xs uppercase tracking-wide px-3 py-2.5 border border-[#1E3A8A] text-center w-16">
                                Score
                            </th>
                            <th className="text-white font-medium text-xs uppercase tracking-wide px-3 py-2.5 border border-[#1E3A8A] text-center w-20">
                                Achieved
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((item, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'}
                            >
                                <td className="px-3 py-2 border border-[#D1D5DB] text-center text-[#374151] text-xs">
                                    {index + 1}
                                </td>
                                <td className="px-3 py-2 border border-[#D1D5DB] text-left text-[#111827]">
                                    {item.skill}
                                </td>
                                <td className="px-3 py-2 border border-[#D1D5DB] text-center text-[11px] font-medium text-[#1E3A8A] tracking-wide">
                                    {item.category}
                                </td>
                                <td className="px-3 py-2 border border-[#D1D5DB] text-center font-medium text-[#111827]">
                                    {item.score}
                                </td>
                                <td className="px-3 py-2 border border-[#D1D5DB] text-center">
                                    <ToggleButton achieved={item.achieved} onClick={() => onToggle(index)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
                {responses.map((item, index) => (
                    <div key={index} className="border border-[#D1D5DB] p-3 rounded-sm bg-[#F9FAFB] flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[#1E3A8A] font-bold text-xs">#{index + 1}</span>
                            <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-white border border-[#1E3A8A] text-[#1E3A8A]">
                                {item.category}
                            </span>
                        </div>
                        <p className="text-[13px] text-[#111827] leading-snug">{item.skill}</p>
                        <div className="flex justify-between items-center border-t border-[#D1D5DB] pt-2 mt-1">
                            <span className="text-xs text-[#374151]">Score: <strong>{item.score}</strong></span>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-[#374151]">Achieved:</span>
                                <ToggleButton achieved={item.achieved} onClick={() => onToggle(index)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function ToggleButton({ achieved, onClick }: { achieved: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative inline-block w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${achieved ? 'bg-[#1E3A8A]' : 'bg-[#9CA3AF]'
                }`}
        >
            <span
                className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all duration-200 ${achieved ? 'left-[22px]' : 'left-1'
                    }`}
            />
        </button>
    );
}
