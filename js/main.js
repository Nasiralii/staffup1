// Main scoring functions
function scoreCandidate() {
    try {
        const jobData = JSON.parse(document.getElementById('job-data').value);
        const candidateInput = JSON.parse(document.getElementById('candidate-data').value);

        // Handle both single candidate and array of candidates
        const candidates = Array.isArray(candidateInput) ? candidateInput : [candidateInput];

        // Extract only employer-required fields
        const filteredCandidates = candidates.map(candidate => extractEmployerRequiredFields(candidate));

        const results = filteredCandidates.map(candidate => {
            const score = scoreApplicant(jobData, candidate);
            const improvements = generateCandidateImprovements(jobData, candidate, score);
            return { candidate, score, improvements };
        });

        displayEmployerResults(jobData, results);
        document.getElementById('employer-results').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        document.getElementById('employer-results').innerHTML =
            `<div class="error">Error: ${error.message}. Please check your JSON format.</div>`;
    }
}

function scoreJob() {
    try {
        const candidateData = JSON.parse(document.getElementById('candidate-profile').value);
        const jobInput = JSON.parse(document.getElementById('job-profile').value);

        // Handle both single job and array of jobs
        const jobs = Array.isArray(jobInput) ? jobInput : [jobInput];

        const results = jobs.map(job => {
            const score = scoreJobMatch(candidateData, job);
            const improvements = generateJobMatchImprovements(candidateData, job, score);
            return { job, score, improvements };
        });

        displayCandidateResults(candidateData, results);
        document.getElementById('candidate-results').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        document.getElementById('candidate-results').innerHTML =
            `<div class="error">Error: ${error.message}. Please check your JSON format.</div>`;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StaffUp Scoring Engine Loaded');
    console.log('Configuration:', {
        employerWeights: SCORING_WEIGHTS.employer,
        candidateWeights: SCORING_WEIGHTS.candidate,
        maxValues: MAX_VALUES
    });
});