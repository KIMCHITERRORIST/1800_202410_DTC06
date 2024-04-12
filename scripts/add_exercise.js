/**Fetch user UID from firebase
 * @returns {Promise<string>} - Returns the user ID
 */
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

// Function to add an exercise to the Exercises collection

async function saveActivity() {
  const uid = await fetchUID();
  const activityName = document.getElementById('activity_name').value.trim();
  const hour = document.getElementById('hour').value.trim();
  const minute = document.getElementById('minute').value.trim();
  const second = document.getElementById('second').value.trim();
  const heartrate = document.getElementById('heart_rate').value.trim();

  // check if the user has entered all the required fields or alert the user to do so
  if (!activityName || !hour || !minute || !second || !heartrate) {
    alert("Please fill out all fields: activity name, hour, minute, second, and heart rate.");
    return;
  }


  try {
    // Get the current date and time and format in YYYY-MM-DD and HH:MM AM/PM
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
      heartrate: Number(heartrate),
      duration: {
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second)
      },
      caloriesBurned: await calculateCaloriesBurned(uid, hour, minute, second, heartrate)
    };

    // Save the data in database
    await db.collection('exercises').doc(uid).collection('dailyActivities').add(activityData);
    window.location.href = 'exercise_log.html';
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

// Function to calculate calories burned
/**calculate calories burned 
 * @param {string} uid - User ID
 * @param {number} hour - Duration in hours
 * @param {number} minute - Duration in minutes
 * @param {number} second - Duration in seconds
 * @param {number} heartrate - Heart rate
 * @returns {number} - Returns the calculated calories burned
 * */
async function calculateCaloriesBurned(uid, hour, minute, second, heartrate) {
  let caloriesBurned = 0;
  const userData = await db.collection('users').doc(uid).get();
  const gender = userData.data().gender;
  const age = userData.data().age;
  const weight = userData.data().weight;
  const timeInMinutes = (Number(hour) * 60) + Number(minute) + (Number(second) / 60);

  // Calculate calories burnt according to gender
  if (gender === "Female") {
    caloriesBurned = Number(timeInMinutes * ((-10 + (0.45 * Number(heartrate)) - (0.1263 * weight) + (0.075 * age)) / 4.184));
  } else if (gender === "Male") {
    caloriesBurned = Number(timeInMinutes * ((-25 + (0.635 * Number(heartrate)) - (0.1988 * weight) + (0.202 * age)) / 4.184));
  }
  return Math.round(caloriesBurned);
}
