import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    AssessmentSubmission,
    CATEGORY_NAMES,
    CATEGORY_CODES,
    CategoryCode
} from '@/types';

/**
 * PDFGenerator — Professional Clinical Documentation Generator
 */
export const generateAssessmentPDF = (data: AssessmentSubmission) => {
    const doc = new jsPDF();

    // --- HELPER: DATE FORMATTING ---
    const formatDateProfessional = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            }).replace(',', ' –');
        } catch (e) {
            return isoString;
        }
    };

    const formattedDate = formatDateProfessional(data.assessmentDate);

    // --- CLINIC HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('OCCUPATIONAL THERAPY FOUNDATION', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Erode, Tamil Nadu | Clinical Assessment Documentation System', 105, 26, { align: 'center' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    // --- PATIENT DOCUMENTATION SECTION ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PATIENT RECORD DETAILS', 20, 42);

    autoTable(doc, {
        startY: 45,
        theme: 'plain',
        body: [
            ['Patient ID:', data.patientId, 'Assessment ID:', data.assessmentId || 'N/A'],
            ['Child Name:', data.childName.toUpperCase(), 'Assessment Date:', formattedDate],
            ['Date of Birth:', data.dob || 'Not Provided', 'Chronological Age:', data.age ? `${data.age} Years` : 'Not Provided'],
            ['Gender:', (data.gender || 'Not Provided').toUpperCase(), 'Therapist Name:', (data.therapistName || 'Not Provided').toUpperCase()]
        ],
        styles: { fontSize: 9, cellPadding: 2, textColor: [0, 0, 0] },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 },
            2: { fontStyle: 'bold', cellWidth: 35 }
        },
        margin: { left: 20 }
    });

    let y = (doc as any).lastAutoTable.finalY + 10;

    // --- SKILL TABLE ---
    const tableBody = data.responses.map(r => [
        r.ageBlock,
        `#${r.id}`,
        r.skill,
        r.category,
        Number(r.weightage).toFixed(1).replace(/\.0$/, ''),
        r.response === 'YES' ? 'X' : '',
        r.response === 'NO' ? 'X' : '',
        r.response === 'NOT TESTED' ? 'X' : ''
    ]);

    autoTable(doc, {
        startY: y,
        head: [['AGE BLOCK', 'ID', 'SKILL DESCRIPTION', 'DOMAIN', 'WEIGHT', 'YES', 'NO', 'NT']],
        body: tableBody,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2, lineWidth: 0.1, textColor: [0, 0, 0], font: 'helvetica' },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 20 },
            1: { cellWidth: 10 },
            2: { cellWidth: 85 },
            3: { cellWidth: 15, halign: 'center' },
            4: { cellWidth: 15, halign: 'center' },
            5: { cellWidth: 12, halign: 'center' },
            6: { cellWidth: 12, halign: 'center' },
            7: { cellWidth: 12, halign: 'center' }
        },
        margin: { left: 15, right: 15 }
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // --- SUMMARY TABLE ---
    if (y > 230) {
        doc.addPage();
        y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DOMAIN-WISE SCORE ACCUMULATION SUMMARY', 20, y);
    y += 5;

    const summaryData = CATEGORY_CODES.map(cat => [
        cat,
        CATEGORY_NAMES[cat] || cat,
        Number(data.domainTotals[cat] || 0).toFixed(1).replace(/\.0$/, '')
    ]);

    autoTable(doc, {
        startY: y,
        head: [['CODE', 'DOMAIN DESCRIPTION', 'ACCUMULATED SCORE']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, textColor: [0, 0, 0] },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
            2: { cellWidth: 45, halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: 45, right: 45 }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // --- GRAND TOTAL ---
    doc.setFillColor(0, 0, 0);
    doc.rect(45, y, 120, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAND TOTAL ASSESSMENT SCORE:', 50, y + 8);
    doc.text(Number(data.overallTotal).toFixed(1).replace(/\.0$/, ''), 155, y + 8, { align: 'right' });

    // --- SIGNATURES ---
    y += 35;
    if (y > 270) { doc.addPage(); y = 40; }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.line(20, y, 70, y);
    doc.text('Therapist Signature', 20, y + 5);
    doc.text((data.therapistName || '_________________').toUpperCase(), 20, y + 10);

    doc.line(140, y, 190, y);
    doc.text('Clinical In-Charge', 140, y + 5);
    doc.text('Occupational Therapy Foundation', 140, y + 10);

    // --- FOOTER ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        doc.text('This is a computer-generated clinical report and requires professional interpretation.', 105, 290, { align: 'center' });
    }

    // Save PDF
    doc.save(`${data.patientId}_Assessment_${data.childName.replace(/\s+/g, '_')}.pdf`);
};
