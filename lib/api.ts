/**
 * API wrapper for Google Apps Script backend
 */

import { AssessmentSubmission, AssessmentRecord } from '@/types';

const API_URL =
    'https://script.google.com/macros/s/AKfycbzjKA2IVDqzirBkPsjm3J89qMynju3UVk4SvjG61o0gulBI4n2kxypHGv9X97KMlgoR/exec';

/** Submit an assessment via POST */
export async function submitAssessment(data: AssessmentSubmission): Promise<void> {
    await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

/** Fetch all patient records via GET */
export async function fetchAllRecords(): Promise<AssessmentRecord[]> {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            redirect: 'follow', // Crucial for Google Apps Script redirects
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Search Results:', data);

        if (Array.isArray(data)) {
            return data;
        } else if (data && typeof data === 'object' && Array.isArray((data as any).records)) {
            // Handle case where data might be wrapped in a 'records' key
            return (data as any).records;
        }

        return [];
    } catch (err) {
        console.error('API Fetch Error:', err);
        return [];
    }
}
