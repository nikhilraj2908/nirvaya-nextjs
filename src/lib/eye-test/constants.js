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
  COMPLETION: 6
};

export const STEP_NAMES = [
  'Welcome',
  'Instructions',
  'Right Eye Setup',
  'Right Eye Test',
  'Left Eye Setup',
  'Left Eye Test',
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

export const CLINICAL_DISCLAIMER =
  'This online vision screening provides a preliminary computer-assisted acuity check for informational purposes only. It is not a diagnostic medical device and cannot replace a comprehensive dilated eye examination by an eye specialist (ophthalmologist). Many serious conditions such as retinal detachment, glaucoma, diabetic retinopathy, and macular degeneration can develop without early visual symptoms.';
