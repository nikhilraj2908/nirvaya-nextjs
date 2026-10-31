/**
 * Nirvaya Eyecare Centre — Online Vision Screening Constants & Protocol Definitions
 * Based on clinical Landolt C (ISO 8596 / EN ISO 8596 standard broken ring optotype).
 * 
 * IMPORTANT MEDICAL DISCLAIMER:
 * This is a preliminary computer-based vision screening tool for informational
 * and patient engagement purposes only. It is NOT a substitute for a comprehensive
 * ophthalmic evaluation performed by a qualified eye specialist.
 */

export const EYE_TEST_STEPS = {
  WELCOME: 0,
  INSTRUCTIONS: 1,
  PREPARE_RIGHT: 2,
  TEST_RIGHT: 3,
  PREPARE_LEFT: 4,
  TEST_LEFT: 5,
  CONTRAST_TEST: 6,
  ASTIGMATISM_INTRO: 7,
  ASTIGMATISM_TEST: 8,
  COLOR_BLINDNESS_TEST: 9,
  OPTIONAL_LEAD: 10,
  COMPLETION: 11
};

export const STEP_NAMES = [
  'Welcome',
  'Instructions',
  'Right Eye Setup',
  'Right Eye Acuity',
  'Left Eye Setup',
  'Left Eye Acuity',
  'Contrast Vision',
  'Astigmatism Guide',
  'Astigmatism Test',
  'Color Blindness',
  'Patient Details',
  'Results & Consultation'
];

export const DIRECTIONS = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT'
};

export const DIRECTION_CONFIG = {
  UP: { label: 'Up', degree: 270, arrow: '↑', key: 'ArrowUp' },
  RIGHT: { label: 'Right', degree: 0, arrow: '→', key: 'ArrowRight' },
  DOWN: { label: 'Down', degree: 90, arrow: '↓', key: 'ArrowDown' },
  LEFT: { label: 'Left', degree: 180, arrow: '←', key: 'ArrowLeft' }
};

// Standard Credit Card / Driving License physical dimension (ISO/IEC 7810 ID-1)
export const PHYSICAL_CARD_MM = {
  width: 85.60,
  height: 53.98,
  aspectRatio: 85.60 / 53.98 // ~1.5858
};

// Recommended ergonomic viewing distances in millimeters
export const VIEWING_DISTANCES_MM = {
  mobile: 400,    // 40 cm (comfortable mobile reading distance)
  tablet: 500,    // 50 cm
  desktop: 650    // 65 cm (typical desktop monitor distance)
};

// Clinical screening levels (Landolt C / Snellen equivalents)
// Optotype height formula: H = 2 * Distance * tan(arcminutes / 120)
// At 20/20, full letter subtends 5 arcminutes; each gap/stroke subtends 1 arcminute.
export const ACUITY_LEVELS = [
  {
    level: 1,
    id: '20/100',
    snellenUS: '20/100',
    snellenMetric: '6/30',
    arcMinutes: 25.0,
    desktopPx: 26,
    mobilePx: 20,
    label: 'Level 1: 20/100',
    description: 'Preliminary baseline'
  },
  {
    level: 2,
    id: '20/60',
    snellenUS: '20/60',
    snellenMetric: '6/18',
    arcMinutes: 15.0,
    desktopPx: 19,
    mobilePx: 15,
    label: 'Level 2: 20/60',
    description: 'Intermediate vision baseline'
  },
  {
    level: 3,
    id: '20/40',
    snellenUS: '20/40',
    snellenMetric: '6/12',
    arcMinutes: 10.0,
    desktopPx: 14,
    mobilePx: 11,
    label: 'Level 3: 20/40',
    description: 'Standard motor driving acuity threshold'
  },
  {
    level: 4,
    id: '20/30',
    snellenUS: '20/30',
    snellenMetric: '6/9',
    arcMinutes: 7.5,
    desktopPx: 10,
    mobilePx: 8,
    label: 'Level 4: 20/30',
    description: 'Sharp functional vision'
  },
  {
    level: 5,
    id: '20/20',
    snellenUS: '20/20',
    snellenMetric: '6/6',
    arcMinutes: 5.0,
    desktopPx: 7,
    mobilePx: 5.5,
    label: 'Level 5: 20/20 (Smallest)',
    description: 'Standard normal visual acuity'
  }
];

export const TRIALS_PER_LEVEL = 3;
export const PASS_THRESHOLD = 2; // At least 2 correct out of 3 to advance

