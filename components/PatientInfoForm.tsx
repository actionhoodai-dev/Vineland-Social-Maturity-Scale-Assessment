'use client';

import { useState, useMemo } from 'react';
import { PatientInfo, AssessmentRecord } from '@/types';

interface Props {
    patientInfo: PatientInfo;
    onChange: (info: PatientInfo) => void;
    records: AssessmentRecord[];
}

/**
 * PatientInfoForm — Professional structured layout for patient details
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
            dob: p.DOB ? new Date(p.DOB).toISOString().split('T')[0] : '',
            gender: p.Gender || '',
            age: p.Age || '',
        });
        setIdSearch('');
        setNameSearch('');
        setShowIdSuggestions(false);
        setShowNameSuggestions(false);
    };

    const inputClasses = "w-full px-3 py-2 text-[14px] text-black bg-white border border-[#D1D5DB] rounded-none outline-none focus:border-black transition-all";
    const labelClasses = "text-[11px] font-bold text-black uppercase tracking-wider mb-1 flex justify-between items-center";

    return (
        <section className="bg-white border border-[#D1D5DB] p-6 mb-6 overflow-visible">
            <h3 className="text-[12px] font-bold text-black uppercase tracking-[0.2em] pb-3 border-b border-[#D1D5DB] mb-6">
                Patient Documentation Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Child Name */}
                <div className="flex flex-col relative">
                    <label className={labelClasses}>
                        <span>Child Name *</span>
                        {patientInfo.patientType === 'existing' && patientInfo.childName && (
                            <span className="text-[9px] text-black italic font-normal">Registered Record</span>
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
                        placeholder="ENTER FULL NAME"
                        className={inputClasses}
                    />
                    {showNameSuggestions && nameSuggestions.length > 0 && (
                        <div className="absolute top-[100%] left-0 w-full bg-white border border-black shadow-lg z-[100] mt-[-1px]">
                            {nameSuggestions.map((p, i) => (
                                <div
                                    key={i}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectPatient(p);
                                    }}
                                    className="px-3 py-2.5 hover:bg-black hover:text-white cursor-pointer border-b border-[#D1D5DB] last:border-0 group transition-colors"
                                >
                                    <p className="text-sm font-bold">{p.Child_Name}</p>
                                    <p className="text-[10px] opacity-70">ID: {p.Patient_ID}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Patient ID */}
                <div className="flex flex-col relative">
                    <label className={labelClasses}>
                        <span>Patient ID *</span>
                        {patientInfo.patientType === 'existing' && patientInfo.patientId && (
                            <span className="text-[9px] text-black italic font-normal">Linked</span>
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
                                setIdSearch(patientInfo.patientId);
                            }
                        }}
                        onBlur={() => setShowIdSuggestions(false)}
                        readOnly={patientInfo.patientType === 'new'}
                        placeholder={patientInfo.patientType === 'new' ? "SYSTEM GENERATED" : "ENTER ID"}
                        className={`${inputClasses} font-bold ${patientInfo.patientType === 'new' ? 'bg-[#F9FAFB]' : ''}`}
                    />
                    {showIdSuggestions && idSuggestions.length > 0 && (
                        <div className="absolute top-[100%] left-0 w-full bg-white border border-black shadow-lg z-[100] mt-[-1px] max-h-60 overflow-y-auto">
                            {idSuggestions.map((p, i) => (
                                <div
                                    key={i}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectPatient(p);
                                    }}
                                    className="px-3 py-2.5 hover:bg-black hover:text-white cursor-pointer border-b border-[#D1D5DB] last:border-0 group transition-colors"
                                >
                                    <p className="text-sm font-bold">{p.Patient_ID}</p>
                                    <p className="text-[10px] opacity-70">Name: {p.Child_Name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Therapist Name */}
                <div className="flex flex-col">
                    <label className={labelClasses}>
                        <span>Therapist Name *</span>
                    </label>
                    <input
                        type="text"
                        value={patientInfo.therapistName}
                        onChange={(e) => update('therapistName', e.target.value)}
                        placeholder="ENTER THERAPIST NAME"
                        className={inputClasses}
                    />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col">
                    <label className={labelClasses}>Date of Birth</label>
                    <input
                        type="date"
                        value={patientInfo.dob}
                        onChange={(e) => update('dob', e.target.value)}
                        className={inputClasses}
                    />
                </div>

                {/* Age */}
                <div className="flex flex-col">
                    <label className={labelClasses}>Chronological Age</label>
                    <input
                        type="number"
                        value={patientInfo.age}
                        onChange={(e) => update('age', e.target.value)}
                        placeholder="YEARS"
                        className={inputClasses}
                    />
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                    <label className={labelClasses}>Gender</label>
                    <select
                        value={patientInfo.gender}
                        onChange={(e) => update('gender', e.target.value)}
                        className={inputClasses}
                    >
                        <option value="">SELECT GENDER</option>
                        <option value="Male">MALE</option>
                        <option value="Female">FEMALE</option>
                        <option value="Other">OTHER</option>
                    </select>
                </div>

                {/* Patient Type */}
                <div className="flex flex-col md:col-span-3 mt-2">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider mb-3">
                        Documentation Type Identification *
                    </label>
                    <div className="flex gap-0 border border-[#D1D5DB]">
                        <button
                            type="button"
                            onClick={() => onChange({ ...patientInfo, patientType: 'new' })}
                            className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-widest transition-all ${patientInfo.patientType === 'new' ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#F9FAFB]'}`}
                        >
                            New Patient Case
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange({ ...patientInfo, patientType: 'existing' })}
                            className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-widest border-l border-[#D1D5DB] transition-all ${patientInfo.patientType === 'existing' ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#F9FAFB]'}`}
                        >
                            Existing Patient Record
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
