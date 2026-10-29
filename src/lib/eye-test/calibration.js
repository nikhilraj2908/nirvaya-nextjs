/**
 * Nirvaya Eyecare Centre — Screen Calibration & Optotype Sizing Math
 * Calculates real physical dimensions on user displays using ISO/IEC 7810 ID-1 card baseline.
 */

import { PHYSICAL_CARD_MM, VIEWING_DISTANCES_MM } from './constants';

/**
 * Detect current device form factor
 */
export function getDeviceCategory() {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Recommended viewing distance in millimeters based on screen form factor
 */
export function getRecommendedDistanceMm() {
  const device = getDeviceCategory();
  return VIEWING_DISTANCES_MM[device] || VIEWING_DISTANCES_MM.desktop;
}

/**
 * Calculate pixels-per-millimeter (PPM) from the measured card width in CSS pixels
 * Standard credit card is precisely 85.60 mm wide.
 */
export function calculatePixelsPerMm(cardWidthPx) {
  if (!cardWidthPx || cardWidthPx <= 0) return getDefaultPixelsPerMm();
  return cardWidthPx / PHYSICAL_CARD_MM.width;
}

/**
 * Default fallback pixels-per-millimeter if calibration is bypassed
 */
export function getDefaultPixelsPerMm() {
  if (typeof window === 'undefined') return 3.78; // standard 96 DPI default (96 / 25.4)
  const dpr = window.devicePixelRatio || 1;
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Handheld OLED / Retina displays typically render ~6.0 - 6.5 effective CSS px/mm
    return Math.min(7.5, Math.max(5.0, 3.8 * Math.sqrt(dpr)));
  }
  // Desktop screens typically standard 96-120 DPI
  return 3.78;
}

/**
 * Calculate the exact height in CSS pixels for a Tumbling E optotype
 * based on angular subtension in arcminutes, viewing distance, and screen PPM.
 *
 * Formula:
 * Angle in radians theta = (arcMinutes / 60) * (PI / 180)
 * Physical height H_mm = 2 * distance_mm * tan(theta / 2)
 * Height in pixels = H_mm * pixelsPerMm
 *
 * @param {number} arcMinutes - Total height angular subtension (e.g. 5.0 for 20/20)
 * @param {number} distanceMm - Viewing distance in mm (e.g. 650 for desktop, 400 for phone)
 * @param {number} pixelsPerMm - Calculated screen density
 * @returns {number} Height in CSS pixels
 */
export function calculateOptotypeHeightPx(arcMinutes, distanceMm, pixelsPerMm) {
  const thetaRad = (arcMinutes / 60) * (Math.PI / 180);
  const heightMm = 2 * distanceMm * Math.tan(thetaRad / 2);
  const rawPx = heightMm * pixelsPerMm;

  // Minimum legible rendering threshold for anti-aliased SVG strokes
  return Math.max(8, Math.round(rawPx));
}
