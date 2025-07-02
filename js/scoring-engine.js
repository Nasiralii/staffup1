// Core scoring functions from project documents
function scoreApplicant(job, candidate) {
  const scores = {};
  const weights = SCORING_WEIGHTS.employer;

  // 1. Availability Match (25 points)
  const availabilityScore = calculateDateOverlap(
    candidate.availability || {},
    job.dates || {}
  );
  scores.availabilityMatch = availabilityScore * weights.availabilityMatch;

  // 2. Relevant Experience (10 points)
  const experienceScore = Math.min(
    1,
    (candidate.experience || 0) / MAX_VALUES.experience
  );
  scores.relevantExperience = experienceScore * weights.relevantExperience;

  // 3. Certifications (10 points)
  const requiredCerts = job.requiredCertifications || [];
  const candidateCerts = candidate.certifications || [];
  const certMatch =
    requiredCerts.length > 0
      ? requiredCerts.filter((cert) => candidateCerts.includes(cert)).length /
        requiredCerts.length
      : 1;
  scores.certifications = certMatch * weights.certifications;

  // 4. Psychometric Skills (30 points)
  const skillsScore =
    (candidate.psychometricScore || 70) / MAX_VALUES.psychometricScore;
  scores.psychometricSkills = skillsScore * weights.psychometricSkills;

  // 5. Profile Completion (10 points)
  const completedFields = PROFILE_FIELDS.filter(
    (field) =>
      candidate[field] &&
      candidate[field] !== null &&
      candidate[field] !== undefined
  ).length;
  const completionScore = completedFields / PROFILE_FIELDS.length;
  scores.profileCompletion = completionScore * weights.profileCompletion;

  // 6. Training Modules (10 points)
  const trainingScore = Math.min(
    1,
    (candidate.trainingModules || 0) / MAX_VALUES.trainingModules
  );
  scores.trainingModules = trainingScore * weights.trainingModules;

  // 7. Suitability Tags (5 points)
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
  const scores = {};
  const weights = SCORING_WEIGHTS.candidate;

  // 1. Date Match (25 points)
  const dateScore = calculateDateOverlap(
    candidate.availability || {},
    job.dates || {}
  );
  scores.dateMatch = dateScore * weights.dateMatch;

  // 2. Role Preference (15 points)
  const preferredRoles = candidate.preferences?.roles || [];
  const roleMatch = preferredRoles.includes(job.role) ? 1 : 0.5;
  scores.rolePreference = roleMatch * weights.rolePreference;

  // 3. Location Match (15 points)
  const preferredLocations = candidate.preferences?.locations || [];
  const locationScore = preferredLocations.includes(job.location)
    ? 1
    : calculateLocationDistance(
        job.location || "",
        preferredLocations[0] || ""
      );
  scores.locationMatch = locationScore * weights.locationMatch;

  // 4. Accommodation Match (10 points)
  const prefAccommodation = candidate.preferences?.accommodation;
  const jobAccommodation = job.accommodation;
  const accommodationScore = prefAccommodation === jobAccommodation ? 1 : 0.7;
  scores.accommodationMatch = accommodationScore * weights.accommodationMatch;

  // 5. Pay Match (20 points)
  const expectedPay = candidate.preferences?.minPay || 0;
  const jobPay = job.pay || 0;
  const payScore =
    jobPay >= expectedPay ? 1 : expectedPay > 0 ? jobPay / expectedPay : 1;
  scores.payMatch = payScore * weights.payMatch;

  // 6. Visa Eligibility (10 points)
  const visaScore =
    candidate.visaStatus === "eligible" || job.visaSponsorship ? 1 : 0;
  scores.visaEligibility = visaScore * weights.visaEligibility;

  // 7. Required Certifications (5 points)
  const requiredCerts = job.requiredCertifications || [];
  const candidateCerts = candidate.certifications || [];
  const certScore =
    requiredCerts.length > 0
      ? requiredCerts.filter((cert) => candidateCerts.includes(cert)).length /
        requiredCerts.length
      : 1;
  scores.requiredCertifications = certScore * weights.requiredCertifications;

  const totalScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0)
  );

  return {
    totalScore,
    breakdown: scores,
    tier: getTier(totalScore),
  };
}

