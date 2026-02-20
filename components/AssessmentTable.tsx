'use client';

import { AssessmentResponse, ResponseType, VSMSDataMap } from '@/types';
import { VSMS_DATA } from '@/data/vsms-data';

interface Props {
    responses: AssessmentResponse[];
    onResponseChange: (index: number, response: ResponseType) => void;
}

/**
 * AssessmentTable — Progressive structured weighted assessment display
 */
export default function AssessmentTable({ responses, onResponseChange }: Props) {
    // Group records by age level for progressive display
    const ageLevels = Object.keys(VSMS_DATA);

    return (
        <section className="bg-white border border-[#D1D5DB] p-0 mb-6 overflow-hidden">
            <div className="bg-[#F9FAFB] border-b border-[#D1D5DB] px-6 py-4">
                <h3 className="text-[12px] font-bold text-black uppercase tracking-[0.2em]">
                    Progressive Skill Assessment Grid
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-white border-b border-[#D1D5DB]">
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB]">Age Level</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB]">ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB] w-1/2">Skill Description</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB]">Domain</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB] text-center">Max marks</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider text-center">Score Response</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-[13px] text-[#6B7280] italic">
                                    INITIALIZING ASSESSMENT DATA...
                                </td>
                            </tr>
                        ) : (
                            responses.map((item, index) => {
                                // Find if this is the start of a new age block
                                const isFirstInBlock = index === 0 || responses[index - 1].ageBlock !== item.ageBlock;

                                return (
                                    <tr key={item.id} className={`${index % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'} border-b border-[#D1D5DB] hover:bg-[#F3F4F6] transition-colors`}>
                                        <td className="px-6 py-4 text-[11px] font-bold text-black border-r border-[#D1D5DB]">
                                            {isFirstInBlock ? item.ageBlock : ''}
                                        </td>
                                        <td className="px-6 py-4 text-[12px] text-black font-medium border-r border-[#D1D5DB]">
                                            #{item.id}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-black leading-relaxed border-r border-[#D1D5DB]">
                                            {item.skill}
                                        </td>
                                        <td className="px-6 py-4 text-center border-r border-[#D1D5DB]">
                                            <span className="text-[10px] font-bold px-2 py-0.5 border border-black uppercase">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-[12px] font-bold text-black border-r border-[#D1D5DB]">
                                            {Number(item.weightage).toFixed(1).replace(/\.0$/, '')}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-1">
                                                <ResponseButton
                                                    active={item.response === 'YES'}
                                                    label="YES"
                                                    onClick={() => onResponseChange(index, 'YES')}
                                                />
                                                <ResponseButton
                                                    active={item.response === 'NO'}
                                                    label="NO"
                                                    onClick={() => onResponseChange(index, 'NO')}
                                                />
                                                <ResponseButton
                                                    active={item.response === 'NOT TESTED'}
                                                    label="NT"
                                                    onClick={() => onResponseChange(index, 'NOT TESTED')}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="px-6 py-3 bg-[#F9FAFB] border-t border-[#D1D5DB] flex gap-4 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                <span>NT: Not Tested</span>
                <span>YES: {Number(responses[0]?.weightage || 0).toFixed(1).replace(/\.0$/, '')} (Item Weight)</span>
                <span>NO: 0 (No Score)</span>
            </div>
        </section>
    );
}

function ResponseButton({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-10 h-8 text-[10px] font-bold border transition-all ${active
                    ? 'bg-black border-black text-white shadow-inner'
                    : 'bg-white border-[#D1D5DB] text-black hover:border-black'
                }`}
        >
            {label}
        </button>
    );
}
