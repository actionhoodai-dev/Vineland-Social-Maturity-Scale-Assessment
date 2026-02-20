'use client';

import { useMemo, useState } from 'react';
import { AssessmentRecord, AssessmentSubmission, AssessmentResponse, CategoryCode, CATEGORY_CODES } from '@/types';
import { generateAssessmentPDF } from '@/lib/PDFGenerator';

interface Props {
    allRecords: AssessmentRecord[];
}

/**
 * PatientHistory — Professional documentation archive with robust search
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
            // Parse granular responses if stored, otherwise build from totals
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
                therapistName: record.Therapist_Name || 'Not Stated',
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
        <section className="bg-white border border-[#D1D5DB] min-h-[600px] flex flex-col">
            {/* Header / Search Area */}
            <div className="p-6 border-b border-[#D1D5DB] bg-[#F9FAFB]">
                <h3 className="text-[12px] font-bold text-black uppercase tracking-[0.2em] mb-6">
                    Documentation Archive Search
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={searchType === 'name' ? "SEARCH BY PATIENT NAME..." : "SEARCH BY PATIENT ID..."}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-black rounded-none text-[13px] font-medium outline-none placeholder:text-[#9CA3AF] uppercase tracking-wider"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchValue && (
                            <button
                                onClick={() => setSearchValue('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-black border-b border-black uppercase"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex border border-black">
                        <button
                            onClick={() => setSearchType('name')}
                            className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest ${searchType === 'name' ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#F3F4F6]'}`}
                        >
                            Name
                        </button>
                        <button
                            onClick={() => setSearchType('patientId')}
                            className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest border-l border-black ${searchType === 'patientId' ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#F3F4F6]'}`}
                        >
                            ID
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-white border-b border-[#D1D5DB]">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB]">Record ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB]">Patient Details</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB] text-center">Score</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider border-r border-[#D1D5DB]">Assessment Date</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-black uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!searchValue ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <p className="text-[13px] font-medium text-[#6B7280] uppercase tracking-widest">
                                        Enter patient details above to retrieve clinical records
                                    </p>
                                </td>
                            </tr>
                        ) : filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <p className="text-[13px] font-bold text-black uppercase tracking-widest">
                                        NO DOCUMENTATION FOUND MATCHING YOUR SEARCH
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            filteredResults.map((record, i) => (
                                <tr key={i} className="border-b border-[#D1D5DB] hover:bg-[#F9FAFB] transition-colors">
                                    <td className="px-6 py-6 border-r border-[#D1D5DB]">
                                        <p className="text-[10px] font-bold text-[#6B7280] mb-1 uppercase">Patient ID</p>
                                        <p className="text-[14px] font-bold text-black underline underline-offset-4">{record.Patient_ID}</p>
                                        <p className="text-[9px] text-[#6B7280] mt-2 font-mono">#{record.Assessment_ID || i}</p>
                                    </td>
                                    <td className="px-6 py-6 border-r border-[#D1D5DB]">
                                        <p className="text-[14px] font-bold text-black uppercase tracking-wide">{record.Child_Name}</p>
                                        <p className="text-[11px] text-[#4B5563] mt-1">{record.Age}Y | {record.Gender} | DR. {(record.Therapist_Name || 'NOT RECORDED').toUpperCase()}</p>
                                    </td>
                                    <td className="px-6 py-6 border-r border-[#D1D5DB] text-center">
                                        <div className="inline-block px-4 py-2 bg-black text-white rounded-none">
                                            <p className="text-[18px] font-bold leading-none">{Number(record.Grand_Total).toFixed(1).replace(/\.0$/, '')}</p>
                                            <p className="text-[8px] font-bold uppercase tracking-tighter mt-1 opacity-80">Total Score</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 border-r border-[#D1D5DB]">
                                        <p className="text-[12px] font-medium text-black">
                                            {record.Timestamp ? new Date(record.Timestamp).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            }).toUpperCase() : 'NO DATE'}
                                        </p>
                                        <p className="text-[10px] text-[#6B7280] mt-1">
                                            {record.Timestamp ? new Date(record.Timestamp).toLocaleTimeString('en-IN', {
                                                hour: '2-digit', minute: '2-digit', hour12: true
                                            }).toUpperCase() : ''}
                                        </p>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button
                                            onClick={() => handleDownloadHistoryPDF(record)}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-black text-black text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
        </section>
    );
}
