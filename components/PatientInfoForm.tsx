'use client';

import { useState, useMemo } from 'react';
import { PatientInfo, AGE_LEVEL_OPTIONS, AssessmentRecord } from '@/types';

interface Props {
    patientInfo: PatientInfo;
    onChange: (info: PatientInfo) => void;
    records: AssessmentRecord[];
}

/**
 * PatientInfoForm — Child information section with dynamic search for existing patients
 */
export default function PatientInfoForm({ patientInfo, onChange, records }: Props) {
    const [nameSearch, setNameSearch] = useState('');
    const [idSearch, setIdSearch] = useState('');
    const [showIdSuggestions, setShowIdSuggestions] = useState(false);
    const [showNameSuggestions, setShowNameSuggestions] = useState(false);

    const update = (field: keyof PatientInfo, value: string) => {
        onChange({ ...patientInfo, [field]: value });
    };

    // Filter unique patients for search
    const uniquePatients = useMemo(() => {
        const map = new Map<string, AssessmentRecord>();
        records.forEach(r => {
            if (r.Patient_ID) map.set(r.Patient_ID, r);
        });
        return Array.from(map.values());
    }, [records]);

    // Dynamic suggestions
    const idSuggestions = useMemo(() => {
        if (!idSearch.trim() || patientInfo.patientType === 'new') return [];
        return uniquePatients.filter(p =>
            p.Patient_ID?.toLowerCase().includes(idSearch.toLowerCase())
        ).slice(0, 5);
    }, [idSearch, uniquePatients, patientInfo.patientType]);

    const nameSuggestions = useMemo(() => {
        if (!nameSearch.trim() || patientInfo.patientType === 'new') return [];
        return uniquePatients.filter(p =>
            p.Child_Name?.toLowerCase().includes(nameSearch.toLowerCase())
        ).slice(0, 5);
    }, [nameSearch, uniquePatients, patientInfo.patientType]);

    const handleSelectPatient = (p: AssessmentRecord) => {
        onChange({
            ...patientInfo,
            childName: p.Child_Name || '',
            patientId: p.Patient_ID || '',
            dob: p.DOB ? new Date(p.DOB).toISOString().split('T')[0] : '', // Try to prepopulate DOB
            gender: p.Gender || '',
            age: p.Age || '',
        });
        setIdSearch('');
        setNameSearch('');
        setShowIdSuggestions(false);
        setShowNameSuggestions(false);
    };

    return (
        <section className="bg-white border border-[#D1D5DB] p-4 md:p-5 mb-4 shadow-sm overflow-visible">
            <h3 className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wide pb-2 border-b-2 border-[#1E3A8A] mb-4">
                Child Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 relative">
                {/* Child Name */}
                <div className="flex flex-col relative">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5 flex justify-between items-center">
                        <span>Child Name <span className="text-[#B91C1C]">*</span></span>
                        {patientInfo.patientType === 'existing' && patientInfo.childName && (
                            <span className="text-[9px] text-[#1E3A8A] italic">Linked</span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={patientInfo.childName}
                        onChange={(e) => {
                            update('childName', e.target.value);
                            setNameSearch(e.target.value);
                            setShowNameSuggestions(true);
                        }}
                        onBlur={() => setShowNameSuggestions(false)}
                        placeholder="Enter full name"
                        className="w-full px-3 py-2.5 text-[14px] text-[#111827] bg-white border border-[#D1D5DB] rounded-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                    />
                    {showNameSuggestions && nameSuggestions.length > 0 && (
                        <div className="absolute top-[100%] left-0 w-full bg-white border border-[#1E3A8A] shadow-lg z-[100] mt-0.5 max-h-60 overflow-y-auto">
                            {nameSuggestions.map((p, i) => (
                                <div
                                    key={i}
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent input onBlur
                                        handleSelectPatient(p);
                                    }}
                                    className="px-3 py-2.5 hover:bg-[#1E3A8A] hover:text-white cursor-pointer border-b border-[#D1D5DB] last:border-0 group transition-colors"
                                >
                                    <p className="text-sm font-bold text-[#111827] group-hover:text-white">{p.Child_Name}</p>
                                    <p className="text-[10px] text-[#6B7280] group-hover:text-white/80">ID: {p.Patient_ID}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Patient ID - Sequential */}
                <div className="flex flex-col relative">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5 flex justify-between items-center">
                        <span>Patient ID <span className="text-[#B91C1C]">*</span></span>
                        {patientInfo.patientType === 'existing' && patientInfo.patientId && (
                            <span className="text-[9px] text-[#1E3A8A] italic">Linked</span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={patientInfo.patientId}
                        onChange={(e) => {
                            update('patientId', e.target.value);
                            setIdSearch(e.target.value);
                            setShowIdSuggestions(true);
                        }}
                        onFocus={() => {
                            if (patientInfo.patientType === 'existing') {
                                setShowIdSuggestions(true);
                                setIdSearch(patientInfo.patientId); // Allow seeing suggestions for current ID if any
                            }
                        }}
                        onBlur={() => setShowIdSuggestions(false)}
                        readOnly={patientInfo.patientType === 'new'}
                        placeholder={patientInfo.patientType === 'new' ? "Generating..." : "Enter ID (e.g. VIN100)"}
                        className={`w-full px-3 py-2.5 text-[14px] font-semibold border rounded-sm outline-none transition-all ${patientInfo.patientType === 'new'
                            ? 'bg-[#F3F4F6] border-[#D1D5DB] text-[#1E3A8A]'
                            : 'bg-white border-[#D1D5DB] text-[#111827] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                            }`}
                    />
                    {showIdSuggestions && idSuggestions.length > 0 && (
                        <div className="absolute top-[100%] left-0 w-full bg-white border border-[#1E3A8A] shadow-lg z-[100] mt-0.5 max-h-60 overflow-y-auto">
                            {idSuggestions.map((p, i) => (
                                <div
                                    key={i}
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent input onBlur
                                        handleSelectPatient(p);
                                    }}
                                    className="px-3 py-2.5 hover:bg-[#1E3A8A] hover:text-white cursor-pointer border-b border-[#D1D5DB] last:border-0 group transition-colors"
                                >
                                    <p className="text-sm font-bold text-[#111827] group-hover:text-white">{p.Patient_ID}</p>
                                    <p className="text-[10px] text-[#6B7280] group-hover:text-white/80">Name: {p.Child_Name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {patientInfo.patientType === 'new' && (
                        <span className="text-[10px] text-[#1E3A8A] mt-1 font-medium italic">Auto-calculated based on existing records</span>
                    )}
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={patientInfo.dob}
                        onChange={(e) => update('dob', e.target.value)}
                        className="w-full px-3 py-2.5 text-[14px] text-[#111827] bg-white border border-[#D1D5DB] rounded-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                    />
                </div>

                {/* Age */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                        Age
                    </label>
                    <input
                        type="number"
                        value={patientInfo.age}
                        onChange={(e) => update('age', e.target.value)}
                        placeholder="Years"
                        min={0}
                        max={20}
                        className="w-full px-3 py-2.5 text-[14px] text-[#111827] bg-white border border-[#D1D5DB] rounded-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                    />
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                        Gender
                    </label>
                    <select
                        value={patientInfo.gender}
                        onChange={(e) => update('gender', e.target.value)}
                        className="w-full px-3 py-2.5 text-[14px] text-[#111827] bg-white border border-[#D1D5DB] rounded-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Age Level */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                        Age Level <span className="text-[#B91C1C]">*</span>
                    </label>
                    <select
                        value={patientInfo.ageLevel}
                        onChange={(e) => update('ageLevel', e.target.value)}
                        className="w-full px-3 py-2.5 text-[14px] text-[#111827] bg-[#FFFBEB] border-[#F59E0B] rounded-sm outline-none focus:ring-1 focus:ring-[#F59E0B]"
                    >
                        <option value="">Select Age Level</option>
                        {AGE_LEVEL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Patient Type */}
                <div className="flex flex-col md:col-span-2 mt-2">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2">
                        Admission Type <span className="text-[#B91C1C]">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${patientInfo.patientType === 'new' ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'bg-white border-[#D1D5DB] text-[#374151] hover:border-[#1E3A8A]'}`}>
                            <input
                                type="radio"
                                name="patientType"
                                checked={patientInfo.patientType === 'new'}
                                onChange={() => {
                                    onChange({
                                        childName: '',
                                        patientId: '',
                                        dob: '',
                                        age: '',
                                        gender: '',
                                        ageLevel: patientInfo.ageLevel,
                                        patientType: 'new'
                                    });
                                }}
                                className="hidden"
                            />
                            <span className="text-[13px] font-bold uppercase tracking-wider">New Patient</span>
                            {patientInfo.patientType === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${patientInfo.patientType === 'existing' ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'bg-white border-[#D1D5DB] text-[#374151] hover:border-[#1E3A8A]'}`}>
                            <input
                                type="radio"
                                name="patientType"
                                checked={patientInfo.patientType === 'existing'}
                                onChange={() => {
                                    onChange({
                                        childName: '',
                                        patientId: '',
                                        dob: '',
                                        age: '',
                                        gender: '',
                                        ageLevel: patientInfo.ageLevel,
                                        patientType: 'existing'
                                    });
                                }}
                                className="hidden"
                            />
                            <span className="text-[13px] font-bold uppercase tracking-wider">Existing</span>
                            {patientInfo.patientType === 'existing' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
}
