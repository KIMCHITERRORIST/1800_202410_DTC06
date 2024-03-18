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


async function saveActivity() {
  try {
    const uid = await fetchUID();
    const activityName = document.getElementById('activity_name').value;
    const hour = document.getElementById('hour').value;
    const minute = document.getElementById('minute').value;
    const second = document.getElementById('second').value;

    // Formatting the current date
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const formattedTime = today.getHours().toString().padStart(2, '0') + today.getMinutes().toString().padStart(2, '0'); // hhmm

    // Save the data in Firestore
    await db.collection('exercises').doc(uid).collection('dailyActivities').doc(formattedDate).collection(activityName).doc(formattedTime).set({
      name: activityName,
      hour: hour,
      min: minute,
      sec: second,
      timeCreated: firebase.firestore.FieldValue.serverTimestamp()
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
