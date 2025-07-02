// File upload functions
function loadJobFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Validate JSON before setting
                JSON.parse(e.target.result);
                document.getElementById('job-data').value = e.target.result;
            } catch (error) {
                alert('Invalid JSON file. Please check the file format.');
                event.target.value = ''; // Clear the file input
            }
        };
        reader.readAsText(file);
    }
}

function loadCandidateFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Validate JSON before setting
                JSON.parse(e.target.result);
                document.getElementById('candidate-data').value = e.target.result;
            } catch (error) {
                alert('Invalid JSON file. Please check the file format.');
                event.target.value = ''; // Clear the file input
            }
        };
        reader.readAsText(file);
    }
}

function loadProfileFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Validate JSON before setting
                JSON.parse(e.target.result);
                document.getElementById('candidate-profile').value = e.target.result;
            } catch (error) {
                alert('Invalid JSON file. Please check the file format.');
                event.target.value = ''; // Clear the file input
            }
        };
        reader.readAsText(file);
    }
}

function loadJobProfileFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Validate JSON before setting
                JSON.parse(e.target.result);
                document.getElementById('job-profile').value = e.target.result;
            } catch (error) {
                alert('Invalid JSON file. Please check the file format.');
                event.target.value = ''; // Clear the file input
            }
        };
        reader.readAsText(file);
    }
}