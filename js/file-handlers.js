// File upload and handling functions

function loadBulkCandidatesFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) {
          throw new Error("File must contain an array of candidates");
        }
        document.getElementById("bulk-candidates-data").value = e.target.result;
      } catch (error) {
        alert("Invalid JSON file. Please check the file format.");
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }
}

function loadBulkJobsFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) {
          throw new Error("File must contain an array of jobs");
        }
        document.getElementById("bulk-jobs-data").value = e.target.result;
      } catch (error) {
        alert("Invalid JSON file. Please check the file format.");
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }
}

function loadJobFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        JSON.parse(e.target.result);
        document.getElementById("job-data").value = e.target.result;
      } catch (error) {
        alert("Invalid JSON file. Please check the file format.");
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }
}

function loadCandidateFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        JSON.parse(e.target.result);
        document.getElementById("candidate-data").value = e.target.result;
      } catch (error) {
        alert("Invalid JSON file. Please check the file format.");
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }
}

function loadProfileFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        JSON.parse(e.target.result);
        document.getElementById("candidate-profile").value = e.target.result;
      } catch (error) {
        alert("Invalid JSON file. Please check the file format.");
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }
}

function loadJobProfileFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        JSON.parse(e.target.result);
        document.getElementById("job-profile").value = e.target.result;
      } catch (error) {
        alert("Invalid JSON file. Please check the file format.");
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }
}

console.log("✅ File-handlers.js loaded successfully");
