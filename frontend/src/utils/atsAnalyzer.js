/**
 * Algorithmic ATS Compatibility Analyzer (Zero AI API Calls)
 * Computes deterministic Current Match Score & Potential Match Score
 * based on keyword frequency, technical terms overlap, role alignment, and section depth.
 */

const STOP_WORDS = new Set([
  'and', 'or', 'the', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'of', 'as',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
  'did', 'can', 'could', 'will', 'would', 'should', 'about', 'above', 'below', 'between',
  'cu', 'si', 'sau', 'la', 'de', 'pe', 'in', 'din', 'prin', 'pentru', 'despre', 'care',
  'este', 'sunt', 'fost', 'avea', 'avem', 'aveti', 'au', 'un', 'o', 'unui', 'unei',
  'acest', 'aceasta', 'aceste', 'acesti', 'mai', 'mult', 'multa', 'bine', 'foarte',
  'an', 'ani', 'years', 'year', 'experience', 'experienta', 'experiență', 'cerinte',
  'requirements', 'looking', 'seeking', 'cautam', 'echipa', 'team', 'company', 'companie'
]);

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/gi, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

export function analyzeAtsMatch(cvData, job) {
  if (!cvData || !job) {
    return { currentScore: 60, potentialScore: 88, matchedKeywords: [], missingKeywords: [] };
  }

  const jdText = `${job.title || ''} ${job.company || ''} ${job.description || ''}`;
  const jdTokens = tokenize(jdText);
  const jdWordSet = new Set(jdTokens);

  // Extract CV text pools
  const personalText = `${cvData.personal?.name || ''} ${cvData.personal?.title || ''} ${cvData.personal?.summary || ''}`;
  const skillsList = (cvData.skills || []).flatMap(s => (s.items || []).map(i => String(i).toLowerCase()));
  const skillsText = skillsList.join(' ');
  const expText = (cvData.experience || []).map(e => `${e.role || ''} ${e.company || ''} ${e.description || ''} ${(e.bullets || []).join(' ')}`).join(' ');
  const eduText = (cvData.education || []).map(ed => `${ed.degree || ''} ${ed.institution || ''} ${ed.description || ''}`).join(' ');

  const fullCvText = `${personalText} ${skillsText} ${expText} ${eduText}`;
  const cvTokens = tokenize(fullCvText);
  const cvWordSet = new Set(cvTokens);

  // 1. Technical / Skill keyword overlap (Weight: 45%)
  const matchedKeywords = [];
  const missingKeywords = [];

  jdWordSet.forEach(word => {
    if (cvWordSet.has(word)) {
      matchedKeywords.push(word);
    } else if (word.length >= 3) {
      missingKeywords.push(word);
    }
  });

  const totalJdKeywords = jdWordSet.size || 1;
  const keywordMatchRatio = Math.min(1, matchedKeywords.length / Math.max(10, Math.min(40, totalJdKeywords)));
  const skillScore = Math.round(keywordMatchRatio * 45);

  // 2. Title & Role alignment (Weight: 25%)
  const titleTokens = tokenize(job.title || '');
  const candidateTitleTokens = tokenize(`${cvData.personal?.title || ''} ${(cvData.experience || []).map(e => e.role || '').join(' ')}`);
  const titleOverlap = titleTokens.filter(t => candidateTitleTokens.includes(t)).length;
  const titleScoreRatio = titleTokens.length > 0 ? titleOverlap / titleTokens.length : 0.5;
  const titleScore = Math.round(titleScoreRatio * 25);

  // 3. Experience depth & Action verbs (Weight: 20%)
  const hasExperience = (cvData.experience || []).length > 0;
  const totalBullets = (cvData.experience || []).reduce((acc, e) => acc + (e.bullets?.length || 0), 0);
  const expScore = hasExperience ? Math.min(20, 8 + Math.min(12, totalBullets * 2)) : 5;

  // 4. Baseline polish (Weight: 10%)
  const hasSummary = Boolean(cvData.personal?.summary && cvData.personal.summary.length > 30);
  const hasContact = Boolean(cvData.personal?.email && cvData.personal?.phone);
  const polishScore = (hasSummary ? 5 : 2) + (hasContact ? 5 : 2);

  // Raw current match score (bound between 40 and 88 for initial realistic ATS match)
  const calculatedCurrent = Math.max(42, Math.min(88, skillScore + titleScore + expScore + polishScore));
  
  // Potential score reflects maximum achievable match after AI injects target JD keywords into bullets & summary
  const calculatedPotential = Math.min(98, Math.max(calculatedCurrent + 12, Math.round(calculatedCurrent + (100 - calculatedCurrent) * 0.55)));

  return {
    currentScore: calculatedCurrent,
    potentialScore: calculatedPotential,
    matchedKeywords: matchedKeywords.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 8)
  };
}
