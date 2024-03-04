document.addEventListener('DOMContentLoaded', () => {
  const cancelButton = document.querySelector("#cancel-btn");
  const saveButton = document.querySelector("#save-btn");

  // Define a global array to hold exercise data
  // window.exerciseData = window.exerciseData || [];

  // Cancel button functionality
  cancelButton.addEventListener('click', () => {
    window.history.back();
    console.log('Cancel button clicked');
  });

  // Save button functionality
  saveButton.addEventListener('click', () => {
    const activityName = document.getElementById('activity_name').value;
    const hours = document.querySelector('#caret-up-hr + div').innerText;
    const minutes = document.querySelector('#caret-up-min + div').innerText;
    const seconds = document.querySelector('#caret-up-sec + div').innerText;
    const today = new Date().toLocaleDateString();

    // Assuming selectedIntensity is globally accessible and defined in the other JS file
    const intensity = window.getSelectedIntensity ? window.getSelectedIntensity() : 0;

    // Check for missing data
    if (!activityName || hours === "00" && minutes === "00" && seconds === "00" || intensity === 0) {
      alert("Please complete all required fields: Activity Name, Time, and Intensity.");
      return; // Stop the function from proceeding further
    }

    // Append data to the global array
    // window.exerciseData.push({
    //   activityName,
    //   hours,
    //   minutes,
    //   seconds,
    //   intensity
    // });

    // store data in the array
    let exerciseData = {
      activityName,
      hours,
      minutes,
      seconds,
      intensity,
      today
    };

    // Function to save exercise data
    function saveExerciseData(exerciseData) {
      // Get existing data
      const existingData = JSON.parse(localStorage.getItem('exerciseData')) || [];
      // Add new data
      existingData.push(exerciseData);
      // Save back to localStorage
      localStorage.setItem('exerciseData', JSON.stringify(existingData));
    }

    saveExerciseData(exerciseData);
    console.log('Save button clicked');
    console.log(`Activity Name: ${activityName}`);
    console.log(`Duration: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    console.log(`Intensity: ${intensity}`);
    console.log(`Date: ${today}`);
  });
});
