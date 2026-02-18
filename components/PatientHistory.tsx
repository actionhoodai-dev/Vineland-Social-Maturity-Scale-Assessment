'use client';

import { useState } from 'react';
import { AssessmentRecord, AssessmentResponse, CATEGORY_CODES, CategoryCode } from '@/types';
import { fetchAllRecords } from '@/lib/api';
import { generateAssessmentPDF } from '@/lib/PDFGenerator';

/**
 * PatientHistory — Search, view, and download previous assessments
 */
export default function PatientHistory() {
    const [searchType, setSearchType] = useState<'patientId' | 'patientName'>('patientId');
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState<AssessmentRecord[]>([]);
    const [searching, setSearching] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'empty' | 'warning' | 'info'>('info');
    const [showResults, setShowResults] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    /** Execute search */
    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setMessage(`Please enter a ${searchType === 'patientId' ? 'Patient ID' : 'Patient Name'}.`);
            setMessageType('info');
            return;
        }

        setSearching(true);
        setMessage('');
        setShowResults(false);
        setExpandedIndex(null);

        try {
            const allData = await fetchAllRecords();
            let filtered: AssessmentRecord[] = [];

            if (searchType === 'patientId') {
                filtered = allData.filter((r) => r.Patient_ID === searchValue.trim());
            } else {
                const searchLower = searchValue.trim().toLowerCase();
                filtered = allData.filter(
                    (r) => r.Child_Name && r.Child_Name.toLowerCase().includes(searchLower)
                );

                if (filtered.length > 0) {
                    const uniqueIds = new Set(filtered.map((r) => r.Patient_ID).filter(Boolean));
                    if (uniqueIds.size > 1) {
                        setMessage('Multiple patients with same name found. Use Patient ID to distinguish.');
                        setMessageType('warning');
                    }
                }
            }

            if (filtered.length === 0) {
                setMessage('No records found for this patient.');
                setMessageType('empty');
            } else {
                setResults(filtered);
                setShowResults(true);
            }
        } catch (err) {
            setMessage(`Server Error: ${(err as Error).message}`);
            setMessageType('info');
        } finally {
            setSearching(false);
        }
    };

    /** Toggle inline detail view */
    const toggleDetail = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

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
                        onClick={() => { setSearchType('patientId'); setSearchValue(''); }}
                        className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider border rounded-sm transition-all ${searchType === 'patientId' ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'bg-white border-[#D1D5DB] text-[#374151]'}`}
                    >
                        Search by ID
                    </button>
                    <button
                        onClick={() => { setSearchType('patientName'); setSearchValue(''); }}
                        className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider border rounded-sm transition-all ${searchType === 'patientName' ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'bg-white border-[#D1D5DB] text-[#374151]'}`}
                    >
                        Search by Name
                    </button>
                </div>

                {/* Input area */}
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={searchType === 'patientId' ? 'Enter ID (e.g. VIN100)' : 'Enter child name'}
                        className="flex-1 px-4 py-3 text-[14px] text-[#111827] bg-[#F9FAFB] border border-[#D1D5DB] rounded-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={searching}
                        className="px-8 py-3 bg-[#1E3A8A] text-white text-[13px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#1a3278] disabled:bg-[#9CA3AF] transition-all"
                    >
                        {searching ? 'Loading...' : 'Search'}
                    </button>
                </div>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`text-center p-3 text-[13px] mb-4 border rounded-sm ${messageType === 'warning' ? 'bg-[#FFFBEB] border-[#F59E0B] text-[#92400E]' : 'bg-white border-[#D1D5DB] text-[#374151]'}`}>
                    {message}
                </div>
            )}

            {/* Results List (Responsive) */}
            {showResults && (
                <div className="space-y-4">
                    {results.map((record, idx) => (
                        <HistoryItem
                            key={idx}
                            record={record}
                            isExpanded={expandedIndex === idx}
                            onToggle={() => toggleDetail(idx)}
                        />
                    ))}
                </div>
            )}
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
            assessmentDate: record.Assessment_Date || '',
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
                        <span className="text-[10px] bg-[#F3F4F6] px-1.5 py-0.5 border border-[#D1D5DB] text-[#374151] font-bold">{record.Assessment_Date}</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-[#111827]">{record.Child_Name || 'Unknown Child'}</h4>
                    <p className="text-[11px] text-[#374151] uppercase tracking-wider font-medium">Age Level: {record.Age_Level || 'N/A'}</p>
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
                        <InfoBox label="DOB" value={record.DOB} />
                        <InfoBox label="Age" value={record.Age} />
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
