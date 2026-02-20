'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  PatientInfo,
  AssessmentResponse,
  AssessmentSubmission,
  AssessmentRecord,
  CategoryCode,
  ResponseType,
} from '@/types';
import { VSMS_DATA } from '@/data/vsms-data';
import { generateNextPatientId } from '@/utils/helpers';
import { submitAssessment, fetchAllRecords } from '@/lib/api';
import { generateAssessmentPDF } from '@/lib/PDFGenerator';

// Components
import Header from '@/components/Header';
import PatientInfoForm from '@/components/PatientInfoForm';
import AssessmentTable from '@/components/AssessmentTable';
import ScoreSummary from '@/components/ScoreSummary';
import SubmitSection from '@/components/SubmitSection';
import PatientHistory from '@/components/PatientHistory';

// Icons
const CreateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
);
const HistoryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

export default function AssessmentPage() {
  const [activeView, setActiveView] = useState<'create' | 'history'>('create');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- ASSESSMENT STATE ---
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    childName: '',
    dob: '',
    age: '',
    gender: '',
    ageLevel: '',
    patientType: 'new',
    patientId: '',
    therapistName: '',
  });

  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [allRecords, setAllRecords] = useState<AssessmentRecord[]>([]);
  const [recordsLoaded, setRecordsLoaded] = useState(false);
  const [lastPayload, setLastPayload] = useState<AssessmentSubmission | null>(null);

  // --- INITIALIZE SKILLS ---
  useEffect(() => {
    const allSkills: AssessmentResponse[] = [];
    Object.keys(VSMS_DATA).forEach(blockKey => {
      const block = VSMS_DATA[blockKey];
      block.items.forEach(item => {
        allSkills.push({
          id: item.id,
          skill: item.skill,
          category: item.category,
          ageBlock: block.label,
          weightage: item.score,
          response: 'NOT TESTED'
        });
      });
    });
    setResponses(allSkills);
  }, []);

  // --- DATA FETCHING ---
  const loadRecords = useCallback(async () => {
    try {
      const records = await fetchAllRecords();
      setAllRecords(records);
      setRecordsLoaded(true);
      return records;
    } catch (err) {
      console.error('Failed to load records:', err);
      setRecordsLoaded(true);
      return [];
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // --- ID GENERATION ---
  useEffect(() => {
    if (patientInfo.patientType === 'new' && recordsLoaded) {
      const existingIds = allRecords.map(r => r.Patient_ID).filter((id): id is string => !!id);
      const nextId = generateNextPatientId(existingIds);
      if (patientInfo.patientId !== nextId) {
        setPatientInfo(prev => ({ ...prev, patientId: nextId }));
      }
    }
  }, [patientInfo.patientType, allRecords, recordsLoaded, patientInfo.patientId]);

  // --- HANDLERS ---
  const handlePatientInfoChange = (info: PatientInfo) => {
    setPatientInfo(info);
    if (status !== 'idle' && status !== 'submitting') {
      setStatus('idle');
      setMessage('');
      setLastPayload(null);
    }
  };

  const handleResponseChange = (index: number, response: ResponseType) => {
    const next = [...responses];
    next[index].response = response;
    setResponses(next);

    if (status !== 'idle' && status !== 'submitting') {
      setStatus('idle');
      setMessage('');
      setLastPayload(null);
    }
  };

  const handleFormSubmit = async () => {
    if (!patientInfo.childName.trim()) { setStatus('error'); setMessage('REQUISITION ERROR: CHILD NAME REQUIRED'); return; }
    if (!patientInfo.therapistName.trim()) { setStatus('error'); setMessage('REQUISITION ERROR: THERAPIST IDENTIFICATION REQUIRED'); return; }
    if (!patientInfo.patientId.trim()) { setStatus('error'); setMessage('REQUISITION ERROR: PATIENT ID REQUIRED'); return; }

    const attemptedResponses = responses.filter(r => r.response !== 'NOT TESTED');
    if (attemptedResponses.length === 0) {
      setStatus('error');
      setMessage('VALIDATION ERROR: AT LEAST ONE EVALUATION OUTCOME (YES/NO) IS MANDATORY');
      return;
    }

    setStatus('submitting');
    setMessage('INITIATING CLOUD DATABASE SYNCHRONIZATION...');

    try {
      const now = new Date();
      const isoDate = now.toISOString();
      const assessmentId = `VSMS-${Date.now().toString().slice(-6)}`;

      const domainTotals: Record<CategoryCode, number> = { SHG: 0, SHE: 0, SHD: 0, SD: 0, OCC: 0, COM: 0, LOC: 0, SOC: 0 };
      let overallTotal = 0;
      responses.forEach(r => { if (r.response === 'YES') { domainTotals[r.category] += r.weightage; overallTotal += r.weightage; } });

      const payload: AssessmentSubmission = {
        ...patientInfo,
        assessmentDate: isoDate,
        assessmentId: assessmentId,
        responses: responses,
        domainTotals: domainTotals,
        overallTotal: overallTotal
      };

      await submitAssessment(payload);
      setLastPayload(payload);

      // Clear for next case
      const allSkillsReset = responses.map(r => ({ ...r, response: 'NOT TESTED' as ResponseType }));
      setResponses(allSkillsReset);
      setPatientInfo(prev => ({ ...prev, childName: '', dob: '', age: '', gender: '', patientId: '' }));

      setStatus('success');
      setMessage(`TRANSACTION SUCCESS: CASE ${payload.patientId} AUTHORIZED & STORED`);
      loadRecords();
    } catch (err) {
      setStatus('error');
      setMessage(`SYSTEM ERROR: ${(err as Error).message}`);
    }
  };

  const handleDownloadPDF = () => {
    if (lastPayload) generateAssessmentPDF(lastPayload);
  };

  const switchView = (view: 'create' | 'history') => {
    setActiveView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12 font-sans tracking-tight">
      {/* NAVY NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#1E3A8A] text-white shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => switchView('create')}>
            <div className="w-10 h-10 bg-white text-[#1E3A8A] flex items-center justify-center font-black text-xl shadow-inner border-2 border-white/20">V</div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black uppercase tracking-[0.3em] leading-none">VSMS ASSESSMENT</span>
            </div>
          </div>

          <div className="hidden md:flex gap-2">
            <NavBtn active={activeView === 'create'} onClick={() => switchView('create')} icon={<CreateIcon />} label="New Assessment" />
            <NavBtn active={activeView === 'history'} onClick={() => switchView('history')} icon={<HistoryIcon />} label="Clinical Archives" />
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1 text-white hover:bg-white/10 rounded">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white text-[#1E3A8A] border-t-4 border-[#1E3A8A] animate-in slide-in-from-top duration-200">
            <button onClick={() => switchView('create')} className="w-full text-left px-8 py-5 text-[12px] font-bold uppercase border-b border-[#F3F4F6] flex items-center gap-3">
              <CreateIcon /> New Assessment
            </button>
            <button onClick={() => switchView('history')} className="w-full text-left px-8 py-5 text-[12px] font-bold uppercase border-b border-[#F3F4F6] flex items-center gap-3">
              <HistoryIcon /> Clinical Archives
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Header />

        {activeView === 'create' ? (
          <div className="space-y-2 animate-in fade-in duration-500">
            <PatientInfoForm patientInfo={patientInfo} onChange={handlePatientInfoChange} records={allRecords} />
            <AssessmentTable responses={responses} onResponseChange={handleResponseChange} />
            <ScoreSummary responses={responses} />
            <SubmitSection status={status} message={message} onSubmit={handleFormSubmit} onDownloadPDF={handleDownloadPDF} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <PatientHistory allRecords={allRecords} />
          </div>
        )}

        <footer className="mt-20 pt-10 border-t-2 border-[#D1D5DB] text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-1 bg-[#1E3A8A] opacity-20"></div>
            <p className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-[0.4em] opacity-60">
              Institutional Health Records System | Erode Unit
            </p>
            <p className="text-[9px] text-[#6B7280] max-w-md leading-relaxed">
              Confidential Property of Occupational Therapy Foundation. Unauthorized access to clinical data is strictly prohibited and subject to institutional governance.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2 border-2 ${active
        ? 'bg-white text-[#1E3A8A] border-white shadow-lg'
        : 'bg-transparent text-white border-transparent hover:bg-white/10'
        }`}
    >
      {icon} {label}
    </button>
  );
}
