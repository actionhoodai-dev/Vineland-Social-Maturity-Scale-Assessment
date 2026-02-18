/**
 * Date and utility helpers
 */

/** Format a Date to DD/MM/YYYY */
export function formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

/** Format a Date to DD/MM/YYYY HH:MM:SS */
export function formatDateTime(date: Date): string {
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${formatDate(date)} ${hh}:${min}:${ss}`;
}

/** Format a Date to YYYYMMDD for filenames */
export function formatDateForFile(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}${mm}${dd}`;
}

/** Generate the next sequential patient ID starting from VIN100 */
export function generateNextPatientId(existingIds: string[]): string {
    const prefix = 'VIN';
    const startNum = 100;

    if (!existingIds || existingIds.length === 0) {
        return `${prefix}${startNum}`;
    }

    // Extract numbers from IDs that match the pattern VINxxx
    const numbers = existingIds
        .map((id) => {
            const match = id?.match(/^VIN(\d+)$/);
            return match ? parseInt(match[1], 10) : null;
        })
        .filter((num): num is number => num !== null);

    if (numbers.length === 0) {
        return `${prefix}${startNum}`;
    }

    // Find the maximum number and add 1
    const maxNum = Math.max(...numbers);
    return `${prefix}${maxNum + 1}`;
}

/** Get the display label for an age level key */
export function getAgeLevelLabel(key: string): string {
    const map: Record<string, string> = {
        '0-1': '0–1',
        '1-2': 'I–II',
        '2-3': 'II–III',
        '3-4': 'III–IV',
        '4-5': 'IV–V',
        '5-6': 'V–VI',
        '6-7': 'VI–VII',
        '7-8': 'VII–VIII',
        '8-9': 'VIII–IX',
        '9-10': 'IX–X',
        '10-11': 'X–XI',
        '11-12': 'XI–XII',
        '12-15': 'XII–XV',
    };
    return map[key] || key;
}
