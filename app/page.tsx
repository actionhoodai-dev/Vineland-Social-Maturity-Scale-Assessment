'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { formatDateOnly } from '@/utils/dateFormatter';
import { submitAssessment, fetchAllRecords } from '@/lib/api';
import { generateAssessmentPDF } from '@/lib/PDFGenerator';

// Components
import Header from '@/components/Header';
import PatientInfoForm from '@/components/PatientInfoForm';
import AssessmentTable from '@/components/AssessmentTable';
import ScoreSummary from '@/components/ScoreSummary';
import SubmitSection from '@/components/SubmitSection';
import PatientHistory from '@/components/PatientHistory';

// Professional Icons
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

export default function AssessmentPage() {
  // --- VIEW STATE ---
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

  // --- INITIALIZE ALL 89 SKILLS PROGRESSIVELY ---
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
          response: 'NOT TESTED' // Default state
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
    // Validation
    if (!patientInfo.childName.trim()) { setStatus('error'); setMessage('REQUIRED: CHILD NAME'); return; }
    if (!patientInfo.therapistName.trim()) { setStatus('error'); setMessage('REQUIRED: THERAPIST NAME'); return; }
    if (!patientInfo.patientId.trim()) { setStatus('error'); setMessage('REQUIRED: PATIENT ID'); return; }

    const attemptedResponses = responses.filter(r => r.response !== 'NOT TESTED');
    if (attemptedResponses.length === 0) {
      setStatus('error');
      setMessage('ZERO RECORDINGS: AT LEAST ONE SKILL MUST BE EVALUATED (YES/NO)');
      return;
    }

    setStatus('submitting');
    setMessage('EXECUTING CLINICAL DATABASE SUBMISSION...');

    try {
      const now = new Date();
      const isoDate = now.toISOString();
      const assessmentId = `AS-${Date.now().toString().slice(-6)}`;

      // Calculate totals for storage
      const domainTotals: Record<CategoryCode, number> = {
        SHG: 0, SHE: 0, SHD: 0, SD: 0, OCC: 0, COM: 0, LOC: 0, SOC: 0
      };
      let overallTotal = 0;

      responses.forEach(r => {
        if (r.response === 'YES') {
          domainTotals[r.category] += r.weightage;
          overallTotal += r.weightage;
        }
      });

      const payload: AssessmentSubmission = {
        ...patientInfo,
        assessmentDate: isoDate,
        assessmentId: assessmentId,
        responses: responses, // Store all 89
        domainTotals: domainTotals,
        overallTotal: overallTotal
      };

      await submitAssessment(payload);

      setLastPayload(payload);

      // Reset form but stay in current mode
      const allSkillsReset = responses.map(r => ({ ...r, response: 'NOT TESTED' as ResponseType }));
      setResponses(allSkillsReset);
      setPatientInfo({
        childName: '',
        dob: '',
        age: '',
        gender: '',
        ageLevel: '',
        patientType: patientInfo.patientType,
        patientId: '',
        therapistName: '',
      });

      setStatus('success');
      setMessage(`SUCCESS: CASE ${payload.patientId} AUTHORIZED FOR ${payload.childName.toUpperCase()}`);
      loadRecords();
    } catch (err) {
      setStatus('error');
      setMessage(`CRITICAL ERROR: ${(err as Error).message}`);
    }
  };

  const handleDownloadPDF = () => {
    if (lastPayload) {
      generateAssessmentPDF(lastPayload);
      return;
    }

    // Fallback if somehow triggered before submission
    const domainTotals: Record<CategoryCode, number> = { SHG: 0, SHE: 0, SHD: 0, SD: 0, OCC: 0, COM: 0, LOC: 0, SOC: 0 };
    let overallTotal = 0;
    responses.forEach(r => { if (r.response === 'YES') { domainTotals[r.category] += r.weightage; overallTotal += r.weightage; } });

    generateAssessmentPDF({
      ...patientInfo,
      assessmentDate: new Date().toISOString(),
      assessmentId: 'DRAFT',
      responses: responses,
      domainTotals,
      overallTotal
    });
  };

  const switchView = (view: 'create' | 'history') => {
    setActiveView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12 font-sans tracking-tight">
      {/* PROFESSIONAL TOP NAV */}
      <nav className="sticky top-0 z-50 bg-black text-white shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-lg">V</div>
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] hidden sm:block">Clinical Assessment Node 1.0</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1">
            <button
              onClick={() => switchView('create')}
              className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${activeView === 'create' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
            >
              New Documentation
            </button>
            <button
              onClick={() => switchView('history')}
              className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${activeView === 'history' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
            >
              Search Archives
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1 text-white">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white text-black border-t border-[#D1D5DB]">
            <button onClick={() => switchView('create')} className="w-full text-left px-8 py-4 text-[12px] font-bold uppercase border-b border-[#F3F4F6]">
              New Documentation
            </button>
            <button onClick={() => switchView('history')} className="w-full text-left px-8 py-4 text-[12px] font-bold uppercase border-b border-[#F3F4F6]">
              Search Archives
            </button>
          </div>
        )}
      </nav>

      {/* MAIN LAYOUT */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <Header />

        {activeView === 'create' ? (
          <div className="space-y-0">
            <PatientInfoForm
              patientInfo={patientInfo}
              onChange={handlePatientInfoChange}
              records={allRecords}
            />
            <AssessmentTable responses={responses} onResponseChange={handleResponseChange} />
            <ScoreSummary responses={responses} />
            <SubmitSection
              status={status}
              message={message}
              onSubmit={handleFormSubmit}
              onDownloadPDF={handleDownloadPDF}
            />
          </div>
        ) : (
          <PatientHistory allRecords={allRecords} />
        )}

        <footer className="mt-16 pt-8 border-t border-[#D1D5DB] text-center">
          <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em] opacity-40">
            Authorized Clinical Documentation System | &copy; 2026 Occupational Therapy Foundation
          </p>
        </footer>
      </main>
    </div>
  );
}
