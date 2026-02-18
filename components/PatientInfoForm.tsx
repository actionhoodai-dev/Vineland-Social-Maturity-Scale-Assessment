'use client';

import { PatientInfo, AGE_LEVEL_OPTIONS } from '@/types';

interface Props {
    patientInfo: PatientInfo;
    onChange: (info: PatientInfo) => void;
}

/**
 * PatientInfoForm — Child information section with two-column layout
 */
export default function PatientInfoForm({ patientInfo, onChange }: Props) {
    const update = (field: keyof PatientInfo, value: string) => {
        onChange({ ...patientInfo, [field]: value });
    };

    return (
        <section className="bg-white border border-[#D1D5DB] p-4 md:p-5 mb-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wide pb-2 border-b-2 border-[#1E3A8A] mb-4">
                Child Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {/* Child Name */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5 flex justify-between">
                        <span>Child Name <span className="text-[#B91C1C]">*</span></span>
                    </label>
                    <input
                        type="text"
                        value={patientInfo.childName}
                        onChange={(e) => update('childName', e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-3 py-2.5 text-[14px] text-[#111827] bg-white border border-[#D1D5DB] rounded-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                    />
                </div>

                {/* Patient ID - Sequential */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                        Patient ID <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                        type="text"
                        value={patientInfo.patientId}
                        onChange={(e) => update('patientId', e.target.value)}
                        readOnly={patientInfo.patientType === 'new'}
                        placeholder={patientInfo.patientType === 'new' ? "Generating..." : "Enter ID (e.g. VIN100)"}
                        className={`w-full px-3 py-2.5 text-[14px] font-semibold border rounded-sm outline-none transition-all ${patientInfo.patientType === 'new'
                            ? 'bg-[#F3F4F6] border-[#D1D5DB] text-[#1E3A8A]'
                            : 'bg-white border-[#D1D5DB] text-[#111827] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                            }`}
                    />
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
                                onChange={() => onChange({ ...patientInfo, patientType: 'new' })}
                                className="hidden"
                            />
                            <span className="text-[13px] font-bold uppercase tracking-wider">New Patient</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${patientInfo.patientType === 'existing' ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'bg-white border-[#D1D5DB] text-[#374151] hover:border-[#1E3A8A]'}`}>
                            <input
                                type="radio"
                                name="patientType"
                                checked={patientInfo.patientType === 'existing'}
                                onChange={() => onChange({ ...patientInfo, patientType: 'existing' })}
                                className="hidden"
                            />
                            <span className="text-[13px] font-bold uppercase tracking-wider">Existing</span>
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
}
