'use client';

import { useMemo, useState } from 'react';
import { AssessmentRecord, AssessmentSubmission, AssessmentResponse, CategoryCode } from '@/types';
import { generateAssessmentPDF } from '@/lib/PDFGenerator';

interface Props {
    allRecords: AssessmentRecord[];
}

/**
 * PatientHistory — Professional documentation archive with robust search (Navy Theme)
 */
export default function PatientHistory({ allRecords }: Props) {
    const [searchValue, setSearchValue] = useState('');
    const [searchType, setSearchType] = useState<'patientId' | 'name'>('name');

    // Filter results dynamically
    const filteredResults = useMemo(() => {
        const term = searchValue.trim().toLowerCase();
        if (!term) return [];

        return allRecords.filter((r) => {
            if (searchType === 'patientId') {
                const pid = (r.Patient_ID || '').toString().toLowerCase();
                return pid.includes(term);
            } else {
                const name = (r.Child_Name || '').toString().toLowerCase();
                return name.includes(term);
            }
        });
    }, [allRecords, searchValue, searchType]);

    // Handle regenerating PDF from stored record
    const handleDownloadHistoryPDF = (record: AssessmentRecord) => {
        try {
            let responses: AssessmentResponse[] = [];
            if (record.Vineland_Data_JSON) {
                responses = JSON.parse(record.Vineland_Data_JSON);
            }

            const domainTotals: Record<CategoryCode, number> = {
                SHG: record.SHG_Total || 0,
                SHE: record.SHE_Total || 0,
                SHD: record.SHD_Total || 0,
                SD: record.SD_Total || 0,
                OCC: record.OCC_Total || 0,
                COM: record.COM_Total || 0,
                LOC: record.LOC_Total || 0,
                SOC: record.SOC_Total || 0,
            };

            const submission: AssessmentSubmission = {
                childName: record.Child_Name || 'Unknown',
                dob: record.DOB || '',
                age: record.Age || '',
                gender: record.Gender || '',
                assessmentDate: record.Assessment_Date || record.Timestamp || new Date().toISOString(),
                patientId: record.Patient_ID || 'Unknown',
                therapistName: record.Therapist_Name || 'Institutional Record',
                assessmentId: record.Assessment_ID || '',
                responses: responses,
                domainTotals: domainTotals,
                overallTotal: record.Grand_Total || 0,
            };

            generateAssessmentPDF(submission);
        } catch (err) {
            console.error('Failed to regenerate PDF:', err);
            alert('Error generating PDF for this history record.');
        }
    };

    return (
        <section className="bg-white border border-[#D1D5DB] min-h-[600px] flex flex-col shadow-sm">
            {/* Header / Search Area */}
            <div className="p-5 md:p-8 border-b border-[#D1D5DB] bg-[#F9FAFB]">
                <h3 className="text-[12px] font-bold text-[#1E3A8A] uppercase tracking-[0.2em] mb-6">
                    Documentation Archive Search
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={searchType === 'name' ? "ENTER PATIENT NAME..." : "ENTER PATIENT ID..."}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-[#1E3A8A] rounded-none text-[13px] font-bold outline-none placeholder:text-[#9CA3AF] uppercase tracking-wider focus:ring-0 focus:border-[#1E3A8A]"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchValue && (
                            <button
                                onClick={() => setSearchValue('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1E3A8A] border-b-2 border-[#1E3A8A] uppercase hover:opacity-70"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex border-2 border-[#1E3A8A]">
                        <button
                            onClick={() => setSearchType('name')}
                            className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest ${searchType === 'name' ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#1E3A8A] hover:bg-[#F3F4F6]'}`}
                        >
                            Name
                        </button>
                        <button
                            onClick={() => setSearchType('patientId')}
                            className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-l-2 border-[#1E3A8A] ${searchType === 'patientId' ? 'bg-[#1E3A8A] text-white' : 'bg-white text-[#1E3A8A] hover:bg-[#F3F4F6]'}`}
                        >
                            ID
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-[800px]">
                    <thead className="bg-[#F9FAFB] border-b border-[#D1D5DB]">
                        <tr>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider border-r border-[#D1D5DB]">Identifier</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider border-r border-[#D1D5DB]">Profile Metadata</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider border-r border-[#D1D5DB] text-center">Outcome</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider border-r border-[#D1D5DB]">Recorded At</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider">Reports</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                        {!searchValue ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="w-10 h-10 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p className="text-[13px] font-bold text-[#9CA3AF] uppercase tracking-widest">
                                            Search clinical database for existing records
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center">
                                    <p className="text-[13px] font-bold text-black uppercase tracking-widest bg-red-50 py-3 border-2 border-red-100 mx-10">
                                        No matches found for search criteria
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            filteredResults.map((record, i) => (
                                <tr key={i} className="hover:bg-[#F9FAFB] transition-colors group">
                                    <td className="px-6 py-6 border-r border-[#D1D5DB]">
                                        <p className="text-[10px] font-bold text-[#6B7280] mb-1 uppercase tracking-tighter">Case Reference</p>
                                        <p className="text-[15px] font-bold text-[#1E3A8A] group-hover:underline underline-offset-4">{record.Patient_ID}</p>
                                        <p className="text-[9px] text-[#6B7280] mt-1.5 font-mono">UID: {record.Assessment_ID || i}</p>
                                    </td>
                                    <td className="px-6 py-6 border-r border-[#D1D5DB]">
                                        <p className="text-[14px] font-bold text-black uppercase tracking-wide">{record.Child_Name}</p>
                                        <p className="text-[11px] text-[#4B5563] mt-1 font-medium italic">{record.Age}Y | {record.Gender} | DR. {(record.Therapist_Name || 'UNKNOWN').toUpperCase()}</p>
                                    </td>
                                    <td className="px-6 py-6 border-r border-[#D1D5DB] text-center">
                                        <div className="inline-block px-5 py-2.5 bg-[#1E3A8A] text-white">
                                            <p className="text-[20px] font-bold leading-none">{Number(record.Grand_Total).toFixed(1).replace(/\.0$/, '')}</p>
                                            <p className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-80">Final Score</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 border-r border-[#D1D5DB]">
                                        <p className="text-[12px] font-bold text-black">
                                            {record.Timestamp ? new Date(record.Timestamp).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            }).toUpperCase() : 'N/A'}
                                        </p>
                                        <p className="text-[10px] text-[#6B7280] mt-1 font-bold">
                                            {record.Timestamp ? new Date(record.Timestamp).toLocaleTimeString('en-IN', {
                                                hour: '2-digit', minute: '2-digit', hour12: true
                                            }).toUpperCase() : ''}
                                        </p>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button
                                            onClick={() => handleDownloadHistoryPDF(record)}
                                            className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] text-[11px] font-bold uppercase tracking-widest hover:bg-[#1E3A8A] hover:text-white shadow-sm active:translate-y-0.5 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            REGENERATE PDF
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Scroll Indicator for mobile */}
            <div className="md:hidden p-3 bg-blue-50 text-[10px] font-bold text-[#1E3A8A] text-center border-t border-blue-100 animate-pulse">
                Swipe horizontally to view full table data →
            </div>
        </section>
    );
}
