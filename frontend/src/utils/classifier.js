/**
 * Client-Side Heuristic Classifier
 * Mirror of backend algorithm to provide real-time interactive feedback
 * in the Report Issue form before submission.
 */

export const CATEGORY_BASE_SCORES = {
  pothole: 52,
  road_damage: 58,
  water_leakage: 64,
  drainage: 68,
  damaged_streetlight: 55,
  garbage: 46,
  other: 40
};

export const KEYWORD_RULES = [
  {
    pattern: /\b(exposed wire|live wire|electric shock|sparks?|electrocution|short circuit)\b/i,
    score: 38,
    reason: 'Critical electrical safety hazard (shock/electrocution risk) [+38 pts]'
  },
  {
    pattern: /\b(open manhole|missing manhole cover|sinkhole|deep trench|crater|cave-?in)\b/i,
    score: 36,
    reason: 'Severe pedestrian/vehicle fall hazard (open manhole/sinkhole) [+36 pts]'
  },
  {
    pattern: /\b(ambulance blocked|hospital entrance|emergency route|fire station access)\b/i,
    score: 35,
    reason: 'Emergency corridor blockage detected [+35 pts]'
  },
  {
    pattern: /\b(gas leak|toxic fumes|chemical spill|explosion risk)\b/i,
    score: 40,
    reason: 'Toxic or explosive atmospheric hazard [+40 pts]'
  },
  {
    pattern: /\b(school zone|kindergarten|playground|elderly home|hospital)\b/i,
    score: 22,
    reason: 'Vulnerable population zone (school/hospital vicinity) [+22 pts]'
  },
  {
    pattern: /\b(highway|expressway|busy intersection|main arterial|traffic signal|blind corner)\b/i,
    score: 20,
    reason: 'High-speed traffic artery or collision-prone zone [+20 pts]'
  },
  {
    pattern: /\b(flooding|waterlogging|submerged road|knee deep|inundat(ed|ion))\b/i,
    score: 22,
    reason: 'Active urban flooding / waterlogging hazard [+22 pts]'
  },
  {
    pattern: /\b(contaminated|drinking water|foul smell|mosquito breeding|dengue|maggots)\b/i,
    score: 18,
    reason: 'Public health and disease vector risk detected [+18 pts]'
  },
  {
    pattern: /\b(total darkness|pitch black|blackout|women safety|unsafe at night)\b/i,
    score: 18,
    reason: 'Nighttime public safety & security risk [+18 pts]'
  },
  {
    pattern: /\b(overflowing|burst pipe|gushing|spreading fast|widening|multiple cars damaged)\b/i,
    score: 14,
    reason: 'Rapid progression / escalation indicator [+14 pts]'
  },
  {
    pattern: /\b(pedestrian crossing|sidewalk blocked|footpath cracked|wheelchair blocked)\b/i,
    score: 12,
    reason: 'Pedestrian and accessibility restriction [+12 pts]'
  },
  {
    pattern: /\b(minor|small|superficial|cosmetic|slow drip|dry weather|side alley|quiet lane)\b/i,
    score: -14,
    reason: 'Mitigating context (minor/cosmetic or low-traffic area) [-14 pts]'
  }
];

export function classifyLocal({ title = '', description = '', category = 'other', location = '' }) {
  const normCategory = category.toLowerCase().trim().replace(/[\s-]+/g, '_');
  const baseScore = CATEGORY_BASE_SCORES[normCategory] || 40;
  const combinedText = `${title} ${description} ${location}`.trim();
  const reasons = [];

  reasons.push(`Base score for ${normCategory.replace(/_/g, ' ')}: ${baseScore} pts`);

  let dynamicScore = baseScore;

  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(combinedText)) {
      dynamicScore += rule.score;
      reasons.push(rule.reason);
    }
  }

  const finalScore = Math.max(10, Math.min(100, Math.round(dynamicScore)));

  let priorityLabel = 'Medium';
  if (finalScore >= 85) priorityLabel = 'Critical';
  else if (finalScore >= 65) priorityLabel = 'High';
  else if (finalScore >= 40) priorityLabel = 'Medium';
  else priorityLabel = 'Low';

  return {
    priorityScore: finalScore,
    priorityLabel,
    classificationReasons: reasons
  };
}