// Boost suggestion functions
function generateCandidateImprovements(job, candidate, currentScore) {
  const improvements = [];

  // Availability improvement
  const availabilityOverlap = calculateDateOverlap(
    candidate.availability || {},
    job.dates || {}
  );
  if (
    availabilityOverlap < 1 &&
    job.dates &&
    job.dates.start &&
    job.dates.end
  ) {
    improvements.push({
      category: "Availability",
      suggestion: `Extend your availability to cover the full job period (${job.dates.start} to ${job.dates.end})`,
      impact: "High",
      points: Math.round(
        (1 - availabilityOverlap) * SCORING_WEIGHTS.employer.availabilityMatch
      ),
    });
  }

  // Certification improvements
  const requiredCerts = job.requiredCertifications || [];
  const candidateCerts = candidate.certifications || [];
  const missingCerts = requiredCerts.filter(
    (cert) => !candidateCerts.includes(cert)
  );
  if (missingCerts.length > 0) {
    improvements.push({
      category: "Certifications",
      suggestion: `Obtain required certifications: ${missingCerts.join(", ")}`,
      impact: "Medium",
      points: Math.round(
        (missingCerts.length / requiredCerts.length) *
          SCORING_WEIGHTS.employer.certifications
      ),
    });
  }

  // Profile completion
  const missingFields = PROFILE_FIELDS.filter((field) => !candidate[field]);
  if (missingFields.length > 0) {
    improvements.push({
      category: "Profile Completion",
      suggestion: `Complete missing profile fields: ${missingFields.join(
        ", "
      )}`,
      impact: "Low",
      points: Math.round(
        (missingFields.length / PROFILE_FIELDS.length) *
          SCORING_WEIGHTS.employer.profileCompletion
      ),
    });
  }

  // Training modules
  const currentTraining = candidate.trainingModules || 0;
  if (currentTraining < MAX_VALUES.trainingModules) {
    improvements.push({
      category: "Training",
      suggestion: `Complete ${
        MAX_VALUES.trainingModules - currentTraining
      } more training modules to maximize your score`,
      impact: "Medium",
      points: Math.round(
        ((MAX_VALUES.trainingModules - currentTraining) /
          MAX_VALUES.trainingModules) *
          SCORING_WEIGHTS.employer.trainingModules
      ),
    });
  }

  return improvements.sort((a, b) => b.points - a.points);
}

function generateJobMatchImprovements(candidate, job, currentScore) {
  const improvements = [];

  // Pay expectations
  const expectedPay = candidate.preferences?.minPay || 0;
  const jobPay = job.pay || 0;
  if (expectedPay > jobPay && expectedPay > 0) {
    improvements.push({
      category: "Pay Expectations",
      suggestion: `Consider lowering your minimum pay expectation from £${expectedPay} to £${jobPay} per week`,
      impact: "High",
      points: Math.round(
        (1 - jobPay / expectedPay) * SCORING_WEIGHTS.candidate.payMatch
      ),
    });
  }

  // Location preferences
  const preferredLocations = candidate.preferences?.locations || [];
  if (!preferredLocations.includes(job.location)) {
    improvements.push({
      category: "Location Flexibility",
      suggestion: `Add ${job.location} to your preferred locations list`,
      impact: "Medium",
      points: Math.round(0.5 * SCORING_WEIGHTS.candidate.locationMatch),
    });
  }

  // Accommodation preferences
  const prefAccommodation = candidate.preferences?.accommodation;
  const jobAccommodation = job.accommodation;
  if (
    prefAccommodation &&
    jobAccommodation &&
    prefAccommodation !== jobAccommodation
  ) {
    improvements.push({
      category: "Accommodation",
      suggestion: `Consider accepting ${jobAccommodation} accommodation instead of ${prefAccommodation}`,
      impact: "Low",
      points: Math.round(0.3 * SCORING_WEIGHTS.candidate.accommodationMatch),
    });
  }

  // Role preferences
  const preferredRoles = candidate.preferences?.roles || [];
  if (!preferredRoles.includes(job.role)) {
    improvements.push({
      category: "Role Flexibility",
      suggestion: `Add "${job.role}" to your preferred roles list`,
      impact: "Medium",
      points: Math.round(0.5 * SCORING_WEIGHTS.candidate.rolePreference),
    });
  }

  return improvements.sort((a, b) => b.points - a.points);
}

function generateOverallProfileImprovements(candidate, results) {
  const improvementCounts = {};

  results.forEach(({ improvements }) => {
    improvements.forEach((improvement) => {
      const key = improvement.category;
      if (!improvementCounts[key]) {
        improvementCounts[key] = {
          category: improvement.category,
          suggestion: improvement.suggestion,
          count: 0,
          totalPoints: 0,
        };
      }
      improvementCounts[key].count++;
      improvementCounts[key].totalPoints += improvement.points;
    });
  });

  return Object.values(improvementCounts)
    .filter((item) => item.count > 1) // Only show improvements that affect multiple jobs
    .map((item) => ({
      ...item,
      frequency: `${item.count}/${results.length}`,
      averagePoints: Math.round(item.totalPoints / item.count),
    }))
    .sort((a, b) => b.count - a.count || b.averagePoints - a.averagePoints);
}
