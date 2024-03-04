document.addEventListener('DOMContentLoaded', () => {
  const cancelButton = document.querySelector("#cancel-btn");
  const saveButton = document.querySelector("#save-btn");

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

    // Assuming selectedIntensity is globally accessible and defined in the other JS file
    const intensity = window.getSelectedIntensity ? window.getSelectedIntensity() : 0;

    console.log(`Intensity: ${intensity}`);
    console.log(`Activity Name: ${activityName}`);
    console.log(`Duration: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    console.log(`Intensity: ${intensity}`);
  });
});
