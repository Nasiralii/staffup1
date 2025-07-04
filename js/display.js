// Display functions for results

function displayBulkResults(results) {
  const container = document.getElementById("bulk-results");

  const summaryHtml = `
      <div class="bulk-summary">
          <h3>📊 Bulk Matching Results</h3>
          <div class="summary-grid">
              <div class="summary-item">
                  <strong>${results.summary.totalCandidates}</strong>
                  <span>Candidates</span>
              </div>
              <div class="summary-item">
                  <strong>${results.summary.totalJobs}</strong>
                  <span>Jobs</span>
              </div>
              <div class="summary-item">
                  <strong>${results.summary.totalMatches}</strong>
                  <span>Total Matches</span>
              </div>
              <div class="summary-item">
                  <strong>${results.summary.averageMatchScore}%</strong>
                  <span>Average Score</span>
              </div>
              <div class="summary-item">
                  <strong>${results.summary.excellentMatches}</strong>
                  <span>Excellent Matches</span>
              </div>
              <div class="summary-item">
                  <strong>${results.summary.goodMatches}</strong>
                  <span>Good Matches</span>
              </div>
          </div>
      </div>
  `;

  // Top matches section
  const allMatches = results.matchMatrix.map((row) => row.matches).flat();
  const topMatches = allMatches.sort((a, b) => b.score - a.score).slice(0, 10);

  const topMatchesHtml = `
      <div class="top-matches">
          <h4>🏆 Top 10 Overall Matches</h4>
          ${topMatches
            .map(
              (match, index) => `
              <div class="top-match-item">
                  <div class="match-details">
                      <strong>#${index + 1} - ${match.candidate} → ${
                match.job
              }</strong>
                      <br>
                      <small>Core Criteria Score: ${match.score}%</small>
                  </div>
                  <div class="match-score ${getScoreCellClass(match.score)}">
                      ${match.score}%
                  </div>
              </div>
          `
            )
            .join("")}
      </div>
  `;

  // Match matrix table
  const matrixHtml = `
      <div class="match-matrix">
          <div class="matrix-header">
              <h4>📈 Complete Match Matrix</h4>
              <p>Scores based on the 7 core criteria: Availability, Experience, Certifications, Psychometric Skills, Profile Completion, Training, Suitability Tags</p>
          </div>
          <div style="overflow-x: auto;">
              <table class="matrix-table">
                  <thead>
                      <tr>
                          <th class="candidate-name">Candidate</th>
                          ${results.jobResults
                            .map(
                              (jr) => `
                              <th style="min-width: 120px; writing-mode: vertical-rl; text-orientation: mixed;">
                                  ${jr.job.title || "Untitled Job"}
                              </th>
                          `
                            )
                            .join("")}
                          <th>Best Match</th>
                          <th>Avg Score</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${results.matchMatrix
                        .map(
                          (row) => `
                          <tr>
                              <td class="candidate-name">${
                                row.candidate.name || "Unnamed"
                              }</td>
                              ${row.matches
                                .map(
                                  (match) => `
                                  <td>
                                      <div class="score-cell ${getScoreCellClass(
                                        match.score
                                      )}">
                                          ${match.score}%
                                      </div>
                                  </td>
                              `
                                )
                                .join("")}
                              <td><strong>${Math.max(
                                ...row.matches.map((m) => m.score)
                              )}%</strong></td>
                              <td><strong>${Math.round(
                                row.matches.reduce(
                                  (sum, m) => sum + m.score,
                                  0
                                ) / row.matches.length
                              )}%</strong></td>
                          </tr>
                      `
                        )
                        .join("")}
                  </tbody>
              </table>
          </div>
      </div>
  `;

  // Candidate summaries
  const candidateSummariesHtml = `
      <div style="margin-top: 30px;">
          <h3>👥 Candidate Performance Summary</h3>
          ${results.candidateResults
            .map(
              (cr) => `
              <div class="candidate-card">
                  <div class="score-header">
                      <div class="candidate-info">
                          <h4> ${cr.candidate.name || "Unnamed Candidate"}</h4>
                          <p>📧<b>Email</b> : ${
                            cr.candidate.email || "No email provided"
                          }</p>
                          <p>📞 <b>Phone</b> : ${
                            cr.candidate.phone || "No phone provided"
                          }</p>
                          <p>🎯<b> Experience </b> : ${
                            cr.candidate.experience || 0
                          } ${
                (cr.candidate.experience || 0) === 1 ? "year" : "years"
              }</p>
                          <p>🏆<b> Psychometric Score : </b> ${
                            cr.candidate.psychometricScore || "Not tested"
                          }${cr.candidate.psychometricScore ? "%" : ""}</p>
                          <p>📚 <b>Training Modules </b>: ${
                            cr.candidate.trainingModules || 0
                          }/${MAX_VALUES.trainingModules} completed</p>
                          <p>📅<b> Available </b>: ${
                            cr.candidate.availability?.start || "TBD"
                          } to ${cr.candidate.availability?.end || "TBD"}</p>
                          <p>🎓 <b> Certifications </b>: ${
                            (cr.candidate.certifications || []).join(", ") ||
                            "None listed"
                          }</p>
                          <p>🏷️<b> Tags </b>: ${
                            (cr.candidate.suitabilityTags || []).join(", ") ||
                            "None listed"
                          }</p>
                          <p>🎯 Best Match: <strong>${
                            cr.bestMatch.job
                          }</strong> (${cr.bestMatch.score}%)</p>
                          <p>📊 Average Score: <strong>${
                            cr.averageScore
                          }%</strong> across ${cr.totalJobs} jobs</p>
                          <p>🏆 ${cr.excellentMatches} excellent, ${
                cr.goodMatches
              } good matches</p>
                      </div>
                      <div class="score-circle score-${getTier(
                        cr.averageScore
                      )}">
                          ${cr.averageScore}%
                          <span class="badge badge-${getTier(
                            cr.averageScore
                          )}">${getTier(cr.averageScore).toUpperCase()}</span>
                      </div>
                  </div>
              </div>
          `
            )
            .join("")}
      </div>
  `;

  // Job summaries
  const jobSummariesHtml = `
      <div style="margin-top: 30px;">
          <h3>💼 Job Performance Summary</h3>
          ${results.jobResults
            .map(
              (jr) => `
              <div class="job-card">
                  <div class="score-header">
                      <div class="job-info">
                          <h4>Job Title ${jr.job.title || "Untitled Job"}</h4>
                          <p>🏢Company ${
                            jr.job.company || "Unknown Company"
                          }</p>
                          <p>👤 Role: ${jr.job.role || "Not specified"}</p>
                          <p>📅 Job Dates: ${jr.job.dates?.start || "TBD"} to ${
                jr.job.dates?.end || "TBD"
              }</p>
                          <p>🎯 Required Experience: ${
                            jr.job.requiredExperience || 1
                          } ${
                (jr.job.requiredExperience || 1) === 1 ? "year" : "years"
              }</p>
                          <p>🎓 Required Certifications: ${
                            (jr.job.requiredCertifications || []).join(", ") ||
                            "None specified"
                          }</p>
                          <p>🧠 Psychometric Score: ${
                            jr.job.minimumPsychometricScore || 70
                          }%</p>
                          <p>📚 Training Modules: ${
                            jr.job.requiredTrainingModules || 3
                          }</p>
                          <p>🏷️ Tags: ${
                            (jr.job.suitabilityTags || []).join(", ") ||
                            "None specified"
                          }</p>
                          <p>🎯 Best Match: <strong>${
                            jr.bestMatch.candidate
                          }</strong> (${jr.bestMatch.score}%)</p>
                          <p>📊 Average Score: <strong>${
                            jr.averageScore
                          }%</strong> across ${
                jr.totalCandidates
              } candidates</p>
                          <p>🏆 ${jr.excellentMatches} excellent, ${
                jr.goodMatches
              } good matches</p>
                      </div>
                      <div class="score-circle score-${getTier(
                        jr.averageScore
                      )}">
                          ${jr.averageScore}%
                          <span class="badge badge-${getTier(
                            jr.averageScore
                          )}">${getTier(jr.averageScore).toUpperCase()}</span>
                      </div>
                  </div>
              </div>
          `
            )
            .join("")}
      </div>
  `;

  container.innerHTML =
    summaryHtml +
    topMatchesHtml +
    matrixHtml +
    candidateSummariesHtml +
    jobSummariesHtml;
}

