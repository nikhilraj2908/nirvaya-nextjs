/**
 * Nirvaya Eyecare Centre — Vision Screening Interpretation & Summary
 * Formats clinical vision screening results for Acuity, Contrast, Astigmatism, and Color Vision.
 */

export function interpretEyeResult(achievedAcuity) {
  if (!achievedAcuity) {
    return {
      grade: 'pending',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      title: 'Not Completed',
      summary: 'Screening was not finalized for this eye.'
    };
  }

  const id = achievedAcuity.id;

  if (id === '20/20') {
    return {
      grade: 'excellent',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      title: 'Normal Visual Acuity (20/20)',
      summary: 'Preliminary screening indicates sharp resolution under current test conditions. Regular comprehensive check-ups are still advised for retina and eye pressure health.'
    };
  }

  if (id === '20/30') {
    return {
      grade: 'good',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
      title: 'Good Functional Acuity (20/30)',
      summary: 'Fine resolution is good. A clinical consultation can assess whether minor refractive correction or optical optimization could enhance comfort and clarity.'
    };
  }

  if (id === '20/40') {
    return {
      grade: 'fair',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
      title: 'Baseline Acuity (20/40)',
      summary: 'Meets standard driving baseline, but demonstrates mild visual reduction. An evaluation with an ophthalmologist is recommended to check refractive status and ocular health.'
    };
  }

  if (id === '20/60' || id === '20/100') {
    return {
      grade: 'reduced',
      badgeColor: 'bg-orange-50 text-orange-900 border-orange-300',
      title: `Reduced Acuity (${id})`,
      summary: 'Noticeable reduction in clarity detected at standard screening distances. We strongly advise scheduling a comprehensive clinical evaluation at Nirvaya Eyecare.'
    };
  }

  if (id === '< 20/100') {
    return {
      grade: 'severe',
      badgeColor: 'bg-rose-50 text-rose-900 border-rose-300',
      title: 'Severe Acuity Reduction (< 20/100)',
      summary: 'Visual acuity was below standard preliminary baseline (< 20/100). An in-person ophthalmic evaluation with Dr. Sandhya Gaur is strongly advised.'
    };
  }

  return {
    grade: 'attention',
    badgeColor: 'bg-rose-50 text-rose-900 border-rose-300',
    title: 'Evaluation Recommended',
    summary: 'Visual acuity was below standard preliminary thresholds. An in-person examination by our specialist ophthalmology team is recommended for detailed assessment.'
  };
}

export function interpretContrastResult(score = 5, total = 5) {
  const normalThreshold = Math.ceil(total * 0.7); // 4 out of 5
  if (score >= normalThreshold) {
    return {
      status: 'Normal Contrast Vision',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      isNormal: true,
      summary: 'Your ability to distinguish subtle gray shades from background is healthy. This suggests clear optical media (cornea and crystalline lens).'
    };
  }
  return {
    status: score === 0 ? 'Severe Reduction in Contrast' : 'Mild Reduction in Contrast',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    isNormal: false,
    summary: 'Subtle contrast reduction noted. Contrast sensitivity can vary due to dry eyes, screen fatigue, early cataract changes, or ambient room lighting.'
  };
}

export function interpretAstigmatismResult(isUniform = true) {
  if (isUniform) {
    return {
      status: 'No Astigmatism Detected',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      isNormal: true,
      summary: 'All radiating dial meridians appear equally sharp and dark, suggesting uniform corneal and crystalline lens curvature.'
    };
  }
  return {
    status: 'Astigmatism Indicated',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    isNormal: false,
    summary: 'Variations in line darkness or thickness observed across clock meridians. An in-person refraction can measure any cylindrical correction needed.'
  };
}

export function interpretColorVisionResult(correctCount = 3, total = 3) {
  if (total > 0 && correctCount >= total) {
    return {
      status: 'Normal Color Vision',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      isNormal: true,
      summary: 'Accurately identified all Ishihara pseudoisochromatic screening plates, indicating intact red-green and general color discrimination.'
    };
  }
  return {
    status: correctCount === 0 ? 'Significant Color Perception Variance' : 'Color Perception Variance',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    isNormal: false,
    summary: 'One or more screening plates were perceived differently. Display color calibration or congenital/acquired color discrimination variations may be present.'
  };
}

