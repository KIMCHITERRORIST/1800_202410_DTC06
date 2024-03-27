async function fetchUserGender(uid) {
  gender = await db.collection('users').doc(uid).get().then(doc => {
    if (doc.exists) {
      return doc.data().gender;
    }
  })
}

async function fetchUserAge(uid) {
  gender = await db.collection('users').doc(uid).get().then(doc => {
    if (doc.exists) {
      return doc.data().age;
    }
  })
}

async function fetchUserWeight(uid) {
  gender = await db.collection('users').doc(uid).get().then(doc => {
    if (doc.exists) {
      return doc.data().weight;
    }
  })
}

async function saveActivity() {
  const uid = await fetchUID();
  const activityName = document.getElementById('activity_name').value.trim();
  const hour = document.getElementById('hour').value.trim();
  const minute = document.getElementById('minute').value.trim();
  const second = document.getElementById('second').value.trim();
  const heartrate = document.getElementById('heart_rate').value.trim();


  if (!activityName || !hour || !minute || !second || !heartrate) {
    alert("Please fill out all fields: activity name, hour, minute, second, and heart rate.");
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
      heartrate: heartrate,
      duration: {
        hour: hour,
        minute: minute,
        second: second
      },
      caloriesBurned: calculateCaloriesBurned(uid, activityName, hour, minute, second, heartrate)
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

// Calculate calories burned
function calculateCaloriesBurned(uid, hour, minute, second, heartrate) {
  let caloriesBurned = 0;
  const userGender = fetchUserGender(uid);
  const userAge = fetchUserAge(uid);
  const userWeight = fetchUserWeight(uid);

  if (userGender === "female") {
    caloriesBurned = ((hour * 60) + minute + (second / 60)) * ((-20.4022 + (0.4472 * heartrate) - (0.1263 * userWeight) + (0.074 * userAge)) / 4.184);
  } else if (userGender === "male") {
    caloriesBurned = ((hour * 60) + minute + (second / 60)) * ((-55.0969 + (0.6309 * heartrate) - (0.1988 * userWeight) + (0.2017 * userAge)) / 4.184);
  }

  return caloriesBurned;
}


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