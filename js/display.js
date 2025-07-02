// Display functions
function displayEmployerResults(job, results) {
  const container = document.getElementById("employer-results");
  const sortedResults = results.sort(
    (a, b) => b.score.totalScore - a.score.totalScore
  );

  // Calculate statistics
  const averageScore = Math.round(
    results.reduce((sum, r) => sum + r.score.totalScore, 0) / results.length
  );
  const goldCount = results.filter((r) => r.score.tier === "gold").length;
  const silverCount = results.filter((r) => r.score.tier === "silver").length;
  const bronzeCount = results.filter((r) => r.score.tier === "bronze").length;

  const summaryHtml = `
        <div class="candidate-card" style="border-left: 5px solid #28a745; margin-bottom: 30px;">
            <h3>📊 Scoring Results Summary</h3>
            <div class="score-breakdown">
                <div class="score-item">
                    <span>📋 Job Title</span>
                    <strong>${job.title || "Untitled Job"}</strong>
                </div>
                <div class="score-item">
                    <span>👥 Total Candidates</span>
                    <strong>${results.length}</strong>
                </div>
                <div class="score-item">
                    <span>📈 Average Score</span>
                    <strong>${averageScore}%</strong>
                </div>
                <div class="score-item">
                    <span>🥇 Gold Tier</span>
                    <strong>${goldCount} candidates</strong>
                </div>
                <div class="score-item">
                    <span>🥈 Silver Tier</span>
                    <strong>${silverCount} candidates</strong>
                </div>
                <div class="score-item">
                    <span>🥉 Bronze Tier</span>
                    <strong>${bronzeCount} candidates</strong>
                </div>
            </div>
        </div>
    `;

  const candidatesHtml = sortedResults
    .map(
      ({ candidate, score, improvements }, index) => `
        <div class="candidate-card">
            <div class="score-header">
                <div class="candidate-info">
                    <h3>${candidate.name || "Unnamed Candidate"} 
                        <span class="match-indicator ${getMatchIndicator(
                          score.totalScore
                        )}">${getMatchText(score.totalScore)}</span>
                    </h3>
                    <p>📧 ${candidate.email || "No email provided"}</p>
                    <p>📞 ${candidate.phone || "No phone provided"}</p>
                    <p>🎯 Experience: ${candidate.experience || 0} years</p>
                    <p>🏆 Psychometric Score: ${
                      candidate.psychometricScore || "Not tested"
                    }${candidate.psychometricScore ? "%" : ""}</p>
                    <p>📚 Training Modules: ${candidate.trainingModules || 0}/${
        MAX_VALUES.trainingModules
      } completed</p>
                    <p>📅 Available: ${
                      candidate.availability?.start || "TBD"
                    } to ${candidate.availability?.end || "TBD"}</p>
                    ${
                      candidate.certifications &&
                      candidate.certifications.length > 0
                        ? `<p>🎓 Certifications: ${candidate.certifications.join(
                            ", "
                          )}</p>`
                        : "<p>🎓 No certifications listed</p>"
                    }
                    ${
                      candidate.suitabilityTags &&
                      candidate.suitabilityTags.length > 0
                        ? `<p>🏷️ Tags: ${candidate.suitabilityTags.join(
                            ", "
                          )}</p>`
                        : "<p>🏷️ No suitability tags</p>"
                    }
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
                    <span>💼 Experience</span>
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
                    <span>🧠 Soft Skills</span>
                    <strong>${Math.round(score.breakdown.psychometricSkills)}/${
        SCORING_WEIGHTS.employer.psychometricSkills
      }</strong>
                </div>
                <div class="score-item">
                    <span>✅ Profile Complete</span>
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
            
            ${
              improvements.length > 0
                ? `
                <div class="improvement-guide">
                    <h4>🚀 How this candidate can improve their score:</h4>
                    <ul class="improvement-steps">
                        ${improvements
                          .slice(0, 3)
                          .map(
                            (improvement) => `
                            <li>
                                <strong>${improvement.category}:</strong> ${improvement.suggestion}
                                <br><small>Potential gain: +${improvement.points} points (${improvement.impact} impact)</small>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    ${
                      score.totalScore < 60
                        ? `
                        <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px; border-left: 3px solid #ffc107;">
                            <strong>💡 Recommendation:</strong> Focus on "High" and "Medium" impact improvements first to maximize score gain!
                        </div>
                    `
                        : `
                        <div style="margin-top: 10px; padding: 10px; background: #d4edda; border-radius: 5px; border-left: 3px solid #28a745;">
                            <strong>✅ Great candidate!</strong> This person is well-suited for your position.
                        </div>
                    `
                    }
                </div>
            `
                : `
                <div class="improvement-guide" style="background: #d4edda; border-left: 4px solid #28a745;">
                    <h4>✅ Perfect match! This candidate is ideal for your position.</h4>
                    <p>This candidate meets all your requirements exceptionally well. Consider fast-tracking their application!</p>
                </div>
            `
            }
        </div>
    `
    )
    .join("");

  container.innerHTML = summaryHtml + candidatesHtml;
}

function displayCandidateResults(candidate, results) {
  const container = document.getElementById("candidate-results");
  const sortedResults = results.sort(
    (a, b) => b.score.totalScore - a.score.totalScore
  );

  // Calculate statistics
  const averageScore = Math.round(
    results.reduce((sum, r) => sum + r.score.totalScore, 0) / results.length
  );
  const excellentMatches = results.filter(
    (r) => r.score.totalScore >= 80
  ).length;
  const goodMatches = results.filter(
    (r) => r.score.totalScore >= 60 && r.score.totalScore < 80
  ).length;
  const fairMatches = results.filter(
    (r) => r.score.totalScore >= 40 && r.score.totalScore < 60
  ).length;
  const poorMatches = results.filter((r) => r.score.totalScore < 40).length;

  const summaryHtml = `
        <div class="candidate-card" style="border-left: 5px solid #17a2b8; margin-bottom: 30px;">
            <h3>🎯 Job Match Results for ${candidate.name || "You"}</h3>
            <div class="score-breakdown">
                <div class="score-item">
                    <span>💼 Total Jobs Analyzed</span>
                    <strong>${results.length}</strong>
                </div>
                <div class="score-item">
                    <span>📊 Average Match</span>
                    <strong>${averageScore}%</strong>
                </div>
                <div class="score-item">
                    <span>🌟 Excellent Matches (80%+)</span>
                    <strong>${excellentMatches} jobs</strong>
                </div>
                <div class="score-item">
                    <span>👍 Good Matches (60-79%)</span>
                    <strong>${goodMatches} jobs</strong>
                </div>
                <div class="score-item">
                    <span>⚠️ Fair Matches (40-59%)</span>
                    <strong>${fairMatches} jobs</strong>
                </div>
                <div class="score-item">
                    <span>❌ Poor Matches (<40%)</span>
                    <strong>${poorMatches} jobs</strong>
                </div>
            </div>
        </div>
    `;

  const jobsHtml = sortedResults
    .map(
      ({ job, score, improvements }, index) => `
        <div class="job-card">
            <div class="score-header">
                <div class="job-info">
                    <h3>${job.title || "Untitled Job"}
                        <span class="match-indicator ${getMatchIndicator(
                          score.totalScore
                        )}">${getMatchText(score.totalScore)}</span>
                    </h3>
                    <p>🏢 ${job.company || "Unknown Company"}</p>
                    <p>👤 Role: ${job.role || "Not specified"}</p>
                    <p>📍 Location: ${job.location || "Location TBD"}</p>
                    <p>💰 Pay: £${job.pay || 0}/week</p>
                    <p>🏠 Accommodation: ${job.accommodation || "TBD"}</p>
                    <p>📅 Dates: ${job.dates?.start || "TBD"} to ${
        job.dates?.end || "TBD"
      }</p>
                    <p>🛂 Visa Sponsorship: ${
                      job.visaSponsorship ? "Yes" : "No"
                    }</p>
                    ${
                      job.requiredCertifications &&
                      job.requiredCertifications.length > 0
                        ? `<p>🎓 Required Certs: ${job.requiredCertifications.join(
                            ", "
                          )}</p>`
                        : "<p>🎓 No specific certifications required</p>"
                    }
                    ${
                      job.suitabilityTags && job.suitabilityTags.length > 0
                        ? `<p>🏷️ Tags: ${job.suitabilityTags.join(", ")}</p>`
                        : "<p>🏷️ No specific tags</p>"
                    }
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
                    <span>📅 Date Match</span>
                    <strong>${Math.round(score.breakdown.dateMatch)}/${
        SCORING_WEIGHTS.candidate.dateMatch
      }</strong>
                </div>
                <div class="score-item">
                    <span>💼 Role Preference</span>
                    <strong>${Math.round(score.breakdown.rolePreference)}/${
        SCORING_WEIGHTS.candidate.rolePreference
      }</strong>
                </div>
                <div class="score-item">
                    <span>📍 Location Match</span>
                    <strong>${Math.round(score.breakdown.locationMatch)}/${
        SCORING_WEIGHTS.candidate.locationMatch
      }</strong>
                </div>
                <div class="score-item">
                    <span>🏠 Accommodation</span>
                    <strong>${Math.round(score.breakdown.accommodationMatch)}/${
        SCORING_WEIGHTS.candidate.accommodationMatch
      }</strong>
                </div>
                <div class="score-item">
                    <span>💰 Pay Match</span>
                    <strong>${Math.round(score.breakdown.payMatch)}/${
        SCORING_WEIGHTS.candidate.payMatch
      }</strong>
                </div>
                <div class="score-item">
                    <span>🛂 Visa Eligibility</span>
                    <strong>${Math.round(score.breakdown.visaEligibility)}/${
        SCORING_WEIGHTS.candidate.visaEligibility
      }</strong>
                </div>
                <div class="score-item">
                    <span>🎓 Required Certifications</span>
                    <strong>${Math.round(
                      score.breakdown.requiredCertifications
                    )}/${
        SCORING_WEIGHTS.candidate.requiredCertifications
      }</strong>
                </div>
            </div>
            
            ${
              improvements.length > 0
                ? `
                <div class="improvement-guide">
                    <h4>🚀 How to improve your match score for this job:</h4>
                    <ul class="improvement-steps">
                        ${improvements
                          .slice(0, 3)
                          .map(
                            (improvement) => `
                            <li>
                                <strong>${improvement.category}:</strong> ${improvement.suggestion}
                                <br><small>Potential gain: +${improvement.points} points (${improvement.impact} impact)</small>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    ${
                      score.totalScore < 60
                        ? `
                        <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px; border-left: 3px solid #ffc107;">
                            <strong>💡 Pro Tip:</strong> Focus on the "High" and "Medium" impact improvements first to maximize your score gain!
                        </div>
                    `
                        : score.totalScore >= 80
                        ? `
                        <div style="margin-top: 10px; padding: 10px; background: #d4edda; border-radius: 5px; border-left: 3px solid #28a745;">
                            <strong>🎉 Excellent match!</strong> This job aligns perfectly with your profile. Apply now!
                        </div>
                    `
                        : `
                        <div style="margin-top: 10px; padding: 10px; background: #d1ecf1; border-radius: 5px; border-left: 3px solid #17a2b8;">
                            <strong>👍 Good match!</strong> Consider making the suggested improvements to increase your chances.
                        </div>
                    `
                    }
                </div>
            `
                : `
                <div class="improvement-guide" style="background: #d4edda; border-left: 4px solid #28a745;">
                    <h4>✅ Perfect match! You're ideal for this position.</h4>
                    <p>This job aligns perfectly with your profile. Consider applying as soon as possible!</p>
                </div>
            `
            }
        </div>
    `
    )
    .join("");

  // Add overall profile improvement suggestions
  const overallImprovements = generateOverallProfileImprovements(
    candidate,
    results
  );
  const profileSuggestions =
    overallImprovements.length > 0
      ? `
        <div class="candidate-card" style="border-left: 5px solid #6f42c1; margin-bottom: 20px;">
            <h3>🎯 Overall Profile Improvement Recommendations</h3>
            <p>Based on your matches across all jobs, here are the top ways to improve your overall appeal:</p>
            <div class="improvement-guide">
                <h4>🚀 Priority Actions:</h4>
                <ul class="improvement-steps">
                    ${overallImprovements
                      .slice(0, 5)
                      .map(
                        (improvement) => `
                        <li>
                            <strong>${improvement.category}:</strong> ${improvement.suggestion}
                            <br><small>This appears as an issue in ${improvement.frequency} of your job matches</small>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
        </div>
    `
      : "";

  container.innerHTML = summaryHtml + profileSuggestions + jobsHtml;
}
