/**
 * PDF Generator — Clinical Assessment Report
 * Uses jsPDF + jspdf-autotable
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentResponse, CATEGORY_CODES, CATEGORY_NAMES, CategoryCode } from '@/types';
import { getAgeLevelLabel } from '@/utils/helpers';
import { formatDateOnly, formatDateTime, formatDateForFile } from '@/utils/dateFormatter';

interface PDFData {
    childName: string;
    dob: string;
    age: string;
    gender: string;
    ageLevel: string;
    assessmentDate: string;
    patientId: string;
    generatedPatientId?: string;
    responses: AssessmentResponse[];
}

export function generateAssessmentPDF(data: PDFData): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 15;

    // --- HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('OCCUPATIONAL THERAPY FOUNDATION', pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('36/7, AGILMEDU STREET \u2013 4', pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.text('SAIT COLONY, ERODE \u2013 638001', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('VINELAND SOCIAL MATURITY SCALE', pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('(Assessment Report)', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // --- CHILD DETAILS ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('CHILD INFORMATION', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const details: [string, string][] = [
        ['Child Name', data.childName || 'N/A'],
        ['Date of Birth', formatDateOnly(data.dob)],
        ['Age', data.age ? `${data.age} years` : 'N/A'],
        ['Gender', data.gender || 'N/A'],
        ['Age Level', getAgeLevelLabel(data.ageLevel) || data.ageLevel || 'N/A'],
        ['Assessment Date & Time', formatDateTime(data.assessmentDate)],
        ['Patient ID', data.patientId || data.generatedPatientId || 'N/A'],
    ];

    details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), margin + 40, y);
        y += 5;
    });

    y += 4;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // --- ASSESSMENT TABLE ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ASSESSMENT ITEMS', margin, y);
    y += 4;

    const tableData = data.responses.map((r, i) => [
        (i + 1).toString(),
        r.skill || '',
        r.category || '',
        String(r.score || 0),
        r.achieved ? 'Yes' : 'No',
    ]);

    autoTable(doc, {
        startY: y,
        head: [['#', 'Skill', 'Category', 'Score', 'Achieved']],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: {
            font: 'helvetica',
            fontSize: 8,
            cellPadding: 2,
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            textColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [30, 58, 138],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 15, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
        },
    });

    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

    if (y > 240) {
        doc.addPage();
        y = 15;
    }

    // --- SCORE SUMMARY ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('SCORE SUMMARY', margin, y);
    y += 4;

    const scoreSummary: string[][] = [];
    let grandTotal = 0;

    CATEGORY_CODES.forEach((cat: CategoryCode) => {
        let catTotal = 0;
        data.responses.forEach((r) => {
            if (r.category === cat && r.achieved) catTotal += r.score || 0;
        });
        scoreSummary.push([cat, CATEGORY_NAMES[cat], catTotal.toString()]);
        grandTotal += catTotal;
    });

    scoreSummary.push(['', 'Grand Total', grandTotal.toString()]);

    autoTable(doc, {
        startY: y,
        head: [['Code', 'Category', 'Score']],
        body: scoreSummary,
        margin: { left: margin, right: margin },
        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 2,
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            textColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [30, 58, 138],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { cellWidth: 20, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 25, halign: 'center' },
        },
        didParseCell(cellData) {
            if (cellData.row.index === scoreSummary.length - 1 && cellData.section === 'body') {
                cellData.cell.styles.fontStyle = 'bold';
                cellData.cell.styles.fillColor = [240, 240, 240];
            }
        },
    });

    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

    if (y > 270) {
        doc.addPage();
        y = 15;
    }

    // --- FOOTER ---
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const now = new Date();
    doc.text(`Generated on: ${formatDateTime(now)}`, margin, y);
    y += 5;
    doc.text('\u00A9 2026 Occupational Therapy Foundation \u2013 Erode', pageWidth / 2, y, {
        align: 'center',
    });

    const childNameClean = (data.childName || 'Patient').replace(/\s+/g, '_');
    doc.save(`VSMS_Assessment_${childNameClean}_${formatDateForFile(now)}.pdf`);
}
