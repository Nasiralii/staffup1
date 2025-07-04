// Improvement suggestion functions

// Generate overall candidate improvements across all jobs
function generateCandidateImprovements(candidate, results) {
  const improvementCounts = {};
  const totalJobs = results.length;

  results.forEach(({ job, score }) => {
    const jobImprovements = generateJobSpecificImprovements(
      candidate,
      job,
      score
    );

    jobImprovements.forEach((improvement) => {
      const key = improvement.category;
      if (!improvementCounts[key]) {
        improvementCounts[key] = {
          category: improvement.category,
          suggestions: [],
          totalPoints: 0,
          jobsAffected: 0,
          examples: [],
        };
      }
      improvementCounts[key].totalPoints += improvement.points;
      improvementCounts[key].jobsAffected++;
      if (
        !improvementCounts[key].suggestions.includes(improvement.suggestion)
      ) {
        improvementCounts[key].suggestions.push(improvement.suggestion);
      }
    });
  });

  return Object.values(improvementCounts)
    .filter((item) => item.jobsAffected > 0)
    .map((item) => {
      const averageGain = Math.round(item.totalPoints / item.jobsAffected);
      const affectedPercentage = (item.jobsAffected / totalJobs) * 100;

      let priority, explanation, actionStep;

      if (item.category === "Availability") {
        priority = affectedPercentage > 50 ? "high" : "medium";
        explanation = `${item.jobsAffected} out of ${totalJobs} jobs have date conflicts with your availability.`;
        actionStep =
          "Review and extend your availability dates to cover more job periods.";
      } else if (item.category === "Certifications") {
        priority = affectedPercentage > 30 ? "high" : "medium";
        explanation = `Many jobs require certifications you don't have. This is often mandatory.`;
        actionStep =
          "Prioritize getting the most commonly required certifications first.";
      } else if (item.category === "Psychometric Score") {
        priority = "high";
        explanation =
          "Your psychometric score affects all jobs and carries the highest weight (30 points).";
        actionStep =
          "Retake the psychometric assessment to improve your soft skills score.";
      } else if (item.category === "Experience") {
        priority = "medium";
        explanation =
          "More experience in similar roles makes you a stronger candidate.";
        actionStep =
          "Highlight any relevant experience, even if informal or volunteer work.";
      } else if (item.category === "Training Modules") {
        priority = "medium";
        explanation =
          "Completing training modules shows commitment and relevant knowledge.";
        actionStep =
          "Complete the remaining training modules available on the platform.";
      } else if (item.category === "Profile Completion") {
        priority = "low";
        explanation =
          "A complete profile shows professionalism and attention to detail.";
        actionStep =
          "Fill in all missing profile fields to achieve 100% completion.";
      } else {
        priority = "medium";
        explanation = `This affects ${item.jobsAffected} jobs you're interested in.`;
        actionStep = item.suggestions[0] || "Review the specific requirements.";
      }

      return {
        category: item.category,
        suggestion: item.suggestions[0] || "Review requirements",
        explanation,
        actionStep,
        averageGain,
        jobsAffected: item.jobsAffected,
        priority,
        affectedPercentage,
      };
    })
    .sort((a, b) => {
      // Sort by priority (high > medium > low) then by average gain
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.averageGain - a.averageGain;
    });
}

// Generate job-specific improvements
function generateJobSpecificImprovements(candidate, job, score) {
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
    const missingPoints = Math.round(
      (1 - availabilityOverlap) * SCORING_WEIGHTS.employer.availabilityMatch
    );
    improvements.push({
      category: "Availability",
      suggestion: `Extend your availability to cover ${job.dates.start} to ${job.dates.end}`,
      points: missingPoints,
    });
  }

  // Experience improvement
  const candidateExp = candidate.experience || 0;
  const requiredExp = job.requiredExperience || 1;
  if (candidateExp < requiredExp) {
    const missingPoints = Math.round(
      ((requiredExp - candidateExp) / requiredExp) *
        SCORING_WEIGHTS.employer.relevantExperience
    );
    improvements.push({
      category: "Experience",
      suggestion: `Need ${requiredExp} seasons experience (you have ${candidateExp})`,
      points: missingPoints,
    });
  }

  // Certification improvements
  const requiredCerts = job.requiredCertifications || [];
  const candidateCerts = candidate.certifications || [];
  const missingCerts = requiredCerts.filter(
    (cert) => !candidateCerts.includes(cert)
  );
  if (missingCerts.length > 0) {
    const missingPoints = Math.round(
      (missingCerts.length / requiredCerts.length) *
        SCORING_WEIGHTS.employer.certifications
    );
    improvements.push({
      category: "Certifications",
      suggestion: `Obtain required certifications: ${missingCerts.join(", ")}`,
      points: missingPoints,
    });
  }

  // Psychometric score improvement
  const candidatePsych = candidate.psychometricScore || 70;
  const minimumPsych = job.minimumPsychometricScore || 70;
  if (candidatePsych < minimumPsych) {
    const missingPoints = Math.round(
      ((minimumPsych - candidatePsych) / minimumPsych) *
        SCORING_WEIGHTS.employer.psychometricSkills
    );
    improvements.push({
      category: "Psychometric Score",
      suggestion: `Improve soft skills score to ${minimumPsych}+ (currently ${candidatePsych})`,
      points: missingPoints,
    });
  }

  // Training modules improvement
  const candidateTraining = candidate.trainingModules || 0;
  const requiredTraining = job.requiredTrainingModules || 3;
  if (candidateTraining < requiredTraining) {
    const missingPoints = Math.round(
      ((requiredTraining - candidateTraining) / requiredTraining) *
        SCORING_WEIGHTS.employer.trainingModules
    );
    improvements.push({
      category: "Training Modules",
      suggestion: `Complete ${
        requiredTraining - candidateTraining
      } more training modules (need ${requiredTraining} total)`,
      points: missingPoints,
    });
  }

  // Profile completion improvement
  const completedFields = CORE_PROFILE_FIELDS.filter(
    (field) =>
      candidate[field] &&
      candidate[field] !== null &&
      candidate[field] !== undefined &&
      (Array.isArray(candidate[field]) ? candidate[field].length > 0 : true)
  ).length;
  if (completedFields < CORE_PROFILE_FIELDS.length) {
    const missingFields = CORE_PROFILE_FIELDS.filter(
      (field) =>
        !candidate[field] ||
        candidate[field] === null ||
        candidate[field] === undefined ||
        (Array.isArray(candidate[field]) && candidate[field].length === 0)
    );
    const missingPoints = Math.round(
      (missingFields.length / CORE_PROFILE_FIELDS.length) *
        SCORING_WEIGHTS.employer.profileCompletion
    );
    improvements.push({
      category: "Profile Completion",
      suggestion: `Complete missing profile fields: ${missingFields.join(
        ", "
      )}`,
      points: missingPoints,
    });
  }

  // Suitability tags improvement
  const jobTags = job.suitabilityTags || [];
  const candidateTags = candidate.suitabilityTags || [];
  const missingTags = jobTags.filter((tag) => !candidateTags.includes(tag));
  if (missingTags.length > 0 && jobTags.length > 0) {
    const missingPoints = Math.round(
      (missingTags.length / jobTags.length) *
        SCORING_WEIGHTS.employer.suitabilityTags
    );
    improvements.push({
      category: "Suitability Tags",
      suggestion: `Add relevant tags to your profile: ${missingTags.join(
        ", "
      )}`,
      points: missingPoints,
    });
  }

  return improvements.sort((a, b) => b.points - a.points);
}

console.log("✅ Improvements.js loaded successfully");