function displayEmployerResults(job, results) {
  const container = document.getElementById("employer-results");
  const sortedResults = results.sort(
    (a, b) => b.score.totalScore - a.score.totalScore
  );

  const candidatesHtml = sortedResults
    .map(
      ({ candidate, score }) => `
      <div class="candidate-card">
          <div class="score-header">
              <div class="candidate-info">
                  <h3>${candidate.name || "Unnamed Candidate"} 
                      <span class="match-indicator ${getMatchIndicator(
                        score.totalScore
                      )}">${getMatchText(score.totalScore)}</span>
                  </h3>
                  <p>📧<b>Email</b> : ${
                    candidate.email || "No email provided"
                  }</p>
                  <p>📞 <b>Phone</b> :${
                    candidate.phone || "No phone provided"
                  }</p>
                  <p>🎯<b> Experience</b>: ${candidate.experience || 0} ${
        (candidate.experience || 0) === 1 ? "year" : "years"
      }</p>
                  <p>🏆 <b>Psychometric Score </b>: ${
                    candidate.psychometricScore || "Not tested"
                  }${candidate.psychometricScore ? "%" : ""}</p>
                  <p>📚 <b>Training Modules</b> : ${
                    candidate.trainingModules || 0
                  }/${MAX_VALUES.trainingModules} completed</p>
                  <p>📅 <b> Available </b>: ${
                    candidate.availability?.start || "TBD"
                  } to ${candidate.availability?.end || "TBD"}</p>
                  <p>🎓 <b>Certifications </b>: ${
                    (candidate.certifications || []).join(", ") || "None listed"
                  }</p>
                  <p>🏷️<b> Tags </b>: ${
                    (candidate.suitabilityTags || []).join(", ") ||
                    "None listed"
                  }</p>
              </div>
              <div class="score-circle score-${score.tier}">
                  ${score.totalScore}%
                  <span class="badge badge-${
                    score.tier
                  }">${score.tier.toUpperCase()}</span>
              </div>
          </div>
          
          <div class="score-breakdown">
              <div class="score-item">
                  <span>📅 Availability Match</span>
                  <strong>${Math.round(score.breakdown.availabilityMatch)}/${
        SCORING_WEIGHTS.employer.availabilityMatch
      }</strong>
              </div>
              <div class="score-item">
                  <span>💼 Relevant Experience</span>
                  <strong>${Math.round(score.breakdown.relevantExperience)}/${
        SCORING_WEIGHTS.employer.relevantExperience
      }</strong>
              </div>
              <div class="score-item">
                  <span>🎓 Certifications</span>
                  <strong>${Math.round(score.breakdown.certifications)}/${
        SCORING_WEIGHTS.employer.certifications
      }</strong>
              </div>
              <div class="score-item">
                  <span>🧠 Psychometric Skills</span>
                  <strong>${Math.round(score.breakdown.psychometricSkills)}/${
        SCORING_WEIGHTS.employer.psychometricSkills
      }</strong>
              </div>
              <div class="score-item">
                  <span>✅ Profile Completion</span>
                  <strong>${Math.round(score.breakdown.profileCompletion)}/${
        SCORING_WEIGHTS.employer.profileCompletion
      }</strong>
              </div>
              <div class="score-item">
                  <span>📚 Training Modules</span>
                  <strong>${Math.round(score.breakdown.trainingModules)}/${
        SCORING_WEIGHTS.employer.trainingModules
      }</strong>
              </div>
              <div class="score-item">
                  <span>🏷️ Suitability Tags</span>
                  <strong>${Math.round(score.breakdown.suitabilityTags)}/${
        SCORING_WEIGHTS.employer.suitabilityTags
      }</strong>
              </div>
          </div>
      </div>
  `
    )
    .join("");

  container.innerHTML = candidatesHtml;
}

