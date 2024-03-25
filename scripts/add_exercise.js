async function saveActivity() {
  const uid = await fetchUID();
  const activityName = document.getElementById('activity_name').value.trim();
  const hour = document.getElementById('hour').value.trim();
  const minute = document.getElementById('minute').value.trim();
  const second = document.getElementById('second').value.trim();


  if (!activityName || !hour || !minute || !second) {
    alert("Please fill out all fields: activity name, hour, minute, and second.");
    return;
  }

  try {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${((hours + 11) % 12 + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    // Prepare the data object to save in database
    const activityData = {
      date: formattedDate,
      time: formattedTime,
      name: activityName,
      duration: {
        hour: hour,
        minute: minute,
        second: second
      }
    };

    // Save the data in database
    await db.collection('exercises').doc(uid).collection('dailyActivities').add(activityData);

    console.log('Activity saved successfully');
  } catch (error) {
    console.error('Error saving activity: ', error);
  }
}

// Event listener for the save button
document.getElementById('save').addEventListener('click', saveActivity);

// Go back to the previous page when clicking cancel
document.getElementById('cancel').addEventListener('click', () => {
  window.history.back();
});

// Fetch UID function
async function fetchUID() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user.uid);
      } else {
        reject('User is not logged in.');
      }
    });
  });
}