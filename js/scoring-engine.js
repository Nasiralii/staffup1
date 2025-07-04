// Core scoring functions - UPDATED TO MATCH 7 CRITERIA

function scoreApplicant(job, candidate) {
  const scores = {};
  const weights = SCORING_WEIGHTS.employer;

  // 1. Availability Match (25 points) - Compare job dates vs candidate dates
  const availabilityScore = calculateDateOverlap(
    candidate.availability || {},
    job.dates || {}
  );
  scores.availabilityMatch = availabilityScore * weights.availabilityMatch;

  // 2. Relevant Experience (10 points) - Compare candidate experience vs job requirement
  const candidateExp = candidate.experience || 0;
  const requiredExp = job.requiredExperience || 1; // Default minimum 1 season
  const experienceScore =
    candidateExp >= requiredExp ? 1 : candidateExp / requiredExp;
  scores.relevantExperience =
    Math.min(1, experienceScore) * weights.relevantExperience;

  // 3. Certifications (10 points) - DBS, Safeguarding, First Aid etc.
  const requiredCerts = job.requiredCertifications || [];
  const candidateCerts = candidate.certifications || [];
  const certMatch =
    requiredCerts.length > 0
      ? requiredCerts.filter((cert) => candidateCerts.includes(cert)).length /
        requiredCerts.length
      : 1;
  scores.certifications = certMatch * weights.certifications;

  // 4. Psychometric Skills (30 points) - Compare vs minimum required score
  const candidatePsych = candidate.psychometricScore; // No default value
  const minimumPsych = job.minimumPsychometricScore || 70;

  let psychScore = 0; // Always start with 0

  // Only calculate if candidate actually has a psychometric score
  if (
    candidatePsych !== null &&
    candidatePsych !== undefined &&
    candidatePsych > 0
  ) {
    if (candidatePsych >= minimumPsych) {
      // If candidate meets minimum, give points based on performance
      psychScore = candidatePsych / 100; // Simple percentage: 80% score = 0.8, 100% score = 1.0
    } else {
      // If below minimum, proportional scoring
      psychScore = candidatePsych / 100; // Same logic - just percentage of max
    }
  }

  scores.psychometricSkills = psychScore * weights.psychometricSkills;

  // 5. Profile Completion (10 points) - Based on % fields completed
  const completedFields = CORE_PROFILE_FIELDS.filter(
    (field) =>
      candidate[field] &&
      candidate[field] !== null &&
      candidate[field] !== undefined &&
      (Array.isArray(candidate[field]) ? candidate[field].length > 0 : true)
  ).length;
  const completionScore = completedFields / CORE_PROFILE_FIELDS.length;
  scores.profileCompletion = completionScore * weights.profileCompletion;

  // 6. Training Modules (10 points) - Compare vs required training
  const candidateTraining = candidate.trainingModules || 0;
  const requiredTraining = job.requiredTrainingModules || 3; // Default minimum 3
  const trainingScore =
    candidateTraining >= requiredTraining
      ? 1
      : candidateTraining / requiredTraining;
  scores.trainingModules = Math.min(1, trainingScore) * weights.trainingModules;

  // 7. Suitability Tag Match (5 points) - e.g. "Works with Teens" or "Over 18"
  const jobTags = job.suitabilityTags || [];
  const candidateTags = candidate.suitabilityTags || [];
  const tagMatch =
    jobTags.length > 0
      ? jobTags.filter((tag) => candidateTags.includes(tag)).length /
        jobTags.length
      : 1;
  scores.suitabilityTags = tagMatch * weights.suitabilityTags;

  const totalScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0)
  );

  return {
    totalScore,
    breakdown: scores,
    tier: getTier(totalScore),
  };
}

function scoreJobMatch(candidate, job) {
  // SAME SCORING AS EMPLOYER PERSPECTIVE - CORE 7 CRITERIA ONLY
  return scoreApplicant(job, candidate);
}

// Bulk processing functions
function processBulkMatches(candidates, jobs) {
  const matchMatrix = [];
  const candidateResults = [];
  const jobResults = [];
  let totalMatches = 0;
  let excellentMatches = 0;
  let goodMatches = 0;
  let fairMatches = 0;
  let poorMatches = 0;

  // Create match matrix
  candidates.forEach((candidate, candidateIndex) => {
    const candidateRow = {
      candidate: candidate,
      matches: [],
    };

    jobs.forEach((job, jobIndex) => {
      const score = scoreApplicant(job, candidate);

      const match = {
        candidateIndex,
        jobIndex,
        candidate: candidate.name || `Candidate ${candidateIndex + 1}`,
        job: job.title || `Job ${jobIndex + 1}`,
        score: score.totalScore,
        tier: score.tier,
      };

      candidateRow.matches.push(match);
      totalMatches++;

      // Count match quality
      if (match.score >= 80) excellentMatches++;
      else if (match.score >= 60) goodMatches++;
      else if (match.score >= 40) fairMatches++;
      else poorMatches++;
    });

    matchMatrix.push(candidateRow);
  });

  // Generate candidate summaries
  candidates.forEach((candidate, index) => {
    const candidateMatches = matchMatrix[index].matches;
    const bestMatch = candidateMatches.reduce((best, current) =>
      current.score > best.score ? current : best
    );
    const averageScore = Math.round(
      candidateMatches.reduce((sum, match) => sum + match.score, 0) /
        candidateMatches.length
    );

    candidateResults.push({
      candidate,
      bestMatch,
      averageScore,
      totalJobs: jobs.length,
      excellentMatches: candidateMatches.filter((m) => m.score >= 80).length,
      goodMatches: candidateMatches.filter((m) => m.score >= 60 && m.score < 80)
        .length,
    });
  });

  // Generate job summaries
  jobs.forEach((job, jobIndex) => {
    const jobMatches = matchMatrix.map((row) => row.matches[jobIndex]);
    const bestMatch = jobMatches.reduce((best, current) =>
      current.score > best.score ? current : best
    );
    const averageScore = Math.round(
      jobMatches.reduce((sum, match) => sum + match.score, 0) /
        jobMatches.length
    );

    jobResults.push({
      job,
      bestMatch,
      averageScore,
      totalCandidates: candidates.length,
      excellentMatches: jobMatches.filter((m) => m.score >= 80).length,
      goodMatches: jobMatches.filter((m) => m.score >= 60 && m.score < 80)
        .length,
    });
  });

  return {
    matchMatrix,
    candidateResults: candidateResults.sort(
      (a, b) => b.averageScore - a.averageScore
    ),
    jobResults: jobResults.sort((a, b) => b.averageScore - a.averageScore),
    summary: {
      totalCandidates: candidates.length,
      totalJobs: jobs.length,
      totalMatches,
      excellentMatches,
      goodMatches,
      fairMatches,
      poorMatches,
      averageMatchScore: Math.round(
        matchMatrix
          .map((row) => row.matches)
          .flat()
          .reduce((sum, match) => sum + match.score, 0) / totalMatches
      ),
    },
  };
}

console.log("✅ Scoring-engine.js loaded successfully");
