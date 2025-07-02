// Extract only employer-required fields from candidate profile
function extractEmployerRequiredFields(candidate) {
  return {
    name: candidate.name || null,
    availability: candidate.availability || null,
    experience: candidate.experience || 0,
    certifications: candidate.certifications || [],
    psychometricScore: candidate.psychometricScore || null,
    email: candidate.email || null,
    phone: candidate.phone || null,
    preferences: candidate.preferences || null,
    trainingModules: candidate.trainingModules || 0,
    suitabilityTags: candidate.suitabilityTags || [],
  };
}

// Calculate date overlap between candidate availability and job dates
function calculateDateOverlap(candidateDates, jobDates) {
  if (
    !candidateDates ||
    !jobDates ||
    !candidateDates.start ||
    !candidateDates.end ||
    !jobDates.start ||
    !jobDates.end
  ) {
    return 0;
  }

  const candStart = new Date(candidateDates.start);
  const candEnd = new Date(candidateDates.end);
  const jobStart = new Date(jobDates.start);
  const jobEnd = new Date(jobDates.end);

  const overlapStart = new Date(Math.max(candStart, jobStart));
  const overlapEnd = new Date(Math.min(candEnd, jobEnd));

  if (overlapStart > overlapEnd) return 0;

  const overlapDays = (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24);
  const jobDays = (jobEnd - jobStart) / (1000 * 60 * 60 * 24);

  return Math.min(1, overlapDays / jobDays);
}

// Calculate location distance score
function calculateLocationDistance(location1, location2) {
  const loc1 = UK_REGIONS[location1?.toLowerCase()] || { lat: 0, lng: 0 };
  const loc2 = UK_REGIONS[location2?.toLowerCase()] || { lat: 0, lng: 0 };

  const distance = Math.sqrt(
    Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2)
  );

  return Math.max(0, 1 - distance / MAX_VALUES.locationDistance);
}

// Get tier based on score
function getTier(score) {
  if (score >= 80) return "gold";
  if (score >= 60) return "silver";
  return "bronze";
}

// Get match indicator class for styling
function getMatchIndicator(score) {
  if (score >= 80) return "match-excellent";
  if (score >= 60) return "match-good";
  if (score >= 40) return "match-fair";
  return "match-poor";
}

// Get match text description
function getMatchText(score) {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Fair Match";
  return "Poor Match";
}

// Tab switching function
function switchTab(tab) {
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => (content.style.display = "none"));

  document
    .querySelector(`[onclick="switchTab('${tab}')"]`)
    .classList.add("active");
  document.getElementById(`${tab}-tab`).style.display = "block";
}

// Clear functions
function clearJobData() {
  document.getElementById("job-data").value = "";
  document.getElementById("job-file").value = "";
}

function clearCandidateData() {
  document.getElementById("candidate-data").value = "";
  document.getElementById("candidate-file").value = "";
}

function clearProfileData() {
  document.getElementById("candidate-profile").value = "";
  document.getElementById("profile-file").value = "";
}

function clearJobProfileData() {
  document.getElementById("job-profile").value = "";
  document.getElementById("job-profile-file").value = "";
}