/**
 * Calculates scores totaling 12/12 per eye across the 4 pillars:
 * 1. Visual Acuity (up to 3 pts)
 * 2. Contrast Vision (up to 3 pts)
 * 3. Astigmatism (up to 3 pts)
 * 4. Visual Field / Color Vision (up to 3 pts)
 */
export function calculatePillarScores({
  rightEyeResult = {},
  leftEyeResult = {},
  contrastResult = {},
  astigmatismResult = {},
  colorResult = {}
}) {
  const getAcuityPoints = (result) => {
    const id = result?.achievedAcuity?.id;
    if (id === '20/20') return 3;
    if (id === '20/30') return 2.5;
    if (id === '20/40') return 2;
    if (id === '20/60') return 1;
    if (id === '20/100') return 0.5;
    // Failed 20/100 or below baseline gives 0 points
    return 0;
  };

  const rightAcuityPts = getAcuityPoints(rightEyeResult);
  const leftAcuityPts = getAcuityPoints(leftEyeResult);

  // Contrast Vision: 5 tests total, scaled proportionally to 3.0 max points
  let contrastPts = 0;
  if (contrastResult?.contrastScore !== undefined) {
    const totalTrials = contrastResult.totalTrials || 5;
    contrastPts = totalTrials > 0 ? (contrastResult.contrastScore / totalTrials) * 3 : 0;
  }

  // Astigmatism: 3.0 pts if uniform, 0 pts if irregular/indicated
  let astigmatismPts = 0;
  if (astigmatismResult?.isUniform === true) {
    astigmatismPts = 3;
  } else if (astigmatismResult?.isUniform === false) {
    astigmatismPts = 0;
  }

  // Color Vision: scaled proportionally to 3.0 max points
  let colorPts = 0;
  if (colorResult?.colorScore !== undefined) {
    const totalPlates = colorResult.totalPlates || 3;
    colorPts = totalPlates > 0 ? (colorResult.colorScore / totalPlates) * 3 : 0;
  }

  // Identify specific detected issues for patient summary
  const issues = [];
  const hasLeftIssue = leftAcuityPts < 3 || contrastPts < 2.4 || astigmatismPts < 3 || colorPts < 3;
  const hasRightIssue = rightAcuityPts < 3 || contrastPts < 2.4 || astigmatismPts < 3 || colorPts < 3;

  if (leftAcuityPts < 3) {
    const snellen = leftEyeResult?.achievedAcuity?.snellenUS || '< 20/100';
    issues.push(`Left Eye Acuity: ${snellen}`);
  }
  if (rightAcuityPts < 3) {
    const snellen = rightEyeResult?.achievedAcuity?.snellenUS || '< 20/100';
    issues.push(`Right Eye Acuity: ${snellen}`);
  }
  if (contrastPts < 2.4) {
    issues.push('Reduced Contrast Vision');
  }
  if (astigmatismPts < 3) {
    issues.push('Astigmatism Indicated');
  }
  if (colorPts < 3) {
    issues.push('Color Perception Variance');
  }

  const issueSummary = issues.length > 0 ? issues.join(' • ') : null;

  // If an eye has any issue, cap its score at 11 so it cannot display a false 12/12
  const rightMax = hasRightIssue ? 11 : 12;
  const leftMax = hasLeftIssue ? 11 : 12;

  const rightTotal = Math.min(rightMax, Math.round(rightAcuityPts + contrastPts + astigmatismPts + colorPts));
  const leftTotal = Math.min(leftMax, Math.round(leftAcuityPts + contrastPts + astigmatismPts + colorPts));

  // Healthy ONLY if no issues were detected and BOTH eyes achieved 12/12
  const isHealthy = issues.length === 0 && rightTotal === 12 && leftTotal === 12;

  return {
    rightScore: rightTotal,
    leftScore: leftTotal,
    maxScore: 12,
    isHealthy,
    rightAcuityPts,
    leftAcuityPts,
    contrastPts,
    astigmatismPts,
    colorPts,
    issueSummary,
    hasIssues: !isHealthy
  };
}



