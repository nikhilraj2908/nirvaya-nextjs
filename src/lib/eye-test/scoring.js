/**
 * Nirvaya Eyecare Centre — Vision Screening Interpretation & Summary
 * Formats preliminary acuity results strictly within responsible medical boundaries.
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

  return {
    grade: 'attention',
    badgeColor: 'bg-rose-50 text-rose-900 border-rose-300',
    title: 'Evaluation Recommended',
    summary: 'Visual acuity was below standard preliminary thresholds. An in-person examination by our specialist ophthalmology team is recommended for detailed assessment.'
  };
}
