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

/** Calculate the Malin VSMS credit for an item in months */
export function getItemCreditInMonths(id: number): number {
    if (id >= 1 && id <= 17) return 12 / 17;
    if (id >= 18 && id <= 34) return 12 / 17;
    if (id >= 35 && id <= 44) return 1.2;
    if (id >= 45 && id <= 50) return 2.0;
    if (id >= 51 && id <= 56) return 2.0;
    if (id >= 57 && id <= 61) return 2.4;
    if (id >= 62 && id <= 65) return 3.0;
    if (id >= 66 && id <= 70) return 2.4;
    if (id >= 71 && id <= 74) return 3.0;
    if (id >= 75 && id <= 77) return 4.0;
    if (id >= 78 && id <= 81) return 3.0;
    if (id >= 82 && id <= 84) return 4.0;
    if (id >= 85 && id <= 89) return 7.2;
    return 0;
}

/** Calculate chronological age in months from Date of Birth and assessment date */
export function calculateAgeInMonths(dobString: string, assessmentDateString?: string): number | null {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const refDate = assessmentDateString ? new Date(assessmentDateString) : new Date();
    if (isNaN(dob.getTime())) return null;
    
    let months = (refDate.getFullYear() - dob.getFullYear()) * 12 + (refDate.getMonth() - dob.getMonth());
    const dayDiff = refDate.getDate() - dob.getDate();
    if (dayDiff < 0) {
        months -= 1;
        months += (30 + dayDiff) / 30;
    } else {
        months += dayDiff / 30;
    }
    return Math.max(0, months);
}

/** Get standard clinical classification based on Social Quotient (SQ) */
export function getSQClassification(sq: number): string {
    if (sq >= 120) return 'VERY SUPERIOR';
    if (sq >= 110) return 'SUPERIOR';
    if (sq >= 90) return 'AVERAGE';
    if (sq >= 80) return 'LOW AVERAGE';
    if (sq >= 70) return 'BORDERLINE';
    if (sq >= 50) return 'MILD DEVELOPMENTAL DELAY';
    if (sq >= 35) return 'MODERATE DEVELOPMENTAL DELAY';
    if (sq >= 20) return 'SEVERE DEVELOPMENTAL DELAY';
    return 'PROFOUND DEVELOPMENTAL DELAY';
}
