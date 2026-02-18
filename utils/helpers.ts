/**
 * Logic utility helpers (ID generation, Labels)
 */

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
