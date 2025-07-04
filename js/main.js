// Main application functions

// Bulk Processing Function
function processBulkMatching() {
  try {
    const candidatesData = JSON.parse(
      document.getElementById("bulk-candidates-data").value
    );
    const jobsData = JSON.parse(
      document.getElementById("bulk-jobs-data").value
    );

    if (!Array.isArray(candidatesData)) {
      throw new Error("Candidates data must be an array");
    }

    if (!Array.isArray(jobsData)) {
      throw new Error("Jobs data must be an array");
    }

    if (candidatesData.length === 0 || jobsData.length === 0) {
      throw new Error(
        "Both candidates and jobs arrays must contain at least one item"
      );
    }

    // Show processing indicator
    document.getElementById("bulk-results").innerHTML = `
          <div class="processing-indicator">
              <div class="spinner"></div>
              <h3>Processing ${candidatesData.length} candidates against ${jobsData.length} jobs...</h3>
              <p>This may take a moment for large datasets.</p>
          </div>
      `;

    // Process with slight delay to show spinner
    setTimeout(() => {
      const results = processBulkMatches(candidatesData, jobsData);
      displayBulkResults(results);
      document
        .getElementById("bulk-results")
        .scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (error) {
    document.getElementById("bulk-results").innerHTML = `
          <div class="error">Error: ${error.message}. Please check your JSON format.</div>
      `;
  }
}

// Single candidate scoring function
function scoreCandidate() {
  try {
    const jobData = JSON.parse(document.getElementById("job-data").value);
    const candidateInput = JSON.parse(
      document.getElementById("candidate-data").value
    );

    const candidates = Array.isArray(candidateInput)
      ? candidateInput
      : [candidateInput];

    const results = candidates.map((candidate) => {
      const score = scoreApplicant(jobData, candidate);
      return { candidate, score };
    });

    displayEmployerResults(jobData, results);
    document
      .getElementById("employer-results")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    document.getElementById(
      "employer-results"
    ).innerHTML = `<div class="error">Error: ${error.message}. Please check your JSON format.</div>`;
  }
}

// Single job scoring function
function scoreJob() {
  try {
    const candidateData = JSON.parse(
      document.getElementById("candidate-profile").value
    );
    const jobInput = JSON.parse(document.getElementById("job-profile").value);

    const jobs = Array.isArray(jobInput) ? jobInput : [jobInput];

    const results = jobs.map((job) => {
      const score = scoreJobMatch(candidateData, job);
      return { job, score };
    });

    displayCandidateResults(candidateData, results);
    document
      .getElementById("candidate-results")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    document.getElementById(
      "candidate-results"
    ).innerHTML = `<div class="error">Error: ${error.message}. Please check your JSON format.</div>`;
  }
}

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 StaffUp Bulk Scoring Engine Loaded");
  console.log("Configuration:", {
    employerWeights: SCORING_WEIGHTS.employer,
    candidateWeights: SCORING_WEIGHTS.candidate,
    maxValues: MAX_VALUES,
  });
});

console.log("✅ Main.js loaded successfully");
