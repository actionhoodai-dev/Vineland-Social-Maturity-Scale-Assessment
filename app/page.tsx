'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  PatientInfo,
  AssessmentResponse,
  AssessmentSubmission,
  AssessmentRecord,
} from '@/types';
import { VSMS_DATA } from '@/data/vsms-data';
import { generateNextPatientId } from '@/utils/helpers';
import { formatDateOnly, formatDateTime } from '@/utils/dateFormatter';
import { submitAssessment, fetchAllRecords } from '@/lib/api';
import { generateAssessmentPDF } from '@/lib/PDFGenerator';

// Components
import Header from '@/components/Header';
import PatientInfoForm from '@/components/PatientInfoForm';
import AssessmentTable from '@/components/AssessmentTable';
import ScoreSummary from '@/components/ScoreSummary';
import SubmitSection from '@/components/SubmitSection';
import PatientHistory from '@/components/PatientHistory';

// Icons (Simple SVG hamburger and close)
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
  });

  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [allRecords, setAllRecords] = useState<AssessmentRecord[]>([]);
  const [recordsLoaded, setRecordsLoaded] = useState(false);

  // --- DATA FETCHING ---

  // Fetch all records to determine next ID
  const loadRecords = useCallback(async () => {
    try {
      const records = await fetchAllRecords();
      setAllRecords(records);
      setRecordsLoaded(true);
      return records;
    } catch (err) {
      console.error('Failed to load records:', err);
      setRecordsLoaded(true); // Still set to true so we can generate VIN100
      return [];
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // --- SEQUENTIAL ID LOGIC ---

  // Auto-generate ID when "New Patient" is selected or when records are loaded
  useEffect(() => {
    if (patientInfo.patientType === 'new' && recordsLoaded) {
      const existingIds = allRecords.map(r => r.Patient_ID).filter((id): id is string => !!id);
      const nextId = generateNextPatientId(existingIds);

      // ONLY update if the ID is different to prevent infinite loops
      if (patientInfo.patientId !== nextId) {
        setPatientInfo(prev => ({ ...prev, patientId: nextId }));
      }
    }
  }, [patientInfo.patientType, allRecords, recordsLoaded, patientInfo.patientId]);

  // --- ASSESSMENT LOGIC ---

  // When age level changes, populate the table
  useEffect(() => {
    if (patientInfo.ageLevel && VSMS_DATA[patientInfo.ageLevel]) {
      const newResponses: AssessmentResponse[] = VSMS_DATA[patientInfo.ageLevel].items.map((item) => ({
        skill: item.skill,
        category: item.category,
        score: item.score,
        achieved: false,
      }));
      setResponses(newResponses);
    } else {
      setResponses([]);
    }

    if (status !== 'idle' && status !== 'submitting') {
      setStatus('idle');
      setMessage('');
    }
  }, [patientInfo.ageLevel]);

  const handleToggleAchievement = (index: number) => {
    const next = [...responses];
    next[index].achieved = !next[index].achieved;
    setResponses(next);
  };

  const handleFormSubmit = async () => {
    if (!patientInfo.childName.trim()) {
      setStatus('error');
      setMessage('Please enter Child Name.');
      return;
    }
    if (!patientInfo.ageLevel) {
      setStatus('error');
      setMessage('Please select Age Level.');
      return;
    }
    if (!patientInfo.patientId.trim()) {
      setStatus('error');
      if (patientInfo.patientType === 'new' && !recordsLoaded) {
        setMessage('Still calculating next Patient ID... please wait a moment.');
      } else {
        setMessage('Patient ID is required.');
      }
      return;
    }

    setStatus('submitting');
    setMessage('Submitting to clinical database...');

    try {
      const now = new Date();
      const isoDate = now.toISOString();
      const displayDate = formatDateOnly(now);

      const payload: AssessmentSubmission = {
        ...patientInfo,
        assessmentDate: isoDate,
        responses: responses,
      };

      await submitAssessment(payload);

      setStatus('success');
      setMessage(`Assessment successfully submitted for ${patientInfo.childName}. ID: ${patientInfo.patientId} (Date: ${displayDate})`);

      // Refresh records after successful submission to update ID pool
      loadRecords();
    } catch (err) {
      setStatus('error');
      setMessage(`Error: ${(err as Error).message}`);
    }
  };

  const handleDownloadPDF = () => {
    const now = new Date();
    generateAssessmentPDF({
      ...patientInfo,
      assessmentDate: now.toISOString(),
      responses: responses,
    });
  };

  const switchView = (view: 'create' | 'history') => {
    setActiveView(view);
    setIsMenuOpen(false);
    // Scroll to top on view change
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20 md:pb-8">
      {/* MOBILE NAVIGATION BAR (Sticky/Top) */}
      <nav className="sticky top-0 z-50 bg-[#1E3A8A] text-white shadow-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-widest">OTF Clinical System</span>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 outline-none">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="bg-[#1a3278] border-t border-[#2a4ab8]">
            <button onClick={() => switchView('create')} className={`w-full text-left px-6 py-4 text-sm font-medium border-b border-[#2a4ab8] ${activeView === 'create' ? 'bg-[#122659]' : ''}`}>
              New Assessment
            </button>
            <button onClick={() => switchView('history')} className={`w-full text-left px-6 py-4 text-sm font-medium border-b border-[#2a4ab8] ${activeView === 'history' ? 'bg-[#122659]' : ''}`}>
              Patient History
            </button>
          </div>
        )}
      </nav>

      {/* DESKTOP NAVIGATION BAR */}
      <nav className="hidden md:block bg-[#1E3A8A] text-white shadow-xl mb-6">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between h-14">
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Occupational Therapy Foundation</span>
          <div className="flex h-full">
            <button
              onClick={() => switchView('create')}
              className={`px-6 h-full text-xs font-bold uppercase tracking-widest transition-colors ${activeView === 'create' ? 'bg-white text-[#1E3A8A]' : 'hover:bg-[#1a3278]'}`}
            >
              Assessment
            </button>
            <button
              onClick={() => switchView('history')}
              className={`px-6 h-full text-xs font-bold uppercase tracking-widest transition-colors ${activeView === 'history' ? 'bg-white text-[#1E3A8A]' : 'hover:bg-[#1a3278]'}`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-3 md:px-8 py-4">
        <Header />

        {activeView === 'create' ? (
          <div className="space-y-4">
            <PatientInfoForm
              patientInfo={patientInfo}
              onChange={setPatientInfo}
              records={allRecords}
            />
            <AssessmentTable responses={responses} onToggle={handleToggleAchievement} ageLevel={patientInfo.ageLevel} />
            {responses.length > 0 && <ScoreSummary responses={responses} />}
            <SubmitSection status={status} message={message} generatedPatientId="" onSubmit={handleFormSubmit} onDownloadPDF={handleDownloadPDF} />
          </div>
        ) : (
          <PatientHistory allRecords={allRecords} />
        )}

        {/* Desktop Footer */}
        <footer className="hidden md:block text-center text-[11px] text-[#374151] mt-12 pb-4">
          <p>&copy; 2026 Occupational Therapy Foundation – Erode</p>
        </footer>
      </main>

      {/* MOBILE BOTTOM TAB BAR (Optional, but using Top Nav for now) */}
      {/* If the user prefers bottom navigation for "Eco-friendly" feel, we could add one here. */}
    </div>
  );
}
