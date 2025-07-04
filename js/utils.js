// Utility Functions

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

// Get score cell class for color coding
function getScoreCellClass(score) {
  if (score >= 80) return "score-excellent";
  if (score >= 60) return "score-good";
  if (score >= 40) return "score-fair";
  return "score-poor";
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
function clearBulkCandidates() {
  document.getElementById("bulk-candidates-data").value = "";
  document.getElementById("bulk-candidates-file").value = "";
}

function clearBulkJobs() {
  document.getElementById("bulk-jobs-data").value = "";
  document.getElementById("bulk-jobs-file").value = "";
}

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

console.log("✅ Utils.js loaded successfully");