// Stepped contrast levels for Contrast Vision Test (5 progressive opacity steps)
export const CONTRAST_LEVELS = [
  {
    step: 1,
    contrastPct: '100%',
    color: '#0A1E3F',
    label: 'High Contrast (100%)',
    desktopPx: 22,
    mobilePx: 18
  },
  {
    step: 2,
    contrastPct: '50%',
    color: '#475569',
    label: 'Medium-High (50%)',
    desktopPx: 21,
    mobilePx: 17
  },
  {
    step: 3,
    contrastPct: '25%',
    color: '#64748B',
    label: 'Medium Contrast (25%)',
    desktopPx: 20,
    mobilePx: 16
  },
  {
    step: 4,
    contrastPct: '12%',
    color: '#94A3B8',
    label: 'Low Contrast (12%)',
    desktopPx: 18,
    mobilePx: 15
  },
  {
    step: 5,
    contrastPct: '5%',
    color: '#CBD5E1',
    label: 'Faint Contrast (5%)',
    desktopPx: 17,
    mobilePx: 14
  }
];

// Rich pool of Ishihara-style pseudoisochromatic color plates with diverse numbers and palettes
export const COLOR_PLATE_POOL = [
  {
    id: 'plate-12',
    number: '12',
    correctAnswer: '12',
    options: ['12', '72', '21', 'Nothing'],
    targetColors: ['#E76F51', '#F4A261'],
    bgColors: ['#588157', '#83A598', '#6A994E'],
    title: 'Plate 1: Introductory Screening'
  },
  {
    id: 'plate-74',
    number: '74',
    correctAnswer: '74',
    options: ['74', '21', '71', 'Nothing'],
    targetColors: ['#2A9D8F', '#48CAE4'],
    bgColors: ['#E07A5F', '#D4A373', '#F28482'],
    title: 'Plate 2: Red-Green Perception'
  },
  {
    id: 'plate-29',
    number: '29',
    correctAnswer: '29',
    options: ['29', '70', '26', 'Nothing'],
    targetColors: ['#E76F51', '#F28482'],
    bgColors: ['#606C38', '#84A98C', '#588157'],
    title: 'Plate 3: Red-Green Sensitivity'
  },
  {
    id: 'plate-57',
    number: '57',
    correctAnswer: '57',
    options: ['57', '35', '51', 'Nothing'],
    targetColors: ['#D97706', '#F59E0B'],
    bgColors: ['#0D9488', '#14B8A6', '#2DD4BF'],
    title: 'Plate 4: Chromatic Discrimination'
  },
  {
    id: 'plate-8',
    number: '8',
    correctAnswer: '8',
    options: ['8', '3', '6', 'Nothing'],
    targetColors: ['#C0392B', '#E67E22'],
    bgColors: ['#27AE60', '#2ECC71', '#1ABC9C'],
    title: 'Plate 5: Numeral Discrimination'
  },
  {
    id: 'plate-15',
    number: '15',
    correctAnswer: '15',
    options: ['15', '17', '13', 'Nothing'],
    targetColors: ['#E76F51', '#EE6C4D'],
    bgColors: ['#52796F', '#84A98C', '#354F52'],
    title: 'Plate 6: Hue Contrast'
  },
  {
    id: 'plate-45',
    number: '45',
    correctAnswer: '45',
    options: ['45', '42', '15', 'Nothing'],
    targetColors: ['#E67E22', '#F39C12'],
    bgColors: ['#16A085', '#1ABC9C', '#27AE60'],
    title: 'Plate 7: Color Discrimination'
  },
  {
    id: 'plate-26',
    number: '26',
    correctAnswer: '26',
    options: ['26', '6', '2', 'Nothing'],
    targetColors: ['#B91C1C', '#DC2626'],
    bgColors: ['#4D7C0F', '#65A30D', '#84CC16'],
    title: 'Plate 8: Protan & Deutan Check'
  },
  {
    id: 'plate-16',
    number: '16',
    correctAnswer: '16',
    options: ['16', '18', '76', 'Nothing'],
    targetColors: ['#EA580C', '#F97316'],
    bgColors: ['#15803D', '#22C55E', '#4ADE80'],
    title: 'Plate 9: Peripheral Color Sensitivity'
  },
  {
    id: 'plate-6',
    number: '6',
    correctAnswer: '6',
    options: ['6', '5', '8', 'Nothing'],
    targetColors: ['#DC2626', '#F87171'],
    bgColors: ['#0F766E', '#14B8A6', '#2DD4BF'],
    title: 'Plate 10: High Sensitivity Check'
  }
];

// Helper to pick randomized distinct plates per screening session
export function getRandomColorPlates(count = 3) {
  const shuffled = [...COLOR_PLATE_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Default export for backwards compatibility
export const COLOR_PLATES = COLOR_PLATE_POOL.slice(0, 3);

export const CLINICAL_DISCLAIMER =
  'This online vision screening provides a preliminary computer-assisted visual function check for informational purposes only. It is not a diagnostic medical device and cannot replace a comprehensive dilated eye examination by an eye specialist (ophthalmologist). Many serious conditions such as retinal detachment, glaucoma, diabetic retinopathy, and macular degeneration can develop without early visual symptoms.';
