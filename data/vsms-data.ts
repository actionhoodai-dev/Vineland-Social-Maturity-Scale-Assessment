/**
 * VINELAND SOCIAL MATURITY SCALE (VSMS) - Official Weighted Scoring
 * Indian Adaptation by Dr. A.J. Malin — 89 Items
 * Organized by age level with weighted scores based on developmental maturity.
 */

import { VSMSDataMap } from '@/types';

export const VSMS_DATA: VSMSDataMap = {
    '0-1': {
        label: '0–1',
        items: [
            { id: 1, skill: '"Crows", laughs', category: 'COM', score: 7.5 },
            { id: 2, skill: 'Balances head', category: 'SHG', score: 1.5 },
            { id: 3, skill: 'Grasps object within reach', category: 'SHG', score: 3.0 },
            { id: 4, skill: 'Reaches for familiar persons', category: 'SOC', score: 7.5 },
            { id: 5, skill: 'Rolls over (unassisted)', category: 'SHG', score: 4.5 },
            { id: 6, skill: 'Reaches for nearby objects', category: 'SHG', score: 6.0 },
            { id: 7, skill: 'Occupies self unattended', category: 'OCC', score: 9.0 },
            { id: 8, skill: 'Sits unsupported', category: 'SHG', score: 7.5 },
            { id: 9, skill: 'Pulls self if upright', category: 'SHG', score: 9.0 },
            { id: 10, skill: '"Talks" imitates sounds', category: 'COM', score: 9.0 },
            { id: 11, skill: 'Drinks from cup or glass assisted', category: 'SHE', score: 7.5 },
            { id: 12, skill: 'Moves about on floor (creeping, crawling)', category: 'LOC', score: 9.0 },
            { id: 13, skill: 'Grasps with thumb and finger', category: 'SHG', score: 10.5 },
            { id: 14, skill: 'Demands personal attention', category: 'SOC', score: 9.0 },
            { id: 15, skill: 'Stands alone', category: 'SHG', score: 12.0 },
            { id: 16, skill: 'Does not drool', category: 'SHE', score: 9.0 },
            { id: 17, skill: 'Follows simple instructions', category: 'COM', score: 10.8 },
            { id: 18, skill: 'Walks about room unattended', category: 'LOC', score: 10.8 },
            { id: 19, skill: 'Marks with pencil or crayon', category: 'OCC', score: 10.8 },
            { id: 20, skill: 'Masticates (chews) solid or semi-solid food', category: 'SHE', score: 14.4 },
            { id: 21, skill: 'Removes shoes or sandals, pulls off socks', category: 'SHD', score: 10.8 },
            { id: 22, skill: 'Transfers objects', category: 'OCC', score: 19.2 },
            { id: 23, skill: 'Overcomes simple obstacles', category: 'SHG', score: 19.2 },
            { id: 24, skill: 'Fetches or carries familiar objects', category: 'OCC', score: 21.6 },
            { id: 25, skill: 'Drinks from cup or glass unassisted', category: 'SHE', score: 10.8 },
            { id: 26, skill: 'Walks or uses a go cart for walking', category: 'SHG', score: 21.6 },
            { id: 27, skill: 'Plays with other children', category: 'SOC', score: 19.2 },
            { id: 28, skill: 'Eats with own hands', category: 'SHE', score: 19.2 },
            { id: 29, skill: 'Goes about house or yard', category: 'LOC', score: 19.2 },
            { id: 30, skill: 'Discriminates edible substances from non edibles', category: 'SHE', score: 21.6 },
            { id: 31, skill: 'Uses names of familiar objects', category: 'COM', score: 21.6 },
            { id: 32, skill: 'Walks up stairs unassisted', category: 'LOC', score: 21.6 },
            { id: 33, skill: 'Unwraps sweets, chocolates', category: 'SHE', score: 24.0 },
            { id: 34, skill: 'Talks in short sentences', category: 'COM', score: 24.0 },
        ],
    },
    '2-3': {
        label: 'II–III',
        items: [
            { id: 35, skill: 'Signals to go to toilet', category: 'SHG', score: 28.0 },
            { id: 36, skill: 'Initiates own play activities', category: 'OCC', score: 32.0 },
            { id: 37, skill: 'Removes shirt or frock if unbuttoned', category: 'SHD', score: 28.0 },
            { id: 38, skill: 'Eats with spoon', category: 'SHE', score: 28.0 },
            { id: 39, skill: 'Gets drink (water) unassisted', category: 'SHE', score: 32.0 },
            { id: 40, skill: 'Dries own hands', category: 'SHD', score: 32.0 },
            { id: 41, skill: 'Avoids simple hazards', category: 'SHG', score: 32.0 },
            { id: 42, skill: 'Puts on shirt or frock unassisted (need not button)', category: 'SHD', score: 36.0 },
            { id: 43, skill: 'Can do paper folding', category: 'OCC', score: 36.0 },
            { id: 44, skill: 'Relates experiences', category: 'COM', score: 40.0 },
        ],
    },
    '3-4': {
        label: 'III–IV',
        items: [
            { id: 45, skill: 'Walks down stairs, one step at a time', category: 'LOC', score: 40.0 },
            { id: 46, skill: 'Plays co-operatively at kindergarten level', category: 'SOC', score: 40.0 },
            { id: 47, skill: 'Buttons shirt or frock', category: 'SHD', score: 40.0 },
            { id: 48, skill: 'Helps at little household tasks', category: 'OCC', score: 44.0 },
            { id: 49, skill: '"Performs" for others', category: 'SOC', score: 44.0 },
            { id: 50, skill: 'Washes hands unaided', category: 'SHD', score: 52.0 },
        ],
    },
    '4-5': {
        label: 'IV–V',
        items: [
            { id: 51, skill: 'Cares for self at toilet', category: 'SHG', score: 52.0 },
            { id: 52, skill: 'Washes face unassisted', category: 'SHD', score: 56.0 },
            { id: 53, skill: 'Goes about neighborhood unattended', category: 'LOC', score: 52.0 },
            { id: 54, skill: 'Dresses self except for tying', category: 'SHD', score: 60.0 },
            { id: 55, skill: 'Use pencils or crayon for drawing', category: 'OCC', score: 60.0 },
            { id: 56, skill: 'Plays competitive exercise', category: 'SOC', score: 64.0 },
        ],
    },
    '5-6': {
        label: 'V–VI',
        items: [
            { id: 57, skill: 'Uses hoops, flies kites, rides tricycles', category: 'OCC', score: 64.0 },
            { id: 58, skill: 'Print (writes) simple words', category: 'COM', score: 64.0 },
            { id: 59, skill: 'Plays simple table games', category: 'SOC', score: 68.0 },
            { id: 60, skill: 'Is trusted with money', category: 'SD', score: 68.0 },
            { id: 61, skill: 'Goes to school unattended', category: 'LOC', score: 76.0 },
        ],
    },
    '6-7': {
        label: 'VI–VII',
        items: [
            { id: 62, skill: 'Mixes rice "properly" unassisted', category: 'SHE', score: 76.0 },
            { id: 63, skill: 'Uses pencil for writing', category: 'COM', score: 80.0 },
            { id: 64, skill: 'Bathes self assisted', category: 'SHD', score: 84.0 },
            { id: 65, skill: 'Goes to bed unassisted', category: 'SHD', score: 88.0 },
        ],
    },
    '7-8': {
        label: 'VII–VIII',
        items: [
            { id: 66, skill: 'Tells time to quarter hour', category: 'SHG', score: 88.0 },
            { id: 67, skill: 'Helps himself during meals', category: 'SHE', score: 88.0 },
            { id: 68, skill: 'Refuses to believe in magic and fairy tales', category: 'SOC', score: 88.0 },
            { id: 69, skill: 'Participates in pre-adolescent play', category: 'SOC', score: 92.0 },
            { id: 70, skill: 'Combs or brushes hair', category: 'SHD', score: 100.0 },
        ],
    },
    '8-9': {
        label: 'VIII–IX',
        items: [
            { id: 71, skill: 'Uses tools or utensils', category: 'OCC', score: 100.0 },
            { id: 72, skill: 'Does routine household tasks', category: 'OCC', score: 104.0 },
            { id: 73, skill: 'Reads on own initiative', category: 'COM', score: 104.0 },
            { id: 74, skill: 'Bathes self unaided', category: 'SHD', score: 112.0 },
        ],
    },
    '9-10': {
        label: 'IX–X',
        items: [
            { id: 75, skill: 'Cares for self at table (meals)', category: 'SHE', score: 112.0 },
            { id: 76, skill: 'Makes minor purchases', category: 'SD', score: 112.0 },
            { id: 77, skill: 'Goes about home town freely', category: 'LOC', score: 112.0 },
        ],
    },
    '10-11': {
        label: 'X–XI',
        items: [
            { id: 78, skill: 'Writes occasional short letters to friends', category: 'SOC', score: 124.0 },
            { id: 79, skill: 'Makes independent choice of shops', category: 'SD', score: 128.0 },
            { id: 80, skill: 'Does small remunerative work; makes articles', category: 'OCC', score: 132.0 },
            { id: 81, skill: 'Answers ads; writes letters for information', category: 'COM', score: 132.0 },
        ],
    },
    '11-12': {
        label: 'XI–XII',
        items: [
            { id: 82, skill: 'Does simple creative work', category: 'OCC', score: 144.0 },
            { id: 83, skill: 'Is left to care for self or others', category: 'SD', score: 144.0 },
            { id: 84, skill: 'Enjoys reading books, newspapers, magazines', category: 'COM', score: 156.0 },
        ],
    },
    '12-15': {
        label: 'XII–XV',
        items: [
            { id: 85, skill: 'Plays difficult games', category: 'SOC', score: 156.0 },
            { id: 86, skill: 'Exercises complete care of dress', category: 'SHD', score: 156.0 },
            { id: 87, skill: 'Buys own clothing accessories', category: 'SD', score: 168.0 },
            { id: 88, skill: 'Engages in adolescent group activities', category: 'SOC', score: 168.0 },
            { id: 89, skill: 'Performs responsible routine chores', category: 'OCC', score: 180.0 },
        ],
    },
};
