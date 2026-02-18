/**
 * VSMS Assessment System — Type Definitions
 */

/** Category codes used in the VSMS assessment */
export type CategoryCode = 'SHG' | 'SHE' | 'SHD' | 'SD' | 'OCC' | 'COM' | 'LOC' | 'SOC';

/** Patient information collected in the form */
export interface PatientInfo {
    childName: string;
    dob: string;
    age: string;
    gender: string;
    ageLevel: string;
    patientType: 'new' | 'existing';
    patientId: string;
}

/** A single assessment response for a skill */
export interface AssessmentResponse {
    skill: string;
    category: CategoryCode;
    score: number;
    achieved: boolean;
}

/** Full submission payload sent to backend */
export interface AssessmentSubmission {
    childName: string;
    dob: string;
    age: string;
    gender: string;
    assessmentDate: string;
    ageLevel: string;
    patientId: string;
    responses: AssessmentResponse[];
    timestamp?: string;
}

/** A single VSMS skill item from the scale */
export interface VSMSItem {
    id: number;
    skill: string;
    category: CategoryCode;
    score: number;
}

/** A group of items belonging to a specific age level */
export interface VSMSAgeGroup {
    label: string;
    items: VSMSItem[];
}

/** The complete VSMS data structure keyed by age level */
export type VSMSDataMap = Record<string, VSMSAgeGroup>;

/** A patient record returned from the backend */
export interface AssessmentRecord {
    Timestamp?: string;
    Patient_ID?: string;
    Child_Name?: string;
    DOB?: string;
    Age?: string;
    Gender?: string;
    Assessment_Date?: string;
    Age_Level?: string;
    Vineland_Data_JSON?: string;
    SHG_Total?: number;
    SHE_Total?: number;
    SHD_Total?: number;
    SD_Total?: number;
    OCC_Total?: number;
    COM_Total?: number;
    LOC_Total?: number;
    SOC_Total?: number;
    Grand_Total?: number;
}

/** Category totals computed from responses */
export interface CategoryTotals {
    SHG: number;
    SHE: number;
    SHD: number;
    SD: number;
    OCC: number;
    COM: number;
    LOC: number;
    SOC: number;
}

/** Category display names */
export const CATEGORY_NAMES: Record<CategoryCode, string> = {
    SHG: 'Self-Help General',
    SHE: 'Self-Help Eating',
    SHD: 'Self-Help Dressing',
    SD: 'Self-Direction',
    OCC: 'Occupation',
    COM: 'Communication',
    LOC: 'Locomotion',
    SOC: 'Socialization',
};

/** All category codes in display order */
export const CATEGORY_CODES: CategoryCode[] = ['SHG', 'SHE', 'SHD', 'SD', 'OCC', 'COM', 'LOC', 'SOC'];

/** Age level options for the dropdown */
export const AGE_LEVEL_OPTIONS = [
    { value: '0-1', label: '0–1' },
    { value: '2-3', label: 'II–III' },
    { value: '3-4', label: 'III–IV' },
    { value: '4-5', label: 'IV–V' },
    { value: '5-6', label: 'V–VI' },
    { value: '6-7', label: 'VI–VII' },
    { value: '7-8', label: 'VII–VIII' },
    { value: '8-9', label: 'VIII–IX' },
    { value: '9-10', label: 'IX–X' },
    { value: '10-11', label: 'X–XI' },
    { value: '11-12', label: 'XI–XII' },
    { value: '12-15', label: 'XII–XV' },
] as const;
