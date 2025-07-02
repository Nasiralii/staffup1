// Scoring weights configuration - EXACT fields from project requirements
const SCORING_WEIGHTS = {
  employer: {
    availabilityMatch: 25, // Compare job dates vs candidate dates
    relevantExperience: 10, // No. of previous seasons in similar role
    certifications: 10, // DBS, Safeguarding, First Aid etc.
    psychometricSkills: 30, // From quiz: Enthusiasm, Communication, etc.
    profileCompletion: 10, // Based on % fields completed
    trainingModules: 10, // Completed e.g. Safeguarding badge
    suitabilityTags: 5, // e.g. "Works with Teens" or "Over 18"
  },
  candidate: {
    dateMatch: 25, // Candidate's availability vs job dates
    rolePreference: 15, // Candidate's stated job interests vs role type
    locationMatch: 15, // Based on candidate's preferred regions
    accommodationMatch: 10, // Shared/en-suite preference vs job offering
    payMatch: 20, // Candidate minimum vs job pay
    visaEligibility: 10, // Eligibility confirmation
    requiredCertifications: 5, // Do they have what the job requires?
  },
};

// EMPLOYER-REQUIRED FIELDS ONLY - Based on scoring inputs above
const EMPLOYER_REQUIRED_FIELDS = [
  "name", // Basic identification (for profile completion)
  "email", // Profile completion scoring
  "phone", // Profile completion scoring
  "availability", // Availability Match (25 points)
  "experience", // Relevant Experience (10 points)
  "certifications", // Certifications (10 points)
  "psychometricScore", // Psychometric Skills (30 points)
  "trainingModules", // Training Modules (10 points)
  "suitabilityTags", // Suitability Tag Match (5 points)
  "preferences", // Profile completion scoring
];

// CANDIDATE-REQUIRED FIELDS ONLY - Based on candidate scoring inputs
const CANDIDATE_REQUIRED_FIELDS = [
  "name", // Basic identification
  "availability", // Date Match (25 points)
  "preferences", // Role preference, location, accommodation, pay (60 points total)
  "visaStatus", // Visa Eligibility (10 points)
  "certifications", // Required Certifications (5 points)
];

// PROFILE_FIELDS - Complete list of candidate profile fields (REQUIRED BY SCORING ENGINE)
const PROFILE_FIELDS = [
  "name",
  "email",
  "phone",
  "availability",
  "experience",
  "certifications",
  "psychometricScore",
  "trainingModules",
  "suitabilityTags",
  "preferences",
  "visaStatus",
];

// JOB_FIELDS - Complete list of job posting fields
const JOB_FIELDS = [
  "title",
  "company",
  "role",
  "location",
  "dates",
  "pay",
  "accommodation",
  "visaSponsorship",
  "requiredCertifications",
  "suitabilityTags",
];

// UK regions mapping for location distance calculations
const UK_REGIONS = {
  london: { lat: 51.5074, lng: -0.1278 },
  manchester: { lat: 53.4808, lng: -2.2426 },
  birmingham: { lat: 52.4862, lng: -1.8904 },
  bristol: { lat: 51.4545, lng: -2.5879 },
  edinburgh: { lat: 55.9533, lng: -3.1883 },
};

// Profile completion required fields (for employer scoring)
const PROFILE_COMPLETION_FIELDS = [
  "name",
  "email",
  "phone",
  "availability",
  "preferences",
];

// Maximum values for normalization
const MAX_VALUES = {
  experience: 3, // Normalize experience to 3+ years
  trainingModules: 5, // Maximum 5 training modules
  psychometricScore: 100, // Psychometric score out of 100
  locationDistance: 10, // Maximum distance for location scoring
};

// Helper function to extract only employer-required fields from candidate data
function extractEmployerRequiredFields(candidate) {
  const filtered = {};
  EMPLOYER_REQUIRED_FIELDS.forEach((field) => {
    if (candidate[field] !== undefined) {
      filtered[field] = candidate[field];
    }
  });
  return filtered;
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

console.log("✅ Config.js loaded successfully");
