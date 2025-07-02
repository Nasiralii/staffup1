// Scoring weights configuration - EXACT fields from project requirements
const SCORING_WEIGHTS = {
    employer: {
        availabilityMatch: 25,      // Compare job dates vs candidate dates
        relevantExperience: 10,     // No. of previous seasons in similar role
        certifications: 10,         // DBS, Safeguarding, First Aid etc.
        psychometricSkills: 30,     // From quiz: Enthusiasm, Communication, etc.
        profileCompletion: 10,      // Based on % fields completed
        trainingModules: 10,        // Completed e.g. Safeguarding badge
        suitabilityTags: 5          // e.g. "Works with Teens" or "Over 18"
    },
    candidate: {
        dateMatch: 25,              // Candidate's availability vs job dates
        rolePreference: 15,         // Candidate's stated job interests vs role type
        locationMatch: 15,          // Based on candidate's preferred regions
        accommodationMatch: 10,     // Shared/en-suite preference vs job offering
        payMatch: 20,               // Candidate minimum vs job pay
        visaEligibility: 10,        // Eligibility confirmation
        requiredCertifications: 5   // Do they have what the job requires?
    }
};

// EMPLOYER-REQUIRED FIELDS ONLY - Based on scoring inputs above
const EMPLOYER_REQUIRED_FIELDS = [
    'name',              // Basic identification (for profile completion)
    'email',             // Profile completion scoring
    'phone',             // Profile completion scoring
    'availability',      // Availability Match (25 points)
    'experience',        // Relevant Experience (10 points)
    'certifications',    // Certifications (10 points)
    'psychometricScore', // Psychometric Skills (30 points)
    'trainingModules',   // Training Modules (10 points)
    'suitabilityTags',   // Suitability Tag Match (5 points)
    'preferences'        // Profile completion scoring
];

// CANDIDATE-REQUIRED FIELDS ONLY - Based on candidate scoring inputs
const CANDIDATE_REQUIRED_FIELDS = [
    'name',              // Basic identification
    'availability',      // Date Match (25 points)
    'preferences',       // Role preference, location, accommodation, pay (60 points total)
    'visaStatus',        // Visa Eligibility (10 points)
    'certifications'     // Required Certifications (5 points)
];

// UK regions mapping for location distance calculations
const UK_REGIONS = {
    'london': { lat: 51.5074, lng: -0.1278 },
    'manchester': { lat: 53.4808, lng: -2.2426 },
    'birmingham': { lat: 52.4862, lng: -1.8904 },
    'bristol': { lat: 51.4545, lng: -2.5879 },
    'edinburgh': { lat: 55.9533, lng: -3.1883 }
};

// Profile completion required fields (for employer scoring)
const PROFILE_COMPLETION_FIELDS = ['name', 'email', 'phone', 'availability', 'preferences'];

// Maximum values for normalization
const MAX_VALUES = {
    experience: 3, // Normalize experience to 3+ years
    trainingModules: 5, // Maximum 5 training modules
    psychometricScore: 100, // Psychometric score out of 100
    locationDistance: 10 // Maximum distance for location scoring
};