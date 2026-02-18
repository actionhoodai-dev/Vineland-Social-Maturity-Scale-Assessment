/**
 * Clinical Date Utility — VSMS Assessment System
 * Locks all dates to Asia/Kolkata timezone and standardizes formats.
 */

const TIMEZONE = 'Asia/Kolkata';

/**
 * Format string or Date object to DD/MM/YYYY
 * Example: 18/02/2026
 */
export function formatDateOnly(dateInput: Date | string | undefined | null): string {
    if (!dateInput) return 'N/A';

    try {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

        // Check for invalid date
        if (isNaN(date.getTime())) return 'N/A';

        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: TIMEZONE,
        }).format(date);
    } catch (err) {
        console.error('Date formatting error:', err);
        return 'N/A';
    }
}

/**
 * Format string or Date object to DD/MM/YYYY, hh:mm AM/PM
 * Example: 18/02/2026, 09:15 PM
 */
export function formatDateTime(dateInput: Date | string | undefined | null): string {
    if (!dateInput) return 'N/A';

    try {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

        if (isNaN(date.getTime())) return 'N/A';

        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: TIMEZONE,
        }).format(date).replace(/\s+/g, ' '); // Ensure single spaces
    } catch (err) {
        console.error('DateTime formatting error:', err);
        return 'N/A';
    }
}

/**
 * Format string or Date object for timestamps (includes seconds)
 * Example: 18/02/2026, 09:15:30 PM
 */
export function formatTimestamp(dateInput: Date | string | undefined | null): string {
    if (!dateInput) return 'N/A';

    try {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

        if (isNaN(date.getTime())) return 'N/A';

        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: TIMEZONE,
        }).format(date);
    } catch (err) {
        console.error('Timestamp formatting error:', err);
        return 'N/A';
    }
}

/**
 * Format string or Date object to YYYYMMDD for technical use (filenames)
 * Example: 20260218
 */
export function formatDateForFile(dateInput: Date | string | undefined | null): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : (dateInput || new Date());
    if (isNaN(date.getTime())) return 'unknown_date';

    const parts = new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: TIMEZONE,
    }).formatToParts(date);

    const d = parts.find(p => p.type === 'day')?.value || '00';
    const m = parts.find(p => p.type === 'month')?.value || '00';
    const y = parts.find(p => p.type === 'year')?.value || '0000';

    return `${y}${m}${d}`;
}
