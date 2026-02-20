import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    AssessmentSubmission,
    CATEGORY_NAMES,
    CATEGORY_CODES,
    CategoryCode
} from '@/types';

/**
 * PDFGenerator — Professional Clinical Documentation Generator (Navy Theme)
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

    // --- CLINIC HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text('OCCUPATIONAL THERAPY FOUNDATION', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Erode, Tamil Nadu | Clinical Assessment Documentation System', 105, 26, { align: 'center' });

    doc.setDrawColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.setLineWidth(0.8);
    doc.line(20, 32, 190, 32);

    // --- PATIENT DOCUMENTATION SECTION ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
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
            0: { fontStyle: 'bold', cellWidth: 35, textColor: navyColor },
            2: { fontStyle: 'bold', cellWidth: 35, textColor: navyColor }
        },
        margin: { left: 20 }
    });

    let y = (doc as any).lastAutoTable.finalY + 12;

    // --- SKILL TABLES PER AGE BLOCK ---
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text('PROGRESSIVE SKILL EVALUATION', 15, y);
    y += 4;

    // Group responses by age block for the PDF
    const ageBlocks = Array.from(new Set(data.responses.map(r => r.ageBlock)));

    ageBlocks.forEach((blockName) => {
        const blockSkills = data.responses.filter(r => r.ageBlock === blockName);

        // Only show attempted blocks (where at least one skill is YES or NO)
        const hasAttempted = blockSkills.some(r => r.response !== 'NOT TESTED');
        if (!hasAttempted) return;

        // Header for Block
        autoTable(doc, {
            startY: y,
            theme: 'striped',
            head: [[`AGE LEVEL: ${blockName}`]],
            styles: { fillColor: navyColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
            margin: { left: 15, right: 15 }
        });

        y = (doc as any).lastAutoTable.finalY;

        // Skill Table for this block
        const tableBody = blockSkills.map(r => [
            `#${r.id}`,
            r.skill,
            r.category,
            Number(r.weightage).toFixed(1).replace(/\.0$/, ''),
            r.response === 'YES' ? 'Tick' : '', // We'll replace 'Tick' with the symbol below
            r.response === 'NO' ? 'O' : '',
            r.response === 'NOT TESTED' ? 'NOT TESTED' : ''
        ]);

        autoTable(doc, {
            startY: y,
            head: [['ID', 'SKILL DESCRIPTION', 'DOMAIN', 'SCORE', 'YES', 'NO', 'N. TESTED']],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 2, lineWidth: 0.1, textColor: [0, 0, 0], font: 'helvetica' },
            headStyles: { fillColor: [240, 240, 240], textColor: navyColor, fontStyle: 'bold', lineWidth: 0.1 },
            columnStyles: {
                0: { cellWidth: 10, fontStyle: 'bold' },
                1: { cellWidth: 95 },
                2: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 15, halign: 'center' },
                4: { cellWidth: 15, halign: 'center', font: 'zapfdingbats' }, // For checkmarks
                5: { cellWidth: 15, halign: 'center' },
                6: { cellWidth: 15, halign: 'center' }
            },
            // Custom draw to replace text with tick marks
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 4 && data.cell.text[0] === 'Tick') {
                    // Draw a checkmark using lines for better accuracy than ZapfDingbats in some viewers
                    const cell = data.cell;
                    const x = cell.x + cell.width / 2;
                    const y = cell.y + cell.height / 2;
                    doc.setDrawColor(navyColor[0], navyColor[1], navyColor[2]);
                    doc.setLineWidth(0.4);
                    doc.line(x - 1.5, y, x - 0.5, y + 1);
                    doc.line(x - 0.5, y + 1, x + 1.5, y - 1.5);
                    data.cell.text = ['']; // Clear the placeholder text
                }
            },
            margin: { left: 15, right: 15 }
        });

        y = (doc as any).lastAutoTable.finalY + 5;

        // Add new page if needed
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
    });

    // --- SUMMARY SECTION ---
    if (y > 230) {
        doc.addPage();
        y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
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
        headStyles: { fillColor: navyColor, textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
            2: { cellWidth: 45, halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: 45, right: 45 }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // --- GRAND TOTAL ---
    doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.rect(45, y, 120, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAND TOTAL ASSESSMENT SCORE:', 50, y + 8);
    doc.text(Number(data.overallTotal).toFixed(1).replace(/\.0$/, ''), 155, y + 8, { align: 'right' });

    // --- SIGNATURES ---
    y += 35;
    if (y > 270) { doc.addPage(); y = 40; }

    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.setFontSize(9);
    doc.line(20, y, 70, y);
    doc.text('Therapist Signature', 20, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.text((data.therapistName || '_________________').toUpperCase(), 20, y + 10);

    doc.line(140, y, 190, y);
    doc.setFont('helvetica', 'normal');
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
