/**
 * VINELAND SOCIAL MATURITY SCALE (VSMS)
 * Indian Adaptation by Dr. A.J. Malin — 89 Items
 * Organized by age level with category and score
 */

import { VSMSDataMap } from '@/types';

export const VSMS_DATA: VSMSDataMap = {
    '0-1': {
        label: '0–1',
        items: [
            { id: 1, skill: 'Crows, laughs', category: 'SOC', score: 1 },
            { id: 2, skill: 'Balances head', category: 'SHG', score: 1 },
            { id: 3, skill: 'Grasps objects within reach', category: 'SHG', score: 1 },
            { id: 4, skill: 'Reaches for familiar persons', category: 'SOC', score: 1 },
            { id: 5, skill: 'Rolls over (unassisted)', category: 'LOC', score: 1 },
            { id: 6, skill: 'Occupies self unattended', category: 'OCC', score: 1 },
            { id: 7, skill: 'Sits unsupported', category: 'LOC', score: 1 },
            { id: 8, skill: 'Pulls self upright', category: 'LOC', score: 1 },
            { id: 9, skill: '"Talks", imitates sounds', category: 'COM', score: 1 },
            { id: 10, skill: 'Drinks from cup or glass (assisted)', category: 'SHE', score: 1 },
            { id: 11, skill: 'Moves about on floor (creeping, crawling)', category: 'LOC', score: 1 },
            { id: 12, skill: 'Grasps with thumb and finger', category: 'SHG', score: 1 },
            { id: 13, skill: 'Demands personal attention', category: 'SOC', score: 1 },
            { id: 14, skill: 'Stands alone', category: 'LOC', score: 1 },
            { id: 15, skill: 'Does not drool', category: 'SHG', score: 1 },
            { id: 16, skill: 'Follows simple instructions', category: 'COM', score: 1 },
        ],
    },
    '1-2': {
        label: 'I–II',
        items: [
            { id: 17, skill: 'Walks about room unattended', category: 'LOC', score: 1 },
            { id: 18, skill: 'Marks with pencil or crayon or chalk', category: 'OCC', score: 1 },
            { id: 19, skill: 'Masticates (chews) solid or semi-solid food', category: 'SHE', score: 1 },
            { id: 20, skill: 'Pulls off clothes (shoes, sandals, socks)', category: 'SHD', score: 1 },
            { id: 21, skill: 'Overcomes simple obstacles', category: 'SHG', score: 1 },
            { id: 22, skill: 'Fetches or carries familiar objects', category: 'OCC', score: 1 },
            { id: 23, skill: 'Drinks from cup or glass unassisted', category: 'SHE', score: 1 },
            { id: 24, skill: 'Walks without support', category: 'LOC', score: 1 },
            { id: 25, skill: 'Plays with other children', category: 'SOC', score: 1 },
            { id: 26, skill: 'Eats with own hands (biscuits, bread, etc.)', category: 'SHE', score: 1 },
            { id: 27, skill: 'Goes about house or yard', category: 'LOC', score: 1 },
            { id: 28, skill: 'Discriminates edible substances from non-edibles', category: 'SHG', score: 1 },
            { id: 29, skill: 'Uses names of familiar objects', category: 'COM', score: 1 },
            { id: 30, skill: 'Walks upstairs unassisted', category: 'LOC', score: 1 },
            { id: 31, skill: 'Unwraps sweets, chocolates', category: 'SHG', score: 1 },
            { id: 32, skill: 'Talks in short sentences', category: 'COM', score: 1 },
        ],
    },
    '2-3': {
        label: 'II–III',
        items: [
            { id: 33, skill: 'Signals to go to toilet', category: 'SHG', score: 1 },
            { id: 34, skill: 'Initiates own play activities', category: 'OCC', score: 1 },
            { id: 35, skill: 'Removes shirt or frock if unbuttoned', category: 'SHD', score: 1 },
            { id: 36, skill: 'Eats with spoon / hands (food)', category: 'SHE', score: 1 },
            { id: 37, skill: 'Gets drink (water) unassisted', category: 'SHG', score: 1 },
            { id: 38, skill: 'Dries own hands', category: 'SHG', score: 1 },
            { id: 39, skill: 'Avoids simple hazards', category: 'SD', score: 1 },
            { id: 40, skill: 'Puts on shirt or frock unassisted (need not button)', category: 'SHD', score: 1 },
            { id: 41, skill: 'Can do paper folding / cutting', category: 'OCC', score: 1 },
            { id: 42, skill: 'Relates experiences', category: 'COM', score: 1 },
        ],
    },
    '3-4': {
        label: 'III–IV',
        items: [
            { id: 43, skill: 'Walks downstairs, one step at a time', category: 'LOC', score: 1 },
            { id: 44, skill: 'Plays cooperatively at kindergarten level', category: 'SOC', score: 1 },
            { id: 45, skill: 'Buttons shirt or frock', category: 'SHD', score: 1 },
            { id: 46, skill: 'Helps at little household tasks', category: 'OCC', score: 1 },
            { id: 47, skill: '"Performs" for others (reciting, singing, dancing)', category: 'SOC', score: 1 },
            { id: 48, skill: 'Washes hands unaided', category: 'SHG', score: 1 },
        ],
    },
    '4-5': {
        label: 'IV–V',
        items: [
            { id: 49, skill: 'Cares for self at toilet', category: 'SHG', score: 1 },
            { id: 50, skill: 'Washes face unassisted', category: 'SHG', score: 1 },
            { id: 51, skill: 'Goes about neighborhood unattended', category: 'LOC', score: 1 },
            { id: 52, skill: 'Dresses self except for tying', category: 'SHD', score: 1 },
            { id: 53, skill: 'Uses pencil or crayon or chalk for drawing', category: 'OCC', score: 1 },
            { id: 54, skill: 'Plays competitive exercise games (tag, hide and seek, jumping rope)', category: 'SOC', score: 1 },
        ],
    },
    '5-6': {
        label: 'V–VI',
        items: [
            { id: 55, skill: 'Uses skates, wagon, bicycle, scooter', category: 'LOC', score: 1 },
            { id: 56, skill: 'Writes simple words', category: 'COM', score: 1 },
            { id: 57, skill: 'Plays simple table games (ludo, snakes & ladders)', category: 'SOC', score: 1 },
            { id: 58, skill: 'Is trusted with money (small errands)', category: 'SD', score: 1 },
            { id: 59, skill: 'Goes to school unattended', category: 'LOC', score: 1 },
        ],
    },
    '6-7': {
        label: 'VI–VII',
        items: [
            { id: 60, skill: 'Uses table knife for spreading', category: 'SHE', score: 1 },
            { id: 61, skill: 'Uses pencil for writing', category: 'OCC', score: 1 },
            { id: 62, skill: 'Bathes self assisted', category: 'SHG', score: 1 },
            { id: 63, skill: 'Goes to bed unassisted', category: 'SHG', score: 1 },
        ],
    },
    '7-8': {
        label: 'VII–VIII',
        items: [
            { id: 64, skill: 'Combs or brushes hair', category: 'SHG', score: 1 },
            { id: 65, skill: 'Uses tools or utensils', category: 'OCC', score: 1 },
            { id: 66, skill: 'Helps at routine household tasks (sweeping, dusting, watering plants)', category: 'OCC', score: 1 },
            { id: 67, skill: 'Reads on own initiative', category: 'COM', score: 1 },
            { id: 68, skill: 'Bathes self unaided', category: 'SHG', score: 1 },
        ],
    },
    '8-9': {
        label: 'VIII–IX',
        items: [
            { id: 69, skill: 'Looks after self at table', category: 'SHE', score: 1 },
            { id: 70, skill: 'Makes minor purchases (buys things from shop)', category: 'SD', score: 1 },
            { id: 71, skill: 'Goes about hometown freely', category: 'LOC', score: 1 },
        ],
    },
    '9-10': {
        label: 'IX–X',
        items: [
            { id: 72, skill: 'Writes short letters', category: 'COM', score: 1 },
            { id: 73, skill: 'Makes telephone calls', category: 'COM', score: 1 },
            { id: 74, skill: 'Does small remunerative work', category: 'OCC', score: 1 },
            { id: 75, skill: 'Answers advertisement; responds to information', category: 'COM', score: 1 },
        ],
    },
    '10-11': {
        label: 'X–XI',
        items: [
            { id: 76, skill: 'Does household tasks on demand (cooking, stitching, cleaning)', category: 'OCC', score: 1 },
            { id: 77, skill: 'Participates in skilled games and sports (cricket, basketball, badminton)', category: 'SOC', score: 1 },
            { id: 78, skill: 'Responsible for own personal cleanliness', category: 'SHD', score: 1 },
        ],
    },
    '11-12': {
        label: 'XI–XII',
        items: [
            { id: 79, skill: 'Uses simple mechanics / tools (bicycle repair, sewing machine)', category: 'OCC', score: 1 },
            { id: 80, skill: 'Does routine household tasks independently', category: 'OCC', score: 1 },
            { id: 81, skill: 'Buys own clothing accessories', category: 'SD', score: 1 },
            { id: 82, skill: 'Goes to nearby places alone (cinema, market, fair)', category: 'LOC', score: 1 },
        ],
    },
    '12-15': {
        label: 'XII–XV',
        items: [
            { id: 83, skill: 'Writes letters to get information (books, magazine, toys)', category: 'COM', score: 1 },
            { id: 84, skill: 'Plans or participates in picnic trips, outdoor sports', category: 'SOC', score: 1 },
            { id: 85, skill: 'Assisting in housework (caring for garden, cleaning car, washing window, waiting at table)', category: 'OCC', score: 1 },
            { id: 86, skill: 'Is left to care for self or others', category: 'SD', score: 1 },
            { id: 87, skill: 'Enjoys books, newspapers, magazines', category: 'COM', score: 1 },
            { id: 88, skill: 'Plays difficult games (chess, carrom, etc.) and manages own spending money', category: 'SD', score: 1 },
            { id: 89, skill: 'Engages in creative work (art, craft, tailoring, etc.)', category: 'OCC', score: 1 },
        ],
    },
};
