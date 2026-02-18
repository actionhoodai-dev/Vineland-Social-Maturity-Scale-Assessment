'use client';

import { useState, useEffect, useMemo } from 'react';
import { AssessmentRecord, AssessmentResponse } from '@/types';
import { generateAssessmentPDF } from '@/lib/PDFGenerator';
import { formatDateOnly, formatDateTime } from '@/utils/dateFormatter';

interface Props {
    allRecords: AssessmentRecord[];
}

/**
 * PatientHistory — Search, view, and download previous assessments with dynamic filtering
 */
export default function PatientHistory({ allRecords }: Props) {
    const [searchType, setSearchType] = useState<'patientId' | 'patientName'>('patientId');
    const [searchValue, setSearchValue] = useState('');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    // Dynamic filtering
    const filteredResults = useMemo(() => {
        const term = searchValue.trim().toLowerCase();
        if (!term) return [];

        return allRecords.filter((r) => {
            if (searchType === 'patientId') {
                const pid = (r.Patient_ID || (r as any).patient_id || '').toString().toLowerCase();
                return pid.includes(term);
            } else {
                const name = (r.Child_Name || (r as any).child_name || '').toString().toLowerCase();
                return name.includes(term);
            }
        });
    }, [allRecords, searchValue, searchType]);

    // Clear search when changing type
    useEffect(() => {
        setExpandedIndex(null);
    }, [searchType]);

    return (
        <section className="bg-white border border-[#D1D5DB] p-4 md:p-5 mb-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wide pb-2 border-b-2 border-[#1E3A8A] mb-4">
                Patient History &amp; Reports
            </h3>

            {/* Search Panel */}
            <div className="mb-6 space-y-4">
                {/* Search Type Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setSearchType('patientId')}
                        className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider border rounded-sm transition-all ${searchType === 'patientId' ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'bg-white border-[#D1D5DB] text-[#374151]'}`}
                    >
                        Search by ID
                    </button>
                    <button
                        onClick={() => setSearchType('patientName')}
                        className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider border rounded-sm transition-all ${searchType === 'patientName' ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'bg-white border-[#D1D5DB] text-[#374151]'}`}
                    >
                        Search by Name
                    </button>
                </div>

                {/* Input area */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={searchType === 'patientId' ? 'Start typing ID (e.g. VIN100)' : 'Start typing child name...'}
                        className="w-full px-4 py-3 text-[14px] text-[#111827] bg-[#F9FAFB] border border-[#D1D5DB] rounded-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                    />
                    {searchValue && (
                        <button
                            onClick={() => setSearchValue('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#6B7280] uppercase hover:text-[#B91C1C]"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results List (Responsive) */}
            <div className="space-y-4">
                {searchValue && filteredResults.length === 0 && (
                    <div className="text-center p-8 bg-[#F9FAFB] border border-dashed border-[#D1D5DB] text-[#6B7280] text-sm italic">
                        No matching records found for "{searchValue}"
                    </div>
                )}

                {filteredResults.map((record, idx) => (
                    <HistoryItem
                        key={idx}
                        record={record}
                        isExpanded={expandedIndex === idx}
                        onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    />
                ))}

                {!searchValue && (
                    <div className="text-center p-12 opacity-40">
                        <div className="w-12 h-12 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">Type to search patient history</p>
                    </div>
                )}
            </div>
        </section>
    );
}

/* --- ROW / ITEM COMPONENT --- */

function HistoryItem({ record, isExpanded, onToggle }: { record: AssessmentRecord; isExpanded: boolean; onToggle: () => void }) {
    const responses: AssessmentResponse[] = record.Vineland_Data_JSON ? JSON.parse(record.Vineland_Data_JSON) : [];

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        generateAssessmentPDF({
            childName: record.Child_Name || 'N/A',
            dob: record.DOB || '',
            age: record.Age || '',
            gender: record.Gender || '',
            ageLevel: record.Age_Level || '',
            assessmentDate: record.Timestamp || record.Assessment_Date || '',
            patientId: record.Patient_ID || '',
            responses,
        });
    };

    return (
        <div className={`border border-[#D1D5DB] rounded-sm transition-all ${isExpanded ? 'shadow-md border-[#1E3A8A]' : 'hover:border-[#9CA3AF]'}`}>
            {/* Summary Area */}
            <div onClick={onToggle} className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1E3A8A]">{record.Patient_ID || 'NO-ID'}</span>
                        <span className="text-[10px] bg-[#F3F4F6] px-1.5 py-0.5 border border-[#D1D5DB] text-[#374151] font-bold">
                            {formatDateOnly(record.Assessment_Date)}
                        </span>
                    </div>
                    <h4 className="text-[15px] font-bold text-[#111827]">{record.Child_Name || 'Unknown Child'}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <p className="text-[11px] text-[#374151] uppercase tracking-wider font-medium">Age Level: {record.Age_Level || 'N/A'}</p>
                        <p className="text-[10px] text-[#6B7280] font-medium italic">Submitted: {formatDateTime(record.Timestamp)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                    <div className="text-right mr-4 hidden sm:block">
                        <p className="text-[10px] text-[#374151] uppercase font-bold">Grand Total</p>
                        <p className="text-lg font-black text-[#1E3A8A] leading-none">{record.Grand_Total || 0}</p>
                    </div>
                    <button onClick={handleDownload} className="flex-1 sm:flex-none px-4 py-2 bg-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-widest rounded-sm">
                        PDF
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-[#F3F4F6] border border-[#D1D5DB] text-[#1E3A8A] text-[11px] font-bold uppercase tracking-widest rounded-sm">
                        {isExpanded ? 'Hide' : 'View'}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="p-4 border-t border-[#D1D5DB] bg-[#F9FAFB] animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <InfoBox label="Gender" value={record.Gender} />
                        <InfoBox label="DOB" value={formatDateOnly(record.DOB)} />
                        <InfoBox label="Assessment Date" value={formatDateOnly(record.Assessment_Date)} />
                        <InfoBox label="Total Score" value={record.Grand_Total} isHighlight />
                    </div>

                    <div className="space-y-2">
                        <h5 className="text-[11px] font-black uppercase text-[#1E3A8A] tracking-widest mb-3 flex items-center gap-2">
                            <span className="h-px bg-[#1E3A8A] flex-1"></span>
                            Category Scores
                            <span className="h-px bg-[#1E3A8A] flex-1"></span>
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <ScoreCard label="SHG" score={record.SHG_Total} />
                            <ScoreCard label="SHE" score={record.SHE_Total} />
                            <ScoreCard label="SHD" score={record.SHD_Total} />
                            <ScoreCard label="SD" score={record.SD_Total} />
                            <ScoreCard label="OCC" score={record.OCC_Total} />
                            <ScoreCard label="COM" score={record.COM_Total} />
                            <ScoreCard label="LOC" score={record.LOC_Total} />
                            <ScoreCard label="SOC" score={record.SOC_Total} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoBox({ label, value, isHighlight }: { label: string; value?: any; isHighlight?: boolean }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#374151] uppercase tracking-wider">{label}</span>
            <span className={`text-[13px] font-bold ${isHighlight ? 'text-[#1E3A8A]' : 'text-[#111827]'}`}>{value || 'N/A'}</span>
        </div>
    );
}

function ScoreCard({ label, score }: { label: string; score?: any }) {
    return (
        <div className="bg-white border border-[#D1D5DB] p-2 flex justify-between items-center rounded-sm">
            <span className="text-[10px] font-bold text-[#1E3A8A]">{label}</span>
            <span className="text-xs font-black text-[#111827]">{score || 0}</span>
        </div>
    );
}
