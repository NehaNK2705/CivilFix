/**
 * CivicFix AI - Transparent Rule-Based Classifier Service
 * 
 * Computes an interpretable priority score (0-100) and priority label
 * based on category baselines, emergency keyword detections,
 * location hazard zones, and severity indicators.
 * 
 * Note: Clearly transparent heuristic algorithm — not a black-box model.
 */

// Category Baseline Scores (0 - 100)
export const CATEGORY_BASE_SCORES = {
  pothole: 52,
  road_damage: 58,
  water_leakage: 64,
  drainage: 68,
  damaged_streetlight: 55,
  garbage: 46,
  other: 40
};

// Keyword Impact Rules
export const KEYWORD_RULES = [
  // Critical Hazards (+30 to +38)
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
  
  // High Priority Transit / Zone Risks (+18 to +25)
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

  // Moderate Severity Indicators (+10 to +15)
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

  // Mitigating / Low Severity Indicators (-10 to -20)
  {
    pattern: /\b(minor|small|superficial|cosmetic|slow drip|dry weather|side alley|quiet lane)\b/i,
    score: -14,
    reason: 'Mitigating context (minor/cosmetic or low-traffic area) [-14 pts]'
  }
];

// Helper to normalize category
export function normalizeCategory(category) {
  if (!category) return 'other';
  const clean = category.toLowerCase().trim().replace(/[\s-]+/g, '_');
  return CATEGORY_BASE_SCORES[clean] !== undefined ? clean : 'other';
}

/**
 * Classify a civic report transparently
 * @param {Object} input - { title, description, category, location }
 * @returns {Object} { priorityScore, priorityLabel, classificationReasons, suggestedCategory }
 */
export function classifyReport({ title = '', description = '', category = 'other', location = '' }) {
  const normCategory = normalizeCategory(category);
  const baseScore = CATEGORY_BASE_SCORES[normCategory] || 40;
  
  const combinedText = `${title} ${description} ${location}`.trim();
  const reasons = [];

  reasons.push(`Base score for ${normCategory.replace(/_/g, ' ')}: ${baseScore} pts`);

  let dynamicScore = baseScore;

  // Evaluate keyword rules
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(combinedText)) {
      dynamicScore += rule.score;
      reasons.push(rule.reason);
    }
  }

  // Cap and floor score between 10 and 99 (or 100)
  const finalScore = Math.max(10, Math.min(100, Math.round(dynamicScore)));

  // Derive label
  let priorityLabel = 'Medium';
  if (finalScore >= 85) {
    priorityLabel = 'Critical';
  } else if (finalScore >= 65) {
    priorityLabel = 'High';
  } else if (finalScore >= 40) {
    priorityLabel = 'Medium';
  } else {
    priorityLabel = 'Low';
  }

  // Automatic Category Recommendation if "other" or mismatch
  let suggestedCategory = normCategory;
  if (normCategory === 'other') {
    if (/\b(pothole|crater|asphalt|tarmac)\b/i.test(combinedText)) {
      suggestedCategory = 'pothole';
    } else if (/\b(wire|shock|light|pole|lamp|darkness)\b/i.test(combinedText)) {
      suggestedCategory = 'damaged_streetlight';
    } else if (/\b(pipe|leak|leaking|burst|gushing|water supply)\b/i.test(combinedText)) {
      suggestedCategory = 'water_leakage';
    } else if (/\b(drain|drainage|manhole|sewage|sewer)\b/i.test(combinedText)) {
      suggestedCategory = 'drainage';
    } else if (/\b(trash|garbage|waste|dump|litter|bins?)\b/i.test(combinedText)) {
      suggestedCategory = 'garbage';
    } else if (/\b(crack|road|pavement|culvert)\b/i.test(combinedText)) {
      suggestedCategory = 'road_damage';
    }
  }

  return {
    priorityScore: finalScore,
    priorityLabel,
    classificationReasons: reasons,
    suggestedCategory
  };
}
