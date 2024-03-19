// Fetch UID function
async function fetchUID() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user.uid);
      } else {
        reject(("User is not logged in")
          (window.location.href = "login.html"))
      }
    });
  });
}


async function saveActivity() {
  const uid = await fetchUID();
  const activityName = document.getElementById('activity_name').value.trim();
  const hour = document.getElementById('hour').value.trim();
  const minute = document.getElementById('minute').value.trim();
  const second = document.getElementById('second').value.trim();

  // Check if any of the fields are empty
  if (!activityName || !hour || !minute || !second) {
    alert("Please fill out all fields: activity name, hour, minute, and second.");
    return; // Stop the function execution here
  }

  try {
    // Formatting the current date for the timestamp to store in database
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const formattedTimeHHMM = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
    const formattedTimeHHMMSS = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;

    // Creating an array with the formatted date and time
    const customTimestamp = [formattedDate, formattedTimeHHMM];

    // Save the data in database
    console.log(uid);
    await db.collection('exercises').doc(uid).collection('dailyActivities').doc(formattedDate).collection(activityName).doc(formattedTimeHHMMSS).set({
      name: activityName,
      hour: hour,
      min: minute,
      sec: second,
      timeCreated: customTimestamp
    });

    console.log('Activity saved successfully');
  } catch (error) {
    console.error('Error saving activity: ', error);
  }
}




document.getElementById('save').addEventListener('click', saveActivity);

// Go back to the previous page when clicking cancel
document.getElementById('cancel').addEventListener('click', () => {
  window.history.back();
});