function displayCandidateResults(candidate, results) {
  const container = document.getElementById("candidate-results");
  const sortedResults = results.sort(
    (a, b) => b.score.totalScore - a.score.totalScore
  );

  // Generate improvement suggestions for single candidate vs multiple jobs
  const overallImprovements = generateCandidateImprovements(candidate, results);

  const improvementSummaryHtml = overallImprovements.length > 0 ? `` : "";

  const jobsHtml = sortedResults
    .map(({ job, score }, index) => {
      const jobSpecificImprovements = generateJobSpecificImprovements(
        candidate,
        job,
        score
      );

      return `
      <div class="job-card">
          <div class="score-header">
              <div class="job-info">
                  <h3>${job.title || "Untitled Job"}
                      <span class="match-indicator ${getMatchIndicator(
                        score.totalScore
                      )}">${getMatchText(score.totalScore)}</span>
                  </h3>
                  <p>🏢<strong>Company Name</strong> : ${
                    job.company || "Unknown Company"
                  }</p>
                  <p>👤 <strong> Role </strong>: ${
                    job.role || "Not specified"
                  }</p>
                  <p>📅<strong> Job Dates </strong>: ${
                    job.dates?.start || "TBD"
                  } to ${job.dates?.end || "TBD"}</p>
                  <p>🎯 <strong> Required Experience:</strong> ${
                    job.requiredExperience || 1
                  } ${
        (job.requiredExperience || 1) === 1 ? "year" : "years"
      }</p>
                  <p>🎓<strong> Certifications </strong>:  ${
                    (job.requiredCertifications || []).join(", ") ||
                    "None specified"
                  }</p>
                  <p>🧠<strong>  Psychometric Score </strong>: ${
                    job.minimumPsychometricScore || 70
                  }%</p>
                  <p>📚 <strong> Training Modules </strong>: ${
                    job.requiredTrainingModules || 3
                  }</p>
                  <p>🏷️ <strong> Tags </strong>: ${
                    (job.suitabilityTags || []).join(", ") || "None specified"
                  }</p>
              </div>
              <div class="score-circle score-${score.tier}">
                  ${score.totalScore}%
                  <span class="badge badge-${
                    score.tier
                  }">${score.tier.toUpperCase()}</span>
              </div>
          </div>
          
          <div class="score-breakdown">
              <div class="score-item">
                  <span>📅 Availability Match</span>
                  <strong>${Math.round(score.breakdown.availabilityMatch)}/${
        SCORING_WEIGHTS.candidate.availabilityMatch
      }</strong>
              </div>
              <div class="score-item">
                  <span>💼 Relevant Experience</span>
                  <strong>${Math.round(score.breakdown.relevantExperience)}/${
        SCORING_WEIGHTS.candidate.relevantExperience
      }</strong>
              </div>
              <div class="score-item">
                  <span>🎓 Certifications</span>
                  <strong>${Math.round(score.breakdown.certifications)}/${
        SCORING_WEIGHTS.candidate.certifications
      }</strong>
              </div>
              <div class="score-item">
                  <span>🧠 Psychometric Skills</span>
                  <strong>${Math.round(score.breakdown.psychometricSkills)}/${
        SCORING_WEIGHTS.candidate.psychometricSkills
      }</strong>
              </div>
              <div class="score-item">
                  <span>✅ Profile Completion</span>
                  <strong>${Math.round(score.breakdown.profileCompletion)}/${
        SCORING_WEIGHTS.candidate.profileCompletion
      }</strong>
              </div>
              <div class="score-item">
                  <span>📚 Training Modules</span>
                  <strong>${Math.round(score.breakdown.trainingModules)}/${
        SCORING_WEIGHTS.candidate.trainingModules
      }</strong>
              </div>
              <div class="score-item">
                  <span>🏷️ Suitability Tags</span>
                  <strong>${Math.round(score.breakdown.suitabilityTags)}/${
        SCORING_WEIGHTS.candidate.suitabilityTags
      }</strong>
              </div>
          </div>

          ${
            jobSpecificImprovements.length > 0
              ? `
              <div class="job-specific-improvements">
                  <h4>💡 Specific improvements for this job:</h4>
                  <ul class="improvement-list">
                      ${jobSpecificImprovements
                        .map(
                          (imp) => `
                          <li class="improvement-item">
                              <strong>${imp.category}:</strong> ${imp.suggestion}
                              <span class="points-gain">+${imp.points} points</span>
                          </li>
                      `
                        )
                        .join("")}
                  </ul>
              </div>
          `
              : `
              <div class="perfect-match">
                  <h4>✅ Perfect match! You meet all requirements for this position.</h4>
              </div>
          `
          }
      </div>
  `;
    })
    .join("");

  container.innerHTML = improvementSummaryHtml + jobsHtml;
}

console.log("✅ Display.js loaded successfully");
