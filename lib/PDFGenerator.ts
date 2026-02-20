import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    AssessmentSubmission,
    CATEGORY_NAMES,
    CATEGORY_CODES
} from '@/types';

/**
 * PDFGenerator — Authorized Institutional Performance Report
 */
export const generateAssessmentPDF = (data: AssessmentSubmission) => {
    const doc = new jsPDF();
    const navyColor: [number, number, number] = [30, 58, 138]; // #1E3A8A

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

    // --- AUTHORIZED CLINIC HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text('OCCUPATIONAL THERAPY FOUNDATION', 105, 20, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('36/7, AGILMEDU STREET – 4, SAIT COLONY, ERODE – 638001 | TAMIL NADU, INDIA', 105, 26, { align: 'center' });
    doc.text('Phone: +91 94437 12345 | Email: info@otfoundation.in', 105, 30, { align: 'center' });

    doc.setDrawColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.setLineWidth(1);
    doc.line(20, 34, 190, 34);

    // --- REPORT TITLE ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('VINELAND SOCIAL MATURITY SCALE - ASSESSMENT REPORT', 105, 43, { align: 'center' });

    // --- PATIENT RECORD DETAILS ---
    autoTable(doc, {
        startY: 48,
        theme: 'plain',
        body: [
            ['Patient ID:', data.patientId, 'Assessment Date:', formattedDate],
            ['Child Name:', data.childName.toUpperCase(), 'Chronological Age:', data.age ? `${data.age} Years` : 'Not Provided'],
            ['Date of Birth:', data.dob || 'Not Provided', 'Gender:', (data.gender || 'Not Provided').toUpperCase()],
            ['Therapist:', (data.therapistName || 'Institutional Record').toUpperCase(), '', '']
        ],
        styles: { fontSize: 9, cellPadding: 2, textColor: [0, 0, 0] },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35, textColor: navyColor },
            2: { fontStyle: 'bold', cellWidth: 35, textColor: navyColor }
        },
        margin: { left: 20 }
    });

    let y = (doc as any).lastAutoTable.finalY + 12;

    // --- PROGRESSIVE EVALUATION DATA ---
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text('PROGRESSIVE SKILL EVALUATION DATA', 15, y);
    y += 5;

    const ageBlocks = Array.from(new Set(data.responses.map(r => r.ageBlock)));

    ageBlocks.forEach((blockName) => {
        const blockSkills = data.responses.filter(r => r.ageBlock === blockName);

        // Show blocks that were evaluated
        const hasEvaluated = blockSkills.some(r => r.response !== 'NOT TESTED');
        if (!hasEvaluated) return;

        autoTable(doc, {
            startY: y,
            theme: 'striped',
            head: [[`AGE LEVEL BLOCK: ${blockName}`]],
            styles: { fillColor: navyColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
            margin: { left: 15, right: 15 }
        });

        y = (doc as any).lastAutoTable.finalY;

        const tableBody = blockSkills.map(r => [
            r.response === 'YES' ? 'Tick' : `${r.id}`, // Mark SR NO with Tick if YES
            r.skill,
            r.category,
            Number(r.weightage).toFixed(1).replace(/\.0$/, ''),
            r.response === 'YES' ? 'X' : '',
            r.response === 'NO' ? 'O' : '',
            r.response === 'NOT TESTED' ? 'X' : ''
        ]);

        autoTable(doc, {
            startY: y,
            head: [['S.NO', 'SKILL DESCRIPTION', 'DOMAIN', 'MARKS', 'YES', 'NO', 'NOT TESTED']],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 2, lineWidth: 0.1, textColor: [0, 0, 0], font: 'helvetica' },
            headStyles: { fillColor: [240, 240, 240], textColor: navyColor, fontStyle: 'bold', lineWidth: 0.1 },
            columnStyles: {
                0: { cellWidth: 10, fontStyle: 'bold', halign: 'center' },
                1: { cellWidth: 95 },
                2: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 15, halign: 'center' },
                4: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
                5: { cellWidth: 12, halign: 'center' },
                6: { cellWidth: 20, halign: 'center' }
            },
            didDrawCell: (data) => {
                // If it's the S.NO column and the value is 'Tick', draw an actual tick
                if (data.section === 'body' && data.column.index === 0 && data.cell.text[0] === 'Tick') {
                    const cell = data.cell;
                    const x = cell.x + cell.width / 2;
                    const y = cell.y + cell.height / 2;
                    doc.setDrawColor(navyColor[0], navyColor[1], navyColor[2]);
                    doc.setLineWidth(0.4);
                    // Draw tick mark
                    doc.line(x - 1.5, y, x - 0.5, y + 1.2);
                    doc.line(x - 0.5, y + 1.2, x + 2, y - 1.5);
                    data.cell.text = ['']; // Clear the text
                }
            },
            margin: { left: 15, right: 15 }
        });

        y = (doc as any).lastAutoTable.finalY + 5;
        if (y > 270) { doc.addPage(); y = 20; }
    });

    // --- SUMMARY SECTION ---
    if (y > 230) { doc.addPage(); y = 20; }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text('DOMAIN-WISE PERFORMANCE SUMMARY', 20, y);
    y += 5;

    const summaryData = CATEGORY_CODES.map(cat => [
        cat,
        CATEGORY_NAMES[cat] || cat,
        Number(data.domainTotals[cat] || 0).toFixed(1).replace(/\.0$/, '')
    ]);

    autoTable(doc, {
        startY: y,
        head: [['CODE', 'DEVELOPMENTAL DOMAIN', 'CUMULATIVE SCORE']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, textColor: [0, 0, 0] },
        headStyles: { fillColor: navyColor, textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
            2: { cellWidth: 45, halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: 45, right: 45 }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // --- GRAND TOTAL ---
    doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.rect(45, y, 120, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL CUMULATIVE ASSESSMENT SCORE:', 50, y + 8);
    doc.text(Number(data.overallTotal).toFixed(1).replace(/\.0$/, ''), 155, y + 8, { align: 'right' });

    // --- FOOTER ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        doc.text('This is a system-generated clinical evaluation report from Occupational Therapy Foundation.', 105, 290, { align: 'center' });
    }

    doc.save(`${data.patientId}_VSMS_Report_${data.childName.replace(/\s+/g, '_')}.pdf`);
};
